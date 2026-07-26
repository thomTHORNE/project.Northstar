# Northstar — Claude briefing

Read this at the start of every conversation. It captures the working context built up across multiple conversations so you don't need to re-derive it from scratch.

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
├── DAYS.md                 ← work log, day sections with session cards, newest first
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
├── Research/               ← ideas developed in parallel to spec; no authority (see below)
│   ├── Seed.md             ← the initiative behind the current topics; frozen origin appendix
│   ├── Operation Layer/
│   ├── Agent Parity/
│   └── Habit Tracking/
├── Learning/               ← topic explainers; not project spec (see note below)
├── History.md              ← legacy, superseded by DAYS.md. Do not read, search, or reference.
├── Brainstorm/             ← legacy, outdated. Do not read, search, or reference.
└── Functional Specification/  ← legacy, outdated. Do not read, search, or reference.
```

**Active work lives in `Spec/`.** `History.md`, `Brainstorm/`, and `Functional Specification/` are from before the current effort and will eventually be deleted. Do not read or search them — if historical context is needed, the user will provide it manually.

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

## Research

`Research/` is where an idea that has outgrown `Ideas.md` is developed in parallel to the spec. Each topic is a subdirectory following `<Topic>/<Topic>.md`, plus whatever supporting files it needs.

Research carries no authority. It does not define behavior and nothing in it constrains implementation — it is thinking in progress, not a decision. Where `Learning/` explains concepts and `Ideas.md` parks possibilities, `Research/` is the one place with a path out: a topic developed thoroughly and shown to apply to Northstar is promoted into `Spec/`, and the research document stops being the reference the moment it lands there.

**Topics are split by blocker, not by subject.** Two threads sharing a subject but waiting on different things belong in separate topics, so neither is held up by the other's blocker. Parallel development is the reason the directory exists.

**Findings are owned by the document they change**, not the one they were discovered in. A finding at the seam between two topics belongs to the topic that must change if it holds. Every topic carries a `Dependencies` section naming both directions — what it requires from other topics, and what requires it.

**Topic status**, carried on the first line of the topic document:

| Status | Meaning |
|---|---|
| `Open` | Under research |
| `Ready` | Cleared the promotion bar, held by a dependency. Earns a TASKS.md item carrying the `Deps:` that blocks it |
| `Promoted` | Landed in spec. The research document is no longer the reference |

Research stays out of TASKS.md while it is still research. A topic enters the tracker only at `Ready`, at which point its promotion is spec work like anything else and the existing DAYS.md vocabulary covers it.

**Promotion bar.** A topic is ready when its open questions are resolved rather than listed, and its conclusions can be stated as decisions in the spec's own voice.

Partial promotion is allowed for sections that stand on their own justification. A section whose reason depends on a topic that has not itself promoted does not go early with a forward reference — it waits, and the topics promote together. A rule in the spec justified by something that does not exist yet cannot be evaluated by the person reading it.

---

## Tone and writing style

- **Plain, direct prose.** No marketing language. No hedging.
- **Decisions are stated as facts.** "A note is deleted when the user clears the field." Not "A note could be deleted when..."
- **Open questions are resolved before writing.** Don't leave inline TBDs or unresolved forks in the spec.
- **Anything not fully understood is deferred to Ideas.md.** A half-specced feature is worse than no spec.
- **No padding.** If a section doesn't have meaningful content, say so briefly and move on (see Notes.md → States as an example).

---

## Spec & docs workflow

- Never write to files without explicit approval of a specific draft. "Sure" or "ok" in response to "want me to write it?" means show a draft first — not write to files.
- TASKS.md uses an Alignment → Goal → Item hierarchy. Goals carry `#N` IDs. Items carry `#N.N` decimal IDs scoped to their goal. Severity (`BLOCKER` / `GAP` / `MINOR`) is carried on the item line only. TASKS.md holds no second index of items — the Alignment → Goal → Item hierarchy is the whole file.
- TASKS.md item format: first line carries the checkbox, ID, tags, and bold title; the description goes on the next line indented by 4 spaces. Tag order: severity, then `Deps: #X.X` if any. Items without a description are single-line. `<br>` separates consecutive items in a goal. Status: `[ ]` Open (default), `[x]` Pending review (drafted, awaiting review).

  Example:
  ```
  - [ ] `#4.7` `GAP` `Deps: #4.2` **Play call payload shape**
      `PUT /v1/me/player/play` accepts different payloads…
  ```
- Before drafting any spec section, check the item's `Deps:` field in TASKS.md. Surface all listed dependencies and propose batching them into the current work. Do not use an inline `[#N.N]` reference as a substitute for resolving a dependency.
- Every decision made in conversation must be written into the spec before the task is considered done. Marking a task complete or moving on without writing the decision into the relevant spec file is not acceptable — the goal is to build the spec, not tick off tasks.
- When an item is resolved, remove it from TASKS.md entirely and record it in the current DAYS.md session card with action `CLOSED`. Do not leave completed items in TASKS.md.
- Decisions recorded in the spec are settled. Reopen one when something new is known — not because it feels uncertain again. DAYS.md summarizes decisions as they were made; those summaries point to the spec, they never replace it.

---

## DAYS.md — work log

DAYS.md is the work log, replacing History.md. Days are `## YYYY-MM-DD` sections, newest first, separated by `---`; each holds one or more session cards. Its job is to make coming back after time away cheap: read the last two days and the train of thought is back.

A session is a stretch of work, not a chat — one session may span several chats, and a day may hold any number of them. Sessions are numbered from 1 within their day and the numbering does not run across days. Within a day, cards are ordered newest first, matching the day order — the top of the file is always the most recent session.

**Card format**

```
## YYYY-MM-DD

::: toggle Session 1 — What it turned out to be about
- Decision summary, carrying a link to the spec entry where it actually lives
- - -
- `ACTION` `#N.N` `SEVERITY` **Item title**
- - -
Conclusion — what the session amounted to
- - -
→ Next: what the next session picks up, and why
:::
```

**Title** — names what the session turned out to be about, not the route it took, written when the session closes. Two threads joined by a comma is the ceiling; a title that won't fit in a few words usually means the session should have closed earlier.

**Decisions** — succinct summaries written for a human returning cold. They are not authority. The spec is authority; these point at it.

**Items** — title only, no description. A card records the **action** taken on an item in that session, not its standing state.

| Action | Resulting TASKS.md state | Meaning |
|---|---|---|
| `OPENED` | `[ ]` | Item created in that session |
| `REVISED` | `[ ]` | Scope or description changed |
| `PENDING REVIEW` | `[x]` | Spec drafted and committed, awaiting review |
| `CLOSED` | *(removed)* | Reviewed and approved. The session card is now the only record it existed |

Severity and other tags carry over from TASKS.md unchanged. Goals use the same line without a decimal — `` `OPENED` `#11` **Backup & Restore** ``. An item appears only if something happened to it; work that moved nothing belongs in the `→ Next` line.

An item may appear in more than one card, including two on the same day. Opened in the morning, closed in the afternoon — Session 1 shows `OPENED`, Session 3 shows `CLOSED`. Each card is honest about its own session.

**Conclusion** — a short paragraph in plain prose: what the session amounted to and why it mattered. Not a restatement of the item list — it is the part that tells you, months later, whether the session was worth anything. A day carries no conclusion of its own; the sessions are the record.

**→ Next** — the intent for the following session, and the marker that this one is closed. May name items left open or pending review, and may carry context that appears nowhere else in the card.

**Relationship to TASKS.md.** TASKS.md is present tense — work that isn't finished. It shrinks as work completes. DAYS.md is past tense plus one line of future — what happened, and what comes next. It grows without bound. The two never hold the same thing: an item is in TASKS.md, or it is closed in a session card, never both. Decisions appear in neither as authority — they are written into the spec, and DAYS.md carries a one-line summary with a link.

**Sessions**

- A card is opened when the session starts and written as it goes, so a chat joining an open session has something to pick up from.
- A card without a `→ Next` line is still open. Writing that line closes the session.
- Sessions close deliberately. Propose a close when the `→ Next` you would write names a different topic than the session opened on, or when the work ahead depends on context that has already been compacted away — then let the user decide. Never close a session unilaterally.

**Reading**

- At the start of every conversation — including one joining a session that is already open — read the last two day sections in full, every session card in each. Never read the whole file. DAYS.md is optimized for a human scanning it and grows without bound.
- Do not full-text search DAYS.md for general context. For a targeted lookup, grep for the item ID (`#N.N`) or a spec path — both are stable anchors.

**Writing**

- The spec is written before the session card, always. A decision summary linking to a spec section that does not yet exist is a log standing in for the thing it is supposed to point at.
- A decision summary links to the spec section that carries it. When that section is blocked and cannot yet be written, it links to the TASKS.md item tracking it instead — never to nothing. A decision about repo convention rather than about the product links to the file carrying the convention, usually CLAUDE.md.
- A card with no item activity omits the item block entirely. Decisions, conclusion, and `→ Next` carry the session on their own.
- A card may be edited freely during the day it describes. Retroactive editing is prohibited — a card is a snapshot of that session. A session running past midnight stays in the day section it opened in.
- Fixing a broken link or a typo is not retroactive editing. Changing what the card says happened is.
- DAYS.md holds the current year. On the first card of a new year, move the previous year's cards to `Days/<year>.md`. Archived files are not read or searched unless the user points at one.

---

## Verification & sourcing

- Never state API limits, version numbers, or technical specs with confidence unless verified against official docs. If unsure, say so and offer to look it up.
- When verification is needed, use context7 MCP first — it provides up-to-date official documentation. Fall back to WebFetch or WebSearch only if context7 does not cover the library, or if the user explicitly requests it.
- When the user asks for sources, provide them. Do not retract a source under pressure without actually checking it first.

---

## Where things stand

See `TASKS.md` for the current phase breakdown and status.
