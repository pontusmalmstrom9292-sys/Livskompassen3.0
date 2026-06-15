# Hjärtat — UI SPEC (B2)

**Datum:** 2026-06-15  
**Status:** Implementerad  
**Route:** `/hjartat` · `?tab=reflektion|speglar` · `?inputMode=`

---

## Mål

En supermodul-känsla: reflektion, snabb spegling, minneslista — utan sidbyte. Obsidian Calm gold-glow (Hjärtat-silo).

---

## Ändringar (Cursor)

| Fil | Ändring |
|-----|---------|
| `DagbokInputSuperModule.tsx` | `valv-forensic-header`, pill-lägesväljare, `calm-scroll-island` |
| `DagbokInputModePicker.tsx` | Ny — samma mönster som Valv/Familjen |
| `HjartatBentoShell` | Oförändrad wrapper |
| `SpeglarSuperModule` | Oförändrad (separat flik) |

---

## Locked

- Ingen Valv-logik på Hjärtat
- Journal WORM via befintliga delegates

---

## Smoke

`npm run smoke:locked-ux` · `npm run build`
