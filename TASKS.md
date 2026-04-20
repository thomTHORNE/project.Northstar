# Tasks

A phase-by-phase tracker for the Northstar spec writing project. Update this file as work progresses. Tasks may include inline notes capturing reasoning, deferred decisions, or context that's only relevant while the task is open.

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

## Phase 3 — API Design

- [ ] REST API surface
- [ ] Authentication / OAuth flows (Spotify, YouTube, Google Drive)
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

## Ideas — deferred, not in active scope

See [Ideas.md](Ideas.md).
