# Hub-analys: Trygghet (Trygg hamn · Drogfrihet)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/hamn`, `/drogfrihet`, Inställningar drogfrihet-flik

---

## Syfte & route

**Trygghet**-kategorin i `tabRegistry.ts` (rad 48–57, 78–79) omfattar två drawer-hubbar:

| Hub | Route | Flikar |
|-----|-------|--------|
| Trygg hamn | `/hamn` | `oversikt`, `biff`, `speglar`, `barn` |
| Drogfrihet | `/drogfrihet` | `idag`, `resurser`, `reflektion`, `kunskap` |

Känslig **Hamn-analys** och risk-forensik → Valv (`hamn_analys`). Drogfrihet **nollställning** endast Inställningar (`DrogfrihetHubPage` 29, `InstallningarPage` drogfrihet-flik).

Nav: `navTruth.ts` 289–391.

---

## Användarresa ×3

### 1. BIFF-svar på ex-meddelande
Hamn → default **BIFF** (`useHubTab` defaultTab `biff`, `TryggHamnHub` 17) → klistra in text → `BiffPublicPanel`. Zero Footprint vid unmount (`SafeHarborPage` 9–12). Prefill via route state `prefilledMessage`.

### 2. Drogfrihet — idag
Drogfrihet → **Idag** → `DrogfrihetCounterBadge` + dagkort från `pickDrogfrihetIdag` (`DrogfrihetHubPage` 37–49). Statisk fakta i **kunskap**-flik — ingen live Kunskapsvalv-RAG (rad 96–99).

### 3. Hamn analys i Valv
Legacy `?tab=analys` på Hamn redirectar till Valv (`TryggHamnHub` 20–25). Grey Rock publikt; djup analys bakom Fyren.

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| BIFF publikt | Hamn D6 | `BiffPublicPanel`, `SafeHarborPage` 19–21 | ✅ |
| Analys ej publik | Valv forensik | `TryggHamnHub` Navigate analys | ✅ |
| Hamn speglar/barn → länkar | Separation ex/barn | Link till Dagbok/Familjen 44–62 | ✅ |
| Drogfrihet utan gamification | Produkt | inga streak/XP i hub copy | ✅ |
| Nollställ räknare | Inställningar only | `DrogfrihetCounterSettings` | ✅ |
| U6 kunskap statisk | FACT seed | `DROGFRIHET_FACTS` | ✅ |

---

## Navigationsproblem

1. **Hamn flikar speglar/barn** är mostly redirect-länkar — kan kännas som “tomma” flikar.
2. **Drogfrihet dubbel “Stöd”** — `resurser` label “Stöd” och `kunskap` “Stöd & resurser” (`navTruth` 369–390) — namnkollision.
3. **Trygg hamn vs Hamn** — drawer “Trygg hamn”, header “Gränser & BIFF” (`SafeHarborPage` 18–19).
4. **Theme delad MåBra-lavendel** på Drogfrihet (`navTruth` 358) — kan blanda med Vit-zon känsla.

---

## Locked UX

| Feature | Notering |
|---------|----------|
| Grey Rock / BIFF | Sacred kommunikationsstöd |
| Zero Footprint Hamn | `SafeHarborPage` unmount |
| Ex/konflikt → Hamn not MåBra bank | `mabraCoachGuard` (backend) |
| Drogfrihet disclaimer | `DROGFRIHET_DISCLAIMER` |

---

## Smoke

| Script | Relevans |
|--------|----------|
| `npm run smoke:locked-ux` | Hamn paths, widget hamn |
| `npm run smoke:innehall` | U6 — ej FACT i MåBra för drog |
| `npm run build` | trygghet moduler |

---

## Ombyggnadsidéer P1–P3

**P1:** Döp om Drogfrihet-flikar: `resurser` → “Kontakter”, `kunskap` → “Fakta”.  
**P2:** Hamn: slå ihop speglar-flik med tydlig inline ACT (minimize hopp till Dagbok).  
**P3:** Gemensam “Trygghet” landing med två kort (Hamn / Drogfrihet) — endast om drawer-konsolidering godkänns.

---

## diff-scope

| Område | Filer |
|--------|-------|
| Hamn | `SafeHarborPage.tsx`, `TryggHamnHub.tsx`, `BiffPublicPanel.tsx` |
| Drogfrihet | `DrogfrihetHubPage.tsx`, `drogfrihetCatalog`, `DrogfrihetCounterSettings` |
| Valv forensik | `hamn_analys` i `VaultForensicPanel` |
| Nav | `navTruth.ts`, `tabRegistry.ts` HUB_TAB_CATEGORY |
| Inställningar | `InstallningarPage.tsx` drogfrihet tab |

**Ej scope:** Kunskapsvalv live RAG (Valv kunskapsbank).
