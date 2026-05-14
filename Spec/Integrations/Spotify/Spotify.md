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

### Authorization flow

Northstar uses two distinct Spotify auth mechanisms depending on what it needs to do.

**PKCE — Web API token (all platforms)**

The PKCE flow runs once when the user first connects their Spotify account and produces the token used for all Web API calls: import, REST playback control, and Discovery mode polling.

1. Northstar generates a cryptographically random code verifier and derives the code challenge (SHA-256, base64url-encoded).
2. Northstar opens Spotify's authorization endpoint in the system browser, with all required parameters:
   ```
   https://accounts.spotify.com/authorize
     ?response_type=code
     &client_id=CLIENT_ID
     &redirect_uri=northstar%3A%2F%2Fspotify-callback
     &scope=streaming%20user-read-email%20user-library-read%20...
     &code_challenge_method=S256
     &code_challenge=HASHED_VERIFIER
     &state=RANDOM_STATE
   ```
3. The user grants access in Spotify's login page. Spotify redirects to the registered redirect URI with the authorization code:
   ```
   northstar://spotify-callback?code=AUTH_CODE&state=RANDOM_STATE
   ```
4. Northstar verifies the `state` value matches what it sent in step 2, then exchanges the code for tokens:
   ```
   POST https://accounts.spotify.com/api/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code
   &code=AUTH_CODE
   &redirect_uri=northstar%3A%2F%2Fspotify-callback
   &client_id=CLIENT_ID
   &code_verifier=ORIGINAL_VERIFIER
   ```
5. Northstar stores both tokens securely on device. All required scopes are requested in a single authorization — the user grants all permissions upfront.

**App Remote SDK auth — SDK connection token (mobile only)**

On iOS and Android, the App Remote SDK requires a separate token to initialize the SDK connection to the Spotify app. The Spotify iOS/Android SDKs handle this flow internally via `spotify_sdk`'s `connectToSpotifyRemote()`. The Spotify app is opened (or the user is prompted to install it), and a token is returned directly in the redirect — no code exchange step:

```
northstar://spotify-callback?access_token=SDK_TOKEN&...
```

This token is used exclusively for the SDK connection and is distinct from the Web API token. Both redirect types land at `northstar://spotify-callback` — Northstar's URL scheme handler distinguishes them by their parameters: the PKCE redirect contains `code` and `state`; the App Remote redirect contains the SDK token directly.

### Redirect URIs

| Platform | Redirect URI | Mechanism |
|---|---|---|
| iOS | `northstar://spotify-callback` | Custom URL scheme. The OS routes the redirect back to the Northstar app. Handles both PKCE and App Remote SDK redirects. |
| Android | `northstar://spotify-callback` | Custom URL scheme registered via Android intent filter. Handles both redirect types. |
| Desktop | `http://127.0.0.1:{PORT}/callback` | Northstar is served from a fixed loopback address. Spotify redirects back to the same origin; the app reads the authorization code from URL query parameters. |

All redirect URIs must be registered in the Spotify developer dashboard. Spotify requires exact matches — the loopback address must use `127.0.0.1`, not `localhost`, and a fixed port must be chosen at implementation time. The custom URL scheme must not conflict with other installed apps.

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

### Skip-back behavior

Player.md defines skip-back as: return to the previous track, or restart the current track if more than 3 seconds have elapsed. Spotify's `POST /v1/me/player/previous` always returns to the previous track — it does not accept a position threshold. Northstar implements the 3-second rule by checking elapsed position from `subscribeToPlayerState()` before issuing the command:

- Elapsed < 3s: call `POST /v1/me/player/previous`
- Elapsed ≥ 3s: call `PUT /v1/me/player/seek?position_ms=0`

### Progress tracking

Northstar uses `spotify_sdk`'s `subscribeToPlayerState()` to track playback progress. The method returns a stream of player state objects containing the current playback position, active track, and pause state. Updates fire on state changes — play, pause, seek, and track change — on both platforms:

| Platform | Underlying mechanism |
|---|---|
| iOS / Android | App Remote SDK player state subscription |
| Desktop | Web Playback SDK `player_state_changed` events |

`subscribeToPlayerState()` is the mechanism for evaluating both the ListeningEvent threshold (40% of track duration) and the Capture Mode threshold (30 seconds elapsed). `GET /v1/me/player/currently-playing` polling is used only for track-change detection during Discovery mode — its ~3–5s cadence is too coarse for threshold evaluation.

---

## Feature support

