# OAuth and the PKCE Flow

## Background: why OAuth at all?

When Northstar wants to read your Spotify library or control playback, it needs to prove to Spotify that *you* gave it permission. You don't want to hand Northstar your Spotify password — that would give it full account access with no boundaries and no way to revoke it cleanly.

OAuth solves this by letting Spotify issue a limited, revocable token to Northstar on your behalf. You log into Spotify directly (not via Northstar), approve specific permissions, and Spotify hands Northstar a token that only covers those permissions. Northstar never sees your password.

---

## The client secret problem

OAuth was originally designed for server-side web apps. The flow worked like this:

1. Your app sends the user to Spotify to approve access.
2. Spotify redirects back with an authorization code.
3. Your server exchanges the code for a token — proving its identity with a `client_secret` that only your server knows.

The `client_secret` is like a password your app uses to identify itself to Spotify. It works fine when the secret lives on a server you control. But Northstar is a client app — iOS, Android, or desktop. Any secret embedded in a client app binary can be extracted. Shipping a client secret is effectively making it public.

---

## The PKCE solution

PKCE (Proof Key for Code Exchange, pronounced "pixie") solves this without any pre-shared secret. Instead of proving identity with a static secret, the app proves it by demonstrating it knows a value it generated itself at the start of the session.

Two values are generated fresh for every login:

- **Code verifier** — a long, random, URL-safe string. Kept secret on the device.
- **Code challenge** — the SHA-256 hash of the verifier, base64url-encoded. Sent to Spotify.

The logic: Spotify stores the challenge when the login starts. When the app later sends the verifier, Spotify hashes it and checks it matches. Only the entity that generated the verifier could produce a matching challenge — no pre-shared secret required.

---

## The full flow, with Northstar as the example

Here is the complete sequence from "user taps Connect Spotify" to "access token in hand."

**Step 1 — Generate the verifier and challenge**

Northstar generates a cryptographically random code verifier (e.g., `dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`) and computes:

```
code_challenge = base64url(SHA256(code_verifier))
```

Both values live in memory. The verifier is never transmitted at this point.

**Step 2 — Open the authorization URL**

Northstar constructs a URL and opens it in the system browser:

```
https://accounts.spotify.com/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=northstar://spotify-callback
  &scope=streaming user-read-email user-library-read ...
  &code_challenge_method=S256
  &code_challenge=THE_HASH_YOU_COMPUTED
  &state=RANDOM_CSRF_VALUE
```

The code challenge is a plain query parameter in this URL — it travels to Spotify as part of the URL the browser loads. Spotify's server reads it off the request, stores it alongside the session, and presents the user with the Spotify login page.

**Step 3 — User grants access**

The user logs in and approves the requested permissions. This happens entirely inside a Spotify-controlled browser page — Northstar is not involved. Spotify then redirects to the `redirect_uri` with an authorization code:

```
northstar://spotify-callback?code=AUTH_CODE_FROM_SPOTIFY&state=RANDOM_CSRF_VALUE
```

**Step 4 — Northstar receives the code**

How Northstar receives this redirect depends on the platform. See the Redirect URIs section below.

**Step 5 — Verify state, exchange code for token**

Northstar first checks that the `state` value matches what it sent in step 2. This is a CSRF guard — it proves the redirect came from the flow Northstar started, not an attacker injecting a code mid-flow.

Then Northstar makes a POST request directly to Spotify:

```
POST https://accounts.spotify.com/api/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE_FROM_SPOTIFY
&redirect_uri=northstar://spotify-callback
&client_id=YOUR_CLIENT_ID
&code_verifier=THE_ORIGINAL_RANDOM_STRING
```

Spotify hashes the `code_verifier` and checks it against the `code_challenge` it stored in step 2. If they match, it returns an access token and a refresh token.

**Step 6 — Store the tokens**

Northstar stores both tokens securely on device using `flutter_secure_storage` (iOS Keychain on iOS, Android Keystore on Android, system credential store on desktop). The access token is used for all subsequent Spotify API calls. The refresh token is used to get a new access token when the current one expires after one hour.

---

## Where this logic lives in Northstar

The PKCE flow runs in Flutter, not the .NET backend.

The `spotify_sdk` Flutter package needs a Spotify access token to initialize itself for playback on both platforms — so Flutter needs the token regardless. Since Northstar is also a single-user personal app, there is no security advantage to moving token storage to the server. `flutter_secure_storage` provides appropriate OS-level protection.

When the .NET backend needs to make Spotify API calls (e.g., during import), Flutter passes the current access token with the request. The backend uses it for that call and does not store it independently.

If Northstar ever needed multiple users, or background jobs that run without Flutter being active, the backend would own the tokens instead. It doesn't in v1.

---

## URI vs URL

A **URL** (Uniform Resource Locator) is a string that identifies a resource *and* tells you how to reach it — the protocol prefix (`https://`, `ftp://`) is the "how."

A **URI** (Uniform Resource Identifier) is the broader category — it identifies a resource, but doesn't have to specify how to access it. All URLs are URIs, but not all URIs are URLs.

In practice: `https://accounts.spotify.com/authorize` is a URL. `spotify:track:4iV5W9uYEdYUVa79Axb7Rh` is a URI — Spotify's apps understand it internally, but there's no server you can connect to at that address.

OAuth specs use the term "redirect URI" because the redirect destination can be either form: an `http://` URL pointing at a real server, or a custom scheme like `northstar://` that the OS routes to an app.

---

## Redirect URIs: getting the code back

After the user approves access, Spotify redirects to the `redirect_uri` to hand the authorization code back to Northstar. The mechanism for receiving that redirect differs by platform.

### Mobile (iOS and Android): custom URL scheme

`northstar://` is a custom URL scheme. When Northstar is installed, it registers with the OS: *"I handle links that start with `northstar://`."*

When Spotify redirects to `northstar://spotify-callback?code=...`, the browser encounters a URL it cannot make an HTTP request to — there's no server at `northstar://`. The OS intercepts it and opens (or resumes) the Northstar app, passing the full URL to it. Northstar reads the `code` and `state` from the URL parameters and continues the flow.

This is why `http://` and `northstar://` behave differently: `http://` tells the browser to connect to a server. `northstar://` tells the OS to find an app.

Custom URL schemes are not globally enforced — two apps could register the same scheme. Using the app's name makes accidental collisions unlikely. For a production app, Apple recommends a reverse-domain format (`com.northstar.app://`), but `northstar://` works fine for a personal app.

### Desktop (Flutter web build): localhost redirect

On desktop, Northstar runs as a Flutter web build served locally at a fixed address — e.g., `http://localhost:4040`. Spotify redirects to `http://localhost:4040/callback?code=...`. Since Northstar is already running at that address, the browser navigates there and the app reads the authorization code from the URL query parameters.

The localhost port must be a fixed, known value — Spotify's developer dashboard requires exact redirect URIs and does not support wildcards or variable ports. The exact port is chosen at implementation time and registered in the dashboard.

### What must be registered in Spotify's developer dashboard

Both URIs must be listed explicitly:

- `northstar://spotify-callback` — for iOS and Android
- `http://localhost:{PORT}/callback` — for desktop (exact port determined at implementation)

Spotify rejects redirects to any URI not on the registered list. This prevents an attacker from injecting a redirect to a destination they control and stealing the authorization code mid-flow.
