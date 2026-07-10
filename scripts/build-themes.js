#!/usr/bin/env node
"use strict";

/**
 * Build script for the Pragmatik VS Code theme family.
 *
 * A single warm-sepia light palette and a neutral near-black dark palette are
 * defined once, then emitted as six theme files — light and dark for each
 * keyword treatment (plain, bold, italic). Everything except the `keyword`
 * font style is identical across the three treatments of a given appearance,
 * mirroring the upstream Zed theme (pragmatik-zed-theme).
 *
 * Run: `npm run build` (or `node scripts/build-themes.js`).
 */

const fs = require("fs");
const path = require("path");

const THEMES_DIR = path.join(__dirname, "..", "themes");

// ---------------------------------------------------------------------------
// Palettes. Values are lifted directly from the Zed theme so the two editors
// render the same colors.
// ---------------------------------------------------------------------------

const light = {
  // Surfaces
  bg: "#f3eee1", // sidebar / activity bar / panels (warm sepia)
  bgEditor: "#fbf9f3", // editor / terminal (lighter sepia)
  bgElevated: "#faf4e8", // popups, hover cards, menus
  bgInput: "#fbf9f3",
  border: "#e6e2d6",
  borderVariant: "#ded9ca",

  // Text
  text: "#1a1a1a",
  textMuted: "#555049",
  textPlaceholder: "#8a8478",
  textDisabled: "#a9a394",

  // Accent (rust orange)
  accent: "#b7410e",
  accentContrast: "#fbf9f3", // readable text on the accent
  accentSubtle: "#b7410e26",
  focusBorder: "#b7410e66",

  // Editor chrome
  lineNumber: "#c2bba9",
  lineNumberActive: "#1a1a1a",
  activeLine: "#00000014",
  invisible: "#c2bba9",
  wrapGuide: "#00000010",
  wrapGuideActive: "#00000020",
  selection: "#b7410e33",
  selectionInactive: "#b7410e1f",
  cursor: "#b7410e",
  highlightRead: "#b7410e1f",
  highlightWrite: "#b7410e33",
  searchMatch: "#b76b0166",
  searchMatchHighlight: "#b76b0140",

  // Interactive element states
  hover: "#00000010",
  active: "#0000001a",
  selectedElement: "#f3e6df",

  scrollThumb: "#5550491f",
  scrollThumbHover: "#55504933",
  scrollThumbActive: "#55504955",

  // Semantic / diagnostics
  error: "#b3261e",
  errorBg: "#fbe9e7",
  errorBorder: "#f2cfc9",
  warning: "#b76b01",
  warningBg: "#f9efd9",
  warningBorder: "#ecd7a6",
  info: "#3a6ea5",
  infoBg: "#e7eef6",
  infoBorder: "#cadcef",
  hint: "#3a6ea5",

  // Source control
  created: "#2f7d32",
  deleted: "#b3261e",
  modified: "#b7410e",
  conflict: "#9a5b00",
  ignored: "#a9a394",
  linkHover: "#3a6ea5",

  // Terminal ANSI
  ansi: {
    black: "#3a3a3a",
    red: "#b3261e",
    green: "#2f7d32",
    yellow: "#9a5b00",
    blue: "#3a6ea5",
    magenta: "#8959a8",
    cyan: "#2f7d6e",
    white: "#555049",
    brightBlack: "#8a8478",
    brightRed: "#d1443b",
    brightGreen: "#3f9d43",
    brightYellow: "#b76b01",
    brightBlue: "#4d86c4",
    brightMagenta: "#a06fc2",
    brightCyan: "#3f9d8b",
    brightWhite: "#1a1a1a",
  },

  // Syntax
  syn: {
    comment: "#8a8478",
    keyword: "#8959a8",
    operator: "#555049",
    punctuation: "#555049",
    string: "#3f7e3a",
    stringEscape: "#b76b01",
    number: "#b76b01",
    constant: "#b76b01",
    type: "#3a6ea5",
    property: "#555049",
    function: "#b7410e",
    macro: "#9a5b00",
    attribute: "#9a5b00",
    variable: "#1a1a1a",
    variableSpecial: "#b7410e",
    tag: "#8959a8",
    label: "#b7410e",
    title: "#b7410e",
    predictive: "#b6ad98",
  },

  // Bracket pair rotation
  brackets: ["#3a6ea5", "#8959a8", "#b76b01", "#3f7e3a", "#2f7d6e", "#b7410e"],
};

