# ChatBox AI — extern handoff (Livskompassen v2)

**Start här:** [`CHATBOX-LATHUND.md`](./CHATBOX-LATHUND.md) — kort översikt utan prompter (7 dagar, CHECKPOINT, smoke, snapshot).

**UI/Design parallellt:** [`UI-DESIGN-HANDOFF.md`](./UI-DESIGN-HANDOFF.md) — hela planen + körfält så nav/moduler inte krockar med säkerhet/upload.

7-dagars trial-plan för tungt kodarbete utanför Cursor/Google-krediter.

## Snabbstart

1. Välj modell → [`MODEL-PICKER.md`](./MODEL-PICKER.md)
2. Ny chatt i ChatBox AI
3. Klistra [`CHATBOT-MASTER-PROMPT.md`](./CHATBOT-MASTER-PROMPT.md)
4. Bifoga repomix (se fas-prompt)
5. Klistra `PHASE-0X-*.md`
6. Spara leverans i [`leveranser/`](./leveranser/)
7. **CHECKPOINT i Cursor** → [`CHECKPOINT-PROTOCOL.md`](./CHECKPOINT-PROTOCOL.md)

## Repomix-paket

```bash
npm run gemini:pack:refresh
npm run chatbot:pack:security
npm run chatbot:pack:ui-design
```

| Pack | Sökväg | Körfält |
|------|--------|---------|
| Inkast | `exports/gemini-handoff/repomix/gemini-pack-inkast.md` | A |
| Konsolidering | `exports/gemini-handoff/konsolidering-upload/00-gemini-pack-konsolidering.md` | A |
| Security | `exports/chatbot-handoff/chatbot-pack-security.md` | A |
| **UI/Design** | `exports/chatbot-handoff/ui-design-pack.md` | **B** |

## Levande register

| Fil | Roll |
|-----|------|
| [`LIFE-OS-BUILD-STATE.md`](./LIFE-OS-BUILD-STATE.md) | LOCK / OPEN / WIP per komponent |
| [`CHECKPOINT-LOG.md`](./CHECKPOINT-LOG.md) | Datum, resultat, planändringar |
| [`HYGIENE-LOG.md`](./HYGIENE-LOG.md) | KEEP / ARCHIVE / DELETE per städrunda |
| [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md) | Aktiv design vs arkiv |

## Lokal backup

```bash
./scripts/snapshot_locked_module.sh valv
```

Kopior: `~/Livskompassen-snapshots/`

Plan: [`.cursor/plans/chat-bot_7-dagars_life_os_a9a6ae75.plan.md`](../../.cursor/plans/chat-bot_7-dagars_life_os_a9a6ae75.plan.md)
