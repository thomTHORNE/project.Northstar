# The Library

The Library in Northstar is a collection of artists, albums, songs, playlists, and tags that are related to one another. Northstar’s core value lies in the storage and management of these data types, providing a centralized hub for a user’s music preferences, especially since streaming services cannot guarantee they will align completely with those preferences.

# Data Types

## Track

A track is the most granular unit of data, representing a single audio file or stream. In Northstar it contains the only the metadata that identifies what the song is, not the actual digital audio data. Key attributes include the title, duration (in seconds or milliseconds), file path or URL, and unique identifiers that link it to an artist and an album.

To manually add a track to the library, a user will first be prompted to provide a link to an external source. Northstar will then attempt to extract metadata from this source to assign to the track. If Northstar is unable to extract the metadata but the linking is successful, the user will be permitted to enter the track information manually. Users are allowed to link a single track to multiple external sources associated with their account and may remove these links at any time.

Tracks can also be added to the library automatically through the import process$^1$.

---

$*^1$Add tracks via importing*

- *[Manual import to library from a streaming service](https://www.notion.so/Manual-import-to-library-from-a-streaming-service-318e10655698804a87edca5498ec7a42?pvs=21)*
- *[Automatic import to library from a streaming service](https://www.notion.so/Automatic-import-to-library-from-a-streaming-service-318e1065569880f6b293c5bfb229387e?pvs=21)*

## Playlist

A playlist is a user-defined or system-generated collection of tracks. Unlike an album, which is a static professional release, a playlist is dynamic and can contain tracks from many different artists and albums. It usually stores a name, a description, a "created by" user ID (used for social sharing feature), and an ordered list of track references.

### Initiation Triggers

- **Global "New Playlist" Action**: A dedicated button within the navigation sidebar or library header.
- **Contextual "Add to New Playlist" Action**: Available via the "More Options" (ellipsis) menu on any individual track, album, or artist page.
- **Composable "Add to New Playlist" Action**: Available via the filter bar within any individual album, or artist page.
- **Selection-Based Action**: Triggered when a user selects multiple tracks and chooses the "Create Playlist from Selection" command.

### Capture Mode

Capture Mode automates the curation process, transforming playlists from a static collection to a live chronological "journal" of a listening session. By shifting the "Add to Playlist" action from a conscious user decision to an automated system response, Northstar ensures that the user's focus remains entirely on the auditory experience, allowing them to record the musical narrative of a specific moment or mood without manual intervention, while the system silently documents the session's history.

### Operational Logic and Constraints

- **Exclusive Activation**: Only one playlist per user account may have Capture Mode enabled at any given time. Enabling Capture Mode on "Playlist B" will automatically disable it on "Playlist A."
- **Trigger Event**: The "Add to Playlist" action must trigger at the `onTrackStart` event (when the playhead reaches 0:00). This ensures that tracks skipped before they begin are not captured.
- **Duplicate Prevention**: The system should include a configurable setting for "Ignore Duplicates." If enabled, a track that is already present in the Capture Playlist will not be added again during the same session.
- **Source Filtering**: Users should be able to toggle which sources are "capturable." For example, a user may want to capture tracks played from "Radio" or "Discovery" modes, but ignore tracks played from their existing "Favorites" library to avoid redundancy.

### User Interface (UI) and Feedback

- **Active State Indicator**: When Capture Mode is active, a persistent "Recording" or "Capturing" icon (e.g., a pulsing red dot or a Northstar-branded compass icon) should appear in the Global Player Bar.
- **Contextual Notifications**: A non-intrusive "toast" notification should appear briefly when a track is successfully captured: " 'Song Title' added to [Playlist Name]."
- **Playlist View**: Within the playlist library, the active Capture Playlist should be visually highlighted with a unique border or status badge to distinguish it from standard playlists.

### Advanced Capture Rules (Smart Logic)

To prevent the playlist from becoming cluttered with accidental plays, the following logic can be implemented:

- **Minimum Playtime Threshold**: A track is only added to the playlist if it is played for more than XX seconds (e.g., 30 seconds). This prevents "channel surfing" from filling the playlist with unwanted tracks.
- **Session Grouping**: The system can automatically insert "Session Headers" or "Date Tags" into the playlist to group tracks captured during a single continuous listening period.
- **Auto-Disable Timer**: To prevent accidental background capturing, users can set a "Capture Timer" (e.g., "Capture for the next 2 hours"), after which the mode automatically toggles off.

### Use Case Scenarios

- **The "Vibe" Capture**: A user starts a "Discovery Radio" station. They enable Capture Mode on a new playlist called "Summer Night 2026." Every song they enjoy and listen to through completion is saved without them ever having to unlock their phone.
- **Live Set Recording**: A user is at a party where Northstar is the primary audio source. They enable Capture Mode to create a "Live Log" of the night's energy to revisit later.
- **Research & Curation**: A curator listens to a 50-track promotional pool. By enabling Capture Mode and skipping the tracks they dislike within the first 5 seconds, only the "keepers" are automatically aggregated into their working playlist.

## Tag

A tag is a piece of descriptive metadata used for flexible categorization and searching. While traditional metadata like "Genre" is often fixed, tags are frequently used for "folksonomy"—allowing users or systems to label music with moods (e.g., "Chilled," "Energetic"), activities (e.g., "Workout," "Focus"), or specific sub-genres. A single track can have multiple tags, making it easier to filter the library beyond the standard artist/album hierarchy.

## Artist

The artist data type represents the creator or performer of the music. This can be an individual person, a band, or a composer. It serves as a top-level organizational entity. Common attributes include the artist's name, a biography, and links to all the albums and tracks associated with them in the database.

## Album

An album is a collection of tracks released together by an artist. It acts as a container that groups tracks based on their original publication. Typical attributes include the album title, release date, cover art (usually a URL to an image), and the genre. It also maintains an ordered list of track IDs to preserve the original "tracklist" sequence.

# Library Management

The Northstar’s library is split into two primary spaces: the Staging and the Repository. The Repository is further divided into two categories: Related and Unrelated.

## Staging

This space is for all data types that a user has made changes to and is evaluating before deciding whether to commit them to the library or discard them. It offers a clear visual distinction of intent for library management. Any data imported through a service integration will be placed here to prevent the Repository from being polluted by large amounts of unvetted data.

> .
> 
> 
> ---
> 
> - what happens when a playlist is changed/deleted?
> - what happens when a track is changed/deleted?
> - what happens when an artist is changed/deleted?
> - what happens when an album is changed/deleted?
> - how is the changes bulk managed?
> - are tracks in this space playable? (maybe only playlists created in it and not any other track that would be a part of some change?)

## Repository

The single source of truth in this space are tracks that are officially committed to the library by a user. Once a track is committed to this space, the information stored within it is used by Northstar to automatically create and set up relations between the 3 data types artist, album and the track itself.

All tracks in this space are organized into either of the two categories: Related and Unrelated.

Their purpose is track identification by artist.

- Related: Tracks with an assigned artist.
- Unrelated: Tracks that are missing an artist assignment.

> .
> 
> 
> ---
> 
> - what happens when a playlist is changed/deleted?
> - what happens when a track is changed/deleted?
> - is the repository read-only or r/w?