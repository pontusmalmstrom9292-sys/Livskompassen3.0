# Theme Lab — variantbeslut

**Uppdaterad:** 2026-06-11 (R-A Nordic Precision prod default)

| ID | Label | Status | Test / beslut |
|----|-------|--------|----------------|
| `D1-hamn-kompass` | Design Hamn & kompass | **experiment** | Hamn orbit + ref-hamn |
| `D2-familjen-kort` | Design Familjen | **experiment** | Radkort + ref-familjen.png |
| `D3-minnes-timeline` | Design Minnes | **experiment** | Tidslinje + guld CTA |
| `D4-flat-deluxe` | Design flat deluxe | **arkiv** | föregående prod default 2026-06-07 |
| `D4-flat-luxe` | *(alias)* | arkiv | → `D4-flat-deluxe` |
| `D5-aurora-glas` | Design aurora | **experiment** | Glas + aurora |
| `M1-mockup-meny` | Mockup sidomeny | **experiment** | äldre tokens |
| `M2-mockup-hamn` | Mockup Hem/Hamn | **experiment** | **default 2026-06-01** — kompass på hem |
| `M3-mockup-familjen` | Mockup Familjen | **experiment** | Varm kortlista |
| `M4-mockup-kompis` | Mockup Kompis | **experiment** | Aurora glas |
| `E-skymning-prod` | Nordic Skymning (E) | arkiv | Föregående prod-försök |
| `I-stone` | Architect Stone | legacy | Lab / manuellt val |
| `I-stone-draft-photo` | Stone — tydligare foto | utkast | `/dev/theme-lab` → ljusare `--glass` |
| `I-stone-draft-glow` | Stone — starkare guld glow | utkast | Starkare `--accent-glow`, kanter |
| `I-stone-draft-twilight` | Stone — skymning | utkast | Kallare `--bg`, mjukare guld, kväll |
| `I-stone-draft-bronze` | Stone — brons | utkast | Varm brons/roséguld accent |
| `I-stone-draft-matte` | Stone — matt | utkast | Plattare glas, svag glow (låg last) |
| `R-A-nordic-precision` | Nordic Precision (Style A) | **GODKÄND prod** | **default 2026-06-11** — isblå CTA, silver chrome, guld nav |
| `OD-obsidian-depth` | Obsidian Depth (3D) | **LÅST** | **2026-06-14** — glass bento, taktil 3D, guld endast · `/dev/obsidian-depth` |

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

- **GODKÄND: `R-A-nordic-precision`** — helapp default (`DEFAULT_THEME_ID`, `moduleThemeMap.ts`) 2026-06-11.
- **LÅST: `OD-obsidian-depth`** — fylligare 3D-skalet (mockup + theme pack). Ej prod-default. Knappar/menyer förfinas separat. Se `OBSIDIAN-DEPTH-SPEC.md`.
- **ROLLBACK-ref:** `D4-flat-deluxe` — föregående prod default 2026-06-07.
- **GODKÄND: `J-planering-fyren`** — Planering + Projekt (`moduleThemeMap.ts` rad 19–20). Övriga hubbar oförändrade.

| ID | Typ | Status | Prompt / fil |
|----|-----|--------|--------------|
| `F1-dagbok-snabb-wireframe` | Gemini Imagen wireframe | **referens** | Se Cursor-plan Steg F1 — Obsidian Calm `#020617`, guld `#FDE68A`, etiketter Humör/Taggar/Spara känslan |
| `F2-barnporten-flow` | Google Flow 15s | **valfritt** | Mörk navy, abstrakt kompassros, ingen text — onboarding-referens Barnporten |

**Regel:** Godkänn i tabellen ovan innan prod-tema eller ikon ändras. D1/M2 låsta — se `.context/locked-icons.md`.


- **GODKÄND: `J-planering-fyren`** — Planering + Projekt (`moduleThemeMap.ts` rad 19–20). Övriga hubbar oförändrade.
- Nästa val: skriv **GODKÄND: &lt;id&gt;** för global bas eller fler J-hubbar.
