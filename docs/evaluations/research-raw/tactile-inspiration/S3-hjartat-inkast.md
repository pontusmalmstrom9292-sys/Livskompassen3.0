# FP-TI-S3 · Hjärtat + Inkast — Tactile Chameleon

**Tag:** FP-TI-S3 · **Datum:** 2026-06-18 · **Tema:** tactile-obsidian (E, guld `#c9a227`) · **Scope:** sandbox `/dev/design-freeport` — ej prod utan PMIR

**Källor:** `dagbokInputModes.ts` · `FreeportChameleonLive.tsx` · `CHAMELEON-SUPERMODULE-SPEC.md` · `.context/domän-covert-narcissism.md` · S2 UX Guardian

---

## 1. Hjärtat-hub — fyra layouter

Mönster från `planeringHubLayouts.ts` (8 st). Hjärtat behöver färre — tre modes + discovery, kapacitetsfiltrerat.

| Layout ID | Stil | Moduler (slots) | Lead |
|-----------|------|-----------------|------|
| **spegel-orbit** | orbit | Chameleon (featured `quick_mirror`) · Senaste rad · Minneslista-kort · Discovery (Dagbok/Speglar) | Spegling i centrum — övrigt i djupring |
| **reflektion-studio** | sections | Chameleon (`reflektion`) · Steg-indikator · RememberCard · Arkiv-teaser (read-only) | Steg-för-steg, låg arousal |
| **minnes-galleri** | tiles | Chameleon (`arkiv`) · Journal-kort (stackad elevation) · Discovery · OSÄKER: månadsfilter | Taktilt djup — inte platt bento |
| **lugn-triad** | minimal | Chameleon (default `reflektion`) · Ett discovery-kort · Fyren-hint (text) | Kapacitet 1 — tre val totalt |

**Moduler per slot:** Chameleon = befintliga delegates (`DagbokReflektionDelegate` / `DagbokQuickMirrorDelegate` / `DagbokArkivDelegate`). Discovery = `resolveCardToChameleon` (Modell A, max 2 klick). WORM oförändrat (`writeTarget` i `dagbokInputModes.ts`).

**Estetik E:** Cinzel zonrubrik, Inter hub, `depth-line` på shell, indigo glow på speglar-slot, guld på reflektion.

---

## 2. Inkast utan «ännu en flik»

Idag: Hjärtat har **inga** inkast-modes (`freeportZones.ts` — endast reflektion/quick_mirror/arkiv). Inkast = `CaptureSuperModule` i Vardagen/MåBra/Familjen. ~80% inkast = bevis/sms → DCAP fail-closed → Granska (domän-kanon).

| Mönster | Beskrivning | För | Nackdel |
|---------|-------------|-----|---------|
| **A. Fyren-slot** | Global widget (WH1/WH2) — inte i mode-raden | Redan låst tyst REC; noll tab-brush | Känns inte «i Hjärtat» |
| **B. Shell-drop** | Depth-linje på chameleon = drag/drop + «Klistra» utan mode-byte | En yta; alignar E 3D | Kräver tydlig DCAP-feedback |
| **C. Discovery-morph** | Hub-kort «Fånga» sätter `CaptureSuperModule variant="hem-inkast"` in-place i viewport | Modell A; morph 350 ms | Ny delegate-bro i sandbox |
| **D. Granska-band** | Tunn band under shell: kö-status (lokal + molnet) | Synlig utan capture-läge | Risk: valv-ord publikt — PIN-gate |

**Rekommendation (sandbox):** **B + C** — discovery-kort morphar till capture-delegate; Fyren kvar globalt. Prod-wire: **OSÄKER** — kräver PMIR + `smoke:inkast`.

---

## 3. Speglar — Zero Footprint visuellt

Speglar (`/hjartat?tab=speglar`) = session (`readSpeglarSession` / `clearSpeglarSession`), ingen persistent RAG. Chameleon `quick_mirror` skriver journal WORM + `journalQuickMirror` — **inte samma som full Speglar-flöde** (OSÄKER: enhetlig delegate senare).

| Signal | Tactile UI |
|--------|------------|
| **Ephemeral** | Dämpad indigo kant, «luftig» inset — kortet känns lättare än WORM-reflektion |
| **Session-ribbon** | Text: «Försvinner när du lämnar» + ikon utan lås — logout/blur rensar |
| **Ingen arkiv-länk** | Dölj «spara till minneslista» i speglar-läge; guld → indigo vid morph |
| **RAG av** | Ingen «hämtat från minne»-rad; tom yta tills användaren skriver |

**NEJ:** spar-historik, citations, Kunskap-hints (cross-RAG förbjudet).

---

## 4. Funktionsidéer (FP-TI-S3)

| ID | Idé | För | Emot | Kostnad |
|----|-----|-----|------|---------|
| **FP-TI-S3-001** | `hjartatHubLayouts.ts` + picker i freeport (4 layouter) | Paritet Planering; A/B layout | Underhåll | GRATIS |
| **FP-TI-S3-002** | Inkast discovery-morph (`CaptureSuperModule` i chameleon viewport) | Ingen fjärde flik; G10 oförändrat | Ny sandbox-bro | LÅG |
| **FP-TI-S3-003** | Speglar session-ribbon + accent-morph indigo | Tydlig Zero Footprint | quick_mirror ≠ Speglar idag | GRATIS |
| **FP-TI-S3-004** | CSS depth-stack på arkiv-kort (ej Three.js) | 3D utan GPU-kostnad | Överdriven skugga = arousal | GRATIS |
| **FP-TI-S3-005** | Layout via `evolution_hub` kapacitet (lugn-triad vid nivå 1) | Infinite Evolution-kanon | Backend-läsning | LÅG |

---

## 5. Risker & smoke

| Risk | Mitigering |
|------|------------|
| Inkast auto-routar till Valv | DCAP före LLM; manuell Granska |
| Speglar får RAG | Ingen retrieval; `smoke:speglar` |
| Valv-ord i Hjärtat-hub | Plausible deniability; `smoke:locked-ux` |
| Fyren REC i sandbox | Mock — ej prod-callables (S2) |

**Verifiering:** `npm run smoke:speglar && npm run smoke:inkast && npm run smoke:inbox && npm run smoke:design-freeport`

---

## Rekommendation

Sandbox: **spegel-orbit** default + **lugn-triad** vid låg kapacitet. Inkast via **discovery-morph**, inte mode-rad. Speglar: indigo ephemeral shell + session-ribbon. Nästa: prototyp `FreeportHjartatHub.tsx` (ej prod-wire).
