# Systemkontroll — A — 2026-05-22

**Trigger:** Användaren bad om helhetsstatus (röda tråden, fas, Sacred Features).  
**Källor lästa:** `.context/system-plan.md`, `.context/security.md`, `.context/arkiv-minne.md`, `docs/GCP-INVENTORY-LATEST.md`, `docs/specs/modules/Arkiv-GAP-REGISTER.md`, `AGENTS.md`, `docs/SMOKE_RESULTS.md`  
**Kodverifiering:** `firestore.rules`, `functions/src/index.ts`, `functions/src/agents/kompis-supervisor.ts`, `src/modules/core/routing/AppRoutes.tsx`, `src/App.tsx`, `npm run build` (functions + frontend)

---

## Sammanfattning

Projektet följer **röda tråden i runtime**: DCAP före LLM-routing, tre separata RAG-callables, WORM på bevis-collections, Zero Footprint + Kill Switch i app-shell. **Fas 1–2 och GCP Fas 4 är i praktiken klara.** Det som återstår är främst **manuell smoke i appen**, **dokumentationsdrift** (system-plan har föråldrade `[ ]` trots G6/G9–G14 done), och **tre öppna säkerhets-P0** i `security.md` (ägare på Drive-webhook, server-PIN). Bygg: **PASS** idag.

---

## 1) Aktuell fas (system-plan)

| Område | Status | Kommentar |
|--------|--------|-----------|
| Fas 1 Cleanup | **klar** | Alla `[x]` |
| Fas 2 Moduler | **klar** | Routes + AuthGate + moduler live |
| Kladd-konsolidering | **nästan klar** | `[ ]` Manuell ingest minne (opt-in) · `[ ]` kör [modul] vid behov |
| Fas 3 Firebase | **delvis dokumenterad** | Deploy/hosting klart; **system-plan rad 64–65, 74–75 är föråldrade** (säger smoke/notify öppet — GCP/G6 **done**) |
| Kommande fas | **utbyggnad pågår** | `[ ]` Minneloggning delvis (ingest + Vector PASS; full pipeline ej slutmarkerad) |
| GCP / Arkiv G1–G8 | **done** | Enligt `Arkiv-GAP-REGISTER` + `GCP-INVENTORY-LATEST` |
| Arkiv G9–G14 | **done i register** | `Arkiv-GAP-REGISTER` rad 17 — **GCP-INVENTORY tabell rad 143 säger fortfarande open** → dokumentationsdrift |

**Fas i en mening:** Du är i **slutet av Fas 3 + post-FAS4-stabilisering** — produkt-MVP och molnstack är på plats; nästa värde är verifiering i appen + städa docs, inte ny arkitektur.

---

## 2) Röda tråden — runtime vs dokumentation

| Princip | PASS/GAP | Bevis |
|---------|----------|-------|
| DCAP före LLM | **PASS** | `kompis-supervisor.ts:32-52` — `analyzeDcap` → `routeFromDcap` |
| Tre silor, ingen cross-RAG | **PASS** | `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery` i `index.ts`; kommentarer + `entityProfileTypes.ts` |
| WORM append-only | **PASS** | `firestore.rules` — `update, delete: if false` på `reality_vault`, `journal`, `children_logs`, m.fl. |
| LLM styr inte auth/WORM | **PASS** | Callables kräver `request.auth`; rules äger integritet |
| Zero Footprint | **PASS** | `App.tsx` — `useZeroFootprint()`; `invalidateSession` callable |
| Kill Switch | **PASS** | `App.tsx` — `useShakeToKill()` |
| Permanent minne | **PASS** | Collections + G5 retention allowlist (dokumenterat) |
| Prompts centraliserade | **GAP (P1)** | `security.md` rad 149 — DCAP-detaljer kan ligga utanför `sharedRules.ts` (ej verifierat djup i denna A-körning) |

**Drift att fixa i docs (ej runtime-brott):**

- `system-plan.md` § Fas 3: checkboxar för smoke + `notifyNewFile` bör uppdateras till `[x]` (G6 done 2026-05-22).
- `GCP-INVENTORY-LATEST.md` G9–G14-rad: synka till **done** som i `Arkiv-GAP-REGISTER`.

