# DOC-INDEX — var hittar jag vad?

**Senast uppdaterad:** 2026-07-22 (docs-kanon + Cursor-index)  
**Regel:** Om två filer säger olika saker — **`docs/PROJECT_STATE.md` vinner** för fas; GAP-register vinner för GAP; `.context/security.md` vinner för säkerhet.

---

## 0. Cursor-index (läs detta)

[`.cursorignore`](../.cursorignore) indexerar **aktiv kanon**, inte hela historikhögen.

| Cursor läser | Cursor indexerar inte |
|--------------|------------------------|
| Rot (`widget_bible.md`, `AGENTS.md`, …), `.context/`, `docs/*.md`, `docs/governance/`, `docs/specs/`, `docs/design/`, `.cursor/` | `docs/archive/**`, kalla `docs/evaluations/*`, `exports/**`, bifoga-/repomix-speglar |

Inventering: [`evaluations/2026-07-22-md-inventory.md`](evaluations/2026-07-22-md-inventory.md)  
DELETE-förslag (väntar Pontus-OK): [`evaluations/2026-07-22-md-delete-proposal.md`](evaluations/2026-07-22-md-delete-proposal.md)

---

## 1. Vad gäller nu? (läs dessa först)

| Fråga | Fil |
|-------|-----|
| Systemfas + aktivt program | [`docs/PROJECT_STATE.md`](PROJECT_STATE.md) (**Fas 24** · Premium UI Phase 10) |
| AI-workflow / DoD | [`docs/AI-GOVERNANCE.md`](AI-GOVERNANCE.md) |
| Fas 24-syntes | [`docs/evaluations/2026-06-25-app-plan-syntes.md`](evaluations/2026-06-25-app-plan-syntes.md) |
| Widgets | [`widget_bible.md`](../widget_bible.md) · `docs/design/*WIDGET*` |
| Säkerhet (WORM, ZF, Device Clear) | [`.context/security.md`](../.context/security.md) |
| GAP / arkiv | [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](specs/modules/Arkiv-GAP-REGISTER.md) |
| Låst UX (får inte tas bort) | [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) |
| Routes + moduler | [`docs/MODUL-FUNKTIONS-REGISTER.md`](MODUL-FUNKTIONS-REGISTER.md) |
| Guard / PMIR | [`docs/governance/GUARD-REGLERBOK.md`](governance/GUARD-REGLERBOK.md) |

**Nästa arbetsgren:** Fas 24 P0 — G85 7-dagars daily driver; Premium UI Phase 10 (legacy CSS sunset). Ingen ny feature utan PMIR.

---

## 2. Var lägger jag nya filer?

| Typ | Mapp | Exempel |
|-----|------|---------|
| Beslut / eval | `docs/evaluations/` | `2026-06-16-nav-pmir.md` |
| Modul-SPEC | `docs/specs/modules/` | `Mabra-INPUT-SUPERHUB-SPEC.md` |
| Design (aktiv) | `docs/design/` | endast KEEP enligt register |
| ChatBox-leverans | `docs/external-ai/leveranser/` | `2026-06-16-fas-09-vision.md` |
| Extern granskning (Prompt G) | [`docs/external-ai/bifoga/06-backend-masterplan-review/`](external-ai/bifoga/06-backend-masterplan-review/) — `npm run chatbot:sync:backend-review` |
| Handoff (genereras) | `exports/chatbot-handoff/` | `npm run chatbot:pack:handoff` |
| NotebookLM (genereras) | `exports/google-ai-pro/notebooklm/` | `npm run notebooklm:pack:all` |
| Arkiv (historik) | `docs/archive/` | flyttade utkast — **inte** sanning |
| Äldre Gemini-handoff | `docs/archive/gemini-handoff-2026-06/` | superseded av `external-ai/leveranser/` |

---

## 3. Vad är arkiv vs aktiv?

