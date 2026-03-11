# 1. Overview & Purpose

---

## 1.1 Product Summary

*Describe what the product is, its role, and the core problem it solves.*

## 1.2 User Persona

## 1.3 Scope of This Document

*Clarify what is included, excluded, and deferred.*

## 1.4 Business Value

## 1.5 Document Conventions

Define formatting for notes, TBDs, etc.

Example:

- | = personal note / idea
- `ASSUMPTION` = believed true but must be validated

# 2. Core Concepts

`HORIZONTAL`

High‑level conceptual pillars of the system. These are not tied to UI or features.

Examples might include:

- Library
- Staging vs Repository
- Identity of musical objects
- Relationship hierarchy (Artist → Album → Track)
- External sources & metadata extraction

Include concise conceptual descriptions here. Longer operational details go later.

---

# 3. Data Model

`HORIZONTAL`

This section establishes the laws of the system. Every feature must obey these rules.

For each data type, use the same template below.

---

## 3.X Data Type Template (Repeat for Track, Playlist, Artist, Album, Tag)

### 3.X.1 Definition

What the object represents at a conceptual level.

### 3.X.2 Attributes

Field list with descriptions (simple text, not DB schema).

### 3.X.3 Relationships

How this type interacts with others.
(e.g., Track → Artist, Track → Album, Playlist → Track[])

### 3.X.4 Lifecycle

Creation, editing, committing, staging, deletion, merging.

### 3.X.5 Constraints

Rules the system must enforce.
(e.g., “Track must have ≥ 1 external source link”)

### 3.X.6 Edge Cases

(e.g., orphan tracks, duplicate artists)

### 3.X.7 Open Questions / Notes

This is where your “>” thoughts go.

# 4. System Architecture

`HORIZONTAL`

Not code architecture—functional architecture.

---

## 4.1 Library Spaces

- Staging — purpose, rules
- Repository — purpose, rules

## 4.2 Movement & Commit Logic

How items flow between spaces.

## 4.3 Import Sources

Manual, automatic, streaming service integrations.

## 4.4 Permissions / Data Access Characteristics

(e.g., is Repository read‑only?)

## 4.5 Bulk Operations

(e.g., bulk commit, bulk discard)

## 4.6 Error Handling & Recovery

(e.g., metadata extraction failures)

# 5. Global Functional Requirements

`HORIZONTAL`

Requirements that apply across many features.

Examples:

- Playback event triggers (`onTrackStart`, `onTrackEnd`)
- Duplicate prevention
- Metadata extraction rules
- Notification system (toasts, banners)
- User identity

Each requirement gets a clear, numbered FR ID.

---

---

**PART II — FEATURE‑SPECIFIC SECTIONS (Vertical)**

Each feature gets its own vertical section.
Use the template below for every feature (Capture Mode, Playlist Creation, Imports, Tagging, etc.)

# 6.X Feature Name

`VERTICAL`

---

## 6.X.1 Summary / Intent

Explain what the feature does and why it exists.

## 6.X.2 Primary User Goals

List key user outcomes.

## 6.X.3 Actors

Which user types or subsystems participate.

## 6.X.4 Initiation Points / Triggers

All ways the user/system can start the feature.
(e.g., global button, contextual menu, auto‑triggers)

## 6.X.5 Detailed User Flow

Step‑by‑step sequence of how the user interacts with the system.

## 6.X.6 Functional Logic

Core rules the system must implement.
This is where things like “Capture only at onTrackStart” go.

## 6.X.7 Constraints

(e.g., “Only one Capture Playlist may be active at any time”)

## 6.X.8 UI Requirements

- UI elements
- States
- Indicators
- Notifications

## 6.X.9 Settings & User Customizations

Configurable behaviors (Duplicate Prevention, thresholds, filters, etc.)

## 6.X.10 System Interactions

How this feature touches:

- Data Model
- Library (Staging / Repository)
- Playback engine
- External services

## 6.X.11 Edge Cases

(e.g., a track skipped before 0:00 should not be added)

## 6.X.12 Error Handling

Define error messages, fallback behavior, etc.

## 6.X.13 Analytics / Events (Optional)

Internal signals the system tracks (useful if needed later).

## 6.X.14 Use Case Scenarios

Narrative examples (you already wrote these for Capture Mode).

---

**PART III — CROSS-FEATURE LOGIC (Optional Horizontal Layer)**

# 7. Interactions Between Features

`HORIZONTAL`

If two features interact frequently (e.g., Capture Mode + Playlist Management), document those interactions here.

---

# 8. Edge Cases & Global Constraints

`HORIZONTAL`

System-wide exceptions that don’t belong to one specific feature.

---

# 9. Glossary

`HORIZONTAL`

Define any domain-specific terms.

---