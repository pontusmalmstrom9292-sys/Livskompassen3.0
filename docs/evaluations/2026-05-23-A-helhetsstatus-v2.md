# Systemkontroll — A — Helhetsstatus v2 — 2026-05-23

**Trigger:** Multi-agent utvärderingsvåg (read-only). Uppdaterar [`2026-05-23-A-helhetsstatus.md`](./2026-05-23-A-helhetsstatus.md) med bredare kodverifiering.

**Källor lästa:** `.context/system-plan.md`, `.context/security.md`, `.context/locked-ux-features.md`, `docs/specs/modules/Arkiv-GAP-REGISTER.md`, `docs/GCP-INVENTORY-LATEST.md`, `firestore.rules`, `package.json` (smoke-scripts), `src/modules/core/routing/AppRoutes.tsx`, git log (20 commits).

---

## Sammanfattning

Livskompassen v2 befinner sig i **Fas 4 — verifiering + produktpolish**. Arkiv **G1–G16** är **done** i kod och GAP-register; legacy Python och north1 Vector är avvecklade. Frontend har live MVP för alla huvudkluster (Hjärtat, Vardagen, Familjen, Hamn, MåBra) plus widget-pipeline (WH1) och Android native widgets (Capacitor). **Öppet:** manuell smoke enligt `SMOKE_CHECKLIST.md` (#1–7, #18 ekonomi), opt-in minne-ingest, Planering `/planering` (endast spec + `module_plan`, ingen route-kod), samt doc-drift i `GCP-INVENTORY-LATEST.md` (G9–G14 summary vs register).

---

## Aktuell fas (system-plan)

| Område | Status |
|--------|--------|
| Fas 1 Cleanup | **Klart** |
| Fas 2 Moduler + routes | **Klart** (redirects `/kompasser`, `/valv`, `/barnen`, `/kunskap`, `/ekonomi`) |
| Fas 3 Firebase deploy | **Klart** — Hosting live; G6 Drive E2E done |
| Kladd-konsolidering | **Klart** — Grunder U1–U5 runtime done |
| Fas 4 verifiering | **Pågår** — locked UX + widget + Android widgets mergade 2026-05-23 |
| Öppna `[ ]` i plan | Manuell smoke; opt-in minne-ingest; Planering implementation |

---

## Röda tråden — runtime vs dokumentation

| Princip | Verifiering | Status |
|---------|-------------|--------|
| DCAP före LLM | `kompis-supervisor.ts` → `analyzeDcap` → `routeFromDcap` | **PASS** |
| Tre silor | `knowledgeVaultQuery` / `valvChatQuery` / `childrenLogsQuery` separata | **PASS** |
| WORM append-only | `firestore.rules` update/delete:false på bevis | **PASS** |
| Zero Footprint | `useZeroFootprint`, `invalidateSession` | **PASS** |
| Kill Switch | `killSwitch.ts`, `useShakeToKill` | **PASS** |
| Prompts centraliserade | `functions/src/sharedRules.ts` | **PASS** |
| Vävaren korsläsning | `kampsparRag.ts` läser journal+valv — tillåten metadata (ej user-RAG) | **PASS** (enligt `memory-silo.mdc`) |

---

## Sacred Features (7)

| Feature | Route / mekanism | Status | Smoke |
|---------|------------------|--------|-------|
| Verklighetsvalvet | `/dagbok?tab=bevis`, Fyren 3s | **PASS** | #2, #11, #16–17 |
| Sanningens Sköld | `reality_vault` create-only | **PASS** | rules |
| Morgonkompassen | `/vardagen` → kompasser | **PASS** | `smoke:compass` |
| Dossier-Generator | `/dossier`, `generateDossier` | **PASS** | `smoke:dossier` |
| Speglings-Systemet | `/dagbok?tab=speglar` | **PASS** | `smoke:speglar` |
| Zero Footprint | blur/timeout/logout | **PASS** | manuell |
| Kill Switch | shake ≥15 m/s² | **PASS** | manuell iOS PWA |

---

## Locked UX (6 register)

| Feature | Status | Verifiering |
|---------|--------|-------------|
| Barnfokus-frågor | **PASS** | `BarnfokusFraganPanel`, `smoke:locked-ux` |
| Valv Mönster | **PASS** | `VaultMonsterPanel` |
| Valv Orkester | **PASS** | `VaultOrkesterPanel` |
| Planering hybrid spec | **PASS** (doc) | PNG + spec finns |
| Fyren widget WH1 | **partial** | Kod + Android; manuell E2E kvar |
| Sidomeny kanon | **partial** | `drawerNav.ts` — `NavigationDrawer.tsx` saknas |

---

## GAP-register vs live

| ID | Register | Kod/moln | Notering |
|----|----------|----------|----------|
| G1–G8 | done | done | Vector 102 vectors (inventering 2026-05-22) |
| G9–G14 | done | done | Entity, inkorg, cache, tidshjul, gräns |
| G15–G16 | done | done | Grunder injection + RSD |
| V1 Genkit | wait | — | Ej migrera |
| GAP-register summary i GCP-INVENTORY | **drift** | G9–G14 rad **open** i summary-tabell | Uppdatera doc |

---

## Top 3 öppna risker

1. **Manuell smoke ej körd post-widget** — automatiserade script PASS 2026-05-22; nya UX-komponenter (Familjen D12–D14, Orkester trio) ej i alla smoke-script.
2. **Planering route saknas** — `/planering` i drawer men ingen `PlaneringPage` i `AppRoutes.tsx`.
3. **Ostadigt arbete** — 11 untracked komponenter + ändrad `constants.ts` (Familjen); bör committas eller rensas före deploy.

---

## Automatiserade smoke (package.json)

| Script | Syfte |
|--------|-------|
| `smoke:kunskap` | Kunskap RAG |
| `smoke:valv` | Valv-chat silo |
| `smoke:dossier` | Dossier export |
| `smoke:compass` | Kompasser |
| `smoke:mabra` | MåBra coach |
| `smoke:speglar` | Speglings |
| `smoke:children` | Barnloggar |
| `smoke:locked-ux` | Låsta UX (statisk) |
| `smoke:grans` | Gräns-Arkitekten |
| (+ entities, inbox, cache, tidshjul) | G9–G13 |

---

## Rekommenderat nästa steg (max 1)

**Manuellt:** Kör `npm run smoke:locked-ux` + smoke #18 (ekonomi) lokalt efter senaste Familjen/widget-merge — bekräfta att inget låst flöde brutits.

---

## Blocker

Ingen kodblockerare för daglig användning. Deploy av Planering kräver produktbeslut + `kör planering`.
