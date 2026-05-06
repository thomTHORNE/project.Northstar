# History

Completed tasks, archived from TASKS.md. For logging purposes only — do not read or search this file. If historical context is needed, the user will provide it manually.

---

## Phase 1 — Foundation

- Anchor document — [Northstar in simple terms.md](Northstar%20in%20simple%20terms.md)
- Design Principles — [Spec/Design Principles.md](Spec/Design%20Principles.md)
- `#2` **Album deletion cascade describes wrong field** — The cascade says "their `album_id` is set to null" but the field is `album_ids` (UUID[]). Setting to null would wipe all album associations from the track. The correct behavior is removing the deleted album's ID from the array.

---

## Phase 2 — Feature Specs

- Capture Mode — [Spec/Features/Capture%20Mode.md](Spec/Features/Capture%20Mode.md)
- Tags — [Spec/Features/Tags.md](Spec/Features/Tags.md)
- Import — [Spec/Features/Import.md](Spec/Features/Import.md)
- Player — [Spec/Features/Player.md](Spec/Features/Player.md)

---

## Phase 3 — API Design

### Integrations — Spotify

- **Define source link format for Spotify entities** — Source links store bare IDs only: `{ source: "spotify", id: "{id}" }`. The Spotify handler constructs URIs at use time. IDs are extracted from URIs or URLs at import time. `Link` type defined in Data Model.
- **Discovery mode autoplay dependency** — Spotify's autoplay after the seed track ends is a user account setting Northstar cannot read or control. If it's off, the session goes idle immediately after the seed track. Edge case added to Spotify.md and Player.md.
- **Progress tracking mechanism** — Both the ListeningEvent threshold (40%) and the Capture Mode threshold (30s) use `subscribeToPlayerState()`. Polling `currently-playing` at 3–5s is for track-change detection only. Documented in Spotify.md.
- **Discovery mode queue view is shallow** — Resolved by adding a queue re-fetch note to Player.md (re-fetched on each track change via `subscribeToPlayerState()`). Exact queue depth limit unverified; treated as an implementation detail.
- **Web Playback SDK is incompatible with Flutter native** — Mobile (iOS/Android) uses `spotify_sdk` wrapping the native Spotify SDKs. Desktop targets Flutter web, where `spotify_sdk` wraps the Web Playback SDK. See [Spec/Architecture.md](Spec/Architecture.md).
- `#12` **Skip-back semantics** — If elapsed > 3s, call `PUT /v1/me/player/seek?position_ms=0` instead of `POST /v1/me/player/previous`. Documented in Spotify.md.
- `#17` **Playlist import scope** — Import owned and collaborative playlists only. Followed playlists (owned by other users) are not imported. Documented in Spotify.md feature support table.
