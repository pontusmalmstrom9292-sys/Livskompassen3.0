# Systemets Övergripande Vision och Arkitektur

Livskompassen v2 representerar en fundamental utveckling från en traditionell applikation för personlig utveckling till ett avancerat, prediktivt och autonomt ekosystem.

## Kärnkomponenter
- **Kompis:** En empatisk, AI-driven navigatör som interagerar med användaren genom ett visuellt gränssnitt.
- **Sub-Synaptiska Nätverket:** En underliggande neural arkitektur som kopplar samman och analyserar livsdata såsom rutiner, budgetar och Kampspår (användarens utmaningar och milstolpar).

## Arkitektoniskt Paradigmskifte
Systemet designas som ett distribuerat multi-agent ekosystem där specialiserade agenter samarbetar under strikt orkestrering. Det bygger på:
- **Google Cloud Vertex AI Agent Engine**
- **Agent2Agent-protokollet (A2A)** för sömlös kommunikation mellan oberoende AI-moduler.

## Multi-Agent Ekosystem (A2A)
Arkitekturen bygger på tre fundamentala koncept:
1.  **AgentCards:** Maskinläsbara visitkort som beskriver en agents specifika förmågor (skills), metadata och förväntad input. Kompis agerar supervisor och delegerar via dessa.
2.  **AgentExecutors:** Servande logik som tar emot A2A-meddelanden, exekverar verktyg, strömmar partiella resultat och returnerar strukturerad data (artefakter) utan att dela privat minne.
3.  **Hierarkisk orkestrering & Gatekeeper-agenter:** Gatekeepers agerar barriär mellan backend-specialister och frontend. De validerar artefakter mot säkerhetskriterier och rensar PII innan data når UI.

## Asynkron Långtidsanalys i Bakgrunden
För djupa, autonoma analyser (ex. 5-timmars prediktiv analys):
- **Teknologi:** Händelsestyrda **Cloud Run Jobs** orkestrerade av **Cloud Scheduler** och **Cloud Tasks**.
- **Konfiguration:** Cloud Run-tjänstens CPU sätts till "always-allocated" med tillåten exekveringstid upp till 24 timmar.
- **Utlösare:**
    - *Tidsstyrd:* Cloud Scheduler (ex. 09:00 varje morgon för batch-inferens).
    - *Händelsestyrd:* Cloud Tasks (ex. triggas direkt av en panikattack registrerad i Kampspåret).

## Kostnadsoptimering & Modellanvändning
- **Context Caching:** Använd Vertex AI Context Caching för RAG för att spara/återanvända förberäknade tokens (raderas inom 24h).
- **Model Routing:**
    - Lågkomplexitet: Gemini 3.1 Flash-Lite.
    - Högkomplexitet (DCAP, prediktiv analys): Gemini 3.1 Pro.
- **Consumption Options:** "Batch inference" eller "Flex" för bakgrundsjobb. "PayGo" för realtids-Kompis.
