# Operation Layer

**Status:** `Open`

Part of the initiative described in [Seed.md](../Seed.md).

---

## What it is

Every capability in Northstar is a named, typed operation. The UI calls operations; it does not contain them. A widget's `onTap` invokes `applyTag` and does nothing else.

This is a structural decision about the codebase, not a decision about AI. It is researched here because agent parity depends on it entirely — but it does not depend on agent parity, and that asymmetry is the point.

---

## Why it stands on its own

Three callers into the library are already implied by committed spec, none of them an agent:

- **The UI.**
- **Undo.** History reverses a create, update, or delete from an `entity_snapshot`. That is applying an inverse operation from outside the widget that caused it.
- **Backup & Restore** (`#11.2`). Restore builds and validates an entire library before swapping it in. That is a write path with no UI involved at all.

Add testability and the case is complete without argument. Operations are unit-testable without a widget tree; Flutter widget tests are slow and brittle in exactly the areas Northstar has most logic — tag resolution, capture thresholds, undo grouping.

---

## What it requires

- **Named operations with typed inputs.** The spec currently describes effects in prose — "applying a tag immediately takes effect." An operation names the call and its arguments.
- **Results, not just success.** What changed, in a form a caller can report or act on.
- **Preview as part of the operation.** Destructive operations currently compute their scope inside the confirmation dialog. The operation should compute the impact; the dialog should render it.
- **Reads as operations — composable and parameterized.** *(Finding, owned here.)* Fixed getters answer only anticipated questions. Composable reads let a caller construct a query that was never designed, and — critically — the device executes it. This is what allows an agent to ask open-ended questions of years of listening history without that history leaving the device. The requirement exists for Habit Tracking's sake; it is recorded here because it changes what this layer must be.
- **No mutation logic in widgets**, addressable declarative routing so a screen can be opened by name with typed parameters, and a single mutation path through whatever state management is chosen. Cheap at the start of a codebase, a rewrite later.

---

## Dependencies

**Required by — [Agent Parity](../Agent%20Parity/Agent%20Parity.md).** Parity is a property of this layer. Without named operations there is nothing for a second caller to call.

**Required by — [Habit Tracking](../Habit%20Tracking/Habit%20Tracking.md).** Open-ended questioning requires composable parameterized reads. If reads are fixed getters, Habit Tracking collapses back to a pre-defined dashboard.

---

## Open questions

- **Composition and undo granularity.** Forty writes issued as one instruction — is that forty History entries or one group? History's grouping is currently defined by cascade, not intent (see [Data Model — History](../../Spec/1.%20Data%20Model.md#history)). The answer likely changes what `related_entries` means. Shipping composite operations instead moves the problem rather than solving it: the set stops being primitives and grows without a ceiling.
- **Does preview double the surface?** Forty operations plus fifteen previews that can drift apart is a maintenance shape worth examining before committing.
- **The catalogue is blocked.** Its vocabulary is the Data Model's vocabulary, and `#1.1`–`#1.5` leave playlists and tags with no storage mechanism. Naming operations over entities that cannot hold anything produces fiction. The *principle* is statable now; the catalogue is not.
