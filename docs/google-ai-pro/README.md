# Google AI Pro — Livskompassen (operativ guide)

**Plan:** Cursor-plan `google_ai_pro_livskompassen` · **Pack:** `npm run google-ai-pro:pack`

## Snabbstart

1. `npm run google-ai-pro:pack` — skapar filer i `exports/google-ai-pro/`
2. **NotebookLM:** ladda upp allt i `exports/google-ai-pro/notebooklm/`
3. **Drive:** dra `exports/google-ai-pro/drive-pack/Livskompassen/` till Google Drive
4. Kör prompter A1–G1 från Cursor-planen; skicka svar tillbaka till Cursor

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
