# Förbättringsplan — Hela appen (2026-06-11)

**Metod:** Fem parallella read-only revisioner (navigering/hubbar, frontend/moduler, säkerhet/backend, innehåll/RAG, kodkvalitet/test) + syntes.  
**Princip:** En våg i taget · PMIR före merge · smoke före deploy · ingen stor bang-refactor.

**Relaterat:** [`.context/system-plan.md`](../../.context/system-plan.md) · [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) · [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md) · [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md)

---

## 1. Sammanfattning

| Domän | Huvudstatus | Största lucka |
|-------|-------------|---------------|
| **Navigering & hubbar** | Legacy-redirects + superhub fungerar | Hamn forensic **fixad** (0.1) |
| **Frontend & moduler** | Locked UX intakt, features-first | Drawer panic-lock skippar server-invalidering |
| **Säkerhet & backend** | WebAuthn på `issueVaultSession` deployad | App Check, rate limits, anonym auth + WORM |
| **Innehåll & RAG** | Tre silor isolerade, ADK live | `mabraCoach` utan runtime `bankId`-lookup (U6) |
| **Kodkvalitet & test** | 39 smoke-skript, functions strict | Frontend ej `strict`, CI bara hosting, `smoke:all` ofullständig |

**Ingen CRITICAL cross-RAG-bugg hittad.** Största användarrisk: trasig Hamn forensic-länk + inkonsekvent navigation.

---

## 2. Fem revisionsdomäner (underagenter)

| # | Domän | Fokus | Agent-ref |
|---|-------|-------|-----------|
| A | Navigering & hubbar | 3-zon, drawer, planering hybrid, legacy routes | explore |
| B | Frontend & moduler | Locked UX, Obsidian Calm, vault lifecycle, Android | explore |
| C | Säkerhet & backend | Rules, callables, auth, WORM, npm | specialist-security-auditor |
| D | Innehåll & RAG | U6, silos, banks, synapser, waves | explore |
| E | Kodkvalitet & test | TS strict, dead code, CI, docs drift | explore |

---

## 3. Master-roadmap (prioriterad)

### Fas 0 — Snabba fixar utan arkitektur (1–3 dagar)

Säker, låg regressionsrisk. Kör en punkt → smoke → ev. deploy.

| ID | Uppgift | Domän | Filer | Smoke |
|----|---------|-------|-------|-------|
| **0.1** | Fix `/hamn?tab=analys` och `/familjen?tab=analys` → `vaultDrawerPath('hamn_analys')` | A | `AppRoutes.tsx`, `FamiljenPage.tsx` | **done** 2026-06-11 |
| **0.2** | Drawer «Lås Valvet nu» → `endVaultSession()` | B/C | **done** 2026-06-11 |
| **0.3** | Ersätt stale `/liv` i `vardagenTabHref` | A | **done** 2026-06-11 |
| **0.4** | Wildcard `*` → `/` | A | **done** 2026-06-11 |
| **0.5** | Synka SMOKE_CHECKLIST | E | **done** 2026-06-11 |
| **0.6** | GCP inventory + DEPLOY.md (35 fn) | E | **done** 2026-06-11 |

### Fas 1 — Säkerhetshårdning (1 vecka)

Kräver prod-beslut (anon auth, App Check).

| ID | Uppgift | Domän | Anteckning |
|----|---------|-------|------------|
| **1.1** | Cap `ingestKnowledgeDocument` base64 (~8 MB) | C | **done** 2026-06-11 |
| **1.2** | Prod: `VITE_REQUIRE_EMAIL_AUTH=true` + dokumentera | C | Användarflöde ändras |
| **1.3** | `email_verified` i Firestore rules (eller uppdatera security-firestore.mdc) | C | Beslut krävs |
| **1.4** | Firebase App Check (web + Android) på callables | C | GCP-konfig |
| **1.5** | Per-UID rate limits på LLM-callables | C | Functions middleware |
| **1.6** | WORM create: `keys().hasOnly([...])` per sacred collection | C | Rules-deploy |
| **1.7** | VaultZoneGate + `webauthn.ts` fail-closed utan WebAuthn | C | **done** 2026-06-11 |

### Fas 2 — Navigation & hubbar IA (1–2 veckor)

En beslutspunkt före kod: drawer accordion vs kanon 4 rader.

