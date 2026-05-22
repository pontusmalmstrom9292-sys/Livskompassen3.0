# Google Apps Script — Drive → notifyNewFile

**Automatiskt (Firebase):** `npm run drive:wireup` från repo-rot.

**Manuellt (Google, engång):** Script kan inte skapas via Firebase MCP — gör detta en gång:

1. [script.google.com](https://script.google.com) → Nytt projekt → klistra in [`sorter.gs`](./sorter.gs).
2. Kör `npm run drive:wireup` — kopiera Script Properties från terminalen.
3. Project Settings → Script Properties → klistra nycklarna.
4. Dela **Vault**-mappen i Drive med `gen-lang-client-0481875058@appspot.gserviceaccount.com` (Viewer).
5. Kör funktionen `createTrigger()` **en gång** (timme).

**Test utan att vänta:** Kör `autonomousSorter()` manuellt efter att du lagt en PDF i Inbox.
