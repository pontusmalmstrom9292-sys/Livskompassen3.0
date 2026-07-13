# Blocker — Cursor YOLO v13 P89 (drift)

**Datum:** 2026-07-13 · **Miljö:** Cursor Cloud Agent (`/workspace`) · **Typ:** miljö (ej kodregression)

## Vad

P89 drift-smokes som kräver riktiga Firebase-webbnycklar misslyckas i Cloud Agent-miljön:

| Smoke | Utfall | Orsak |
|-------|--------|-------|
| `smoke:widgets` | PASS | Statisk — inga secrets |
| `smoke:journal-2d` | FAIL | Saknar `VITE_FIREBASE_STORAGE_BUCKET` |
| `smoke:mabra` | FAIL | `auth/invalid-api-key` (saknar `VITE_FIREBASE_API_KEY`) |
| `smoke:valv` | FAIL | `VITE_FIREBASE_*` krävs i `.env` |

## Varför det inte är en regression

- `smoke:predeploy` (tier1 + security + locked-UX + e2e + cost-guard) är **grön**.
- Dessa tre smokes ingår inte i `smoke:predeploy` och pekar mot live Firebase, inte emulator.
- Samma blocker återkommer identiskt i varje efterföljande våg (v14+) tills secrets finns.

## Åtgärd (välj en)

1. Lägg till `VITE_FIREBASE_*`-secrets i Cloud Agent (Secrets-panelen) → smokes kan köras här.
2. Kör de tre smokesen lokalt/CI där `.env` med riktiga nycklar finns.

Tills dess: P89 markeras SKIP med denna blocker. Fortsätt kön (per orkester-autorun MUST NOT-mönster).
