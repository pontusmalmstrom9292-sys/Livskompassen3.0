# Valv → Gemini (färdigt paket)

## Ett kommando (Mac)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run gemini:pack:valv
```

Öppna sedan mappen som skrivs ut (vanligtvis):

`exports/gemini-handoff/valv-upload/`

## Vad du gör i Gemini

1. Ny chatt på [gemini.google.com](https://gemini.google.com)
2. Klistra **master-prompt** från `09-master-prompt-ref.md` (första kodblocket)
3. Bifoga **`00-gemini-pack-valv-repomix.md`** (eller dra hela mappen)
4. Klistra **uppdrag V1** från `08-V1-PROMPT-klistra-in.md`
5. Spara svaret → `docs/gemini-handoff/V1-valv-gemini-svar.md` eller klistra tillbaka i Cursor

## Filer i upload-mappen

| Fil | Innehåll |
|-----|----------|
| `00-gemini-pack-valv-repomix.md` | Kod + kanon (stor — huvudkontext) |
| `01`–`07` | Spec, silos, wireframe, drawer-copy |
| `08-V1-PROMPT-klistra-in.md` | Uppdrag att klistra in |
| `09-master-prompt-ref.md` | Master-prompt |
| `LÄS-MIG.txt` | Kort checklista |

## Tillbaka till Cursor

```
Google AI Pro — Steg V klart.
[Bifoga: V1-valv-gemini-svar.md / wireframe]
Jämför mot hela projektet. Kör smoke:locked-ux.
```