const dark = {
  bg: "#171717",
  bgEditor: "#0f0f0f",
  bgElevated: "#1e1e1e",
  bgInput: "#0f0f0f",
  border: "#2a2a2a",
  borderVariant: "#232323",

  text: "#e6e6e6",
  textMuted: "#a0a0a0",
  textPlaceholder: "#6e6e6e",
  textDisabled: "#5a5a5a",

  accent: "#e0763c",
  accentContrast: "#171717",
  accentSubtle: "#e0763c26",
  focusBorder: "#e0763c66",

  lineNumber: "#5a5a5a",
  lineNumberActive: "#e6e6e6",
  activeLine: "#ffffff14",
  invisible: "#3a3a3a",
  wrapGuide: "#ffffff10",
  wrapGuideActive: "#ffffff20",
  selection: "#e0763c40",
  selectionInactive: "#e0763c26",
  cursor: "#e0763c",
  highlightRead: "#e0763c26",
  highlightWrite: "#e0763c40",
  searchMatch: "#e0a24a66",
  searchMatchHighlight: "#e0a24a40",

  hover: "#ffffff0f",
  active: "#ffffff17",
  selectedElement: "#e0763c26",

  scrollThumb: "#ffffff1f",
  scrollThumbHover: "#ffffff2e",
  scrollThumbActive: "#ffffff40",

  error: "#e06b62",
  errorBg: "#2b1a1a",
  errorBorder: "#452626",
  warning: "#e0a24a",
  warningBg: "#2a2413",
  warningBorder: "#443b24",
  info: "#7ba6d9",
  infoBg: "#16222e",
  infoBorder: "#2c3f52",
  hint: "#7ba6d9",

  created: "#7fbf6f",
  deleted: "#e06b62",
  modified: "#e0763c",
  conflict: "#d1a75c",
  ignored: "#5a5a5a",
  linkHover: "#7ba6d9",

  ansi: {
    black: "#2a2a2a",
    red: "#e06b62",
    green: "#7fbf6f",
    yellow: "#d1a75c",
    blue: "#7ba6d9",
    magenta: "#c39ae0",
    cyan: "#6fbfae",
    white: "#a0a0a0",
    brightBlack: "#5a5a5a",
    brightRed: "#ec8079",
    brightGreen: "#97cf88",
    brightYellow: "#e0bd77",
    brightBlue: "#93b8e2",
    brightMagenta: "#d1b0e8",
    brightCyan: "#88cfc0",
    brightWhite: "#e6e6e6",
  },

  syn: {
    comment: "#7d7d7d",
    keyword: "#c39ae0",
    operator: "#a0a0a0",
    punctuation: "#a0a0a0",
    string: "#8cc27a",
    stringEscape: "#e0a24a",
    number: "#e0a24a",
    constant: "#e0a24a",
    type: "#7ba6d9",
    property: "#a0a0a0",
    function: "#e8794a",
    macro: "#d1a75c",
    attribute: "#d1a75c",
    variable: "#e6e6e6",
    variableSpecial: "#e8794a",
    tag: "#c39ae0",
    label: "#e8794a",
    title: "#e8794a",
    predictive: "#5a5a5a",
  },

  brackets: ["#7ba6d9", "#c39ae0", "#e0a24a", "#8cc27a", "#6fbfae", "#e8794a"],
};

// ---------------------------------------------------------------------------
// Workbench (UI) colors.
// ---------------------------------------------------------------------------

