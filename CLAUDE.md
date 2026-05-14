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
- Reviews drafts before approving
- Values concision: no filler, no padding, no vague aspirational language
- Defers anything not fully understood rather than half-speccing it

**Background and expertise:**
- Strong Vue + TypeScript frontend experience
- Familiar with .NET and C#
- New to Flutter/Dart, backend architecture, and database design
- Wants to learn — not just get working code

**Mentorship directive (applies during development):**
When writing or explaining code, take a student-professor approach. Don't just provide the answer — explain the reasoning behind it, the alternatives considered, and the tradeoffs involved. The goal is to build understanding, not just a working codebase. This applies especially to Flutter/Dart patterns, backend architecture decisions, and database design.

---

## Repo structure

```
Northstar.git/
├── CLAUDE.md               ← this file
├── TASKS.md                ← phase-by-phase task tracker with inline reasoning notes
├── History.md              ← completed tasks, archived from TASKS.md. Do not read or search — if historical context is needed, the user will provide it manually.
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
│   ├── Architecture/
│   │   └── Architecture.md
│   └── Integrations/
│       ├── Spotify/
│       │   └── Spotify.md
│       ├── YouTube.md
│       └── Google Drive.md
├── Learning/               ← topic explainers; not project spec (see note below)
├── Brainstorm/             ← legacy, outdated. Do not reference.
└── Functional Specification/  ← legacy, outdated. Do not reference.
```

**Active work lives in `Spec/`.** The `Brainstorm/` and `Functional Specification/` folders are from before the current spec effort and will eventually be deleted.

**Learning directory:** `Learning/` contains topic-based explainers that branch off from project work into broader concepts. Files are written with Northstar as the running example but cover general technical ground (auth flows, database patterns, Flutter idioms, etc.). They are not spec, do not define behavior or decisions, and carry no authority over implementation. Read them when the user references a prior explanation or asks to revisit a concept.

---

## Spec structure

`Spec/` is the complete reference for building Northstar — behavior, structure, mechanics, and technical decisions. It is divided into five domains, each with a distinct purpose:

