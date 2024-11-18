const CLIENT_ID = "5rvQXOCb3zyGPfbw";
const REDIRECT_URI = "http://localhost:8000/redirect";
const AUTHORIZATION_ENDPOINT = "https://login.tidal.com/authorize";

// https://login.tidal.com/authorize
//   ?response_type=code
//   &client_id=<CLIENT_ID>
//   &redirect_uri=<REDIRECT_URI>
//   &scope=<SCOPES>
//   &code_challenge_method=S256
//   &code_challenge=<CODE_CHALLENGE>
//   &state=<STATE>

const SCOPES = "playlists.read";


async function redirectToAuth() {

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Save the code verifier in localStorage/sessionStorage for later use
  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = `${AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}&code_challenge_method=S256&code_challenge=${'LWuZm8WdAwf_1p8qoP55Q_a_id694iyeZtKqslVfHlY'}`;
  debugger;
  window.location.href = authUrl;
}

function getAuthorizationCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

async function exchangeAuthorizationCode(code) {
  const response = await fetch("http://localhost:8000/exchange-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  console.log("Access Token:", data.accessToken);
  return data;
}

// Example: Handle the callback
const code = getAuthorizationCode();
if (code) {
  exchangeAuthorizationCode(code).catch((err) =>
    console.error("Failed to exchange code:", err)
  );
}


function generateCodeVerifier() {
  const array = new Uint8Array(64); // 64 bytes for high entropy
  crypto.getRandomValues(array);

  // Convert to Base64 URL-safe format
  return Array.from(array, (byte) =>
    String.fromCharCode(33 + (byte % 94))
  ).join('');
}

async function generateCodeChallenge(codeVerifier) {
  // Encode the verifier as UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // Hash the verifier using SHA-256
  const hash = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to Base64 URL-safe format
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove padding
}
