# Spotify

Spotify is Northstar's primary streaming integration and the only source in v1 that supports Discovery mode. All Spotify playback requires an active Premium subscription — playback controls and SDK access are unavailable to free-tier users.

---

## Authentication

Spotify uses OAuth 2.0. Northstar implements the Authorization Code Flow with PKCE, which does not require a backend secret and is appropriate for a desktop or mobile client.

**Required scopes:**

| Scope | Purpose | Platform |
|---|---|---|
| `streaming` | Use the Web Playback SDK to play audio within Northstar | Desktop only |
| `user-read-email` | Required by the Web Playback SDK for SDK initialisation | Desktop only |
| `user-read-private` | Required by the Web Playback SDK for SDK initialisation | Desktop only |
| `user-read-playback-state` | Read the current playback state (track, position, device) | All |
| `user-modify-playback-state` | Control playback: play, pause, skip, seek, set volume | All |
| `user-read-currently-playing` | Poll the currently playing track during Discovery mode | All |
| `playlist-read-private` | Read the user's private playlists for import | All |
| `playlist-read-collaborative` | Read collaborative playlists for import | All |
| `user-library-read` | Read the user's saved tracks and albums for import | All |

Access tokens expire after one hour. Northstar refreshes the token automatically using the refresh token before expiry. With PKCE, the token refresh response may include a new refresh token — Northstar must store it if returned, as the previous token is invalidated. If the refresh fails, the session is invalidated and the user is prompted to re-authenticate.

---

## Source links

Spotify source links are stored as `{ source: "spotify", id: "{spotify_id}" }`. The ID is the bare Spotify entity identifier — no URI prefix, no URL.

| Entity | Example ID | Spotify URI (constructed at use time) |
|---|---|---|
| Track | `4iV5W9uYEdYUVa79Axb7Rh` | `spotify:track:4iV5W9uYEdYUVa79Axb7Rh` |
| Artist | `0OdUWJ0sBjDrqHygGUXeCF` | `spotify:artist:0OdUWJ0sBjDrqHygGUXeCF` |
| Album | `1vz94WpXDVYIEGja8cjFNa` | `spotify:album:1vz94WpXDVYIEGja8cjFNa` |

The Spotify integration handler constructs the URI at the point of use — for playback (`PUT /v1/me/player/play`), for Discovery mode seeding, or for any other API call that requires a Spotify URI.

At import time, the Spotify API returns entities with URIs in the format `spotify:{type}:{id}`. The handler extracts the ID segment and stores only that. If the user provides a Spotify URL (`https://open.spotify.com/track/{id}`), the handler extracts the ID from the path.

---

## Playback mechanism

Northstar uses the `spotify_sdk` Flutter package on all platforms. The underlying SDK it wraps differs by platform:

| Platform | SDK | How it works |
|---|---|---|
| iOS | Spotify iOS SDK | `spotify_sdk` remote-controls the Spotify app via the App Remote SDK. The Spotify app must be installed on the device. Audio is handled by the Spotify app. |
| Android | Spotify Android SDK | `spotify_sdk` remote-controls the Spotify app via the App Remote SDK. The Spotify app must be installed on the device. Audio is handled by the Spotify app. |
| Desktop (macOS, Windows) | Spotify Web Playback SDK | Northstar runs as a Flutter web build in the browser. `spotify_sdk` registers Northstar as a Spotify Connect device and handles the audio stream directly in the browser. Requires Chrome or Edge — Safari is not supported. |

On mobile, Northstar remote-controls the Spotify app already running on the device — no audio handling is required within Northstar. On desktop, Northstar registers as a Spotify Connect device and receives a device ID it can target with Web API calls.

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

---

## Feature support

| Feature | Support |
|---|---|
| Import | Supported. Tracks, albums, and playlists can be imported from the user's Spotify library via the Web API. |
| Playback | Supported. Requires Spotify Premium. Free-tier accounts cannot use Spotify playback controls. |
| Discovery mode | Supported. Requires Spotify Premium. Northstar seeds playback with a library track, then polls `GET /v1/me/player/currently-playing` every ~3–5 seconds to observe Spotify's autoplay recommendations. |

---

## Constraints

- **Spotify Premium required.** Playback and Discovery mode are unavailable to free-tier users. Northstar surfaces a clear explanation when a free-tier account is detected, not a generic error.
- **Spotify app required on mobile.** On iOS and Android, the Spotify app must be installed for playback. If it is not installed, Northstar surfaces a clear message directing the user to install it.
- **Browser requirement on desktop.** Desktop playback runs in a Flutter web build and requires Chrome or Edge. Safari is not supported for Spotify playback.
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
| Mobile: Spotify app is not installed | Northstar surfaces a message directing the user to install the Spotify app. Playback is blocked until resolved. |
