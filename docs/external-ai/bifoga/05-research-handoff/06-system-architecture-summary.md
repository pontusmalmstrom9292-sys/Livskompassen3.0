# System Architecture Summary: Pelare 3 - Vardagens Arkitektur

**Senast synkad:** 2026-06-19 · Källfiler i `docs/system_sync/*_CURRENT.*` · styrning: `system_plan_CURRENT.md`, `locked_ux_features_CURRENT.md` · säkerhet: `firestore_rules_CURRENT.rules`, `storage_rules_CURRENT.rules`

Detta dokument beskriver nuläget för Livskompassen v2 med fokus på "Pelare 3: Vardagens Arkitektur" (Everyday Architecture) och hur Capability Engine ("Lagen om Evig Tillväxt") samverkar med Firestore.

## Styrning och säkerhetsgränser (Kunskapsbank-synk)

För extern AI (NotebookLM, Gemini) — **ersätt alltid gamla uppladdningar** med filerna i denna mapp:

| Fil | Källa | Innehåll |
|-----|-------|----------|
| `system_plan_CURRENT.md` | `.context/system-plan.md` | Faser, modulmappning, Fas 6 Superhub **AVSLUTAD** 2026-06-14 |
| `locked_ux_features_CURRENT.md` | `.context/locked-ux-features.md` | Låsta UX-flöden inkl. §11 `MabraInputSuperModule` (WORM, Zero Footprint, HITL inkast) |
| `firestore_rules_CURRENT.rules` | `firestore.rules` | WORM, vault-unlock, ownerId, `isSensitiveAuth`, samtliga collection-matchers |
| `storage_rules_CURRENT.rules` | `storage.rules` | WORM media: `vault_evidence`, `project_media`, `children_logs_media`, `journal_memories`, `dossier_exports` |
| `package_CURRENT.json` | `package.json` | Scripts, dependencies, smoke-kommandon |
| `tailwind_CURRENT.js` | `tailwind.config.js` | Obsidian Calm tokens och Tailwind-konfiguration |
| `tsconfig_CURRENT.json` | `tsconfig.json` | TypeScript-projektkonfiguration |
| `tsconfig_core_strict_CURRENT.json` | `tsconfig.core-strict.json` | Strikt TS för core-moduler |

**Uppdatera Kunskapsbank:** `npm run sync:system` → ladda upp hela `docs/system_sync/` (ta bort äldre versioner av samma filer i NotebookLM). Vid regeländring: inkludera alltid båda `*_rules_CURRENT.rules`.

## Pelare 3: Vardagens Arkitektur
Målet med Pelare 3 är att bygga ett ekonomiskt och logistiskt ekosystem anpassat för kognitiv trötthet och ADHD. Det rör sig från en basnivå av skuld- och stressfri konsumtion, där enbart enkla saldon syns, till mer avancerade verktyg såsom impulsfördröjnings-köer, budgetkuvert och Kanban-planering. Allt detta styrs dynamiskt utifrån användarens aktuella mående och kapacitet.

## Interaktion mellan Capability Engine och Firestore

### 1. Data-Ingest och Indikatorer
Capability Engine beräknar användarens aktuella "kognitiva kapacitet" kontinuerligt ("Capacity Score", värde mellan 0.0 och 1.0). Denna beräkning utgår primärt från:
- **`mabra_checkin`**: Användarens senaste incheckningar för `mood` och `energy` (beräknas som ett rullande 7-dagarsmedelvärde).
- **`mabra_progress`**: Antal identifierade kärnvärden i ACT/KBT-flödet. Antal värden (t.ex. > 5) påverkar direkt "scoren".

### 2. Orkester-utvärdering (Backend)
- Ett bakgrundsjobb (`orkester_capability_gate.mjs`) läser MåBra-dokument (`mabra_progress` / `checkins`).
- Orkestern kalkylerar den aktuella `capacityScore` (0.2, 0.5, 1.0 etc.).
- Beroende på om användarens score överstiger tröskelvärdet (`THRESHOLD_STABLE = 0.5`) sätts flaggor såsom `economy_advanced = true`.
- Detta tillstånd sparas ned till Firestore-samlingen **`user_capability_state`** för den aktuella användaren.

### 3. Progressive History (WORM)
- Eventuella "nivåkliv" och milstolpar måste loggas till **`evolution_ledger`** som är en WORM-samling (Write Once, Read Many). 
- Tillståndet kan representeras i en mutable datamodell (oftast `evolution_hub` eller i detta fall den proxy som är `user_capability_state`), men varje evolutionärt språng ligger bevarat i ledger-historiken.

### 4. Konsumtion via Client Store (Zustand)
- En dedikerad hook, **`useCapacityGate`**, lyssnar realtid på `doc(db, 'user_capability_state', uid)`.
- Reaktivt (onSnapshot) uppdateras det globala kliento-tillståndet (`CapacityGateState`) med booleska flaggor (ex. `isEconomyAdvancedUnlocked`) och `capacityScore`.
- UI-komponenter för Pelare 3 läser flaggan. Om användaren har låg kapacitet tvingas gränssnittet till en "Paralys-Panel" som enbart visar det allra mest nödvändiga (mikrosteg, förenklad vy). Om kapaciteten är stabil och `isEconomyAdvancedUnlocked` är sann, blottläggs full Kanban, budgetkuvert, smarta widgets osv.

### Sammanfattning
Denna design (Capability Engine ↔ Firestore) säkerställer att applikationen aldrig överväldigar användaren. Alla avancerade layouter och vyer bakom Pelare 3 hålls dolda tills datadriven "emotionell och kognitiv puls" (inläst via Firestore) ger systemet godkännande att låsa upp funktionerna.
