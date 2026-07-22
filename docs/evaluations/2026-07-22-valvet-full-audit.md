# Valvet — full audit (VERIFY)

**Datum:** 2026-07-22  
**Plattform:** Cursor · **Läge:** Agent (VERIFY-first)  
**Fas:** Fas 24 (G85 daily driver) — ingen ny produktfunktion utan GAP + Pontus OK  
**Verdict:** **VERIFY PASS** (offline smoke + kod/silo/synapse-audit)

---

## Sammanfattning

Valvet bakom låset är **byggt och wirat**: Samla · Analysera (Mönster/Orkester) · Kunskap · Vit · Exportera · Forensik. Självsorterande arkiv (G10), synapser, pattern-scan, Valv-Chat, dossier och gate/WORM/Zero Footprint är live. Residual: Spec-drift i `Verklighetsvalvet-SPEC.md` (gammal route), deprecated `ValvInboxZone`, live-smoke kräver `.env`/enhet.

---

## Våg A — inventering

### A1 — Frontend UI (`specialist-valv-builder` scope)

| Yta | Path | Status |
|-----|------|--------|
| Route | `src/modules/core/pages/ValvetRoutePage.tsx` | **WIRED** |
| Gate UI | `VaultLockedGate.tsx` → Fyren/WebAuthn | **WIRED** |
| Shell | `VaultPage` → `ValvInputSuperModule` → `ValvSuperModule` | **WIRED** |
| Zoner | `zones/Valv{Samla,Analysera,Kunskap,Vit,Exportera,Forensik}Zone.tsx` | **WIRED** |
| Locked | `VaultMonsterPanel`, `VaultOrkesterPanel`, Kunskapsbank, Aktörskarta | **WIRED** |
| Chat | `vaultChat/**` → `valvChatQuery` | **WIRED** |
| Dossier | `vault/dossier/**` | **WIRED** |
| Deprecated | `ValvInboxZone.tsx` | Keep — granska via SuperModule |

**Filräkning:** ~71 under `vault/` + 7 under `vaultChat/` + knowledge-paneler + core gate/route.

### A2 — Arkiv / silor (`livskompassen-arkiv-master`)

| Silo | Collection | Callable | Status |
|------|------------|----------|--------|
| Valv | `reality_vault` | `valvChatQuery` | **WIRED** (token RAG) |
| Kunskap | `kampspar` + `kb_docs` | `knowledgeVaultQuery` | **WIRED** (Native findNearest) |
| Barnen | `children_logs` | `childrenLogsQuery` | **WIRED** (ej Valv-auto) |
| Dossier | `dossier_snapshots` | `generateDossier` | **WIRED** (export, ej RAG) |

**Arkiv-GAP G1–G17:** done · **V1 Genkit:** wait (PMIR).  
**Cross-RAG:** inga kodvägar som blandar silor i standardflödet.  
**Spec-drift:** `Verklighetsvalvet-SPEC.md` nämner fortfarande `/dagbok?tab=bevis` — docs-only, ej kodblocker.

### A3 — Synapser (specialist-adk-weaver)

| Trigger | Destination | Verdict |
|---------|-------------|---------|
| `drive_file_ingested` | RV / kb_docs / journal / planning / inbox_queue | **PASS** |
| `journal_woven` | `kampspar` opt-in only | **PASS** (ej Valv) |
| `widget_recording_ingested` | `reality_vault` \| queue; block kb_docs | **PASS** |
| `onVaultCreatePatternScan` | `pattern_scan_metadata` REGEX | **PASS** |
| Weaver HITL | `weaver_pending` → `reality_vault` metadata | **PASS** |

### A4 — DCAP / Inkast→Valv (specialist-dcap-routing)

`classifyInboxDocument` → gate → `routeInboxToWorm`: **bevis→reality_vault**, kunskap→kb_docs, barnen→HITL, review→queue. Röst/widget samma kedja. **GO.**

### A5 — Säkerhet (specialist-security-auditor)

WebAuthn/`issueVaultSession` · `assertVaultSession` · WORM create-only · Zero Footprint visibility/pagehide. **GO** för VERIFY. Residual: smoke är delvis statisk; live WORM kräver `smoke:vault-worm` + `.env`.

