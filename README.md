# Pragmatik — a VS Code theme

A pair of themes with a warm **sepia light** mode and a **neutral near-black dark** mode, and a syntax palette that favors readability (purple keywords, blue types, green strings, amber numbers, rust-orange functions, taupe italic comments).

This is the VS Code port of the [Pragmatik theme for Zed](https://github.com/charathram/pragmatik-zed-theme); the two share the same palette so the editors look identical.

## Preview

| Light | Dark |
| --- | --- |
| ![Pragmatik Light](https://raw.githubusercontent.com/charathram/pragmatik-vscode-theme/main/images/pragmatik-light.png) | ![Pragmatik Dark](https://raw.githubusercontent.com/charathram/pragmatik-vscode-theme/main/images/pragmatik-dark.png) |

*A TypeScript file shown in the **Italic** keyword variant.*

## Variants

Six variants ship in the family — light and dark for each keyword treatment:

| Variant | Keyword style |
| --- | --- |
| **Pragmatik Light** / **Pragmatik Dark** | plain (color only) |
| **Pragmatik Light Bold** / **Pragmatik Dark Bold** | `font-weight: bold` |
| **Pragmatik Light Italic** / **Pragmatik Dark Italic** | `font-style: italic` |

Everything else — backgrounds, the full syntax palette, active-line highlight, terminal ANSI colors — is identical across all six; only the `keyword` treatment differs.

## Install

Not on the VS Code Marketplace yet — install from the packaged `.vsix`:

1. Download `pragmatik.vsix` from the [latest release](https://github.com/charathram/pragmatik-vscode-theme/releases/latest).
2. Install it from the command line (from wherever you downloaded it):

   ```bash
   code --install-extension pragmatik.vsix
   ```

   (Or, in VS Code: **Extensions** view → the **⋯** menu → **Install from VSIX…**)
3. Pick a variant with **Preferences: Color Theme** (`cmd-k cmd-t` / `ctrl-k ctrl-t`) → choose a **Pragmatik** variant.

To follow your system light/dark automatically, in `settings.json`:

```json
"window.autoDetectColorScheme": true,
"workbench.preferredLightColorTheme": "Pragmatik Light Italic",
"workbench.preferredDarkColorTheme": "Pragmatik Dark Italic"
```

## Develop locally

1. Open this folder in VS Code.
2. Press `F5` to launch an **Extension Development Host** with the theme loaded (the "Run Pragmatik theme" configuration).
3. In that window, pick a **Pragmatik** variant via **Preferences: Color Theme**. Editing a file under `themes/` hot-reloads the colors live.

The theme files under `themes/` are generated. Edit the palette in
[`scripts/build-themes.js`](scripts/build-themes.js) and regenerate:

```bash
npm run build
```

Package a `.vsix` locally with:

```bash
npx --yes @vscode/vsce package --no-dependencies
```

## License

[MIT](LICENSE)
