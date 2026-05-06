---
name: Draft approval flow
description: "sure" or "ok" to a write offer means show a draft — not write to files
type: feedback
originSessionId: 7e763eae-7b40-473e-a538-ac621c438c60
---
"Sure" or "ok" in response to "want me to write it?" means prepare a draft for review, not write to files. Writing to files requires explicit approval of a specific draft the user has seen.

**Why:** User caught Claude writing an import section directly after "sure" without showing a draft first, bypassing the review step.

**How to apply:** Always show the proposed text before touching any file. The only exception is single-line fixes where the exact change was already stated verbatim in the conversation and the user approved that exact wording.
