# FIL-REGISTER — docs/external-ai/

**Syfte:** Var ska filer ligga? Undvik fel namn från ChatBox (`docs:external-ai:…`, `everanser:…`).

---

## Kanon (redigera här)

| Fil | Roll |
|-----|------|
| `LIFE-OS-BUILD-STATE.md` | LOCK/OPEN/WIP — levande sanning |
| `CHECKPOINT-LOG.md` | CP-historik |
| `LIFE-OS-CORE-LOCKED.md` | Vad som aldrig får refaktoreras |
| `SECURITY-LOCK-MANIFEST.md` | CP-1 säkerhet |
| `SYNAPSE-LOCK-SPEC.md` | CP-5 synapser |
| `UPLOAD-UNIFIED-SPEC.md` | CP-2 upload |
| `DEPLOY-CHATBOT-WAVE.md` | Deploy-rader |
| `APPCHECK-ENFORCE-GUIDE.md` | Console Enforce |
| `DESIGN-KEEP-REGISTER.md` | Design KEEP vs arkiv |
| `HYGIENE-LOG.md` | ARCHIVE-kandidater |
| `CURSOR-HANDOFF-OPEN.md` | Nästa Cursor-prompter |
| `PMIR-CHATBOT-WAVE1.md` | Merge-utkast våg 1 |

---

## Leveranser (ChatBox råsvar)

**Mapp:** `leveranser/`  
**Namn:** `YYYY-MM-DD-fas-NN-kortnamn.md`

| Fil | Innehåll |
|-----|----------|
| `2026-06-15-fas-01-security.md` … `fas-05-*` | Fas 1–5 |
| `2026-06-15-fas-07-final.md` | CP-7 sammanfattning (Cursor) |
| `2026-06-15-fas-07-chatbox-raw.md` | ChatBox råtext + fel-lista |
| `leveranser/ui-design/` | UI-våg B1–B4 |

**Spara INTE som:** `docs/external-ai/LIFE-OS-CORE-LOCKED.md` i filnamnet · `docs:external-ai:…` · `everanser:…`

---

## Bifoga (kopior för upload)

**Mapp:** `bifoga/01-register/` … `04-repomix/`  
**Uppdatera:** `npm run chatbot:sync:bifoga`  
**Git:** kopior ignoreras (`.gitignore`) — kanon styr.

---

## Fas-prompter (återanvänd)

`PHASE-01-security-lock.md` … `PHASE-08-valv-ui.md` · `CHATBOT-MASTER-PROMPT.md`

---

## Raderade felaktiga filer (2026-06-15 städ)

| Fel namn | Rätt handling |
|----------|----------------|
| `docs:external-ai:LIFE-OS-CORE-LOCKED.md` | Raderad → kanon `LIFE-OS-CORE-LOCKED.md` |
| `docs:external-ai:HYGIENE-LOG.md` | Raderad → kanon `HYGIENE-LOG.md` |
| `everanser:2026-06-15-fas-07-final.md` | Raderad → `leveranser/2026-06-15-fas-07-final.md` |
| `leveranser/2026-06-15-valv-supermodule-spec.md](..:..:evaluations:…)` | Raderad → kanon [`docs/evaluations/2026-06-15-valv-supermodule-spec.md`](../evaluations/2026-06-15-valv-supermodule-spec.md) |
| `leveranser/*.rtf` | Gitignore — använd `.md` (t.ex. `fas-03-backend-implementation.md`) |
| `content-autorun-vag-?.md` | Raderad → `docs/evaluations/2026-06-15-content-autorun-vag-ingen.md` |

---

## Arkiv-eval (hela vågen)

[`docs/evaluations/2026-06-15-chatbox-wave1.md`](../evaluations/2026-06-15-chatbox-wave1.md) — fix path: `2026-06-15-chatbox-wave1.md`
