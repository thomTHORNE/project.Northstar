# Tags

## What it is

A tag is a user-defined label that can be applied to any entity in the library — tracks, artists, albums, and playlists. Tags are the primary tool for adding personal meaning and context to music beyond its formal structure, and they power the dynamic composition of playlists.

See [Data Model — Tag](../1.%20Data%20Model.md#tag) for the full field and relationship definitions.

---

## Behavior

### Creating a tag

- Tags are created by the user. There are no system-generated tags in the initial version.
- A tag can be created standalone (from a tag management view) or inline — while tagging an entity, the user types a name that doesn't yet exist and confirms creation.
- Tag names are unique per user, case-insensitive. If the user attempts to create a tag with a name that already exists, the existing tag is used instead.

### Applying a tag

- Tags can be applied to any entity: a track, an artist, an album, or a playlist.
- Multiple tags can be applied to a single entity.
- A single tag can be applied to any number of entities across any entity type.
- Applying a tag to an entity immediately takes effect — any playlists filtering on that tag update instantly.

### Removing a tag from an entity

- Tags can be removed from an entity at any time.
- Removing a tag from an entity does not delete the tag itself.
- Removing a tag that is used as a filter by one or more playlists causes those playlists to immediately drop any tracks that were matched solely by that tag.

### Renaming a tag

- Renaming a tag updates the name everywhere it appears — on all entities it is applied to and in all playlist filters that reference it.
- No confirmation is required. The change is applied immediately and logged in History.

### Deleting a tag

- Deleting a tag removes it from all entities it is applied to and from all playlist filters that reference it.
- The user must confirm before deletion. The confirmation message states how many entities carry the tag and how many playlists use it as a filter, so the user understands the scope.
- The deletion and all removed associations are logged in History as a grouped operation and can be undone in a single action.

### Tag groups (hierarchy)

Tags can be organised into groups using a two-level hierarchy. A group is itself a tag — it can be applied to entities and used as a playlist filter just like any other tag.

- A tag can belong to one or more groups by assigning parent tags via `parent_ids`.
- A tag with no parents is a top-level tag.
- Groups can be created and managed the same way as regular tags.
- Circular references are not allowed — a tag cannot be set as its own ancestor.
- The hierarchy is limited to two levels: a group may not itself belong to another group. This keeps navigation simple.
- In the tag browser, groups are displayed as expandable folders containing their child tags.

---

## States

Tags do not have meaningful states beyond their existence. A tag exists in the library or it doesn't.

---

## Constraints

- Tag names must be unique per user, case-insensitive.
- A tag can be applied to any entity type — there is no restriction on which types a tag may be used with.
- Tag groups are limited to two levels of nesting. A tag that has child tags cannot itself be assigned a parent.
- A tag may belong to multiple groups (many-to-many).

---

## Edge cases

| Scenario | Behavior |
|---|---|
| User creates a tag with a name that already exists (different casing) | The existing tag is returned. No duplicate is created. |
| A tag used as a playlist filter is deleted | The tag is removed from all filters. Affected playlists immediately lose any tracks matched solely by that tag. The user is warned of this during the deletion confirmation. |
| A tag is removed from a track that appears in a tag-driven playlist via that tag | The track is immediately removed from the playlist. |
| A tag group is deleted | The group tag is deleted and removed from all child tags' `parent_ids`. Child tags are not deleted — they become top-level tags. |
| A tag with children is assigned a parent | Not allowed. A tag that has child tags cannot itself be nested under a parent. The action is rejected with an explanation. |
| A tag is applied to a `pending_review` entity | The tag is applied normally. If the entity is later discarded, the tag association is removed with it. The tag itself is not affected. |
| The same tag is applied to an entity more than once | Idempotent — the second application has no effect. No duplicate association is created. |
