# ChatBox AI — extern handoff (Livskompassen v2)

## Mappstruktur (2026-06-18)

| Mapp | Innehåll |
|------|----------|
| **Rot** | Kanon-register (LIFE-OS, SECURITY, SYNAPSE, …) + `FIL-REGISTER.md` |
| [`notebooklm/`](./notebooklm/) | NotebookLM master-prompt + lathund |
| [`chatbox/`](./chatbox/) | ChatBox-prompter, modellval, fas-prompter i `phases/` |
| [`gemini/`](./gemini/) | Custom Gem, orkester, Flow-prompter |
| [`design/`](./design/) | UI/design handoff + våg-roadmap |
| [`meta/`](./meta/) | Cursor-handoff, setup kvar, snapshot-manifest |
| [`bifoga/`](./bifoga/) | Synkade kopior för upload (`npm run chatbot:sync:bifoga`) |
| [`gemini-kunskap/`](./gemini-kunskap/) | Gem Knowledge (`npm run gemini:sync:kunskap`) |


**Start här:** [`CHATBOX-LATHUND.md`](./chatbox/CHATBOX-LATHUND.md) — kort översikt utan prompter (7 dagar, CHECKPOINT, smoke, snapshot).

**Gemini Custom Gem:** [`gemini-kunskap/LÄS-MIG.md`](./gemini-kunskap/LÄS-MIG.md) · Orkester: [`GEMINI-ORKESTER-MASTER-PROMPT.md`](./gemini/GEMINI-ORKESTER-MASTER-PROMPT.md)

**UI/Design parallellt:** [`UI-DESIGN-HANDOFF.md`](./design/UI-DESIGN-HANDOFF.md) — hela planen + körfält så nav/moduler inte krockar med säkerhet/upload.

**Modul-våg B1–B4 (Valv → Hjärtat → Familjen → Vardagen):** [`UI-WAVE-ROADMAP.md`](./design/UI-WAVE-ROADMAP.md) · [`PHASE-08-valv-ui.md`](./chatbox/phases/PHASE-08-valv-ui.md)

**Cursor subagenter (Gemini → ChatBox före bygg):** [`prompts/PONTUS-RUN-GEMINI-CHATBOX.md`](./prompts/PONTUS-RUN-GEMINI-CHATBOX.md) · [`prompts/SPECIALIST-SUBAGENTS-HANDOFF.md`](./prompts/SPECIALIST-SUBAGENTS-HANDOFF.md)

7-dagars trial-plan för tungt kodarbete utanför Cursor/Google-krediter.

**Våg 28 innehåll (KEEP):** [`imports/research-2026-06-18-content-master.md`](./imports/research-2026-06-18-content-master.md) → [`../evaluations/2026-06-18-system-gap-syntes.md`](../evaluations/2026-06-18-system-gap-syntes.md)

**Deep Research (2026-06-18):** `GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER` + SA1–SA10 parallellt → Cursor [`CURSOR-FLOW-CREDITS-SYNTHESIS.md`](./bifoga/03-prompter/CURSOR-FLOW-CREDITS-SYNTHESIS.md) → `docs/evaluations/2026-06-18-system-gap-syntes.md`.

## Snabbstart

1. Välj modell → [`MODEL-PICKER.md`](./chatbox/MODEL-PICKER.md)
2. Ny chatt i ChatBox AI
3. Klistra [`CHATBOT-MASTER-PROMPT.md`](./chatbox/CHATBOT-MASTER-PROMPT.md)
4. Bifoga repomix (se fas-prompt)
5. Klistra `PHASE-0X-*.md`
6. Spara leverans i [`leveranser/`](./leveranser/) — **filnamn:** `2026-06-15-fas-07-kortnamn.md` (inte `docs:external-ai:…` eller `everanser:…`)
7. **CHECKPOINT i Cursor** → [`CHECKPOINT-PROTOCOL.md`](./CHECKPOINT-PROTOCOL.md)

## Bifoga till ChatBox (register + leveranser)

Alla filer för upload ligger i **[`bifoga/`](./bifoga/)** — undermappar `01-register` … `04-repomix`.

```bash
npm run chatbot:pack:security
npm run chatbot:sync:bifoga
```

Öppna i Finder: `docs/external-ai/bifoga/` → bifoga mapp för mapp i ChatBox.

## Repomix-paket

```bash
npm run gemini:pack:refresh
npm run chatbot:pack:security
npm run chatbot:pack:ui-design
npm run chatbot:sync:bifoga
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
| [`FIL-REGISTER.md`](./FIL-REGISTER.md) | **Var filer ska ligga** — undvik fel ChatBox-namn |
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
