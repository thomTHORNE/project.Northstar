# Capture Mode

## What it is

Capture Mode turns a playlist into a live recording of a listening session. When active, every track the user plays is automatically added to the designated playlist in chronological order and persisted to the library — no manual intervention required.

Captured data is immediately visible in the library but flagged for review. The user decides after the session what to keep and what to discard. A configurable grace period handles anything left unreviewed.

See [Data Model — Playlist](../1.%20Data%20Model.md#playlist) for the `capture_mode_active` field definition.

---

## Behavior

### Enabling Capture Mode

- The user enables Capture Mode on any existing playlist.
- Only one playlist per user can have Capture Mode active at any time. Enabling it on a new playlist automatically disables it on the previously active one. The user is notified when this happens.
- Once enabled, a persistent indicator is shown in the player bar so the user always knows Capture Mode is running.

### During an active session

- A track is captured when the user has listened to it for a minimum of 30 seconds. This prevents tracks skipped early from being captured.
- The minimum playtime threshold is user-configurable.
- When a track is captured, it is added to the library and to the designated playlist simultaneously.
- Captured tracks and any newly created related entities (artist, album) are flagged as `pending_review` in the library.
- Only entities that are **new** to the library are flagged. If the captured track's artist or album already exists in the library, those existing entities are not flagged — only the new track is.
- Tracks are added to the end of the playlist in the order they were played and are visually marked as captured within the playlist view.
- A brief notification confirms each capture. The message reflects what was created:
  - Track already in library: *"Track title" captured to Playlist name*
  - Track new to library, track only: *"Track title" added to your library and captured to Playlist name*
  - Track new to library, full relationship: *"Track title", "Artist name" and "Album title" added to your library and captured to Playlist name*
- The user does not need to interact with Northstar for capture to occur — it runs entirely in the background.

### Relationship persistence setting

When a track is captured that does not yet exist in the library, the user's **relationship persistence** setting determines how much data is saved:

- **Track only** — only the track is created in the library. It is marked as unrelated (no artist or album association). The artist and album data from the source are discarded.
- **Full relationship** — the track, its artist, and its album are all created in the library with their relationships established. Any of these that already exist in the library are reused, not duplicated.

This setting applies at capture time and does not retroactively affect previously captured tracks.

### Post-session review

After the user ends a capture session (by disabling Capture Mode), the designated playlist displays all tracks captured during that session with a visual marker indicating they are pending review.

From this view the user can:
- **Accept** a track — clears the `pending_review` flag. The track and any related entities it brought into the library are confirmed.
- **Discard** a track — removes the track from the library and from the playlist. If the track brought new artist or album entities into the library and those entities have no other tracks, they are also removed.
- **Accept all** — clears `pending_review` on all captured tracks and their related entities in one action.
- **Discard all** — removes all pending tracks from the library and the playlist in one action.

Individual review can also be done directly from the library at any time — the `pending_review` flag is visible wherever the entity appears.

### Grace period

All `pending_review` items across the entire library share a single global grace period timer. The timer starts from the moment each item is captured.

The grace period has two configurable settings:

- **Duration** — how long an item can remain pending before the grace period action is applied. Default: 7 days.
- **Mode** — what happens when the duration expires:
  - **Save** — the item is automatically accepted. The `pending_review` flag is cleared.
  - **Delete** — the item is automatically discarded and removed from the library and any playlists it belongs to.

Items reviewed by the user before the grace period expires are not affected by it.

### Disabling Capture Mode

- The user disables Capture Mode manually via the player bar indicator or the playlist settings.
- Capture Mode does not disable itself automatically.
- The playlist retains all captured tracks regardless of their review status.

### Duplicate handling

- Capture Mode respects the playlist's `allow_duplicates` setting.
- If `allow_duplicates` is false and a track that already exists in the playlist plays again, it is not captured a second time.
- If `allow_duplicates` is true, the track is captured each time it plays past the minimum threshold.

---

## States

Capture Mode itself has two states:

| State | Description |
|---|---|
| **Inactive** | Default. No playlist is recording. Tracks play without being captured. |
| **Active** | A playlist is designated as the capture target. Every track meeting the minimum playtime threshold is added to the playlist and library automatically. |

The transition from Active to Inactive happens only when the user manually disables it. There is no automatic timeout in the initial version.

---

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| Minimum playtime threshold | Integer (seconds) | 30 | A track must play for at least this many seconds before being captured |
| Relationship persistence | Enum | `track_only` | Whether to save only the track (`track_only`) or the full relationship — track, artist, and album (`full`) |
| Grace period duration | Integer (days) | 7 | How long a captured item can remain pending review before the grace period action is applied |
| Grace period mode | Enum | `save` | What happens when the grace period expires: `save` accepts the item automatically, `delete` removes it |

---

## Constraints

- Capture Mode can only be enabled on an existing playlist. It cannot capture to a temporary or unsaved location.
- Only one playlist per user can be in Capturing state at any time.
- Capture Mode operates regardless of which source the audio comes from — streaming service, YouTube, or cloud storage.
- The grace period timer is global. All pending review items share the same duration and mode settings. The timer runs from each item's individual capture timestamp.
- Discarding a captured track removes it from the library and from the playlist it was captured to.
- If a discarded track was the only track associated with a newly created artist or album (brought in by that capture), those entities are also removed.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| User enables Capture Mode on Playlist B while Playlist A is capturing | Capture Mode disables on Playlist A and enables on Playlist B. The user is notified. Playlist A retains all tracks captured up to that point. |
| The active Capture playlist is deleted | Capture Mode is automatically disabled. The user is notified. Captured tracks that were added to the library remain there as pending review. |
| A track is skipped before reaching the minimum playtime threshold | The track is not captured. |
| The user plays the same track twice in one session and `allow_duplicates` is false | The track is captured on first play. The second play is ignored. |
| The user plays the same track twice in one session and `allow_duplicates` is true | The track is captured both times. |
| A captured track's artist already exists in the library | The existing artist entity is reused. It is not flagged for review. Only the new track is flagged. |
| Capture Mode is active on a tag-driven or mixed playlist | Captured tracks are appended as manually added tracks. They are not affected by tag filter changes. |
| Grace period expires on an item the user has already reviewed | The grace period action is not applied. Reviewed items are not affected. |
| Grace period mode is `delete` and expires on a track whose artist and album have other library tracks | Only the captured track is deleted. The artist and album remain in the library. |
