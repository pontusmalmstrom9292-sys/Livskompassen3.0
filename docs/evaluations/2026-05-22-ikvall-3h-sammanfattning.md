# Ikväll 3h — sammanfattning — 2026-05-22

**Plan:** Autorun + app igång (tre parallella spår)

## Spår 1 — Autorun (Natt-CI kedja)

**Status:** **PASS**

- Build (functions + frontend) + eslint
- Alla 12 `smoke:*` scripts PASS
- Logg: [`2026-05-22-BUILD-LOG.md`](2026-05-22-BUILD-LOG.md), [`../SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)

## Spår 2 — Lokal app

**Status:** **PASS** (start) · manuell checklist **PARTIAL**

- `npm run dev` → http://localhost:5175 (port 5173–5174 upptagna)
- Hem + `/dagbok` laddar utan auth-fel
- Rapport: [`2026-05-22-manuell-smoke-ikväll.md`](2026-05-22-manuell-smoke-ikväll.md)

## Spår 3 — P0 `notifyNewFile`

**Status:** **PASS** (kod + deploy) · **ACTION** (env)

- `ownerId`/`ownerUid` i webhook-body **ignoreras**
- `ownerId` sätts endast från `process.env.DRIVE_INGEST_OWNER_UID`
- Deploy: `notifyNewFile` europe-west1 **klar**
- **Du måste sätta uid:** `DRIVE_INGEST_OWNER_UID=<din Firebase Auth uid>` i `functions/.env.gen-lang-client-0481875058` eller `firebase functions:secrets:set DRIVE_INGEST_OWNER_UID` (+ lägg secret i `runWith` om Secret Manager)

Dokumentation: [`../DRIVE_AUTOMATION.md`](../DRIVE_AUTOMATION.md), [`.context/security.md`](../../.context/security.md)

## Öppet (medvetet utanför ikväll)

| Item | Status |
|------|--------|
| Client-PIN server/WebAuthn | **open** — `kör P0-serverPin` |
| Manuell smoke #3–#17 | **pending** — användaren klickar |
| `@cursor/sdk` Natt-CI-paket | **WAIT** — [`../NATT-CI.md`](../NATT-CI.md) |

## Ett nästa steg

Sätt `DRIVE_INGEST_OWNER_UID` till ditt Auth-uid och spara en dagbokspost lokalt (#2 i smoke-checklistan).
