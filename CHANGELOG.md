# Changelog

All notable changes to the Pragmatik theme are documented here.

## [0.2.0] - 2026-10-20

### Changed

- Light themes: darker, more saturated syntax colors. Code tokens now reach
  at least 7:1 contrast against the editor background, and comments reach 5.5:1.
- Light themes: syntax hues are more saturated and further apart. Numbers and
  constants are now magenta. Macros and attributes are now amber-brown.
- Dark themes: the same treatment. Syntax hues are more saturated and further
  apart, and code tokens reach 8:1 contrast. Numbers and constants are now
  magenta, macros and attributes are gold, and comments are lighter (5.5:1).
- Light themes: editor and terminal background is now `#fcfaf5`.
- Light themes: darker line numbers, muted text, and terminal ANSI colors.
- Updated light and dark preview images.

### Added

- `samples/` folder with short programs in 11 languages for checking the
  palette. The launch configuration opens it in the Extension Development Host.

## [0.1.0] - 2026-07-09

### Added

- Initial release, ported from the Pragmatik theme for Zed.
- Six variants: `Pragmatik Light`, `Pragmatik Dark`, and Bold / Italic keyword
  treatments of each.
- Warm sepia light palette and neutral near-black dark palette.
- Full workbench, syntax (TextMate), and semantic-token coloring.
- Terminal ANSI palette matching the editor colors.
