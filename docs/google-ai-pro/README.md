# Google AI Pro — Livskompassen (operativ guide)

**Pack:** `npm run notebooklm:pack:all` · **Lathund:** [`docs/external-ai/NOTEBOOKLM-LATHUND.md`](../external-ai/NOTEBOOKLM-LATHUND.md)

## Snabbstart (NotebookLM kärna)

1. `npm run notebooklm:pack:all` — repomix + register + system_sync
2. **NotebookLM:** ladda upp hela `exports/google-ai-pro/notebooklm/` (ersätt gamla källor)
3. Klistra **NOTEBOOKLM-MASTER-PROMPT** från [`docs/external-ai/NOTEBOOKLM-MASTER-PROMPT.md`](../external-ai/NOTEBOOKLM-MASTER-PROMPT.md)
4. Verifiera med 4 baseline-frågor — [`leveranser/2026-06-16-notebooklm-baseline-compare.md`](../external-ai/leveranser/2026-06-16-notebooklm-baseline-compare.md)

## Gemini-app (strategi / Tech Lead)

1. `npm run gemini:pack:all` — inkluderar notebooklm-pack + gemini repomix
2. Klistra **hela MASTER-PROMPT** från [`GEMINI-TECH-LEAD.md`](./GEMINI-TECH-LEAD.md)
3. **Design-only (ingen kodrouting):** kort prompt i [`PROMPTS.md`](./PROMPTS.md)
4. Handoff i repo: [`docs/external-ai/leveranser/`](../external-ai/leveranser/) (superseded `docs/archive/gemini-handoff-2026-06/`)
5. Gemini ger dig **en** Cursor-prompt i taget — klistra in här

## Repo-leverabler

| Steg | Artefakt |
|------|----------|
| A | `exports/google-ai-pro/notebooklm/` + [`NOTEBOOKLM-LATHUND.md`](../external-ai/NOTEBOOKLM-LATHUND.md) |
| B | [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md) batch 016–020 |
| C | `journalQuickMirror` callable + Snabbläge UI |
| D | ~~`exports/google-ai-pro/drive-pack/`~~ — **deprecated**; använd notebooklm-mappen |
| E | [`evaluations/2026-05-29-google-ai-pro-gcp-credit.md`](../evaluations/2026-05-29-google-ai-pro-gcp-credit.md) |
| F | [`design/theme-lab/VARIANTS.md`](../design/theme-lab/VARIANTS.md) § Google AI Pro F1 |

## Tillbaka till Cursor

```
Google AI Pro — Steg [X] klart.
[Bifoga svar / skärmdump]
```

Deploy efter Steg C: `firebase deploy --only functions:journalQuickMirror,hosting`
