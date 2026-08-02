# A Library You Ask

**Status of this document:** maintained. The [Origin](Origin.md) beside it is frozen and never edited.

---

## The initiative

Three topics are being researched together because each is worth less alone than the three are worth as one thing.

Northstar holds data no streaming service has — notes, tags, a library structured by hand, and a record of what was actually played. The app currently offers one way to reach that data: screens someone designed in advance. Every question a user might ask has to have been anticipated and built.

The claim these three topics test is that Northstar can be a library you *ask*, not only one you operate — and that it can be so without a server, without surrendering the data, and without becoming the algorithm Northstar defines itself against.

Each topic supplies one part of that and none supplies it alone. The **Operation Layer** makes every capability addressable rather than buried in a widget. **Agent Parity** makes a second caller legitimate, and its constraint — an agent may only do what a human could — is what keeps the result a tool rather than a taste engine. **Habit Tracking** is the first capability that is *only* reachable by asking, because the interesting questions about your own listening are not ones anyone would build a screen for.

The architecture that falls out is the reason this is worth research rather than a decision: the agent composes a read operation, the device executes it locally, and only the result leaves. Raw listening history never goes anywhere. That answer is invisible from inside any one topic. It exists at the seam.

---

## Why three topics

Split by blocker, so each can move without waiting on the others.

| Topic | Blocked on | Promotes to |
|---|---|---|
| [Operation Layer](Operation%20Layer/Operation%20Layer.md) | Data Model `#1.1`–`#1.5` for the catalogue; the principle is statable now | Architecture |
| [Agent Parity](Agent%20Parity/Agent%20Parity.md) | Operation Layer taking shape | Architecture |
| [Habit Tracking](Habit%20Tracking/Habit%20Tracking.md) | ListeningEvent volume | Features |

Habit Tracking is not subordinate to the agent. It was deferred long before parity existed, has its own evidence base, and has real value as a dashboard with no agent at all. The agent is one interface to it, not its parent.

---

## Findings and their owners

Findings at the seams belong to the topic that must change if they hold — not the one they surfaced in.

| Finding | Owned by | Because it changes |
|---|---|---|
| Parity dissolves the pre-defined-metrics problem — you define the read surface, not the insights | **Habit Tracking** | Removes its stated reason for deferral |
| Agent composes a read, device executes it locally, raw history never leaves | **Operation Layer** | Makes composable, parameterized reads a requirement, not a nicety |
| Operating over notes, tags, and history is what makes the agent non-copyable | **Agent Parity** | Supplies the product case it lacks standalone |
| The guarantee is structural on writes, prompt-level on reads | **Agent Parity** | Qualifies the central claim, precisely where Habit Tracking lives |

---

## What would falsify it

The initiative fails if any of these resolves the wrong way. They are conditions on the whole, not on any one topic.

1. **Composition has no clean answer.** If an agent-composed batch cannot be grouped and reversed as one intent, the agent cannot safely do bulk work — which is most of its write value.
2. **The exception list is long.** If many operations turn out to need justified exclusion, parity is a label rather than a design.
3. **Preview doesn't scale.** If every destructive operation needs a twin that drifts, governance parity fails on the write side, where it was supposed to be strongest.
4. **Spotify errors can't be made actionable.** A human sees a playback failure on screen. If an agent can't, playback parity is decorative.
5. **Read context can't stay local.** If useful questions require shipping raw history off-device, local-first and this initiative are in conflict and one of them loses.
6. **The data never arrives.** Habit Tracking needs volume. If a real library after a year of use still can't support a question worth asking, the agent's product case stays empty and parity remains architecture.
