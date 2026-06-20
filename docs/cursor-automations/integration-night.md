# Cursor Automation — Integration Night

**Namn:** Livskompassen Integration Night  
**Syfte:** Nattlig deterministisk smoke + extern-AI pack-sync utan LLM-kostnad.

## Trigger

- **Typ:** Schedule (cron)
- **Tid:** 02:00 Europe/Stockholm (justera i editor)

## Instruktioner

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run integration:night
```

## Säkerhet

- Ingen auto-deploy
- Ingen auto-commit utan explicit Pontus OK
- Vid FAIL: ett fixsteg i nästa agentsession

## Setup

1. Öppna Automations editor i Cursor
2. Schedule trigger 02:00
3. Klistra instruktioner ovan