function buildColors(p) {
  return {
    // Base
    foreground: p.text,
    descriptionForeground: p.textMuted,
    disabledForeground: p.textDisabled,
    errorForeground: p.error,
    focusBorder: p.focusBorder,
    "widget.border": p.border,
    "widget.shadow": "#00000000",
    "selection.background": p.selection,
    "icon.foreground": p.textMuted,
    "sash.hoverBorder": p.focusBorder,

    // Text (markdown previews, hovers)
    "textLink.foreground": p.accent,
    "textLink.activeForeground": p.linkHover,
    "textPreformat.foreground": p.syn.function,
    "textPreformat.background": p.bgElevated,
    "textBlockQuote.background": p.bgElevated,
    "textBlockQuote.border": p.border,
    "textCodeBlock.background": p.bgElevated,
    "textSeparator.foreground": p.border,

    // Window
    "window.activeBorder": p.border,
    "window.inactiveBorder": p.border,

    // Buttons
    "button.background": p.accent,
    "button.foreground": p.accentContrast,
    "button.hoverBackground": p.accent,
    "button.secondaryBackground": p.bgElevated,
    "button.secondaryForeground": p.text,
    "button.secondaryHoverBackground": p.active,
    "button.border": "#00000000",
    "checkbox.background": p.bgInput,
    "checkbox.foreground": p.text,
    "checkbox.border": p.border,

    // Dropdowns
    "dropdown.background": p.bgElevated,
    "dropdown.listBackground": p.bgElevated,
    "dropdown.border": p.border,
    "dropdown.foreground": p.text,

    // Inputs
    "input.background": p.bgInput,
    "input.foreground": p.text,
    "input.border": p.border,
    "input.placeholderForeground": p.textPlaceholder,
    "inputOption.activeBackground": p.accentSubtle,
    "inputOption.activeBorder": p.accent,
    "inputOption.activeForeground": p.text,
    "inputValidation.errorBackground": p.errorBg,
    "inputValidation.errorBorder": p.errorBorder,
    "inputValidation.errorForeground": p.text,
    "inputValidation.warningBackground": p.warningBg,
    "inputValidation.warningBorder": p.warningBorder,
    "inputValidation.warningForeground": p.text,
    "inputValidation.infoBackground": p.infoBg,
    "inputValidation.infoBorder": p.infoBorder,
    "inputValidation.infoForeground": p.text,

    // Scrollbar
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": p.scrollThumb,
    "scrollbarSlider.hoverBackground": p.scrollThumbHover,
    "scrollbarSlider.activeBackground": p.scrollThumbActive,

    // Badges
    "badge.background": p.accent,
    "badge.foreground": p.accentContrast,
    "activityBarBadge.background": p.accent,
    "activityBarBadge.foreground": p.accentContrast,

    // Progress
    "progressBar.background": p.accent,

    // Lists & trees
    "list.activeSelectionBackground": p.selectedElement,
    "list.activeSelectionForeground": p.text,
    "list.activeSelectionIconForeground": p.text,
    "list.inactiveSelectionBackground": p.hover,
    "list.inactiveSelectionForeground": p.text,
    "list.focusBackground": p.selectedElement,
    "list.focusForeground": p.text,
    "list.focusOutline": "#00000000",
    "list.hoverBackground": p.hover,
    "list.hoverForeground": p.text,
    "list.highlightForeground": p.accent,
    "list.focusHighlightForeground": p.accent,
    "list.dropBackground": p.accentSubtle,
    "list.errorForeground": p.error,
    "list.warningForeground": p.warning,
    "list.deemphasizedForeground": p.textMuted,
    "listFilterWidget.background": p.bgElevated,
    "listFilterWidget.outline": p.accent,
    "listFilterWidget.noMatchesOutline": p.error,
    "tree.indentGuidesStroke": p.border,
    "tree.inactiveIndentGuidesStroke": p.borderVariant,

    // Activity bar
    "activityBar.background": p.bg,
    "activityBar.foreground": p.text,
    "activityBar.inactiveForeground": p.textPlaceholder,
    "activityBar.border": p.border,
    "activityBar.activeBorder": p.accent,
    "activityBar.activeBackground": "#00000000",
    "activityBar.dropBorder": p.accent,

    // Side bar
    "sideBar.background": p.bg,
    "sideBar.foreground": p.text,
    "sideBar.border": p.border,
    "sideBar.dropBackground": p.accentSubtle,
    "sideBarTitle.foreground": p.textMuted,
    "sideBarSectionHeader.background": p.bg,
    "sideBarSectionHeader.foreground": p.textMuted,
    "sideBarSectionHeader.border": p.border,

    // Minimap
    "minimap.background": p.bgEditor,
    "minimap.selectionHighlight": p.selection,
    "minimap.findMatchHighlight": p.searchMatchHighlight,
    "minimap.errorHighlight": p.error,
    "minimap.warningHighlight": p.warning,
    "minimapSlider.background": p.scrollThumb,
    "minimapSlider.hoverBackground": p.scrollThumbHover,
    "minimapSlider.activeBackground": p.scrollThumbActive,
    "minimapGutter.addedBackground": p.created,
    "minimapGutter.modifiedBackground": p.modified,
    "minimapGutter.deletedBackground": p.deleted,

    // Editor groups & tabs
    "editorGroup.border": p.border,
    "editorGroup.dropBackground": p.accentSubtle,
    "editorGroupHeader.tabsBackground": p.bg,
    "editorGroupHeader.tabsBorder": p.border,
    "editorGroupHeader.noTabsBackground": p.bg,
    "editorGroupHeader.border": p.border,
    "tab.activeBackground": p.bgEditor,
    "tab.activeForeground": p.text,
    "tab.inactiveBackground": p.bg,
    "tab.inactiveForeground": p.textMuted,
    "tab.hoverBackground": p.bgEditor,
    "tab.hoverForeground": p.text,
    "tab.border": p.border,
    "tab.activeBorder": "#00000000",
    "tab.activeBorderTop": p.accent,
    "tab.unfocusedActiveBorderTop": "#00000000",
    "tab.lastPinnedBorder": p.border,
    "tab.unfocusedActiveForeground": p.textMuted,
    "tab.unfocusedInactiveForeground": p.textPlaceholder,
    "tab.activeModifiedBorder": p.modified,
    "tab.inactiveModifiedBorder": p.modified,

    // Editor
    "editor.background": p.bgEditor,
    "editor.foreground": p.text,
    "editorLineNumber.foreground": p.lineNumber,
    "editorLineNumber.activeForeground": p.lineNumberActive,
    "editorCursor.foreground": p.cursor,
    "editorCursor.background": p.bgEditor,
    "editor.selectionBackground": p.selection,
    "editor.selectionHighlightBackground": p.selectionInactive,
    "editor.inactiveSelectionBackground": p.selectionInactive,
    "editor.wordHighlightBackground": p.highlightRead,
    "editor.wordHighlightStrongBackground": p.highlightWrite,
    "editor.findMatchBackground": p.searchMatch,
    "editor.findMatchHighlightBackground": p.searchMatchHighlight,
    "editor.findRangeHighlightBackground": p.selectionInactive,
    "editor.hoverHighlightBackground": p.selectionInactive,
    "editor.lineHighlightBackground": p.activeLine,
    "editor.lineHighlightBorder": "#00000000",
    "editor.rangeHighlightBackground": p.selectionInactive,
    "editor.symbolHighlightBackground": p.searchMatchHighlight,
    "editorLink.activeForeground": p.linkHover,
    "editorWhitespace.foreground": p.invisible,
    "editorIndentGuide.background1": p.wrapGuide,
    "editorIndentGuide.activeBackground1": p.wrapGuideActive,
    "editorRuler.foreground": p.wrapGuide,
    "editorCodeLens.foreground": p.textPlaceholder,
    "editorBracketMatch.background": p.accentSubtle,
    "editorBracketMatch.border": "#00000000",
    "editorUnnecessaryCode.opacity": "#00000080",

    // Bracket pair colorization
    "editorBracketHighlight.foreground1": p.brackets[0],
    "editorBracketHighlight.foreground2": p.brackets[1],
    "editorBracketHighlight.foreground3": p.brackets[2],
    "editorBracketHighlight.foreground4": p.brackets[3],
    "editorBracketHighlight.foreground5": p.brackets[4],
    "editorBracketHighlight.foreground6": p.brackets[5],
    "editorBracketHighlight.unexpectedBracket.foreground": p.error,

    // Gutter
    "editorGutter.background": p.bgEditor,
    "editorGutter.modifiedBackground": p.modified,
    "editorGutter.addedBackground": p.created,
    "editorGutter.deletedBackground": p.deleted,
    "editorGutter.foldingControlForeground": p.textMuted,

    // Diagnostics
    "editorError.foreground": p.error,
    "editorWarning.foreground": p.warning,
    "editorInfo.foreground": p.info,
    "editorHint.foreground": p.hint,
    "problemsErrorIcon.foreground": p.error,
    "problemsWarningIcon.foreground": p.warning,
    "problemsInfoIcon.foreground": p.info,

    // Overview ruler
    "editorOverviewRuler.border": "#00000000",
    "editorOverviewRuler.findMatchForeground": p.searchMatch,
    "editorOverviewRuler.rangeHighlightForeground": p.accentSubtle,
    "editorOverviewRuler.selectionHighlightForeground": p.selectionInactive,
    "editorOverviewRuler.wordHighlightForeground": p.highlightRead,
    "editorOverviewRuler.wordHighlightStrongForeground": p.highlightWrite,
    "editorOverviewRuler.modifiedForeground": p.modified,
    "editorOverviewRuler.addedForeground": p.created,
    "editorOverviewRuler.deletedForeground": p.deleted,
    "editorOverviewRuler.errorForeground": p.error,
    "editorOverviewRuler.warningForeground": p.warning,
    "editorOverviewRuler.infoForeground": p.info,
    "editorOverviewRuler.bracketMatchForeground": p.accent,

    // Inlay hints
    "editorInlayHint.foreground": p.hint,
    "editorInlayHint.background": p.infoBg,
    "editorInlayHint.typeForeground": p.hint,
    "editorInlayHint.parameterForeground": p.hint,

    // Ghost text (inline completions)
    "editorGhostText.foreground": p.syn.predictive,

    // Diff editor
    "diffEditor.insertedTextBackground": hexAlpha(p.created, "22"),
    "diffEditor.removedTextBackground": hexAlpha(p.deleted, "22"),
    "diffEditor.insertedLineBackground": hexAlpha(p.created, "18"),
    "diffEditor.removedLineBackground": hexAlpha(p.deleted, "18"),
    "diffEditor.diagonalFill": p.border,
    "diffEditorGutter.insertedLineBackground": hexAlpha(p.created, "22"),
    "diffEditorGutter.removedLineBackground": hexAlpha(p.deleted, "22"),

    // Editor widgets (find, hovers, suggestions)
    "editorWidget.background": p.bgElevated,
    "editorWidget.foreground": p.text,
    "editorWidget.border": p.border,
    "editorWidget.resizeBorder": p.focusBorder,
    "editorSuggestWidget.background": p.bgElevated,
    "editorSuggestWidget.border": p.border,
    "editorSuggestWidget.foreground": p.text,
    "editorSuggestWidget.highlightForeground": p.accent,
    "editorSuggestWidget.focusHighlightForeground": p.accent,
    "editorSuggestWidget.selectedBackground": p.selectedElement,
    "editorSuggestWidget.selectedForeground": p.text,
    "editorHoverWidget.background": p.bgElevated,
    "editorHoverWidget.foreground": p.text,
    "editorHoverWidget.border": p.border,
    "editorHoverWidget.highlightForeground": p.accent,

    // Peek view
    "peekView.border": p.accent,
    "peekViewEditor.background": p.bgElevated,
    "peekViewEditor.matchHighlightBackground": p.searchMatchHighlight,
    "peekViewEditorGutter.background": p.bgElevated,
    "peekViewResult.background": p.bg,
    "peekViewResult.fileForeground": p.text,
    "peekViewResult.lineForeground": p.textMuted,
    "peekViewResult.matchHighlightBackground": p.searchMatchHighlight,
    "peekViewResult.selectionBackground": p.selectedElement,
    "peekViewResult.selectionForeground": p.text,
    "peekViewTitle.background": p.bg,
    "peekViewTitleLabel.foreground": p.text,
    "peekViewTitleDescription.foreground": p.textMuted,

    // Merge conflicts
    "merge.currentHeaderBackground": hexAlpha(p.info, "40"),
    "merge.currentContentBackground": hexAlpha(p.info, "22"),
    "merge.incomingHeaderBackground": hexAlpha(p.created, "40"),
    "merge.incomingContentBackground": hexAlpha(p.created, "22"),
    "merge.border": p.border,
    "merge.commonHeaderBackground": hexAlpha(p.conflict, "40"),
    "merge.commonContentBackground": hexAlpha(p.conflict, "22"),

    // Panel (terminal / output / problems)
    "panel.background": p.bg,
    "panel.border": p.border,
    "panel.dropBorder": p.accent,
    "panelTitle.activeForeground": p.text,
    "panelTitle.inactiveForeground": p.textMuted,
    "panelTitle.activeBorder": p.accent,
    "panelInput.border": p.border,
    "panelSection.border": p.border,
    "panelSectionHeader.background": p.bg,
    "panelSectionHeader.foreground": p.textMuted,

    // Status bar
    "statusBar.background": p.bg,
    "statusBar.foreground": p.textMuted,
    "statusBar.border": p.border,
    "statusBar.noFolderBackground": p.bg,
    "statusBar.noFolderForeground": p.textMuted,
    "statusBar.debuggingBackground": p.accent,
    "statusBar.debuggingForeground": p.accentContrast,
    "statusBar.focusBorder": p.focusBorder,
    "statusBarItem.activeBackground": p.active,
    "statusBarItem.hoverBackground": p.hover,
    "statusBarItem.focusBorder": p.focusBorder,
    "statusBarItem.prominentBackground": p.active,
    "statusBarItem.prominentForeground": p.text,
    "statusBarItem.prominentHoverBackground": p.hover,
    "statusBarItem.remoteBackground": p.accent,
    "statusBarItem.remoteForeground": p.accentContrast,
    "statusBarItem.errorBackground": p.error,
    "statusBarItem.errorForeground": p.accentContrast,
    "statusBarItem.warningBackground": p.warning,
    "statusBarItem.warningForeground": p.accentContrast,

    // Title bar
    "titleBar.activeBackground": p.bg,
    "titleBar.activeForeground": p.text,
    "titleBar.inactiveBackground": p.bg,
    "titleBar.inactiveForeground": p.textMuted,
    "titleBar.border": p.border,

    // Menus
    "menubar.selectionBackground": p.hover,
    "menubar.selectionForeground": p.text,
    "menubar.selectionBorder": "#00000000",
    "menu.background": p.bgElevated,
    "menu.foreground": p.text,
    "menu.selectionBackground": p.selectedElement,
    "menu.selectionForeground": p.text,
    "menu.selectionBorder": "#00000000",
    "menu.separatorBackground": p.border,
    "menu.border": p.border,

    // Command center
    "commandCenter.foreground": p.textMuted,
    "commandCenter.activeForeground": p.text,
    "commandCenter.background": p.bg,
    "commandCenter.activeBackground": p.hover,
    "commandCenter.border": p.border,

    // Notifications
    "notificationCenter.border": p.border,
    "notificationCenterHeader.background": p.bg,
    "notificationCenterHeader.foreground": p.textMuted,
    "notifications.background": p.bgElevated,
    "notifications.foreground": p.text,
    "notifications.border": p.border,
    "notificationLink.foreground": p.accent,
    "notificationsErrorIcon.foreground": p.error,
    "notificationsWarningIcon.foreground": p.warning,
    "notificationsInfoIcon.foreground": p.info,

    // Banner
    "banner.background": p.bgElevated,
    "banner.foreground": p.text,
    "banner.iconForeground": p.accent,

    // Extensions
    "extensionButton.prominentBackground": p.accent,
    "extensionButton.prominentForeground": p.accentContrast,
    "extensionButton.prominentHoverBackground": p.accent,
    "extensionBadge.remoteBackground": p.accent,
    "extensionBadge.remoteForeground": p.accentContrast,
    "extensionIcon.starForeground": p.warning,
    "extensionIcon.verifiedForeground": p.info,
    "extensionIcon.preReleaseForeground": p.syn.keyword,

    // Quick input / picker
    "quickInput.background": p.bgElevated,
    "quickInput.foreground": p.text,
    "quickInputList.focusBackground": p.selectedElement,
    "quickInputList.focusForeground": p.text,
    "quickInputList.focusIconForeground": p.text,
    "quickInputTitle.background": p.bg,
    "pickerGroup.border": p.border,
    "pickerGroup.foreground": p.accent,

    // Keybinding labels
    "keybindingLabel.background": p.bgElevated,
    "keybindingLabel.foreground": p.text,
    "keybindingLabel.border": p.border,
    "keybindingLabel.bottomBorder": p.border,

    // Breadcrumbs
    "breadcrumb.foreground": p.textMuted,
    "breadcrumb.focusForeground": p.text,
    "breadcrumb.activeSelectionForeground": p.accent,
    "breadcrumb.background": p.bgEditor,
    "breadcrumbPicker.background": p.bgElevated,

    // Git decorations (explorer)
    "gitDecoration.addedResourceForeground": p.created,
    "gitDecoration.modifiedResourceForeground": p.modified,
    "gitDecoration.deletedResourceForeground": p.deleted,
    "gitDecoration.renamedResourceForeground": p.info,
    "gitDecoration.untrackedResourceForeground": p.created,
    "gitDecoration.ignoredResourceForeground": p.ignored,
    "gitDecoration.conflictingResourceForeground": p.conflict,
    "gitDecoration.stageModifiedResourceForeground": p.modified,
    "gitDecoration.stageDeletedResourceForeground": p.deleted,
    "gitDecoration.submoduleResourceForeground": p.info,

    // Settings editor
    "settings.headerForeground": p.text,
    "settings.modifiedItemIndicator": p.modified,
    "settings.dropdownBackground": p.bgElevated,
    "settings.dropdownBorder": p.border,
    "settings.checkboxBackground": p.bgInput,
    "settings.checkboxBorder": p.border,
    "settings.textInputBackground": p.bgInput,
    "settings.textInputBorder": p.border,
    "settings.numberInputBackground": p.bgInput,
    "settings.numberInputBorder": p.border,
    "settings.focusedRowBackground": p.hover,
    "settings.rowHoverBackground": p.hover,
    "settings.focusedRowBorder": p.focusBorder,

    // Terminal
    "terminal.background": p.bgEditor,
    "terminal.foreground": p.text,
    "terminal.border": p.border,
    "terminalCursor.foreground": p.cursor,
    "terminalCursor.background": p.bgEditor,
    "terminal.selectionBackground": p.selection,
    "terminal.findMatchBackground": p.searchMatch,
    "terminal.findMatchHighlightBackground": p.searchMatchHighlight,
    "terminal.ansiBlack": p.ansi.black,
    "terminal.ansiRed": p.ansi.red,
    "terminal.ansiGreen": p.ansi.green,
    "terminal.ansiYellow": p.ansi.yellow,
    "terminal.ansiBlue": p.ansi.blue,
    "terminal.ansiMagenta": p.ansi.magenta,
    "terminal.ansiCyan": p.ansi.cyan,
    "terminal.ansiWhite": p.ansi.white,
    "terminal.ansiBrightBlack": p.ansi.brightBlack,
    "terminal.ansiBrightRed": p.ansi.brightRed,
    "terminal.ansiBrightGreen": p.ansi.brightGreen,
    "terminal.ansiBrightYellow": p.ansi.brightYellow,
    "terminal.ansiBrightBlue": p.ansi.brightBlue,
    "terminal.ansiBrightMagenta": p.ansi.brightMagenta,
    "terminal.ansiBrightCyan": p.ansi.brightCyan,
    "terminal.ansiBrightWhite": p.ansi.brightWhite,

    // Debug
    "debugToolBar.background": p.bgElevated,
    "debugToolBar.border": p.border,
    "debugIcon.breakpointForeground": p.deleted,
    "debugIcon.breakpointDisabledForeground": p.textDisabled,
    "debugIcon.startForeground": p.created,
    "debugIcon.pauseForeground": p.info,
    "debugIcon.stopForeground": p.deleted,
    "debugIcon.stepOverForeground": p.info,
    "debugIcon.stepIntoForeground": p.info,
    "debugIcon.stepOutForeground": p.info,
    "debugIcon.continueForeground": p.created,
    "debugIcon.restartForeground": p.created,
    "editor.stackFrameHighlightBackground": p.warningBg,
    "editor.focusedStackFrameHighlightBackground": hexAlpha(p.created, "33"),
    "debugConsole.infoForeground": p.info,
    "debugConsole.warningForeground": p.warning,
    "debugConsole.errorForeground": p.error,
    "debugConsole.sourceForeground": p.textMuted,
    "debugConsoleInputIcon.foreground": p.accent,

    // Testing
    "testing.iconPassed": p.created,
    "testing.iconFailed": p.error,
    "testing.iconErrored": p.error,
    "testing.iconSkipped": p.textMuted,
    "testing.iconQueued": p.warning,
    "testing.runAction": p.created,

    // Charts (used by some panels)
    "charts.foreground": p.text,
    "charts.lines": p.textMuted,
    "charts.red": p.ansi.red,
    "charts.blue": p.ansi.blue,
    "charts.yellow": p.ansi.yellow,
    "charts.orange": p.accent,
    "charts.green": p.ansi.green,
    "charts.purple": p.ansi.magenta,

    // Welcome / walkthrough
    "welcomePage.tileBackground": p.bgElevated,
    "welcomePage.tileHoverBackground": p.active,
    "welcomePage.progress.background": p.border,
    "welcomePage.progress.foreground": p.accent,
    "walkThrough.embeddedEditorBackground": p.bgElevated,
  };
}