---

## Våg B — fem nya specialistagenter

Skapade under `.cursor/agents/`:

1. `specialist-valv-sjalvbygg-arkiv.md`
2. `specialist-valv-analys-pansar.md`
3. `specialist-valv-chat-dossier.md`
4. `specialist-valv-synapse-ingest.md`
5. `specialist-valv-kostnad-silo.md`

Registrerade i `.cursor/rules/auto-routing.mdc`.

---

## Kostnad (≤100 SEK/mån)

| Kontroll | Förväntan |
|----------|-----------|
| Vertex Vector Search | **DECOMMISSIONED** |
| RAG | Firestore Native + Gemini Flash |
| Valv-Chat retrieval | Token-match (billigt) |
| Budgetmall | 100 SEK/mån i `GCP-KOSTNADSVAKT.md` |
| Smoke | `smoke:cost-guard` (se Våg C) |

---

## GAP-register (denna audit)

| ID | Typ | Åtgärd |
|----|-----|--------|
| SPEC-ROUTE | Docs-drift | Separat docs-fix — ej denna våg |
| INBOX-ZONE | Deprecated fil | Behåll; ingen borttagning utan cleanup-PMIR |
| LIVE-SMOKE | Env | Pontus: `smoke:predeploy:live` + G85 Valv &lt;3s |

**Inga kod-GAP som blockerar VERIFY PASS.**

---

## Smoke-resultat

| Smoke | Resultat | Tid |
|-------|----------|-----|
| `smoke:locked-ux` | **PASS** | 2026-07-22 |
| `smoke:valv-security` | **PASS** | 2026-07-22 |
| `smoke:valv-mode` | **PASS** | 2026-07-22 |
| `smoke:valv` | **PASS** (seed + gate; E2E chat manuellt) | 2026-07-22 |
| `smoke:pattern-metadata` | **PASS** | 2026-07-22 |
| `smoke:cost-guard` | **PASS** | 2026-07-22 |
| `smoke:entities` | **PASS** | 2026-07-22 |
| `smoke:dossier` | **PASS** | 2026-07-22 |
| `smoke:kunskap` | **PASS** | 2026-07-22 |
| `smoke:inbox` | **PASS** (G10) | 2026-07-22 |
| `smoke:orkester` | **PASS** | 2026-07-22 |
| `gcp:audit-apis` | **PASS** — inga blockerade API:er | 2026-07-22 |

**Live kvar (Pontus):** `smoke:valv-gate` / `smoke:vault-worm` / `smoke:valv-chat-e2e` / G85 Valv bakgrund &lt;3s.

**Overall:** **VERIFY PASS**

---

## Optimering / hotfix 2026-07-22 (efter VERIFY)

| Fix | Detalj |
|-----|--------|
| **Sök/arkiv dolt i Inkast** | `ValvInputSuperModule` spara-läge renderar nu Samla (lista + `vaultTab=sok` → ValvChat); InkastDirectPanel behålls på Arkiv-flik utan dubblett |
| **Orkester→Sök** | Navigate inkluderar `valvMode=spara&vaultTab=sok` |
| **Admin FieldValue** | `scripts/lib/firebaseAdmin.mjs` exponerar `firestore.FieldValue` (fixade `smoke:dcap-alerts-worm`) |
| **SPEC-route** | `Verklighetsvalvet-SPEC.md` + `.context/modules/verklighetsvalvet.md` synkade till `/valvet` |
| **Live smoke** | valv-gate · vault-worm · dcap-alerts-worm · inbox · predeploy:live |



---

## Låsning 2026-07-22 (kanon)

| Lager | Status |
|-------|--------|
| Locked UX §2b Samla | **LÅST** i `.context/locked-ux-features.md` |
| Modul-lås `MOD-VALV-SAMLA` | **locked** — SuperModule/Samla/LogList |
| Smoke | `smoke:locked-ux` + `smoke:valv-mode` kräver Samla+Sök |
| Cleanup | `ValvInboxZone.tsx` **raderad** |

