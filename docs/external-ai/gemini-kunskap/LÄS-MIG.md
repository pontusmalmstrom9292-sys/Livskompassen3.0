# Gemini kunskap — ladda upp härifrån

**En mapp** med alla filer för Gemini Custom Gem **Knowledge**.

Kanon ligger på andra ställen i repot — denna mapp är **speglade kopior**.

## Uppdatera ALLT (obligatoriskt)

Kör **alltid** full refresh — uppdaterar repomix, NotebookLM-pack och hela denna mapp:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run gemini:pack:all
```

Kör **inte** bara `gemini:sync:kunskap` — då missar du färska repomix-packs.

Vid varje sync **renas** `tier-2-valfritt/`, `tier-3-repomix/`, `gemini-kanon/` och `notebooklm-kanon/` och fylls på nytt.

---

## Var i Gemini

**gemini.google.com** → **Gems** → din Gem → **Redigera** → **Knowledge** → ladda upp filer

---

## Tier 1 — obligatorisk (8 filer i denna mapp)

Markera `01`–`08` i Finder → dra till Gem Knowledge:

| Fil | Innehåll |
|-----|----------|
| `01-LIFE-OS-BUILD-STATE.md` | LOCK / FREEZE / DEFER |
| `02-SECURITY-LOCK-MANIFEST.md` | WORM, vault, guards |
| `03-SYNAPSE-LOCK-SPEC.md` | Synapser, HITL |
| `04-LIFE-OS-CORE-LOCKED.md` | Skyddade moduler |
| `05-locked-ux-features-CURRENT.md` | Låst UX |
| `06-fas19-masterplan-v2.md` | Fas 19+ körplan |
| `07-DOC-INDEX.md` | Navigering |
| `08-GEMINI-GEM-KNOWLEDGE.md` | Vision, Flow, kostnad |

## System Instructions (INTE Knowledge)

`00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` → klistra in under **Instructions**, inte Knowledge.

## Tier 2 — register + prompter (09–25)

Mappen `tier-2-valfritt/` — inkl. orkester, Flow, setup, baseline:

| Fil | Innehåll |
|-----|----------|
| `14-GEMINI-ORKESTER-MASTER-PROMPT.md` | Huvuddator-kedja |
| `17-GEMINI-FLOW-CHAT-PROMPTS.md` | Flow P1 · ChatBox |
| `22-GEMINI-GEM-SETUP.md` | Gem-setup |
| `23-GEMINI-GEM-BASELINE-VERIFY.md` | Baseline-frågor |

## Tier 3 — repomix per zon

Mappen `tier-3-repomix/` — alla `gemini-pack-*.md` efter `gemini:pack:refresh`.

## Kanon-speglar (alla källfiler)

| Mapp | Innehåll |
|------|----------|
| `gemini-kanon/` | **Alla** `.md`/`.txt` från `docs/external-ai/gemini/` |
| `notebooklm-kanon/` | **Alla** `.md`/`.txt` från `docs/external-ai/notebooklm/` |

---

## Finder-sökväg

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/gemini-kunskap/
```

`Cmd + Shift + G` i Finder → klistra in sökvägen ovan.

Setup: [`../gemini/GEMINI-GEM-SETUP.md`](../gemini/GEMINI-GEM-SETUP.md)
