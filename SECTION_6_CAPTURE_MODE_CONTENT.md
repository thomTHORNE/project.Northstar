# Section 6.2 - Playlist Capture Mode Feature

This document contains the content for a new VERTICAL feature section (6.2) to be added to FunctionalSpecification.md, extracted from `Features\The Library.md`.

---

# 6.2 Playlist Capture Mode

`VERTICAL`

---

## 6.2.1 Summary / Intent

Capture Mode automates the playlist curation process, transforming playlists from static collections into live chronological "journals" of listening sessions. By shifting the "Add to Playlist" action from a conscious user decision to an automated system response, Northstar ensures that the user's focus remains entirely on the auditory experience. The system silently documents the session's history, allowing users to record the musical narrative of a specific moment or mood without manual intervention.

**Core Value Proposition:**
- Eliminates the friction of manual playlist curation during listening sessions
- Creates an authentic record of listening experiences
- Enables users to capture musical moments without interrupting the flow

---

## 6.2.2 Primary User Goals

1. **Effortless Curation**: Automatically build playlists while listening without manual "add to playlist" actions
2. **Session Documentation**: Create a chronological record of a listening session or mood
3. **Discovery Preservation**: Capture newly discovered tracks from radio/discovery modes for later review
4. **Experience Journaling**: Build playlists that represent specific moments, events, or emotional states

---

## 6.2.3 Actors

- **Primary User**: The person listening to music and enabling Capture Mode
- **Playback Engine**: System component that triggers track events (`onTrackStart`, `onTrackEnd`)
- **Playlist System**: Manages the active Capture Playlist and track additions
- **Notification System**: Provides user feedback when tracks are captured

---

## 6.2.4 Initiation Points / Triggers

**User-Initiated:**
- Toggle Capture Mode ON for a specific playlist via playlist settings/options menu
- Create a new playlist with Capture Mode enabled from the start
- Enable Capture Mode from the Global Player Bar (applies to most recently used playlist or prompts for playlist selection)

**System Behavior:**
- Only one playlist per user account may have Capture Mode enabled at any time
- Enabling Capture Mode on "Playlist B" automatically disables it on "Playlist A"

---

## 6.2.5 Detailed User Flow

### Enabling Capture Mode

1. User navigates to a playlist or creates a new one
2. User selects "Enable Capture Mode" from playlist options
3. System checks if another playlist has Capture Mode active
4. If yes: System disables Capture Mode on the previous playlist and shows notification
5. System enables Capture Mode on the selected playlist
6. Visual indicator appears in Global Player Bar (e.g., pulsing red dot or compass icon)
7. User begins listening to music

### During Active Capture

1. User plays a track from any source (Radio, Discovery, Library, etc.)
2. When playhead reaches 0:00 (`onTrackStart` event), system evaluates capture rules:
   - Is Capture Mode active?
   - Is this source "capturable" (based on user settings)?
   - Is "Ignore Duplicates" enabled, and is track already in playlist?
   - Has minimum playtime threshold been met (if configured)?
3. If all conditions pass: Track is added to the Capture Playlist
4. Brief toast notification appears: "'Song Title' added to [Playlist Name]"
5. Process repeats for each track played

### Disabling Capture Mode

1. User manually toggles Capture Mode OFF from playlist options or Global Player Bar
2. OR: Auto-Disable Timer expires (if configured)
3. Visual indicator disappears from Global Player Bar
4. System stops capturing tracks
5. Playlist remains in library with all captured tracks

---

## 6.2.6 Functional Logic

### Core Rules

**FR-CM-001: Exclusive Activation**
- Only one playlist per user account may have Capture Mode enabled at any given time
- Enabling Capture Mode on a new playlist automatically disables it on the previously active playlist

**FR-CM-002: Trigger Event**
- The "Add to Playlist" action MUST trigger at the `onTrackStart` event (when playhead reaches 0:00)
- Rationale: Ensures that tracks skipped before they begin are not captured

**FR-CM-003: Track Addition**
- Tracks are added to the END of the playlist in chronological order
- Each addition preserves the timestamp of when it was captured (optional metadata)

---

## 6.2.7 Constraints

