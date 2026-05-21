# Verklighetsvalvet

**Sacred Feature (Sanningens Sköld).** **Route:** `/dagbok?tab=bevis` · **Redirect:** `/valv` · **AuthGate:** ja  
**Spec (konsoliderad):** [`docs/specs/incoming/Verklighetsvalvet-SPEC.md`](../../docs/specs/incoming/Verklighetsvalvet-SPEC.md)

## Syfte

**Lager 2** — WORM-bevisbank mot gaslighting. Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1). Plausible deniability via **Fyren** (dold ingång).

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `HjartatPage` | Kluster: Reflektion \| Bevis \| Speglar |
| `VaultPage` | PIN-gate, flikar Logga \| Sök, Stäng → Reflektion |
| `VaultEntryForm` | Enkel / tvåspalt / tresteg / magkänsel + media + röst |
| `VaultLogList` | Append-only lista + PDF per post |
| `ValvChatPanel` | Sök-flik → `valvChatQuery` |
| `FloatingDock` | Fyren: 3s BookOpen → WebAuthn → bevis |

**Inmatning:** `entryType` + `truth`; media = **en** `evidenceUrl`. Röst = Web Speech → text.

## Navigation

| Ingång | Beteende |
|--------|----------|
| **Fyren** (3s long-press BookOpen) | WebAuthn → PIN → `/dagbok?tab=bevis` |
| Flik **Bevis** (synlig idag) | Direkt till valv (svagare plausible deniability) |
| `/valv` | Redirect → `?tab=bevis`; standalone kräver gate |
| **Mål:** dölj Bevis-flik | Endast Fyren — när muskelminne sitter |

## Datamodell (WORM)

- **`reality_vault`:** action, truth, category, entryType, theirVersion, myReality, bodySignals, shield*, evidenceUrl, isLocked, weaverTags?, ownerId, createdAt — append-only
- **Async:** `weaveJournalEntry` → `vävaren_metadata` (filtreras i Valv-Chat)

## Backend

| Path | Data |
|------|------|
| Klient `saveVaultLog` | `reality_vault` (inte callable) |
| `uploadVaultEvidence` | Storage → `evidenceUrl` |
| `valvChatQuery` | RAG token-match, Sannings-Analytikern |
| `exportVaultRecordAsPdf` | Klient print per post |

**Drive idag:** → `kb_docs` only. Till valv = **manuellt godkännande** (låst beslut).

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Fyren, WebAuthn, PIN, WORM, 4 entry modes, media, röst, PDF/post, Valv-Chat, shake, flik-lås | Synlig Bevis-flik (produktgap), Zero Footprint idle | Dölj Bevis-flik, klickbara citations, Drive→valv, Dossier batch, Sanningens Ankare, CMEK, duress-PIN |

## Kladd 2026-05-21

- **Bevisprioritet:** Orosanmälan 2026-03-05, skola (Ann), barnsamtal, läkarintyg, sms-PDF tvåspalt.
- **Metod:** Hela sms-tråd som PDF — inte långa skärmdumpslingor.
- **Gap:** Vävaren skriver auto `vävaren_metadata` — godkännande före permanent tagg **planerat**.
- **Avvisat:** Auto Storage Agentic Vision; GAS-WORM; SVG magkänsel (→ text-chips).

## Säkerhet

- WORM rules + `assertWormPayload`
- WebAuthn (Fyren) + PIN (VaultPage)
- Valv-Chat RAM-reset vid flikbyte
- Kill Switch: 15 m/s², debounce 2s

## Produktbeslut (låsta 2026-05)

1. Drive → valv: **manuellt godkännande**
2. PDF: **klient per post**; Dossier callable senare
3. Valv-Chat: **nollställ vid flikbyte**
4. Auth: **WebAuthn + PIN** (duress senare)
5. Bevis-flik: **dölj** när Fyren sitter i muskelminnet

## Kopplingar

- **Dagbok** — Vävaren + delad Fyren
- **Valv-Chat** — [`valv_chatt.md`](valv_chatt.md)
- **Speglar** — EvidenceCompare
- **Kunskap** — skild RAG; Drive → kb_docs
- **Dossier** — planerad aggregation

Kod: `src/modules/verklighetsvalvet/` · Plan: [`src/modules/verklighetsvalvet/module_plan.md`](../../src/modules/verklighetsvalvet/module_plan.md) · Prompter: [`docs/specs/ai-prompts-heart.md`](../../docs/specs/ai-prompts-heart.md)
