# Design Principles

These four principles govern the design of every feature in Northstar — layout, interaction, animation, and information architecture. They are not aesthetic preferences. They are functional strategies for reducing the cognitive and physical friction between a user and their music.

Every design decision in Northstar can be evaluated against these principles. If a proposed UI element or interaction cannot be justified by at least one of them, it does not belong.

The player is the prime example for all four — it is the most frequently used surface in the app and the one where friction is most immediately felt.

---

## Intentional

Intentional design is the philosophy of the scalpel. Every element on the screen exists for a specific reason. If a control doesn't help the user achieve their current goal, it is removed or de-emphasised.

- **Characteristics:** High signal-to-noise ratio, clear visual hierarchy, and aggressive minimalism.
- **Problems solved:** Decision fatigue, feature creep, and cluttered interfaces that overwhelm or slow users down.

**Primary goal:** Clarity  
**The feeling:** "This knows what I want."  
**Key element:** White space / Hierarchy

> In the player: the controls visible at any given moment should reflect what the user is likely to do next — not every possible action. Secondary controls (queue, source info, settings) live one level deeper.

---

## Snappy

Snappiness is about perceived performance. It is the difference between an app that feels like it is lagging behind the user's finger and one that feels like it is anticipating their next move.

- **Characteristics:** Low latency, instant visual feedback even when data is still loading, and fluid transitions at 60fps or higher.
- **Problems solved:** User frustration, interaction anxiety ("did that register?"), and the perception of slowness even when underlying operations are fast.

**Primary goal:** Efficiency  
**The feeling:** "This is incredibly fast."  
**Key element:** Micro-interactions

> In the player: tapping play, skip, or pause must produce immediate visual feedback. The UI responds first; the audio follows. There is no state where the user is left wondering if their input was received.

---

## Tactile

Tactile design bridges the gap between the digital and physical worlds. It uses physics-based animation and deliberate affordances to make digital objects behave like real ones.

- **Characteristics:** Haptic feedback, realistic depth and shadow, rubber-banding at list boundaries, and controls that visually respond to being pressed.
- **Problems solved:** The glass wall effect — where a user feels disconnected from the software — and lack of affordance (not knowing what is interactive or what will happen when touched).

**Primary goal:** Connection  
**The feeling:** "This feels real."  
**Key element:** Physics / Haptics

> In the player: scrubbing the progress bar, flicking through the queue, and pressing play should all carry physical weight. The interface should feel like something being handled, not something being pointed at.

---

## Adaptive

Adaptive design doesn't just stretch — it understands the context it is being used in and redesigns itself accordingly. A layout optimised for a mouse cursor on a large screen is not the same design as one optimised for a thumb on a phone, and treating them as the same problem produces interfaces that are mediocre on both.

- **Characteristics:** Breakpoint-specific layouts, input-method optimisation (cursor precision vs. thumb reach), generous touch targets on mobile, and content prioritisation based on available screen real estate.
- **Problems solved:** Touch targets that are too small to hit reliably — especially in motion or divided-attention contexts. Broken layouts on non-standard screens. Wasted space on wide desktop displays.

**Primary goal:** Utility  
**The feeling:** "This was built for the device I'm holding."  
**Key element:** Touch targets / Input context

> In the player: on mobile, the most-used controls — play/pause and skip — must be large enough to trigger without looking. A user switching tracks while driving should never have to hunt for a button. If a control cannot be hit confidently with a thumb in a divided-attention context, it fails the Adaptive principle on mobile.
