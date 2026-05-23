# Visuell Estetik och Designspråk

**Canonical:** [`docs/specs/design-master.md`](../docs/specs/design-master.md) — **Obsidian Calm** (bas) + **Riktning B** (hub/kluster, 2026-05-23)

## Estetik

- Mörk obsidian-bas (`#020617` → `#0f172a`), lågaffektiv
- Accents: Tactical Amber `#FDE68A`, Electric Indigo `#818CF8`, Cyber Emerald `#2DD4BF`
- **Hub/kluster (B):** varmtonade kortytor per tone (`gold` / `indigo` / `lavender` / `emerald`), ikonplattor med gradient, subtil hörnglow — se `CLUSTER_TILE` i `tokens.ts`
- **Övriga ytor (A):** glass cards `border-white/10`, `bg-[#0f172a]/60`
- Typografi: **Outfit** (rubriker), **Inter** (bröd)
- Progressive disclosure — ett steg i taget

## Centrala Element

- **Kompis Avatar:** pulserande aura (viloläge), definierad struktur vid analys
- **Tidshjulet:** flerlagrad tidslinje för Minne
- **Sub-Synaptisk Bakgrund:** WebGL/Canvas (`SubSynapticBackground.tsx`) — bakom innehåll, inte på kontroller
- **Modulhub / hem-scroll / kompass-satelliter:** Riktning B (ADR `docs/decisions/ADR-design-riktning-B-varmare-mork.md`)

## Tailwind / CSS

- Tokens: `DESIGN`, `CLUSTER_TILE` i `src/modules/core/ui/tokens.ts`
- CSS: `:root` + `--tile-*` i `src/index.css`
- Geometry: `rounded-2xl`, pills, soft cards

## Förbjudet

Nature themes, lila/turkos/regnbåge, ljusa bakgrunder, count-up på siffror, sensorisk noise, 5-ikon Shield-dock som L1.

## Modul-specifikt

- **Det yttre lugnet (Lager 1):** varm, helande — ingen forensisk copy; se [`docs/specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../docs/specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md)
- **Det inre försvaret (Lager 2 / Valv):** kall struktur, guld/emerald för fakta — Orkestern-panel Obsidian Calm (G19); Valv-sidor ej omstylda i B-fas 1
- **Speglar:** Electric Indigo `#6366F1` för AI-ytor
- **Barnen:** `#818CF8` + `#FDE68A`
