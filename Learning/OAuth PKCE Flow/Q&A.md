**1. What is a PKCE flow?**

OAuth was originally designed for server-side apps that can store a secret safely. Your app would have a `client_secret` — Spotify knows it, your server knows it — and that secret proves your app is really your app.

Mobile and desktop apps can't do this. If you embed a secret in an app, anyone can extract it from the binary. So PKCE solves this differently:

Instead of a shared secret, your app generates two values at the start of each login:
- A **code verifier** — a long random string, kept private
- A **code challenge** — a SHA-256 hash of the verifier, sent to Spotify

When Spotify later sees the verifier and hashes it, it can verify it matches the challenge it saw earlier. This proves the same app that started the login is completing it — no pre-shared secret needed.

---

**2. Where does the auth logic live — Flutter or .NET?**

The short answer: **Flutter owns it.**

Here's why. The `spotify_sdk` Flutter package needs a Spotify access token to initialize itself for playback — so Flutter needs the token regardless. And since Northstar is a single-user personal app running locally, there's no security advantage to storing tokens on the server instead of the device.

The cleaner arrangement:
- Flutter runs the PKCE flow, receives the token, stores it securely on device
- When the backend needs to make Spotify API calls (e.g., for import), Flutter passes the access token along in the request — the backend uses it for that call and doesn't store it

If Northstar ever needed background sync or multi-user access, the calculus would flip and the backend would own the tokens. But it doesn't in v1.

---

**3. How does the code challenge travel from Northstar to Spotify?**

This is the part that trips people up, because it's not a network request — it's a URL.

Here's the concrete sequence:

1. Northstar generates the code verifier and challenge in memory.
2. Northstar constructs a URL:
   ```
   https://accounts.spotify.com/authorize
     ?client_id=YOUR_CLIENT_ID
     &redirect_uri=northstar://spotify-callback
     &response_type=code
     &scope=streaming user-read-email ...
     &code_challenge_method=S256
     &code_challenge=THE_HASH_YOU_COMPUTED
     &state=RANDOM_CSRF_VALUE
   ```
3. Northstar opens that URL in the system browser. The code challenge is **right there in the URL** — it's just a query parameter.
4. Spotify's server reads it off the URL when the authorization page loads, and stores it against the session.
5. The user logs in and approves. Spotify redirects to your redirect URI with an authorization code: `northstar://spotify-callback?code=AUTH_CODE&state=...`
6. Northstar receives that redirect (more on how in #5 below), reads the `code`.
7. Northstar POSTs to `https://accounts.spotify.com/api/token` with the `code` and the **original code verifier** (not the hash — the raw value).
8. Spotify hashes the verifier and checks it matches what it stored in step 4. If it matches, it returns an access token.

The code challenge travels in the URL query string. The code verifier travels in the POST body. Spotify never sees the verifier until step 7, and by then it can only be used once.

---

**4. URI vs URL**

A URL is a specific type of URI.

- **URI** (Uniform Resource Identifier) — identifies a resource. Doesn't have to tell you how to reach it.
- **URL** (Uniform Resource Locator) — a URI that also tells you *how* to access the resource (the protocol: `https://`, `ftp://`, etc.).

In practice: `https://open.spotify.com/track/abc123` is a URL. `spotify:track:abc123` is a URI — it identifies a Spotify track, but there's no server you can connect to at that address. Spotify's apps understand the scheme internally.

In OAuth specs, the term "redirect URI" is used because the redirect destination can be either form — an `http://` URL or a custom scheme like `northstar://`.

---

**5. What is `northstar://`? How is it different from `http://`?**

`http://` is a protocol that every browser and OS knows how to handle: make a TCP connection to a server and fetch a response.

`northstar://` is a **custom URL scheme** — an app can register with the OS to "own" a particular scheme prefix. When anything on the device encounters a link that starts with `northstar://`, the OS intercepts it and opens (or resumes) the app that registered that scheme.

How it works in practice:
1. When Northstar is installed on iOS or Android, it declares: *"I handle `northstar://` links."*
2. After the user approves OAuth, Spotify's server redirects to `northstar://spotify-callback?code=...`
3. The browser can't make an HTTP request to `northstar://` — that's not a real server. So the OS steps in and hands the URL directly to the Northstar app.
4. Northstar wakes up, reads the `code` from the URL parameters, and continues the flow.

On desktop it's different — the redirect goes to `http://127.0.0.1:PORT/callback`, which *is* a real server. The Flutter web app is running at that address, so the browser just navigates there and the app reads the code from the URL.

