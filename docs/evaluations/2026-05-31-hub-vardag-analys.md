# Hub-analys: Vardag (Vardagen · MåBra)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/vardagen`, `/mabra`, legacy redirects

---

## Syfte & route

**Vardagen** = daglig struktur (kompasser + privat ekonomi). **MåBra** = återhämtning/utvecklingszon Vit (REFLECTION/PLAY, U6) — **ingen** cross-RAG till Kunskap.

| Hub | Route | Flikar / innehåll |
|-----|-------|-------------------|
| Vardag | `/vardagen` | `kompasser` (default), `ekonomi` |
| MåBra | `/mabra` | symptom-hub, Vit-projekt, övningar (ingen TabBar) |

Legacy: `/kompasser`, `/ekonomi` → redirect (`AppRoutes.tsx` 69–79). Publik kunskap **förbjuden** — legacy `?tab=kunskap` redirectar till Valv (`VardagenPage` 20–30).

Nav: `navTruth.ts` 117–149.

---

## Användarresa ×3

### 1. Morgonkompass
Vardagen → **Kompasser** → `DashboardPage` med tidsstyrd default-filter (`VardagenPage` 35–38, `getDefaultCompassByTime`). Material pack shortcuts via `useLifeHubPreset`.

### 2. Privat ekonomi
Flik **Ekonomi** → `EconomyPage` embedded. Arbetsliv-lön/pekare finns i separat hub (`ArbetslivHubPage` 66–77 länkar tillbaka hit).

### 3. MåBra akut → dagbok-brygga
MåBra → välj symptom-hub → övning eller Vit-projekt. Lågenergi kan deep-linka till Dagbok med `?from=mabra&energy=low` (`DagbokPage` 45–49). Innehåll från `Mabra-CONTENT-BANK` (U6).

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| Inga publika Kunskap-flikar | MENU-DRAWER + U6 | `VardagenPage` legacy redirect kunskap | ✅ |
| Två Vardagen-flikar | Kanon drawer | `navTruth` 126–140, `TabBar` i `VardagenPage` 51 | ✅ |
| MåBra fristående hub | Ej i Vardagen-tab | `/mabra` egen route, `MabraPage` | ✅ |
| Vit ≠ kampspar ingest | U6 | MåBra sparar `mabra_*`, ingen auto kampspar | ✅ |
| Theme J | moduleThemeMap | `themeId: J-vardagen-orbit`, `J-mabra-lavendel` | ✅ |

---

## Navigationsproblem

1. **MåBra utan hub-TabBar** — drawer visar bara “MåBra”; all navigation är intern state (`MabraPage` step/hub) — svår att deep-linka utom `?vitProject=`.
2. **Namn “Vardag” vs “Vardagen”** — label drawer “Vardag”, sidtitel “Vardagen” (`navTruth` 117 vs `VardagenPage` 47).
3. **Ekonomi vs Arbetsliv** — användare kan blanda jobb-lön (Arbetsliv/Valv) med veckopeng (Vardagen); mitigations finns i copy men inte i nav.
4. **Kompassfilter i global store** — byte av flik sätter filter (`setCompassFilter`); oväntat om användaren återvänder från annan modul.

---

## Locked UX

| Feature | Notering |
|---------|----------|
| Ingen publik Kunskap | `locked-ux-features.mdc` — Kunskap bakom Valv |
| MåBra-bank innehåll | U6 — ej gamification i prod utan bank |
| Morgonkompass / kompasser | Sacred feature (context) |
| Material pack shortcuts | `MaterialPackShortcuts` på hubbar |

---

## Smoke

| Script | Relevans |
|--------|----------|
| `npm run smoke:innehall` | U6 MåBra routing |
| `npm run smoke:locked-ux` | ingen `/vardagen?tab=kunskap` |
| `npm run smoke:design-modules` | navTruth themeId |

---

## Ombyggnadsidéer P1–P3

**P1:** Harmoniera “Vardag”/“Vardagen” i drawer vs sidhuvud.  
**P2:** MåBra: en minimal TabBar (Akut · Vit · Verktyg) mappad till `navTruth` utan fjärde silo.  
**P3:** Tydlig “ekonomi-typ” badge (privat vs jobb) vid första besök.

---

## diff-scope

| Område | Filer |
|--------|-------|
| Vardagen | `VardagenPage.tsx`, `DashboardPage.tsx`, `EconomyPage.tsx` |
| MåBra | `MabraPage.tsx`, `MabraVitHub.tsx`, `mabraHubRegistry` |
| Nav | `navTruth.ts`, `tabRegistry.ts` |
| Bridge | `DagbokPage.tsx`, `mabraBridge` constants |
| Innehåll | `Mabra-CONTENT-BANK.md` (ej kod utan dirigent) |