---

## 3) Sacred Features — PASS/GAP

| Feature | PASS/GAP | Route / callable | Smoke |
|---------|----------|------------------|-------|
| Verklighetsvalvet | **PASS** | `/valv` → redirect `/dagbok?tab=bevis`; WORM `reality_vault` | #2, #16–17 |
| Sanningens Sköld | **PASS** | Samma WORM + rules create-only | rules |
| Morgonkompassen | **PASS** | `/kompasser` → `/vardagen` (kompasser-tab); `checkins` | #5 |
| Dossier-Generator | **PASS** | `/dossier`; `generateDossier` | smoke:dossier PASS |
| Speglings-Systemet | **PASS** | `/speglar` → `/dagbok?tab=speglar`; `speglingsMirror` | #9, #14–15 |
| Zero Footprint | **PASS** | `useZeroFootprint`, `invalidateSession` | manuell |
| Kill Switch | **PASS** | `useShakeToKill` | #12 |

**Notering:** Routes har konsoliderats under **Hjärtat** (`/dagbok`) och **Vardagen** (`/vardagen`) — funktion kvar, URL:er redirectar. Det stämmer med ny routing, inte försvagning.

**Manuell verifiering:** `SMOKE_RESULTS.md` visar automatiserade smoke **PASS** 2026-05-22; system-plan `[ ]` manuell smoke (#2–4 i UI) är fortfarande det praktiska gapet för *din* trygghet.

---

## 4) Top 3 öppna GAP

| # | GAP | Var | Allvarlighet |
|---|-----|-----|--------------|
| 1 | **Manuell smoke** valv + barnen + hamn i prod/lokal UI | `system-plan.md` Fas 3, `SMOKE_CHECKLIST.md` | Medium — trygghet, inte arkitektur |
| 2 | **Dokumentationsdrift** (system-plan Fas 3, GCP G9–14-tabell) | `system-plan.md`, `GCP-INVENTORY-LATEST.md` | Låg — förvirrar vid nästa A-körning |
| 3 | **Säkerhet P0 öppna** — `notifyNewFile` `ownerId`-bindning; Valv/Barnen client-PIN utan server/WebAuthn | `.context/security.md` § Öppna säkerhets-GAP | Medium — före skarp produktion |

**Arkiv G9–G14:** **done** enligt `Arkiv-GAP-REGISTER` (EntityProfile, Inbox, Context Cache, Tidshjulet, Gräns-Arkitekten). Inte blockerande för röda tråden.

**U2.5 HITL:** `security.md` markerar **open**; Grunder-utvärdering 2026-05-22 markerar **done** (`dcapAlertSynapse`). → behandla som **delvis done** (WORM + UI-notis; extern notifiering saknas).

---

## 5) Bygg & automatiserad smoke (idag)

| Kontroll | Resultat |
|----------|----------|
| `cd functions && npm run build` | **PASS** (2026-05-22, denna körning) |
| `npm run build` (frontend) | **PASS** |
| Senaste `SMOKE_RESULTS.md` | valv, kunskap, dossier, children, inbox, grans — **PASS** |

---

## Rekommenderat nästa steg (max 1)

**Kör manuell smoke rad 2–4** i [`docs/SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md) mot Hosting eller `npm run dev`: spara en post i valv (bevis-flik), barnen (`/familjen`), och bekräfta i Firestore Console. Det stänger den största kvarvarande *operativa* luckan utan ny kod.

---

## Blocker

Ingen arkitektur-blocker för att fortsätta använda appen. Blocker endast om du kräver 100 % doc-synk eller P0-säkerhet i prod före extern användning.

---

## Referens — var sanningen bor

| Fråga | Fil |
|-------|-----|
| Fas & checkboxar | `.context/system-plan.md` |
| Sacred + P0 | `.context/security.md` |
| Live moln | `docs/GCP-INVENTORY-LATEST.md` |
| Implementation kö | `docs/specs/modules/Arkiv-GAP-REGISTER.md` |
| Nästa A/B/C/D/E | `docs/SYSTEMKONTROLL.md` |
