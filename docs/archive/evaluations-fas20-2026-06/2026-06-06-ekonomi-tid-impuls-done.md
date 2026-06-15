# Ekonomi — tid + impulsparkering (done 2026-06-06)

**Scope:** `/vardagen?tab=ekonomi` — fem spår, snabb stämpel, 24h impuls.

---

## Levererat

| Punkt | Detalj |
|-------|--------|
| 5 flikar | Budget · Neuro-Kost · Impuls · Spar · Tid |
| Modulväljare | Varje kort öppnar rätt flik direkt (ej gemensam «Smarta verktyg») |
| Impulsparkering | Egen flik · `ekonomiCopy.ts` |
| Tid & stämpel | `EconomyTidPanel` + **Snabb stämpel** i `TimeAndPayPanel` |
| Copy | `ekonomiCopy.ts` — deterministisk |

---

## Test

```bash
npm run smoke:ekonomi
npm run smoke:modulvaljare
npm run smoke:economy-vendor
npm run build
```

**Manuell:** `/vardagen?tab=ekonomi` → Impuls → parkera köp · Tid → Stämpla in/ut.

**Deploy:** `firebase deploy --only hosting`

---

## Ej scope

- Callable `generatePayslip` deploy (Fas 2 backend — redan kontrakt-test)
- Grafer / gamification
