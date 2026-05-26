# Design System v2 — temajämförelse

**Genererat:** 2026-05-23 · uppdaterad **2026-05-24**  
**Syfte:** Välj tema · runtime via Theme Pack I i `src/modules/core/theme/themeRegistry.ts`.

## Aktivt i prod — Theme Pack I (2026-05-24)

| ID | Label | Modul | Preview |
|----|-------|-------|---------|
| **I-stone** | Architect Stone | Hem, Valv, Widget expanded | [00-smart-widget](./I-architect-vault/00-smart-widget-expanded.png) |
| **I-alchemical** | Alchemical Gold | Kompass, Rutiner, Budget | [02-alchemical](./I-architect-vault/02-alchemical-gold.png) |
| **I-skymning** | Nordic Skymning | MåBra, KBT, Familjen | [03-skymning](./I-architect-vault/03-nordic-skymning.png) |
| **I-hamn** | Trygg Hamn | Hamn | [04-hamn](./I-architect-vault/04-trygg-hamn.png) |
| **I-glass** | Dual Glass | Widget peek | [01-glass](./I-architect-vault/01-glass-dual-actions.png) |

**Live preview:** `/dev/themes` i appen · **Spec:** [THEME-I-SPEC.md](./I-architect-vault/THEME-I-SPEC.md)

## Theme Pack G — Varm Hamn (2026-05-25)

| ID | Label | Auto-modul (om Auto på) | Preview |
|----|-------|-------------------------|---------|
| **G-varm-hamn** | Varm Hamn | `/familjen`, `/barnen`, `/mabra` | [hero](./G-varm-hamn/00-hero-livskompass.png) |

Espresso `#1a1410`, guld kompass, cream, rose-gold `#c9a87c` — **ingen blå/turkos.** Mjukare än F. **Spec:** [THEME-G-SPEC.md](./G-varm-hamn/THEME-G-SPEC.md)

## Legacy teman (A–E, F/G/H mockups)

| ID | Mapp | Känsla |
|----|------|--------|
| **A** | [A-sacred-compass](./A-sacred-compass/) | Premium livskompass, guld-emblem |
| **B** | [B-obsidian-elevated](./B-obsidian-elevated/) | Obsidian Calm med djup |
| **C** | [C-nordic-aurora](./C-nordic-aurora/) | Frostad glass (arkiverad prod) |
| **D** | [D-tactical-harbor](./D-tactical-harbor/) | Grey Rock |
| **E** | [E-aurora-obsidian-compass](./E-aurora-obsidian-compass/) | Hybrid aurora + guld |
| **F** | [F-guld-pansar](./F-guld-pansar/) | Valv, widget mockups |
| **G** | [G-varm-hamn](./G-varm-hamn/) | Barnfokus, KBT |
| **H** | [H-grafit-greyrock](./H-grafit-greyrock/) | Grey Rock minimal |

## Theme Pack J — åtta hubb-teman (2026-05-25)

**Spec:** [J-PACK-EIGHT-HUBS.md](./J-PACK-EIGHT-HUBS.md) · **Auto-modul:** `moduleThemeMap.ts`

| ID | Label | Hubb | Widget |
|----|-------|------|--------|
| **J-fyren-hem** | Fyren Hem | `/` | W1 + WH3 |
| **J-valv-pansar** | Valv Pansar | `/dagbok`, `/valv` | WH1 |
| **J-planering-fyren** | Planering Fyren | `/planering`, `/projekt` | +Projekt, Kalender |
| **J-familjen-varm** | Familjen Varm | `/familjen` | WH5 |
| **J-hamn-greyrock** | Hamn Grey Rock | `/hamn` | WH4 |
| **J-mabra-lavendel** | MåBra Lavendel | `/mabra` | — |
| **J-barnporten-ljus** | Barnporten Ljus | `/barnporten` *(plan)* | CB1–CB4 |
| **J-vardagen-orbit** | Vardagen Orbit | `/vardagen`, `/arbetsliv`, `/kunskap` | WH2 |

**Preview:** `/dev/themes` · **Default prod:** fortfarande `I-stone` tills godkänt.

## Nästa steg — nytt skin

1. Kopiera [THEME-PACK-TEMPLATE.ts](../../src/modules/core/theme/THEME-PACK-TEMPLATE.ts) → `themeRegistry.ts`
2. Lägg PNG i `I-architect-vault/` + `public/design/themes/I-architect-vault/`
3. Testa på `/dev/themes`

## Oförändrat (alla teman)

- Ett steg i taget, låg sensorisk noise
- Locked UX: Barnfokus, Valv Mönster/Orkester, Planering P3
- Ingen natur-tapet (skog/djur/regnbåge)
