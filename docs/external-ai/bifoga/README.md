# ChatBox — bifoga-mappar

Alla filer du ska **bifoga i ChatBox** ligger här i numrerade undermappar.  
Kanonen ligger kvar på originalplats (`docs/external-ai/*.md`) — denna mapp är **speglade kopior** för enkel upload.

## Innan varje ChatBox-chatt

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run chatbot:pack:handoff   # alla ChatBox-repomixar (snabb)
npm run chatbot:sync:bifoga    # kopierar register + leveranser hit
# Full inkl. gemini/ai-studio:
npm run chatbot:pack:all
```

Senaste sync: se [`SYNC-STAMP.txt`](./SYNC-STAMP.txt).

---

## Mappar

| Mapp | Innehåll | När |
|------|----------|-----|
| [`01-register/`](./01-register/) | BUILD-STATE, SECURITY-LOCK, SYNAPSE-LOCK, UPLOAD-UNIFIED, DEPLOY-WAVE, APPCHECK, DESIGN-KEEP, CHECKPOINT-LOG | **Alltid** vid PHASE-07 |
| [`02-leveranser/`](./02-leveranser/) | ChatBox-svar fas 01–05 | PHASE-07 final |
| [`03-prompter/`](./03-prompter/) | Master-prompt, PHASE-07, MODEL-PICKER, lathund | **Först** i chatten |
| [`05-research-handoff/`](./05-research-handoff/) | Register för Gemini Deep Research | Research-chattar |
| [`06-backend-masterplan-review/`](./06-backend-masterplan-review/) | **Prompt G** — 2 omgångar (register + kod) | Gemini Pro + Opus |
| [`04-repomix/`](./04-repomix/) | `chatbot-pack-security.md` | Efter `npm run chatbot:pack:security` |

---

## PHASE-07 — bifogningsordning (ChatBox, GPT-5.4 Mini)

1. Klistra in text från `03-prompter/CHATBOT-MASTER-PROMPT.md`
2. Bifoga hela mappen **`04-repomix/`** (eller bara `chatbot-pack-security.md`)
3. Bifoga hela mappen **`01-register/`** (7+ registerfiler)
4. Bifoga hela mappen **`02-leveranser/`**
5. Klistra in uppdrag från `03-prompter/PHASE-07-final-lock.md`

**Mac:** Öppna mappen i Finder (`Cmd + Shift + G` → klistra sökväg) · markera alla filer · dra till ChatBox.

**Sökväg:**

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/bifoga/
```

---

## Efter ChatBox

1. Spara svar → `docs/external-ai/leveranser/2026-06-15-fas-07-final.md`
2. CHECKPOINT-7 i **Cursor** (granska, smoke, uppdatera BUILD-STATE)
3. `npm run chatbot:sync:bifoga` igen om register ändrats

Se [`../CHATBOX-LATHUND.md`](../CHATBOX-LATHUND.md) · [`../CHECKPOINT-PROTOCOL.md`](../CHECKPOINT-PROTOCOL.md).
