# Modulväljare rollout — klart (2026-06-06)

**Scope:** `ExamplePreviewCard` + första-besök-väljare i 6 zoner (additivt, locked UX orörd).

---

## Zoner live

| Zon | Route / ingång | Komponent | localStorage-nyckel |
|-----|----------------|-----------|---------------------|
| Planering | `/planering?tab=start`, första Handling | `GoraModulValjare` | `lk_gora_modulvaljare_seen_v1` |
| Ekonomi | `/vardagen?tab=ekonomi` | `EkonomiModulValjare` | `lk_ekonomi_modulvaljare_seen_v1` |
| Liv launcher | `/liv` — mini-previews på kort | `LIV_LAUNCHER_PREVIEWS` | — (alltid synlig) |
| Hem Capture | Hem → `CaptureSuperModule` hem-capture | `HemCaptureModulValjare` | `lk_hem_capture_modulvaljare_seen_v1` |
| MåBra hub | `/mabra` step=hub | `MabraModulValjare` | `lk_mabra_modulvaljare_seen_v1` |
| Projekt tom | `/projekt` utan projekt | `ProjektTomStatePanel` | — |
| Valv zon | Efter PIN, första session | `ValvZoneModulValjare` | `lk_valv_zone_modulvaljare_seen_v1` |

**Shared:** [`src/modules/shared/ui/ExamplePreviewCard.tsx`](../../src/modules/shared/ui/ExamplePreviewCard.tsx)

**«Öppna väljare igen»:** Ekonomi (`LayoutGrid`), MåBra/Hem (`Byt ingång`), Valv (`Byt zon`).

---

## Test i prod

Hard refresh: **Cmd+Shift+R** · [gen-lang-client-0481875058.web.app](https://gen-lang-client-0481875058.web.app)

Rensa nyckel i DevTools → Application → localStorage för att simulera första besök.

| URL | Förväntat |
|-----|-----------|
| `/planering?tab=start` | GoraModulValjare |
| `/vardagen?tab=ekonomi` | 4 ekonomikort |
| `/liv` | Preview under varje launcher-kort |
| `/` (inloggad, home_inkast) | 3 capture-kort |
| `/mabra` | 4 hub-kort |
| `/projekt` (tom lista) | 4 projekt-exempel |
| `/dagbok?tab=bevis` + PIN | 5 zon-kort första gången |

---

## Smoke

```bash
npm run smoke:modulvaljare
npm run smoke:design-modules
npm run smoke:locked-ux
npm run smoke:rollout
```

---

## Rör inte (locked)

- `GoraHubTabBar`, P3 Kanban, hybrid `/projekt`
- Valv `vaultTab=monster|orkester|kunskapsbank|aktorskarta`
- Barnfokus-frågor före frågekort
- Drawer Vardag/Valv, Fyren widget, Dagbok tab-struktur

---

## Hardening (samma dag)

- [`scripts/smoke_modulvaljare.mjs`](../../scripts/smoke_modulvaljare.mjs) — statiska guards
- Ingår i `npm run smoke:rollout`
