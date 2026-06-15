# Fas 13 våg 2 — worm-medium

**Trigger:** Fas 13 Sprint · våg `worm-medium`  
**Git:** `main` (lokal diff)  
**Kört:** 2026-06-15 CEST  
**GAP:** Fas 9 — `inboxPersist` Admin-fält utanför rules-whitelist · `VaultService` alternate schema

---

## Säkerhetsblock

| Regel | Status |
|-------|--------|
| WORM update/delete | **OK** — orörd |
| `firestore.rules` | **OK** — PMIR, ej ändrad |
| Tre silos | **OK** |
| Zero Footprint | **OK** |

---

## Leverans

### Server (`inboxPersist` + `wormPayload`)

- `REALITY_VAULT_ALLOWED_KEYS` = exakt `isValidRealityVaultCreate()` (inga `driveFileId`/`inboxTags` m.m.)
- `CHILDREN_LOG_ALLOWED_KEYS` = exakt `isValidChildrenLogCreate()`
- Vault-ingest: dedup via `sourceRef: drive:{fileId}` (rules-tillåten)
- Barnen-ingest: dedup via `inbox_queue.persistedCollection` · `channel: inbox_ingest`
- `assertServerWormPayload` före varje WORM-write

### Client (`VaultService`)

- `normalizeVaultSaveInput` → `assertClientWormPayload` (förbjudna mutationsfält)
- Alla writes via `saveVaultLog` + `assertArchitectureWrite`

### Smoke

- `smoke_inkast_lockdown.mjs` — kontrollerar `assertServerWormPayload` + `driveInboxSourceRef`

---

## Resultat

| Kommando | Status |
|----------|--------|
| `functions build` | **PASS** |
| `npm run build` | **PASS** |
| `smoke:vault-worm` | **PASS** |
| `smoke:inkast` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| Deploy inbox functions + hosting | **PASS** |

**Prod:** https://gen-lang-client-0481875058.web.app

---

## Nästa steg

**Våg 3 — `evidence-e2e`:** Dossier BBIC/LEGAL, Valv desync, Hamn/Gräns → `smoke:dossier`, `smoke:grans`, `smoke:hamn`, `smoke:valv`, `smoke:valv-mode`.

---

## Handoff (ny chatt)

```
FAS 13 SPRINT — våg evidence-e2e. Läs .orkester/fas13-state.json och docs/FAS13-SPRINT-AUTORUN.md.
Våg 0–2 PASS. Kör ENDAST våg 3 scope. PMIR-stopp enligt FAS13.
[SÄKERHETSBLOCK — kopiera från FAS13-SPRINT-AUTORUN.md]
```