// ---------------------------------------------------------------------------
// TextMate token colors.
// ---------------------------------------------------------------------------

function buildTokenColors(p, keywordStyle) {
  const s = p.syn;
  return [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: s.comment, fontStyle: "italic" },
    },
    {
      name: "Documentation comment",
      scope: ["comment.block.documentation", "comment.line.documentation"],
      settings: { foreground: s.comment, fontStyle: "italic" },
    },
    {
      name: "Keyword",
      scope: [
        "keyword",
        "keyword.control",
        "keyword.other",
        "storage.type",
        "storage.modifier",
        "storage.type.function",
        "storage.type.class",
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.logical",
        "keyword.operator.delete",
        "keyword.declaration",
        "variable.language.this",
        "variable.language.self",
      ],
      settings: { foreground: s.keyword, fontStyle: keywordStyle },
    },
    {
      name: "Operators & punctuation",
      scope: [
        "keyword.operator",
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "punctuation.definition.parameters",
        "punctuation.section",
        "meta.brace",
        "punctuation.definition.tag",
      ],
      settings: { foreground: s.operator },
    },
    {
      name: "String",
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "string.unquoted",
      ],
      settings: { foreground: s.string },
    },
    {
      name: "Regular expression",
      scope: ["string.regexp", "constant.other.character-class.regexp"],
      settings: { foreground: s.string },
    },
    {
      name: "String escapes & special",
      scope: [
        "constant.character.escape",
        "constant.other.placeholder",
        "punctuation.definition.template-expression",
        "string.interpolated punctuation",
        "meta.template.expression punctuation.definition.template-expression",
      ],
      settings: { foreground: s.stringEscape },
    },
    {
      name: "Number",
      scope: ["constant.numeric", "constant.numeric.integer", "constant.numeric.float"],
      settings: { foreground: s.number },
    },
    {
      name: "Boolean, language & other constants",
      scope: [
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
        "constant.other",
        "support.constant",
        "variable.other.constant",
      ],
      settings: { foreground: s.constant },
    },
    {
      name: "Type, class, enum, interface",
      scope: [
        "entity.name.type",
        "entity.name.type.class",
        "entity.name.class",
        "entity.name.type.interface",
        "entity.name.type.enum",
        "entity.other.inherited-class",
        "support.type",
        "support.class",
        "meta.type.annotation",
        "storage.type.primitive",
      ],
      settings: { foreground: s.type },
    },
    {
      name: "Constructor & namespace",
      scope: [
        "entity.name.function.constructor",
        "entity.name.type.namespace",
        "entity.name.namespace",
        "support.type.namespace",
      ],
      settings: { foreground: s.type },
    },
    {
      name: "Property",
      scope: [
        "variable.other.property",
        "variable.other.object.property",
        "meta.object-literal.key",
        "support.type.property-name",
        "variable.object.property",
      ],
      settings: { foreground: s.property },
    },
    {
      name: "Function & method",
      scope: [
        "entity.name.function",
        "entity.name.function.member",
        "support.function",
        "meta.function-call.generic",
        "meta.function-call",
        "variable.function",
      ],
      settings: { foreground: s.function },
    },
    {
      name: "Macro, attribute, decorator, preprocessor",
      scope: [
        "entity.name.function.macro",
        "support.function.macro",
        "entity.other.attribute-name",
        "meta.decorator",
        "punctuation.decorator",
        "meta.attribute",
        "keyword.control.directive",
        "meta.preprocessor",
        "entity.name.function.preprocessor",
      ],
      settings: { foreground: s.macro },
    },
    {
      name: "Variable",
      scope: ["variable", "variable.other", "variable.other.readwrite", "meta.definition.variable.name"],
      settings: { foreground: s.variable },
    },
    {
      name: "Parameter",
      scope: ["variable.parameter", "meta.function.parameters"],
      settings: { foreground: s.variable },
    },
    {
      name: "Special variable (this / self / super)",
      scope: ["variable.language", "variable.language.super"],
      settings: { foreground: s.variableSpecial, fontStyle: "italic" },
    },
    {
      name: "Label",
      scope: ["entity.name.label", "constant.other.label", "punctuation.definition.label"],
      settings: { foreground: s.label },
    },
    // Markup (Markdown, etc.)
    {
      name: "Markup heading",
      scope: [
        "markup.heading",
        "markup.heading entity.name",
        "entity.name.section",
        "punctuation.definition.heading",
      ],
      settings: { foreground: s.title, fontStyle: "bold" },
    },
    {
      name: "Markup bold",
      scope: ["markup.bold", "punctuation.definition.bold"],
      settings: { foreground: s.number, fontStyle: "bold" },
    },
    {
      name: "Markup italic",
      scope: ["markup.italic", "punctuation.definition.italic"],
      settings: { foreground: s.number, fontStyle: "italic" },
    },
    {
      name: "Markup inline code",
      scope: ["markup.inline.raw", "markup.raw.block", "markup.fenced_code.block"],
      settings: { foreground: s.string },
    },
    {
      name: "Markup quote",
      scope: ["markup.quote", "punctuation.definition.quote.begin.markdown"],
      settings: { foreground: s.comment, fontStyle: "italic" },
    },
    {
      name: "Markup list punctuation",
      scope: [
        "punctuation.definition.list.begin.markdown",
        "markup.list punctuation.definition",
        "beginning.punctuation.definition.list.markdown",
      ],
      settings: { foreground: s.function },
    },
    {
      name: "Markup link text",
      scope: ["markup.underline.link", "string.other.link", "markup.link"],
      settings: { foreground: s.type },
    },
    {
      name: "Markup link URL",
      scope: ["markup.underline.link.image", "constant.other.reference.link"],
      settings: { foreground: s.type, fontStyle: "underline" },
    },
    {
      name: "Markup inserted / deleted / changed",
      scope: ["markup.inserted"],
      settings: { foreground: p.created },
    },
    {
      scope: ["markup.deleted"],
      settings: { foreground: p.deleted },
    },
    {
      scope: ["markup.changed"],
      settings: { foreground: p.modified },
    },
    // Markup for HTML/JSX/XML tags
    {
      name: "Tag",
      scope: ["entity.name.tag", "punctuation.definition.tag.begin", "punctuation.definition.tag.end"],
      settings: { foreground: s.tag },
    },
    {
      name: "Tag attribute",
      scope: ["entity.other.attribute-name.html", "entity.other.attribute-name.jsx"],
      settings: { foreground: s.attribute },
    },
    // JSON
    {
      name: "JSON key",
      scope: [
        "support.type.property-name.json",
        "support.type.property-name.json punctuation",
      ],
      settings: { foreground: s.property },
    },
    // Embedded / template punctuation
    {
      name: "Embedded / special punctuation",
      scope: ["punctuation.section.embedded", "punctuation.definition.generic.begin", "punctuation.definition.generic.end"],
      settings: { foreground: s.macro },
    },
    // Invalid
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: p.error },
    },
    {
      name: "Invalid deprecated",
      scope: ["invalid.deprecated"],
      settings: { foreground: p.warning },
    },
  ];
}

