# Ideas

A running list of ideas worth revisiting. Nothing here is committed to the spec — these are possibilities, not decisions.

---

## Notes browser

A dedicated view where the user can read all their notes in one place, across every entity type. Rather than navigating the library by artist or playlist, the user navigates by their own written context and memories — a more personal and reflective entry point into the library.

Worth exploring how this intersects with search and filtering (e.g., browse notes by entity type, or surface notes alongside their entities in a timeline view).

---

## Social features — shared context

Northstar is private by design, but the things that make it personal — notes, tags, the way a library is curated — are also the things that make it interesting to others. There's a version of Northstar where users can choose to share their context alongside their music.

Sharing a playlist could optionally include the notes attached to its tracks. Sharing an artist page could surface what you wrote about them. A friend wouldn't just see what you're listening to — they'd see why it matters to you.

This turns music sharing into something closer to a conversation than a recommendation. Worth thinking about what the privacy model looks like (per-entity opt-in, per-share opt-in, or a public/private toggle at the account level) and how it interacts with the notes browser idea above — a shared notes view could be a compelling social surface on its own.

---

## Analytics

A layer of instrumentation that tracks how users interact with the app and surfaces meaningful metrics — both for product insights and potentially as a user-facing feature.

The example below uses Capture Mode as a reference point, but analytics could extend across every feature in Northstar.

**Example trackable events:**
- `capture_mode_enabled` / `capture_mode_disabled` — when the user starts or stops a capture session
- `track_captured` — when a track is successfully added to a capture playlist
- `track_capture_skipped` — when a track is not captured due to a rule (duplicate, threshold not met, etc.)
- `capture_settings_changed` — when the user modifies any Capture Mode setting

**Example metrics:**
- Average capture session duration
- Number of tracks captured per session
- Capture skip rate (how often the threshold or duplicate rules prevent a capture)
- Most common source types captured from

The interesting question is how much of this becomes user-facing. A personal analytics dashboard — listening patterns, library growth over time, tag usage distribution — would complement the Habit Tracking feature and give users a data-driven view of their own music life. Worth revisiting alongside Habit Tracking when the time comes.
