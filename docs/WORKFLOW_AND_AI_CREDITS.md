# Strategi: Arbetsflöde & AI-Krediter

Detta dokument definierar hur du på bästa sätt använder olika plattformar och verktyg för att optimera din tid, din kodkvalitet och, allra viktigast, dina AI-krediter (12 000 kr + 2 700 kr testkrediter).

## 💰 Hantering av AI-krediter & Autentisering

För att säkerställa att du drar nytta av dina **12 000 kr** och prioriterar dina **2 700 kr testkrediter** korrekt, är autentisering (Auth) A och O.

### 1. Sätt upp Application Default Credentials (ADC)
Det enklaste sättet att få din lokala kod (i VS Code) att per automatik använda dina Cloud-krediter utan att blotta API-nycklar är via Google Cloud CLI.

**Gör detta i terminalen:**
1. Logga in: `gcloud auth login`
2. **Kritisk koppling:** `gcloud auth application-default login`
   *(Detta genererar en dold fil lokalt på din Mac som Google Cloud SDKs för Node.js/Python automatiskt letar efter).*
3. Sätt rätt projekt (det projekt där dina krediter ligger): `gcloud config set project DITT-PROJEKT-ID`

### 2. .env - Miljövariabler
När du måste använda API-nycklar (t.ex. från andra leverantörer, eller specifika Gemini API-nycklar skapade i AI Studio/Cloud Console):
* Spara **alltid** nycklar i en `.env`-fil i roten av ditt projekt (t.ex. `VITE_GEMINI_API_KEY=xyz...`).
* Se till att `.env` ligger i din `.gitignore` (Vilket det oftast gör per standard i Vite, men dubbelkolla!).
* **Påminnelse till mig (Gemini CLI):** Jag är programmerad att aldrig logga, spara eller committa dina nycklar.

### 3. Prioritering av Krediter
* Se till att det Google Cloud Project som är kopplat till ditt faktureringskonto (där de 12 000 kr ligger) är det projekt du utför de tunga operationerna i (Vertex AI träning, databasfrågor).
* Om du har specifika testkrediter (t.ex. via en specifik kampanjkod eller ett separat testprojekt), använd det Projekt-ID:t under utvecklingsfasen innan du går i produktion.

---

## 🛠️ Plattformarnas Rollfördelning

För att inte bygga fel saker på fel ställe, använd denna fördelning:

### 1. VS Code (Din Huvudbas)
**Vad du gör här:**
* **Frontend Design & UI:** All React, TypeScript, Tailwind CSS, och Vite-konfiguration.
* **Integrationskod:** API-anrop från frontend till din backend.
* **Agent-interaktion:** Det är här du interagerar med mig (Gemini CLI) i terminalen för att generera filer, refaktorera kod och automatisera Git/NPM-kommandon.
* **Inline Assist:** Använd "Gemini Code Assist" tillägget för autocomplete och snabba kodförklaringar medan du skriver.

### 2. Google Cloud Console / Vertex AI
**Vad du gör här (i webbläsaren):**
* **Bygga Agenter:** Använd Vertex AI Studio (och Agent Builder) för att skapa fundamentet till din "Kompis"-agent. Det är här du sätter upp systemprompts ("Du är en empatisk livscoach..."), kopplar den till data (RAG) och testar dess logik isolerat.
* **Infrastruktur:** Databaser (Firestore/SQL), Cloud Run (för backend), och IAM (rättigheter).
* **Finetuning:** Om du i framtiden vill träna en specifik modell på anonymiserad livsdata, gör du det i Vertex AI, **inte** i VS Code.

### 3. Cursor (Avancerad Kod-redigerare)
**Vad du gör här (Valfritt/Vid behov):**
* Cursor är en fork av VS Code som har en extremt integrerad AI ("Composer").
* **Användningsområde:** Om vi hamnar i ett läge där hela projektarkitekturen måste skrivas om samtidigt över 15 olika filer, och du känner att Gemini CLI/VS Code inte räcker till visuellt.
* *Notera:* Cursor använder oftast sina egna prenumerationsmodeller eller separata API-nycklar. Vill du använda dina Google Cloud-krediter där måste du koppla in dina egna Vertex AI/Gemini API-nycklar i deras inställningar.

### 4. Antigravity
**Vad du gör här:**
* Om Antigravity refererar till specifika djupdykningsverktyg, ramverk (Python/Django) eller 3D/visuella byggverktyg: Använd detta specifikt när standard webbteknik (React/CSS) inte räcker till för det visuella uttrycket.

### Sammanfattning av Arbetsflödet:
1. **Definiera AI-hjärnan** i Vertex AI.
2. **Koppla dina krediter** via `gcloud auth application-default login` på din Mac.
3. **Bygg utseendet och logiken** i VS Code med hjälp av mig (Gemini CLI).
4. Jag (Gemini) skriver koden som anropar hjärnan i Vertex AI.
