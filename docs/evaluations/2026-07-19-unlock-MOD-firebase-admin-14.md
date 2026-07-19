# Unlock — firebase-admin 14 modular migration

approved: yes

**Datum:** 2026-07-19  
**Scope:** Mekanisk import-omdirigering + compat-facade. Ingen beteendeförändring i WORM/DCAP/synapser.

**Berörda låsta moduler (import-only):**
- MOD-VALV-ORKESTER
- MOD-BACK-SYN
- MOD-BACK-DCAP
- MOD-BACK-WORM
- MOD-CORE-MINNE

**Ändring:**
- Bump `firebase-admin` 12 → 14.2
- Ny `functions/src/lib/firebaseAdmin.ts` (modular API + `admin.firestore()`-facade)
- Ersätt `import * as admin from 'firebase-admin'` → facade i ~55 filer

**Godkännande:** Pontus OK (session Dependabot vågor → egen admin-14-migration).
