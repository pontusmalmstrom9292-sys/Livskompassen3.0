# Valv-zoner — implementation 2026-05-25

**Spec:** [`docs/specs/modules/VAULT-ZONE-REGISTER.md`](../specs/modules/VAULT-ZONE-REGISTER.md)

## Resultat

| Zon | Gate | Publikt skikt | Status |
|-----|------|---------------|--------|
| `valv_core` | Fyren 3s + PIN | Dold (`HIDE_BEVIS_TAB`) | Oförändrat |
| `hamn_forensic` | `TryggHamnHub` → Analys | `BiffPublicPanel` (Grey Rock) | **PASS** |
| `speglar_forensic` | `SpeglingsSystem` fördjupning | ACT-kalibrering | **PASS** (redan) |
| `familjen_forensic` | Mönster + Kunskap RAG | Reflektion, livslogg, tillsammans, barnfokus | **PASS** |
| `dagbok_forensic` | Journalarkiv, vävare, Kampspár-opt-in | Humör + reflektion spara | **PASS** |

## Zero Footprint (solo-läge)

- Zonsession rensas vid **flik-byte** (unmount `VaultZoneGate` med `clearOnUnmount`, samt `HjartatPage` rensar `dagbok_forensic` vid byte från Reflektion).
- **15 min idle** via `useVaultZoneIdle` — aktivitetslyssnare (`pointerdown`, `keydown`, `touchstart`, `scroll`); **ingen blur**.
- `dagbok_forensic`: `clearOnUnmount={false}` så steg-byte (humör → text → spara) behåller session; idle + Hjartat-flikbyte rensar ändå.
- Kill switch + logout: `clearAllVaultZones()` (befintligt).

## Ändrade filer

| Fil | Ändring |
|-----|---------|
| `VaultZoneGate.tsx` | `clearOnUnmount`, `onUnlocked` |
| `useVaultZoneIdle.ts` | Idle med aktivitets-reset |
| `FamiljenPage.tsx` | Gate `monster` + `kunskap` |
| `FamiljenKunskapHubTab.tsx` | Tog bort separat `isVaultUnlocked`-check |
| `DagbokPage.tsx` | Gate journalarkiv; Kampspár-opt-in bakom zon |
| `ConfirmStep.tsx` | `showWeaveOptIn` |
| `useJournalFlow.ts` | Vävare/Kampspár endast om `dagbok_forensic` |
| `HjartatPage.tsx` | Rensar `dagbok_forensic` vid flik-byte |
| `smoke_orkester_wiring.mjs` | Statiska valv-zon-kontroller |

## Smoke

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | **PASS** |

## Manuell kontroll (rekommenderad)

1. Familjen → Mönster/Kunskap: PIN krävs; byte till Reflektion låser om.
2. Dagbok → Reflektion: journalarkiv bakom PIN; efter upplåsning syns Kampspár-checkbox på steg 3.
3. Hamn → BIFF: Grey Rock utan PIN; Analys kräver PIN.
