# PATTERN-SCAN-SPEC — Valv Mönster v3 (sidecar)

**Status:** done (våg 23) · **Kanon:** WORM beviskropp oförändrad · **Library:** `shared/patterns/tacticPatternLibrary.ts`

## Syfte

Deterministisk taktik-tagging utan att mutera `reality_vault`. Sidecar `pattern_scan_metadata` lagrar regex-träffar som append-only metadata, läsbar i Mönster, Arkiv-lista och Dossier-filter/PDF-bilaga.

## Schema (`pattern_scan_metadata`)

| Fält | Typ | Not |
|------|-----|-----|
| `userId` / `ownerId` | string | Ägare |
| `sourceRef` | string | `reality_vault` docId (immutable länk) |
| `techniques` | string[] | t.ex. `DARVO`, `GASLIGHTING` |
| `patternIds` | string[] | library-id:n (`cn-darvo-001`, …) |
| `patternIdsHash` | string | idempotensnyckel |
| `kunskapFactIds` | string[]? | referens till `cn-*` (ingen cross-RAG) |
| `scanLayer` | `REGEX` \| `DCAP` | v23 ship: endast REGEX auto |
| `libraryVersion` | string | t.ex. `2026.06.1` |
| `matchedSpans` | `{patternId, excerpt}[]` | max 3 korta utdrag |
| `createdAt` | Timestamp | append-only |

## WORM-regler

- **Klient:** read-only (`firestore.rules` — create/update/delete forbidden).
- **Skriv:** endast Admin SDK via `writePatternScanMetadata` (callable/trigger).
- **Beviskropp:** `reality_vault` får aldrig få AI-taggar i payload eller dossier-hash (`VAULT_KEYS`).

## Triggers

| Trigger | Beteende |
|---------|----------|
| `onVaultCreatePatternScan` | Ny WORM-post → REGEX scan → append sidecar om ≥1 träff |
| `rescanPatternMetadata` (callable) | Batch re-scan alla poster, append vid ny hash/version |

## UI

- **Mönster:** `VaultMonsterPanel` — union live-regex + sidecar; «Skanna om» + `libraryVersion`.
- **Arkiv:** `VaultLogList` — chips från sidecar om finns, annars fallback-regex.
- **Dossier:** `techniqueFilter` + PDF-bilaga «Taktik-sammanfattning (regex-assisterad metadata)» — räknare only, ingen diagnos.

## Hamn (eparate spår)

`resolveHamnTheoryWithoutEvidence` — ephemeral-only, **ingen** `reality_vault`-läsning. Badge `TheoryWithoutEvidenceBadge variant="hamn"`.

## MUST NOT

- Cross-RAG till Kunskap från Valv-scan.
- Diagnosetiketter i WORM, sidecar eller dossier-beviskropp.
- Mutera befintliga `VaultLog`-fält.

## Smoke

- `npm run smoke:pattern-library`
- `npm run smoke:pattern-metadata`
- `npm run smoke:epistemic-guard`
- `npm run smoke:grans` (live `theoryWithoutEvidence`)

## Deploy

1. `firebase deploy --only firestore:rules,firestore:indexes`
2. `cd functions && npm run build && firebase deploy --only functions:onVaultCreatePatternScan,functions:rescanPatternMetadata,functions:writePatternScanMetadataCallable,functions:analyzeMessage,functions:generateDossier`
3. `npm run build && firebase deploy --only hosting`
