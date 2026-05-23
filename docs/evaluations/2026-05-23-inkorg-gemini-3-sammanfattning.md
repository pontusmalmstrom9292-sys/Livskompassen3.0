# Inkorg — Gemini Livskompassen 3.0 (sammanfattning + kod)

**Datum:** 2026-05-22 (insamlad 2026-05-23)  
**Källa:** Användare / annan Gemini-chatt (Preview-dashboard) · transcript `c7586bb5`  
**Status:** Krav **bekräftade** mot skärmdumpar + [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md)  
**Kod:** [`artifacts/gemini-dashboard-interactive-App.tsx`](./artifacts/gemini-dashboard-interactive-App.tsx) (arkiverad från chatt L75)

---

## Gemini “Nyheter i Livskompassen 3.0” (råtext)

1. **Interaktiv BIFF-Triage & Realtids-JADE-analysator** — skriv eget svar; varning vid JADE (förklara, försvara, argumentera); lågaffektiv feedback.
2. **Uppgraderad Vagus-Andningscoach** — flytande andningsring; tidsstyrning in/håll/ut; snabbval för fysiologisk reglering.
3. **Korsreferens-motor med “Gaslighting-Sköld”** — sök minneskategorier; WORM-bevis + historik; “Verklighetskontroll bekräftad”.
4. **Ny modul “Barnfokus: Trygga hamnen”** — Arvid & Kasper; positiva minnesankare; vardagsögonblick; stabil motpol.
5. **Kognitiv batteri- & KASAM-status** — enkelt reglage; kravlösa tips efter dagsform.

**Design (Gemini, ej låst):** “taktiskt mörkt rymdtema / exoskelett” → i repo: **Obsidian Calm** (`design-master.md`).

---

## Mappning → låsta krav (F-01–F-08)

| Gemini # | Funktion | Låst ID | Repo-mål |
|----------|----------|---------|------------|
| 1 | BIFF + JADE realtid | F-03 (BIFF-flik), **ny F-09** | `/hamn` + klient JADE; DCAP backend |
| 2 | Vagus coach | F-03 (Vagus-flik) | `/mabra` `BreathingExercise` — faser in/håll/ut |
| 3 | Korsreferens + gaslighting-sköld | F-07 | Valv + `reality_vault`; ev. `children_logs` silo-säkert |
| 4 | Barnfokus + minnesankare | F-04, F-05, F-06 | `/familjen` — **ny** ankare ≠ WORM |
| 5 | Kognitiv batteri + KASAM | F-01, F-02 | Hem/header + `KasamEvening` / adaptiva kort |

**F-09 (tillagt 2026-05-22):** Realtids-JADE i **eget svar** (textarea), samma mönster som mock men kopplat till Hamn/Speglar L3 — regex eller lättviktsguard + valfri DCAP-hint; **ingen** auto-skick till ex.

---

## Två Gemini-källor (kod)

| Artefakt | Innehåll | Fil |
|----------|----------|-----|
| **A** | Första mock (Horizon, dock, flikar `biff`/`valvet`/…) | [`gemini-cognitive-exoskeleton-App.tsx`](./artifacts/gemini-cognitive-exoskeleton-App.tsx) |
| **B** | Interaktiv dashboard 3.0 (Preview) | [`gemini-dashboard-interactive-App.tsx`](./artifacts/gemini-dashboard-interactive-App.tsx) |

Vid inkommande kod: diff A vs B, plocka **beteende** (timers, JADE, ankare) — integrera i moduler, **inte** ny monolit i `src/`.

---

## Vad som redan är säkrat utan ny kod

- 9 skärmdumpar: [`screenshots-gemini-dashboard-2026-05-22/`](./artifacts/screenshots-gemini-dashboard-2026-05-22/)
- Funktionslås: [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md)
- Navigation: repo **Variant C** (extern “Variant A”) — se [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)

---

## Bygg (efter analys)

Bygg i separat chatt med prompt i [`2026-05-22-inkorg-gemini-dashboard-funktioner.md`](./2026-05-22-inkorg-gemini-dashboard-funktioner.md) + FUNKTIONSLOCK — **inte** före `kör UX-inkorg-analys`.
