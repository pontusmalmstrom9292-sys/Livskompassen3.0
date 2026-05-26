# Färgpolicy — inga blå/turkosa accenter (globalt)

**Datum:** 2026-05-23 · uppdaterad **2026-05-25** (Theme Pack I + J hub-auto)  
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

### Theme Pack J — auto per hub (2026-05-25)

När **Auto-modul** är på i Inställningar sätter `moduleThemeMap.ts` hub-tema (lavendel MåBra, amber Planering, varm Familjen, …). Se [`themes/J-PACK-EIGHT-HUBS.md`](themes/J-PACK-EIGHT-HUBS.md).

| Route | J-tema | Accent (primär) |
|-------|--------|-----------------|
| `/mabra` | `J-mabra-lavendel` | Lavendel + guld — **inte** mint |
| `/planering` | `J-planering-fyren` | Amber / guld |
| `/familjen` | `J-familjen-varm` | Rose-gold / varm |

**Sidomeny:** aktiv rad alltid **guld** — oberoende av hub-tema.

### Legacy — I-skymning mint (referens)

**I-skymning** mint `#4fd1c5` finns kvar i registry för lab/preview — **inte** prod-default för `/mabra` när J-pack auto är aktivt.

## Legacy mockups (referens)

| ID | Namn | Användning |
|----|------|------------|
| **F** | Guld Pansar | Valv-typografi, juridisk känsla |
| **G** | Varm Hamn | Barnfokus mockups |
| **H** | Grafit Grey Rock | BIFF, minimal kontrast |

**Kompass:** Behålls i alla (guld-emblem).

## Arkiverade (referens only)

Tema A–E i `docs/design/themes/` — använd **inte** blå accenter i Valv/Widget globalt.
