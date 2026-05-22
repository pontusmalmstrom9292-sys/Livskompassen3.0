# Inkorg — Gemini Dashboard (funktioner & moduler) — 2026-05-22

**Status:** Funktionskrav **låsta i inkorg** → kanon i [`docs/specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md)  
**Skärmdumpar:** [`artifacts/screenshots-gemini-dashboard-2026-05-22/`](./artifacts/screenshots-gemini-dashboard-2026-05-22/)

---

## Skärmindex

| # | Fil | Innehåll |
|---|-----|----------|
| 01 | `01-dashboard-oversikt.png` | Status 1–5, trötthet, KASAM-läge, flikar, Barnfokus-ingång |
| 02 | `02-kompassrad-dagen.png` | Kompassråd + chips BIFF / JADE / Parallellt föräldraskap |
| 03 | `03-barnfokus-banner.png` | Barnfokus: Den trygga hamnen |
| 04 | `04-barn-profilkort-arvid-kasper.png` | Profilkort + Fokus-rad per barn |
| 05 | `05-minnesankare-lista.png` | Positiva minnesankare + spara |
| 06 | `06-minnesankare-paminnelse.png` | Lista + påminnelse-footer |
| 07 | `07-worm-korsreferens.png` | WORM korsreferens, sök, säkrade poster |
| 08 | `08-worm-nytt-bevis-form.png` | Nytt objektivt bevis → lås i Valvet |
| 09 | `09-paminnelse-dig.png` | Valideringsruta (pappa / kognitiv trötthet) |

---

## Snabb-PASS/GAP mot repo (2026-05-22)

| Krav-ID | Funktion | Repo |
|---------|----------|------|
| F-01 | Kognitiv skala + Safe Mode | GAP (header global) |
| F-02 | Kompassråd dagen | Delvis (`AdaptiveMemoryCards`) |
| F-03 | Flikar Översikt/BIFF/Vagus/Korsref/Barnfokus | GAP som samlad L3 — routes finns spritt |
| F-04 | Barnprofilkort Arvid/Kasper | GAP UI (logg finns) |
| F-05 | Positiva minnesankare | **GAP** (ny datamodell) |
| F-06 | Påminnelse-copy | GAP komponent |
| F-07 | Korsreferens WORM | Delvis Valv + Valv-Chat |
| F-08 | Lås WORM-bevis | Delvis `VaultEntryForm` |

Full spec: **Gemini-Dashboard-FUNKTIONSLOCK.md**.

---

## Behöver du skicka kod?

**Nej** — för att **låsa design och funktion** räcker skärmdumparna + FUNKTIONSLOCK.  
**Arkiverad:** [`artifacts/gemini-dashboard-interactive-App.tsx`](./artifacts/gemini-dashboard-interactive-App.tsx) (3.0, flikar + mock WORM/JADE). Jämför med [`gemini-cognitive-exoskeleton-App.tsx`](./artifacts/gemini-cognitive-exoskeleton-App.tsx).

---

## Relaterad inkorg

- Navigation & första mock: [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)
- Prototyp kod: [`2026-05-22-inkorg-gemini-prototype.md`](./2026-05-22-inkorg-gemini-prototype.md)
