# Smoke — Ekonomi och stämpelklocka (Firestore)

**Route:** `/vardagen?tab=ekonomi` · **Full vy:** `/stampla`

## Förutsättningar

1. `.env` med `VITE_FIREBASE_*`
2. Auth (Anonymous eller e-post) — appen öppen
3. Firestore rules deployade (inkl. `time_entries`, `economy_profiles`):

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Checklista (telefon eller localhost)

| # | Steg | Förväntat |
|---|------|-----------|
| 1 | Öppna Vardagen → Ekonomi | SaldoHero + Tid och lön syns |
| 2 | Sätt timlön under Profil (t.ex. 200) | Sparas utan fel |
| 3 | Stämpla in (kategori Arbete) | "Pågående pass sedan HH:MM" |
| 4 | Stämpla ut | Pass i listan med timmar > 0 |
| 5 | Veckopeng-knapp | Ny rad i Transaktioner, saldo ökar |
| 6 | Firestore Console → `time_entries` | Dokument med ditt `ownerId` |
| 7 | `/stampla` | Veckokalender med timmar |

## Fel som ofta betyder rules ej deployade

- `permission-denied` vid stämpla → kör deploy ovan
- Tom flex/timmar men inget fel → normalt före första pass

## PontusArbetsapp (sandbox)

Efter godkänd smoke: använd **inte** clasp/Kalkylark för daglig drift. Sandbox: `~/StudioProjects/Livskompassen-sandbox-stampel-ekonomi`.

Valfri historik: [`scripts/import-pontus-sheet.mjs`](../scripts/import-pontus-sheet.mjs).

## Automatiserad smoke

```bash
npm test
npm run smoke:ekonomi
npm run smoke:payslip   # kräver deployade functions (generatePayslip)
firebase deploy --only firestore:rules,functions:generatePayslip,functions:scheduledGeneratePayslip
```

## Referens

- ADR: [`docs/decisions/ADR-ekonomi-firestore-not-sheets.md`](decisions/ADR-ekonomi-firestore-not-sheets.md)
- Spec: [`docs/specs/modules/Ekonomi-SPEC.md`](specs/modules/Ekonomi-SPEC.md)
