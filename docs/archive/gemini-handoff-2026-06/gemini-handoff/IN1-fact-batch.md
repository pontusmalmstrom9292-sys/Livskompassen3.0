# IN1 — Kunskap FACT batch (Gemini → kurator)

**Datum:** 2026-05-30  
**Status:** Batch **026–030** finns redan i [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md) (ADHD/GAD våg).  
**Register:** [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) — `kunskap-fact-001`–`047`.

## Plan-topics vs bank (gap)

| Plan-ämne | Bank-id | Status |
|-----------|---------|--------|
| RSD | kunskap-fact-021 | KEEP — redan seed |
| Zero Footprint | kunskap-fact-022 | KEEP |
| Tre silor | kunskap-fact-023 | KEEP |
| ADHD mikrosteg | kunskap-fact-018, 028 | KEEP |
| WORM bevis | kunskap-fact-024 | KEEP |
| Delat föräldraskap logistik | — | **DEFER** — ny post kräver kurator + INNEHALL-REGISTER rad |

## Nästa ingest (manuell)

```bash
npm run export:kunskap-seed
node scripts/seed_kampspar_profile.mjs --dry-run
```

**Ej auto-ingest** utan granskning (U6).

## JSON-manifest (026–030, referens)

```json
[
  {"id":"kunskap-fact-026","content_class":"FACT","status":"KEEP"},
  {"id":"kunskap-fact-027","content_class":"FACT","status":"KEEP"},
  {"id":"kunskap-fact-028","content_class":"FACT","status":"KEEP"},
  {"id":"kunskap-fact-029","content_class":"FACT","status":"KEEP"},
  {"id":"kunskap-fact-030","content_class":"FACT","status":"KEEP"}
]
```
