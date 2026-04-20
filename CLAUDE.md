# Northstar — Claude briefing

Read this at the start of every session. It captures the working context built up across multiple conversations so you don't need to re-derive it from scratch.

---

## What Northstar is

A personal music library manager. It doesn't store audio — it stores the user's relationship with music: artists, albums, tracks, playlists, tags, notes, and listening history.

Source-agnostic. Northstar links to audio wherever it lives — Spotify, YouTube, Google Drive, or any supported source. If the user switches services, the library stays intact. Only the source links change.

Currently in the **spec writing phase**, pre-development.

---

## The user

Solo developer and founder. Strong product instincts. Technically capable — the spec is written to a level of precision that development can follow directly.

**How they work:**
- Prefers to reason decisions out loud before writing anything down
- Reviews drafts before approving — don't write to files without showing a draft or getting a go-ahead
- Values concision: no filler, no padding, no vague aspirational language
- Defers anything not fully understood rather than half-speccing it

---

## Repo structure

```
Northstar.git/
├── CLAUDE.md               ← this file
├── TASKS.md                ← phase-by-phase task tracker with inline reasoning notes
├── Ideas.md                ← deferred ideas, not committed to spec
├── Northstar in simple terms.md   ← anchor document, user-facing
├── PostmanApiTesting.md    ← Spotify API testing notes
├── Spec/
│   ├── 1. Data Model.md    ← source of truth for all entities
│   ├── Design Principles.md
│   ├── Features/
│   │   ├── Capture Mode.md
│   │   ├── Import.md
│   │   ├── Notes.md
│   │   ├── Player.md
│   │   ├── Playlists.md
│   │   └── Tags.md
│   └── Integrations/
│       ├── Spotify.md
│       ├── YouTube.md
│       └── Google Drive.md
├── Brainstorm/             ← legacy, outdated. Do not reference.
└── Functional Specification/  ← legacy, outdated. Do not reference.
```

**Active work lives in `Spec/`.** The `Brainstorm/` and `Functional Specification/` folders are from before the current spec effort and will eventually be deleted.

---

## Spec structure

Every feature spec follows this structure:

1. **What it is** — one paragraph, plain English
2. **Behavior** — the rules, broken into named subsections
3. **States** — meaningful states the feature or entity can be in (even if not persisted — include the section and explain if states are runtime-only)
4. **Constraints** — hard limits, version-scoped limitations
5. **Edge cases** — a table of scenario → behavior

The Data Model (`Spec/1. Data Model.md`) defines every entity and its fields. Feature specs reference it — they don't redefine it. If a feature spec needs to establish a rule about an entity, it references the entity by name and links to the data model.

Design Principles (`Spec/Design Principles.md`) govern all UI/UX decisions. The four principles are **Intentional**, **Snappy**, **Tactile**, and **Adaptive**. Every controls or layout decision should be evaluated against them.

---

## Tone and writing style

- **Plain, direct prose.** No marketing language. No hedging.
- **Decisions are stated as facts.** "A note is deleted when the user clears the field." Not "A note could be deleted when..."
- **Open questions are resolved before writing.** Don't leave inline TBDs or unresolved forks in the spec.
- **Anything not fully understood is deferred to Ideas.md.** A half-specced feature is worse than no spec.
- **No padding.** If a section doesn't have meaningful content, say so briefly and move on (see Notes.md → States as an example).

---

## Key decisions — do not revisit without good reason

| Decision | Detail |
|---|---|
| No `mode` field on Playlist | Mode is inferred from contents: manual tracks only = manual, tag_filters only = tag-driven, both = mixed |
| `source_links` not `service_links` | Source-agnostic from the start — Spotify, YouTube, and cloud storage are all valid sources |
| Capture Mode: immediate persistence + `pending_review` | No staging buffer. New entities go straight to the library flagged for review. Existing entities are reused without flagging. |
| ListeningEvent threshold: percentage-based | 40% of track duration (user-configurable). Not a flat time value. |
| History: global feed, not per-entity | Undo is grouped for bulk operations. `capture_session_id` links all entities created in a single capture session. |
| Tag hierarchy: two-level max | `parent_ids` UUID[] — many-to-many. A tag with children cannot itself have a parent. |
| Notes: auto-save, delete by clearing | No explicit save action. No confirmation on delete. Undo available within grace period. |
| Import: no generated tag filters | Tag filters are always user-defined. Import never creates them. |
| Discovery mode: polling, not push | Spotify does not push playback events. Northstar polls `GET /v1/me/player/currently-playing` every ~3–5s while Discovery mode is active, backing off in the background. |
| Discovery mode: Spotify Premium required | Hard constraint. Free-tier users cannot use Discovery mode. Surface a clear explanation, not a generic error. |

---

## Where things stand

See `TASKS.md` for the current phase breakdown and status.
