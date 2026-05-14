# Import

All import operations use the Spotify Web API directly. The Spotify SDK is not involved in import.

## Service import

| Endpoint | Returns |
|---|---|
| `GET /v1/me/tracks` | User's saved tracks |
| `GET /v1/me/albums` | User's saved albums |
| `GET /v1/me/playlists` | User's playlists — owned and collaborative only |
| `GET /v1/playlists/{id}/items` | Tracks within a specific playlist |
| `GET /v1/me/following?type=artist` | Artists the user follows |

## Link import

| Endpoint | Returns |
|---|---|
| `GET /v1/tracks/{id}` | Single track |
| `GET /v1/albums/{id}` | Single album |
| `GET /v1/artists/{id}` | Single artist |
| `GET /v1/playlists/{id}` | Single playlist |

## Pagination

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
