# Spotify

Spotify is Northstar's primary streaming integration and the only source in v1 that supports Discovery mode. All playback through Spotify requires an active Premium subscription — the Web Playback SDK and playback control endpoints are unavailable to free-tier users.

---

## Authentication

Spotify uses OAuth 2.0. Northstar implements the Authorization Code Flow with PKCE, which does not require a backend secret and is appropriate for a desktop or mobile client.

**Required scopes:**

| Scope | Purpose |
|---|---|
| `streaming` | Use the Web Playback SDK to play audio within Northstar |
| `user-read-playback-state` | Read the current playback state (track, position, device) |
| `user-modify-playback-state` | Control playback: play, pause, skip, seek, set volume |
| `user-read-currently-playing` | Poll the currently playing track during Discovery mode |
| `playlist-read-private` | Read the user's private playlists for import |
| `playlist-read-collaborative` | Read collaborative playlists for import |
| `user-library-read` | Read the user's saved tracks and albums for import |

Access tokens expire after one hour. Northstar refreshes the token automatically using the refresh token before expiry. If the refresh fails, the session is invalidated and the user is prompted to re-authenticate.

---

## Playback mechanism

Northstar uses the **Spotify Web Playback SDK** to register itself as a Spotify Connect device. This gives Northstar a device ID it can target with playback control API calls.

Playback is initiated and controlled via the Spotify Connect Web API:

| Action | Endpoint |
|---|---|
| Start / resume playback | `PUT /v1/me/player/play` |
| Pause | `PUT /v1/me/player/pause` |
| Skip to next | `POST /v1/me/player/next` |
| Skip to previous | `POST /v1/me/player/previous` |
| Seek | `PUT /v1/me/player/seek` |
| Set volume | `PUT /v1/me/player/volume` |
| Get current track | `GET /v1/me/player/currently-playing` |
| Get queue | `GET /v1/me/player/queue` |

The Web Playback SDK handles the audio stream — Northstar does not process or buffer the audio directly.

---

## Feature support

| Feature | Support |
|---|---|
| Import | Supported. Tracks, albums, and playlists can be imported from the user's Spotify library via the Web API. |
| Playback | Supported. Requires Spotify Premium. Free-tier accounts cannot use the Web Playback SDK or the playback control endpoints. |
| Discovery mode | Supported. Requires Spotify Premium. Northstar seeds playback with a library track, then polls `GET /v1/me/player/currently-playing` every ~3–5 seconds to observe Spotify's autoplay recommendations. |

---

## Constraints

- **Spotify Premium required.** Playback and Discovery mode are unavailable to free-tier users. Northstar surfaces a clear explanation when a free-tier account is detected, not a generic error.
- **Rate limits.** Spotify does not publish exact rate limit thresholds. Northstar's polling cadence (~3–5s during Discovery mode, backed off in the background) is designed to stay well within typical limits.
- **Single active device.** Spotify allows playback on one device at a time. If the user starts playback on another Spotify client while Northstar is active, Northstar loses the active device.
- **Market availability.** Some tracks are unavailable in certain regions. If a track is unavailable in the user's market, Northstar surfaces a playback error and advances the queue.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| Access token expires mid-session | Northstar refreshes automatically. If refresh fails, playback pauses and the user is prompted to re-authenticate. |
| User's Spotify Premium lapses mid-session | Spotify returns a 403 on the next API call. Northstar surfaces a message explaining that Premium is required and pauses playback. |
| User starts playback on another Spotify device | Northstar detects the device handoff via the next poll or SDK event, pauses, and notifies the user that playback moved to another device. |
| A track is unavailable in the user's market | Northstar surfaces a market availability error and advances to the next track. |
| Spotify's autoplay ends during Discovery mode | Northstar detects that playback stopped via polling, returns to idle, and notifies the user that the Discovery session has ended. |
| User is not authenticated when initiating playback | Northstar blocks playback and prompts the user to connect their Spotify account. |
