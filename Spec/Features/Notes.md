# Notes

## What it is

A note is a free-form text entry attached to a single entity in the library. Notes are private to the user and carry no structural meaning — they exist to hold personal context: why a record matters, where a track was discovered, what an artist means at a particular point in life.

See [Data Model — Note](../1.%20Data%20Model.md#note) for the full field and relationship definitions.

---

## Behavior

### Creating a note

- Every entity in the library — track, artist, album, playlist, and tag — has a note field available in its detail view.
- A note is created the moment the user begins writing. There is no separate "create note" action — the field is always present and editable.
- A note record is persisted to the database only when the user has entered at least one character. An empty field does not produce a note record.

### Editing a note

- Notes can be edited at any time. The field is always accessible from the entity's detail view.
- Changes are saved automatically. There is no explicit save action.
- Edits are logged in History.

### Deleting a note

- A note is deleted when the user clears the field entirely.
- No confirmation is required — clearing the field is the deletion action.
- The deletion is logged in History and can be undone within the grace period.

### Entity deletion

- When an entity is deleted, its note is deleted with it.
- No separate warning is shown for the note — the entity deletion prompt covers it.

---

## States

Notes do not have meaningful states. A note exists and is editable, or it does not exist because the field is empty.

---

## Constraints

- Each entity can have at most one note.
- Notes are not searchable in the initial version.
- Notes are private — they are not included in any library sharing or export features in the initial version.
- There is no character limit in the initial version.

---

## Edge cases

| Scenario | Behavior |
|---|---|
| User clears a note and immediately wants it back | The deletion is logged in History. The user can undo it within the grace period to restore the note content. |
| A note exists on a `pending_review` entity that is discarded | The note is deleted with the entity. It is included in the grouped History entry for that discard action and can be restored via undo. |
| User navigates away while editing a note | Changes are saved automatically before navigation. No content is lost. |
