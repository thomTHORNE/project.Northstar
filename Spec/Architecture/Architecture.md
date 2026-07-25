# Architecture

This document records Northstar's technical stack decisions and the reasoning behind them. It is the authoritative reference for technology choices. Detailed architecture decisions — storage design, background service patterns — are worked out in Phase 4 and added here as they are resolved.

---

## Local-first architecture

Northstar v1 runs entirely on the user's device. The library lives in an on-device database, which is the source of truth. There is no Northstar server, no Northstar account, and no Northstar-hosted user data.

### Why no backend

A backend earns its place doing some combination of five jobs. Four do not apply to Northstar:

| Job | Applies to v1 |
|---|---|
| Enforce a trust boundary between users | No. Northstar is multi-user but not multi-tenant — no two users' data shares infrastructure. Each install is an island, so there is no boundary to enforce. |
| Hold secrets the client cannot | No. Spotify auth uses Authorization Code with PKCE, designed for public clients and requiring no client secret. Tokens live in the OS secure enclave. |
| Be the source of truth across multiple clients | Deferred. See [Ideas.md](../../Ideas.md) → Northstar-owned sync. |
| Run work that outlives a client session | No. Playback, threshold evaluation, and Discovery mode are structurally device-resident — `spotify_sdk` and `subscribeToPlayerState()` run on the device, and a server cannot drive the Web Playback SDK in a user's browser. |
| Do compute the client cannot | No. A personal library is thousands of rows. There is no query here a phone cannot answer instantly. |

The two jobs that genuinely pull toward a backend are multi-device sync and durable off-device backup. Both are the same requirement — data living in more than one place. v1 meets the backup half with Backup & Restore: a manual export of the library to a file the user places wherever they choose. The sync half is deferred.

### Consequences

- **No Northstar account.** The only authentication in Northstar is to Spotify, granting delegated access to the user's own Spotify. It is per-device and creates no Northstar-side identity.
- **No multi-tenancy**, and therefore no per-request authorization and no per-row ownership checks.
- **Application logic runs on the device** — tag resolution, capture thresholds, undo, ListeningEvent aggregation. This serves the Snappy and Tactile principles directly: no network round-trip sits in front of a tag toggle or a playlist reorder.

[Learning/Backend and Database Necessity](../../Learning/Backend%20and%20Database%20Necessity/Backend%20and%20Database%20Necessity.md) works through this question in full. It is an explainer, not spec — this section is the decision.

---

## Tech stack

| Layer | Technology | Rationale |
|---|---|---|
| UI framework | Flutter | Mobile-first. Renders every pixel itself — no WebView. Consistent cross-platform behavior on iOS, Android, and desktop from a single codebase. Gesture handling and animations are first-class, directly aligned with the *Snappy* and *Tactile* design principles. Background audio via `just_audio` + `audio_service` provides proper native OS audio session integration. |
| Language | Dart | Flutter's native language. Syntactically similar to both TypeScript and C#, which reduces the learning curve given the existing background. |

---

## Platform targets

| Platform | Approach | Spotify playback mechanism |
|---|---|---|
| iOS | Flutter native | `spotify_sdk` — wraps native Spotify iOS SDK |
| Android | Flutter native | `spotify_sdk` — wraps native Spotify Android SDK |
| Desktop (macOS, Windows) | Flutter web in browser | `spotify_sdk` — wraps Spotify Web Playback SDK |

Desktop requires a browser with EME support. Chrome and Edge are supported. Safari is not supported for Spotify playback.

Desktop packaging — wrapping the Flutter web build in a native shell (e.g. Electron) to remove the browser window — is deferred. The web build is the same regardless of how it is eventually packaged.

---

## Integration layers — Spotify

Northstar uses two distinct Spotify integration points, differentiated by communication channel rather than feature domain.

**SDK (`spotify_sdk`) — local, push-based**

Handles direct device-level communication:
- Desktop: registers Northstar as a Spotify Connect device and streams audio in the browser (Web Playback SDK)
- Mobile: remote-controls the Spotify app on the device via a local connection (App Remote SDK)
- Both platforms: `subscribeToPlayerState()` delivers real-time player state updates (position, track, pause state) as a push subscription — used for ListeningEvent and Capture Mode threshold evaluation

**Spotify Web API — cloud-mediated, pull-based**

All REST calls to `api.spotify.com`. The SDK is not involved:
- Import — all service import and link import endpoints
- Playback commands (play, pause, seek, skip, volume) — routed through Spotify Connect's cloud to the active device
- Discovery mode polling (`GET /v1/me/player/currently-playing`) — track-change detection
- Queue fetching (`GET /v1/me/player/queue`)

Import does not require Spotify Premium. Premium is required only for playback API calls.

---

## Decisions deferred to Phase 4

- On-device database engine and data access layer
- Data storage and persistence design
- Durability of browser-origin storage on the desktop build
- Cross-source queue handoff architecture
- History retention window and undo eligibility
- ListeningEvent storage and query design
- Background service design for Discovery mode polling
