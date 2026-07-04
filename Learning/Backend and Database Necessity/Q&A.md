**1. Is the backend necessary for anything other than DB communication? Is there a security reason, or business logic, better placed on the backend than in Flutter?**

For a single-user personal app like Northstar, the security-driven case for a backend is thin — and this is a direct consequence of being single-user, not a hand-wave.

The instinct "business logic belongs on the backend for security" comes from *multi-tenant* apps, where many users share a server and the client is untrusted: you can't let the browser decide whether user X may read user Y's playlist, because a malicious user controls their own client, so the server re-checks everything. Northstar has no other users to protect against. The only person who can touch your data is you, on your own device. There is no trust boundary to enforce because there is no adversary on the other side of it.

So tag-driven playlist resolution, Capture Mode's threshold, undo/History, ListeningEvent aggregation — none of these protect anything by living on a server. They can all live in Dart, which is also *better* for the Snappy/Tactile principles because there's no network round-trip.

The one genuine security concern is OAuth tokens, and even that doesn't force a backend: Spotify's flow is Authorization Code with **PKCE**, designed precisely so apps that can't keep a secret can do OAuth **without a client secret**. Tokens live in the OS secure enclave (Keychain / Keystore). Nothing for a backend to hide.

And note the reverse: playback and Discovery are *inherently* client-side — `spotify_sdk` and `subscribeToPlayerState()` run on the device, and a .NET server can't drive the Web Playback SDK in someone's browser. The backend was never going to own those.

What *does* pull toward a backend is narrower than it first looks: **multi-device sync** and **durable off-device backup**. Both are really the same thing — data living in more than one place. Everything else is optional.

---

**2. How necessary is PostgreSQL? Couldn't an on-device light DB solve the requirements?**

Every feature the Architecture doc cites as the reason for Postgres is reachable on-device with SQLite (via **Drift**) or a Flutter-native store like Isar/ObjectBox:

- **UUID** — SQLite stores as TEXT/BLOB. Non-issue.
- **JSONB for `source_links`** — SQLite has JSON1; or model it as a child table.
- **Array types** (`parent_ids`, `album_ids`, `tag_filters`) — SQLite has no array type, so you use **junction tables**, which is the more normalized design anyway. This is the only place Postgres is more ergonomic, and it costs a couple of join tables, not a capability.
- **Full-text search** — SQLite **FTS5** is excellent and more than enough.

A personal library is thousands of rows, not millions. There's no query or data volume here a phone can't handle instantly. Postgres becomes worth its weight only when it's serving as the *shared* store behind sync — not for the local data itself.

The recommendation: **local-first**. An on-device DB (Drift/SQLite) as the source of truth, app fully functional offline, and a backend — if built at all — playing a sync + backup role rather than an authoritative one. A v1 could plausibly ship with no backend. The deciding question is whether real-time multi-device sync is a day-one requirement or a later luxury.

---

**3. Northstar is meant to be used by many people. How does that fit the "multi-tenant" definition? I presume Northstar needs no login of its own to function — the only part that might need user authentication is if it offers backend sync with a real cloud database. How far off am I?**

Not off at all — the only correction is terminological.

"Many users" and "multi-tenant" are different axes:

- **Multi-user** — lots of people run the app. Northstar is that.
- **Multi-tenant** — lots of people's data lives in the *same* store, so the store must know which rows belong to whom and refuse to hand user A's rows to user B.

They're independent. A million people can each run a fully local app and there's still no tenancy problem, because no two users' data ever touch the same machine — each install is an island. The trust boundary that server-side auth exists to enforce only appears when data from different people lands on **shared infrastructure**. So your instinct is exactly right: **auth is a property the sync backend drags in, not something the app needs to do its job.**

Two refinements:

- **There already is a login — to Spotify, not to Northstar.** Connecting a Spotify account authenticates you to Spotify and grants Northstar delegated access to *your* Spotify. Per-device, no Northstar account, no tenancy. "Northstar needs no login of its own" and "every user authenticates to Spotify" are both true — different systems.
- **The trigger is *sharing*, not *cloud*.** It's co-mingling different users' data that summons auth, not the word "cloud." You could give each user an isolated cloud store and keep the boundary trivial; it's putting everyone in one shared relational DB — the normal way to build sync — that makes per-request auth and per-row ownership non-negotiable. So "add cloud backup" and "take on real auth complexity" aren't automatically the same decision.

The upshot reinforces exactly what you said: **no backend, no Northstar login, no tenancy. The three arrive together, or not at all.**
