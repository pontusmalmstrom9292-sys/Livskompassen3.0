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

## Nästa steg — nytt skin

1. Kopiera [THEME-PACK-TEMPLATE.ts](../../src/modules/core/theme/THEME-PACK-TEMPLATE.ts) → `themeRegistry.ts`
2. Lägg PNG i `I-architect-vault/` + `public/design/themes/I-architect-vault/`
3. Testa på `/dev/themes`

## Oförändrat (alla teman)

- Ett steg i taget, låg sensorisk noise
- Locked UX: Barnfokus, Valv Mönster/Orkester, Planering P3
- Ingen natur-tapet (skog/djur/regnbåge)
