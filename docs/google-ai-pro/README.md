# Google AI Pro — Livskompassen (operativ guide)

**Plan:** Cursor-plan `google_ai_pro_livskompassen` · **Pack:** `npm run gemini:pack:all`

## Snabbstart

1. `npm run gemini:pack:all` — NotebookLM + repomix (kompass/meny/valv)
2. **NotebookLM:** ladda upp `exports/google-ai-pro/notebooklm/`
3. **Gemini-app:** klistra **hela MASTER-PROMPT** från [`GEMINI-TECH-LEAD.md`](./GEMINI-TECH-LEAD.md) (+ ev. Handoff från förra sessionen)
4. **Design-only (ingen kodrouting):** kort prompt i [`PROMPTS.md`](./PROMPTS.md)
5. **Handoff i repo:** [`docs/gemini-handoff/`](../gemini-handoff/) (K1, K2, M1, V1, IN1)
6. Gemini ger dig **en** Cursor-prompt i taget — klistra in här; skicka svar tillbaka till Gemini

## Repo-leverabler (implementerade)

| Steg | Artefakt |
|------|----------|
| A | `exports/google-ai-pro/notebooklm/` + [`evaluations/2026-05-29-google-ai-pro-notebooklm.md`](../evaluations/2026-05-29-google-ai-pro-notebooklm.md) |
| B | [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md) batch 016–020 |
| C | `journalQuickMirror` callable + Snabbläge UI |
| D | `exports/google-ai-pro/drive-pack/Livskompassen/` |
| E | [`evaluations/2026-05-29-google-ai-pro-gcp-credit.md`](../evaluations/2026-05-29-google-ai-pro-gcp-credit.md) |
| F | [`design/theme-lab/VARIANTS.md`](../design/theme-lab/VARIANTS.md) § Google AI Pro F1 |

## Tillbaka till Cursor

```
Google AI Pro — Steg [X] klart.
[Bifoga svar / skärmdump]
```

Deploy efter Steg C: `firebase deploy --only functions:journalQuickMirror,hosting`