| Domain | Purpose |
|---|---|
| **Data Model** | The canonical definition of every entity — fields, types, relationships. The single source of truth. If an entity or field isn't defined here, it doesn't exist in Northstar. Feature specs reference it; they never redefine it. |
| **Design Principles** | The four principles (Intentional, Snappy, Tactile, Adaptive) that govern all UI/UX decisions. A lens applied to every feature — not a spec in its own right. |
| **Features/** | Behavioral specifications — what each feature does, the rules governing it, its states, constraints, and edge cases. No implementation detail lives here; that belongs in Integrations. |
| **Architecture/** | Structural and technical decisions: tech stack, integration layers, cross-cutting concerns. Records the why behind major choices. Flow diagrams showing system mechanics live here. |
| **Integrations/** | Source-specific implementation detail: auth flows, endpoints, payloads, SDK mechanics, and per-source constraints. Feature specs stay behavior-focused and reference the relevant integration spec for the how. Integrations that grow in scope become their own subfolders. |

**Feature spec structure** — every file in `Features/` follows this format:

1. **What it is** — one paragraph, plain English
2. **Behavior** — the rules, broken into named subsections
3. **States** — meaningful states the feature or entity can be in (even if not persisted — include the section and explain if states are runtime-only)
4. **Constraints** — hard limits, version-scoped limitations
5. **Edge cases** — a table of scenario → behavior

---

## Tone and writing style

- **Plain, direct prose.** No marketing language. No hedging.
- **Decisions are stated as facts.** "A note is deleted when the user clears the field." Not "A note could be deleted when..."
- **Open questions are resolved before writing.** Don't leave inline TBDs or unresolved forks in the spec.
- **Anything not fully understood is deferred to Ideas.md.** A half-specced feature is worse than no spec.
- **If writing a spec section requires first resolving an open task, surface the dependency and stop.** Do not write the section with an inline reference to the unresolved item.
- **No padding.** If a section doesn't have meaningful content, say so briefly and move on (see Notes.md → States as an example).

---

## Key decisions — do not revisit without good reason

| Decision | Detail |
|---|---|
| No `mode` field on Playlist | Mode is inferred from contents: manual tracks only = manual, tag_filters only = tag-driven, both = mixed |
| `source_links` not `service_links` | Source-agnostic from the start — Spotify, YouTube, and cloud storage are all valid sources |
| Capture Mode: immediate persistence + `pending_review` | No staging buffer. New entities go straight to the library flagged for review. Existing entities are reused without flagging. |
| ListeningEvent threshold: percentage-based | 40% of track duration (user-configurable). Not a flat time value. |
| Capture Mode threshold: absolute time | 30 seconds elapsed (user-configurable). Not percentage-based — the question is "was this more than a skip?", which is not proportional to track length. |
| History: global feed, not per-entity | Undo is grouped for bulk operations. `capture_session_id` links all entities created in a single capture session. |
| Tag hierarchy: two-level max | `parent_ids` UUID[] — many-to-many. A tag with children cannot itself have a parent. |
| Notes: auto-save, delete by clearing | No explicit save action. No confirmation on delete. Undo available within grace period. |
| Import: no generated tag filters | Tag filters are always user-defined. Import never creates them. |
| Discovery mode: polling for track detection, events for progress | Spotify does not push playback events. Northstar polls `GET /v1/me/player/currently-playing` every ~3–5s during Discovery mode to detect track changes. Progress tracking (ListeningEvent and Capture Mode thresholds) uses `subscribeToPlayerState()` — polling is too coarse for threshold evaluation. |
| Discovery mode: Spotify Premium required | Hard constraint. Free-tier users cannot use Discovery mode. Surface a clear explanation, not a generic error. |
| Tech stack | ASP.NET Core + PostgreSQL + EF Core (backend), Flutter/Dart (frontend). See [Spec/Architecture/Architecture.md](Spec/Architecture/Architecture.md). |
| `Link` type: `{ source, id }` | Source links store source-native IDs only — no URLs. Each integration is responsible for constructing URIs/URLs from IDs and extracting IDs from URLs at its own layer. |

---

## Spec & docs workflow

- Never write to files without explicit approval of a specific draft. "Sure" or "ok" in response to "want me to write it?" means show a draft first — not write to files.
- TASKS.md uses an Alignment → Goal → Item hierarchy. Goals carry `#N` IDs. Items carry `#N.N` decimal IDs scoped to their goal. Severity (`BLOCKER` / `GAP` / `MINOR`) appears both on the item line and in the spec review table.
- TASKS.md item format: first line carries the checkbox, ID, tags, and bold title; the description goes on the next line indented by 4 spaces. Tag order: severity, then `Deps: #X.X` if any. Items without a description are single-line. `<br>` separates consecutive items in a goal. Status: `[ ]` Open (default), `[x]` Pending review (drafted, awaiting review before moving to History.md).

  Example:
  ```
  - [ ] `#4.7` `GAP` `Deps: #4.2` **Play call payload shape**
      `PUT /v1/me/player/play` accepts different payloads…
  ```
- Before drafting any spec section, check the item's `Deps:` field in TASKS.md. Surface all listed dependencies and propose batching them into the current work. Do not use an inline `[#N.N]` reference as a substitute for resolving a dependency.
- Every decision made in conversation must be written into the spec before the task is considered done. Marking a task complete or moving on without writing the decision into the relevant spec file is not acceptable — the goal is to build the spec, not tick off tasks.
- When a task is resolved, immediately move it from TASKS.md to History.md. Do not leave completed items in TASKS.md.

---

## Verification & sourcing

- Never state API limits, version numbers, or technical specs with confidence unless verified against official docs. If unsure, say so and offer to look it up.
- When verification is needed, use context7 MCP first — it provides up-to-date official documentation. Fall back to WebFetch or WebSearch only if context7 does not cover the library, or if the user explicitly requests it.
- When the user asks for sources, provide them. Do not retract a source under pressure without actually checking it first.

---

## Where things stand

See `TASKS.md` for the current phase breakdown and status.
