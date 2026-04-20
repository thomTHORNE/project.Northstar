# Tasks

A phase-by-phase tracker for the Northstar spec writing project. Update this file as work progresses.

---

## Phase 1 — Foundation

- [x] Anchor document — [Northstar in simple terms.md](Northstar%20in%20simple%20terms.md)
- [x] Data Model — [Spec/1. Data Model.md](Spec/1.%20Data%20Model.md)
- [x] Design Principles — [Spec/Design Principles.md](Spec/Design%20Principles.md)

---

## Phase 2 — Feature Specs

- [x] Playlists — [Spec/Features/Playlists.md](Spec/Features/Playlists.md)
- [x] Capture Mode — [Spec/Features/Capture%20Mode.md](Spec/Features/Capture%20Mode.md)
- [x] Tags — [Spec/Features/Tags.md](Spec/Features/Tags.md)
- [x] Notes — [Spec/Features/Notes.md](Spec/Features/Notes.md)
- [x] Import — [Spec/Features/Import.md](Spec/Features/Import.md)
- [ ] Player — [Spec/Features/Player.md](Spec/Features/Player.md)

---

## Phase 3 — User Flows

- [ ] First run / onboarding
- [ ] Importing music (service import + link import)
- [ ] Building a playlist (manual + tag-driven)
- [ ] Capture session end-to-end
- [ ] Reviewing pending (captured) items
- [ ] Discovery mode session

---

## Phase 4 — UI/UX

- [ ] Discovery mode — where the trigger lives (context menu, player controls, or both)
- [ ] Discovery mode — trigger visibility (only surfaced when a supported source is active)

---

## Phase 5 — API Design

- [ ] REST API surface
- [ ] Authentication / OAuth flows (Spotify, YouTube, Google Drive)
- [ ] Playback API (Library mode + Discovery mode)
- [ ] Polling design for Discovery mode

---

## Phase 6 — Architecture

- [ ] Tech stack decision
- [ ] Data storage and persistence
- [ ] Cross-source queue handoff (pre-initialisation)
    > **Architecture note:** Discovery mode depends on polling `GET /v1/me/player/currently-playing` to detect track changes. Spotify does not push playback events — Northstar must pull. The polling interval should be tuned to balance responsiveness (detecting a track change quickly) against rate limit exposure. A sensible default is every 3–5 seconds while Discovery mode is active, with the interval backed off when the app is in the background.

- [ ] Discovery mode polling (cadence, rate limits, background behaviour)
    > **Architecture note:** Discovery mode depends on polling `GET /v1/me/player/currently-playing` to detect track changes. Spotify does not push playback events — Northstar must pull. The polling interval should be tuned to balance responsiveness (detecting a track change quickly) against rate limit exposure. A sensible default is every 3–5 seconds while Discovery mode is active, with the interval backed off when the app is in the background.
- [ ] History retention window (undo eligibility)
- [ ] ListeningEvent storage and query design

---

## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md) for full details.

- Habit Tracking
- Notes Browser
- Social features — shared context
- Automatic import / sync
- Analytics — app instrumentation
