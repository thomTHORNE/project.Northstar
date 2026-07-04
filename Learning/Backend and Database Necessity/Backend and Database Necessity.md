# Do You Need a Backend?

## The question

Northstar's stack was set early as ASP.NET Core + PostgreSQL on the backend and Flutter on the frontend. But settling on *a* backend is not the same as establishing that you *need* one. This explainer works through the actual question: for a single-user personal library like Northstar, what does a backend earn its keep doing, and could an on-device database do the whole job instead?

The short version: for the core product, a backend is not strictly necessary. It becomes justified the moment you want data to live in more than one place — multi-device sync or durable off-device backup. Everything else people reach for a backend to do either doesn't apply here, or can't live on a server anyway.



## What a backend actually does

A backend earns its place through some combination of five jobs. The useful exercise is to hold each one against the specific app you're building rather than assuming all five apply.

1. **Enforce a trust boundary** — stop one user from seeing or tampering with another user's data.
2. **Hold secrets the client can't** — API client secrets, signing keys, anything that must not ship in a binary.
3. **Be the single source of truth** for data shared across multiple clients — i.e. sync.
4. **Run work that outlives a client session** — background jobs, scheduled polling, work that must happen while the app is closed.
5. **Do compute the client can't** — heavy queries, ML, aggregation over data too large to sit on a device.

For Northstar, the striking thing is how few of these bite.



## The trust boundary — and why "many users" is a red herring

The instinct that "business logic belongs on the backend for security" comes from *multi-tenant* apps. The word that matters is not *how many people use the app* — it's *whose data shares infrastructure*.

- **Multi-user** — lots of people run the app. Northstar is that, and always will be.
- **Multi-tenant** — lots of people's data lives in the *same* store, so that store must know which rows belong to whom and refuse to hand user A's rows to user B.

These are independent axes. A million people can each run a fully local app and there is still no tenancy problem, because no two users' data ever touch the same machine. Each install is an island. The trust boundary — the thing server-side authorization exists to enforce — only appears when data from different people lands on **shared infrastructure**.

This is why a single-user, local-only app has almost no security-driven case for a backend. There is no adversary on the other side of the boundary because there is no shared boundary. Tag resolution, capture thresholds, undo, listening-event aggregation — none of these protect anything by running on a server, because the only person who can touch the data is the person it belongs to, on their own device. A user "cheating" their own capture threshold is a meaningless act.

Note the precise trigger: it is *shared storage*, not *the cloud*, that creates tenancy. You could give each user a fully isolated cloud store (their own encrypted blob or container) and keep the boundary trivial. It's only when you co-mingle many users in one shared relational database — the normal, efficient way to build sync — that per-request authentication and per-row ownership checks become non-negotiable. So "add cloud backup" and "take on real auth complexity" are not automatically the same decision; how you architect the cloud side decides how heavy the auth burden gets.



## The one real security concern: OAuth tokens

The genuine security surface is the Spotify tokens, and it's worth being precise about why it still doesn't force a backend:

- Spotify's mobile/desktop flow is **Authorization Code with PKCE**, which was designed specifically so that "public clients" — apps that cannot keep a secret — can do OAuth safely **without a client secret**. There is nothing for a backend to hide.
- The access and refresh tokens live in the OS secure enclave (iOS Keychain / Android Keystore), which is the correct place for them on a device.
- Token refresh under PKCE also needs no secret.

There is a "login" in Northstar — but it's a login to *Spotify*, not to *Northstar*. Connecting a Spotify account authenticates the user to Spotify and grants Northstar delegated access to that user's Spotify. It's per-device, needs no Northstar account, and creates no tenancy on Northstar's side. So "Northstar needs no login of its own" and "every user authenticates to Spotify" are both true at once — they're different systems.

(See the *OAuth PKCE Flow* explainer for the full mechanics.)



## Some logic can't live on a server anyway

This cuts the other way and is worth naming. A chunk of Northstar is structurally device-resident:

- `spotify_sdk` wraps the native iOS/Android SDKs and the browser Web Playback SDK.
- `subscribeToPlayerState()` fires on the device.
- A .NET server cannot drive the Web Playback SDK running in someone's Chrome tab.

So playback control, threshold evaluation, and Discovery-mode state were never candidates for the backend regardless of the decision. The backend was never going to own them.



## What genuinely pulls toward a backend

Only two jobs on the list survive contact with Northstar's reality, and they're really the same job twice — data living in more than one place:

- **Multi-device sync.** The platform targets are iOS, Android, *and* desktop. If someone tags a track on their phone and expects it on their desktop, something must reconcile the two copies. A central store is the clean way to do that.
- **Durable backup.** The product premise — notes as a diary, "your library survives even if a service dies," the Sentimentalist persona — is undermined if a dropped phone erases everything. Off-device backup is arguably a *product* requirement, not a technical nicety.

Everything else a backend could do here is optional. These two are the real case, and both are about *copies in more than one location*, not about security or compute.



## PostgreSQL vs an on-device database

The Architecture doc's stated Postgres rationale, held line by line against on-device SQLite (via **Drift**, the mature type-safe Flutter ORM) or a Flutter-native store like Isar/ObjectBox:

| Postgres feature cited | On-device reality |
|---|---|
| Native UUID | SQLite stores UUIDs as TEXT/BLOB. Non-issue. |
| JSONB for `source_links` | SQLite has the JSON1 extension; `source_links` is a small array of `{source, id}` — trivially JSON in a column, or better, a child table. |
| Array types (`parent_ids`, `album_ids`, `tag_filters`) | SQLite has no array type. You model these as **junction tables** — which is the more normalized, arguably more correct relational design anyway. The one place Postgres is more ergonomic, and it costs a couple of join tables, not a capability. |
| Full-text search | SQLite **FTS5** is excellent and more than enough for a personal library. |

A personal music library is *thousands* of rows, not millions. There is no query and no data volume here a phone's SQLite can't handle instantly. None of Postgres's advantages are unreachable on-device; the array-type ergonomics are the only real delta, and junction tables are the textbook answer.



## The pattern that fits: local-first

The current spec implicitly assumes a **backend-authoritative** model — Postgres is the source of truth, the Flutter app is a thin view that round-trips to the server. That sits in tension with two of Northstar's own commitments:

- **Snappy / Tactile** design principles want instant, local responses. A thin client puts a network hop in front of every tag toggle and reorder.
- The **"your library is yours"** ethos reads more naturally as *the data lives with you, the server is backup* — not *the data lives on my server and you get a window into it*.

The pattern that fits Northstar's shape is **local-first**: an on-device relational DB (Drift/SQLite) is the source of truth, the app is fully functional offline, and a backend — *if and when it's built* — plays a **sync + backup** role rather than an authoritative one. Under that model a v1 could plausibly ship with **no backend at all**: OAuth via PKCE on device, local DB, backup via platform mechanisms (iCloud / Android auto-backup of the DB file, plus export/import).



## The deciding question

The whole decision reduces to one product call:

> Is real-time multi-device sync a day-one requirement, or is Northstar effectively a one-primary-device app where "my library is safely backed up and I can restore it / occasionally use it elsewhere" is enough for v1?

- **If sync is day-one** — keep a backend, build it sync-first (local-first + server reconciliation), and .NET + Postgres is a sound choice for that service. Go in knowing sync is the genuinely hard part of the whole app.
- **If sync is a later luxury** — drop the backend from v1 entirely. Ship local-first on Drift. You lose nothing the spec currently promises, gain simplicity and snappiness, and defer the hardest engineering problem until you know you need it. The .NET/Postgres path still slots in cleanly the day sync becomes real.

The generalisable lesson: don't ask "should this app have a backend?" Ask which of the five jobs the app actually needs done, then let the answers decide. For a single-user, local-first app, the honest answer is often "backup and sync, eventually — and nothing else yet."
