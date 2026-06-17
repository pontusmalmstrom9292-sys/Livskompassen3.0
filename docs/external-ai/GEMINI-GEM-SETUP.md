# Gemini Custom Gem — setup

**Syfte:** Konfigurera Livskompassen Master Architect Gem i [gemini.google.com](https://gemini.google.com).

---

## 1. Uppdatera packs (repo)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run gemini:sync:kunskap
```

Detta fyller mappen [`gemini-kunskap/`](./gemini-kunskap/) med alla knowledge-filer.  
Full pack (inkl. repomix): `npm run gemini:pack:all`

---

## 2. Skapa eller redigera Gem

1. Öppna [Gemini](https://gemini.google.com) → **Gems** → **New Gem** (eller redigera befintlig "Livskompassen")
2. **Namn:** Livskompassen Master Architect (eller liknande)
3. **Beskrivning (valfritt):** CTO och arkitekt för Livskompassen v2 — Cursor-prompter, Flow-design, säkerhetsgrind.

---

## 3. System Instructions

1. Öppna [`gemini-kunskap/00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt`](./gemini-kunskap/00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt)  
   (synkas dit av `gemini:sync:kunskap`; källa: [`GEMINI-GEM-SYSTEM-INSTRUCTION-KLISTRA-IN.txt`](./GEMINI-GEM-SYSTEM-INSTRUCTION-KLISTRA-IN.txt))
2. `Cmd + A` → `Cmd + C`
3. Klistra in under **System Instructions** i Gem
4. Spara

**Alternativ utan Gem:** [`docs/google-ai-pro/GEMINI-TECH-LEAD.md`](../google-ai-pro/GEMINI-TECH-LEAD.md)

---

## 4. Knowledge Files (Tier 1 — obligatorisk)

**En mapp — ladda upp härifrån:**

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/external-ai/gemini-kunskap/
```

Uppdatera mappen först: `npm run gemini:sync:kunskap`

I Finder: `Cmd + Shift + G` → klistra in sökvägen → markera **01**–**04**, **07**–**08** → dra till Gem **Knowledge**.

**Om Gem vägrar ("kan inte uppfylla"):** ladda **inte** `05` (låst UX med känsliga ord) eller `tier-2-valfritt/10-doman-covert`. Lägg istället till `14`, `15`, `16`, `17` från tier-2. Uppdatera Instructions från `00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` (REFUSAL-SAFE-block). Prompter: [`GEMINI-FLOW-CHAT-PROMPTS.md`](./GEMINI-FLOW-CHAT-PROMPTS.md).

| # | Fil i mappen |
|---|--------------|
| 1 | `01-LIFE-OS-BUILD-STATE.md` |
| 2 | `02-SECURITY-LOCK-MANIFEST.md` |
| 3 | `03-SYNAPSE-LOCK-SPEC.md` |
| 4 | `04-LIFE-OS-CORE-LOCKED.md` |
| 5 | `05-locked-ux-features-CURRENT.md` |
| 6 | `06-fas19-masterplan-v2.md` |
| 7 | `07-DOC-INDEX.md` |
| 8 | `08-GEMINI-GEM-KNOWLEDGE.md` |

**Tier 2 (valfritt):** `gemini-kunskap/tier-2-valfritt/`  
**Tier 3 (per zon):** `gemini-kunskap/tier-3-repomix/` (efter `npm run gemini:pack`)

Detaljer: [`gemini-kunskap/LÄS-MIG.md`](./gemini-kunskap/LÄS-MIG.md)

---

## 5. Verifiera

Kör baseline enligt [`GEMINI-GEM-BASELINE-VERIFY.md`](./GEMINI-GEM-BASELINE-VERIFY.md).

---

## 6. Underhåll

| Händelse | Åtgärd |
|----------|--------|
| Ny CHECKPOINT / BUILD STATE | `npm run gemini:sync:kunskap` → ersätt knowledge i Gem |
| Ny zon i fokus | Byt fil i `tier-3-repomix/` |
| Ny fas / arkitekturbeslut | Uppdatera System Instructions om Gem-beteende ändrats |

Kanon: [`FIL-REGISTER.md`](./FIL-REGISTER.md) · [`DOC-INDEX.md`](../DOC-INDEX.md)
