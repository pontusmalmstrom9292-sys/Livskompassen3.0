# Speglar-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/speglingssystemet.md`.

## 1. Syfte och användarbehov

Sacred Feature — appens primära skydd mot gaslighting. Bygger på ACT (validera utan fixa) och VIVIR (Vem → Inflytande → Viktigt → Intention → Redo). Copy max 2–4 meningar, Grey Rock-ton, ingen JADE. Anpassat för RSD och hypervigilans.

## 2. Route och ingång

- **Route:** `/speglar` (AuthGate)
- **Variant A (aktiv):** HomePage bento-kort — **ej** i FloatingDock
- **Variant B (planerad):** Naturlig bro från Dagbok sparad-steg (*"Känns det som gaslighting?"*)

## 3. UX-flöde (Progressive Disclosure)

Ett steg i taget:

1. **ACT-kalibrering** (`ActCalibrationView`) — initial känsla
2. **VIVIR** (`VivirStepView`) — fem steg metodiskt
3. **Faktamatchning** (`EvidenceCompareView`) — känsla/VIVIR mot WORM-bevis från Verklighetsvalvet

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A` — rubriker/aktivt val
- Indigo `#818CF8` — Fortsätt
- Emerald `#2DD4BF` — spara/klar
- AI-synapser: `#6366F1` (diskret, endast AI-koppling)
- Outfit + Inter; förbjudet: ljusa bakgrunder, naturteman

## 5. Datamodell (Firestore, WORM)

Inga permanenta speglings-chattloggar. Modulen **läser** `reality_vault` via klient-API `getVaultLogs(uid)` (Firestore SDK — inte separat Callable i nuvarande kod).

`matchVaultEvidence.ts` filtrerar bort `category: vävaren_metadata` och matchar tokens + `weaverTags` mot användarens VIVIR/känsla-text.

## 6. Backend och agenter

- **Idag:** Deterministisk UI + klient-side matchning
- **Planerat:** Speglings-Coachen (Genkit/DCAP) med max 4 meningar per svar, JADE-förbud

*(Extern spec nämnde Callable `getVaultLogs` — i kod körs läsning direkt från `src/modules/core/firebase/firestore.ts`.)*

## 7. Säkerhet

- AuthGate + CMEK (drift)
- Zero Footprint: session-state ska raderas vid navigering bort / kill switch
- Kill Switch: `useShakeToKill` → `/`

## 8. Status idag vs planerat

**Idag:** `SpeglingsSystem.tsx`, ACT/VIVIR/EvidenceCompare, `matchVaultEvidence`, bro från Dagbok SavedStep (copy avviker).

**Planerat:** Speglings-Coachen (AI), exakt dagboks-copy, `#6366F1` på AI-ytor, Zero Footprint vid unmount, journal/weaverTags som initial kontext, Safe Harbor → BIFF vid behov.

## 9. Acceptanskriterier

1. ACT + VIVIR + faktamatchning klickbar lokalt (deterministisk fallback utan AI-deploy)
2. `matchVaultEvidence` returnerar WORM-data och exkluderar `vävaren_metadata`
3. Speglings-Coachen max 4 meningar, aldrig JADE
4. Navigering bort nollställer speglings-state (Zero Footprint)

## 10. Kopplingar

- **Dagbok** — startpunkt; `weaverTags` ska mata initial kontext (planerat via route/state)
- **Verklighetsvalvet** — WORM-bevis till EvidenceCompare
- **Safe Harbor** — vid behov av svar till ex: BIFF/Grey Rock (planerat)

## 11. Navigation

- **Variant A:** HomePage bento + länk från Dagbok SavedStep
- **Variant B:** Osynligt flöde direkt efter dagbokspost