// ---------------------------------------------------------------------------
// Semantic token colors (LSP-driven highlighting).
// ---------------------------------------------------------------------------

function buildSemanticTokenColors(p, keywordStyle) {
  const s = p.syn;
  return {
    keyword: { foreground: s.keyword, fontStyle: keywordStyle },
    comment: { foreground: s.comment, fontStyle: "italic" },
    string: { foreground: s.string },
    number: { foreground: s.number },
    regexp: { foreground: s.string },
    operator: { foreground: s.operator },
    namespace: { foreground: s.type },
    type: { foreground: s.type },
    "type.defaultLibrary": { foreground: s.type },
    struct: { foreground: s.type },
    class: { foreground: s.type },
    "class.defaultLibrary": { foreground: s.type },
    interface: { foreground: s.type },
    enum: { foreground: s.type },
    typeParameter: { foreground: s.type },
    function: { foreground: s.function },
    "function.defaultLibrary": { foreground: s.function },
    method: { foreground: s.function },
    macro: { foreground: s.macro },
    decorator: { foreground: s.macro },
    variable: { foreground: s.variable },
    "variable.readonly": { foreground: s.constant },
    "variable.readonly.defaultLibrary": { foreground: s.constant },
    parameter: { foreground: s.variable },
    property: { foreground: s.property },
    "property.readonly": { foreground: s.property },
    enumMember: { foreground: s.constant },
    event: { foreground: s.function },
    label: { foreground: s.label },
    selfKeyword: { foreground: s.variableSpecial, fontStyle: "italic" },
  };
}

