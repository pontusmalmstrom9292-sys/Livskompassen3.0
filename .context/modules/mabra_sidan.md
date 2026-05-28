# Måbra-sidan

**Kanonisk kod:** `src/modules/wellbeing/mabra/` (legacy: `modules/mabra` shim)  
**Route:** `/mabra` · **AuthGate:** ja · **Kluster:** hem (Måbra) · **Ej i dock**  
**Spec (konsoliderad):** [`docs/specs/modules/Mabra-SPEC.md`](../../docs/specs/modules/Mabra-SPEC.md)

## Syfte

Proaktiv rehab — KBT/ACT, vagus, självmedkänsla, värderingar. ADHD/GAD/RSD: kravlöst, ett steg i taget. **Inte** gaslighting-försvar (Speglar), **inte** ex (Hamn), **inte** daglig logg (Dagbok).

## UI (MVP — klart, fas 1.5 + 2a + 2b)

| Komponent | Roll |
|-----------|------|
| `MabraPage` | Orchestrator — routing per symptom-hub |
| `SymptomHub` | 3 val: Panik/RSD, Självkritik, Hitta mig |
| `AkutLanding` | Panik/RSD — validering före duration |
| `DurationPicker` | 1 / 3 / 5 min (endast panic_rsd) |
| `BreathingExercise` | 4-7-8 (panic: tid kvar; self_critical addon) |
| `GroundingExercise` | 5-4-3-2-1 (find_self), offline |
| `ReframingExercise` | 4 steg thought record light (self_critical), RAM-only |
| `ValuesCompass` | ACT — välj 3–5 värderingar (länk under hub) |
| `MabraComplete` | Avslut + länkar Dagbok/kväll (hub-copy + lågenergi-bro) |
| `MabraCoachPanel` | Opt-in coach efter övning (`#6366F1`) + Speglar guardrail + röst |

**Flöde:**
- `panic_rsd`: hub → akut → duration → andning → complete
- `self_critical`: hub → reframing (4 steg) → valfri 1-min andning → complete
- `find_self`: hub → grounding → complete

## Navigation

| Ingång | Beteende |
|--------|----------|
| Hem kluster Måbra | `/mabra` |
| FloatingDock | **Nej** |
| Efter övning | Länk Dagbok (`/dagbok`), Kompasser (`/vardagen`) — **inte** auto |

## Datamodell

- **`mabra_sessions`:** `ownerId`, `exerciseType`, `hubSymptom?`, `durationSeconds`, `createdAt` — WORM (create/read)
- **`mabra_progress`:** `coreValues[]` (ACT) — mutable doc per user (`/{uid}`)
- **Inte:** RAG/Kunskap; **inte** streak

## Backend

- MVP: deterministiska övningar (klient) + `saveMabraSession()` → Firestore
- `mabraCoach` callable (Gemini, `MABRA_COACHEN_SYSTEM_PROMPT` i `sharedRules.ts`) — **done** fas 2e

## Status

| Klart (MVP + 2a–2f) | Delvis | Planerat |
|---------------------|--------|----------|
| Route, AuthGate, kluster | Deploy rules prod | Grounding-förbättringar (§3) |
| Måbra-coach + Speglar guardrail + Web Speech sv-SE | | Trauma-RAG (ej auto — opt-in Kunskap) |
| ACT ValuesCompass + `mabra_progress` | | |
| `mabra_sessions` + rules/index | | |
| Complete + länkar | | |
| Obsidian Calm, ingen streak | | |

## Kladd 2026-05-21

- **Kladd:** Vagus, 3-stegs återhämtning, självmedkänsla, "tänksamma nej-et".
- **Avvisat:** Stjärnbilder, Nordisk skymning grön, VIVIR här (→ Speglar).
- **Gap:** coach RAG; ingen auto-ingest livshistoria.

**Deploy:** `firebase deploy --only firestore` krävs för `mabra_sessions` + `mabra_progress` rules i prod.

## Produktbeslut (låsta 2026-05)

Metadata sparas; symptom-hub; Obsidian Calm; ingen streak/natur; AI opt-in; länk inte auto till Kompasser/Dagbok.

Se §14 i [`Mabra-SPEC.md`](../../docs/specs/modules/Mabra-SPEC.md).

## Kopplingar

- **Dagbok** — länk efter övning med `?from=mabra&hub=…&energy=low`; humör-only eller kort rad — **done** (fas 2c)
- **Kompasser** — länk kväll (planerat)
- **Speglar** — guardrail vid ex-text → `/speglar` — **done** (fas 2e)
- **Hamn / Valv / Kunskap** — **ingen** datakoppling

Kod: `src/modules/mabra/` · Plan: [`src/modules/mabra/module_plan.md`](../../src/modules/mabra/module_plan.md)  
**Innehållsbank (frågekort, lekar, quiz-seed):** [`docs/specs/modules/Mabra-CONTENT-BANK.md`](../../docs/specs/modules/Mabra-CONTENT-BANK.md) · Kurator: `.cursor/agents/specialist-mabra-curator.md`
