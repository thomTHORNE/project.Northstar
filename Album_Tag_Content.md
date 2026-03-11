# Content for Album (3.4) and Tag (3.5) sections



## 3.5.1 Definition

A tag is a piece of descriptive metadata used for flexible categorization and searching. While traditional metadata like "Genre" is often fixed, tags enable "folksonomy"—allowing users or systems to label music with moods (e.g., "Chilled," "Energetic"), activities (e.g., "Workout," "Focus"), or specific sub-genres. Tags provide a flexible, user-driven taxonomy that complements the rigid Artist → Album → Track hierarchy.

## 3.5.2 Attributes

- **Name**: The tag label (e.g., "Workout", "Chill", "90s")
- **Description**: Optional explanation of what the tag represents
- **Color/Icon**: Optional visual identifier for the tag
- **Created By**: User ID or system indicator
- **Usage Count**: Number of tracks tagged with this tag
- **Type**: Category of tag (mood, activity, genre, custom, etc.)

## 3.5.3 Relationships

- **Tag → Track[]**: A tag can be applied to multiple tracks
- **Track → Tag[]**: A track can have multiple tags
- **Tag → User**: Tags can be user-created or system-generated

## 3.5.4 Lifecycle

**Creation:**
- Users can create custom tags
- System can auto-generate tags based on metadata or listening patterns
- Tags can be created during track import or manually added later

**Application:**
- Tags are applied to tracks by users or automated systems
- Multiple tags can be applied to a single track
- Tags can be removed from tracks at any time

**Editing:**
- Tag names and descriptions can be modified
- OPEN QUESTION: When a tag is renamed, are all track associations automatically updated?

**Deletion:**
- Tags can be deleted by users
- OPEN QUESTION: What happens to track associations when a tag is deleted?

## 3.5.5 Constraints

- **Unique Names**: Tag names should be unique within a user's library (case-insensitive)
- **Many-to-Many Relationship**: Tags and tracks have a many-to-many relationship
- **No Hierarchy**: Tags are flat; they do not have parent-child relationships (unless explicitly designed)

## 3.5.6 Edge Cases

- **Duplicate Tag Names**: Handling tags with similar names (e.g., "Chill" vs "Chilled")
- **Unused Tags**: Tags that are created but never applied to any tracks
- **System vs. User Tags**: Conflicts between system-generated and user-created tags with the same name
- **Tag Overload**: Tracks with an excessive number of tags making them less useful for filtering
