/**
 * Token-bucket rate limiter.
 * Shows: interfaces, generics, enums, decorators, type guards, async.
 */

export enum Decision {
  Allow = "allow",
  Deny = "deny",
}

export interface BucketOptions {
  readonly capacity: number;
  readonly refillPerSecond: number;
  clock?: () => number;
}

type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function logged(_target: object, key: string, descriptor: PropertyDescriptor): void {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    const out = original.apply(this, args);
    console.debug(`${key}(${args.join(", ")}) -> ${String(out)}`);
    return out;
  };
}

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly clock: () => number;

  constructor(private readonly options: BucketOptions) {
    this.clock = options.clock ?? Date.now;
    this.tokens = options.capacity;
    this.lastRefill = this.clock();
  }

  @logged
  take(cost = 1): Decision {
    this.refill();
    if (this.tokens >= cost) {
      this.tokens -= cost;
      return Decision.Allow;
    }
    return Decision.Deny;
  }

  private refill(): void {
    const now = this.clock();
    const elapsed = (now - this.lastRefill) / 1_000;
    this.tokens = Math.min(this.options.capacity, this.tokens + elapsed * this.options.refillPerSecond);
    this.lastRefill = now;
  }
}

export function isOk<T, E>(r: Result<T, E>): r is { ok: true; value: T } {
  return r.ok;
}

export async function withLimit<T>(bucket: TokenBucket, task: () => Promise<T>): Promise<Result<T>> {
  if (bucket.take() === Decision.Deny) {
    return { ok: false, error: new Error("rate limit exceeded") };
  }
  try {
    return { ok: true, value: await task() };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

const bucket = new TokenBucket({ capacity: 3, refillPerSecond: 0.5 });
const results = await Promise.all(
  Array.from({ length: 5 }, (_, i) => withLimit(bucket, async () => i * 2)),
);
console.log(results.filter(isOk).map((r) => r.value));
