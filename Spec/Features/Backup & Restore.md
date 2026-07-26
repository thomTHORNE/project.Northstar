# Backup & Restore

## What it is

Backup & Restore is how a Northstar library leaves the device and comes back. Export writes the entire library to a single file; restore replaces the local library with the contents of one. The file is the user's to keep, move, and store wherever they choose — Northstar writes it and reads it, and has no opinion about what happens in between.

This is not sync. Restoring replaces; it never merges. See [Ideas.md](../../Ideas.md) → Northstar-owned sync.

---

## Behavior

### Export

- Export is manual. The user triggers it; Northstar never exports on a schedule.
- An export contains the complete library: every entity, every association, History, and ListeningEvents. Nothing is omitted or summarised.
- The file is written to a temporary location and moved into place only once complete. An interrupted export leaves no file rather than a partial one.

### File format

A backup is a single JSON file: an envelope describing the backup, and a payload holding the library.

| Field | Purpose |
|---|---|
| `format` | Always `northstar-backup`. Identifies the file as a Northstar backup |
| `version` | Schema version of the payload. Restore refuses a version it does not understand |
| `created_at` | When the export was taken |
| `counts` | Entity counts, shown to the user before a restore and reconciled after loading |
| `checksum` | SHA-256 over the serialized payload |
| `payload` | The library |

The payload holds one collection per entity and association type, flat: `tracks`, `artists`, `albums`, `playlists`, `tags`, `notes`, `history`, `listening_events`, `album_tracks`, `playlist_tracks`, `tag_associations`, `tag_hierarchy`, `playlist_tag_filters`.

Collections are flat rather than nested. The file mirrors the Data Model exactly, so anyone who knows the model knows the file, and every reference can be checked mechanically. Nesting would force arbitrary choices — a track belongs to an artist and to albums and to playlists — and reintroduce the duplication associations exist to remove.

### Restore

Restore replaces the entire local library. It is the only operation in Northstar that destroys data the user did not explicitly delete, and its sequence is built so that a failure at any point leaves the existing library untouched.

1. The user selects a backup file.
2. Northstar reads the envelope and shows what the file contains — its `counts` and `created_at` — and asks for confirmation.
3. Northstar writes a safety backup of the current library.
4. The payload is loaded into a temporary store and validated in full.
5. Only once validation passes is the temporary store swapped in.

The existing library is never cleared before the replacement is built and verified. There is no point in the sequence at which both libraries are unavailable.

### Safety backup

Before every restore, Northstar exports the current library to a safety backup in application storage, and names the location in the confirmation prompt. Unlike a user-initiated export, Northstar chooses where this file goes, because a safety net the user has to locate first is not one.

Northstar keeps the most recent safety backup only. Each restore overwrites the previous one.

### Validation

Three passes, all against the temporary store, all before the swap:

- **Structural** — the checksum matches, the version is supported, and every record carries its required fields with the correct types.
- **Referential** — every reference resolves within the file. Each association's two endpoints, each note's `(entity_type, entity_id)`, each track's `artist_id`, each ListeningEvent's `track_id` and `playlist_id`.
- **Count reconciliation** — records loaded match the envelope's `counts`.

Any failure aborts the restore. The safety backup and the existing library both remain intact, and the user is told which pass failed and why.

---

## States

Export and restore are transient operations with no persisted state. A restore is either in progress or it is not; nothing about it survives the operation except the resulting library and the safety backup.

---

## Constraints

- Export is manual only in the initial version.
- Restore replaces. There is no merge, and no partial or selective restore.
- Restore refuses any `version` it does not understand rather than attempting a best-effort read. The initial version accepts `version: 1` only.
- Backups are not encrypted in the initial version. The file is plain JSON and is readable by anything that can open it, including the notes. Where a backup is stored, and what protects it there, is the user's responsibility.
- Northstar does not manage user-initiated exports. It does not track where they were saved, list previous exports, or delete old ones. Safety backups are the exception — Northstar chooses their location and keeps the most recent one.
- A backup is a complete library or it is nothing. There is no incremental or differential export.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| The file is truncated or altered | The checksum fails in the structural pass. The restore aborts before anything is loaded. |
| The file was written by a newer version of Northstar | The version is unsupported. The restore is refused with an explanation naming the version, not a generic error. |
| A note references a track that isn't in the file | The referential pass fails and names the broken reference. A backup that cannot be fully reconstructed is not partially applied. |
| The device runs out of space mid-export | The file is written to a temporary location and moved only on completion, so no partial file appears. |
| The device runs out of space mid-restore | The temporary store fails to build, the swap never happens, and the existing library is untouched. |
| The user restores the same backup twice | The second restore behaves identically to the first. Replace is replace. |
| Capture Mode is active when a restore is attempted | The restore is refused. An active capture session writes into a playlist that a restore may remove. The user is asked to end the session first. |
| The user restores a backup older than their current library | Northstar does not compare them or warn about age. The confirmation prompt shows the backup's `created_at`; the judgment is the user's. |
| The safety backup fails to write | The restore does not proceed. If the current library cannot be preserved, it is not replaced. |
| A restore is attempted immediately after another | The previous safety backup is overwritten by the new one. Only the library as it stood before the most recent restore is recoverable. |
