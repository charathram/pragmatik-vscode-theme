// Command healthcheck polls a list of URLs and reports their status.
// Shows: structs with tags, interfaces, goroutines, channels, defer, errors.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

const (
	defaultTimeout = 3 * time.Second
	maxWorkers     = 4
)

var ErrUnhealthy = errors.New("service unhealthy")

type Result struct {
	URL      string        `json:"url"`
	Status   int           `json:"status"`
	Latency  time.Duration `json:"latency_ms"`
	Healthy  bool          `json:"healthy"`
	ErrorMsg string        `json:"error,omitempty"`
}

type Checker interface {
	Check(ctx context.Context, url string) Result
}

type httpChecker struct {
	client *http.Client
}

func (c httpChecker) Check(ctx context.Context, url string) Result {
	start := time.Now()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return Result{URL: url, ErrorMsg: err.Error()}
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return Result{URL: url, ErrorMsg: fmt.Errorf("%w: %v", ErrUnhealthy, err).Error()}
	}
	defer resp.Body.Close()

	return Result{
		URL:     url,
		Status:  resp.StatusCode,
		Latency: time.Since(start) / time.Millisecond,
		Healthy: resp.StatusCode >= 200 && resp.StatusCode < 300,
	}
}

func checkAll(ctx context.Context, c Checker, urls []string) []Result {
	jobs := make(chan string)
	results := make(chan Result, len(urls))
	var wg sync.WaitGroup

	for i := 0; i < maxWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for u := range jobs {
				results <- c.Check(ctx, u)
			}
		}()
	}

	for _, u := range urls {
		jobs <- u
	}
	close(jobs)
	wg.Wait()
	close(results)

	out := make([]Result, 0, len(urls))
	for r := range results {
		out = append(out, r)
	}
	return out
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), defaultTimeout)
	defer cancel()

	urls := []string{"https://example.com", "https://example.org/health"}
	checker := httpChecker{client: &http.Client{Timeout: defaultTimeout}}

	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	if err := enc.Encode(checkAll(ctx, checker, urls)); err != nil {
		fmt.Fprintf(os.Stderr, "encode failed: %v\n", err)
		os.Exit(1)
	}
}
