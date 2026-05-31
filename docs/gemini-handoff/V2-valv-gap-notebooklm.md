# V2 — Valv gap vs kanon

**Datum:** 2026-05-31  
**Källa:** Cursor baseline (kod + kanon) · jämför mot NotebookLM-svar  
**Relaterat:** [`V1-gemini-original-2026-05-31.md`](./V1-gemini-original-2026-05-31.md)

---

## 1. Fem SÄKRA UI-förbättringar (ingen `firestore.rules`)

| # | Förslag | Status | Nästa fil |
|---|---------|--------|-----------|
| 1 | **Klickbara citations** i `ValvChatPanel` → hopp till `logga` + highlight | **done** | `ValvChatPanel.tsx`, `VaultPage.tsx` (`handleCitationClick` + `highlightLogId`) |
| 2 | **EmptyState med knapp** i `VaultLogList` («Logga första bevis» → zon Samla) | **done** | `VaultLogList.tsx`, `VaultSamlaHub.tsx` (`#vault-samla-entry`) |
| 3 | **Sanningens Ankare** — filter/vy «Endast ankare» (`pinned`) | **done** 2026-05-31 | `VaultLogList.tsx`, `VaultPage.tsx` |
| 4 | **Ingress per forensik-underflik** (1 rad under `hamn_analys` / `speglar_fordjupat`) | **done** 2026-05-31 | `FORENSIC_TAB_INGRESS` + `VaultForensicPanel.tsx` |
| 5 | **Valv-drawer badge** — antal `weaver_pending` (read-only) | **done** | `NavigationDrawer.tsx`, `useWeaverPendingCount` |

Alla fem: endast React/copy/navigation — **ingen** ny collection-regel.

---

## 2. Tre FÖRBJUDNA förslag (U1 / kanon)

| # | Förslag | Varför FÖRBJUDET | Exempel på brott |
|---|---------|------------------|------------------|
| 1 | Valv-Chat RAG läser **Kunskap** (`kampspar` / `kb_docs`) | U1 — fjärde silo / cross-RAG | `valvChatQuery` joinar `kampspar` för «facit» |
| 2 | Publik **Kunskapsbank** utan PIN på `/vardagen` | Locked UX + Layered Defense | Flytta `VaultKunskapsbankPanel` till vardagen utan gate |
| 3 | **Auto-promotion** dagbok/journal → `reality_vault` utan HITL | WORM + Vävaren-kanon | `weaveJournalEntry` skriver direkt till beviskropp (ersatt av `weaver_pending` 2026-05-31) |

---

## 3. Gap-tabell — Vävaren polish

| Element | Finns i kod | Nästa steg | Status |
|---------|-------------|------------|--------|
| `VALV_ZONE_INGRESS` (1 rad/zon) | `vaultTabs.ts` + `VaultPage.tsx` | — | **done** |
| `VaultValvBreadcrumb` | `VaultValvBreadcrumb.tsx` | — | **done** |
| `vavarenCopy.ts` (gemensam copy) | `constants/vavarenCopy.ts` | — | **done** |
| Vävaren **godkännande** (HITL) | `weaver_pending`, `WeaverApprovalPanel`, callables | — | **done** 2026-05-31 |
| `VaultLogList` — AI-taggar disclaimer | `VaultLogList.tsx` | — | **done** |
| `ValvChatPanel` — exkluderar AI-taggar | `ValvChatPanel` + `VAVAREN_VALVCHAT_HINT` | — | **done** |
| `DossierPage` — valfritt AI-försätt | checkbox + `VAVAREN_DOSSIER_*` | BBIC PDF-mall (innehåll) | **DEFER** |
| EmptyState **med** handlingsknapp | `VaultLogList` + scroll till `#vault-samla-entry` | — | **done** 2026-05-31 |
| AI auto-taggning beviskropp | — | **REJECT** | **REJECT** |
| Progress bars / % | — | **REJECT** | **REJECT** |

---

## 4. NotebookLM — avvikelse?

Om NotebookLM föreslår något som **inte** står ovan: skärmdump → Cursor.  
Register vinner vid konflikt om U1/WORM: [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md).
