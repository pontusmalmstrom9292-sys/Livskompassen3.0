# Färgpolicy — inga blå/turkosa accenter (globalt)

**Datum:** 2026-05-23 · uppdaterad **2026-05-24** (Theme Pack I)  
**Beslut:** Avveckla indigo, cyan, teal, electric blue i **kärn-UI** (Valv, Widget, BIFF, dock).

## Ersättning

| Tidigare | Ny riktning |
|----------|-------------|
| `--accent-secondary: #818cf8` (indigo) | Guld `#d4af37` eller varm amber `#f59e0b` |
| Cyber Emerald `#2dd4bf` som primär | Endast **success**-state sparsamt, eller varm grön `#6b8f71` |
| Tema C / E aurora blå-grön | **Theme Pack I** + F/G/H mockups |

## Aktiva teman — runtime (Theme Pack I)

| ID | Namn | Användning |
|----|------|------------|
| **I-stone** | Architect Stone | Hem, Valv, Widget expanded, Planering |
| **I-alchemical** | Alchemical Gold | Kompass, Rutiner, Budget |
| **I-skymning** | Nordic Skymning | MåBra, KBT, Familjen (**modul-scoped mint**) |
| **I-hamn** | Trygg Hamn | Hamn |
| **I-glass** | Dual Glass | Widget peek |

**Registry:** `src/modules/core/theme/themeRegistry.ts` · **Preview:** `/dev/themes`

### Undantag — modul-scoped accent

**I-skymning** får mint `#4fd1c5` **endast** via `moduleThemeMap` på `/mabra`, `/familjen` — inte som global `:root`.

## Legacy mockups (referens)

| ID | Namn | Användning |
|----|------|------------|
| **F** | Guld Pansar | Valv-typografi, juridisk känsla |
| **G** | Varm Hamn | Barnfokus mockups |
| **H** | Grafit Grey Rock | BIFF, minimal kontrast |

**Kompass:** Behålls i alla (guld-emblem).

## Arkiverade (referens only)

Tema A–E i `docs/design/themes/` — använd **inte** blå accenter i Valv/Widget globalt.
