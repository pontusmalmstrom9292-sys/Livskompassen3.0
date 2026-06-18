# PHASE-01 — Säkerhetslås (audit)

**Modell:** Claude Opus 4.8 (alt. Gemini 3.1 Pro)  
**Parallellt OK:** Sonar 2 — App Check research (separat chatt, docs only)  
**Repomix:** `exports/chatbot-handoff/chatbot-pack-security.md`

---

## Uppdrag (klistra in efter Master + repomix)

```
UPPDRAG: SECURITY-LOCK-MANIFEST för Livskompassen v2.

INVENTERA (från bifogad repomix — gissa inte):
1. WORM i firestore.rules: reality_vault, children_logs, journal, evolution_ledger, dossier_snapshots
2. Dual vault gate: unlockVault JWT + vaultSessionGate (callables)
3. callableGuards + App Check fail-closed när APP_CHECK_ENFORCE=true
4. SynapseBus — exakt 4 triggers, silo-routing i driveIngestSynapse (bevis → reality_vault, ALDRIG auto kb_docs)
5. routeFromDcap / resolveExecutorId — deterministisk, ingen LLM-auth
6. Sacred + locked UX §11–17 — lista vad som ALDRIG får ändras

LEVERANS: SECURITY-LOCK-MANIFEST.md med tabell:
| Komponent | Filer | Status KEEP/LOCK/OPEN | Smoke-kommando | Risk om ändras |

INGEN prod-kod i denna fas — audit och manifest endast.
Om lucka hittas: beskriv fix + vilken PHASE som ska implementera.

Avsluta med obligatorisk slutrad från Master-prompt.
```

**→ CHECKPOINT-1** efter leverans.
