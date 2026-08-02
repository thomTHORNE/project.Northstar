# Track Imprint

**Status:** `Open`

---

## What it is

A replacement for the tag as the way a track carries personal meaning. A tag is a name applied as a boolean — timeless, degreeless, reached by recall. An imprint is a point placed by hand in a named two-dimensional field, carrying a position, a weight, and the moment it was made.

The distinction that generates everything else: **if a characteristic sits on a spectrum between two opposites, it is an imprint. If it is a fact, it is a playlist.** *Warm* is an imprint. *Vacation 2026 Drive* is a playlist.

Imprints are a track's threads, running along it. A playlist cuts across the threads of many tracks. Both carry a **theme** — the interpretation the user brings to it, which goes beyond what is obviously there and is not itself data.

---

## Why the tag model fails

The failure is not visual. It is that the model has nowhere to put a degree, so the only honest rendering of it is a list of checkboxes — and once there are two hundred checkboxes, a hierarchy becomes necessary. The folders are a symptom of unbounded growth, not a design choice.

The interaction inherits the same fault. Applying a tag runs: feel something → find a word → recall whether it exists → navigate to it → click. Steps two through five are deliberate, effortful work imposed at the moment the user is having an immediate, non-verbal reaction. That translation is the whole of what makes tagging feel like filing.

---

## What the theory constrains

Four frameworks, reduced to what each forbids:

- **Gibson — affordances.** A word affords reading, and nothing else. The surface must present manipulable matter or the redesign is cosmetic.
- **Norman — three levels.** Visceral: the surface must respond as material. Behavioral: it must be *faster to commit* than typing, or it dies regardless of how it looks. Reflective: it must leave an artifact worth looking at — the current model leaves none.
- **Sweller — cognitive load.** While a track plays, working memory is occupied by the music. No hierarchy, no navigation, no text entry at the moment of use.
- **Kahneman — dual process.** The judgment is System 1. Making a System 2 encoding a precondition of recording it is the defect.

---

## Anatomy

**An imprint is a theme plus exactly two spectra.** A single spectrum carries no theme — *happy ↔ sad* is a measurement. Choosing *those two* axes as the ones that define a theme is the interpretive act.

**Two is a hard limit, and it is not a policy number.** A point in two dimensions is set by one touch. At three you need projection, rotation, or a second control, and the act stops being *put your finger where it feels* and becomes *operate an instrument*. Two is the dimensionality at which position on the display simply is the value.

**Both axes are always bipolar.** One relationship model, so authoring never requires predicting whether a pair can co-occur. The authoring guidance is that ends should genuinely oppose each other — but it is guidance, not a gate, because mixed cases are handled per track rather than per axis.

**The limit belongs to the display, not the library.** A user may author many imprints; what is bounded is how many fields are within reach while a track plays. Three to five, one of them primary.

