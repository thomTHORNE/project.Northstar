# Habit Tracking

**Status:** `Open`

Part of the initiative described in [A Library You Ask](../A%20Library%20You%20Ask.md).

---

## What it is

Surfacing patterns from the user's listening history. The data foundation — `ListeningEvent` — is collected from v1. Habit Tracking is what gets built on it.

Three angles carried forward from Ideas.md: a personal dashboard, pattern surfacing over time, and insights drawn from the user's own library as a personal dataset.

---

## Why it was deferred, and what changed

The recorded tension: hand-picked metrics are quick to build but "answer only the questions you thought to ask upfront," while an open-ended approach is harder to define.

*(Finding, owned here.)* Agent parity dissolves that tension. If reads are composable operations, the question is asked at query time rather than designed in advance. *"Do I listen to different music when I travel?"* is not a card anyone would build for a dashboard, but it is a query. The definition problem largely evaporates — you define the read surface, not the insights, and the dashboard becomes one optional surface rather than the whole feature.

This does not make the feature arrive sooner. It changes what it is when it does.

---

## What has not changed

**Data volume is still the blocker, and parity does nothing for it.** Worse, it introduces a hazard the dashboard didn't have: an empty dashboard is honest — it says "not enough data yet." A model given thirty ListeningEvents will find patterns and state them fluently. Year one of any user's library is the failure case, and the failure is confident and wrong rather than blank.

Some floor — a volume or time-span below which questioning is refused rather than attempted — is likely part of this feature rather than a detail of it.

---

## Dependencies

**Requires — [Operation Layer](../Operation%20Layer/Operation%20Layer.md).** Composable parameterized reads. Fixed getters return this to a pre-defined dashboard.

**Required by — [Agent Parity](../Agent%20Parity/Agent%20Parity.md).** This topic carries the agent's product case. Parity supplies the mechanism; this supplies the reason anyone would use it.

---

## Open questions

- **What is the minimum viable dataset**, and what does the feature do below it?
- **Dashboard, questioning, or both?** They are not the same feature and may not have the same schedule. The dashboard has no dependency on any of this work.
- **What questions do people actually ask** about their own listening? Currently assumed rather than known. The reference papers in [Ideas.md](../../../Ideas.md) are the starting point.
- **Does this need ListeningEvents for unsaved tracks?** The related Ideas.md entry is unresolved and bears directly on what Discovery-mode listening can be asked about.
