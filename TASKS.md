# Tasks

Northstar spec writing tracker. Structure: Alignment → Goal → Item.



## Alignment 1 — Foundation

::: toggle `#1` Data Model
All open issues in the data model are blockers — they must be resolved before development begins.

[Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
- - -
- [ ] `#1.1` **Album track order has no storage mechanism** — The model says albums have ordered tracks but no field or join table can encode a track's position within a specific album. Either add a `track_ids` ordered array on Album or define a junction table (Album ↔ Track) with a `position` field. Affects Player (album tracklist) and Import (preserving Spotify album ordering).
- [ ] `#1.2` **`capture_session_id` has no source entity** — This UUID appears in History and ListeningEvent but is never generated or stored anywhere in the data model. Decide: add a lightweight Capture Session entity, or define it as a UUID generated when Capture Mode is enabled and stored on the Playlist. The Data Model needs to document the origin.
- [ ] `#1.3` **Tag association undo is underspecified** — Undoing a tag deletion must restore all its associations across tracks, artists, albums, and playlists. History's `entity_snapshot` captures the tag's own state, not its association membership. Define how tag associations are recorded in History so the grouped undo can fully reverse a tag deletion.
:::



## Alignment 2 — Feature Specs

::: toggle `#2` Playlists
[Spec/Features/Playlists.md](Spec/Features/Playlists.md)
- - -
- [ ] `#2.1` **Tag filter OR logic not stated** — The Tags spec says "any of those tags" (OR logic) but Playlists.md says "matches its tag filters" without defining what "matches" means. Add one line making the OR semantics explicit.
- [ ] `#2.2` **Tag-matched track ordering unspecified** — The spec says tag-matched track order is not user-controllable but never states what the default order is. Define it (e.g. date added to library, alphabetical by title).
:::

::: toggle `#3` Notes
[Spec/Features/Notes.md](Spec/Features/Notes.md)
- - -
- [ ] `#3.1` **"Grace period" terminology conflict** — Notes uses "grace period" for undo window (how long a deletion can be undone). Capture Mode uses the same term for the pending_review auto-action timer. These are different concepts. Notes should reference the History retention window instead.
:::



## Alignment 3 — Integrations

::: toggle `#4` Spotify
[Spec/Integrations/Spotify.md](Spec/Integrations/Spotify.md)

See [Spec/Architecture.md](Spec/Architecture.md) → Integration layers for the SDK vs Web API breakdown.
- - -
- [ ] `#4.1` **Verify App Remote SDK scope requirements on mobile** — `streaming`, `user-read-email`, and `user-read-private` are documented as Web Playback SDK requirements and marked Desktop only in the scopes table. Confirm at implementation time whether the App Remote SDK requires any additional OAuth scopes for iOS/Android. Update the scopes table if so.
- [ ] `#4.2` **Initial playback / device activation flow** — On desktop, Northstar must initialise the Web Playback SDK, receive a device ID, then transfer playback to that device (`PUT /v1/me/player`) or target it in the play call before any audio can start. This sequence is undocumented.
- [ ] `#4.3` **Rate limit / 429 handling** — No retry or backoff strategy defined. Specify: honor the `Retry-After` header on 429 responses, define an exponential backoff for retries, and define what the user sees if rate limiting persists beyond a reasonable threshold.
- [ ] `#4.4` **Mobile: Spotify app must be running, not just installed** — The App Remote SDK requires the Spotify app to be running (or capable of being backgrounded and resumed). The current constraint only says "installed" — this is insufficient. Deferred to implementation time; verify exact App Remote SDK behaviour before updating the spec.
- [ ] `#4.5` **Disconnect flow** — No behavior defined for when the user disconnects their Spotify account. Existing source links become unplayable. Define: whether tracks are flagged, what the user sees, and whether re-connecting restores playback without re-import.
- [ ] `#4.6` **OAuth initial flow / redirect URI strategy** — PKCE initial flow is mentioned but not sketched. Redirect URI strategy differs by platform: custom URL scheme on iOS/Android, localhost loopback or app-internal handler on the Flutter web build. Specify what URIs must be registered with Spotify's developer dashboard.
- [ ] `#4.7` **Play call payload shape** — `PUT /v1/me/player/play` accepts different payloads: `uris` (track array) or `context_uri` (album/playlist) with optional `offset` and `position_ms`. Specify which shape Northstar uses for Library-mode queue replay vs Discovery-mode seed track. — Deps: #4.2
- [ ] `#4.8` **Image URL TTL** — Spotify image URLs (cover art, artist photos) may expire. Define whether Northstar caches them locally, proxies them through the backend, or stores them as opaque references and re-fetches on demand.
- [ ] `#4.9` **Track metadata staleness** — Tracks are frozen at import time. If a track's title or metadata changes on Spotify after import, Northstar's copy is unaffected. This is the correct behavior but should be stated explicitly in the spec.
:::

::: toggle `#5` YouTube
Spec not started.

[Spec/Integrations/YouTube.md](Spec/Integrations/YouTube.md)
- - -
:::

::: toggle `#6` Google Drive
Spec not started.

[Spec/Integrations/Google%20Drive.md](Spec/Integrations/Google%20Drive.md)
- - -
:::

::: toggle `#7` API Surface
REST and playback API surface for Northstar's backend.
- - -
- [ ] `#7.1` REST API surface
- [ ] `#7.2` Playback API (Library mode + Discovery mode) — Deps: #4.2, #4.7
- [ ] `#7.3` Polling design for Discovery mode
:::



## Alignment 4 — Architecture

::: toggle `#8` Architecture
Deferred decisions to be resolved in Phase 4.

[Spec/Architecture.md](Spec/Architecture.md)
- - -
- [ ] `#8.1` Tech stack decision
- [ ] `#8.2` Data storage and persistence
- [ ] `#8.3` Cross-source queue handoff (pre-initialisation) — The next source's player must be initialised and ready before the current source session closes. This is a sequencing and preload problem — the architecture must account for pre-initialising the next source player before the current track ends.
- [ ] `#8.4` Discovery mode polling (cadence, rate limits, background behaviour) — Tune polling cadence to balance responsiveness against rate limit exposure. ~3–5s while active, backed off in the background.
- [ ] `#8.5` History retention window (undo eligibility)
- [ ] `#8.6` ListeningEvent storage and query design
:::



## Alignment 5 — User Flows

::: toggle `#9` User Flows
End-to-end flows documenting how users move through Northstar's key features.
- - -
- [ ] `#9.1` First run / onboarding
- [ ] `#9.2` Importing music (service import + link import)
- [ ] `#9.3` Building a playlist (manual + tag-driven)
- [ ] `#9.4` Capture session end-to-end
- [ ] `#9.5` Reviewing pending (captured) items
- [ ] `#9.6` Discovery mode session
:::



## Alignment 6 — UI/UX

::: toggle `#10` Discovery mode UI
Where and how Discovery mode is surfaced in the UI.
- - -
- [ ] `#10.1` Discovery mode — where the trigger lives (context menu, player controls, or both)
- [ ] `#10.2` Discovery mode — trigger visibility (only surfaced when a supported source is active)
:::



## Spec review — open issues

**Severity key:**
- **Blocker** — missing spec that would produce broken or undefined behavior at implementation time
- **Gap** — incomplete or inconsistent spec that would cause a developer to make a wrong assumption
- **Minor** — should be addressed but low risk if deferred; implementation can proceed without it

| ID | Severity | Issue | Deps |
|---|---|---|---|
| 1.1 | Blocker | Album track order has no storage mechanism — no field or join table can encode position within a specific album | — |
| 1.2 | Blocker | `capture_session_id` has no source entity — UUID used in History and ListeningEvent but never defined or generated anywhere | — |
| 1.3 | Blocker | Tag association undo underspecified — entity_snapshot can't reconstruct many-to-many associations on undo | — |
| 4.2 | Blocker | Initial playback device activation flow undocumented — desktop requires SDK init, device ID, and device transfer before any audio starts | — |
| 4.3 | Blocker | Rate limit / 429 handling not defined — no retry or backoff strategy for Spotify API calls | — |
| 3.1 | Gap | "Grace period" used for two different concepts — Capture Mode (pending_review timer) vs. Notes (undo window) | — |
| 2.1 | Gap | Playlist filter OR logic stated in Tags spec but not Playlists spec | — |
| 2.2 | Gap | Tag-matched track ordering in playlists unspecified — spec says not user-controllable but never states the default | — |
| 4.5 | Gap | Disconnect flow undefined — no behavior specified when the user disconnects their Spotify account | — |
| 4.6 | Gap | OAuth initial flow and redirect URI strategy not specified — platform-specific redirect URI requirements undocumented | — |
| 4.7 | Gap | Play call payload shape unspecified — Library-mode and Discovery-mode use different `PUT /v1/me/player/play` payload shapes | #4.2 |



## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
