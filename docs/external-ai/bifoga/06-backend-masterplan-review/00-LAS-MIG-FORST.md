# Backend masterplan — ladda upp i 2 omgångar

**Datum:** 2026-06-16 · **Syfte:** Prompt G — granska FREEZE

Gemini/ChatBox tar ofta max ~10 filer. Här är **4 filer** i **2 mappar**.

## Omgång 1 — register (3 filer)

Bifoga hela mappen `omgang-1-register/`:

| Fil | Innehåll |
|-----|----------|
| `01-PROMPT-G.md` | Prompten — spara till omgång 2 |
| `02-REGISTER-PAKET.md` | LIFE-OS, moduler, innehåll, gap-matrix, security |

Skriv i chatten: *"Jag laddar upp omgång 2 strax — bekräfta att du läst registren."*

## Omgång 2 — kod + bevis (2 filer)

Bifoga hela mappen `omgang-2-kod/`:

| Fil | Innehåll |
|-----|----------|
| `03-EVALUERINGAR.md` | Exekvering, PMIR, säkerhet, senaste sammanfattning |
| `04-BACKEND-KOD.md` | Backend/säkerhetskod (repomix) |

Klistra in texten från `omgang-1-register/01-PROMPT-G.md` (under kodblocket).

Spara svaret → `docs/external-ai/imports/BACKEND-MASTERPLAN-REVIEW-SVAR.md`

## Uppdatera

```bash
npm run chatbot:sync:backend-review
```

**Finder (Cmd+Shift+G):**

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/bifoga/06-backend-masterplan-review
```
