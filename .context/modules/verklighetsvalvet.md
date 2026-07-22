# Verklighetsvalvet

**Kanonisk kod:** `src/modules/features/lifeJournal/evidence/vault/`  
**Sacred Feature (Sanningens Sköld).** **Route:** `/valvet?vaultTab=…` · **Legacy:** `/dagbok?tab=bevis`, `/valv` → redirect · **AuthGate:** ja  
**Locked UX:** [`.context/locked-ux-features.md`](../locked-ux-features.md) §2 Pansaret + **§2b Samla** (Inkast+Arkiv+Sök — aldrig Inkast-only) · modul-lås `MOD-VALV-SAMLA`  
**Spec (konsoliderad):** [`docs/specs/modules/Verklighetsvalvet-SPEC.md`](../../docs/specs/modules/Verklighetsvalvet-SPEC.md)

## Syfte

**Lager 2** — WORM-bevisbank mot gaslighting. Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1). Plausible deniability via **Fyren** (dold ingång).

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `ValvetRoutePage` / `VaultPage` | PIN-gate, zoner + flikar (Arkiv, Mönster, Orkester, …) |
| `VaultEntryForm` | Enkel / tvåspalt / tresteg / magkänsel + media + röst |
| `VaultLogList` | Append-only lista + PDF per post |
| `ValvChatPanel` | Sök-flik → `valvChatQuery` |
| `FloatingDock` | Fyren: 3s BookOpen → WebAuthn → Valv |

**Terminologi (låst):** se [`valvNavCopy.ts`](../../src/modules/core/copy/valvNavCopy.ts) — t.ex. flik `logga` = **Arkiv**, drawer **Bevis** = Valv-zon.

## Navigation

| Ingång | Beteende |
|--------|----------|
| **Fyren** (3s long-press BookOpen) | WebAuthn → PIN → `/valvet` |
| Drawer Valv-sektion (efter PIN) | `/valvet?vaultTab=…` |
| `/dagbok?tab=bevis` | Redirect → `/valvet?vaultTab=…` |
| `/valv`, `/kunskap`, `/dossier` | Redirect → `/valvet?vaultTab=…` |

**Hjärtat har ingen Bevis-flik** — Valv är egen silo-route (`NAV_PATHS.VALVET`).

## Datamodell (WORM)

- **`reality_vault`:** action, truth, category, entryType, theirVersion, myReality, bodySignals, shield*, evidenceUrl, isLocked, weaverTags?, ownerId, createdAt — append-only
- **Async:** `weaveJournalEntry` → `vävaren_metadata` (filtreras i Valv-Chat)

## Backend

| Path | Data |
|------|------|
| Klient `saveVaultLog` | `reality_vault` (inte callable) |
| `uploadVaultEvidence` | Storage → `evidenceUrl` |
| `valvChatQuery` | RAG token-match, Sannings-Analytikern |
| `issueVaultSession` | Server-side valv-session gate |
| `exportVaultRecordAsPdf` | Klient print per post |

**Drive (G10):** `classifyInboxDocument` → `kb_docs` | `reality_vault` (bevis) | `children_logs` | `inbox_queue` (trauma/LVU utan optIn). Bevis **MUST NOT** till `kb_docs`.

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Fyren, WebAuthn, WORM, entry modes, media, röst, PDF/post, Valv-Chat, flik-lås, issueVaultSession, Zero Footprint (G17), Drive G10→rätt silo, klickbara citations, Sanningens Ankare | — | CMEK (infra), duress-PIN |

## Säkerhet

- WORM rules + `assertWormPayload`
- WebAuthn (Fyren) + PIN (VaultPage) + `issueVaultSession`
- Valv-Chat RAM-reset vid flikbyte
- Device Clear (ersätter Kill Switch)

## Kopplingar

- **Dagbok** — Vävaren + delad Fyren
- **Valv-Chat** — [`valv_chatt.md`](valv_chatt.md)
- **Speglar** — EvidenceCompare
- **Kunskap** — skild RAG; Drive G10 → rätt silo (bevis → `reality_vault`)
- **Dossier** — `generateDossier` callable

Kod: `src/modules/features/lifeJournal/evidence/vault/` · Plan: [`src/modules/features/lifeJournal/evidence/vault/module_plan.md`](../../src/modules/features/lifeJournal/evidence/vault/module_plan.md)
