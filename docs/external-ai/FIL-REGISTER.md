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
| `GEMINI-GEM-SYSTEM-INSTRUCTION.md` | Custom Gem — System Instructions (klistra in i Gemini) |
| `GEMINI-GEM-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` | Samma instruktion — ren text för TextEdit/Gem (öppna denna) |
| `GEMINI-GEM-KNOWLEDGE.md` | Custom Gem — Knowledge File + Tier 1–3-lista |
| `GEMINI-GEM-SETUP.md` | Steg-för-steg Custom Gem-setup |
| `gemini-kunskap/` | **Alla knowledge-filer i en mapp** — `npm run gemini:sync:kunskap` |
| `GEMINI-ORKESTER-MASTER-PROMPT.md` | Gemini orkester — ChatBox/Flow/Cursor routing |
| `evaluations/2026-06-17-flow-pipeline-karta.md` | Flow P1/P2 Deep Research |
| `evaluations/MALL-deep-research-modul.md` | Mall före varje bygg |
| `bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md` | Deep Research — alla grundämnen (SA1–SA10) |
| `bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SA6.md` … `SA10.md` | Teknisk zon-audit |
| `bifoga/03-prompter/CURSOR-FLOW-CREDITS-SYNTHESIS.md` | Cursor subagent efter research |
| `imports/README.md` | Namnkonvention research-2026-06-18-* |
| `evaluations/2026-06-18-notebooklm-baseline.md` | NotebookLM baseline-frågor |
| `evaluations/2026-06-18-system-gap-syntes.md` | Output från syntes-subagent (efter research) |
| `imports/gap-matrix-2026-06-18.md` | KEEP/DEFER/REJECT + backend_impact |

| `gemini-kunskap/LÄS-MIG.md` | Upload-guide för Gem Knowledge |
| `GEMINI-GEM-BASELINE-VERIFY.md` | Baseline-frågor + förväntade svar efter setup |

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
