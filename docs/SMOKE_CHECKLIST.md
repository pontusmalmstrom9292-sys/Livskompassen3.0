# Smoke-checklista (Fas 3)

**Bygg (automatiserbart):** `cd functions && npm run build && cd .. && npm run build` — ska exit 0.

**Firestore / Auth (manuellt):** Kräver att du kör appen (lokal `npm run dev` eller [Hosting-URL](https://gen-lang-client-0481875058.web.app)) och är inloggad via Anonymous Auth.

| # | Test | Route / åtgärd | Förväntat |
|---|------|----------------|-----------|
| 1 | Auth | Öppna app | Ingen auth-fel i konsol; uid i Firebase Auth |
| 2 | Dagbok | `/dagbok` — spara post | Dokument i Firestore `journal` med `userId` = ditt uid |
| 3 | Valv | Long-press Shield 3s → PIN → `/valv` | Post i `reality_vault` |
| 4 | Barnen | `/barnen` — spara logg | Post i `children_logs` |
| 5 | Kompasser | `/kompasser` — check-in | Post i `checkins` |
| 6 | BIFF | `/hamn` — skicka meddelande | Svar från callable `analyzeMessage` |
| 7 | Kunskap | `/kunskap` — fråga | Svar från `knowledgeVaultQuery` |
| 8 | Vävaren | `/dagbok` — spara post, vänta ~30s | Ny rad i `reality_vault`, `category: vävaren_metadata` |
| 9 | Speglar | `/speglar` | ACT + VIVIR laddar; valvjämförelse efter unlock |
| 10 | Barnen fysio | `/barnen` → Kasper → fysiologi | `children_logs` med `action: fysiologi`, `signals` |
| 11 | WebAuthn | Håll Shield 3s (Fyren) | Passkey-prompt på enhet med stöd |
| 12 | Kill switch | Skaka hårt (mobil) | Session rensad, navigerar till `/` |

Verifiera dokument i [Firestore Console](https://console.firebase.google.com/project/gen-lang-client-0481875058/firestore).

**Ej i denna checklista:** Drive-pipeline (`notifyNewFile`) — se [DRIVE_AUTOMATION.md](./DRIVE_AUTOMATION.md) efter att `NOTIFY_WEBHOOK_SECRET` satts.
