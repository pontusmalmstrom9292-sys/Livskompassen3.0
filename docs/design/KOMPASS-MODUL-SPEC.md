# Kompasser — avlånga moduler (Hem + Hamn)

**Beslut 2026-05-23** · Tema: nordisk skymning, **2px mjuka guldkanter**, tydliga linjer utan hård kant.

---

## Princip

| Gammalt | Nytt |
|--------|------|
| En stor glass-hub som fyller skärmen | **Tre separata avlånga moduler** (Morgon · Dag · Kväll) |
| Chip-rad + panel i samma låda | Varje kompass = **egen rad**; expanderar **endast den du trycker** |
| Hela Hamn = ett BentoCard | Hamn = **moduler staplade** (Kompassråd · BIFF · laddning) |

---

## Modul (CSS: `.elongated-module`)

```
┌─────────────────────────────────────────────┐
│ ○  Morgonkompass          ● aktiv    ⌄    │
│    Ett mikrosteg för lugn start…           │
├─────────────────────────────────────────────┤  ← expanderad
│    [fråga + val + Spara]                     │
└─────────────────────────────────────────────┘
```

- **Höjd collapsed:** ~56–64px (ikon + titel + en rad lead)
- **Kant:** `1.5px solid rgba(212,175,55,0.28)` — mjuk, inte skarp box
- **Radius:** `14px` (`rounded-[0.875rem]`)
- **Aktiv tidskompass:** diskret prick `●` + lätt guldglöd (inte hela skärmen)
- **Kompass-ikon i modul:** liten (20px), **inte** stor hero-disc på Hem

---

## Hem (`/`)

| Zon | Innehåll |
|-----|----------|
| 1 | `CompassModuleStrip` — 3 kompassmoduler |
| 2 | Snabbmoduler (avlånga): Dagbok · Uppgift · Frågesport · Lucka |
| 3 | `AdaptiveMemoryCards` — oförändrat under |

Kod: `HomeCompassModules.tsx`, `HomeActionHub.tsx`, `CompassModuleStrip.tsx`.

---

## Hamn (`/hamn`)

| Modul | Innehåll |
|-------|----------|
| **Kompassråd** | Kort råd från aktiv tidskompass + länk expandera |
| **BIFF** | Befintlig analys i egen avlång modul |
| **Laddning 1–5** | P2 — diskret rad under kompass |

Kod: `HamnModuleStack.tsx`.

---

## Tid & K1/K2/K3

Visuell kompass-disc (LivskompassHero) är **valfri P2** i modulhuvudet. Nu: line-ikon + text. Se [`KOMPASS-TRE-TIDPUNKTER.md`](./references/KOMPASS-TRE-TIDPUNKTER.md).

Mockup: [`kompass-moduler-hem.png`](./references/kompass-moduler-hem.png).
