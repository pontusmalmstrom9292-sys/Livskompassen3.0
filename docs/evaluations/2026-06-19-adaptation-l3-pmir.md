# PMIR — Adaptation L3a (coach-ton + hygien)

**Datum:** 2026-06-19  
**Status:** Redo för merge till `main` efter Pontus OK  
**Prod:** `mabraCoach` + hosting deployade 2026-06-19

---

## Sammanfattning

L3a kopplar `adaptation_prefs.coachTone` till deterministisk MåBra bank-parafras (`bank_parafras`, deterministic `coach`). Parallell hygien: Zero Footprint vid logout, server-only ledger audit, offline policy för `adaptation_prefs`.

---

## Berörda zoner

| Zon | Ändring |
|-----|---------|
| **Core / Adaptation** | `adaptationCoachTone.ts`, logout cleanup, ledger client dual-write borttagen |
| **Vardagen / MåBra** | `mabraContentBank`, `mabraCapacityParafras`, `mabraCoach` callable |
| **Regler / smoke** | `.cursor/rules/adaptation-kanon.mdc`, `smoke:adaptation-l3a`, `smoke:tier1` |

**Ej berört:** Valv, Barnen, Kunskap RAG, `firestore.rules`, locked UX-struktur.

---

## Säkerhet (YOLO-vakt GO)

| Kontroll | Resultat |
|----------|----------|
| Tre silos / ingen cross-RAG | PASS |
| LLM skriver inte prefs | PASS |
| WORM `adaptation_ledger` | PASS |
| U6 bank-only parafras | PASS |
| Zero Footprint logout | PASS |
| Locked UX | PASS (`smoke:locked-ux`) |

---

## Smoke (kör före merge)

```bash
cd functions && npm run build
cd .. && npm run build
npm run smoke:adaptation
npm run smoke:adaptation-l3a
npm run smoke:mabra
npm run smoke:innehall
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:manifest
```

---

## Deploy

**Redan kört:**

```bash
firebase deploy --only functions:mabraCoach,hosting
```

**Rollback:** revert commit → `firebase deploy --only functions:mabraCoach,hosting` (föregående revision).

---

## Filer (adaptation L3 — exkl. unrelated chrome WIP)

- `functions/src/lib/adaptationCoachTone.ts` (ny)
- `functions/src/lib/mabraContentBank.ts`
- `functions/src/lib/mabraCapacityParafras.ts`
- `functions/src/callables/agents.ts`
- `functions/src/agents/vertexAgent.ts`
- `src/modules/core/auth/authService.ts`
- `src/modules/core/firebase/adaptationLedgerFirestore.ts`
- `src/modules/core/firebase/offlineWritePolicy.ts`
- `src/modules/core/hooks/useAdaptationSync.ts`
- `.cursor/rules/adaptation-kanon.mdc` (ny)
- `scripts/smoke_adaptation.mjs`, `scripts/smoke_adaptation_l3a.mjs`, `scripts/smoke_mabra.mjs`
- `package.json` (`smoke:adaptation-l3a`, `smoke:tier1`)

---

## Medvetet parkerat (nästa våg)

- **L3b:** semantic context i `vit_chat`, nutrition, Speglar
- **L3c:** client `MabraCoachPanel` → deterministic tier
- Embeddings / Vector Search för adaptation

---

## Merge-beslut

Pontus: **godkänn merge** / **ändra X** — committa endast adaptation-L3-filer (ej chrome WIP i samma commit).
