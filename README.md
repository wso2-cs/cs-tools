# Support Utils

A browser-based utility toolkit for WSO2 Customer Success engineers. All tools run entirely client-side — no data is sent to any server.

## Usage

Open `index.html` directly in any modern browser. No build step, no dependencies, no server required.

## Tools

### Encode / Decode

| Tool | Description |
|---|---|
| **Base64 Encode** | Encodes plain text to Base64 (Unicode-safe) |
| **Base64 Decode** | Decodes Base64 back to plain text |
| **URL Encode** | RFC 3986-compliant percent-encoding |
| **URL Decode** | Decodes percent-encoded URLs |
| **HTML Encode** | Escapes HTML special characters (`<`, `>`, `&`, `"`, `'`) |
| **HTML Decode** | Unescapes HTML entities back to plain text |
| **B64 URL Encode** | URL-safe Base64 encoding (uses `-`/`_`, no padding) |
| **B64 URL Decode** | Decodes URL-safe Base64 strings |
| **JWT Decode** | Decodes JWT header and payload (no signature verification) |
| **SAML Decode** | Decodes SAML tokens — supports both HTTP-Redirect (deflate + Base64) and HTTP-POST (plain Base64) bindings, with formatted XML output |

### Format

| Tool | Description |
|---|---|
| **JSON Beautify** | Pretty-prints and minifies JSON |
| **XML Beautify** | Pretty-prints and minifies XML |

### Generate

| Tool | Description |
|---|---|
| **Hash** | Generates MD5, SHA-1, SHA-256, and SHA-512 hashes |
| **Password** | Cryptographically random passwords with configurable length and character sets; includes strength indicator |
| **UUID** | Generates UUID v4 values (bulk generation up to 100) using `crypto.randomUUID()` |

### Utilities

| Tool | Description |
|---|---|
| **Regex Tester** | Live regex testing with flag support (g/i/m/s), highlighted matches, and capture group display |
| **Diff Viewer** | Side-by-side text diff using LCS algorithm (up to 2000 lines per input) |
| **Timestamp** | Converts Unix timestamps (seconds/milliseconds) to human-readable dates and vice versa |
| **HTTP Status** | Searchable reference table of HTTP status codes (1xx–5xx) |
| **CORS Builder** | Generates `Access-Control-*` response headers from a guided form |
| **Image Editor** | Redact (solid fill), pixelate, annotate (box/arrow/pen/text), crop, resize and export screenshots (PNG/JPEG/WebP) fully client-side; load via file, drag-drop or clipboard paste; EXIF stripped on export |

## Technical Notes

- **No external API calls** — all processing happens in the browser
- **Crypto** — hashing uses the Web Crypto API (`crypto.subtle.digest`); passwords and UUIDs use `crypto.getRandomValues` / `crypto.randomUUID()`
- **SAML** — decompression uses `DecompressionStream('deflate-raw')` (Chrome 80+, Firefox 113+, Safari 16.4+)
- **Image Editor** — `<canvas>` + Pointer Events, no libraries; redaction and pixelation are baked into the bitmap (not recoverable overlays); EXIF is dropped because the image is re-encoded through canvas on export; large images auto-downscale to 4000px; clipboard image copy needs `ClipboardItem` (Chromium), Download always works
- **Theming** — dark mode by default; light mode toggle persisted in `localStorage`
- **Fonts** — [Inter](https://fonts.google.com/specimen/Inter) (UI) and [Material Symbols Outlined](https://fonts.google.com/icons) (icons)

## Files

```
index.html   — markup and tool panels
app.js       — all JavaScript logic (no external libraries)
style.css    — styles with CSS custom properties for theming
```
