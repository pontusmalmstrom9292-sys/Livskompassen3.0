# Minne — Barn-referens seed 2026-05-24

**Policy:** `reference_batch_approved` — evidensbaserad referens om barns utveckling, känslor och skydd i högkonflikt.  
**Target:** `kampspar` (Kunskapsvalvet) — **inte** `children_logs` (specifika händelser) eller `reality_vault`.  
**Canonical:** [`Kampspar-BARN-REFERENS-SEED.json`](Kampspar-BARN-REFERENS-SEED.json) (18 poster)

## Körning

```bash
node scripts/seed_kampspar_profile.mjs --manifest=barn-referens --dry-run
node scripts/seed_kampspar_profile.mjs --manifest=barn-referens
node scripts/seed_kampspar_profile.mjs --manifest=barn-referens --skip-existing
node scripts/seed_kampspar_profile.mjs --manifest=barn-referens --category=barn
```

Eller via npm:

```bash
npm run seed:barn-referens
```

Kräver `.env` med `VITE_FIREBASE_*`. Valfritt: `SEED_FIREBASE_EMAIL` + `SEED_FIREBASE_PASSWORD`.

## Poster per kategori

| Kategori | Antal | Exempel |
|----------|------:|---------|
| barn | 11 | Utveckling 0–12, anknytning, känslor, stresssignaler, NPF, milstolpar |
| metod | 6 | Narcissistisk förälder (barnperspektiv), parentification, DARVO mot barn |
| strategi | 1 | Skydda barn utan att tala illa om mor |
| **Totalt** | **18** | |

## Källor (evidensbas)

- BBIC (Barns Behov i Centrum) — struktur för dokumentation
- Anknytningsteori (Bowlby/Ainsworth)
- Emotionell reglering och co-regulation (utvecklingspsykologi)
- Parentification, lojalitetsfälla, splitting — klinisk familjeforskning (generella mönster)
- NPF + stressbelastning — neuropsykiatri/skola

**Policy:** Beskriv beteenden och barnets behov inför myndigheter — undvik diagnostiserande etiketter på vuxna (se befintlig `Soc: fakta före känsla`).

## Routing

| Innehåll | Silo |
|----------|------|
| Generell referens, metod, strategi | `kampspar` (denna seed) |
| Kasper/Arvid dagliga observationer | `children_logs` (Barnen) |
| SMS/bevis | `reality_vault` (Valv) |
| Akut validering | Speglar |
