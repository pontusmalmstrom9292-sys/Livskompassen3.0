# Familjehubben — Trygg Hamn (done 2026-06-06)

**Scope:** BIFF/Grey Rock i `/familjen?tab=hamn` — publikt brusfilter + embedded polish.

---

## Levererat

| Punkt | Detalj |
|-------|--------|
| Publikt brusfilter | `BiffTriagePanel` efter `analyzeMessage` i `BiffPublicPanel` (logistik vs beten) |
| Familjehubben embedded | `HamnModuleStack` + Grey Rock/10-90-intro + Speglar-länk |
| Standalone `/hamn` | Samma `HamnModuleStack` under BIFF-flik (redirect → Familjen) |
| Copy | `hamnCopy.ts` — deterministisk, Obsidian Calm |
| Inkast | `sourceModule: hamn_biff` → bevis (befintlig heuristik) |
| Speglar-bro | `prefilledMessage` → `/familjen?tab=hamn` (orörd) |

---

## Test

```bash
npm run smoke:hamn
npm run smoke:locked-ux
npm run build
```

**Manuell:** `/familjen?tab=hamn` → klistra in ex-sms → Få Grey Rock-svar → triage visas → Klar rensar.

**Deploy:** `firebase deploy --only hosting` (frontend only)

---

## Ej scope (senare)

- Wizard steg 3 (användarens mål) före svar
- Dölj tills energi (fas 2)
- Drogfrihet fliknamn (P1 i hub-analys)
