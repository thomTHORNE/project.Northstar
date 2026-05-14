# Tasks

Northstar spec writing tracker. Structure: Alignment → Goal → Item.

## Status

- `[ ]` **Open** — default state, not yet resolved.
- `[x]` **Pending review** — spec work drafted and committed, awaiting user review before moving to History.md.

Resolved tasks are moved to History.md rather than remaining checked.



## Alignment 1 — Foundation

::: toggle `#1` Data Model
All open issues in the data model are blockers — they must be resolved before development begins.

[Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
- - -
- [ ] `#1.1` `BLOCKER` **Album track order has no storage mechanism**
    The model says albums have ordered tracks but no field or join table can encode a track's position within a specific album. Either add a `track_ids` ordered array on Album or define a junction table (Album ↔ Track) with a `position` field. Affects Player (album tracklist) and Import (preserving Spotify album ordering).
<br>
- [ ] `#1.2` `BLOCKER` **`capture_session_id` has no source entity**
    This UUID appears in History and ListeningEvent but is never generated or stored anywhere in the data model. Decide: add a lightweight Capture Session entity, or define it as a UUID generated when Capture Mode is enabled and stored on the Playlist. The Data Model needs to document the origin.
<br>
- [ ] `#1.3` `BLOCKER` **Tag association undo is underspecified**
    Undoing a tag deletion must restore all its associations across tracks, artists, albums, and playlists. History's `entity_snapshot` captures the tag's own state, not its association membership. Define how tag associations are recorded in History so the grouped undo can fully reverse a tag deletion.
:::



## Alignment 2 — Feature Specs

::: toggle `#2` Playlists
[Spec/Features/Playlists.md](Spec/Features/Playlists.md)
- - -
- [ ] `#2.1` `GAP` **Tag filter OR logic not stated**
    The Tags spec says "any of those tags" (OR logic) but Playlists.md says "matches its tag filters" without defining what "matches" means. Add one line making the OR semantics explicit.
<br>
- [ ] `#2.2` `GAP` **Tag-matched track ordering unspecified**
    The spec says tag-matched track order is not user-controllable but never states what the default order is. Define it (e.g. date added to library, alphabetical by title).
:::

::: toggle `#3` Notes
[Spec/Features/Notes.md](Spec/Features/Notes.md)
- - -
- [ ] `#3.1` `GAP` **"Grace period" terminology conflict**
    Notes uses "grace period" for undo window (how long a deletion can be undone). Capture Mode uses the same term for the pending_review auto-action timer. These are different concepts. Notes should reference the History retention window instead.
:::



## Alignment 3 — Integrations

::: toggle `#4` Spotify
[Spec/Integrations/Spotify/Spotify.md](Spec/Integrations/Spotify/Spotify.md)

See [Spec/Architecture/Architecture.md](Spec/Architecture/Architecture.md) → Integration layers for the SDK vs Web API breakdown.
- - -
- [ ] `#4.1` `MINOR` **Verify App Remote SDK scope requirements on mobile**
    `streaming`, `user-read-email`, and `user-read-private` are documented as Web Playback SDK requirements and marked Desktop only in the scopes table. Confirm at implementation time whether the App Remote SDK requires any additional OAuth scopes for iOS/Android. Update the scopes table if so.
<br>
- [ ] `#4.2` `BLOCKER` **Initial playback / device activation flow**
    On desktop, Northstar must initialise the Web Playback SDK, receive a device ID, then transfer playback to that device (`PUT /v1/me/player`) or target it in the play call before any audio can start. This sequence is undocumented.
<br>
- [ ] `#4.3` `BLOCKER` **Rate limit / 429 handling**
    No retry or backoff strategy defined. Specify: honor the `Retry-After` header on 429 responses, define an exponential backoff for retries, and define what the user sees if rate limiting persists beyond a reasonable threshold.
<br>
- [ ] `#4.4` `MINOR` **Mobile: Spotify app must be running, not just installed**
    The App Remote SDK requires the Spotify app to be running (or capable of being backgrounded and resumed). The current constraint only says "installed" — this is insufficient. Deferred to implementation time; verify exact App Remote SDK behaviour before updating the spec.
<br>
- [ ] `#4.5` `GAP` **Disconnect flow**
    No behavior defined for when the user disconnects their Spotify account. Existing source links become unplayable. Define: whether tracks are flagged, what the user sees, and whether re-connecting restores playback without re-import.
<br>
- [x] `#4.6` **OAuth initial flow / redirect URI strategy**
    PKCE initial flow is mentioned but not sketched. Redirect URI strategy differs by platform: custom URL scheme on iOS/Android, localhost loopback or app-internal handler on the Flutter web build. Specify what URIs must be registered with Spotify's developer dashboard.
<br>
- [ ] `#4.7` `GAP` `Deps: #4.2` **Play call payload shape**
    `PUT /v1/me/player/play` accepts different payloads: `uris` (track array) or `context_uri` (album/playlist) with optional `offset` and `position_ms`. Specify which shape Northstar uses for Library-mode queue replay vs Discovery-mode seed track.
<br>
- [ ] `#4.8` `GAP` **Image URL TTL**
    Spotify image URLs (cover art, artist photos) may expire. Define whether Northstar caches them locally, proxies them through the backend, or stores them as opaque references and re-fetches on demand.
<br>
- [ ] `#4.9` `MINOR` **Track metadata staleness**
    Tracks are frozen at import time. If a track's title or metadata changes on Spotify after import, Northstar's copy is unaffected. This is the correct behavior but should be stated explicitly in the spec.
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
- [ ] `#7.1` `BLOCKER` **REST API surface**
<br>
- [ ] `#7.2` `BLOCKER` `Deps: #4.2, #4.7` **Playback API (Library mode + Discovery mode)**
<br>
- [ ] `#7.3` `GAP` **Polling design for Discovery mode**
:::



## Alignment 4 — Architecture

::: toggle `#8` Architecture
Deferred decisions to be resolved in Phase 4.

[Spec/Architecture/Architecture.md](Spec/Architecture/Architecture.md)
- - -
- [ ] `#8.1` `GAP` **Tech stack decision**
<br>
- [ ] `#8.2` `BLOCKER` **Data storage and persistence**
<br>
- [ ] `#8.3` `BLOCKER` **Cross-source queue handoff (pre-initialisation)**
    The next source's player must be initialised and ready before the current source session closes. This is a sequencing and preload problem — the architecture must account for pre-initialising the next source player before the current track ends.
<br>
- [ ] `#8.4` `GAP` **Discovery mode polling (cadence, rate limits, background behaviour)**
    Tune polling cadence to balance responsiveness against rate limit exposure. ~3–5s while active, backed off in the background.
<br>
- [ ] `#8.5` `GAP` **History retention window (undo eligibility)**
<br>
- [ ] `#8.6` `BLOCKER` **ListeningEvent storage and query design**
:::



## Alignment 5 — User Flows

::: toggle `#9` User Flows
End-to-end flows documenting how users move through Northstar's key features.
- - -
- [ ] `#9.1` `GAP` **First run / onboarding**
<br>
- [ ] `#9.2` `GAP` **Importing music (service import + link import)**
<br>
- [ ] `#9.3` `GAP` **Building a playlist (manual + tag-driven)**
<br>
- [ ] `#9.4` `GAP` **Capture session end-to-end**
<br>
- [ ] `#9.5` `GAP` **Reviewing pending (captured) items**
<br>
- [ ] `#9.6` `GAP` **Discovery mode session**
:::



## Alignment 6 — UI/UX

::: toggle `#10` Discovery mode UI
Where and how Discovery mode is surfaced in the UI.
- - -
- [ ] `#10.1` `GAP` **Discovery mode — where the trigger lives (context menu, player controls, or both)**
<br>
- [ ] `#10.2` `GAP` **Discovery mode — trigger visibility (only surfaced when a supported source is active)**
:::



## Spec review — open issues

**Severity key:**
- **Blocker** — missing spec that would produce broken or undefined behavior at implementation time
- **Gap** — incomplete or inconsistent spec that would cause a developer to make a wrong assumption
- **Minor** — should be addressed but low risk if deferred; implementation can proceed without it

| ID | Severity | Status | Issue | Deps |
|---|---|---|---|---|
| 1.1 | Blocker | Open | Album track order has no storage mechanism — no field or join table can encode position within a specific album | — |
| 1.2 | Blocker | Open | `capture_session_id` has no source entity — UUID used in History and ListeningEvent but never defined or generated anywhere | — |
| 1.3 | Blocker | Open | Tag association undo underspecified — entity_snapshot can't reconstruct many-to-many associations on undo | — |
| 4.2 | Blocker | Open | Initial playback device activation flow undocumented — desktop requires SDK init, device ID, and device transfer before any audio starts | — |
| 4.3 | Blocker | Open | Rate limit / 429 handling not defined — no retry or backoff strategy for Spotify API calls | — |
| 7.1 | Blocker | Open | REST API surface not specified | — |
| 7.2 | Blocker | Open | Playback API not specified (Library mode + Discovery mode) | #4.2, #4.7 |
| 8.2 | Blocker | Open | Data storage and persistence not decided | — |
| 8.3 | Blocker | Open | Cross-source queue handoff (pre-initialisation) not designed | — |
| 8.6 | Blocker | Open | ListeningEvent storage and query design not specified | — |
| 2.1 | Gap | Open | Playlist filter OR logic stated in Tags spec but not Playlists spec | — |
| 2.2 | Gap | Open | Tag-matched track ordering in playlists unspecified — spec says not user-controllable but never states the default | — |
| 3.1 | Gap | Open | "Grace period" used for two different concepts — Capture Mode (pending_review timer) vs. Notes (undo window) | — |
| 4.5 | Gap | Open | Disconnect flow undefined — no behavior specified when the user disconnects their Spotify account | — |
| 4.6 | Gap | Pending review | OAuth initial flow / redirect URI strategy — PKCE + App Remote SDK flows and redirect URIs specified | — |
| 4.7 | Gap | Open | Play call payload shape unspecified — Library-mode and Discovery-mode use different `PUT /v1/me/player/play` payload shapes | #4.2 |
| 4.8 | Gap | Open | Image URL TTL undefined — Spotify image URLs may expire; caching/proxying strategy not decided | — |
| 7.3 | Gap | Open | Polling design for Discovery mode not specified | — |
| 8.1 | Gap | Open | Tech stack decision not documented in Architecture spec | — |
| 8.4 | Gap | Open | Discovery mode polling cadence / rate limits / background behaviour not tuned | — |
| 8.5 | Gap | Open | History retention window (undo eligibility) not specified | — |
| 9.1 | Gap | Open | First run / onboarding flow not documented | — |
| 9.2 | Gap | Open | Importing music flow not documented (service import + link import) | — |
| 9.3 | Gap | Open | Building a playlist flow not documented (manual + tag-driven) | — |
| 9.4 | Gap | Open | Capture session end-to-end flow not documented | — |
| 9.5 | Gap | Open | Reviewing pending (captured) items flow not documented | — |
| 9.6 | Gap | Open | Discovery mode session flow not documented | — |
| 10.1 | Gap | Open | Discovery mode trigger placement undecided (context menu, player controls, or both) | — |
| 10.2 | Gap | Open | Discovery mode trigger visibility rules undecided | — |
| 4.1 | Minor | Open | App Remote SDK scope requirements need verification at implementation time | — |
| 4.4 | Minor | Open | Mobile constraint says "installed" but App Remote SDK requires Spotify app running; verify behaviour at implementation | — |
| 4.9 | Minor | Open | Track metadata staleness — correct behavior (tracks frozen at import) not stated explicitly in spec | — |



## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
