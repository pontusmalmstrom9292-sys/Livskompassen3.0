# Superhub IA-spec — 4 zoner + Arkiv

**Datum:** 2026-06-01  
**Status:** Godkänd för implementation  
**Källor:** PMIR · domän-doc · 4 deep-analyser · [`MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md)

---

## Informationsarkitektur

| Zon | Route | Drawer | Syfte |
|-----|-------|--------|-------|
| Hem — Skriv | `/` | Rad 1 | Global capture, utkast-kö, landning |
| Liv och göra | `/liv` | Rad 2 | Vardag, MåBra, handling, projekt, arbetsliv |
| Familj och gränser | `/familj` | Rad 3 | Barn, Hamn, Drogfrihet — default **barn/reflektion** |
| Inställningar | `/installningar` | Rad 4 | Konto, Device Clear |
| Arkiv (Valv) | `/dagbok?tab=bevis` | Valv-drawer | WORM, Mönster, Orkester, Kunskapsbank — **oförändrat låst** |

---

## Shell-tabbar

### `/liv` — LivShellPage

| Tab | Legacy | Capture |
|-----|--------|---------|
| kompasser | `/vardagen` | — |
| mabra | `/mabra` | ex/konflikt → Speglar guard |
| handling | `/planering?tab=handling` | inkorg dual-write vid konflikt-signaler |
| projekt | `/projekt` | — |
| arbetsliv | `/arbetsliv` | — |

### `/familj` — FamiljShellPage

| Tab | Legacy | Capture |
|-----|--------|---------|
| reflektion | Barnfokus default | — |
| livslogg | Familjen | barnlogg silo |
| tillsammans | Familjen | — |
| barnporten | Barnporten | HITL till Valv |
| hamn | `/hamn` | BIFF + «Sortera till arkiv» |
| drogfrihet | `/drogfrihet` | — |

---

## Capture-pipeline (G10)

**Callable:** `submitInkastLite` · **Frontend:** `submitCaptureDraft` + IndexedDB DraftQueue

| Ingång | sourceModule | Beteende |
|--------|--------------|----------|
| Hem CapturePanel | `hem_capture` | Primär skrivyta |
| Planering inkorg | `planering_inkorg` | Dual-write om sms/mejl + konflikt-heuristik |
| Hamn BIFF (publikt + Valv) | `hamn_biff` | Efter svar / manuell knapp |
| Dagbok snabb | `dagbok_snabb` | Valfri checkbox «Känsligt» — journal + arkiv |

**Routing:** DCAP/heuristik före LLM · confidence &lt; 0,75 → `review` · trauma/LVU → review utan auto-WORM.

---

## Legacy redirects (MUST)

Alla gamla hub-paths → shell + `?tab=` — verifierat i `AppRoutes.tsx` och `smoke:locked-ux`.

---

## Låst UX (oförändrat)

- Barnfokus-frågor · P3 Kanban på handling · Mönster + Orkester separata · Barnporten HITL · tre silos · Fyren-gate

---

## Säkerhet — Draft Layer

Zero Footprint Sacred **ersatt** av Persistent Draft Layer + frivillig «Rensa enheten». Kill Switch bort (ensam-boende). Valv idle timeout kvar.

---

## Referenser

- [`2026-06-01-superhub-liv-deep.md`](2026-06-01-superhub-liv-deep.md)
- [`2026-06-01-superhub-familj-deep.md`](2026-06-01-superhub-familj-deep.md)
- [`2026-06-01-superhub-hem-capture-deep.md`](2026-06-01-superhub-hem-capture-deep.md)
- [`2026-06-01-superhub-arkiv-deep.md`](2026-06-01-superhub-arkiv-deep.md)
- [`2026-06-01-superhub-domän-covert-narcissism.md`](2026-06-01-superhub-domän-covert-narcissism.md)
