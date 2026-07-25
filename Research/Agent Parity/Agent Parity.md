# Agent Parity

**Status:** `Open`

Part of the initiative described in [Seed.md](../Seed.md).

---

## What it is

A human and an AI act on Northstar through the same operations. The agent is not a feature alongside the app with its own code path — it is a second caller of the layer the UI calls.

**Input methods are not shared. Operations are.** A tap, a drag, a long-press, and a chat message are all input methods. Beneath them sits a finite set of named operations. Parity means every operation is reachable by both callers. It does not mean the agent scrubs a progress bar.

This keeps parity clear of the design principles rather than in tension with them. Tactile governs how a human reaches an operation. Snappy governs feedback on that path — optimistic UI belongs to the human caller, since an agent has no need to be reassured its input registered. Both sit above the operation layer.

---

## Justified, not unconditional

The default is that an operation is agent-callable. Where it isn't, the spec states why. Disconnecting the Spotify account is a likely example — an operation that revokes the app's own access is a poor candidate for delegation.

---

## The guarantee is asymmetric

On **writes**, the guardrail is structural. There is no `tagByVibe` operation, so the agent cannot form taste — not because it was told not to, but because the capability does not exist. This is what makes parity compatible with Northstar's position that the library's meaning is the user's.

On **reads**, there is no such protection. *(Finding, owned here.)* Once listening history is in a model's context, it will editorialize about taste whether or not it was asked. The anti-algorithmic position holds by construction for mutations and only by prompt discipline for insight — and it weakens precisely where Habit Tracking lives.

Resolving this is the most important open work in this topic.

---

## The product case is borrowed

Standalone, a shipped agent is weak. Most of parity's breadth is wasted — "tag these 40 tracks" is worth invoking, "pause" is never worth typing a sentence for and costs money to do worse than a thumb. The high-value work is desk work, which points at the desktop build, which is the weakest platform (browser-dependent, EME-gated, storage durability unresolved per `#8.8`). And library chores don't advance the notes-and-memory thesis at all.

*(Finding, owned here.)* What makes the agent Northstar-shaped rather than copyable is operating over notes, tags, and personal history — data no streaming service holds. That case comes from Habit Tracking. Parity supplies the mechanism; it does not supply the reason.

---

## Where the model runs

Narrowed to two, undecided:

- **User brings their own key**, stored in the OS secure enclave alongside Spotify tokens. Consistent with local-first, no server, honest about who pays. Narrows the audience.
- **Northstar proxies it.** Reverses the local-first decision and brings a server, an account, and tenancy with it.

Either way library data leaves the device, including free-form notes. Northstar has no stated position on that.

---

## Dependencies

**Requires — [Operation Layer](../Operation%20Layer/Operation%20Layer.md).** Parity is a property of that layer. It cannot be researched ahead of it, only alongside.

**Requires — [Habit Tracking](../Habit%20Tracking/Habit%20Tracking.md).** For the product case. If Habit Tracking doesn't hold, parity stays architecture and a shipped agent stays deferred.

---

## Open questions

- **How long is the exception list, really?** Two exclusions means parity is the design. Fifteen means it's a label on something else. Needs enumerating against the current feature specs rather than assuming.
- **Read-side guarantee.** Can the write side's structural protection be extended to reads at all, or is prompt discipline the ceiling? If it's the ceiling, that needs stating plainly rather than glossing.
- **Spotify error semantics.** Playback routes through Spotify Connect, requires Premium, and on mobile requires the Spotify app running (`#4.4`). A human sees the failure. What does an agent receive, and can it act on it?
- **Governance over untracked tiers.** History covers library mutations. Playback and view navigation are neither logged nor reversible. Does equal governance extend to them, or are they governed differently because they aren't destructive?
- **Read context volume and privacy.** How much library enters the model's context, and does the answer differ between bring-your-own-key and a proxy?
