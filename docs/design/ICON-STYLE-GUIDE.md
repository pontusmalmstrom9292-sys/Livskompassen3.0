# Ikonstil — Premium Helros (kanon från 2026-05-26)

**Låsta produktikoner:** [`.context/locked-icons.md`](../../.context/locked-icons.md) (B1 · D1 · M3)  
**Väntar val:** [`icons-proposals/2026-05-26-remaining/`](./icons-proposals/2026-05-26-remaining/)

## Referensbilder

| | |
|---|---|
| Hem-kompass | `docs/design/galleri/KOMPASS-LOCKED-kanon.png` |
| Låst trio | `docs/design/icons-proposals/2026-05-26-v2-premium/` |

## Visuellt språk

| Element | Värde |
|---------|--------|
| Disk / bakgrund | Radial `#1e3a35` → `#030606` eller `#141210` → `#080808` |
| Metall | Linear guld `#f5e6b8` → `#d4af37` → `#8a6b1a` |
| Eld / aktiv | `#fff3c4` → `#e8a020` / `#ffb74d` |
| Glöd | `feGaussianBlur` 1–6px, vit-guld prick |
| Ringar | Dubbel: solid + `stroke-dasharray` |
| Geometri | 8-spets ros, sacred linjer 45°, stjärna nordost |
| Storlek UI | 24×24 (meny/dock), 32×32 (hero-orbit), 48×48 (mark), 512 app |

## Nivåer

| Nivå | Användning | Detalj |
|------|------------|--------|
| **L3** | Appikon B1 | Full ros, ringar, stjärnglöd |
| **L2** | D1, M3, Valv, hub-ikoner | Disk + guld + 1 accent |
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
4. Inte samma form som låst B1/D1/M3 (ingen förvirring)?

## Förbjudet utan beslut

- Vite-lila / generisk SPA-favicon
- Rena Lucide-hubbar (Compass, Users) i drawer/dock när premium-ersättare finns
- Flat enfärg utan disk (utom loader/chevron)
