# Tasks

Northstar spec writing tracker. Structure: Alignment → Goal → Item.

## Status

- `[ ]` **Open** — default state, not yet resolved.
- `[x]` **Pending review** — spec work drafted and committed, awaiting user review.

Resolved tasks are removed from TASKS.md and recorded in that day's DAYS.md card with state `CLOSED`.

## Severity

- `BLOCKER` — missing spec that would produce broken or undefined behavior at implementation time.
- `GAP` — incomplete or inconsistent spec that would cause a developer to make a wrong assumption.
- `MINOR` — should be addressed but low risk if deferred; implementation can proceed without it.



## Alignment 1 — Foundation

::: toggle `#1` Data Model
All open issues in the data model are blockers — they must be resolved before development begins.

[Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
- - -
- [ ] `#1.2` `BLOCKER` **`capture_session_id` has no source entity**
    This UUID appears in History and ListeningEvent but is never generated or stored anywhere in the data model. Decide: add a lightweight Capture Session entity, or define it as a UUID generated when Capture Mode is enabled and stored on the Playlist. The Data Model needs to document the origin. Note: a `PlaylistTrack` record could additionally carry it to record which session added a track — that is provenance, and complementary to this question rather than an answer to it. Nothing in Capture Mode currently requires it.
<br>
- [ ] `#1.3` `BLOCKER` **Association undo granularity is underspecified**
    Associations are records History can name and reverse, and the Tag deletion cascade already commits to restoring them as one grouped operation. What remains is granularity: how association changes compose into a single undoable operation, and where the boundary of one operation sits. This is the subject of `Research/Operation Layer`, which is stress-testing exactly this against History. Held deliberately until that research resolves — do not answer it from momentum.
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

::: toggle `#11` Backup & Restore
[Spec/Features/Backup & Restore.md](Spec/Features/Backup%20&%20Restore.md)
- - -
No open items.
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
- [x] `#4.6` `GAP` **OAuth initial flow / redirect URI strategy**
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
<br>
- [ ] `#4.10` `MINOR` **Free-tier authorization on desktop**
    The `streaming` scope requires Premium. Spotify's docs do not state whether requesting it fails authorization outright for a free account or grants an unusable scope. Verify empirically at implementation time. If it fails, desktop needs incremental authorization — import scopes at connect, `streaming` requested when playback is first attempted. Architecture.md's "import does not require Premium" is contingent on this. Also reword Authentication.md's single-authorization line to make the platform-conditional scope set explicit.
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
- [ ] `#8.2` `BLOCKER` **On-device database engine and data access layer**
    The storage model is decided — local-first, on-device database as source of truth. The engine is not. Drift/SQLite, Isar, and ObjectBox are candidates. Affects how array-typed fields are modelled.
<br>
- [ ] `#8.3` `BLOCKER` **Cross-source queue handoff (pre-initialisation)**
    The next source's player must be initialised and ready before the current source session closes. This is a sequencing and preload problem — the architecture must account for pre-initialising the next source player before the current track ends.
<br>
- [ ] `#8.4` `GAP` **Discovery mode polling (cadence, rate limits, background behaviour)**
    Tune polling cadence to balance responsiveness against rate limit exposure. ~3–5s while active, backed off in the background.
<br>
- [ ] `#8.5` `GAP` **History retention window (undo eligibility)**
    History exists for reversibility, not archiving — undo eligibility and retention are one window, not two. The value is still open. A bounded window closes the path to using History as a deletion record for future sync.
<br>
- [ ] `#8.6` `BLOCKER` **ListeningEvent storage and query design**
<br>
- [ ] `#8.7` `GAP` `Deps: #8.2` **`source_links` storage representation**
    `source_links` remains `Link[]` on Track, Artist, and Album. Unlike the relationships now carried by associations, this is a list of value objects with no entity on the far side, so the junction convention does not apply to it. SQLite has no array type: store as a JSON column, or as a child table. Decide once the storage engine is chosen.
<br>
- [ ] `#8.8` `GAP` **Durability of browser-origin storage on the desktop build**
    The desktop target is Flutter web, so the library would live in browser-origin storage, which is evictable. Verify current Storage API persistence guarantees before speccing.
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



## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
