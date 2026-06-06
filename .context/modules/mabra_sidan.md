# Måbra-sidan

**Kanonisk kod:** `src/modules/features/dailyLife/wellbeing/mabra/`  
**Route:** `/mabra` · **AuthGate:** ja · **Kluster:** Vardagen (MåBra) · **Ej i dock**  
**Spec (konsoliderad):** [`docs/specs/modules/Mabra-SPEC.md`](../../docs/specs/modules/Mabra-SPEC.md)

## Syfte

Proaktiv rehab — KBT/ACT, vagus, självmedkänsla, värderingar. ADHD/GAD/RSD: kravlöst, ett steg i taget. **Inte** gaslighting-försvar (Speglar), **inte** ex (Hamn), **inte** daglig logg (Dagbok).

## UI (MVP — klart)

| Komponent | Roll |
|-----------|------|
| `MabraPage` | Orchestrator — routing per symptom-hub |
| `SymptomHub` | 3 val: Panik/RSD, Självkritik, Hitta mig |
| `BreathingExercise` | 4-7-8 (panic: tid kvar; self_critical addon) |
| `GroundingExercise` | 5-4-3-2-1 (find_self), offline |
| `ReframingExercise` | 4 steg thought record light (self_critical), RAM-only |
| `ValuesCompass` | ACT — välj 3–5 värderingar |
| `MabraCoachPanel` | Opt-in coach efter övning + Speglar guardrail + röst |

## Navigation

| Ingång | Beteende |
|--------|----------|
| Vardagen → MåBra | `/mabra` |
| FloatingDock | **Nej** |
| Efter övning | Länk Hjärtat (`/hjartat`), Kompasser (`/vardagen?tab=kompasser`) — **inte** auto |

## Datamodell

- **`mabra_sessions`:** WORM (create/read)
- **`mabra_progress`:** `coreValues[]` (ACT) — mutable doc per user

## Backend

- MVP: deterministiska övningar (klient) + `saveMabraSession()` → Firestore
- `mabraCoach` callable (Gemini, `MABRA_COACHEN_SYSTEM_PROMPT` i `sharedRules.ts`)

## Kopplingar

- **Dagbok** — länk efter övning med `?from=mabra&hub=…&energy=low`
- **Speglar** — guardrail vid ex-text → `/hjartat?tab=speglar`
- **Hamn / Valv / Kunskap** — **ingen** datakoppling

Kod: `src/modules/features/dailyLife/wellbeing/mabra/` · Plan: [`src/modules/features/dailyLife/wellbeing/mabra/module_plan.md`](../../src/modules/features/dailyLife/wellbeing/mabra/module_plan.md)  
**Innehållsbank:** [`docs/specs/modules/Mabra-CONTENT-BANK.md`](../../docs/specs/modules/Mabra-CONTENT-BANK.md)
