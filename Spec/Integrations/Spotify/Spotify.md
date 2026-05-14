# Spotify

Spotify is Northstar's primary streaming integration and the only source in v1 that supports Discovery mode. All Spotify playback requires an active Premium subscription — playback controls and SDK access are unavailable to free-tier users.

The Spotify integration is split across several documents:

- [Authentication](Authentication.md) — OAuth scopes, PKCE flow, App Remote SDK auth, redirect URIs
- [Playback](Playback.md) — `spotify_sdk` package, Spotify Connect Web API, skip-back behavior, progress tracking
- [Import](Import.md) — service import, link import, pagination

## Source links

Spotify source links are stored as `{ source: "spotify", id: "{spotify_id}" }`. The ID is the bare Spotify entity identifier — no URI prefix, no URL.

| Entity | Example ID | Spotify URI (constructed at use time) |
|---|---|---|
| Track | `4iV5W9uYEdYUVa79Axb7Rh` | `spotify:track:4iV5W9uYEdYUVa79Axb7Rh` |
| Artist | `0OdUWJ0sBjDrqHygGUXeCF` | `spotify:artist:0OdUWJ0sBjDrqHygGUXeCF` |
| Album | `1vz94WpXDVYIEGja8cjFNa` | `spotify:album:1vz94WpXDVYIEGja8cjFNa` |

The Spotify integration handler constructs the URI at the point of use — for playback (`PUT /v1/me/player/play`), for Discovery mode seeding, or for any other API call that requires a Spotify URI.

At import time, the Spotify API returns entities with URIs in the format `spotify:{type}:{id}`. The handler extracts the ID segment and stores only that. If the user provides a Spotify URL (`https://open.spotify.com/track/{id}`), the handler extracts the ID from the path.

## Feature support

| Feature | Support |
|---|---|
| Import | Supported. Tracks, albums, and playlists can be imported from the user's Spotify library via the Web API. Owned and collaborative playlists are imported; followed playlists (owned by other users) are not. |
| Playback | Supported. Requires Spotify Premium. Free-tier accounts cannot use Spotify playback controls. |
| Discovery mode | Supported. Requires Spotify Premium. Northstar seeds playback with a library track, then polls `GET /v1/me/player/currently-playing` every ~3–5 seconds to observe Spotify's autoplay recommendations. |

## Constraints

- **Spotify Premium required.** Playback and Discovery mode are unavailable to free-tier users. Northstar surfaces a clear explanation when a free-tier account is detected, not a generic error.
- **Spotify app required on mobile.** On iOS and Android, the Spotify app must be installed for playback. If it is not installed, Northstar surfaces a clear message directing the user to install it.
- **Browser requirement on desktop.** Desktop playback runs in a Flutter web build and requires Chrome or Edge. Safari is not supported for Spotify playback.
- **Rate limits.** Spotify does not publish exact rate limit thresholds. Northstar's polling cadence (~3–5s during Discovery mode, backed off in the background) is designed to stay well within typical limits.
- **Single active device.** Spotify allows playback on one device at a time. If the user starts playback on another Spotify client while Northstar is active, Northstar loses the active device.
- **Market availability.** Some tracks are unavailable in certain regions. If a track is unavailable in the user's market, Northstar surfaces a playback error and advances the queue.
- **Autoplay not guaranteed.** Spotify's autoplay feature is a user account setting Northstar cannot read or control. If autoplay is disabled, Discovery mode ends after the seed track completes.

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
