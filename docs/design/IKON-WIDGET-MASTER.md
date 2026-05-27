# Ikon & widget — master (kanon)

**Senast:** 2026-05-27 · **Deploy-checklista:** [`evaluations/2026-05-27-ikon-deploy.md`](../evaluations/2026-05-27-ikon-deploy.md)

---

## Prod-låst trio (MUST NOT utan «byt in»)

| ID | Roll | Fil |
|----|------|-----|
| **B1** | App / PWA / favicon / Android | `public/favicon.svg` · `docs/design/themes/app-icon-b1-kanon-ros-1024.png` |
| **D1** | Kompass UI | `src/modules/core/ui/LivskompassMark.tsx` |
| **M2** | Kompis | `src/modules/kompis/components/KompisMark.tsx` |

Register: [`.context/locked-icons.md`](../../.context/locked-icons.md) · smoke: `npm run smoke:locked-icons`

---

## Genererade förslag (preview)

| Batch | URL / kommando |
|-------|----------------|
| **v4 (130 SVG, 3D-varianter)** | `cd docs/design/icons-proposals/2026-05-26-v4-round2-dna && ./serve-preview.sh` → http://127.0.0.1:8766/preview.html · `npm run icons:proposals-v4` |
| v3 chassis (50) | `…/2026-05-26-v3-chassis/preview.html` |
| v2 premium (B1/D1/M*) | `…/2026-05-26-v2-premium/preview.html` |
| legacy remaining | port 8765 · `serve-preview.sh` |

**In-app 3D (CSS):** Fyren-handtag, PinGate, header `VITE_HEADER_PANEL_STYLE` — redan på `main`, ej samma som hemskärms-3D-SVG.

---

## Implementerat i app (v4 rad 1)

- **Chrome:** `public/icons/chrome/v4-*.svg` + `ChromeV4Icon.tsx`
- **Drawer:** Familjen, Hamn, Dagbok, Planering, MåBra, Valv (huvud)
- **Dock / hub-kontext:** users, anchor, book, calendar, sparkles
- **Hero-orbit:** rutiner, ekonomi, utveckling, kunskap

Beslutlogg: [`theme-lab/ICON-DECISIONS.md`](./theme-lab/ICON-DECISIONS.md)

---

## Widgets

| Spec | Fil |
|------|-----|
| In-app Fyren | [`WIDGET-BAR-SPEC.md`](./WIDGET-BAR-SPEC.md) · `FyrenSmartWidgetBar.tsx` |
| PWA hemskärm WH1–6 | [`HOMESCREEN-WIDGETS-SPEC.md`](./HOMESCREEN-WIDGETS-SPEC.md) · `manifest.webmanifest` shortcuts |
| Android native | [`ANDROID-WIDGETS-SPEC.md`](./ANDROID-WIDGETS-SPEC.md) · [`BUILD-ANDROID-WIDGETS-SV.md`](./BUILD-ANDROID-WIDGETS-SV.md) |

Shortcut-ikoner: `public/icons/shortcuts/wh-*.svg`

**Fyren in-app strip:** `FyrenWidgetBar.tsx` använder samma shortcut-SVG (WH1) + `ChromeV4Icon` (dagbok, planering, valv) som manifest/drawer — se [`evaluations/2026-05-27-ikon-deploy.md`](../evaluations/2026-05-27-ikon-deploy.md) Fas 4.

---

## Kommandon

```bash
npm run smoke:locked-icons
npm run android:icons          # B1 → mipmap
npm run build:web && npx cap sync android
npm run icons:proposals-v4     # endast om generator ändrats
```

---

## Cursor-planer (status)

| Plan | Status |
|------|--------|
| rätta_v4_b1-dna | completed |
| orkester_backlog-plans | completed |
| tema_i_smart_widget | completed |
| widget_autopilot_vs_godkännande | completed |
| hub-kontextrad_4_knappar | completed (W4) |
| öppna_planer_master | completed |
| **header_utan_blur** | **deferred** — större hero-orbit / L1-SVG (ej blockerar B1-deploy) |

Orkester backlog: [`ORKESTER-BACKLOG-PLANS.md`](../ORKESTER-BACKLOG-PLANS.md) Fas B = valfri `icons:proposals-v4`.
