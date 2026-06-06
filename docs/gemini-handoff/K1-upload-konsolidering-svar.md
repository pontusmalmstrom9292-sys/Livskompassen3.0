# K1 — Upload & Inkast-konsolidering (Cursor-granskat svar)

**Datum:** 2026-06-06  
**Källa:** Repomix `gemini-pack-konsolidering.md` + kodgranskning  
**Status:** SPEC-utkast godkänd för Fas 1 implementation

---

## UPLOAD-UNIFIED-SPEC.md (utkast)

### 1. Gap-tabell

| UI-yta | Callable | Collection | Beslut | Skäl |
|--------|----------|------------|--------|------|
| InkastLiteCard | submitInkastLite | silo/auto | **MERGE** | Duplikat av VaultInkastCompact |
| CapturePanel | submitInkastLite | silo/auto | **KEEP** | Confirm-flow + manuell tagg |
| HomeAdaptiveCompass inkast | submitInkastLite | silo/auto | **DEFER Fas 2** | Inbäddad i kompass-UX |
| VaultInkastCompact | submitInkastLite | silo/auto | **MERGE** | Samma som InkastLite |
| KunskapsvalvFileIngest | ingestKnowledgeDocument | kb_docs/kampspar | **KEEP** | Separat pipeline by design |
| SpeglarEvidencePanel | uploadVaultEvidence | reality_vault | **KEEP** | WORM direkt, Zero Footprint |
| SaveAsEvidencePrompt | saveVaultLog | reality_vault | **KEEP** | HITL locked UX |
| BarnportenInboxPanel | HITL prompt | — | **KEEP** | Barn locked UX |
| InboxReviewQueue (×4) | confirmInboxItem | varies | **MERGE Fas 2** | En mount i ArkivSuper |
| ReviewQueuePanel | submitCaptureDraft | draftQueue | **KEEP** | Lokal utkast — länka till Arkiv |

### 2. Canonical komponenter

```
CaptureSuperModule (variant)
├── hem-capture      → CapturePanel (confirm-flow)
├── hem-inkast       → InkastDirectPanel (direct + files)
├── valv-compact     → InkastDirectPanel (valv styling + callbacks)
├── planering        → CapturePanel sourceModule=planering_inkorg
└── kompass          → DEFER (HomeAdaptiveCompass inkast block Fas 2)
```

**InkastDirectPanel** — delad implementation:
- textarea + fil-uppladdning
- `submitInkastLite` direkt (ingen preview)
- success-länkar till granskningskö / valv

### 3. Review-kö

| Kö | Typ | Beslut |
|----|-----|--------|
| `inbox_queue` (cloud) | HITL efter G10 | **KEEP** — canonical i Valv Samla |
| `draftQueue` (IndexedDB) | Lokal utkast | **KEEP** — ReviewQueuePanel på Hem |
| 4× InboxReviewQueue mount | UI duplikat | **MERGE** — en i VaultSamlaHub, övriga → länk |

### 4. Migrering (3 faser)

**Fas 1 (min risk):** `CaptureSuperModule` + `InkastDirectPanel` — ingen backend, inga routes.  
**Fas 2:** Slå ihop InboxReviewQueue-mounts; Kompass inkast → CaptureSuperModule variant.  
**Fas 3:** Hem visar endast `hem-capture` (confirm) ELLER kombinerad «Skriv»-yta — ta bort dubbel InkastLiteCard.

### 5. MUST NOT

- Ändra `submitInkastLite` signatur eller silo-routing
- Cross-RAG
- Auto-promotion journal/children → reality_vault
- Ta bort SaveAsEvidencePrompt, Barnporten HITL, Valv Mönster/Orkester

---

## KEEP / MERGE / DELETE sammanfattning

| KEEP | MERGE | DELETE (Fas 3+) |
|------|-------|-----------------|
| CapturePanel logic | InkastLite + VaultCompact → InkastDirectPanel | Hem dubbel-yta |
| submitInkastLite backend | → CaptureSuperModule router | — |
| KunskapsvalvFileIngest | InboxReviewQueue UI | — |
| WORM direct uploads | | |
| draftQueue local | | |
