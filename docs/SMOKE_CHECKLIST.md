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
| 13 | Dagbok röst | `/dagbok` → text-steg → mikrofon (sv-SE) | Text appendas i reflektionssteget |
| 14 | Dagbok → Speglar | Spara post → länk "gaslighting" | Navigerar till `/speglar` med förifylld känsla/humör |
| 15 | Speglar AI | `/speglar` → Spegla | AI-svar från `speglingsMirror` (eller deterministisk fallback) |
| 16 | Valv media | Long-press Fyren → PIN → `/valv` → skärmdump | `evidenceUrl` i `reality_vault`; fil i Storage `vault_evidence/{uid}/` |
| 17 | Valv PDF | Valv-lista → PDF-knapp på post | Utskriftsdialog öppnas (spara som PDF) |
| 18 | Ekonomi | `/vardagen?tab=ekonomi` — veckopeng | Post i `transactions` med `ownerId` = uid; profil i `economy_profiles` vid budgetändring |
| 19 | Middagsfrågan (låst) | `/familjen` → Arvid → Middagsfrågan → spara | Rad i **minneslista** direkt; `children_logs` med `category: middag` |
| 20 | Valv Mönster/Orkester (låst) | Fyren → Bevis → flikar **Mönster** + **Orkester** | Frekvensvy + agentlista; SMS-tråd → mönstersökning svarar |
| 21 | WH1 tyst inspelning (låst) | `/widget/inspelning` — etik → inspelning 10s → stopp | `reality_vault` med `category: tyst_inspelning`, `evidenceUrl`, `SAMMANFATTNING` i `truth` |
| 22 | WH5 Familjen widget | `/widget/familjen` — spara rad | `children_logs` med `category: widget_snabb` |

**Automatisk kod-guard (låsta UX):** `npm run smoke:locked-ux` — ska exit 0 före merge som rör Barnen/Valv.

**Prod-smoke:** Kör #13–17 mot [Hosting-URL](https://gen-lang-client-0481875058.web.app) efter deploy (storage + `speglingsMirror` + hosting).

Verifiera dokument i [Firestore Console](https://console.firebase.google.com/project/gen-lang-client-0481875058/firestore).

**Ej i denna checklista:** Drive-pipeline (`notifyNewFile`) — se [DRIVE_AUTOMATION.md](./DRIVE_AUTOMATION.md) efter att `NOTIFY_WEBHOOK_SECRET` satts.