| Mapp | Roll |
|------|------|
| `docs/archive/` | Historik — läs för kontext, bygg inte härifrån |
| `docs/archive/2026-07-17-doc-städ/` | Doc-städ: FAS13–23 sprintar + YOLO v17–v23 (stubbar kvar i `docs/`) |
| `docs/archive/evaluations-pre-2026-07/` | Evaluations före juli 2026 (flytt 2026-07-22) |
| `docs/archive/evaluations-2026-07-session-logs/` | Juli YOLO-/security-/drift-sessionloggar |
| `docs/archive/external-ai-imports-2026-06/` | Research-/gap-importer från external-ai |
| `docs/archive/design-2026-06/` | Design-lab (icons, themes, planering-variants PNG) |
| `exports/` | **Regenereras** — bifoga till ChatBox, redigera inte manuellt |
| `docs/external-ai/bifoga/` | Speglad kopia för ChatBox upload — `npm run chatbot:sync:bifoga` |
| `exports/google-ai-pro/notebooklm/` | NotebookLM kärna-pack — `npm run notebooklm:sync` |

---

## 4. AI-verktyg — vilket för vad?

| Verktyg | När | Pack / prompt |
|---------|-----|----------------|
| **Cursor** | Prod-kod, smoke, LOCK | — |
| **Gemini Custom Gem** | CTO/arkitekt, orkester | [`GEMINI-ORKESTER-MASTER-PROMPT.md`](external-ai/GEMINI-ORKESTER-MASTER-PROMPT.md) + [`gemini-kunskap/`](external-ai/gemini-kunskap/) |
| **Gemini chat (utan Gem)** | Tech Lead en session i taget | [`google-ai-pro/GEMINI-TECH-LEAD.md`](google-ai-pro/GEMINI-TECH-LEAD.md) |
| **ChatBox** | SPEC, PMIR, wireframes | `exports/chatbot-handoff/` + `bifoga/` |
| **Google AI Studio** | Design-remix + mockup-bild | `npm run design:pack` + `docs/ai-studio/DESIGN-REMIX-PROMPT.md` |
| **NotebookLM** | Research, motsägelser | `npm run notebooklm:pack:all` → `exports/google-ai-pro/notebooklm/` |
| **Google Flow** | AI-tunga pipelines (Dossier, Brusfilter) | Gem levererar nodgraf — se [`GEMINI-GEM-KNOWLEDGE.md`](external-ai/GEMINI-GEM-KNOWLEDGE.md) §4 |

Se [`docs/external-ai/MODEL-PICKER.md`](external-ai/MODEL-PICKER.md).

---

## 5. Design — vad är aktivt?

Kanon: [`docs/external-ai/DESIGN-KEEP-REGISTER.md`](external-ai/DESIGN-KEEP-REGISTER.md)

**~83 aktiva filer** i `docs/design/` (KEEP enligt [`DESIGN-KEEP-REGISTER.md`](external-ai/DESIGN-KEEP-REGISTER.md)). Lab/utkast ligger i `docs/archive/design-2026-06/` (~244 filer). Rör inte arkiverade icons-proposals utan hygiene-PMIR.

---

## 6. Kommandon (handoff)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run chatbot:pack:handoff    # alla ChatBox-repomixar
npm run chatbot:sync:bifoga     # speglar till bifoga/
npm run notebooklm:pack:all     # NotebookLM kärna (inkl. repomix + system_sync)
npm run gemini:sync:kunskap     # Gemini kunskap-mapp (upload till Gem)
npm run gemini:pack:all         # Gem + NotebookLM + kunskap-sync
```

Bifoga-mapp: `docs/external-ai/bifoga/` — se [`bifoga/README.md`](external-ai/bifoga/README.md).  
NotebookLM: [`NOTEBOOKLM-LATHUND.md`](external-ai/NOTEBOOKLM-LATHUND.md).

---

## 7. Kanon-tier (planering-kanon-guard)

1. `docs/PROJECT_STATE.md` (systemfas + program)
2. `.context/system-plan.md`
3. `docs/specs/modules/Arkiv-GAP-REGISTER.md`
4. `.context/security.md` · `.context/locked-ux-features.md`
5. `docs/AI-GOVERNANCE.md` · `docs/governance/GUARD-REGLERBOK.md`
6. `docs/INNEHALL-REGISTER.md`
7. `docs/evaluations/2026-06-25-app-plan-syntes.md` (Fas 24)
8. Historik: `docs/evaluations/2026-06-15-fas19-masterplan-v2.md` (ej aktiv styrning)
