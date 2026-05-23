# Inkorg — Valv-chatt UX (målbild · befintlig funktion)

**Status:** **Analyserad** — F-V13 **behålls** (bild 23 + KompisChat låsta)  
**Datum:** 2026-05-23 (korrigerad: ej separat Kompis-chatt)  
**Källa:** Användare — skärmdump = **hur Valv-chatt ska kännas**, inte ny hem-Kompis  
**Skärmdump (låst):** [`artifacts/screenshots-inkorg-2026-05-23/23-valv-chatt-ux-referens.png`](./artifacts/screenshots-inkorg-2026-05-23/23-valv-chatt-ux-referens.png)  
**Kod (låst par):** [`artifacts/gemini-kompis-chat-KompisChat.tsx`](./artifacts/gemini-kompis-chat-KompisChat.tsx) · [`gemini-kompis-chat-types.ts`](./artifacts/gemini-kompis-chat-types.ts)

> Filnamnet *KompisChat* kommer från mocken. **Placering i produkt:** Valv-chatt bakom skölden — samma UX som bilden, inte ny hem-route.

---

## Användarens intent (korrigerad)

> Vi har redan **Valv-chatt**. Så här ska den fungera: jag **klistrar in text** eller **frågar om arkivet** (eller vad som helst) → får **svar utifrån den information systemet har** (WORM-bevis, arkiv), m.m.

**Ej:** Ny fullskärms **Kompis** på `/` (yttre lugnet).  
**Ja:** UX-uppgradering av **`ValvChatPanel`** under upplåst Valv (`/dagbok?tab=bevis` → flik **Sök**), bakom Fyren.

---

## Runtime idag (PASS — beteende finns)

| Del | Bevis |
|-----|-------|
| Callable | `valvChatQuery` — `src/modules/valv_chatt/api/valvChatService.ts:15-20` |
| Endast Valv-silo | `reality_vault` — se [`2026-05-22-modul-valv_chatt.md`](./2026-05-22-modul-valv_chatt.md) |
| Zero Footprint session | `useValvChatSession.ts` — rensas när `active` false |
| Inbäddad i Valv | `VaultPage.tsx` → `ValvChatPanel` |
| Agent | Sannings-Analytikern (strikt JSON + källor) |

---

## Skärmdump = mål-UX (GAP mot nuvarande UI)

| Mock (referens) | Repo idag (`ValvChatPanel.tsx`) |
|-----------------|----------------------------------|
| Chatt-tråd med bubblor | Textarea + knapp **Sök** |
| *Skriv till Kompis…* | Placeholder juridisk fråga |
| Hälsning / dialog | En fråga → ett svar-block |
| Kompis-varumärke i Valv | Titel **Sök i Valvet** — neutral copy |

**Design (mock):** lila Kompis-header — **ej låst**; kanon Obsidian Calm i Valv.

---

## Utkast funktionslås (F-V13 — Valv-chatt utökad)

| ID | Krav | Detalj |
|----|------|--------|
| F-V13.1 | Gate | Endast upplåst Valv (Fyren + PIN) — oförändrat |
| F-V13.2 | Input | Fri text: klistra in meddelande **eller** ställ fråga om arkivet |
| F-V13.3 | Svar | Baserat **endast** på `reality_vault` (+ ev. uppladdad kontext i samma session) — **MUST NOT** Kunskapsvalvet-RAG |
| F-V13.4 | Källor | Behåll/visa citations (datum, docId, utdrag) — redan PASS |
| F-V13.5 | UX | Chatt-lik dialog (bubblor, tidsstämpel) — mock `23-valv-chatt-ux-referens.png` |
| F-V13.6 | Persona | Lågaffektiv guide (Kompis-ton **eller** Sannings-Analytikern — specialist väljer copy, inte två agenter i samma svar) |
| F-V13.7 | Zero Footprint | Session nollställs vid lås/byte flik — befintlig hook |
| F-V13.8 | DCAP | Frågor via befintlig callable-kedja före LLM där DCAP gäller |

---

## Snabb GAP

| Område | Label |
|--------|-------|
| Backend `valvChatQuery` | **PASS** |
| Chatt-UI + inklistra text | **GAP** (F-V13.5) |
| Mock `KompisChat.tsx` | Ej i `src/` | **GAP** (artifact + bild 23) |
| Svar på inklistad text (triage) | **GAP** — ev. koppling BIFF/Brusfilter **inuti Valv**, inte ny `/hamn` |

---

## Relaterat

- [`2026-05-22-modul-valv_chatt.md`](./2026-05-22-modul-valv_chatt.md)  
- BIFF i Valv: [`2026-05-23-inkorg-biff-detektor-valvet.md`](./2026-05-23-inkorg-biff-detektor-valvet.md) (separat flöde)  
- **Borttagen felklassning:** ~~`2026-05-23-inkorg-kompis-chatt.md`~~ → ersatt av denna fil

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll låst par** | Bild 23 + `gemini-kompis-chat-KompisChat.tsx` |
| **PASS** | `valvChatQuery`, citations, Zero Footprint — se § Runtime |
| **GAP** | Chatt-tråd-UI — porta mock → `ValvChatPanel.tsx` |
| **Ej** | Ny `/kompis`-route |

**Nästa:** P0 #1 i analys — störst ROI (backend klart).
