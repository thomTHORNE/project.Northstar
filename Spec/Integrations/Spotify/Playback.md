# Playback

Northstar uses the `spotify_sdk` Flutter package on all platforms. The underlying SDK it wraps differs by platform:

| Platform | SDK | How it works |
|---|---|---|
| iOS | Spotify iOS SDK | `spotify_sdk` remote-controls the Spotify app via the App Remote SDK. The Spotify app must be installed on the device. Audio is handled by the Spotify app. |
| Android | Spotify Android SDK | `spotify_sdk` remote-controls the Spotify app via the App Remote SDK. The Spotify app must be installed on the device. Audio is handled by the Spotify app. |
| Desktop (macOS, Windows) | Spotify Web Playback SDK | Northstar runs as a Flutter web build in the browser. `spotify_sdk` registers Northstar as a Spotify Connect device and handles the audio stream directly in the browser. Requires Chrome or Edge — Safari is not supported. |

On mobile, Northstar remote-controls the Spotify app already running on the device — no audio handling is required within Northstar. On desktop, Northstar registers as a Spotify Connect device and receives a device ID it can target with Web API calls.

## Spotify Connect Web API

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

## Skip-back behavior

[Player.md](../../Features/Player.md) defines skip-back as: return to the previous track, or restart the current track if more than 3 seconds have elapsed. Spotify's `POST /v1/me/player/previous` always returns to the previous track — it does not accept a position threshold. Northstar implements the 3-second rule by checking elapsed position from `subscribeToPlayerState()` before issuing the command:

- Elapsed < 3s: call `POST /v1/me/player/previous`
- Elapsed ≥ 3s: call `PUT /v1/me/player/seek?position_ms=0`

## Progress tracking

Northstar uses `spotify_sdk`'s `subscribeToPlayerState()` to track playback progress. The method returns a stream of player state objects containing the current playback position, active track, and pause state. Updates fire on state changes — play, pause, seek, and track change — on both platforms:

| Platform | Underlying mechanism |
|---|---|
| iOS / Android | App Remote SDK player state subscription |
| Desktop | Web Playback SDK `player_state_changed` events |

`subscribeToPlayerState()` is the mechanism for evaluating both the ListeningEvent threshold (40% of track duration) and the Capture Mode threshold (30 seconds elapsed). `GET /v1/me/player/currently-playing` polling is used only for track-change detection during Discovery mode — its ~3–5s cadence is too coarse for threshold evaluation.
