# Pack 05 — Familjen

**Senast uppdaterad:** 2026-06-15  
Ladda upp `exports/gpt-handoff/repomix/gpt-pack-05-familjen.md` till GPT när pack 01–04 är granskade.

**Kontext:** G10 Inkast **LOCK** (CP-3/4). Barnfokus och Barnporten inkorg→Valv är locked UX.

---

## Prompt för GPT

Du granskar **Familjen** (`/familjen`) — barnfokus, livslogg, Trygg Hamn (BIFF), Barnporten.

**Domän (~80% upload-prior):** covert HCF, barnobservationer, ex-sms — routing enligt DCAP före LLM.

**Fokus:**

1. Hub: `FamiljenPage` + tabbar (`reflektion`, `livslogg`, `tillsammans`, `barnporten`, `hamn`, `drogfrihet`)
2. **Låst:** `FamiljenBarnfokusDelegate`, `BARNFOKUS_QUESTIONS`, `FamiljenInputSuperModule`
3. Barnen-silo: `children_logs` via `childrenLogsService` — WORM
4. **HITL:** `SaveAsEvidencePrompt` — manuellt val att kopiera till Valv (`sourceRef`)
5. Barnporten: egen barn-PWA, `BarnportenInboxPanel` → Valv-bro (§7b design lock)
6. **Inkast:** `InkastBarnenValvBridge` — routing till barnen vs manuellt Valv-val
7. BIFF/Hamn: ephemeral via `analyzeMessage` — spara till Valv endast explicit

### Verifiera

- [ ] Barnloggar i `children_logs` — WORM (inga update/delete)
- [ ] Ingen auto-promote till `reality_vault`
- [ ] BIFF/Hamn ephemeral — spara → Valv endast via `SaveAsEvidencePrompt`
- [ ] `childrenLogsQuery` läser endast barnen-silo
- [ ] `barnenModuleRouteGuard` — Kunskap-RAG redirectar barn-intent → Familjen
- [ ] Dubbel navigation: hub-tabs (6) + inputMode-picker (6) — F3 öppen i Våg B

### Uppgift

1. Kartlägg alla vägar barnobservation → `children_logs` → ev. Valv (HITL).
2. Bedöm kognitiv belastning: Familjen tab + inputMode dubbelnav (F3-förslag).
3. Verifiera Barnporten ålderssegmentering via `evolution_hub` (`currentBracket`).
4. Föreslå max 2 förenklingar utan att röra locked UX.

**Ge INTE kod.** Beslutsmemo: Godkänn / Ändra X / Defer.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
