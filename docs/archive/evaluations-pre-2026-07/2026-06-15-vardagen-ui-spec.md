# Vardagen — UI SPEC (B4)

**Datum:** 2026-06-15  
**Status:** Implementerad (launcher inline)  
**Route:** `/vardagen` · subroutes `/mabra`, `/planering`, …

---

## Mål

Enhetlig Obsidian Calm på Vardagen-hub. Inline kompass/ekonomi i `calm-card` + gold glow.

---

## Ändringar (Cursor)

| Fil | Ändring |
|-----|---------|
| `LivLauncherPage.tsx` | `BentoCard` `glow="gold"` runt inline kompass + ekonomi |

---

## Oförändrat (redan calm)

- `MabraInputSuperModule` — `calm-card glow-bottom-green`
- `PlaneringPage` — hybrid P3 locked
- `EkonomiInputSuperModule` — egen superhub

---

## Smoke

`npm run smoke:locked-ux` · `npm run smoke:design-modules`
