# Smoke-checklista (Fas 3)

**Bygg (automatiserbart):** `cd functions && npm run build && cd .. && npm run build` — ska exit 0.

**Firestore / Auth (manuellt):** Kräver app (lokal `npm run dev` eller [Hosting-URL](https://gen-lang-client-0481875058.web.app)) och inloggning (Anonymous eller e-post om `VITE_REQUIRE_EMAIL_AUTH=true`).

**Kanoniska routes (2026-06):** `/hjartat` (reflektion/speglar) · `/valvet` (bevis/Valv) · `/vardagen` · `/familjen` · legacy `/dagbok`, `/hamn`, `/liv` redirectar.

| # | Test | Route / åtgärd | Förväntat |
|---|------|----------------|-----------|
| 1 | Auth | Öppna app | Ingen auth-fel i konsol; uid i Firebase Auth |
| 2 | Dagbok | `/hjartat` → Reflektion — spara post | Dokument i `journal` med `userId` = uid; ingen `updatedAt` |
| 2b | Dagbok sub-nav | `/hjartat` → Snabb / Reflektera / Arkiv | Växling utan sidkrasch |
| 2c | Dagbok handoff | Reflektera — «mitt bevis till polisen» | Handoff-ruta; «Öppna Valvet» → `/valvet` |
| 2d | Dagbok bilaga | Reflektera → fil &gt; 5 MB | Mjukt fel; &lt; 5 MB → `attachment` + Storage `journal_memories/` |
| 3 | Valv | Fyren 3s (Kompis-öga) → biometri → `/valvet` | Post i `reality_vault` |
| 4 | Barnen | `/familjen?tab=livslogg` — spara logg | Post i `children_logs` |
| 5 | Kompasser | `/vardagen` — check-in | Post i `checkins` |
| 6 | BIFF | `/familjen?tab=hamn` — skicka meddelande | Svar från `analyzeMessage` |
| 6b | Hamn forensic | `/hamn?tab=analys` | Redirect → `/valvet?vaultTab=hamn_analys` |
| 7 | Kunskap | Valv → Kunskapsbank — fråga | Svar från `knowledgeVaultQuery` (PIN + Valv-session) |
| 8 | Vävaren | `/hjartat` — spara post, vänta ~30s | Ny rad i `reality_vault`, `category: vävaren_metadata` |
| 9 | Speglar | `/hjartat?tab=speglar` | ACT + VIVIR laddar |
| 10 | Barnen fysio | `/familjen?tab=livslogg` → fysiologi | `children_logs` med `action: fysiologi` |
| 11 | WebAuthn | Fyren 3s | Passkey-prompt; `issueVaultSession` kräver WebAuthn-svar |
| 12 | Device Clear | Inställningar → Rensa enheten | Lokal rensning + `invalidateSession` (ersätter Kill Switch) |
| 13 | Dagbok röst | `/hjartat` → mikrofon (sv-SE) | Text appendas |
| 14 | Dagbok → Speglar | Spara post → länk | Navigerar till `/hjartat?tab=speglar` |
| 15 | Speglar AI | Speglar → Spegla | Svar från `speglingsMirror` |
| 16 | Valv media | Fyren → `/valvet` → skärmdump | `evidenceUrl` + Storage `vault_evidence/{uid}/` |
| 17 | Valv PDF | Valv-lista → PDF | Utskriftsdialog |
| 18 | Ekonomi | `/vardagen?tab=ekonomi` | `transactions` + `economy_profiles` |
| 19 | Barnfokus (låst) | `/familjen?tab=reflektion` → spara | `children_logs` med `category: barnfokus` |
| 20 | Mönster/Orkester (låst) | Fyren → `/valvet` → Mönster + Orkester | Frekvensvy + agentlista |
| 21 | WH1 inspelning (låst) | `/widget/inspelning` | `reality_vault` tyst inspelning |
| 22 | WH5 Familjen widget | `/widget/familjen` | `children_logs` widget_snabb |

**Automatisk kod-guard:** `npm run smoke:locked-ux` — före merge som rör Barnen/Valv.

**Automatisk batch:** `npm run smoke:all` — locked-ux + modul-smokes + valv-security + orkester + innehall.

**Prod-smoke:** Hard refresh (Cmd+Shift+R) efter deploy.

Verifiera i [Firestore Console](https://console.firebase.google.com/project/gen-lang-client-0481875058/firestore).

**Drive-pipeline:** [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md) efter `NOTIFY_WEBHOOK_SECRET`.
