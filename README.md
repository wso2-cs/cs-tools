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
| **PEM / Certificate Decoder** | Parses PEM-encoded X.509 certificates showing subject, SANs, issuer, validity, key usage, and fingerprints |
| **CSR Decoder** | Decodes and displays CSR fields including subject, public key, and requested extensions |

### Format

| Tool | Description |
|---|---|
| **JSON Beautify** | Pretty-prints and minifies JSON |
| **XML Beautify** | Pretty-prints and minifies XML |
| **YAML Linter / Formatter** | Validates, beautifies, and converts between YAML and JSON with Kubernetes-standard 2-space indentation |

### Generate

| Tool | Description |
|---|---|
| **Hash** | Generates MD5, SHA-1, SHA-256, and SHA-512 hashes |
| **Password** | Cryptographically random passwords with configurable length and character sets; includes strength indicator |
| **UUID** | Generates UUID v4 values (bulk generation up to 100) using `crypto.randomUUID()` |
| **CSR Generator** | Generates PKCS#10 Certificate Signing Requests with configurable subject fields and key sizes |

### Utilities

| Tool | Description |
|---|---|
| **Regex Tester** | Live regex testing with flag support (g/i/m/s), highlighted matches, and capture group display |
| **Diff Viewer** | Side-by-side text diff using LCS algorithm (up to 2000 lines per input) |
| **Timestamp** | Converts Unix timestamps (seconds/milliseconds) to human-readable dates and vice versa |
| **HTTP Status** | Searchable reference table of HTTP status codes (1xx–5xx) |
| **CORS Builder** | Generates `Access-Control-*` response headers from a guided form |
| **Time Zone Converter** | Converts date/time across multiple time zones with quick-add presets for common regions |
| **Keystore / Truststore Viewer** | Reads JKS and PKCS#12 keystores entirely in-browser, displaying certificate details and chain info |
| **IP / Subnet Calculator** | Calculates network address, broadcast, host range, and wildcard mask from IP and CIDR or subnet mask input |

## Technical Notes

- **No external API calls** — all processing happens in the browser
- **Crypto** — hashing uses the Web Crypto API (`crypto.subtle.digest`); passwords and UUIDs use `crypto.getRandomValues` / `crypto.randomUUID()`
- **SAML** — decompression uses `DecompressionStream('deflate-raw')` (Chrome 80+, Firefox 113+, Safari 16.4+)
- **Theming** — dark mode by default; light mode toggle persisted in `localStorage`
- **Fonts** — [Inter](https://fonts.google.com/specimen/Inter) (UI) and [Material Symbols Outlined](https://fonts.google.com/icons) (icons)

## Files

```
index.html   — markup and tool panels
app.js       — all JavaScript logic (no external libraries)
style.css    — styles with CSS custom properties for theming
```
