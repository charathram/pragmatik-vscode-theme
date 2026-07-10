# Pragmatik — a VS Code theme

A pair of themes with a warm **sepia light** mode and a **neutral near-black dark** mode, and a syntax palette that favors readability (purple keywords, blue types, green strings, amber numbers, rust-orange functions, taupe italic comments).

This is the VS Code port of the [Pragmatik theme for Zed](https://github.com/charathram/pragmatik-zed-theme); the two share the same palette so the editors look identical.

Six variants ship in the family — light and dark for each keyword treatment:

| Variant | Keyword style |
| --- | --- |
| **Pragmatik Light** / **Pragmatik Dark** | plain (color only) |
| **Pragmatik Light Bold** / **Pragmatik Dark Bold** | `font-weight: bold` |
| **Pragmatik Light Italic** / **Pragmatik Dark Italic** | `font-style: italic` |

Everything else — backgrounds, the full syntax palette, active-line highlight, terminal ANSI colors — is identical across all six; only the `keyword` treatment differs.

## Install

Once published to the VS Code Marketplace:

1. Open the Extensions view (`cmd-shift-x` / `ctrl-shift-x`)
2. Search for **Pragmatik** and install
3. Pick a variant with **Preferences: Color Theme** (`cmd-k cmd-t` / `ctrl-k ctrl-t`)

To follow your system light/dark automatically, in `settings.json`:

```json
"window.autoDetectColorScheme": true,
"workbench.preferredLightColorTheme": "Pragmatik Light Italic",
"workbench.preferredDarkColorTheme": "Pragmatik Dark Italic"
```

## Develop locally

1. Open this folder in VS Code
2. Press `F5` to launch an Extension Development Host
3. In the new window, pick a **Pragmatik** variant via **Preferences: Color Theme**

The theme files under `themes/` are generated. Edit the palette in
[`scripts/build-themes.js`](scripts/build-themes.js) and regenerate:

```bash
npm run build
```

## License

[MIT](LICENSE)