**The theme is carried by a note.** An imprint holds a free-form note — the same [Note](../../Spec/Features/Notes.md) entity used everywhere else in the library, defined as carrying no structural meaning and existing to hold personal context. That is precisely what a theme is: what *you* mean by pairing these two axes, written for a human and computed by nothing. An imprint without a note is one whose theme was never written down. (The Note entity's `entity_type` would need to name imprints — data model work deliberately not done here.)

**The note is the only part of an imprint editable after authoring.** Name and axes are frozen. The principle: **edit what you meant, never edit what you measured.** Understanding of a theme legitimately develops over years and the note is where that goes; changing an axis silently rewrites the meaning of every point ever placed on it.

---

## The field

The imprint surface is a two-dimensional field. What it is *made of* is left open here — visual treatment belongs to the design phase, not to this document. What the research settles is what the field has to do:

- **Position is the value.** Nothing stands between the touch and the reading. This is what keeps placement one direct act rather than an instrument to operate.
- **Input stays planar.** Whatever depth the rendering carries, the surface receives a flat gesture. A rotatable surface is a trap — rotation is a second control, and occlusion hides half the space.
- **The axes must become legible without being read every time.** Labels are a starting aid, not the permanent means of orientation.

Directions worth exploring in the UI phase, none of them settled: rendering the field as material rather than as a chart, so regions carry their own character; giving it volumetric depth while input stays planar; deriving a mark's colour from where it landed, which could make tracks that feel alike look alike without anyone authoring a palette; letting labels recede as a field becomes familiar.

---

## The mark

A deposit, not a dot. It blooms on contact, settles, and cools. It carries three things:

| Channel | Set by | Records |
|---|---|---|
| Position | where you touch | the reading |
| Weight | how long you hold | how much this theme applies at all |
| Moment | the playhead | where in the track you felt it |

**Weight is not a third axis.** Its job is to separate an emotionally flat track from a genuinely balanced one — both sit at the centre, and without weight they are the same datum. It also weights the data for pattern recognition and gives playlist queries a conviction filter.

**Placement is explicit and absence is representable.** A field is never pre-filled at the centre. An empty field and a mark placed at the centre are different data, and most tracks will have most fields empty. Sparse is correct.

**Lift to remove.** Press and hold *on* an existing mark and it recedes and cools away. The same gesture, inverted by what it lands on, with the direction of travel visible throughout. Inside a mark's core removes; outside places.

---

## Mixed readings

A track that is genuinely both gets a **second mark**, tethered to the first to show the two are one reading rather than two.

- At most two live marks. A third does not block — the oldest recedes into history.
- Queries match on **any** mark, never on an average. Averaging +0.7 and −0.6 gives +0.05, which walks the flat/mixed collapse back in through the query layer. A mixed track legitimately matches both ends.
- Weight is per mark, so strong joy with mild grief is expressible.

**Two rejected alternatives, and why.**

*A bivariate field* — two independent presences rather than one spectrum — was considered and rejected. It forces the author to judge, cold and before first use, whether a pair can co-occur; both failure modes are silent; and since structural edits to an imprint are closed, a wrong call is permanent. It also charges every unmixed track a full field so the minority case can be expressed. **Mixedness is a property of the track, not of the axis**, so it belongs at placement time where the information actually is.

*A region* — a press-and-drag smear — was rejected because it cannot distinguish "both at once" from "it changes across the track." Two discrete points assert *both of these specifically*, and the playhead separates simultaneous from sequential for free.

---

## Bipolarity, and what the evidence says

A spectrum asserts that its ends are one dimension and that moving toward one is moving away from the other. That assertion is contested.

- [Russell & Carroll (1999)](https://pubmed.ncbi.nlm.nih.gov/9990843/), *Psychological Bulletin* 125(1), 3–30 — the strongest defence of bipolarity. Earlier claims of independence assumed a fixed correlation between positive and negative affect; correct for time frame, response format, item selection and measurement error and little evidence for independence survives.
- [Cacioppo, Gardner & Berntson (1997)](https://journals.sagepub.com/doi/10.1207/s15327957pspr0101_2) — the Evaluative Space Model. Positivity and negativity have partially separable substrates and are better modelled bivariately. It is the more general model: bipolar behaviour is its reciprocal special case.
- [Hunter, Schellenberg & Schimmack (2011)](https://pubmed.ncbi.nlm.nih.gov/21707144/), *"It's a bittersweet symphony"* — the finding that matters here. Music with conflicting cues (fast tempo in a minor mode) produces reports of feeling happy and sad **at the same time**; given one button per emotion, listeners held both down together significantly more during conflicting-cue tracks.
- [Larsen, Norris, McGraw, Hawkley & Cacioppo (2009)](https://www.tandfonline.com/doi/abs/10.1080/02699930801994054), *Cognition and Emotion* 23(3), 453–480 — the Evaluative Space Grid, a validated single-item 2D instrument answered by placing one point. Prior art for the field itself.

**Conclusion carried forward:** the phenomenon is real and music is among its strongest elicitors, but it is handled with a second mark rather than a second axis structure. The evidence justifies the escape hatch; it does not justify changing the relationship model.

---

## Reviewing accumulated imprints

### Axes belong to their imprint

Two imprints may use the same axis label — *happy ↔ sad* can appear in both a *Mood* imprint and a *Memory* one. These are two different axes sharing a vocabulary, not one axis seen twice.

Sharing an axis across imprints breaks in three places. Placing a mark sets both coordinates at once, so a shared axis would let a placement in one field silently pre-fill another, destroying the rule that empty and centre are different data. A two-mark mixed reading would hand the other imprint two values with no rule for which pairs with its own coordinate. And weight is per mark, per field, so a shared axis would inherit a weight from a field it was never placed in.

All three fail for the same reason: **the reading is the point, not its coordinates.** Decomposing a mark into independent per-axis values destroys what made it a single act.

This is not a compromise. A track can be sad in itself and happy as a memory — not contradictory readings of one dimension, but readings of two, sharing a vocabulary because the themes around them differ. **An axis is therefore never named without its imprint.** The imprint is the namespace, and review is scoped by imprint before anything else.

### What review can compute

| Data | Not data |
|---|---|
| Imprint name, its four axis-end labels | What any position *means* |
| Per track per imprint: zero, one or two marks | Why two imprints relate |
| Per mark: position, weight, moment-in-track | |
| The imprint's note — prose, read and never computed | |

Review shows where things sit and how firmly. It does not say what that signifies. This is the position Northstar already takes elsewhere: surface the patterns, draw no conclusions.

**Never average, in review either.** Two marks spanning an axis average to the centre — the flat-versus-mixed collapse re-entering through the analytics layer. A scatter plots **marks, not tracks**: a mixed track legitimately appears in two regions, tethered.

### Two properties to be honest about

**Selection bias is structural.** You imprint tracks that moved you, during listens where you were engaged enough to reach for the field. The distribution is never "your library" — it is *what moved you, when you were paying attention*. Any surface presenting it as a picture of the library is lying, and should be framed accordingly.

**Coverage is data, and the only feedback available on a badly authored imprint.** Since axes are frozen, a wrong one cannot be fixed, only retired. An imprint carrying very few marks across the library is one that is not earning its place, and coverage is how that becomes visible.

### Surfaces worth exploring

Ideas, not decisions. Each would be designed in the UI phase.

**The populated field.** An imprint's own field showing every marked track as a point. The primary review surface, because the imprint is the unit of meaning.

**Lasso to playlist.** Draw a region on a populated field and it becomes a dynamic playlist — a volume in imprint space rather than a query assembled from dropdowns. The most promising idea here: it replaces a query builder with a gesture, and it is legible to someone who would never open a filter panel. It is also where this topic meets [Playlists](../../Spec/Features/Playlists.md), which currently compose from tag filters.

**A track's threads.** Every mark a track carries across all its imprints, shown together. The fingerprint.

**The imprint preview.** A compact rendering of a track's marks, small enough to sit beside the track wherever it appears. Only lightly touched on so far, and the surface that would make imprints visible during ordinary browsing rather than only in review.

**The track timeline.** Marks at the playhead positions where they were made, so a track carries a record of where *in itself* it moved you.

**Drift.** How a track's placements changed across listens, and how the library's distribution within a theme moved over months. The reflective payoff, and the thing tags could never produce.

**Cross-imprint comparison — user-initiated only.** The numbers permit correlating one imprint's axis against another's, but a correlation between dimensions defined for unrelated reasons is a figure with no interpretation attached. Surfacing it unprompted would be the system asserting a meaning it has no access to. Available on request; never volunteered.

---

## Rules settled

- An imprint is a theme plus exactly two bipolar spectra.
- Two spectra is a hard ceiling; the number of imprints is not, but the number in reach while listening is.
- A mark carries position, weight and moment.
- Fields are never pre-filled. Empty and centre are different data.
- At most two live marks per field; a third pushes the oldest into history.
- Two marks are one reading, shown tethered.
- Queries match on any mark and never on an average.
- Press and hold on a mark to lift it.
- Axes belong to their imprint. An axis is never named without it.
- An imprint's theme is carried by a note, the only part editable after authoring.
- Marks are never averaged — in queries or in review.

---

## Open questions

**The listen boundary.** Overflow-to-history means a mark can recede mid-listen, so "this listen" and "previous listens" stop being a clean boundary — a mark placed four minutes ago sits in the same faded state as one from last year. Resolving this needs a definition of a listening session, which no spec currently carries. Deferred deliberately.

**The timeline anchor is load-bearing.** Playhead position started as a bonus and became the only thing separating a simultaneous reading from an evolving one. Any source that cannot report position reliably degrades the two-point model back into ambiguity. Whether every supported source can is unverified.

**What can make the surface responsive.** Northstar does not own the audio. Spotify and YouTube playback is delegated and neither exposes the stream for analysis, so for those sources there is no signal to read — the prototype only manages it by synthesising its own audio. Reliably available instead: playback position, duration, and play/pause state. Whether Spotify still exposes track-level tempo and energy metadata needs verifying rather than assuming; the availability of its audio-features and audio-analysis endpoints has changed and the current position has not been checked. Cloud-storage playback is the one case where Northstar holds the file and could analyse it directly. Responsiveness is therefore a per-source capability, not a property of the design.

**Cold start.** Authoring a two-axis theme is a real decision, and the first imprint must be worth making before any placement is possible. A shipped starter set would impose someone else's vocabulary, which is the one thing Northstar should not do.

**Authoring weight.** Structural edits to an imprint are closed, since a changed axis silently rewrites the meaning of every point ever placed on it. The authoring surface must carry that weight rather than merely warn about it — a high-stakes act that looks cheap teaches people it is cheap.

**What replaces the tag elsewhere.** Tags currently apply to artists, albums and playlists as well as tracks, and drive playlist filters. This topic covers tracks only. Whether imprints extend to other entities, and what happens to factual labels that are not spectra at all, is unanswered.

**Marks carry no wall-clock timestamp.** A mark records position, weight and moment-in-track. *When it was made* is a distinct thing from *where in the track it landed*, and drift — the surface with the most to offer — needs the former. Absent from the model as described.

**Retirement is undefined.** Coverage is meant to reveal a badly authored imprint, and frozen axes mean the only remedy is retirement. Nothing says what that does to marks already placed: kept read-only, hidden from review but preserved, or removed with the imprint. The answer interacts with whether playlists lassoed from a retired imprint survive it.

---

## Dependencies

**Required by — [Operation Layer](../A%20Library%20You%20Ask/Operation%20Layer/Operation%20Layer.md).** The operation catalogue's vocabulary is the Data Model's vocabulary, and `applyTag` is named in it as a canonical example. If tags are replaced, the operation set changes shape before it is written.

**Required by — [Habit Tracking](../A%20Library%20You%20Ask/Habit%20Tracking/Habit%20Tracking.md).** A vector of positions on named dimensions is materially better feedstock for pattern surfacing than a bag of labels. What this topic produces changes what that one can ask.

**Requires — nothing.** This topic is not blocked on other research. It is blocked on its own open questions and on the Data Model work that follows a decision, which has not started by design.

---

## Prototype

[Interactive field prototype](https://claude.ai/code/artifact/e8be76b1-f761-4f91-a8e8-9e8c9499e359) — press-and-hold weighting, two-point tethered readings, lift-to-remove. Its audio is synthesised in-browser, which is why the field can react to the signal; that is a property of the prototype, not of Northstar.
