# Databas och Kunskapsvalvet

Grunden för Livskompassen v2 är "Kunskapsvalvet" (The Knowledge Vault), implementerat för extrem säkerhet och snabb semantisk hämtning (RAG).

## Databasarkitektur
- **Teknologi:** Cloud Firestore i Datastore-läge.
- **Säkerhetskrav:** MÅSTE använda Customer-Managed Encryption Keys (CMEK) via Cloud KMS. Ingen data får sparas med standardkryptering.
- **Dataminimering (GDPR):** Automatiska script måste implementeras för att radera vektorer och Firestore-dokument baserat på retentionspolicy.

## Vektorsökning och RAG
- **Teknologi:** Vertex AI Vector Search 2.0.
- **Inbäddningsmodell:** `textembedding-gecko` (konverterar Kampspår till semantiska vektorer).
- **Funktion:** RAG-motorn hämtar semantiskt liknande data från Kampspår och rutiner. LLM:er instrueras att uteslutande basera svar på hämtad information för att förhindra hallucinationer.

## Kontextuell Isolering och Minneshantering
- **Sessionsgränser:** Strikta gränser baserade på domän (ex. arbetsstress vs. budget). Agenter får endast åtkomst till relevant vektorutrymme.
- **Memory Management Agents:** Dedikerade agenter hanterar minnesoperationer och informationsflöde för att förhindra kontextläckage.
