# QR platform development

## Architecture

The existing JavaScript App Router, MongoDB models, cookie/JWT authentication,
green visual identity, and `qr-code-styling` designer are retained.

`app/qr/page.jsx` and the dashboard edit route use `QrBuilder`. The builder owns
content by type, the design, folder, saved document, and current step. Selecting
another type preserves unsaved form state. Changes to a saved dynamic code retain
its short code. WiFi stores its escaped connection payload directly and is static.

`QrContentForm` is a registry of individual editors under `components/Qr/types`.
`QrLandingContent` is the corresponding presentation registry. Both the scrollable
`PhoneMockup` and real scanner pages render these same presentation components.
The QR library is confined to the editor/management surface.

The flow is:

1. Controlled editor → shared client/server validation in `lib/qr-content.js`.
2. Authenticated `/api/qr` → owner-scoped MongoDB document.
3. Stable `/q/{shortCode}` → password gate if enabled → redirect or `/view`.
4. Analytics are recorded through Next's `after()` so failures do not block scans.
5. Existing `/r/{shortCode}` links use the same resolver.

Previewing a dynamic QR or continuing to Design saves it first. Its URL therefore
opens real content. Subsequent content changes must be saved to update live scans.
This is shown in the editor. PNG, SVG, and JPG downloads use the saved URL, with
WiFi as the static exception. EPS is not advertised.

## Configuration

Keep the existing `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET`.
Never expose these as `NEXT_PUBLIC_*` values.

- `QR_PUBLIC_ORIGIN`: canonical HTTPS origin, e.g. `https://qr.your-domain.com`.
  Required for creation/uploads in production. `NEXT_PUBLIC_APP_URL` is supported
  as a fallback. Development defaults to the request origin. A localhost QR cannot
  be opened from a different phone; use a reachable development origin to test it.
- `UPLOAD_DIR`: absolute path on a persistent disk. Required for production uploads.
  Development uses ignored `.uploads/`. Do not use an ephemeral serverless disk.
  Replace `app/lib/storage.js` with an object-storage adapter for such deployments.
- `ANALYTICS_HASH_SECRET`: optional dedicated secret for anonymous visitor hashing.
  Defaults to the access-token secret. Keep it stable to preserve visitor counts.
- `TRUST_GEO_HEADERS=true`: enable only behind infrastructure that overwrites
  `x-vercel-ip-country`. Otherwise countries are reported as Unknown.

Media files are publicly served under unguessable UUID URLs; they are intended
for QR landing pages, not private document storage. File signatures, MIME types,
sizes, and filenames are validated. Images allow PNG/JPEG/WebP up to 5 MB, PDFs
and audio up to 20 MB, and video up to 50 MB. Configure request-size limits and
storage quotas at your production reverse proxy. Retain uploaded files while
printed codes may reference them. No binary media is stored in MongoDB.

Billing is intentionally an honest unconfigured state: no fake trial countdown,
checkout, subscriptions, or invoices. A payment provider and product/pricing
decisions are still required before enabling paid plans.

## Compatibility and operations

Restart `next dev` after changing Mongoose schemas: cached compiled models retain
their previous schema until the process restarts. Existing URL-only links, social,
gallery, business, and menu codes retain their old redirect behavior. New records
use structured content. Older `inactive` status is treated as paused in management.

Older plaintext protection passwords are upgraded to bcrypt when accessed. New
passwords are hashed before saving and are never returned from owner APIs. Gate
cookies last one hour and are invalidated when the protection password changes.
Password attempts are limited in MongoDB using short-lived hashed keys.

No new scans store raw IP addresses or full user-agent strings. Historical scan
records are left intact; plan an explicit retention/migration policy for old data.
Unique visits use a random, HTTP-only visitor cookie and a keyed hash. Clearing
cookies can count a visitor again. All analytics date boundaries use UTC. CSV
exports contain the selected period's daily scan totals.

## Verification

```sh
npm run lint
npm run build
node --test tests/qr-content.test.mjs tests/qr-model.test.mjs
node tests/integration.mjs
```

Integration tests require a running **local development** server (default port
3000), the configured MongoDB connection, and network access. `TEST_BASE_URL`
can select another localhost port. The tests create disposable users, exercise
all 16 types plus ownership, stable edits, password gates, analytics, and folders,
then delete only records belonging to their exact test-user IDs. Never run against
a production server. The build fetches the project's existing Google Fonts.

Before launch, verify actual device scans and printed samples with your chosen
logo, gradients, background, public origin, media storage, and deployment platform.
