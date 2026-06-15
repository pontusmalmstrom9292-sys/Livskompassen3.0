# Pack 05 — Familjen

Ladda upp `exports/gpt-handoff/repomix/gpt-pack-05-familjen.md` till GPT när pack 01–04 är granskade.

---

## Prompt för GPT

Du granskar **Familjen** (`/familjen`) — barnfokus, livslogg, Trygg Hamn (BIFF), Barnporten.

**Fokus:**

1. Hub: `FamiljenPage` + tabbar (`reflektion`, `livslogg`, `tillsammans`, `barnporten`, `hamn`)
2. **Låst:** `FamiljenBarnfokusDelegate`, `BARNFOKUS_QUESTIONS`, `FamiljenInputSuperModule`
3. Barnen-silo: `children_logs` via `childrenLogsService`
4. **HITL:** `SaveAsEvidencePrompt` — manuellt val att kopiera till Valv
5. Barnporten: egen barn-PWA, inkorg→Valv-bro

### Verifiera

- [ ] Barnloggar i `children_logs` — WORM
- [ ] Ingen auto-promote till `reality_vault`
- [ ] BIFF/Hamn ephemeral — spara till Valv endast via explicit prompt
- [ ] `childrenLogsQuery` läser endast barnen-silo

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
