# FIL-REGISTER — docs/external-ai/

**Syfte:** Var ska filer ligga? Undvik fel namn från ChatBox (`docs:external-ai:…`, `everanser:…`).

---

## Kanon (redigera här — rot)

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
| `meta/CURSOR-HANDOFF-OPEN.md` | Nästa Cursor-prompter |
| `chatbox/PMIR-CHATBOT-WAVE1.md` | Merge-utkast våg 1 |
| `gemini/GEMINI-GEM-SYSTEM-INSTRUCTION.md` | Custom Gem — System Instructions (klistra in i Gemini) |
| `gemini/GEMINI-GEM-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` | Samma instruktion — ren text för TextEdit/Gem (öppna denna) |
| `gemini/GEMINI-GEM-KNOWLEDGE.md` | Custom Gem — Knowledge File + Tier 1–3-lista |
| `gemini/GEMINI-GEM-SETUP.md` | Steg-för-steg Custom Gem-setup |
| `gemini-kunskap/` | **Alla knowledge-filer i en mapp** — `npm run gemini:sync:kunskap` |
| `gemini/GEMINI-ORKESTER-MASTER-PROMPT.md` | Gemini orkester — ChatBox/Flow/Cursor routing |
| `gemini/GEMINI-GEM-BASELINE-VERIFY.md` | Baseline-frågor + förväntade svar efter setup |
| `gemini-kunskap/LÄS-MIG.md` | Upload-guide för Gem Knowledge |
| `imports/README.md` | Namnkonvention `research-2026-06-18-*` (`.md` only) |
| `imports/research-2026-06-18-master-syntes.md` | Deep Research SYSTEM-AUDIT svar |
| `imports/research-2026-06-18-content-master.md` | Dirigent våg 28 — 5 KEEP-poster |
| `imports/gap-matrix-2026-06-18.md` | KEEP/DEFER/REJECT + backend_impact |
| `bifoga/05-research-handoff/` | Exakt 10 filer — `npm run research:sync:handoff` |
| `../evaluations/2026-06-17-flow-pipeline-karta.md` | Flow P1/P2 + gate §11 |
| `../evaluations/2026-06-18-system-gap-syntes.md` | Syntes + våg 28 KEEP + PMIR A/B/C |
| `../evaluations/MALL-deep-research-modul.md` | Mall före varje bygg |
| `bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md` | Deep Research — alla grundämnen (SA1–SA10) |
| `bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SA6.md` … `SA10.md` | Teknisk zon-audit |
| `bifoga/03-prompter/CURSOR-FLOW-CREDITS-SYNTHESIS.md` | Cursor subagent efter research |

## Undermappar (städad 2026-06-18)

| Mapp | Filer |
|------|-------|
| `notebooklm/` | `README.md`, `NOTEBOOKLM-MASTER-PROMPT.md`, `NOTEBOOKLM-LATHUND.md` |
| `chatbox/` | `README.md`, `CHATBOT-MASTER-PROMPT.md`, `CHATBOX-LATHUND.md`, `MODEL-PICKER.md`, `PMIR-CHATBOT-WAVE1.md` |
| `chatbox/phases/` | `README.md`, `PHASE-01` … `PHASE-08`, `PHASE-DESIGN-AUDIT` |
| `gemini/` | `README.md`, `GEMINI-GEM-*`, `GEMINI-ORKESTER-*`, `GEMINI-FLOW-*`, `GEMINI-FIRST-MODULE-GATE.md` |
| `design/` | `README.md`, `UI-DESIGN-HANDOFF.md`, `UI-DESIGN-MASTER-PROMPT.md`, `UI-WAVE-ROADMAP.md` |
| `meta/` | `README.md`, `CURSOR-HANDOFF-OPEN.md`, `SETUP-REMAINING.md`, `MODULE-SNAPSHOT-MANIFESTS.md` |
| `imports/` | `README.md`, `research-2026-06-18-*.md`, `gap-matrix-*.md` |
| `bifoga/` | `README.md`, `01-register/` … `06-backend-masterplan-review/` |

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

`chatbox/phases/PHASE-01-security-lock.md` … `PHASE-08-valv-ui.md` · `chatbox/CHATBOT-MASTER-PROMPT.md`

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
