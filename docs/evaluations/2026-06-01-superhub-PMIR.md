# Pre-Merge Impact Report (PMIR) — Supersidor v2

**Datum:** 2026-06-01  
**Gren:** `feat/superhub-v2` → **`main`**  
**Agent / session:** Cursor Agent — supersidor v2 plan

---

## Scope

- 4 publika drawer-rader: Hem · Liv och göra · Familj och gränser · Inställningar
- Shell-sidor `/liv`, `/familj` + legacy redirects
- Global capture (`src/modules/capture/`) + Draft Layer (IndexedDB)
- **Zero Footprint avaktiverat** som Sacred — ersatt av Draft Layer + frivillig «Rensa enheten»
- **Kill Switch bort** — ensam-boende; shake-to-kill tas bort
- Domänanalys covert narcissism → hub-krav Familj/Arkiv/Capture
- WORM, tre silos, HITL, Mönster, Orkester, Barnfokus, P3 Kanban — **oförändrat låst**

---

## Följer med till main

- [x] `LivShellPage` + `FamiljShellPage` — wrapper med TabBar
- [x] `src/modules/capture/` — DraftQueue, CapturePanel, ReviewQueuePanel
- [x] `navTruth.ts` — 4 drawer-rader + barn-default Familj-shell
- [x] `clearDeviceSession.ts` — frivillig enhetsrensning i Inställningar
- [x] `signOutUser` → `invalidateServerSession()`
- [x] Utökad `heuristicInboxClassify` — ex-/barn-/review-signaler
- [x] Eval-dokument: domän + 4 IA-deep + leveransrapport
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS**

---

## Försvinner

| Vad | Detalj |
|-----|--------|
| Shake-to-Kill | `useShakeToKill.ts` bort från `App.tsx` |
| `executeKillSwitch` / `KILL_SWITCH_EVENT` | Ersatt av `clearDeviceSession` (frivillig) |
| Zero Footprint Sacred | Speglar/Valv auto-wipe vid unmount — ersatt Draft Layer |
| 10+ drawer hub-rader | Collapsed till 4 rader; legacy paths redirectar |
| Kill Switch i `.context/security.md` Sacred-register | PMIR-dokumenterat |

**Molnet/WORM påverkas inte** — `reality_vault`, `children_logs`, `journal` append-only kvar.

---

## Regelanalys

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | U1 tre silos, U3 WORM, U5 orkester | **PASS** — routing oförändrad princip |
| **Design** | locked-ux-features, MENU-DRAWER-KANON | **GAP→fix** — drawer 4 rader, Valv oförändrat |
| **Säkerhet** | security.md uppdateras; firestore.rules **ej berört** | **PASS** |
| **Innehåll U6** | Ingen ny FACT utan register | **PASS** — domän-doc refererar befintlig seed |

**Accepterad risk (ensam-boende):**
- Ingen panik-skaka; lokal utkast persist tills «Rensa enheten» eller utloggning
- Fyren-gate + Valv idle timeout kvar

---

## Smoke (efter merge)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | PASS |
| `npm run smoke:locked-ux` | PASS |
| `npm run smoke:orkester` | PASS |
| `npm run smoke:design-modules` | PASS |

---

## Rekommendation

- [x] Merge till `main` + push `origin` **efter** smoke PASS + användaren godkänner
- [ ] Merge **utan** gren-radering (behåll `feat/superhub-v2` tills verifierat)

---

## Godkännande

**Användaren:** ☐ godkänn merge · ☐ avbryt  
**Datum:** ___________
