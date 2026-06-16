# DOC-INDEX — var hittar jag vad?

**Senast uppdaterad:** 2026-06-16 (Backend masterplan PMIR)  
**Regel:** Om två filer säger olika saker — **register vinner** (se tabell nedan).

---

## 1. Vad gäller nu? (läs dessa först)

| Fråga | Fil |
|-------|-----|
| Vad är LOCK / WIP / nästa steg? | [`docs/external-ai/LIFE-OS-BUILD-STATE.md`](external-ai/LIFE-OS-BUILD-STATE.md) |
| Backend låsning + första analys | [`docs/evaluations/2026-06-16-backend-masterplan-exekvering.md`](evaluations/2026-06-16-backend-masterplan-exekvering.md) |
| UI-körplan (Körfält B) | [`docs/evaluations/2026-06-16-supermodule-ui-masterplan.md`](evaluations/2026-06-16-supermodule-ui-masterplan.md) |
| Backend Fas 19–24 | [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](evaluations/2026-06-15-fas19-masterplan-v2.md) |
| 1-sides status | [`docs/evaluations/SENASTE-SAMMANFATTNING.md`](evaluations/SENASTE-SAMMANFATTNING.md) |
| Routes + moduler | [`docs/MODUL-FUNKTIONS-REGISTER.md`](MODUL-FUNKTIONS-REGISTER.md) |
| Låst UX (får inte tas bort) | [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) |

**Nästa arbetsgren:** Backend FREEZE — första bevisanalys via Valv Inkast (ingen ny feature utan PMIR).

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
| Arkiv (historik) | `docs/archive/` | flyttade utkast — **inte** sanning |
| Äldre Gemini-handoff | `docs/archive/gemini-handoff-2026-06/` | superseded av `external-ai/leveranser/` |

---

## 3. Vad är arkiv vs aktiv?

| Mapp | Roll |
|------|------|
| `docs/archive/` | Historik — läs för kontext, bygg inte härifrån |
| `docs/archive/design-2026-06/` | Reserverad för design-flytt (icons-proposals m.m.) |
| `exports/` | **Regenereras** — bifoga till ChatBox, redigera inte manuellt |
| `docs/external-ai/bifoga/` | Speglad kopia för upload — `npm run chatbot:sync:bifoga` |

---

## 4. AI-verktyg — vilket för vad?

| Verktyg | När | Pack / prompt |
|---------|-----|----------------|
| **Cursor** | Prod-kod, smoke, LOCK | — |
| **ChatBox** | SPEC, PMIR, wireframes | `exports/chatbot-handoff/` + `bifoga/` |
| **Google AI Studio** | Design-remix + mockup-bild | `npm run design:pack` + `docs/ai-studio/DESIGN-REMIX-PROMPT.md` |
| **NotebookLM** | Research, motsägelser | `npm run google-ai-pro:pack` |

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
```

Bifoga-mapp: `docs/external-ai/bifoga/` — se [`bifoga/README.md`](external-ai/bifoga/README.md).

---

## 7. Kanon-tier (planering-kanon-guard)

1. `.context/system-plan.md`
2. `docs/specs/modules/Arkiv-GAP-REGISTER.md`
3. `docs/BRANCH-KARTA.md`
4. `docs/evaluations/` (senaste indexerade)
5. `.context/locked-ux-features.md`
6. `docs/INNEHALL-REGISTER.md`
7. `docs/SYSTEM_PLAN_v2.md`
8. `docs/evaluations/2026-06-15-fas19-masterplan-v2.md`