// ---------------------------------------------------------------------------
// Helpers & assembly.
// ---------------------------------------------------------------------------

/** Append an alpha byte (two hex chars) to a #rrggbb color. */
function hexAlpha(hex, aa) {
  return hex + aa;
}

const KEYWORD_STYLES = {
  plain: "",
  bold: "bold",
  italic: "italic",
};

const VARIANTS = [
  { palette: light, appearance: "light", treatment: "plain", label: "Pragmatik Light", file: "pragmatik-light.json" },
  { palette: dark, appearance: "dark", treatment: "plain", label: "Pragmatik Dark", file: "pragmatik-dark.json" },
  { palette: light, appearance: "light", treatment: "bold", label: "Pragmatik Light Bold", file: "pragmatik-light-bold.json" },
  { palette: dark, appearance: "dark", treatment: "bold", label: "Pragmatik Dark Bold", file: "pragmatik-dark-bold.json" },
  { palette: light, appearance: "light", treatment: "italic", label: "Pragmatik Light Italic", file: "pragmatik-light-italic.json" },
  { palette: dark, appearance: "dark", treatment: "italic", label: "Pragmatik Dark Italic", file: "pragmatik-dark-italic.json" },
];

function buildTheme(variant) {
  const keywordStyle = KEYWORD_STYLES[variant.treatment];
  return {
    $schema: "vscode://schemas/color-theme",
    name: variant.label,
    type: variant.appearance,
    semanticHighlighting: true,
    colors: buildColors(variant.palette),
    semanticTokenColors: buildSemanticTokenColors(variant.palette, keywordStyle),
    tokenColors: buildTokenColors(variant.palette, keywordStyle),
  };
}

function main() {
  if (!fs.existsSync(THEMES_DIR)) {
    fs.mkdirSync(THEMES_DIR, { recursive: true });
  }
  for (const variant of VARIANTS) {
    const theme = buildTheme(variant);
    const outPath = path.join(THEMES_DIR, variant.file);
    fs.writeFileSync(outPath, JSON.stringify(theme, null, 2) + "\n", "utf8");
    console.log(`wrote ${path.relative(path.join(__dirname, ".."), outPath)}`);
  }
  console.log(`\nGenerated ${VARIANTS.length} theme files.`);
}

main();
