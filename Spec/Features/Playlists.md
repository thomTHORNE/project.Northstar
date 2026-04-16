# Playlists

## What it is

A playlist is a user-defined collection of tracks. It can be built by hand, composed automatically from tags, or a combination of both. Playlists are the primary way users organize music around mood, moment, activity, or any personal context they choose.

See [Data Model — Playlist](../1.%20Data%20Model.md#playlist) for the full field and relationship definitions.

---

## How a playlist gets its tracks

A playlist's contents come from two independent sources that can coexist freely:

**Manually added tracks** — the user adds tracks explicitly, one at a time or in bulk. These are fixed until the user removes them.

**Tag filters** — the user adds one or more tags as filters. The playlist automatically includes every track in the library that carries any of those tags. This portion updates itself — when a tag is applied to a track in the library, that track appears; when a tag is removed, the track disappears.

A playlist can have one or both. The user never sets a mode — they simply add tracks, add tag filters, or both. The playlist behaves correctly based on what it contains. Manually added tracks always appear first, followed by tag-matched tracks.

---

## Behavior

### Adding tracks manually

- Tracks are added one at a time or in bulk from any view that displays tracks (artist page, album page, search results, another playlist).
- When `allow_duplicates` is false, adding a track that already exists in the playlist has no effect. No error is shown — the action is silently ignored.
- When `allow_duplicates` is true, the track is appended regardless of whether it already exists.

### Removing tracks manually

- Tracks can be removed individually or in bulk.
- Removing a track from a playlist does not affect the track in the library.
- Tag-matched tracks cannot be removed from a playlist directly. They are removed by removing the relevant tag from the track in the library.

### Reordering tracks

- Manually added tracks can be reordered freely.
- Tag-matched tracks always appear after manually added tracks. Their relative order among themselves is not user-controllable in the initial version.

### Tag filter management

- The user can add or remove tag filters from a playlist at any time.
- Adding a tag filter immediately expands the playlist to include all matching tracks.
- Removing a tag filter immediately removes any tracks that were only matched by that filter (unless they match a remaining filter).
- A playlist with no manual tracks and no tag filters is empty — this is valid.

### Automatic updates

- When a tag is applied to a track in the library, that track immediately appears in all playlists whose filters include that tag.
- When a tag is removed from a track, that track is immediately removed from all playlists whose filters included that tag (unless it still matches another filter on those playlists).
- When a tag is deleted from the library entirely, it is removed from all playlist filters. Playlists that depended solely on that tag lose those matches and retain only their manually added tracks.

---

## States

A playlist has one meaningful state beyond its default existence:

| State | Description |
|---|---|
| **Capturing** | Capture Mode is enabled on this playlist. Tracks are being added automatically as the user listens. Persisted via `capture_mode_active` on the Playlist entity. Only one playlist per user can be in this state at a time. |

All other playlists are simply in their default state — present in the library and usable. See the [Capture Mode](./Capture%20Mode.md) feature doc for full details on how that state is entered and exited.

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
| All manually added tracks are removed from a playlist that also has tag filters | The playlist continues to exist with only its tag-matched tracks. No mode change occurs — the playlist simply reflects what it contains. |
| A playlist with `allow_duplicates` true has Capture Mode enabled | Tracks can be captured multiple times if they play more than once during the session. |
| Two playlists have overlapping tag filters | Each playlist is independent. A track matching both playlists' filters appears in both. |
| A track is added to a manual playlist, then the same track is tagged with a filter used by a mixed playlist | The track appears in the mixed playlist via the tag filter. This is independent of any manual playlists. |
