# Smoke-checklista (Fas 3)

**Bygg (automatiserbart):** `cd functions && npm run build && cd .. && npm run build` — ska exit 0.

**Firestore / Auth (manuellt):** Kräver att du kör appen (lokal `npm run dev` eller [Hosting-URL](https://gen-lang-client-0481875058.web.app)) och är inloggad via Anonymous Auth.

**Navigation (Variant C):** Modulhub → livsområde; kluster-flikar på `/dagbok` och `/vardagen`. Se [`docs/specs/navigation-master.md`](specs/navigation-master.md).

| # | Test | Route / åtgärd | Förväntat |
|---|------|----------------|-----------|
| 1 | Auth | Öppna app | Ingen auth-fel i konsol; uid i Firebase Auth |
| 2 | Dagbok | `/dagbok` (Reflektion) — spara post | Dokument i Firestore `journal` med `userId` = ditt uid |
| 3 | Valv | Modulhub → Hjärtat **3s long-press** → PIN → Bevis-flik | Post i `reality_vault` |
| 4 | Barnen | `/familjen` — spara logg | Post i `children_logs` |
| 5 | Kompasser | `/vardagen` (Kompasser-flik) — check-in | Post i `checkins` |
| 6 | BIFF | `/hamn` — skicka meddelande | Svar från callable `analyzeMessage` |
| 7 | Kunskap | `/vardagen?tab=kunskap` — fråga | Svar från `knowledgeVaultQuery` |
| 8 | Vävaren | `/dagbok` — spara post, vänta ~30s | Ny rad i `reality_vault`, `category: vävaren_metadata` |
| 9 | Speglar | `/dagbok?tab=speglar` | ACT + VIVIR laddar; valvjämförelse efter unlock |
| 10 | Barnen fysio | `/familjen` → Kasper → fysiologi | `children_logs` med `action: fysiologi`, `signals` |
| 11 | WebAuthn | Håll Hjärtat 3s i hub (Fyren) | Passkey-prompt på enhet med stöd |
| 12 | Kill switch | Skaka hårt (mobil) | Session rensad, navigerar till `/` |
| 13 | Dagbok röst | `/dagbok` → text-steg → mikrofon (sv-SE) | Text appendas i reflektionssteget |
| 14 | Dagbok → Speglar | Spara post → länk "gaslighting" | Navigerar till `/dagbok?tab=speglar` med förifylld känsla/humör |
| 15 | Speglar AI | `/dagbok?tab=speglar` → Spegla | AI-svar från `speglingsMirror` (eller deterministisk fallback) |
| 16 | Valv media | Fyren → PIN → Bevis → skärmdump | `evidenceUrl` i `reality_vault`; fil i Storage `vault_evidence/{uid}/` |
| 17 | Valv PDF | Bevis → Logga → PDF-knapp på post | Utskriftsdialog öppnas (spara som PDF) |
| 18 | Dossier bro | Bevis → flik Dossier → Öppna generator | Navigerar till `/dossier` (canonical) |
| 19 | Legacy redirect | `/valv`, `/kunskap`, `/barnen` | Redirect till `/dagbok?tab=bevis`, `/vardagen?tab=kunskap`, `/familjen` |
| 20 | Vault unlock reset | Bevis-flik → byt till Reflektion | `isVaultUnlocked` false; gate rensad |

**Prod-smoke:** Kör #11–20 mot [Hosting-URL](https://gen-lang-client-0481875058.web.app) efter deploy.

**Mall för manuell rapport:** [`docs/evaluations/2026-05-23-smoke-manuell.md`](evaluations/2026-05-23-smoke-manuell.md)  
**Automatiserad aggregat:** `npm run smoke:all` (callables) · `npm run smoke:build` (TypeScript)

Verifiera dokument i [Firestore Console](https://console.firebase.google.com/project/gen-lang-client-0481875058/firestore).

**G7 opt-in minne:** `/dagbok` → checkbox "Spara i Minne (Kampspár)" vid spara → `kampspar` med `source: journal_woven`. Automatiserat: `npm run smoke:journal`.

**Ej i denna checklista:** Drive-pipeline (`notifyNewFile`) — se [DRIVE_AUTOMATION.md](./DRIVE_AUTOMATION.md).
