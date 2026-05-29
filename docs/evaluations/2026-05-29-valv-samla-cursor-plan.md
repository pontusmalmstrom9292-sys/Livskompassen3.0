# Valv Samla — genomförbarhetsplan (Cursor)

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + kanon  
**Kanon:** [`Verklighetsvalvet-SPEC.md`](../specs/modules/Verklighetsvalvet-SPEC.md) · [`VALV-HUBB-SPEC.md`](../design/VALV-HUBB-SPEC.md) · [`src/modules/evidence/vault/module_plan.md`](../../src/modules/evidence/vault/module_plan.md)

## Slutsats

**Samla-zonen är delvis live** — manuell loggning, Valv-Chat och WORM fungerar. **Gap:** Inkast och G10-granskningskö sitter utanför zon Samla (Hem + Kunskap). Denna plan samlar dem under PIN i `vaultTab=logga` med HITL oförändrat (ingen auto-WORM).

## REASONS (kort)

| | |
|---|---|
| **Requirements** | En samlingsyta för bevis; Drive → valv endast efter bekräftelse |
| **Entities** | `reality_vault`, `inbox_queue`, `kb_docs` (skild) |
| **Approach** | Återanvänd `submitInkastLite`, `InboxReviewQueue`, `saveVaultLog` — ny `VaultSamlaHub` |
| **Structure** | Zon Samla · flik `logga` + vy `samlaView=granska` |
| **Operations** | `confirmInboxItem` → `reality_vault`; refresh lista |
| **Norms** | U1 tre silos; Obsidian Calm |
| **Safeguards** | MUST NOT auto-promote dagbok; MUST NOT cross-RAG |

## Källa → routing → UI (gap-tabell)

| Källa | Routing / collection | UI idag | Önskat i Samla |
|-------|----------------------|---------|----------------|
| Manuell form | `reality_vault` direkt | `VaultEntryForm` i Valv | **Behåll** (hub) |
| Inkast (text/fil) | `submitInkastLite` → persisted eller `inbox_queue` | `InkastLiteCard` på Hem | **VaultInkastCompact** i Samla |
| Drive G10 | `inbox_queue` → HITL | `InboxReviewQueue` i Kunskap | **Samma kö** i Samla + Drive-hint |
| Dagbok handoff | Länk only | `HandoffBox` | Oförändrat — ingen auto-WORM |
| Vävaren async | `vävaren_metadata` | Bakgrund | Exkluderas i Sök (oförändrat) |

## Vad som redan fungerar (fil:rad)

| Krav | Kod |
|------|-----|
| WORM create | `saveVaultLog` — `firestore.ts` ~145 |
| Fyra entryType | `VaultEntryForm.tsx` |
| highlight + citation → logga | `VaultPage.tsx` 91–94, 305–309 |
| G10 confirm → silo | `confirmInbox` — `inboxService.ts` 46–57 |
| Inkast callable | `submitInkastLite` — `inkastService.ts` 83–99 |
| Pinned / Ankare | `VaultLogList.tsx` 161–190, `VaultEntryForm` checkbox |

## Rekommenderade faser

### Fas 1.0 — VaultSamlaHub + Inkast kompakt

- `VaultSamlaHub.tsx`, `VaultInkastCompact.tsx`
- Länk till `?tab=bevis&vaultTab=logga&samlaView=granska`

### Fas 1.1–1.2 — Granskningskö i Valv

- `InboxReviewQueue` props: `prioritizeBevis`, `onBevisConfirmed`, `onBack`
- Efter bekräfta bevis → `highlightLogId` + refresh logs

### Fas 1.3 — SMS tvåspalt

- «Klistra hel tråd» i `two_column` — splitta He/Mig-rader heuristiskt

### Fas 2 — Drive HITL i Samla

- `VaultSamlaDriveHint` — copy + öppna kö (ingen ny callable)

## Bevaras (MUST NOT)

- Mönster, Orkester, Kunskapsbank, Aktörskarta (locked UX)
- Drive auto → endast `kb_docs` utan HITL
- `valvChatQuery` läser endast `reality_vault`

## Acceptans

- [x] Eval skriven
- [x] Fas 1.0–1.3 + Fas 2 (Drive-hint + granskningskö i Samla) — kod 2026-05-29
- [x] `npm run smoke:locked-ux` + `smoke:valv` + `npm run build` PASS
- [ ] Manuell #3, #16, #17 i [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md)

## Nästa steg

Svara **`kör Valv Samla Fas 2`** för utökad Drive-copy; deploy hosting efter godkännande.
