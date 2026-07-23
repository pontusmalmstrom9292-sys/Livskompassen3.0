# Unlock — MOD-VALV-INKAST Edge AI fire-and-forget bridge

Date: 2026-07-23
approved: yes
Pontus OK: Cursor Agent «Implement the plan» Fas24 Companion Waves 2026-07-23

## Modules

| Modul | Scope |
|-------|--------|
| MOD-VALV-INKAST | inkastService → analyzeIntelligenceNative fire-and-forget; no WORM auto-write from Edge AI event |

## MUST NOT

- Auto-write reality_vault / journal from livskompassen-intelligence
- Change firestore.rules / DCAP without separate PMIR
- Cloud LLM from Inkast for this bridge

## Smoke

```bash
npm run smoke:inbox
npm run smoke:module-lock
```
