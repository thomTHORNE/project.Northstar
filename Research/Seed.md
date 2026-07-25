# Seed

**Status of this document:** the live head is maintained. The Origin appendix is frozen and never edited.

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

---

## Origin *(frozen)*

*The two Ideas.md entries this initiative came from, as written, before the split. Preserved unedited — internal references may no longer resolve.*

---

### Agent parity

A human and an AI act on Northstar through the same set of operations. The agent is not a feature bolted alongside the app with its own code path — it is a second caller of the same layer the UI calls. Anything the user can do by hand, the agent can do by name.

The line that makes this tractable: **input methods are not shared, operations are.** A tap, a drag, a long-press, and a chat message are all input methods. Beneath them sits a finite set of named operations — `applyTag`, `seek`, `reorderPlaylist`. Parity means every operation is reachable by both callers. It does not mean the agent scrubs a progress bar.

This keeps parity clear of the design principles rather than in tension with them. Tactile governs how a human reaches an operation — weight, physics, haptics. Snappy governs the feedback on that path; optimistic UI belongs to the human caller, since an agent has no need to be reassured its input registered. Both sit above the operation layer and neither is compromised by something else calling into it.

**Parity is justified, not unconditional.** The default is that an operation is agent-callable. Where it isn't, the spec states why. Disconnecting the Spotify account is a likely example — an operation that revokes the app's own access is a poor candidate for delegation.

The constraint is also the guardrail. The agent can execute *"tag every Radiohead track melancholic"* because a human could, forty times by hand. It cannot do *"tag what sounds melancholic"* — that operation doesn't exist for a human either, so it doesn't exist for the agent. Northstar's position is that the library's meaning is the user's, not an algorithm's, and parity enforces that structurally rather than by promising restraint.

**What already keeps the door open:**

- Local-first gives one on-device source of truth. There is no divergence between what the agent reads and what the UI displays, and no sync layer to keep honest.
- History logs every create, update, and delete with a full `entity_snapshot`, groups related entries, and reverses a group in one action. Agent actions inherit the same audit trail and the same reversibility as human ones — equal governance is already the default over library mutations.
- The operation set is small. Roughly 20–25 library mutations, 8 playback commands, a handful of mode toggles and reads. Under 40 in total.

**What would still be needed:**

- **Named, typed operations.** The spec describes effects in prose — "applying a tag immediately takes effect." An operation layer names the call, its inputs, and its result.
- **Preview as part of the operation.** Destructive operations currently compute their scope inside the confirmation dialog. A human sees that a tag is on 47 tracks before deleting it; an agent calling the operation must be able to see the same thing before committing, or it is less governed than the human rather than equally.
- **Results, not just success.** What changed, in a form the agent can report back or act on.
- **Reads as operations.** An agent that can only mutate is useless. Search, tag resolution, listing pending review.
- **Governance over the tiers History doesn't cover.** History covers library mutations. Playback and view navigation are neither logged nor reversible. Whether equal governance extends to them, or whether those tiers are governed differently because they are not destructive, is undecided.
- **Frontend consequences.** No mutation logic inside widgets — a widget calls an operation and nothing else. Declarative addressable routing, so a screen can be opened by name with typed parameters. A single mutation path through whatever state management is chosen. These are cheap to adopt at the start of a codebase and expensive to retrofit.
- **A position on where the model runs.** Narrowed to two: the user brings their own API key, stored in the OS secure enclave alongside Spotify tokens; or Northstar proxies the call. The proxy reverses the local-first decision and brings a server, an account, and tenancy with it. Bring-your-own-key does not, but narrows who can use the feature and makes the user pay per call. Either way library data leaves the device, including free-form notes, and Northstar has no stated position on that yet.

**Stress tests, ranked by how much they would damage the idea if they don't hold up:**

1. **Composition and undo granularity.** *"Tag every Radiohead track melancholic"* is not one operation. It is a read plus forty writes. Two paths, both with problems. If the agent composes it from primitives, History gets forty entries, and "undo that" means reversing forty things the user experienced as one instruction — History's grouping is currently specced for bulk operations Northstar initiates (see [Data Model — History](Spec/1.%20Data%20Model.md#history)), where the group is defined by cascade rather than by intent. If Northstar ships composite operations instead, the operation set stops being primitives, starts encoding intent, and grows without a natural ceiling. The answer likely changes what `related_entries` means.
2. **The size of the exception list.** "Justified, not unconditional" is load-bearing. If the honest list of non-agent-callable operations is two, parity is the design. If it is fifteen, parity is a label on something else. Worth enumerating against the current feature specs rather than assuming.
3. **Preview doubles the surface.** Every destructive operation needs a preview twin that stays truthful as the operation evolves. Forty operations plus fifteen previews that can drift apart is a maintenance shape worth examining before committing.
4. **Collision with Spotify.** Playback operations are not Northstar's — they route through Spotify Connect, require Premium, and on mobile require the Spotify app to be running (`#4.4`). A human sees the failure on screen. An agent receives an error it may not be able to act on. Error semantics for the agent caller are undefined.
5. **Read-side context and privacy.** If the agent must know the library to be useful, how much of it enters the model's context — and does that answer differ between bring-your-own-key and a proxy? This is where the hosting decision stops being about secrets and becomes about data.

**Why this is deferred, and what makes it different from the other entries here:** parity is a property that can be preserved without shipping an agent. Build the operation layer, release v1 with no agent at all, and add one later at low cost. The reverse — retrofitting parity onto a codebase whose behavior lives in its widgets — is a rewrite. So the expensive part is the agent itself, and the cheap part has a deadline.

The operation catalogue cannot be written yet regardless: its vocabulary is the Data Model's vocabulary, and the model currently has no storage mechanism for playlist tracks or tag associations. Naming operations over entities that cannot hold anything would produce fiction.

Worth revisiting when the Data Model blockers are closed and the Phase 4 frontend decisions — routing, state management, data access — come up. Those are the decisions parity actually constrains, and the point at which deferring further starts to cost something.

---

### Habit Tracking

A feature that surfaces patterns and insights from the user's listening history. The data foundation for this — the `ListeningEvent` entity — is already being collected in the initial version. Habit Tracking is what gets built on top of it.

The core tension that deferred this feature: a manually defined set of metrics (most played, listening trends, time-of-day patterns) is quick to build but limited in imagination. It answers only the questions you thought to ask upfront. An AI-driven approach could surface connections the user never anticipated — the kind of insight that makes someone say "I didn't know that about myself" — but it's harder to define and depends on having a meaningful volume of listening history first.

The right time to revisit this is once the core app is stable and a body of `ListeningEvent` data exists to work with. At that point the shape of the feature will be much clearer — both what the data actually shows and what questions users are naturally asking about their listening.

Three angles worth exploring when the time comes:
- **Personal dashboard** — a user-facing view of listening patterns, library growth over time, and tag usage distribution. The data-driven complement to the notes browser — one shows what you've written, the other shows what you've played.
- **Pattern surfacing** — what the data reveals about listening behavior over time (seasonal patterns, mood-driven habits, library engagement vs. discovery ratio)
- **AI-driven insights** — using the user's own library — tracks, tags, notes, listening history — as a personal dataset to surface recommendations and connections that reflect individual taste, not a generalized model

The research references saved below are a good starting point for understanding the psychology behind listening behavior before designing this feature.
