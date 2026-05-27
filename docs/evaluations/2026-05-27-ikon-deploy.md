# Ikon-deploy — B1 + chrome v4 (2026-05-27)

**Masterplan:** `IKON-WIDGET-MASTER.md` · **Smoke:** `npm run smoke:locked-icons` PASS · `npm run smoke:locked-ux` PASS · `npm run build` PASS

---

## Fas 1 — Appikon (B1 Kanon ros)

| Steg | Repo | Enhet (du) |
|------|------|------------|
| `smoke:locked-icons` | PASS — `public/favicon.svg`, B1 PNG finns | — |
| `npm run android:icons` | `mipmap-*/ic_launcher*.png` från `app-icon-b1-kanon-ros-1024.png` | — |
| `npm run build:web && npx cap sync android` | PASS 2026-05-27 — `dist/` + Android assets | Android Studio **Run** |
| Gammal ikon på telefon | — | **Avinstallera** Livskompassen → installera om |
| PWA / Hosting | `favicon.svg` i `dist` | `firebase deploy --only hosting` (vid behov) |
| PWA-hemskärm (iPhone/Mac) | manifest → `/favicon.svg` | Ta bort genväg → **Lägg till på hemskärmen** igen |

**Android README:** uppdaterad till B1-källa (inte `app-icon-livskompassen.png`).

---

## Fas 2 — Appikon 3D?

**Beslut (implementeringspass):** Behåll **flat B1** (prod-låst). v4 **Helros 3D / Eldnål 3D** finns i preview — byt endast om du säger t.ex. `byt in App 2`.

Preview: `docs/design/icons-proposals/2026-05-26-v4-round2-dna/serve-preview.sh` → http://127.0.0.1:8766/preview.html

---

## Fas 3 — Chrome v4 rad 1 (inbyggt)

| Kategori | Asset | Drawer / dock / hero |
|----------|-------|----------------------|
| Familjen | `public/icons/chrome/v4-familjen.svg` | drawer, dock `users` |
| Hamn | `v4-hamn.svg` | drawer, dock `anchor` |
| Valv | `v4-valv.svg` | drawer Valv, dagbok bevis |
| Dagbok | `v4-dagbok.svg` | drawer, dock `book` |
| Planering | `v4-planering.svg` | drawer, dock `calendar` |
| MåBra | `v4-mabra.svg` | drawer, dock `sparkles` |
| Hero orbit | rutiner/ekonomi/utveckling/kunskap | `HeroOrbitIcons.tsx` |

Komponent: `src/modules/core/ui/chromeIcons/ChromeV4Icon.tsx`

---

## Fas 4 — Widget-genvägar (PWA)

| WH | Shortcut-ikon |
|----|----------------|
| WH1 Inspelning | `/icons/shortcuts/wh-inspelning.svg` |
| WH2 Anteckning | `wh-anteckning.svg` |
| WH3 Kompass | `wh-kompass.svg` (B1) |
| WH4 Hamn | `wh-hamn.svg` |
| WH5 Familjen | `wh-familjen.svg` |
| WH6 Stämpel | `wh-stampla.svg` |

Uppdaterat: `public/manifest.webmanifest`

---

## Manuell checklista (skärmdump OK)

- [ ] Android launcher = guld B1 (efter reinstall)
- [ ] Safari/Chrome flik = B1 (ej lila Vite)
- [ ] PWA-hemskärm = B1 (ny genväg)
- [ ] Drawer: Familjen/Hamn/Dagbok/Planering/MåBra/Valv = gulddisk-ikoner
- [ ] Hem-orbit: fyra v4-ikoner

---

## Deferred

- **Hero-orbit större L1** — `header_utan_blur` plan (ej samma som appikon)
- **Dynamiska tid-ikoner K1/K2/K3** — P2
- **Firebase hosting deploy** — kräver ditt OK / credentials