| ID | Uppgift | Domän |
|----|---------|-------|
| **2.1** | Beslut: behåll accordion ELLER migrera till MENU-DRAWER-KANON 4 rader | A |
| **2.2** | Uppdatera `.cursorrules` + locked-ux: `/hjartat` + `/valvet` (inte `/dagbok?tab=bevis`) | A/E | **done** 2026-06-11 |
| **2.3** | En canonical regler-URL: `/projekt/regler` + redirect från `?tab=regler` | A | **skipped** — e-postregler vs projektregler |
| **2.4** | Projekt-detalj: `/admin/projects/:id` → `/projekt/:id` ELLER uppdatera hybrid-spec | A |
| **2.5** | Synka `navigationRegistry.ts` dailyLife-tabs med launcher + `/mabra` `/planering` | A | **done** 2026-06-11 |
| **2.6** | Gold active state på drawer sub-links | B | **done** 2026-06-11 |
| **2.7** | Standardisera hub sub-nav (dropdown vs tab bar) per zon-spec | B |

### Fas 3 — Kodstäd & kvalitetsgrindar (1 vecka)

| ID | Uppgift | Domän |
|----|---------|-------|
| **3.1** | Ta bort `ModuleHubPanel`, `PinGate` (BarnensPage kvar — smoke) | B/E | **done** 2026-06-11 |
| **3.2** | Radera 9 tomma `src/modules/*` shim-mappar | E | **done** 2026-06-11 |
| **3.3** | Ta bort legacy `vault` collection från rules (efter prod-data-koll) | C/E |
| **3.4** | `"lint"` + utökad `smoke:all` | E | **done** 2026-06-11 |
| **3.5** | CI: functions build + `smoke:locked-ux` | E | **done** 2026-06-11 |
| **3.6** | Utöka `smoke:all` med `innehall`, `orkester`, `valv-security`, `entities` | E/D | **done** 2026-06-11 |
| **3.7** | Frontend `strict: true` (stegvis: strictNullChecks först) | E |

### Fas 4 — Innehåll & coach (parallellt, kurator-ledd)

| ID | Uppgift | Domän | Kurator |
|----|---------|-------|---------|
| **4.1** | Runtime `bankId`-lookup i `mabraCoach` / KBT-transformator | D | mabra-curator |
| **4.2** | Wave 17 JOY-kort → TS-kataloger + smoke (efter PMIR) | D | mabra-curator |
| **4.3** | Barnen-PLAY-BANK ↔ `BARNFOKUS_QUESTIONS` harmonisering | D | barn-lek (plan) |
| **4.4** | DCAP semantic prompt → `sharedRules.ts` | D | backend-agents |
| **4.5** | Wave 18 enligt CONTENT-WAVES.md | D | innehall-dirigent |

### Fas 5 — Prestanda & backend-hygien (när Fas 0–3 är gröna)

| ID | Uppgift | Domän |
|----|---------|-------|
| **5.1** | Functions v1 → v2 migrering i batch (`analyzeMessage`, `speglingsMirror` först) | C/E |
| **5.2** | Vite chunk-split: Valvet/Familjen lazy, minska 500 kB main | E |
| **5.3** | Error boundaries: FamiljenPage, MabraPage, LivLauncherPage | B |
| **5.4** | Delad async-hook (loading/error/offline) för Firestore-paneler | B |
| **5.5** | npm audit: grpc-js, planerad vite/firebase-admin bump | E |

---

## 4. Detaljerad backlog per domän

### A — Navigering & hubbar

**Kritiskt**
- `/hamn?tab=analys` tappas i `RedirectHamnToFamiljen`; `TryggHamnHub` redirect nås aldrig embedded.

**Högt**
- Doc vs runtime: 3-zon i docs, 4 paths i kod (`/hjartat`, `/valvet`, `/vardagen`, `/familjen`).
- Drawer accordion vs MENU-DRAWER-KANON.
- Stale `/liv` hrefs i `tabRegistry.ts`.
- Planering regler dubbel (`/projekt/regler` + `?tab=regler`).
- Projekt-URL `/admin/projects/:id` vs spec `/projekt/:id`.

**Medel**
- 9 tomma legacy-modulmappar.
- `BarnensPage`, `ModuleHubPanel` orphaned.
- Indigo active sub-links i drawer.

**Redan solidt**
- `AppRoutes.tsx` legacy-matris, `navTruth.ts`, `LivLauncherPage`, superhub Vardag+Valv, `smoke:superhub`.

### B — Frontend & moduler

**Högt**
- Drawer panic-lock utan `endVaultSession`.
- Hub navigation inkonsekvent (dropdown vs tab bar vs launcher).
- `BarnensPage` orphaned.

**Medel**
- Error boundaries saknas utanför Valv/Planering.
- `CognitiveLoadStrip` underanvänd.
- Offline-felhantering bara i VaultPage.
- `vault/module_plan.md` stale (bevis hide = done).

**Redan solidt**
- All locked UX mountad och smoke-guarded.
- BentoCard/calm-card dominant.
- Vault lifecycle centraliserad.
- Android native auth split korrekt.

### C — Säkerhet & backend

