# Evigt Minne v62 — deploy

**Datum:** 2026-07-18  
**Fras:** OK deploy  
**Verdict:** **GO**

| Target | Result |
|--------|--------|
| `firebase deploy --only functions` | **PASS** (Job 1784377759492) |
| `firebase deploy --only firestore` | **PASS** (Job 1784378075932) — Admin-only create `kampspar`/`kb_docs` |

**Nytt callable:** `promoteKbDocToKampspar`  
**Stack:** Firestore Native ANN + hybrid RRF live i functions.
