# Playlists

## What it is

A playlist is a user-defined collection of tracks. It can be built by hand, composed automatically from tags, or a combination of both. Playlists are the primary way users organize music around mood, moment, activity, or any personal context they choose.

See [Data Model — Playlist](../1.%20Data%20Model.md#playlist) for the full field and relationship definitions.

---

## Modes

A playlist operates in one of three modes. The mode determines how the playlist gets its tracks.

### Manual

The user adds and removes tracks explicitly. The playlist contains exactly what the user puts in it, in the order they arrange it. Nothing is added or removed automatically.

### Tag-driven

The user defines a set of tag filters. The playlist contains every track in the library that matches those filters. The user does not add tracks directly — the playlist composes itself from the library and updates automatically as tags are applied or removed across the library.

### Mixed

The user adds a fixed set of tracks manually, and also defines tag filters. The playlist contains both: the manually added tracks first, followed by any tracks in the library that match the tag filters. The tag-driven portion updates automatically; the manual portion does not.

---

## Behavior

### Adding tracks (manual and mixed modes)

- Tracks are added one at a time or in bulk from any view that displays tracks (artist page, album page, search results, another playlist).
- When `allow_duplicates` is false, adding a track that already exists in the playlist has no effect. No error is shown — the action is silently ignored.
- When `allow_duplicates` is true, the track is appended regardless of whether it already exists.

### Removing tracks (manual and mixed modes)

- Tracks can be removed individually or in bulk.
- Removing a track from a playlist does not affect the track in the library.
- In a mixed playlist, only manually added tracks can be removed directly. Tag-matched tracks are removed by removing the relevant tag from the track in the library.

### Reordering tracks (manual and mixed modes)

- Manually added tracks can be reordered freely.
- In a mixed playlist, tag-matched tracks always appear after manually added tracks. Their relative order among themselves is not user-controllable in the initial version.

### Tag filter management (tag-driven and mixed modes)

- The user can add or remove tag filters from a playlist at any time.
- Adding a tag filter immediately expands the playlist to include all matching tracks.
- Removing a tag filter immediately removes any tracks that were only matched by that filter (unless they match a remaining filter).
- A tag-driven playlist with no tag filters defined is empty.

### Automatic updates (tag-driven and mixed modes)

- When a tag is applied to a track in the library, that track immediately appears in all playlists whose filters include that tag.
- When a tag is removed from a track, that track is immediately removed from all playlists whose filters included that tag (unless it still matches another filter on those playlists).
- When a tag is deleted from the library entirely, it is removed from all playlist filters. Playlists that depended solely on that tag become empty or revert to their manual tracks only.

---

## States

A playlist is always in exactly one of these states:

| State | Description |
|---|---|
| **Active** | The playlist exists and is usable. Default state. |
| **Capturing** | Capture Mode is enabled on this playlist. Tracks are being added automatically as the user listens. Only one playlist per user can be in this state at a time. |

---

## Constraints

- Playlist names must be unique per user. Attempting to save a playlist with a name that already exists prompts the user to choose a different name.
- A tag-driven playlist must have at least one tag filter to contain any tracks. An empty filter set produces an empty playlist — this is valid but surfaces a prompt suggesting the user add filters.
- Only one playlist per user can have Capture Mode active at any time. Enabling it on a new playlist automatically disables it on the previously active one.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| A track in a tag-driven playlist is deleted from the library | The track is removed from the playlist automatically. No warning specific to the playlist is shown — the track deletion prompt covers it. |
| A tag used as a filter is deleted | The tag is removed from all playlist filters. Affected playlists are updated immediately. The user is warned of this during the tag deletion confirmation. |
| A mixed playlist's manual tracks are all removed | The playlist continues to exist with only its tag-driven tracks. It does not revert to tag-driven mode — mode is explicit, not inferred. |
| A playlist with `allow_duplicates` true has Capture Mode enabled | Tracks can be captured multiple times if they play more than once during the session. |
| Two playlists have overlapping tag filters | Each playlist is independent. A track matching both playlists' filters appears in both. |
| A track is added to a manual playlist, then the same track is tagged with a filter used by a mixed playlist | The track appears in the mixed playlist via the tag filter. This is independent of any manual playlists. |