- **Single Active Playlist**: Only one Capture Playlist can be active per user at any time
- **Chronological Order**: Tracks must be added in the order they are played
- **Source Dependency**: Capture Mode requires an active playback session
- **Playlist Existence**: Capture Mode can only be enabled on existing playlists (or newly created ones)

---

## 6.2.8 UI Requirements

### Active State Indicator

**Location:** Global Player Bar

**Visual Design:**
- Persistent "Recording" or "Capturing" icon
- Options: Pulsing red dot, Northstar-branded compass icon, or "REC" badge
- Should be visible but non-intrusive

**Interaction:**
- Clicking the indicator opens a quick menu:
  - "Disable Capture Mode"
  - "View [Playlist Name]"
  - "Capture Settings"

### Contextual Notifications

**Toast Notification:**
- Appears briefly when a track is successfully captured
- Message: "'Song Title' added to [Playlist Name]"
- Duration: 2-3 seconds
- Position: Bottom-right or top-right of screen
- Non-intrusive, does not interrupt playback or navigation

### Playlist View Indicator

**In Playlist Library:**
- The active Capture Playlist should be visually highlighted
- Options: Unique border color, status badge ("CAPTURING"), pulsing animation
- Distinguishes it from standard playlists at a glance

**In Playlist Detail View:**
- "Capture Mode: ON" status displayed prominently
- Toggle switch to enable/disable
- Link to Capture Settings

---

## 6.2.9 Settings & User Customizations

### Ignore Duplicates

**Setting:** Toggle (ON/OFF)

**Behavior:**
- If enabled: A track that is already present in the Capture Playlist will not be added again during the session
- If disabled: Duplicate tracks are allowed (useful for tracking repeat listens)

**Default:** ON

### Source Filtering

**Setting:** Multi-select checkboxes

**Options:**
- Capture from "Radio" mode
- Capture from "Discovery" mode
- Capture from "Library" playback
- Capture from "Favorites"
- Capture from "External Sources" (e.g., shared playlists)

**Behavior:**
- Users can toggle which sources are "capturable"
- Example: User may want to capture tracks from "Radio" or "Discovery" but ignore tracks from "Favorites" to avoid redundancy

**Default:** All sources enabled

### Minimum Playtime Threshold

**Setting:** Slider or numeric input (0-60 seconds)

**Behavior:**
- A track is only added to the playlist if it is played for more than XX seconds
- Prevents "channel surfing" from filling the playlist with unwanted tracks
- Timer starts at `onTrackStart` (0:00)

**Default:** 30 seconds

**Example:** If set to 30 seconds, a track must play for at least 30 seconds before being captured

### Session Grouping

**Setting:** Toggle (ON/OFF)

**Behavior:**
- If enabled: System automatically inserts "Session Headers" or "Date Tags" into the playlist
- Groups tracks captured during a single continuous listening period
- Helps organize the playlist chronologically

**Default:** OFF

**Implementation Note:** This may require playlist support for non-track items (headers/dividers)

### Auto-Disable Timer

**Setting:** Dropdown or numeric input

**Options:**
- Never (manual disable only)
- 1 hour
- 2 hours
- 4 hours
- 8 hours
- Custom (user-defined)

**Behavior:**
- After the specified duration, Capture Mode automatically toggles OFF
- Prevents accidental background capturing when user forgets to disable it
- User receives notification when auto-disable occurs

**Default:** Never

---

## 6.2.10 System Interactions

### Data Model
- Interacts with **Playlist** data type (3.2)
- Adds **Track** references to playlist (3.1)
- May create new playlists with Capture Mode enabled

### Library (Staging / Repository)
- Captured tracks must exist in the Repository to be added to playlists
- Tracks in Staging cannot be captured (or can they? - `OPEN QUESTION`)

### Playback Engine
- Depends on `onTrackStart` event
- May also use `onTrackEnd` or playback duration tracking for Minimum Playtime Threshold

### External Services
- Tracks from external streaming services can be captured if they are linked to library tracks

---

## 6.2.11 Edge Cases

**EC-CM-001: Track Skipped Before 0:00**
- Scenario: User skips a track before it starts playing (before playhead reaches 0:00)
- Handling: Track is NOT added to the Capture Playlist