**Högt (post-WebAuthn)**
- H1: Drawer lock skippar invalidateSession.
- H2: Ingen App Check.
- H3: Ingen rate limiting på LLM.
- H4: Plausible deniability UI-only (Firestore läs utan vault-session).
- H5: Anonym auth + full WORM i rules.

**Medel**
- email_verified saknas.
- Shadow fields på WORM create.
- VaultZoneGate fail-open.
- notifyNewFile ownerId trust.
- ingestKnowledgeDocument upload bomb.

**Redan solidt**
- WebAuthn på issueVaultSession (deployad).
- assertVaultSession på Valv-callables.
- WORM rules, silo-agents, notifyNewFile fail-closed.

### D — Innehåll & RAG

**Högt**
- mabraCoach utan runtime bankId (U6 P1).
- smoke:all utelämnar innehall/content-waves.

**Medel**
- Barnen-PLAY-BANK ej i kod.
- Wave 17 bank-only.
- DCAP prompt utanför sharedRules.
- specialist-barn-lek saknas.

**Redan solidt**
- Tre silor isolerade i prod callables.
- ADK synapseBus live (4 handlers).
- Kunskap seed 53 FACT, waves 0–16.
- GAP G1–G16 done.

### E — Kodkvalitet & test

**Kritiskt (process)**
- Frontend ej TypeScript strict.
- CI: hosting only, ingen smoke/lint/functions.
- Vitest-filer utan runner.

**Högt**
- smoke:all täcker ~13/39 smokes.
- DEPLOY.md/GCP inventory ofullständig.
- Legacy vault collection i rules.
- Doc drift (system-plan, SMOKE_CHECKLIST, security Barnen RAG).

**Redan solidt**
- 39 smoke-skript, functions strict, build grön, features-first README.

---

## 5. Säker exekveringsmodell

För **varje** våg (0.1, 0.2, …):

1. **Läs kanon** — relevant SPEC, locked-ux, GAP-register (anti-dubblett).
2. **PMIR** — [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) om >3 filer eller rules/functions.
3. **Implementera** — minimal diff, återanvänd befintliga komponenter.
4. **Bygg** — `cd functions && npm run build` + `npm run build`.
5. **Smoke** — se tabell per våg; minimum `smoke:locked-ux` vid UX-touch.
6. **Deploy** — enligt [`DEPLOY.md`](../DEPLOY.md); fråga explicit om prod.
7. **Hard refresh** — Cmd+Shift+R; Android: cap sync vid UI-ändring.
8. **USER smoke** — relevant rad i SMOKE_CHECKLIST om Valv/Barnen.

### Smoke-gate per fas

| Fas | Minimum smoke |
|-----|---------------|
| 0 | `smoke:locked-ux`, `smoke:superhub`, `smoke:plausible-deniability`, `smoke:valv-security` |
| 1 | + `smoke:valv-gate`, `smoke:vault-worm` |
| 2 | + `smoke:design-modules`, `smoke:planering-gora-e` |
| 3 | + `smoke:orkester`, `lint`, `vitest run` |
| 4 | + `smoke:innehall`, `smoke:content-waves` |

---

## 6. Rör inte (låst / done)

- Barnfokus-frågor, Valv Mönster/Orkester/Kunskapsbank/Aktörskarta.
- Planering P3 Kanban på `/planering`.
- Tre silor — ingen fjärde RAG.
- D1/M2 ikoner utan godkännande.
- WORM collections — append-only.
- WebAuthn server-gate på issueVaultSession (nyss deployad).

---

## 7. Rekommenderad startordning

```
Vecka 1:  0.1 → 0.2 → 0.3 → 0.5 → 0.6  (nav + drawer lock + docs)
Vecka 2:  1.1 → 1.7 → 3.1 → 3.4        (säkerhet + städ)
Vecka 3:  2.1 beslut → 2.2–2.5          (IA — kräver produkt-OK)
Vecka 4:  3.5–3.7 → 4.1                 (CI + mabraCoach bankId)
Löpande:  4.5 waves via innehall-dirigent
```

**Första steget att köra:** **0.1** — fix Hamn forensic deep link (användarbugg, isolerad ändring).

---

## 8. Appendix — agent-transcript-refs

| Domän | Agent ID |
|-------|----------|
| Navigering | ea2fd010-7235-46ed-861f-175e440dabf2 |
| Frontend | 2a58fa0d-9235-4116-9f5f-f5dffb753350 |
| Innehåll/RAG | 33dbd7dd-50fc-4142-969e-2d6b902e4037 |
| Kodkvalitet | 8fa4ed0c-a72c-4258-9d73-7333b3e737f9 |
| Säkerhet | ee3b7ad8-29fa-4e59-a5f4-e86200f427ad |

---

*Skapad 2026-06-11. Uppdatera efter varje avslutad våg.*
