# Systemkontroll — Fas 9 systemanalys — 2026-06-14

**Trigger:** Fas 9 — Systemanalys & SYSTEM_PLAN_v2  
**Leverans:** [`docs/SYSTEM_PLAN_v2.md`](../SYSTEM_PLAN_v2.md) (aktiv styrning från Fas 9+)  
**Källor lästa:** `.context/system-plan.md`, `Arkiv-GAP-REGISTER.md`, `MODUL-GAP-OVERSIKT.md`, `SMOKE_RESULTS.md`, `firestore.rules`, `functions/src/callables/`, `src/modules/` (grep/read)

---

## Sammanfattning

Livskompassen3.0 på `main` är **produktionsmogen**: G1–G16 + F8 done, Superhub Fas 6–8 levererade och låsta (MåBra §11, Familjen §12). Backend synapseBus och callables är live — inga stub-handlers. Kvarvarande risker är **säkerhet/UX** (vault i publikt läge, `chatWithKompis` cross-silo), **design drift** (16 hex-filer), och **strukturell fragmentering** (dubbla dashboards/routes). Fas 9+ börjar med Super-Planering Input efter P1-säkerhetsfixar.

---

## PASS

| Område | Bevis |
|--------|-------|
| WORM rules | `firestore.rules` — update/delete false på `reality_vault`, `children_logs`, `evolution_ledger` |
| Client WORM guard | `firestore.ts` `assertWormPayload` |
| Retention allowlist | `retentionJob.ts` WORM_COLLECTIONS_NEVER_PURGE |
| Tre silo-RAG | `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery` isolerade |
| Superhub Fas 6–8 | MåBra, Familjen, Ekonomi — specs + locked-ux §11–12 |
| SynapseBus | 4/4 handlers live |
| Smoke baseline | build + locked-ux + orkester PASS 2026-06-11 |
| Manuell smoke | #3 Valv, #4 Barnporten PASS (USER) |

---

## GAP / risk

### WORM (medium)

| Fil | Problem |
|-----|---------|
| `functions/src/lib/inboxPersist.ts` | Admin SDK extra fält utanför client whitelist |
| `src/modules/core/firebase/VaultService.ts` | `saveVaultEntry` alternate schema, bypassar assertWormPayload |
| — | `evolution_ledger` rules utan append-implementation |

### Tre silos U1 (critical → fixad i denna leverans)

| Fil | Problem | Åtgärd |
|-----|---------|--------|
| `functions/src/callables/kompis.ts` | `reality_vault` i LLM-kontext utan vault session | **Fix:** endast `journal` i kontext |
| `functions/src/callables/weeklySummary.ts` | Läser vault utan gate | Backlog P2 |
| `functions/src/callables/compass.ts` | Vault-count utan gate | Backlog P2 |

### Plausible deniability (critical → fixad delvis)

| Fil | Problem | Åtgärd |
|-----|---------|--------|
| `RecentIntakeWidget.tsx` | Vault listener + "Verklighetsvalvet" på `/dashboard` | **Fix:** gate `vaultSessionOpen` |
| `/arkiv`, `DagbokSuperModule` | Vault-tab/query utan gate | Backlog P2 |
| `ClusterGrid.tsx` | Kunskap-länk trots HIDE_BEVIS | Backlog P2 |

### Obsidian Calm (delvis)

16 feature-filer med hårdkodade hex — värst: `OracleDashboard.tsx`, `QuickCaptureOverlay.tsx`.

### 3-zonsystem (structural debt)

- `/oversikt` vs `/dashboard`
- `/mabra` parallellt med `/vardagen?tab=mabra`
- Legacy routes medvetet kvar (redirects)

### Tech debt

- 3 oanvända npm-paket (**fixade** i denna leverans)
- 3 ESLint hook-varningar kvar före fix (**fixade**)
- `typecheck:core-strict` 9 fel baseline
- Vite chunk >500 kB

---

## Rekommenderat nästa steg (max 1)

**Fas 9 kickoff:** Djupanalys + eval för **Super-Planering Input** (`/planering`) — följ samma mönster som MåBra/Familjen/Ekonomi (8A→E).

---

## Blocker

Ingen deploy-blocker. P1 vault-fixar i denna leverans kräver `firebase deploy --only functions:chatWithKompis` + hosting om prod ska uppdateras.

---

## Modulstatus (zon)

| Zon | Status | Öppet |
|-----|--------|-------|
| Hjärtat | Production | Superdagbok migrering |
| Vardagen | Production | Super-Planering, Super-Arbetsliv |
| Familjen | Production | PDF export, push defer |
| Valv | Production | BBIC reportType |
| Barnporten | Production | Push defer |

---

## Referenser

- [`SYSTEM_PLAN_v2.md`](../SYSTEM_PLAN_v2.md)
- [`2026-06-11-FOEBATTRINGSPLAN-HELAPP.md`](./2026-06-11-FOEBATTRINGSPLAN-HELAPP.md)
- [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md)
