# ChatBox handoff — repomix & prompter

**Generera:** `npm run chatbot:pack:handoff`  
**Synka till bifoga:** `npm run chatbot:sync:bifoga`  
**Full refresh (inkl. gemini):** `npm run chatbot:pack:all`

---

## Repomix-paket

| Fil | Innehåll | När |
|-----|----------|-----|
| `chatbot-pack-security.md` | WORM, synapser, guards | Säkerhet / CP |
| `ui-design-pack.md` | Nav, design-specs, dock | UI-våg |
| `chatbot-pack-life-os-vision.md` | Masterplan, gap, MODUL-register | PHASE-09 |
| `chatbot-pack-supermodules.md` | InputSuperModules, delegates | Supermodule-arbete |
| `chatbot-pack-nav-wave3.md` | navTruth, routes, Våg 3 | PHASE-10 PMIR |
| `chatbot-pack-design-tokens.md` | CSS, Theme Lab, COLOR-POLICY | PHASE-11 |
| `chatbot-pack-hygiene.md` | DOC-INDEX, hygiene, arkiv | PHASE-08 |

---

## Bifogningsordning (ny chatt)

1. Klistra `CHATBOT-MASTER-PROMPT.md` från `docs/external-ai/bifoga/03-prompter/`
2. Bifoga relevant `chatbot-pack-*.md` (eller hela `04-repomix/`)
3. Bifoga `01-register/` vid tung analys
4. Klistra uppdrag från `prompts/PHASE-XX-*.md`
5. Vid vision: bifoga `assets/gpt-life-os-mockup.png`

---

## Prompter (Fas 9+)

| Fil | Modell | Syfte |
|-----|--------|-------|
| `PHASE-08-hygiene-audit.md` | GPT-5.4 Mini | KEEP/ARCHIVE före städ |
| `PHASE-09-life-os-vision.md` | Opus 4.8 | Gap + wave-2 wireframes |
| `PHASE-10-nav-wave3-pmir.md` | Opus 4.8 | PMIR H1–H4 (read-only) |
| `PHASE-11-design-tokens.md` | Sonnet 4.6 | Fas 19.3 tokens |
| `PHASE-12-supermodule-polish.md` | Sonnet 4.6 | B2–B4 UI polish |

**Regel:** Ny chatt per PHASE. Max 2 parallella ChatBox-chattar.

---

## Sökväg (Mac)

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/exports/chatbot-handoff/
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/bifoga/
```

Kanon för dokument: [`docs/DOC-INDEX.md`](../../docs/DOC-INDEX.md)
