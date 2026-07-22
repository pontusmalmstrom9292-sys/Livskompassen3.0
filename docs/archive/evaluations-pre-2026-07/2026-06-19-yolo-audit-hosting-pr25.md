# YOLO Audit — hosting deploy (PR #25)

**Datum:** 2026-06-19  
**Branch / SHA:** `main` @ `28a24de01` (merge PR #25 Brusfiltret lab polish)  
**Deploy:** `firebase deploy --only hosting`  
**Projekt:** `gen-lang-client-0481875058`  
**Job ID:** `1781872811578` — **success**  
**URL:** https://gen-lang-client-0481875058.web.app  
**Operatör:** pontus.malmstrom9292@gmail.com (Firebase MCP, Cursor cloud agent)

---

## Scope

| Target | Denna körning | Kvar öppet |
|--------|---------------|------------|
| `hosting` | **DEPLOYAD** | — |
| `firestore:rules` (M3.0-C `mabra_nutrition_log`) | Ej denna körning | PMIR godkänd — separat deploy |
| `functions:beginVaultBiometricChallenge`, `issueVaultSessionViaBiometric` | Ej denna körning | PMIR v1 godkänd — separat deploy |

---

## Smoke-gate

```bash
npm run build                    # PASS (dist/)
YOLO_SKIP_BUILD=1 npm run smoke:yolo   # PASS
```

---

## Checklista

| # | Kontroll | Status | Bevis |
|---|----------|--------|-------|
| 1 | Tre silos — ingen cross-RAG | PASS | `smoke:orkester`, `smoke:innehall` |
| 2 | LLM beslutar inte auth/WORM | PASS | `routeFromDcap`, `callableGuards` |
| 3 | Prompts endast `sharedRules.ts` | PASS | `smoke:prompts` |
| 4 | Locked UX intakt | PASS | `smoke:locked-ux` |
| 5 | Plausible deniability | PASS | `smoke:plausible-deniability` |
| 6 | Zero Footprint | PASS | `smoke:valv-security` |
| 7 | Inga secrets i diff | PASS | hosting-only; `.env` gitignored |
| 8 | `firestore.rules` ej ändrad i denna deploy | PASS | endast `hosting` target |
| 9 | Sacred / Barnporten kanon-UI | PASS | ingen UI-borttagning i PR #25 |
| 10 | Brusfiltret lab smoke | PASS | `scripts/smoke_brusfiltret_lab.mjs` (PR #25) |

---

## Säkerhet (auth)

- Firebase **authorization code** användes engångs via MCP `firebase_login` — **lagras inte** i repo.
- CLI-token ligger i lokal `~/.config/firebase/` — redan gitignored (`.firebase/`, `firebase-debug.*`).
- **MUST NOT:** committa auth codes, `FIREBASE_TOKEN`, eller service-account JSON.

Se [`docs/DEPLOY.md`](../DEPLOY.md) § Cloud Agent.

---

## Rekommendation

**GO** — hosting deploy genomförd och verifierad.

**Nästa steg (ett):** USER-test — hard refresh (`Cmd+Shift+R`) → Brusfiltret lab + hem-layout; vid OK: separat `firestore:rules` (M3.0-C) om ej redan live.
