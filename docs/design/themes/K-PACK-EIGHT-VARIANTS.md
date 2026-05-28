# Theme Pack K — åtta nya varianter (2026-05-28)

**Status:** Utkast i `themeRegistry.ts` · **Default prod:** oförändrat `I-stone`  
**Preview:** `/dev/themes` · **Theme Lab:** `/dev/theme-lab`  
**Auto per hub:** oförändrat Theme Pack J (`moduleThemeMap.ts`) tills explicit godkännande

Pack K är **visuellt distinkt** från Pack J (hub-tokens). Alla följer [`COLOR-POLICY.md`](../COLOR-POLICY.md): mörk obsidian-bas, ingen turkos som global primär, sidomeny aktiv rad **guld** (CSS lock).

---

## Översikt

| # | ID | Label | Känsla | Bakgrund |
|---|-----|-------|--------|----------|
| 1 | `K-obsidian-deep` | Obsidian Djup | Nästan svart, brons | stone |
| 2 | `K-copper-forge` | Koppar Smedja | Varm koppar, marmor | marble |
| 3 | `K-sage-calm` | Salvia Lugn | Dämpad grön + guld | stone |
| 4 | `K-plum-night` | Plommon Natt | Vin/plommon + guld | stone |
| 5 | `K-slate-balance` | Skiffer Balans | Neutral grå, guld enda accent | stone |
| 6 | `K-honey-dawn` | Honung Gryning | Varm honung/amber | stone |
| 7 | `K-ivory-vault` | Elfenben Valv | Ljusare ytor, arkv-läsning | marble |
| 8 | `K-ember-focus` | Glöd Fokus | Ember + guld energi | stone |

---

## Kod

| Fil | Roll |
|-----|------|
| `src/modules/core/theme/themePackK.ts` | Definition + `K_PACK_THEME_IDS` |
| `src/modules/core/theme/themeRegistry.ts` | Spread in i `THEME_REGISTRY` |

---

## Godkännande

Skriv **`GODKÄND: K-<id>`** i [`theme-lab/VARIANTS.md`](../theme-lab/VARIANTS.md) för enskild variant.  
För att ersätta J-auto per hub: separat beslut + uppdatera `moduleThemeMap.ts`.
