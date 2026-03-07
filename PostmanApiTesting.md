
## Plan

I’ll pull the current Spotify and Postman auth details, then I’ll give you a clean step-by-step setup you can follow in Postman without changing anything in your repo.


## I found the official Spotify flow docs. I’m also checking the exact callback/auth settings Postman expects so I can give you the right field values.


## I’ve got the exact Spotify endpoints and the current Postman callback guidance. Next I’m pulling the Postman OAuth page to confirm the desktop vs browser callback URLs.






## Goal

You want Postman to do Spotify’s **Authorization Code Flow**, so you can call user-scoped Spotify APIs like `/v1/me`, playlists, top tracks, etc.

The easiest setup is:

1. Create a Spotify app
2. Register Postman’s callback URL in Spotify
3. Configure OAuth 2.0 in Postman
4. Get a token
5. Use that token on Spotify API requests

---

## 1) Create a Spotify app

Go to the Spotify Developer Dashboard and create an app:

- Dashboard: `https://developer.spotify.com/dashboard`
- After creating it, copy:
  - `Client ID`
  - `Client Secret`

### Add a Redirect URI
In your Spotify app settings, add the callback URL Postman will use.

The current Postman docs say the callback can be:

- `https://oauth.pstmn.io/v1/browser-callback`

If you use the Postman desktop app and enable **Authorize using browser**, Postman may populate the callback for you.  
**Whatever callback Postman shows, add that exact URI to Spotify.**

### Important
The redirect URI must match **exactly** between:

- Spotify app settings
- Postman OAuth config

Even a trailing slash mismatch can break auth.

---

## 2) Create a Spotify request in Postman

Create a new request, for example:

- `GET https://api.spotify.com/v1/me`

That’s a good first test because it confirms the user token works.

---

## 3) Configure OAuth 2.0 in Postman

Open the request, then:

- Go to the **Authorization** tab
- Set **Type** to `OAuth 2.0`
- Click **Get New Access Token**

Use these values:

- **Grant Type**: `Authorization Code`
- **Callback URL**: your Postman callback URL
- **Auth URL**: `https://accounts.spotify.com/authorize`
- **Access Token URL**: `https://accounts.spotify.com/api/token`
- **Client ID**: your Spotify client ID
- **Client Secret**: your Spotify client secret
- **Scope**: start with:
  - `user-read-email user-read-private`
- **State**: any random string, like `postman-test-123`
- **Client Authentication**: **Send as Basic Auth header**

### Recommended first scope set
Use this first:

- `user-read-email user-read-private`

Then add more scopes as needed later.

Examples:

- `playlist-read-private`
- `playlist-modify-public`
- `playlist-modify-private`
- `user-top-read`
- `user-read-playback-state`
- `user-modify-playback-state`

---

## 4) Get the access token

After filling the form:

1. Click **Get New Access Token**
2. Spotify will open a login/consent page
3. Sign in
4. Approve the requested scopes
5. Postman will receive the auth code and exchange it for tokens
6. Click **Use Token**

At that point, Postman will attach:

- `Authorization: Bearer <access_token>`

to the request.

---

## 5) Send your first test request

Try this first:

- `GET https://api.spotify.com/v1/me`

If auth worked, you should get your Spotify profile JSON back.

Good next test requests:

- `GET https://api.spotify.com/v1/me/top/tracks?limit=10`
  - needs `user-top-read`
- `GET https://api.spotify.com/v1/me/playlists`
  - needs `playlist-read-private`
- `GET https://api.spotify.com/v1/search?q=radiohead&type=artist&limit=5`
  - useful general endpoint

---

## 6) Refresh the token later

Spotify access tokens expire. Spotify’s docs show they return:

- `access_token`
- `token_type`
- `scope`
- `expires_in`
- `refresh_token`

When the access token expires, you can refresh it.

In Postman, you can often use the saved OAuth token config to refresh.  
If you want to do it manually, send a `POST` to:

- `https://accounts.spotify.com/api/token`

with:

- `grant_type=refresh_token`
- `refresh_token=<your refresh token>`

and use client authentication as **Basic Auth header** again.

### Good gotcha to know
Spotify may **not** return a new refresh token every time. If it doesn’t, keep using the old refresh token.

---

## 7) Common errors

### `INVALID_CLIENT`
Usually means one of these:

- wrong `Client ID` or `Client Secret`
- wrong client authentication mode
- use **Basic Auth header**, not the wrong body mode

### `INVALID_REDIRECT_URI`
Usually means:

- redirect URI in Postman does not exactly match Spotify app settings

### `invalid_grant`
Usually means:

- the auth code was already used
- the code expired
- redirect URI used during token exchange didn’t exactly match the auth request

### `403` on playback endpoints
Could mean:

- missing scope
- no active device
- Spotify Premium required for that endpoint

---

## Recommended starter setup

If you just want the quickest working path, use:

- Request: `GET https://api.spotify.com/v1/me`
- Grant Type: `Authorization Code`
- Callback URL: `https://oauth.pstmn.io/v1/browser-callback`
- Auth URL: `https://accounts.spotify.com/authorize`
- Access Token URL: `https://accounts.spotify.com/api/token`
- Scope: `user-read-email user-read-private`
- Client Authentication: `Basic Auth header`

---

## If Postman’s built-in OAuth helper gives you trouble

You can do it manually in 2 steps:

### Step A: Get the auth code
Open a browser to Spotify’s authorize endpoint with:

- `response_type=code`
- `client_id=<client_id>`
- `redirect_uri=<exact_redirect_uri>`
- `scope=<space separated scopes>`
- `state=<random_string>`

Approve access, then copy the `code` from the callback URL.

### Step B: Exchange code for token
In Postman, send:

- `POST https://accounts.spotify.com/api/token`

Body as `x-www-form-urlencoded`:

- `grant_type=authorization_code`
- `code=<the code>`
- `redirect_uri=<same redirect_uri>`

Headers:

- `Authorization: Basic base64(client_id:client_secret)`
- `Content-Type: application/x-www-form-urlencoded`

But usually the Postman OAuth UI is easier.

---

## Best practices

- Don’t expose your Spotify `Client Secret` in frontend/browser code
- In Postman, prefer storing `Client ID` and `Client Secret` in variables
- Keep scopes minimal at first
- Start with `/v1/me` before testing playlist/player endpoints

---

## Official references I used

- Spotify Authorization Code Flow docs
- Spotify Refresh Token docs
- Postman OAuth 2.0 docs, which currently reference `https://oauth.pstmn.io/v1/browser-callback`

---

## Want a ready-to-copy Postman field list?

If you want, I can give you a **copy/paste Postman config block** next, plus **3 good starter Spotify requests** with the exact scopes each one needs.
