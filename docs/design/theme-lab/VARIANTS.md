# Theme Lab — variantbeslut

**Uppdaterad:** 2026-05-29 (produktval Planering Fyren)

| ID | Label | Status | Test / beslut |
|----|-------|--------|----------------|
| `I-stone` | Architect Stone (prod) | **aktiv** | Bas — scenic + guld |
| `I-stone-draft-photo` | Stone — tydligare foto | utkast | `/dev/theme-lab` → ljusare `--glass` |
| `I-stone-draft-glow` | Stone — starkare guld glow | utkast | Starkare `--accent-glow`, kanter |
| `I-stone-draft-twilight` | Stone — skymning | utkast | Kallare `--bg`, mjukare guld, kväll |
| `I-stone-draft-bronze` | Stone — brons | utkast | Varm brons/roséguld accent |
| `I-stone-draft-matte` | Stone — matt | utkast | Plattare glas, svag glow (låg last) |

**Jämför:** http://localhost:5173/dev/theme-lab → Utkast (agent) → Förhandsgranska → **Använd i appen** → testa `/` (Hem).

## Theme Pack J (hub + widget, 2026-05-25)

| ID | Label | Status | Hubb |
|----|-------|--------|------|
| `J-fyren-hem` | Fyren Hem | **utkast** | Hem, WH3 |
| `J-valv-pansar` | Valv Pansar | **utkast** | Valv, WH1 |
| `J-planering-fyren` | Planering Fyren | **godkänd** | Planering, Projekt — **GODKÄND** (2026-05-29) |
| `J-familjen-varm` | Familjen Varm | **utkast** | Familjen, WH5 |
| `J-hamn-greyrock` | Hamn Grey Rock | **utkast** | Hamn, WH4 |
| `J-mabra-lavendel` | MåBra Lavendel | **utkast** | MåBra |
| `J-barnporten-ljus` | Barnporten Ljus | **utkast** | Barnporten (plan) |
| `J-vardagen-orbit` | Vardagen Orbit | **utkast** | Vardagen-flikar, WH2 |

Spec: [`../themes/J-PACK-EIGHT-HUBS.md`](../themes/J-PACK-EIGHT-HUBS.md)

## Theme Pack K (nya varianter, 2026-05-28)

**Kod:** `themePackK.ts` → spread i `themeRegistry.ts` · sektion i `/dev/theme-lab` · alla 8 i `/dev/themes`.  
**Verifiering:** `npm run build` PASS · `npm run smoke:locked-ux` PASS (2026-05-29).  
**Auto per hub:** oförändrat Pack J (`moduleThemeMap.ts`).

| ID | Label | Status | Notering |
|----|-------|--------|----------|
| `K-obsidian-deep` | Obsidian Djup | **utkast** | wired · brons + svart |
| `K-copper-forge` | Koppar Smedja | **utkast** | wired · koppar/marmor |
| `K-sage-calm` | Salvia Lugn | **utkast** | wired · salvia + guld |
| `K-plum-night` | Plommon Natt | **utkast** | wired · plommon/vin |
| `K-slate-balance` | Skiffer Balans | **utkast** | wired · neutral grå |
| `K-honey-dawn` | Honung Gryning | **utkast** | wired · honung/amber |
| `K-ivory-vault` | Elfenben Valv | **utkast** | wired · ljusare arkv |
| `K-ember-focus` | Glöd Fokus | **utkast** | wired · ember + guld |

Spec: [`../themes/K-PACK-EIGHT-VARIANTS.md`](../themes/K-PACK-EIGHT-VARIANTS.md)

## Godkännande

- **GODKÄND: `J-planering-fyren`** — Planering + Projekt (`moduleThemeMap.ts` rad 19–20). Övriga hubbar oförändrade.
- Nästa val: skriv **GODKÄND: &lt;id&gt;** för global bas eller fler J-hubbar.