**EC-CM-002: Capture Mode Enabled on Empty Playlist**
- Scenario: User enables Capture Mode on a playlist with no tracks
- Handling: System allows this; playlist will be populated as tracks are captured

**EC-CM-003: Playlist Deleted While Capture Mode Active**
- Scenario: User deletes the active Capture Playlist
- Handling: Capture Mode is automatically disabled; user is notified

**EC-CM-004: Track Not in Library**
- Scenario: User plays a track that is not in their Northstar library (e.g., from an external source not yet imported)
- Handling: Track is NOT captured (or system prompts to add track to library first - `OPEN QUESTION`)

**EC-CM-005: Rapid Track Skipping**
- Scenario: User rapidly skips through many tracks (e.g., "channel surfing")
- Handling: Minimum Playtime Threshold prevents unwanted tracks from being captured

**EC-CM-006: Capture Mode Active During Offline Playback**
- Scenario: User is offline and plays cached tracks
- Handling: Tracks are still captured; playlist is updated when online

---

## 6.2.12 Error Handling

**Error: Playlist Full (if there's a track limit)**
- Message: "Capture Playlist has reached maximum capacity. Disable Capture Mode or remove tracks to continue."
- Action: Capture Mode is paused until user resolves the issue

**Error: Playback Engine Failure**
- Message: "Unable to capture track due to playback error."
- Action: Track is skipped; Capture Mode remains active

**Error: Network Failure During Capture**
- Message: "Track captured offline. Will sync when connection is restored."
- Action: Track is queued for addition; syncs when online

---

## 6.2.13 Analytics / Events (Optional)

**Trackable Events:**
- `capture_mode_enabled`: When user enables Capture Mode
- `capture_mode_disabled`: When user disables Capture Mode (manual or auto)
- `track_captured`: When a track is successfully added to Capture Playlist
- `track_capture_skipped`: When a track is not captured due to rules (duplicate, source filter, etc.)
- `capture_settings_changed`: When user modifies Capture Mode settings

**Metrics:**
- Average session duration with Capture Mode active
- Number of tracks captured per session
- Most common source types captured
- Duplicate prevention effectiveness

---

## 6.2.14 Use Case Scenarios

### Scenario 1: The "Vibe" Capture

**Context:** A user starts a "Discovery Radio" station on a summer evening.

**Flow:**
1. User creates a new playlist called "Summer Night 2026"
2. User enables Capture Mode on this playlist
3. User starts "Discovery Radio" and begins listening
4. Every song they enjoy and listen to through completion is automatically saved
5. User never has to unlock their phone or manually add tracks
6. At the end of the evening, the playlist contains a perfect record of the session's vibe

**Outcome:** User has a curated playlist representing a specific moment in time without any manual effort.

---

### Scenario 2: Live Set Recording

**Context:** A user is at a party where Northstar is the primary audio source.

**Flow:**
1. User creates a playlist called "House Party - March 2026"
2. User enables Capture Mode
3. Throughout the night, various people play different tracks
4. All tracks played are automatically captured in chronological order
5. The playlist becomes a "Live Log" of the night's energy

**Outcome:** User can revisit the party's musical journey later, sharing it with friends or reliving the experience.

---

### Scenario 3: Research & Curation

**Context:** A music curator listens to a 50-track promotional pool to find tracks for an upcoming event.

**Flow:**
1. Curator creates a playlist called "Event Shortlist"
2. Curator enables Capture Mode with:
   - Minimum Playtime Threshold: 5 seconds
   - Ignore Duplicates: ON
3. Curator plays through the promotional pool
4. Tracks they dislike are skipped within the first 5 seconds (not captured)
5. Tracks they like are allowed to play past 5 seconds (automatically captured)
6. Only the "keepers" are aggregated into the working playlist

**Outcome:** Curator efficiently builds a shortlist without manual "add to playlist" actions, maintaining focus on the music.

---

## Implementation Priority

**Phase 1 (MVP):**
- Basic Capture Mode toggle
- `onTrackStart` trigger
- Exclusive activation (one playlist at a time)
- Active state indicator in Global Player Bar
- Toast notifications

**Phase 2:**
- Ignore Duplicates setting
- Source Filtering
- Minimum Playtime Threshold

**Phase 3:**
- Session Grouping
- Auto-Disable Timer
- Advanced analytics

