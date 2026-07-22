# FP-TI · Referensboard (sandbox)

**Datum:** 2026-06-18 · **Kanon:** riktning **E** (`tactile-obsidian`) · **S2:** 3 zoner, låst UX — inga publika «Dagbok»/«Hälsa»-etiketter i nav  
**Scope:** `/dev/design-freeport` — prod orörd

## Syfte

Samla externa mockups så Theme Lab och Freeport kan jämföra **modulkropp** (fullare kort, inte tunna linjer) mot godkänd E-referens.

## Rank — hero + fuller modules

| Rank | Fil | Motivering |
|------|-----|------------|
| **0 (PRIMARY hero)** | `FP-TI-REF-hero-gold-filled-cards.png` | **Pontus: VERY CLOSE.** Premium dark + metallic gold, **fyllda** rundade kort (ej wireframe), 2-col grid, guld FAB-centrum, uppercase guldheaders, listrader med ikon-cirklar |
| **1** | `FP-TI-REF-action-dashboard-modules.png` | Tätast modulyta: fyllda paneler, mini-diagram, CAPTURE+, checklistor |
| **2** | `FP-TI-REF-haven-life-os-celestial.png` | Glas-kort med tjocklek, stjärnbetyg, tvåkolumns hub |
| **3** | `FP-TI-REF-gemini-gold-nav-5screens.png` | Solid kort i HEM/EKONOMI; listrader fortfarande linjetunna |
| **4 (primär E baseline)** | `FP-TI-E-hem-midnight-velvet-ref.png` | Lugn bas + skuggdjup — lägre moduldensitet, rätt materialitet |

## Referenstabell

| Ref-fil | Vad vi tar | Vad vi skippar | ADHD-notering |
|---------|------------|----------------|---------------|
| **FP-TI-REF-hero-gold-filled-cards.png** (rank 0) | 2px guld-kant, **solid fyllda** surface-2/3-kort, 2-col supermod/discovery, hub-listrader med guld ikon-cirkel, metallic FAB | Etiketter DAGBOK/EKONOMI/RESURSER i prod-nav, finance-luxury copy, fem skärmar som prod-struktur | En fokal hub + 2-col chunks — inte alla fem skärmar samtidigt |
| **FP-TI-E-hem-midnight-velvet-ref.png** (E baseline) | Navy/skiffer-bas, mjuka flerlagers skuggor, guldstjärna i nav, rundade hub-kort, Inter-lik hierarki | Oändlig feed-skroll, foto-tung dagbok som hem | Lugn kortdensity — baseline E, inte max modul |
| **FP-TI-REF-action-dashboard-modules.png** | Mörk charcoal + guld, **fyllda modulkort**, sparklines, Gantt, CAPTURE+-CTA, tydliga sektionsrubriker | Dollar/luxury-finance, engelska prod-copy, dubbla GOALS-block | Hög informationsdensitet — endast kapacitet 2–3; annars paralys |
| **FP-TI-REF-haven-life-os-celestial.png** | Nebula/scenic bakgrund, guldkompass, **fullare glass** med rim-light, «God morgon»-personalisering, stjärn/status som chunk | «HAVEN»-varumärke, stjärnbetyg som gamification, relation-review som default | Vacker men mer visuellt brus — håll blur/reduced-motion; en fokalpunkt |
| **FP-TI-REF-gemini-gold-nav-5screens.png** | Guld på svart, FAB-centrum som zon-action, modulblock (Morgonrutin, Veckoplan), ekonomi-graf i kort | Etiketter HEM/EKONOMI/RESURSER/**DAGBOK**/INSTÄLLNINGAR (bryter 3-zon + S2), sidomeny med Dagbok | Fem skärmar = bra jämförelse; prod får max 3 publika nav-zoner + drawer |

## Alignment E + S2 + hero ref

- **Färg/typo:** `#c9a227` guld, Cinzel zon, Inter i hub — hero ref tonas mot E, inte egen prod-tema.
- **Nav:** Kanon = Vardagen / Hjärtat / Familjen (+ Valv reaktivt). Hero-ref FAB → sandbox demo i `FreeportHemV3Lab` med **Hem · Hjärtat · FAB · Vardagen · Familjen** — inte literal «Dagbok»/«Resurser».
- **Moduler:** **2px guld-kant + fylld gradient** (surface-2/3), listrader med vänster ikon-cirkel, 2-col discovery/supermod.
- **Inkast:** FAB-idé → sandbox demo, inte ny prod-bottom-nav (FP-008 DEFER).

## Filer

`docs/design/references/FP-TI-*.png` · sandbox snapshot: `FP-TI-sandbox-hero-alignment.png` · beslut E: [`2026-06-18-fp-ti-e-approved.md`](./2026-06-18-fp-ti-e-approved.md) · backlog: [`TACTILE-INSPIRATION-BACKLOG.md`](./TACTILE-INSPIRATION-BACKLOG.md)

## Nästa sandbox-steg

1. ~~Hem v3: hero materiality (filled cards, 2-col, hub rows, demo nav)~~ — 2026-06-18.  
2. Theme Lab: utkast `I-stone-draft-ti-hero` med `--fp-card-fill` + 2px borders.  
3. Smoke: `npm run smoke:design-freeport` efter CSS-ändring.
