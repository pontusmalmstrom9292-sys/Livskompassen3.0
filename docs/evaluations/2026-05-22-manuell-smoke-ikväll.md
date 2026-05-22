# Manuell smoke — ikväll 2026-05-22

**Trigger:** Spår 2 — lokal app (`npm run dev`)  
**URL:** http://localhost:5175  
**Källor:** [`docs/SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md)

## Sammanfattning

Appen startar utan Firebase-auth-fel i konsol. Automatiserad backend-smoke är grön (12 scripts). Manuella Firestore-sparanden (#2–#4) kräver att du är inloggad och klickar igenom — agent verifierade routing och UI-laddning.

## Resultat per rad

| # | Test | Resultat | Anteckning |
|---|------|----------|------------|
| 1 | Auth | **PASS** | App laddar; inga auth-fel i konsol (endast React DOM nesting-varning) |
| 2 | Dagbok spara | **PARTIAL** | `/dagbok` laddar wizard; full WORM-sparning ej agent-verifierad — kör manuellt |
| 3 | Valv WORM | **PENDING** | Kräver Shield 3s + `VITE_VAULT_PIN` + manuell post |
| 4 | Barnen | **PENDING** | `/barnen` — manuell logg + Firestore Console |
| 5 | Kompasser | **PENDING** | |
| 6 | BIFF | **PENDING** | `/hamn` |
| 7 | Kunskap | **PENDING** | `/kunskap` eller `/vardagen?tab=kunskap` |
| 8 | Vävaren | **PENDING** | ~30s efter dagbok-sparning |
| 9 | Speglar | **PENDING** | `/speglar` |
| 10 | Barnen fysio | **PENDING** | |
| 11 | WebAuthn | **PENDING** | Enhet med passkey |
| 12 | Kill switch | **PENDING** | Mobil skaka |
| 13 | Dagbok röst | **PENDING** | |
| 14 | Dagbok → Speglar | **PENDING** | |
| 15 | Speglar AI | **PENDING** | Backend smoke: PASS |
| 16 | Valv media | **PENDING** | |
| 17 | Valv PDF | **PENDING** | |

## Nästa steg (ett)

Spara en dagbokspost på http://localhost:5175/dagbok och bekräfta i Firestore Console att `journal` fått ett dokument med ditt `userId`.
