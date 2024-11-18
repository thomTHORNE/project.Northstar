<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'

const CLIENT_ID = "5rvQXOCb3zyGPfbw";
const REDIRECT_URI = "http://localhost:8000/redirect";
const AUTHORIZATION_ENDPOINT = "https://login.tidal.com/authorize";
const SCOPES = "playlists.read";
const CODE_VERIFIER = "loremipsumdolorsitamet";
const CODE_CHALLENGE = "wgTxpkqGJSZnbbk5pgpCKytW55sPuCyotf7VfmF7Y7I";

// https://login.tidal.com/authorize
//   ?response_type=code
//   &client_id=<CLIENT_ID>
//   &redirect_uri=<REDIRECT_URI>
//   &scope=<SCOPES>
//   &code_challenge_method=S256
//   &code_challenge=<CODE_CHALLENGE>
//   &state=<STATE>

// https://login.tidal.com/authorize
// ?client_id=5rvQXOCb3zyGPfbw
// &redirect_uri=https%3A%2F%2Foauthdebugger.com%2Fdebug
// &scope=playlists.read
// &response_type=code
// &response_mode=query
// &code_challenge_method=S256
// &code_challenge=wgTxpkqGJSZnbbk5pgpCKytW55sPuCyotf7VfmF7Y7I
// &state=psysscpgzvg
// &nonce=47o93dmifox


async function redirectToAuth() {
  window.location.href = `
  https://login.tidal.com/authorize
?client_id=${CLIENT_ID}
&redirect_uri=${encodeURIComponent('https://trn-northstar.deno.dev')}
&scope=${encodeURIComponent(SCOPES)}
&response_type=code
&code_challenge_method=S256
&code_challenge=${CODE_CHALLENGE}
  `;
}
</script>

<template>
  <main>

  </main>
</template>
