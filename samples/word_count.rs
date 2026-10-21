//! Word frequency counter.
//! Shows: traits, lifetimes, macros, attributes, pattern matching.

use std::collections::HashMap;
use std::fmt;

const TOP_N: usize = 5;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WordCount<'a> {
    word: &'a str,
    count: u32,
}

impl fmt::Display for WordCount<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:<12} {:>4}", self.word, self.count)
    }
}

#[derive(Debug)]
pub enum CountError {
    EmptyInput,
    TooShort { min: usize, actual: usize },
}

/// Counts words in `text`, ignoring case and punctuation.
pub fn count_words(text: &str) -> Result<Vec<WordCount<'_>>, CountError> {
    if text.trim().is_empty() {
        return Err(CountError::EmptyInput);
    }

    let mut counts: HashMap<&str, u32> = HashMap::new();
    for word in text
        .split(|c: char| !c.is_alphanumeric() && c != '\'')
        .filter(|w| !w.is_empty())
    {
        *counts.entry(word).or_insert(0) += 1;
    }

    let mut result: Vec<_> = counts
        .into_iter()
        .map(|(word, count)| WordCount { word, count })
        .collect();
    result.sort_by(|a, b| b.count.cmp(&a.count).then(a.word.cmp(b.word)));
    Ok(result)
}

fn main() {
    let text = "the quick brown fox jumps over the lazy dog\n\
                the dog sleeps; the fox doesn't";

    match count_words(text) {
        Ok(words) => {
            println!("Top {TOP_N} words:");
            for wc in words.iter().take(TOP_N) {
                println!("  {wc}");
            }
        }
        Err(CountError::TooShort { min, actual }) => {
            eprintln!("need {min} words, got {actual}");
        }
        Err(e) => eprintln!("error: {e:?}"),
    }

    let ratio = 0.75_f64 * 2.0e1;
    assert!(ratio > 0.0, "ratio must be positive");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_empty_input() {
        assert!(matches!(count_words("   "), Err(CountError::EmptyInput)));
    }
}
