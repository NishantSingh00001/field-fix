# Security Review — FieldFix

FieldFix is a fully static, offline field-service repair assistant (shared
`core.js`/`core.css` + per-page HTML + `app.js`). Confirmed via grep (excluding
the bundled `three.min.js`) that there are zero `fetch`/`XMLHttpRequest`/
`WebSocket` calls anywhere in the app — diagnosis data, repair guides, and
calculators are all static/local logic, and the service log is stored only in
browser `localStorage`. This matches the README's "100% offline, nothing is
uploaded" claim.

## 20-point pen-test checklist

| # | Check | Applicable? | Notes |
|---|-------|-------------|-------|
| 1 | HTTP/2 Rapid Reset (CVE-2023-44487) | N/A | No server component in this repo. |
| 2 | bcrypt 72-byte truncation | N/A | No password hashing. |
| 3 | SAML signature bypass (CVE-2024-45409) | N/A | No SAML/SSO. |
| 4 | nOAuth | N/A | No OAuth/auth of any kind. |
| 5 | GraphQL alias batching | N/A | No GraphQL. |
| 6 | TOTP replay (RFC 6238 §5.2) | N/A | No TOTP/2FA. |
| 7 | ReDoS | No | No user-supplied-pattern regexes in `app.js`/`core.js`. |
| 8 | JWT algorithm confusion | N/A | No JWTs. |
| 9 | HTTP request smuggling | N/A | No server. |
| 10 | Web cache poisoning | N/A | No server/cache layer. |
| 11 | Spoofed X-Forwarded-For | N/A | No server-side request handling. |
| 12 | Postgres views bypassing RLS | N/A | No database. |
| 13 | `Math.random()` for security tokens | No | `Math.random()` is used only in `core.js` to seed a decorative particle-field position array for the 3D gears hero — not a security token. |
| 14 | Timing attacks on secret comparison | N/A | No secrets/credentials to compare. |
| 15 | Padding oracle | N/A | No encryption/decryption. |
| 16 | Server-side prototype pollution | N/A | No server. |
| 17 | Server-side template injection | N/A | No server, no templating engine. |
| 18 | XXE | N/A | No XML parsing. |
| 19 | Cross-site WebSocket hijacking | N/A | No WebSockets. |
| 20 | Unicode username normalization | N/A | No usernames/accounts. |

## Findings outside the 20-point list

None. `esc()` (`core.js:6`) escapes `&`/`<`/`>` and is applied to user-entered
service-log fields (asset name, notes) wherever they're interpolated into
`innerHTML`; no `esc()` output is used to build an `href`/`src` attribute
anywhere in this app (the pattern that would make the quote-escaping gap seen
in a few of this author's other repos matter), so the narrower escape set
here is safe as used.

No fixes are proposed or applied in this review.
