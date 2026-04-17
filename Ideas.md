# Ideas

A running list of ideas worth revisiting. Nothing here is committed to the spec — these are possibilities, not decisions.

---

## Automatic import

A scheduled import that runs at a set interval, keeping the Northstar library in sync with a connected streaming service without requiring the user to trigger it manually.

The reason this was deferred: sync is harder than it looks. A one-time import is append-only — Northstar pulls what the service has and the user owns it from there. Automatic sync has to decide what to do with deletions (did the user remove something from the service intentionally?), edits (does a renamed playlist on the service overwrite the user's renamed version in Northstar?), and conflicts between what the service shows and what the user has built on top.

Worth revisiting once the manual import path is stable and real usage patterns are understood. The right design will depend on where the actual friction is — it may not be sync frequency at all.

Possible configuration surface when the time comes: sync interval, selective opt-out by entity type or subtree, conflict resolution preference.

---

## Habit Tracking

A feature that surfaces patterns and insights from the user's listening history. The data foundation for this — the `ListeningEvent` entity — is already being collected in the initial version. Habit Tracking is what gets built on top of it.

The core tension that deferred this feature: a manually defined set of metrics (most played, listening trends, time-of-day patterns) is quick to build but limited in imagination. It answers only the questions you thought to ask upfront. An AI-driven approach could surface connections the user never anticipated — the kind of insight that makes someone say "I didn't know that about myself" — but it's harder to define and depends on having a meaningful volume of listening history first.

The right time to revisit this is once the core app is stable and a body of `ListeningEvent` data exists to work with. At that point the shape of the feature will be much clearer — both what the data actually shows and what questions users are naturally asking about their listening.

Three angles worth exploring when the time comes:
- **Personal dashboard** — a user-facing view of listening patterns, library growth over time, and tag usage distribution. The data-driven complement to the notes browser — one shows what you've written, the other shows what you've played.
- **Pattern surfacing** — what the data reveals about listening behavior over time (seasonal patterns, mood-driven habits, library engagement vs. discovery ratio)
- **AI-driven insights** — using the user's own library — tracks, tags, notes, listening history — as a personal dataset to surface recommendations and connections that reflect individual taste, not a generalized model

The research references saved below are a good starting point for understanding the psychology behind listening behavior before designing this feature.

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

## Analytics — app instrumentation

A layer of developer-facing instrumentation that tracks how users interact with the app. Not user-facing — this is for understanding product health and feature usage.

The example below uses Capture Mode as a reference point, but instrumentation could extend across every feature in Northstar.

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

For the user-facing equivalent — a personal dashboard of listening patterns, library growth, and tag usage — see the Habit Tracking idea above.

---

## Research references

A collection of papers and articles saved during the Habit Tracking and ListeningEvent design discussions. Useful for understanding the psychology behind how people actually experience music — relevant to feature decisions around listening thresholds, habit tracking, and the emotional core of Northstar.

---

### Skip behavior & listening thresholds

**[The skipping behavior of users of music streaming services and its relation to musical structure — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7526936/)**
Saved because: directly relevant to the ListeningEvent threshold problem. Key finding: most skipping happens in the first few seconds, and spikes again at musical section changes (e.g. verse to chorus). Supports using a percentage-based threshold over a flat time value. Also available via [Spotify Research](https://research.atspotify.com/publications/the-skipping-behavior-of-users-of-music-streaming-services-and-its-relation-to-musical-structure/).

**[Exploring the feasibility of collecting music and wellbeing data to examine intentional listening — Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1505929/full)**
Saved because: directly addresses the distinction between intentional listening and passive background listening — the core of what a ListeningEvent should capture. Uses mobile ESM (Experience Sampling Methodology) to measure genuine listening engagement in real-world conditions.

---

### Psychology of music listening

**[The psychological functions of music listening — Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00511/full)**
Saved because: foundational paper on *why* people listen to music. Identifies three core functions: mood/arousal regulation, self-awareness, and social connection — in that order. The self-awareness dimension is the psychological backbone of Northstar's notes, tags, and reflection features.

**[Music and the mind — APA Monitor (2026)](https://www.apa.org/monitor/2026/03/science-of-music)**
Saved because: recent and accessible overview of music psychology from the American Psychological Association. Good entry point for reading more broadly. Covers emotional response, memory, identity, and neurological effects.

**[The psychological functions of music listening — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3741536/)**
Saved because: peer-reviewed version of the Frontiers paper above. Covers the reminiscence bump — the finding that people remain most emotionally invested in music heard during adolescence. This is the scientific foundation for the Sentimentalist persona and for Northstar's memory-oriented features.

---

### Listening habits & streaming behavior

**[The habitual nature of music streaming — Bridge Ratings](https://www.bridgeratings.com/blog/2025/2/16/the-habitual-nature-of-music-streaming)**
Saved because: 50% of all streams come from catalog tracks 18+ months old. People are deeply habitual, repeat listeners — not explorers. This validates Northstar's library-first approach and explains why owning your library data matters more than discovery algorithms for most users.

**[How music listening habits change with age — Stat Significant](https://www.statsignificant.com/p/how-do-music-listening-habits-change)**
Saved because: statistical analysis of how listening behavior shifts across a lifetime. Relevant for understanding the long-term value of a personal library that grows with the user — and why Northstar becomes more valuable the longer someone uses it.
