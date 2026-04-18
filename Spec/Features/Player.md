# Player

The player is the prime example surface for Northstar's [Design Principles](../Design%20Principles.md). Every controls decision — what's visible, how large, how it responds — should be evaluated against those four principles before anything else.

---

## What it is

The player is how Northstar plays music. It does not own the audio — it delegates playback to the source where a track's audio lives. What Northstar owns is the playback queue, the controls, and the context: what's playing, what's next, and how it connects back to the library.

The player is a persistent layer of the app. It stays visible and active as the user navigates — switching from the library view to a playlist or an artist page does not interrupt what's playing.

---

## Playback sources

Every track in Northstar has one or more `source_links`. When the user plays a track, Northstar uses the source link to route audio to the appropriate playback backend.

| Source type | Playback mechanism |
|---|---|
| Streaming service | Playback via the service's official SDK or API. The user must be authenticated with the service. |
| YouTube | Playback via the YouTube player API. |
| Cloud storage | Audio file fetched and streamed directly from the user's connected storage. |

**Source selection:**

- If a track has only one source link, that source is used automatically.
- If a track has multiple source links, Northstar uses the user's preferred source order (a setting the user defines globally, e.g. "prefer Spotify over YouTube"). The highest-priority available source is used.
- If no source link is available or the source is unreachable, playback fails gracefully. The user is shown a message and the player advances to the next track in the queue.

**Authentication:**

Playback through a streaming service or YouTube requires the user to be authenticated with that service. If the user is not authenticated, playback is blocked and the user is prompted to connect the relevant account. Cloud storage playback requires the storage account to be connected.

---

## The queue

The queue is the ordered list of tracks the player will play through. It is separate from the playlist — the queue is what's loaded into the player right now, not the full contents of any single playlist.

### Building the queue

The queue is populated when the user initiates playback:

- **Play a track** — the track is added to the queue. If the track was played from within a playlist or album context, the remaining tracks in that context follow it in queue order.
- **Play a playlist** — the playlist's full effective contents (manual tracks + tag filter matches, in order) are loaded into the queue.
- **Play an album** — the album's tracklist is loaded into the queue in release order.
- **Play an artist** — the artist's tracks are loaded into the queue. Order is unspecified in the initial version.

Starting a new playback action replaces the current queue. The user is not warned — this is the expected behavior.

### Queue order

The queue preserves the order of its source context. Within the queue, the user can:

- View the full queue
- Reorder tracks by dragging
- Remove a track from the queue (without affecting the library)
- Add a track to the end of the queue ("play next" adds it immediately after the current track)

### Shuffle

Shuffle randomises the queue order. The current track is not moved. Turning shuffle off restores the original queue order.

### Repeat

Three modes:

| Mode | Behavior |
|---|---|
| Off | Playback stops at the end of the queue |
| Repeat queue | The queue loops from the beginning when it ends |
| Repeat track | The current track loops indefinitely |

---

## Controls

The player exposes standard controls:

- **Play / Pause**
- **Skip forward** — advances to the next track in the queue
- **Skip back** — returns to the previous track, or restarts the current track if more than 3 seconds have elapsed
- **Seek** — scrub to any point in the current track
- **Volume** — adjust output volume
- **Shuffle** — toggle shuffle on/off
- **Repeat** — cycle through repeat modes (off → queue → track)

---

## Now playing

While a track is playing, the player displays:

- Track title
- Artist name (if assigned)
- Album name and cover art (if assigned)
- Playback progress (current position / total duration)
- Source indicator — which source is providing the audio (e.g., Spotify, YouTube)
- Active tags on the track (read-only)

From the now playing view, the user can navigate directly to the track, artist, album, or playlist that the track belongs to — without stopping playback.

---

## Integration with library features

### ListeningEvents

The player is responsible for recording ListeningEvents. When a track has been playing for at least 40% of its duration (or the user-configured threshold), a ListeningEvent is written. This happens silently in the background — no UI feedback is shown.

If playback is interrupted (user skips, app closes), the event is still written if the threshold was reached before the interruption.

### Capture Mode

If a playlist has Capture Mode active, the player adds each track to that playlist as it is played — subject to the Capture Mode rules (threshold, duplicates, `pending_review`). See [Capture Mode](./Capture%20Mode.md) for the full behavior.

### Unlinked tracks

If a track in the queue has no source link, the player skips it automatically and surfaces a notice that the track could not be played. The track is not removed from the library.

---

## Player modes

The player operates in one of two modes. The active mode determines how the queue behaves and what happens when the current track ends.

### Library mode

The default. The player works from Northstar's own queue — tracks the user has explicitly loaded by playing a track, album, playlist, or artist. When the queue ends, playback stops (unless repeat is on).

This mode works with any source type.

### Discovery mode

