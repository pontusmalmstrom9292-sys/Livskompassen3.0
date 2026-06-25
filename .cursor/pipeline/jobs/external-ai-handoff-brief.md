---
PIPELINE PACKAGE: external-ai-handoff
LABEL: Extern AI kanon-sync
MODEL: composer-2.5-fast
SCOPE: import-gate-only

REPOMIX CONTEXT: docs/external-ai/bifoga/05-research-handoff/SYNC-STAMP.txt

---

# Pipeline: External AI Handoff

Import coordinator only — NOT implementer. Validate via INTEGRATION-SAFETY-MANIFEST. FACT → CANDIDATE. No direct code edits.


---
VERIFY before claiming done:
  - cd functions && npm run build
  - npm run build
  - npm run smoke:predeploy

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
