# Fas 12 — Supermodule UI wave-2 polish

**Datum:** 2026-06-16  
**Kanon:** [`2026-06-16-fas-09-life-os-vision.md`](./2026-06-16-fas-09-life-os-vision.md)

---

## Implementerat (Cursor)

| Ändring | Fil |
|---------|-----|
| Token-baserad hub-chrome | `obsidian-calm-2.css` — `.supermodule-hub-chrome` |
| Familjen chrome → `border-border` | `FamiljenInputSuperModule.tsx` |
| Legacy dashboard diary → länk Hjärtat | `LazyDiary.tsx` |
| Legacy `DagbokSuperModule` arkiverad | `docs/archive/code-legacy-2026-06/` |

---

## Kvar (wave-2b — Theme Lab)

- Aligna `DagbokInputSuperModule`, `EkonomiInputSuperModule`, `PlaneringInputSuperModule` chrome till `.supermodule-hub-chrome`
- Mockup-inspirerad gradient header (subtil, Obsidian Calm)
- Daily focus card på Hem — polish only, ingen route-merge

---

## Smoke

`npm run smoke:locked-ux` · `npm run smoke:design-modules`
