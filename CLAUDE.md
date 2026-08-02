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
├── DAYS.md                 ← deprecated work log. Not written to; superseded by /sitrep.
├── .claude/skills/         ← project skills. /sitrep prints a conversation checkpoint.
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
├── History.md              ← legacy, outdated. Do not read, search, or reference.
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

Research stays out of TASKS.md while it is still research. A topic enters the tracker only at `Ready`, at which point its promotion is spec work like anything else.

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

## Threads

The user triages conversation by thread and assigns finite attention to each. Volume is
never the problem; an unnavigable message is. Never withhold a finding to keep a message
short — index it instead.

### Vocabulary

- **Finding** — one true thing discovered. It holds or it doesn't. Costs nothing alone.
- **Thread** — one unit of the user's attention. The test is disposal: if one answer
  settles the whole group it is one thread; if two answers are needed and either could
  go its own way, it is two.
- **Topic** — what the conversation is about. Contains many threads, changes rarely, and
  is the user's to set. A `PIVOT` is a thread that changes it.

### What is a thread

Threads are what the user did not ask for. Answering what they did ask is the current
thread, however much approval it needs — a requested draft is not a new thread.

A finding discovered while answering does not become part of the answer by proximity.
If it needs something from the user, it is a thread and it goes in the index.

### When this applies

Any message introducing something the user has not already agreed to. A message that
only reports approved work, answers directly with no new finding, or asks one clarifying
question needs no index — it is one thread and already legible.

### Structure

1. **The answer** to what was asked.
2. **The index** — every thread, one line, tagged, ordered by tag.
3. **The threads**, numbered to match the index, each visually delimited.

Index lines state the finding, not its subject: "Diagram claims History covers
ListeningEvent", not "History diagram". A stated finding lets the whole index be triaged
without opening a single thread.

### Tags

Tags say what the thread costs the user, not what the finding is. `TASKS.md` severity
(`BLOCKER` / `GAP` / `MINOR`) is a different axis and stays in `TASKS.md`.

| Tag | Means | Test |
|---|---|---|
| `CORRECTION` | Something stated earlier was wrong | Acting on the old statement would now be a mistake |
| `PIVOT` | Changes where the current work is heading | Taking it reorders or invalidates work in progress |
| `APPROVE` | A drafted change, yes or no | The exact text exists and one word disposes of it |
| `DECIDE` | A genuine choice | More than one path is viable and the user picks |
| `NOTE` | Surfaced, needs nothing | It could be skipped and nothing downstream breaks |

The index is ordered by that table, top to bottom. Corrections invalidate, pivots
redirect, then the asks, then the rest.

Where two tags fit, the higher one wins. A pivot that also needs a decision is a `PIVOT`.

### Unanswered threads

A thread is expanded in full once. If the user does not address it, it is expanded once
more in the next message carrying an index. After that it drops to a standing line at
the end of the message:

`Open threads — 3 Position encoding · 5 Export destination`

Named, not re-explained, expanded on request. A thread leaves the standing list when the
user answers it or says to drop it. Nothing is ever dropped silently.

### Form

Never remove information to save space — categorize and index it. Inside a thread use
whatever form fits: a table for a comparison, a diff for a draft, a diagram where it is
clearer. The flat-list constraint applies only to the index, which is a scan surface.

Skills print what their skill file specifies. This section governs conversation.

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
- When an item is resolved, remove it from TASKS.md entirely. Do not leave completed items in TASKS.md.
- Decisions recorded in the spec are settled. Reopen one when something new is known — not because it feels uncertain again.
- Diagrams are derived, never authoritative. Where a diagram and the prose it illustrates disagree, the prose wins and the diagram is the defect. A change to any field, relationship, or cascade a diagram depicts is not complete until that diagram is updated in the same edit. A spec whose picture disagrees with its text is worse than one with no picture, because the picture is what gets read.

---

## Session continuity

There is no work log on disk. The user keeps their own notes off-repo and will brief
you when context from previous work matters. `/sitrep` prints a checkpoint of the
current conversation for them to write from — manual only, never invoked unprompted.

---

## Verification & sourcing

- Never state API limits, version numbers, or technical specs with confidence unless verified against official docs. If unsure, say so and offer to look it up.
- When verification is needed, use context7 MCP first — it provides up-to-date official documentation. Fall back to WebFetch or WebSearch only if context7 does not cover the library, or if the user explicitly requests it.
- When the user asks for sources, provide them. Do not retract a source under pressure without actually checking it first.

---

## Where things stand

See `TASKS.md` for the current phase breakdown and status.
