# Gemini kunskap — ladda upp härifrån

**En mapp** med alla filer för Gemini Custom Gem **Knowledge**.

Kanon ligger på andra ställen i repot — denna mapp är **speglade kopior**. Uppdatera med:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run gemini:sync:kunskap
```

(Eller `npm run gemini:pack:all` — inkluderar sync.)

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

## Tier 2 — valfritt (rekommenderat för orkester)

Mappen `tier-2-valfritt/` — inkl. orkester + Flow:

| Fil | Innehåll |
|-----|----------|
| `14-GEMINI-ORKESTER-MASTER-PROMPT.md` | Huvuddator-kedja |
| `15-flow-pipeline-karta.md` | P1 Brusfilter, P2 Dossier v2 |
| `16-MALL-deep-research-modul.md` | Mall före varje bygg |
| `17-GEMINI-FLOW-CHAT-PROMPTS.md` | **Klistra-in-prompter** Flow P1 · ChatBox Opus/Sonnet |

## Tier 3 — repomix per zon

Mappen `tier-3-repomix/` — fylls efter `npm run gemini:pack`. Välj en pack (t.ex. `gemini-pack-valv.md`) när du jobbar med en zon.

---

## Finder-sökväg

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/gemini-kunskap/
```

`Cmd + Shift + G` i Finder → klistra in sökvägen ovan.

Setup: [`../GEMINI-GEM-SETUP.md`](../GEMINI-GEM-SETUP.md)
