# FP-TI · Supermodul-skin (research brief)

**Datum:** 2026-06-18 · **Beslut Pontus:** 5-skärm executive ESTETIK + behåll supermoduler/Chameleon

## Vad Pontus menar (tydligt)

| Behåll | Byt inte ut |
|--------|-------------|
| Chameleon morph in-place (`FreeportChameleonLive`) | Statiska mock-listor som «fejk-dagbok» |
| Riktiga delegates (Dagbok, Planering, MåBra, Familjen, Inkast) | Tomma placeholder-kort |
| Modell A: Hem → kort → supermodul (max 2 klick) | Separat app-IA från ref (Dagbok/Ekonomi som nav) |
| Discovery-kort + `HEM_V3_SUPERMODS` | Dold «dev»-toggle som enda väg till supermodul |
| `FreeportSuperhubPlayground` (live Firebase) | — |

| Ta från executive design | Applicera som SKIN |
|--------------------------|------------------|
| Matt svart, guld, 3D chrome v3 | `--fp-exec-*` + `phone--chrome-v3` |
| Fyllda moduler, glans, inset | På **shell** runt delegates |
| Bildplatser | I supermodul-kort (inte bara mock) |
| 5 skärmar | = 5 **zoner/entry** med samma chrome, inte 5 tomma demos |

## Gap idag (varför «närmare» inte «ok»)

1. `FreeportHemV3Lab` visar mock-innehåll; Chameleon ligger bakom «Dev»-toggle.
2. `FreeportEkonomiLab` / `DagbokLab` = mockdata, inte `PlaneringInputSuperModule` / `DagbokInputSuperModule`.
3. Executive CSS träffar inte delegate-internals (`design-freeport__delegate-viewport` delvis).

## Research-frågor (S17)

1. **Skin-only layer:** Vilka `--fp-exec-*` tokens ska wrappa viewport utan att röra delegate-logik?
2. **Per skärm → supermodul:** HEM=hub+kort+chameleon, EKONOMI=?, RESURSER=drawer-nav, DAGBOK=Dagbok delegate, INSTÄLLNINGAR=settings chrome.
3. **Morph:** 350ms chrome på `delegate-viewport` vid mode-byte — ADHD-säker?
4. **Locked UX:** Barnfokus, Valv PIN, MåBra — oförändrat innehåll, ny yta.

## Rekommenderad implementation (efter research)

**Wedge 1:** HEM = executive chrome + synlig `FreeportChameleonLive` (ej dev-toggle) + discovery-kort.
**Wedge 2:** DAGBOK-skärm = `DagbokReflektionDelegate` i exec-card med `ExecutiveMediaFrame`.
**Wedge 3:** Skin pass på `design-freeport__delegate-viewport` för alla zoner.
**Wedge 4:** EKONOMI/RESURSER — mock tills prod-modul finns, eller planering/ekonomi delegate.

## Gate

Pontus OK per skärm när **supermodul syns** i executive chrome — inte när mock ser rätt ut.

## Referenser

- `docs/design/CHAMELEON-SUPERMODULE-SPEC.md`
- `FreeportChameleonLive.tsx`, `FreeportSuperhubPlayground.tsx`
- `FP-TI-REF-executive-5screen-canonical.png`, chrome v3 refs
