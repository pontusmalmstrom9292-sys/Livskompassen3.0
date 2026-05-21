# Måbra-sidan

**Route:** `/mabra` · **AuthGate:** ja · **Kluster:** hem (Måbra) · **Ej i dock**  
**Spec (konsoliderad):** [`docs/specs/incoming/Mabra-SPEC.md`](../../docs/specs/incoming/Mabra-SPEC.md)

## Syfte

Proaktiv rehab — KBT/ACT, vagus, självmedkänsla, värderingar. ADHD/GAD/RSD: kravlöst, ett steg i taget. **Inte** gaslighting-försvar (Speglar), **inte** ex (Hamn), **inte** daglig logg (Dagbok).

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `MabraPage` | Shell — placeholder `EmptyState` |

**Planerat MVP:** symptom-hub → 4-7-8 andning (offline) → mjukt avslut.

## Navigation

| Ingång | Beteende |
|--------|----------|
| Hem kluster Måbra | `/mabra` |
| FloatingDock | **Nej** |

## Datamodell (planerat)

- **`mabra_sessions`:** exerciseType, durationSeconds, ownerId, completedAt
- **`mabra_progress`:** coreValues (ACT) — senare
- **Inte:** RAG/Kunskap; **inte** streak

## Backend

- MVP: deterministiska övningar (klient)
- Fas 2: Måbra-coach callable (Gemini, `sharedRules.ts`)

## Status

| Klart | Planerat |
|-------|----------|
| Route, AuthGate, kluster, shell | Hub, andning, Firestore, coach, bro Dagbok/Kompasser |

## Produktbeslut (låsta 2026-05)

Metadata sparas; symptom-hub; Obsidian Calm; ingen streak/natur; AI opt-in; länk inte auto till Kompasser/Dagbok.

Se §14 i [`Mabra-SPEC.md`](../../docs/specs/incoming/Mabra-SPEC.md).

## Kopplingar

- **Dagbok** — valfri insikt + bro in (planerat)
- **Kompasser** — länk kväll (planerat)
- **Speglar** — guardrail vid ex-text (planerat)
- **Hamn / Valv / Kunskap** — **ingen** datakoppling

Kod: `src/modules/mabra/` · Plan: [`src/modules/mabra/module_plan.md`](../../src/modules/mabra/module_plan.md)
