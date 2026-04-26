# Tasks

A phase-by-phase tracker for the Northstar spec writing project. Update this file as work progresses. Tasks may include inline notes capturing reasoning, deferred decisions, or context that's only relevant while the task is open.

---

## Phase 1 — Foundation

- [x] Anchor document — [Northstar in simple terms.md](Northstar%20in%20simple%20terms.md)
- [ ] Data Model — [Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
    - [ ] **Album track order has no storage mechanism** — The model says albums have ordered tracks but no field or join table can encode a track's position within a specific album. Either add a `track_ids` ordered array on Album or define a junction table (Album ↔ Track) with a `position` field. Affects Player (album tracklist) and Import (preserving Spotify album ordering).
    - [ ] **Album deletion cascade describes wrong field** — The cascade says "their `album_id` is set to null" but the field is `album_ids` (UUID[]). Setting to null would wipe all album associations from the track. The correct behavior is removing the deleted album's ID from the array.
    - [ ] **`capture_session_id` has no source entity** — This UUID appears in History and ListeningEvent but is never generated or stored anywhere in the data model. Decide: add a lightweight Capture Session entity, or define it as a UUID generated when Capture Mode is enabled and stored on the Playlist. The Data Model needs to document the origin.
    - [ ] **Tag association undo is underspecified** — Undoing a tag deletion must restore all its associations across tracks, artists, albums, and playlists. History's `entity_snapshot` captures the tag's own state, not its association membership. Define how tag associations are recorded in History so the grouped undo can fully reverse a tag deletion.
- [x] Design Principles — [Spec/Design Principles.md](Spec/Design%20Principles.md)

---

## Phase 2 — Feature Specs

- [ ] Playlists — [Spec/Features/Playlists.md](Spec/Features/Playlists.md)
    - [ ] **Tag filter OR logic not stated** — The Tags spec says "any of those tags" (OR logic) but Playlists.md says "matches its tag filters" without defining what "matches" means. Add one line making the OR semantics explicit.
    - [ ] **Tag-matched track ordering unspecified** — The spec says tag-matched track order is not user-controllable but never states what the default order is. Define it (e.g. date added to library, alphabetical by title).
- [x] Capture Mode — [Spec/Features/Capture%20Mode.md](Spec/Features/Capture%20Mode.md)
- [x] Tags — [Spec/Features/Tags.md](Spec/Features/Tags.md)
- [ ] Notes — [Spec/Features/Notes.md](Spec/Features/Notes.md)
    - [ ] **"Grace period" terminology conflict** — Notes uses "grace period" for undo window (how long a deletion can be undone). Capture Mode uses the same term for the pending_review auto-action timer. These are different concepts. Notes should reference the History retention window instead.
- [x] Import — [Spec/Features/Import.md](Spec/Features/Import.md)
- [x] Player — [Spec/Features/Player.md](Spec/Features/Player.md)

---

## Phase 3 — API Design

### Integrations

- [ ] Spotify — [Spec/Integrations/Spotify.md](Spec/Integrations/Spotify.md)
    - [ ] **Define source link format for Spotify entities** — `PUT /v1/me/player/play` requires a Spotify URI (`spotify:track:{id}`), not a web URL. Decide whether source_links for Spotify entities are stored as URIs or URLs, and document it in the spec. Affects both playback (Library mode) and Discovery mode seeding.
    - [ ] **Discovery mode autoplay dependency** — Spotify's autoplay after the seed track ends is a user account setting Northstar cannot read or control. If it's off, the session goes idle immediately after the seed track. Add an edge case to Spotify.md and Player.md (Discovery mode section).
    - [ ] **Progress tracking mechanism** — both the ListeningEvent threshold (40%) and the Capture Mode threshold (30s) require reliable playback position. Polling `currently-playing` at 3–5s is too coarse for a 30s threshold. Specify that the Web Playback SDK's `player_state_changed` events are the mechanism for progress tracking; polling is for track-change detection only. Add to Spotify.md.
    - [ ] **Discovery mode queue view is shallow** — `GET /v1/me/player/queue` returns ~20 items max. Player.md implies a full queue view during Discovery mode; add a note that the queue view is limited to what Spotify exposes.
    - [x] **Web Playback SDK is incompatible with Flutter native** — Resolved. Mobile (iOS/Android) uses `spotify_sdk` wrapping the native Spotify SDKs. Desktop targets Flutter web, where `spotify_sdk` wraps the Web Playback SDK. See [Spec/Architecture.md](Spec/Architecture.md) → Platform targets. Spotify.md playback section needs rewriting to reflect the per-platform mechanism.
- [ ] YouTube — [Spec/Integrations/YouTube.md](Spec/Integrations/YouTube.md)
- [ ] Google Drive — [Spec/Integrations/Google%20Drive.md](Spec/Integrations/Google%20Drive.md)

### API surface

- [ ] REST API surface
- [ ] Playback API (Library mode + Discovery mode)
- [ ] Polling design for Discovery mode

---

## Phase 4 — Architecture

- [ ] Tech stack decision
- [ ] Data storage and persistence
- [ ] Cross-source queue handoff (pre-initialisation)
    > **Note:** The challenge is the handoff — the next source's player must be initialised and ready before the current source session closes, to avoid a gap. This is a sequencing and preload problem, not an audio processing problem. The architecture must account for pre-initialising the next source player before the current track ends.

- [ ] Discovery mode polling (cadence, rate limits, background behaviour)
    > **Note:** Tune polling cadence to balance responsiveness (catching a track change quickly) against rate limit exposure. ~3–5s while active, backed off when the app is in the background.
- [ ] History retention window (undo eligibility)
- [ ] ListeningEvent storage and query design

---

## Phase 5 — User Flows

- [ ] First run / onboarding
- [ ] Importing music (service import + link import)
- [ ] Building a playlist (manual + tag-driven)
- [ ] Capture session end-to-end
- [ ] Reviewing pending (captured) items
- [ ] Discovery mode session

---

## Phase 6 — UI/UX

- [ ] Discovery mode — where the trigger lives (context menu, player controls, or both)
- [ ] Discovery mode — trigger visibility (only surfaced when a supported source is active)

---

## Spec review — open issues

A cross-spec audit for inconsistencies, data model gaps, and implementation blockers. Each item is also tracked as a sub-task under its relevant phase above.

| Priority | Issue | Phase |
|---|---|---|
| 1 | Album track order has no storage mechanism — no field or join table can encode position within a specific album | Phase 1 |
| 2 | Album deletion cascade describes wrong field — says `album_id` (singular, nullable) but field is `album_ids` (UUID array) | Phase 1 |
| 3 | `capture_session_id` has no source entity — UUID used in History and ListeningEvent but never defined or generated anywhere | Phase 1 |
| 4 | Tag association undo underspecified — entity_snapshot can't reconstruct many-to-many associations on undo | Phase 1 |
| 5 | "Grace period" used for two different concepts — Capture Mode (pending_review timer) vs. Notes (undo window) | Phase 2 |
| 6 | Playlist filter OR logic stated in Tags spec but not Playlists spec | Phase 2 |
| 7 | Tag-matched track ordering in playlists unspecified — spec says not user-controllable but never states the default | Phase 2 |

---

## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
