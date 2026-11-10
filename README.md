# SaniText — Fiverr Message Sanitizer

A privacy-first, browser-only tool that cleans Fiverr messages before you send them. It removes off-platform contact details, payment terms, external links, and risky wording, then shows a risk score so you can catch policy problems early.

Everything runs locally in the browser. No uploads, no accounts, no tracking.

## Features

- **Live sanitizing** — output updates automatically as you type, with no extra action needed.
- **Smart detection** — catches emails, obfuscated emails, phone numbers, URLs/domains, and social handles, in addition to the restricted word list.
- **Clear match labels** — flagged content is tagged as `[EMAIL]`, `[PHONE]`, `[LINK]`, or `[HANDLE]` (toggleable).
- **Risk meter** — a 0–100 score with a plain-language reason, so you know how risky the message looks.
- **Categorized word list** — 200+ default terms across contact, payment, platform, review, and sensitive categories.
- **Word manager** — add, edit, delete, search, bulk-add, import/export, and reset restricted words. Changes persist in LocalStorage.
- **Multiple documents** — keep several messages open in tabs.
- **Light and dark themes** — respects your system preference on first visit, then remembers your choice.
- **Responsive layout** — works on desktop, tablet, and mobile.
- **Keyboard friendly** — shortcuts, focus trapping in modals, and visible focus states.
- **Download and copy** — export sanitized output as a `.txt` file or copy it in one click.

## Getting started

No build step or install is required.

1. Open the project folder in a local web server (for example, Laragon or `python -m http.server`).
2. Visit `index.html` in your browser.
3. Paste a message into the left panel, review the sanitized result on the right, then copy or download it.

Opening `index.html` directly as a file also works in most browsers, though clipboard access is more reliable when served over `http://localhost`.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl` / `Cmd` + `Shift` + `F` | Search restricted words |
| `Ctrl` / `Cmd` + `Shift` + `C` | Copy sanitized output |
| `Ctrl` / `Cmd` + `K` | Open the restricted words manager |
| `Esc` | Close the top-most dialog |

## How sanitizing works

1. The input is matched against your active restricted word list.
2. Smart patterns detect emails, phone numbers, links, and social handles.
3. Matches are replaced with category placeholders such as `[EMAIL REMOVED]` or `[LINK REMOVED]`, and optionally tagged.
4. Statistics and the risk score are recalculated from the remaining matches.
5. Your word list, settings, theme, and open documents are stored in LocalStorage.

## Project structure

```text
text_santizer/
├── index.html
├── css/
│   ├── style.css        Base tokens and shared components
│   ├── responsive.css   Earlier responsive rules
│   └── workspace.css    Main design system, layout, and responsive polish
└── js/
    ├── app.js           UI wiring, events, risk meter, modals
    ├── sanitizer.js     Word and smart-pattern matching
    ├── risk.js          Risk scoring and reasons
    ├── defaultWords.js  Categorized default word list
    ├── storage.js       LocalStorage persistence and migration
    ├── settings.js      Settings defaults and reset
    ├── wordManager.js   Word list CRUD
    ├── importExport.js  TXT/JSON import, export, and downloads
    ├── statistics.js    Text statistics
    ├── notifications.js Toast notifications
    └── theme.js         Light/dark theme handling
```

## Privacy

- No network requests are made to sanitize text.
- No analytics, accounts, or server-side storage.
- All saved data stays in your browser's LocalStorage and can be cleared from the settings dialog.
- Google Fonts is the only external resource; the app still works if it is blocked.

## Customizing

- **Restricted words:** open the word manager (`Ctrl` / `Cmd` + `K`) or edit `js/defaultWords.js` and bump the `VERSION` value there to apply new defaults.
- **Smart detection:** toggle each detector in Settings, or adjust the patterns in `js/sanitizer.js`.
- **Risk scoring:** tune point weights and thresholds in `js/risk.js`.
- **Design tokens:** colors, radii, and surfaces live at the top of `css/workspace.css`.
"# text_sanitizer" 
