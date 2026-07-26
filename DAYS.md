# Days

A work log, grouped by day, newest first. Each day holds one or more session cards, numbered from 1 within that day.

Format and conventions: [CLAUDE.md](CLAUDE.md).

---

## 2026-07-26

::: toggle Session 2 — DAYS.md session cards
- Days become `## YYYY-MM-DD` sections holding session cards; sessions numbered from 1 within their day ([CLAUDE.md](CLAUDE.md))
- A session is a stretch of work, not a chat — one may span several chats ([CLAUDE.md](CLAUDE.md))
- `→ Next` is the close marker; sessions close deliberately, Claude proposes and never decides ([CLAUDE.md](CLAUDE.md))
- Cold start reads the last two day sections in full ([CLAUDE.md](CLAUDE.md))
- No day-level conclusion — the sessions are the record ([CLAUDE.md](CLAUDE.md))
- DAYS.md's format rules moved into CLAUDE.md, matching how TASKS.md already works ([CLAUDE.md](CLAUDE.md))
- - -
Two large sessions landing on one day broke the card format, but the fix turned out to be less about bloat than about the freeze rule. A day can't be frozen while it's still running, so a second session either overwrote the first session's account or piled onto it — and the retroactive-editing rule existed precisely to prevent the first. A session has an observable close, which is what made the rule enforceable rather than aspirational.

The second outcome was unplanned. Moving the format rules out left DAYS.md as nothing but entries, which is what it is for: its job is re-entry after time away, and forty lines of format spec sat between the top of the file and the most recent card. TASKS.md already kept its rules in CLAUDE.md; DAYS.md was the exception, and now isn't.
- - -
→ Next: two threads, both carried unconsumed. Resolve `#1.1`, `#1.4`, and `#1.5` in one sitting — all three are the same question, how the Data Model stores collection membership; answering it clears four of the five Data Model blockers and unblocks `#1.3`, `#1.6`, and `#11.2`. Then stress test #1 in Operation Layer — composition and undo granularity, the top-ranked falsifier of the whole research initiative, touching History, which is committed spec.
:::

::: toggle Session 1 — Research staging layer
- `Research/` established as a staging layer between Ideas.md and Spec/ — no authority, but the only place with a path out ([CLAUDE.md](CLAUDE.md))
- Research topics are split by blocker, not by subject, so parallel work isn't held up ([CLAUDE.md](CLAUDE.md))
- Findings at the seam between topics are owned by the topic they change ([CLAUDE.md](CLAUDE.md))
- Promotion bar: a section whose justification depends on an unpromoted topic waits rather than going early with a forward reference ([CLAUDE.md](CLAUDE.md))
- Topic status vocabulary — Open, Ready, Promoted; a topic enters TASKS.md only at Ready ([CLAUDE.md](CLAUDE.md))
- Agent parity and Habit Tracking promoted out of Ideas.md into three research topics ([Research/Seed.md](Research/Seed.md))
- - -
Agent-native development came in as a question about the frontend and left as something larger. The framework behind it was a non-starter — wrong stack entirely — but the architecture underneath it survived contact: a human and an agent calling the same named operations, with input methods left unshared. Pulling that thread found two things already in the spec that had been built for other reasons and turn out to be the foundation for this one — History's snapshot-and-group undo, and a library with a single source of truth.

The larger outcome is structural. Ideas.md had no way to let an idea grow; it could only park one. Research/ is that missing stage, and the promotion bar is the part that keeps it honest — research that can't be stated as fact in the spec's own voice doesn't get to pretend otherwise. Two ideas moved into it today and split into three topics, on the reasoning that a shared subject is not a shared blocker.
- - -
→ Next: stress test #1 in Operation Layer — composition and undo granularity. It is the top-ranked falsifier of the whole initiative and it touches History, which is committed spec, so the answer has consequences beyond research.
:::

---

## 2026-07-25

::: toggle Session 1 — Local-first architecture
- Local-first for v1 — no backend, no Northstar account, no tenancy ([Architecture.md](Spec/Architecture/Architecture.md))
- Backup & Restore is manual and replaces the library wholesale; automatic sync deferred ([Ideas.md](Ideas.md))
- Backup format is portable versioned JSON, not a raw database file (`#11.1`)
- History is for reversibility, not archiving — undo eligibility and retention are one window (`#8.5`)
- DAYS.md replaces History.md as the work log; the CLAUDE.md decisions table is retired ([CLAUDE.md](CLAUDE.md))
- Spec review table retired from TASKS.md; severity is carried on the item line only ([TASKS.md](TASKS.md))
- - -
- `CLOSED` `#8.1` `GAP` **Tech stack decision**: The biggest open question in the project is now closed. "Do I need a backend" 
<br>
- `CLOSED` `#3.1` `GAP` **"Grace period" terminology conflict**
<br>
- `REVISED` `#8.2` `BLOCKER` **On-device database engine and data access layer**
<br>
- `REVISED` `#8.5` `GAP` **History retention window**
<br>
- `OPENED` `#1.4` `BLOCKER` **Playlist has no track storage mechanism**
<br>
- `OPENED` `#1.5` `BLOCKER` **Tag associations have no storage mechanism**
<br>
- `OPENED` `#1.6` `GAP` **Relationships sections are inconsistent**
<br>
- `OPENED` `#4.10` `MINOR` **Free-tier authorization on desktop**
<br>
- `OPENED` `#8.7` `GAP` **Array types vs junction tables**
<br>
- `OPENED` `#8.8` `GAP` **Durability of browser-origin storage on the desktop build**
<br>
- `OPENED` `#11` **Backup & Restore**
<br>
- `OPENED` `#11.1` `BLOCKER` **Export file format**
<br>
- `OPENED` `#11.2` `BLOCKER` **Backup & Restore feature spec**
- - -
The largest open question in the project — whether Northstar needs a backend — moved out of an explainer that carried no authority and into the spec as a decision. Three defects already sitting in the Data Model surfaced: Playlist has no storage for its tracks, tag associations have none at all, and Capture Mode is therefore specced to write into a playlist with nowhere to put anything. Backup & Restore went from nonexistent to decided in substance. Nine items opened against two closed — which reads badly and isn't: a task list that reflects reality is worth more than a short one that doesn't.
- - -
→ Next: resolve `#1.1`, `#1.4`, and `#1.5` in one sitting — all three are the same question, how the Data Model stores collection membership. Answering it unblocks `#1.3`, `#1.6`, and `#11.2`, and clears four of the five Data Model blockers.
:::
