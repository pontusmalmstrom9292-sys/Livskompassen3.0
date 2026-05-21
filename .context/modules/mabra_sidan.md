# Måbra-sidan

**Route:** `/mabra` · **AuthGate:** ja · **Kluster:** hem (Måbra) · **Ej i dock**  
**Spec (konsoliderad):** [`docs/specs/incoming/Mabra-SPEC.md`](../../docs/specs/incoming/Mabra-SPEC.md)

## Syfte

Proaktiv rehab — KBT/ACT, vagus, självmedkänsla, värderingar. ADHD/GAD/RSD: kravlöst, ett steg i taget. **Inte** gaslighting-försvar (Speglar), **inte** ex (Hamn), **inte** daglig logg (Dagbok).

## UI (MVP — klart, fas 1.5)

| Komponent | Roll |
|-----------|------|
| `MabraPage` | Orchestrator — routing per symptom-hub |
| `SymptomHub` | 3 val: Panik/RSD, Självkritik, Hitta mig |
| `DurationPicker` | 1 / 3 / 5 min (endast andning) |
| `BreathingExercise` | 4-7-8 (panic_rsd \| self_critical) |
| `GroundingExercise` | 5-4-3-2-1 (find_self), offline |
| `MabraComplete` | Mjukt avslut + länkar Dagbok / Kompasser |

**Flöde:** hub → (duration om andning) → övning → `mabra_sessions` → complete.

## Navigation

| Ingång | Beteende |
|--------|----------|
| Hem kluster Måbra | `/mabra` |
| FloatingDock | **Nej** |
| Efter övning | Länk Dagbok (`/dagbok`), Kompasser (`/vardagen`) — **inte** auto |

## Datamodell

- **`mabra_sessions`:** `ownerId`, `exerciseType`, `hubSymptom?`, `durationSeconds`, `createdAt` — WORM (create/read)
- **`mabra_progress`:** coreValues (ACT) — **planerat** fas 2
- **Inte:** RAG/Kunskap; **inte** streak

## Backend

- MVP: deterministiska övningar (klient) + `saveMabraSession()` → Firestore
- Fas 2: Måbra-coach callable (Gemini, `sharedRules.ts`)

## Status

| Klart (MVP) | Delvis | Planerat (fas 2) |
|-------------|--------|------------------|
| Route, AuthGate, kluster | Deploy rules prod | Reframing / thought record |
| Symptom-hub + hub→övning routing | | Måbra-coach callable (opt-in) |
| 4-7-8 + 5-4-3-2-1 grounding | | `mabra_progress` / coreValues |
| `mabra_sessions` + rules/index | | Bro Dagbok in (låg energi) |
| Complete + länkar | | Guardrail → Speglar vid ex-text |
| Obsidian Calm, ingen streak | | Trauma-RAG (ej auto — opt-in Kunskap) |

## Kladd 2026-05-21

- **Kladd:** Vagus, 3-stegs återhämtning, självmedkänsla, "tänksamma nej-et".
- **Avvisat:** Stjärnbilder, Nordisk skymning grön, VIVIR här (→ Speglar).
- **Gap:** Reframing för självkritik-hub; coach RAG; ingen auto-ingest livshistoria.

**Deploy:** `firebase deploy --only firestore` krävs för `mabra_sessions` rules/index i prod.

## Produktbeslut (låsta 2026-05)

Metadata sparas; symptom-hub; Obsidian Calm; ingen streak/natur; AI opt-in; länk inte auto till Kompasser/Dagbok.

Se §14 i [`Mabra-SPEC.md`](../../docs/specs/incoming/Mabra-SPEC.md).

## Kopplingar

- **Dagbok** — länk efter övning; valfri insikt + bro in (planerat)
- **Kompasser** — länk kväll (planerat)
- **Speglar** — guardrail vid ex-text (planerat)
- **Hamn / Valv / Kunskap** — **ingen** datakoppling

Kod: `src/modules/mabra/` · Plan: [`src/modules/mabra/module_plan.md`](../../src/modules/mabra/module_plan.md)
