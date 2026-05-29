# Ikonstil — Premium Helros (kanon från 2026-05-26)

**Låsta produktikoner:** [`.context/locked-icons.md`](../../.context/locked-icons.md) (D1 · M2). **App-ikon upplåst** — [`phone-icon-variants/PREVIEW.md`](./themes/phone-icon-variants/PREVIEW.md)  
**Chrome (meny/dock/hero):** [`icons-proposals/2026-05-26-v4-round2-dna/`](./icons-proposals/2026-05-26-v4-round2-dna/) — 10×10 kategorier, D1-skiva + unik glyph. `npm run icons:proposals-v4`  
**v3 (5 stilar):** [`icons-proposals/2026-05-26-v3-chassis/`](./icons-proposals/2026-05-26-v3-chassis/)  
**Äldre:** [`icons-proposals/2026-05-26-remaining/`](./icons-proposals/2026-05-26-remaining/) (3 varianter)

## Referensbilder

| | |
|---|---|
| Hem-kompass | `docs/design/galleri/KOMPASS-LOCKED-kanon.png` |
| Låst trio | `docs/design/icons-proposals/2026-05-26-v2-premium/` |

## Visuellt språk

| Element | Värde |
|---------|--------|
| Disk / bakgrund | **D1-låst:** `#3d3420` → `#141210` → `#080808`; alternativ teal-kant `#1e3a35` |
| Metall | Linear guld `#f5e6b8` → `#d4af37` → `#8a6b1a` |
| Eld / aktiv | `#fff3c4` → `#e8a020` / `#ffb74d` |
| Glöd | `feGaussianBlur` 1–6px, vit-guld prick |
| Ringar | Dubbel: solid + `stroke-dasharray` |
| Geometri | 8-spets ros, sacred linjer 45°, stjärna nordost |
| Storlek UI | 24×24 (meny/dock), 32×32 (hero-orbit), 48×48 (mark), 512 app |

## Nivåer

| Nivå | Användning | Detalj |
|------|------------|--------|
| **L3** | Appikon (telefon/PWA) | P1–P5 kompassvarianter — ej B1 Kanon ros som mall |
| **Android** | PNG 1024 | `npm run android:icons:phone -- <png>` → `mipmap-*/ic_launcher*.png` |
| **L2** | D1, M2, Valv, hub-ikoner | Disk + guld + 1 accent |
| **L1** | Hero-orbit, små submenyer | Förenklad emboss, `currentColor` + disk valfritt |

## Teknik (React)

- SVG i `src/modules/core/ui/` eller modul-`components/`.
- Unika gradient-`id` via `useId()` när samma sida har flera instanser.
- `aria-hidden` på dekoration; `aria-label` på interaktiv knapp runt ikon.
- Lucide endast för **tillfälliga** states (laddar, chevron, stäng) — inte hub-chrome.

## Färger per hub (Pack J)

Hub-ikoner kan ta **disk-tint** från hub (teal Familjen, hamn-guld, etc.) men behåll **guldlinje** — se [`COLOR-POLICY.md`](./COLOR-POLICY.md).

## Checklista ny ikon

1. Matchar L2/L3-tabellen ovan?
2. Fungerar på 24px (testa i `preview.html`)?
3. Registrerad i [`theme-lab/ICON-DECISIONS.md`](./theme-lab/ICON-DECISIONS.md)?
4. Inte samma form som låst D1/M2 (ingen förvirring)?

## Förbjudet utan beslut

- Vite-lila / generisk SPA-favicon
- Rena Lucide-hubbar (Compass, Users) i drawer/dock när premium-ersättare finns
- Flat enfärg utan disk (utom loader/chevron)
