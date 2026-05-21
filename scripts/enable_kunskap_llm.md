# Aktivera full LLM för Kunskapsvalvet

## Orsak (bekräftat i Cloud Logs)

Vertex Publisher-modeller returnerar **404** för `gen-lang-client-0481875058` — projektet har inte modellåtkomst via Vertex, även med Vertex API på.

## Lösning (ett steg i taget)

### Steg 1 — Skapa API-nyckel

1. Öppna https://aistudio.google.com/apikey
2. Skapa nyckel kopplad till samma Google-konto/projekt
3. Kopiera nyckeln (visas bara en gång)

### Steg 2 — Spara som Firebase secret

```bash
cd Livskompassen2.0
firebase functions:secrets:set GEMINI_API_KEY
```

Klistra in nyckeln när CLI frågar.

### Steg 3 — Deploy (redan i repo)

```bash
firebase deploy --only functions:knowledgeVaultQuery
npm run smoke:kunskap
```

**OK:** smoke-svar börjar **inte** med *"Jag hittade … relevanta poster"* (modell: `gemini-2.5-flash`).
