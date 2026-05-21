# Speglings-Systemet

**Sacred Feature.** **Route:** `/speglar` · **AuthGate:** ja · **Ej i dock**  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/Speglar-SPEC.md`](../../docs/specs/incoming/Speglar-SPEC.md)

---

## 1. Syfte och användarbehov

Gaslighting-skydd: ACT (validera utan fixa), VIVIR, jämför känsla mot WORM-bevis. Copy max 2–4 meningar, Grey Rock, ingen JADE.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | HomePage bento — **inte** FloatingDock |
| **B (planerad)** | Bro från Dagbok sparad-steg (*gaslighting-copy*) |

## 3. UX-flöde

Progressive disclosure — ett steg i taget:

1. ACT-kalibrering (`ActCalibrationView`)
2. VIVIR fem steg (`VivirStepView`)
3. Faktamatchning (`EvidenceCompareView`) mot `reality_vault`

## 4. Visuell design

- Obsidian Calm enligt design-master
- Guld aktiv, indigo Fortsätt, emerald klar
- AI-synapser `#6366F1` — **planerad** diskret accent

## 5. Datamodell

- **Läser** `reality_vault` via klient `getVaultLogs(uid)` (Firestore SDK)
- `matchVaultEvidence` — token + `weaverTags`, exkluderar `vävaren_metadata`
- Inga permanenta speglings-chattloggar

## 6. Backend

- **Idag:** Deterministisk UI, klient-side matchning
- **Planerat:** Speglings-Coachen (Genkit/DCAP), max 4 meningar

## 7. Säkerhet

- AuthGate; LLM är **inte** auktoritetskälla för bevis
- Zero Footprint vid unmount — **planerat** (manuell "Ny kalibrering" finns)
- Kill Switch: shake → `/`

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| ACT, VIVIR, EvidenceCompare | Bro Dagbok→Speglar (copy) | Speglings-Coachen AI |
| matchVaultEvidence + vävaren-filter | | `#6366F1` AI-accent |
| getVaultLogs klientläsning | | Zero Footprint unmount |
| HomePage bento-ingång | | journal/weaverTags som kontext |
| | | Safe Harbor → BIFF |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | ACT+VIVIR+compare klickbar lokalt | **done** |
| 2 | matchVaultEvidence exkluderar vävaren_metadata | **done** |
| 3 | AI max 4 meningar, ingen JADE | **planned** |
| 4 | State reset vid navigering bort | **planned** |

## 10. Kopplingar

- **Dagbok** — bro SavedStep; weaverTags-kontext planerad
- **Verklighetsvalvet** — WORM-bevis till compare
- **Safe Harbor** — BIFF vid svar till ex (planerat)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/speglings_system/` · plan: `src/modules/speglings_system/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. Speglings-Coachen Genkit-flow + DCAP-routing  
2. Zero Footprint cleanup i `SpeglingsSystem` (unmount)  
3. AI-accent `#6366F1` på coach-ytor  
4. Route state från Dagbok (mood/text/weaverTags)  
5. SavedStep copy synkad med Dagbok-SPEC (koordinera med dagbok-modulen)
