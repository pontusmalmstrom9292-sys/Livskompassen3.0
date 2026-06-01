REFACTOR_DIAGNOSTICS.md

Syfte: här listas manuella import- eller byggfel som Cursor inte kan reparera automatiskt.

Instruktion: när Cursor eller du stöter på imports som inte uppdateras automatiskt, lägg till en rad här med filväg och vad som behöver ändras.

Exempel:
- src/modules/core/ui/Button.tsx -> TODO: exportera från '@/shared/ui/Button'
- src/modules/evidence/kompis/KompisCard.tsx -> TODO: uppdatera import av dateHelpers

Status: initial stubb-checkin av shared + navigation registry.
