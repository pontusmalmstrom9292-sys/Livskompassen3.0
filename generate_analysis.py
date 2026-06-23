import json
import os

def get_assistant_responses(file_path):
    responses = []
    if not os.path.exists(file_path):
        return f"Kunde inte hitta loggfilen: {file_path}"
    with open(file_path, 'r') as f:
        for line in f:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('source') == 'MODEL':
                responses.append(data.get('content'))
    return responses[-1] if responses else "Ingen respons hittades."

r1 = get_assistant_responses('/Users/Livskompassen/.gemini/antigravity/brain/79c3d0a1-e3f4-41b1-9c52-e719c0329718/.system_generated/logs/transcript.jsonl')
r2 = get_assistant_responses('/Users/Livskompassen/.gemini/antigravity/brain/49225171-d1d2-469e-953c-2ed674e48194/.system_generated/logs/transcript.jsonl')

content = f"""# Agent-delegering och Pragmatisk Roadmap (2026-06-22)

**Källa:** Analys av konversationerna "fas3 pr 5" (AI-delegering) och "fas 3 pr6" (Pragmatisk Roadmap).
**Syfte:** Konsolidering av riktlinjer för AI-assisterad utveckling samt en handlingskraftig backlogg för systemet, i strikt enlighet med Valvet-säkerhet, WORM, och tre-silo-arkitekturen.

## 1. Riktlinjer för AI-Delegering (Från Fas 3 PR 5)

Denna sektion definierar vilka uppgifter som är säkra och pragmatiska att delegera till agenter i projektet, samt vilka som är strikt förbjudna (NO-GO).

{r1}

---

## 2. Handlingskraftig Roadmap (Från Fas 3 PR 6)

Nedan följer de 30 framtagna pragmatiska och konkreta förbättringarna, skapade med fokus på hög påverkan och minimal kodkomplexitet, helt utan att rubba säkerhetsregler (Firestore/WORM).

{r2}

---

## Analys & Nästa Steg
Dessa två underlag samspelar för att ge en tydlig bild av hur vi kan driva Livskompassen 3.0 framåt med hög hastighet utan att kompromissa med säkerheten:
1. **Låg risk + Högt värde:** Många UX-förbättringar (t.ex. WORM-indikatorer, Tap-to-reveal, Inaktivitets-blur) faller rakt in i kategorin "Bra agent-uppgifter" och bör prioriteras.
2. **Säkerhet är enbart mänskligt:** Om vi stöter på problem kring `firestore.rules`, PIN-kodshantering eller AI-Kanon/Prompt-justeringar (Shared Rules), görs detta av dig manuellt - agenterna har uttryckligen förbud mot att röra dessa kärnfunktioner.
3. **Rekommendation för sprint:** Starta med uppgifter från domänen "Säkerhet, WORM & Zero Footprint" som enbart involverar frontend (t.ex. Visuell indikator för Device Clear, Inaktivitets-blur). Det bygger in säkerheten i UI:t autonomt medan backend skyddas.
"""

with open('/Users/Livskompassen/StudioProjects/Livskompassen3.0/docs/evaluations/2026-06-22-agent-och-roadmap-syntes.md', 'w') as f:
    f.write(content)

print("Syntes sparad till docs/evaluations/2026-06-22-agent-och-roadmap-syntes.md")
