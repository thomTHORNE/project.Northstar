---
name: sitrep
description: Print a checkpoint of the current conversation — decisions, item
  actions, state, and next. Manual only. Invoke when the user types /sitrep.
  Never invoke automatically.
---

# sitrep

A checkpoint. It reports the state of the work at the moment it is invoked,
so the user can rewrite it into their own notes and re-enter the work cold
later.

**Print only.** Never write the output to a file. Never offer to.

**Absolute, never incremental.** Every invocation covers the whole
conversation. A previous sitrep in context is input material, not a boundary —
do not report "since the last sitrep."

**Read TASKS.md** before writing the report. It is the only file required.

---

## Depth

An optional argument scales the per-decision block. Nothing else changes.

| Invocation | Per decision |
|---|---|
| `/sitrep tight` | The decision. One line. |
| `/sitrep` | Decision, and what tipped it. |
| `/sitrep deep` | Decision, what it beat, what tipped it, what is still soft about it. |

Default is one line per decision. The whole report should land at about the
length of this file's example.

---

## Output

### Decisions

What was decided in this conversation. Not what was discussed — what was
settled. Each carries a link to the file that holds it where one exists; a
decision not yet written anywhere carries no link and says so.

### Items

Items in TASKS.md that this conversation touched. Only those — a reader
wanting the full picture opens TASKS.md, which is what that file is for.

```
- `ACTION` `#N.N` `SEVERITY` **Item title**
<br>
- `ACTION` `#N.N` `SEVERITY` **Item title**
```

Title only, no description. ID and severity come from TASKS.md unchanged.

| Action | Meaning |
|---|---|
| `NEW` | Surfaced in this conversation, not yet written to TASKS.md |
| `OPENED` | Item created and written to TASKS.md |
| `REVISED` | Scope or description changed |
| `PENDING REVIEW` | Spec drafted and committed, awaiting review |
| `CLOSED` | Reviewed and approved, removed from TASKS.md |

`NEW` requires checking TASKS.md, not memory. An item discussed as if it
exists but absent from the file is `NEW`.

Omit the section entirely if no item was touched.

### State

A short paragraph: where the thinking has landed, and what is still contested.
Unlike a retrospective conclusion, this is allowed — required — to say that
something is unresolved.

Name explicitly, where they exist:

- **Residue** — got a "hmm" and moved on. Never resolved, never deferred
  either. Nothing marked it, which is why it is worth naming.
- **Low confidence** — decided to unblock rather than because it was settled.

Report observations with their evidence. Never attribute mood or feeling to
the user — "rejected the junction approach twice before accepting it" is
usable; "seemed frustrated" is a guess and belongs to them, not to this file.

### Next

One line, absolute and actionable. Written so it can be pasted into a new
conversation as the whole briefing: what to pick up, what blocks it, and why.
Not a summary of what just happened.

---

## Compaction

If early context has been compacted, say so in one line at the end and name
roughly where fidelity drops. Only then — a report over complete context
carries no such line. A checkpoint that is silently incomplete is worse than
one that admits its span.

---

## Non-goals

- Not a session card. Not a source for one. Sitrep and DAYS.md are unrelated
  and the days workflow is deprecated.
- Does not write to disk, does not modify TASKS.md, does not update the spec.
- Does not reconcile conversation against disk beyond what `NEW` requires.