Discovery mode hands queue control to the connected streaming service after the seed track ends. Northstar starts playback with a track from the library, then steps back and lets the service's own recommendation engine decide what plays next. The user is no longer navigating a fixed queue — they are in a continuous, algorithmically-driven stream seeded by their own taste.

Northstar's role in Discovery mode is to observe, not to control. It watches what the service plays and offers new tracks to the library.

**Entering Discovery mode:**

- The user selects a track in their library and starts Discovery mode from it.
- Northstar starts playback of that track on the connected service (`PUT /v1/me/player/play` with the track URI).
- When the track ends, the service's autoplay takes over — the service queues what it recommends next.
- Northstar polls the service (`GET /v1/me/player/currently-playing`) to detect track changes.

**What Northstar does during a Discovery session:**

- Monitors the currently playing track in real time.
- When the track changes, checks whether the new track exists in the Northstar library.
- If the track is **not** in the library — it is a discovery. If Capture Mode is active on a playlist, the track is captured subject to the standard Capture Mode rules (threshold, `pending_review`, duplicates). If Capture Mode is not active, the track is surfaced in the now playing view with an option to add it to the library manually.
- If the track **is** already in the library — it is treated as a normal play. A ListeningEvent is recorded if the threshold is met.

**What Northstar does not control in Discovery mode:**

- What tracks the service recommends.
- Queue order or contents. The queue view reflects what the service has queued, read from `GET /v1/me/player/queue`, but Northstar does not modify it.
- Skip behavior. Skipping is passed through to the service (`POST /v1/me/player/next`), which advances to the service's next recommendation.

**Ending a Discovery session:**

- The user exits Discovery mode explicitly.
- Or the user starts a new playback action in Library mode — this transfers playback back to Northstar's queue.

**Service availability:**

Discovery mode is only available when the active source is a service that supports delegated autoplay. In the initial version:

| Source | Discovery mode |
|---|---|
| Spotify | Supported. Requires Spotify Premium. |
| YouTube | Not supported in the initial version. |
| Google Drive | Not supported. Cloud storage has no recommendation engine. |

If the user attempts to enter Discovery mode without a supported service connected, or without a Premium account on Spotify, Northstar surfaces a clear explanation rather than a generic error.

---

## States

| State | Description |
|---|---|
| Idle | No track loaded. The player UI is visible but inactive. |
| Playing (Library) | A track is actively playing from the Northstar queue. |
| Playing (Discovery) | A track is actively playing via a delegated service session. Northstar is observing. |
| Paused | Playback is paused. The current position is held. |
| Buffering | Audio is loading from the source. Shown briefly while the stream initialises. |
| Error | The current track could not be played (source unreachable, authentication failure, file missing). The player surfaces an error message and can advance to the next track. |

---

## Constraints

- Northstar does not process or mix audio. A queue can contain tracks from different sources — when one track ends, the next source is initialised and playback begins. What Northstar does not support is simultaneous audio processing across sources: no crossfade, no EQ, no blending.
- Volume control affects Northstar's own output level. It does not override system volume or the source service's own volume.
- Playback is not available offline in the initial version. All sources require an active connection.
- The player does not provide equaliser or audio effects controls in the initial version.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| The user skips a track before the ListeningEvent threshold is reached | No ListeningEvent is recorded for that track. |
| A track's preferred source becomes unavailable mid-playback | Playback stops. The player surfaces an error and offers to advance. It does not automatically fall back to a secondary source link in the initial version. |
| The queue is empty and repeat is off | Playback stops. The player returns to idle state. |
| The user plays a tag-driven playlist whose contents change while it is playing | The queue is not updated mid-session. The queue reflects the playlist state at the time playback started. |
| A track in the queue is deleted from the library while the queue is active | If the track is not yet playing, it is removed from the queue silently. If it is the current track, playback stops and the player advances. |
| The user navigates away from the app (mobile background) | Playback continues in the background. Controls are exposed via the system media controls. |
| The user enters Discovery mode without Spotify Premium | Northstar blocks entry and surfaces a message explaining that Discovery mode requires a Spotify Premium account. |
| The Spotify session expires mid-Discovery session | Northstar detects the auth failure on the next poll, surfaces a re-authentication prompt, and pauses the session. The session can be resumed once the user re-authenticates. |
| A discovered track is already in the library | It is treated as a normal library play. No duplicate is created. A ListeningEvent is recorded if the threshold is met. Capture Mode does not re-capture it if `allow_duplicates` is false on the target playlist. |
| The user skips during Discovery mode | Northstar calls `POST /v1/me/player/next` on the service, which advances to the service's next recommendation. Northstar does not control what that track is. |
| Capture Mode is not active during a Discovery session | Discovered tracks are surfaced in the now playing view with an option to add to the library. They are not added automatically. |
| The service's autoplay ends (e.g. Spotify stops recommending) | Northstar detects that playback has stopped via polling and returns to idle state. The user is notified that the Discovery session has ended. |
