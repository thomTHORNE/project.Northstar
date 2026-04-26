# Architecture

This document records Northstar's technical stack decisions and the reasoning behind them. It is the authoritative reference for technology choices. Detailed architecture decisions — data storage design, API surface, deployment model, background service patterns — are worked out in Phase 4 and added here as they are resolved.

---

## Tech stack

### Backend

| Layer | Technology | Rationale |
|---|---|---|
| API framework | ASP.NET Core | Mature, performant REST API framework. Well-documented, strong ecosystem, and consistent with existing C#/.NET familiarity. |
| Database | PostgreSQL | Native UUID support, JSONB for flexible fields (`source_links`), array types for tag relationships, built-in full-text search for library queries, strong relational model for entity relationships. |
| ORM | EF Core + Npgsql | Standard .NET ORM. Npgsql is the PostgreSQL provider. Handles migrations, query generation, and type mapping. |

### Frontend

| Layer | Technology | Rationale |
|---|---|---|
| UI framework | Flutter | Mobile-first. Renders every pixel itself — no WebView. Consistent cross-platform behavior on iOS, Android, and desktop from a single codebase. Gesture handling and animations are first-class, directly aligned with the *Snappy* and *Tactile* design principles. Background audio via `just_audio` + `audio_service` provides proper native OS audio session integration. |
| Language | Dart | Flutter's native language. Syntactically similar to both TypeScript and C#, which reduces the learning curve given the existing background. |

---

## Platform targets

| Platform | Approach | Spotify playback mechanism |
|---|---|---|
| iOS | Flutter native | `spotify_sdk` — wraps native Spotify iOS SDK |
| Android | Flutter native | `spotify_sdk` — wraps native Spotify Android SDK |
| Desktop (macOS, Windows) | Flutter web in browser | `spotify_sdk` — wraps Spotify Web Playback SDK |

Desktop requires a browser with EME support. Chrome and Edge are supported. Safari is not supported for Spotify playback.

Desktop packaging — wrapping the Flutter web build in a native shell (e.g. Electron) to remove the browser window — is deferred. The web build is the same regardless of how it is eventually packaged.

---

## Decisions deferred to Phase 4

- Deployment model (local, self-hosted, cloud)
- Data storage and persistence design
- Cross-source queue handoff architecture
- History retention window and undo eligibility
- ListeningEvent storage and query design
- Background service design for Discovery mode polling