| Feature | Support |
|---|---|
| Import | Supported. Tracks, albums, and playlists can be imported from the user's Spotify library via the Web API. Owned and collaborative playlists are imported; followed playlists (owned by other users) are not. |
| Playback | Supported. Requires Spotify Premium. Free-tier accounts cannot use Spotify playback controls. |
| Discovery mode | Supported. Requires Spotify Premium. Northstar seeds playback with a library track, then polls `GET /v1/me/player/currently-playing` every ~3–5 seconds to observe Spotify's autoplay recommendations. |

---

## Import

All import operations use the Spotify Web API directly. The Spotify SDK is not involved in import.

### Service import

| Endpoint | Returns |
|---|---|
| `GET /v1/me/tracks` | User's saved tracks |
| `GET /v1/me/albums` | User's saved albums |
| `GET /v1/me/playlists` | User's playlists — owned and collaborative only |
| `GET /v1/playlists/{id}/items` | Tracks within a specific playlist |
| `GET /v1/me/following?type=artist` | Artists the user follows |

### Link import

| Endpoint | Returns |
|---|---|
| `GET /v1/tracks/{id}` | Single track |
| `GET /v1/albums/{id}` | Single album |
| `GET /v1/artists/{id}` | Single artist |
| `GET /v1/playlists/{id}` | Single playlist |

### Pagination

Spotify list endpoints are paginated. Northstar requests the maximum page size each endpoint allows:

| Endpoint | Max page size |
|---|---|
| `GET /v1/me/tracks` | 50 |
| `GET /v1/me/albums` | 50 |
| `GET /v1/me/playlists` | Verify at implementation |
| `GET /v1/playlists/{id}/items` | Verify at implementation |
| `GET /v1/me/following?type=artist` | Verify at implementation |

Most endpoints use offset-based pagination (`limit` + `offset`). `GET /v1/me/following?type=artist` uses cursor-based pagination — each response returns an `after` cursor used in the next request.

**Interruption and resume:** Before processing each page, Northstar persists the current offset or cursor. If an import is interrupted, it resumes from the last persisted position rather than restarting from the beginning.

**User visibility:** Northstar displays a loading indicator for the duration of the import.

---

## Constraints

- **Spotify Premium required.** Playback and Discovery mode are unavailable to free-tier users. Northstar surfaces a clear explanation when a free-tier account is detected, not a generic error.
- **Spotify app required on mobile.** On iOS and Android, the Spotify app must be installed for playback. If it is not installed, Northstar surfaces a clear message directing the user to install it.
- **Browser requirement on desktop.** Desktop playback runs in a Flutter web build and requires Chrome or Edge. Safari is not supported for Spotify playback.
- **Rate limits.** Spotify does not publish exact rate limit thresholds. Northstar's polling cadence (~3–5s during Discovery mode, backed off in the background) is designed to stay well within typical limits.
- **Single active device.** Spotify allows playback on one device at a time. If the user starts playback on another Spotify client while Northstar is active, Northstar loses the active device.
- **Market availability.** Some tracks are unavailable in certain regions. If a track is unavailable in the user's market, Northstar surfaces a playback error and advances the queue.
- **Autoplay not guaranteed.** Spotify's autoplay feature is a user account setting Northstar cannot read or control. If autoplay is disabled, Discovery mode ends after the seed track completes.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| Access token expires mid-session | Northstar refreshes automatically. If refresh fails, playback pauses and the user is prompted to re-authenticate. |
| User's Spotify Premium lapses mid-session | Spotify returns a 403 on the next API call. Northstar surfaces a message explaining that Premium is required and pauses playback. |
| User starts playback on another Spotify device | Northstar detects the device handoff via the next poll or SDK event, pauses, and notifies the user that playback moved to another device. |
| A track is unavailable in the user's market | Northstar surfaces a market availability error and advances to the next track. |
| Spotify's autoplay ends during Discovery mode | Northstar detects that playback stopped via polling, returns to idle, and notifies the user that the Discovery session has ended. |
| Spotify autoplay is disabled in the user's account settings | Discovery mode ends when the seed track completes. Northstar detects playback has stopped, returns to idle, and notifies the user. The message suggests checking that autoplay is enabled in Spotify settings. |
| User is not authenticated when initiating playback | Northstar blocks playback and prompts the user to connect their Spotify account. |
| Mobile: Spotify app is not installed | Northstar surfaces a message directing the user to install the Spotify app. Playback is blocked until resolved. |
