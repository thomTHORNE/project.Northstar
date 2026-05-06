# Tasks

A phase-by-phase tracker for the Northstar spec writing project. Update this file as work progresses. Tasks may include inline notes capturing reasoning, deferred decisions, or context that's only relevant while the task is open.

---

## Phase 1 — Foundation

- [x] Anchor document — [Northstar in simple terms.md](Northstar%20in%20simple%20terms.md)
- [ ] Data Model — [Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
    - [ ] `#1` **Album track order has no storage mechanism** — The model says albums have ordered tracks but no field or join table can encode a track's position within a specific album. Either add a `track_ids` ordered array on Album or define a junction table (Album ↔ Track) with a `position` field. Affects Player (album tracklist) and Import (preserving Spotify album ordering).
    - [x] `#2` **Album deletion cascade describes wrong field** — The cascade says "their `album_id` is set to null" but the field is `album_ids` (UUID[]). Setting to null would wipe all album associations from the track. The correct behavior is removing the deleted album's ID from the array.
    - [ ] `#3` **`capture_session_id` has no source entity** — This UUID appears in History and ListeningEvent but is never generated or stored anywhere in the data model. Decide: add a lightweight Capture Session entity, or define it as a UUID generated when Capture Mode is enabled and stored on the Playlist. The Data Model needs to document the origin.
    - [ ] `#4` **Tag association undo is underspecified** — Undoing a tag deletion must restore all its associations across tracks, artists, albums, and playlists. History's `entity_snapshot` captures the tag's own state, not its association membership. Define how tag associations are recorded in History so the grouped undo can fully reverse a tag deletion.
- [x] Design Principles — [Spec/Design Principles.md](Spec/Design%20Principles.md)

---

## Phase 2 — Feature Specs

- [ ] Playlists — [Spec/Features/Playlists.md](Spec/Features/Playlists.md)
    - [ ] `#6` **Tag filter OR logic not stated** — The Tags spec says "any of those tags" (OR logic) but Playlists.md says "matches its tag filters" without defining what "matches" means. Add one line making the OR semantics explicit.
    - [ ] `#7` **Tag-matched track ordering unspecified** — The spec says tag-matched track order is not user-controllable but never states what the default order is. Define it (e.g. date added to library, alphabetical by title).
- [x] Capture Mode — [Spec/Features/Capture%20Mode.md](Spec/Features/Capture%20Mode.md)
- [x] Tags — [Spec/Features/Tags.md](Spec/Features/Tags.md)
- [ ] Notes — [Spec/Features/Notes.md](Spec/Features/Notes.md)
    - [ ] `#5` **"Grace period" terminology conflict** — Notes uses "grace period" for undo window (how long a deletion can be undone). Capture Mode uses the same term for the pending_review auto-action timer. These are different concepts. Notes should reference the History retention window instead.
- [x] Import — [Spec/Features/Import.md](Spec/Features/Import.md)
- [x] Player — [Spec/Features/Player.md](Spec/Features/Player.md)

---

## Phase 3 — API Design

### Integrations

- [ ] Spotify — [Spec/Integrations/Spotify.md](Spec/Integrations/Spotify.md)
    - [x] **Define source link format for Spotify entities** — Source links store bare IDs only: `{ source: "spotify", id: "{id}" }`. The Spotify handler constructs URIs at use time. IDs are extracted from URIs or URLs at import time. `Link` type defined in Data Model.
    - [x] **Discovery mode autoplay dependency** — Spotify's autoplay after the seed track ends is a user account setting Northstar cannot read or control. If it's off, the session goes idle immediately after the seed track. Add an edge case to Spotify.md and Player.md (Discovery mode section).
    - [x] **Progress tracking mechanism** — both the ListeningEvent threshold (40%) and the Capture Mode threshold (30s) require reliable playback position. Polling `currently-playing` at 3–5s is too coarse for a 30s threshold. Specify that the Web Playback SDK's `player_state_changed` events are the mechanism for progress tracking; polling is for track-change detection only. Add to Spotify.md.
    - [x] **Discovery mode queue view is shallow** — resolved by adding a queue re-fetch note to Player.md (re-fetched on each track change via `subscribeToPlayerState()`). Depth constraint not specced — exact limit unverified and considered an implementation detail.
    - [x] **Web Playback SDK is incompatible with Flutter native** — Resolved. Mobile (iOS/Android) uses `spotify_sdk` wrapping the native Spotify SDKs. Desktop targets Flutter web, where `spotify_sdk` wraps the Web Playback SDK. See [Spec/Architecture.md](Spec/Architecture.md) → Platform targets.
    - [ ] `#18` **Verify App Remote SDK scope requirements on mobile** — `streaming`, `user-read-email`, and `user-read-private` are documented as Web Playback SDK requirements and marked Desktop only in the scopes table. Confirm at implementation time whether the App Remote SDK requires any additional OAuth scopes for iOS/Android. Update the scopes table if so.
    - [ ] `#8` **Import endpoints not specified** — Spotify.md commits to import support but lists no API endpoints. Add: `GET /v1/me/tracks`, `GET /v1/me/albums`, `GET /v1/me/playlists`, `GET /v1/playlists/{id}/tracks`, `GET /v1/me/following?type=artist` for service import; `GET /v1/tracks/{id}`, `GET /v1/albums/{id}`, `GET /v1/artists/{id}`, `GET /v1/playlists/{id}` for link import.
    - [ ] `#9` **Pagination strategy** — Spotify endpoints return 20–50 items per page. Define how Northstar pages through large libraries: offset vs cursor, page size, and behavior if import is interrupted mid-page.
    - [ ] `#10` **Initial playback / device activation flow** — On desktop, Northstar must initialise the Web Playback SDK, receive a device ID, then transfer playback to that device (`PUT /v1/me/player`) or target it in the play call before any audio can start. This sequence is undocumented.
    - [ ] `#11` **Rate limit / 429 handling** — No retry or backoff strategy defined. Specify: honor the `Retry-After` header on 429 responses, define an exponential backoff for retries, and define what the user sees if rate limiting persists beyond a reasonable threshold.
    - [x] `#12` **Skip-back semantics** — Player.md's 3-second rule requires Spotify-specific implementation: if elapsed > 3s, call `PUT /v1/me/player/seek?position_ms=0` instead of `POST /v1/me/player/previous`. Must be documented in Spotify.md as a per-source behavior.
    - [ ] `#13` **Mobile: Spotify app must be running, not just installed** — The App Remote SDK requires the Spotify app to be running (or capable of being backgrounded and resumed). The current constraint only says "installed" — this is insufficient. Deferred to implementation time; verify exact App Remote SDK behaviour before updating the spec.
    - [ ] `#14` **Disconnect flow** — No behavior defined for when the user disconnects their Spotify account. Existing source links become unplayable. Define: whether tracks are flagged, what the user sees, and whether re-connecting restores playback without re-import.
    - [ ] `#15` **OAuth initial flow / redirect URI strategy** — PKCE initial flow is mentioned but not sketched. Redirect URI strategy differs by platform: custom URL scheme on iOS/Android, localhost loopback or app-internal handler on the Flutter web build. Specify what URIs must be registered with Spotify's developer dashboard.
    - [ ] `#16` **Play call payload shape** — `PUT /v1/me/player/play` accepts different payloads: `uris` (track array) or `context_uri` (album/playlist) with optional `offset` and `position_ms`. Specify which shape Northstar uses for Library-mode queue replay vs Discovery-mode seed track.
    - [ ] `#17` **Playlist import scope** — `GET /v1/me/playlists` returns owned, followed, and collaborative playlists. Spec must define which are imported — likely owned and collaborative but not followed, though this is an open decision.
    - [ ] `#19` **Image URL TTL** — Spotify image URLs (cover art, artist photos) may expire. Define whether Northstar caches them locally, proxies them through the backend, or stores them as opaque references and re-fetches on demand.
    - [ ] `#20` **Track metadata staleness** — Tracks are frozen at import time. If a track's title or metadata changes on Spotify after import, Northstar's copy is unaffected. This is the correct behavior but should be stated explicitly in the spec.
- [ ] YouTube — [Spec/Integrations/YouTube.md](Spec/Integrations/YouTube.md)
- [ ] Google Drive — [Spec/Integrations/Google%20Drive.md](Spec/Integrations/Google%20Drive.md)

### API surface

- [ ] `#21` REST API surface
- [ ] `#22` Playback API (Library mode + Discovery mode)
- [ ] `#23` Polling design for Discovery mode

---

## Phase 4 — Architecture

- [ ] `#24` Tech stack decision
- [ ] `#25` Data storage and persistence
- [ ] `#26` Cross-source queue handoff (pre-initialisation)
    > **Note:** The challenge is the handoff — the next source's player must be initialised and ready before the current source session closes, to avoid a gap. This is a sequencing and preload problem, not an audio processing problem. The architecture must account for pre-initialising the next source player before the current track ends.

- [ ] `#27` Discovery mode polling (cadence, rate limits, background behaviour)
    > **Note:** Tune polling cadence to balance responsiveness (catching a track change quickly) against rate limit exposure. ~3–5s while active, backed off when the app is in the background.
- [ ] `#28` History retention window (undo eligibility)
- [ ] `#29` ListeningEvent storage and query design

---

## Phase 5 — User Flows

- [ ] `#30` First run / onboarding
- [ ] `#31` Importing music (service import + link import)
- [ ] `#32` Building a playlist (manual + tag-driven)
- [ ] `#33` Capture session end-to-end
- [ ] `#34` Reviewing pending (captured) items
- [ ] `#35` Discovery mode session

---

## Phase 6 — UI/UX

- [ ] `#36` Discovery mode — where the trigger lives (context menu, player controls, or both)
- [ ] `#37` Discovery mode — trigger visibility (only surfaced when a supported source is active)

---

## Spec review — open issues

A cross-spec audit for inconsistencies, data model gaps, and implementation blockers. Each item is also tracked as a sub-task under its relevant phase above.

**Severity key:**
- **Blocker** — missing spec that would produce broken or undefined behavior at implementation time
- **Gap** — incomplete or inconsistent spec that would cause a developer to make a wrong assumption
- **Minor** — should be addressed but low risk if deferred; implementation can proceed without it

| # | Severity | Issue | Phase |
|---|---|---|---|
| 1 | Blocker | Album track order has no storage mechanism — no field or join table can encode position within a specific album | Phase 1 |
| 3 | Blocker | `capture_session_id` has no source entity — UUID used in History and ListeningEvent but never defined or generated anywhere | Phase 1 |
| 4 | Blocker | Tag association undo underspecified — entity_snapshot can't reconstruct many-to-many associations on undo | Phase 1 |
| 8 | Blocker | Import endpoints not specified — Spotify.md commits to import support but lists no API endpoints | Phase 3 |
| 9 | Blocker | Pagination strategy not defined — Spotify paginates at 20–50 items; no strategy defined for large library imports | Phase 3 |
| 10 | Blocker | Initial playback device activation flow undocumented — desktop requires SDK init, device ID, and device transfer before any audio starts | Phase 3 |
| 11 | Blocker | Rate limit / 429 handling not defined — no retry or backoff strategy for Spotify API calls | Phase 3 |
| 5 | Gap | "Grace period" used for two different concepts — Capture Mode (pending_review timer) vs. Notes (undo window) | Phase 2 |
| 6 | Gap | Playlist filter OR logic stated in Tags spec but not Playlists spec | Phase 2 |
| 7 | Gap | Tag-matched track ordering in playlists unspecified — spec says not user-controllable but never states the default | Phase 2 |
| 14 | Gap | Disconnect flow undefined — no behavior specified when the user disconnects their Spotify account | Phase 3 |
| 15 | Gap | OAuth initial flow and redirect URI strategy not specified — platform-specific redirect URI requirements undocumented | Phase 3 |
| 16 | Gap | Play call payload shape unspecified — Library-mode and Discovery-mode use different `PUT /v1/me/player/play` payload shapes | Phase 3 |
| 17 | Gap | Playlist import scope undefined — owned vs followed vs collaborative playlists not distinguished | Phase 3 |

---

## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
