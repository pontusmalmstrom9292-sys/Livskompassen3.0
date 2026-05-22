# Minne — Profil-seed 2026-05-21

**Policy:** `full_batch_approved` — full batch-ingest godkänd av användare.  
**Källa:** Kladd-2026-05-21-PERSONAL-MASTER + kampspar-kandidater + användarregler.  
**Target:** `kampspar` (Kunskapsvalvet) — **inte** `reality_vault`.  
**Canonical:** [`Kampspar-PROFIL-SEED.json`](Kampspar-PROFIL-SEED.json) (47 poster)

## Körning

```bash
node scripts/seed_kampspar_profile.mjs --dry-run
node scripts/seed_kampspar_profile.mjs
node scripts/seed_kampspar_profile.mjs --skip-existing
node scripts/seed_kampspar_profile.mjs --category=diagnos
```

Kräver `.env` med `VITE_FIREBASE_*`. Valfritt: `SEED_FIREBASE_EMAIL` + `SEED_FIREBASE_PASSWORD` för din riktiga användare.

## Poster per kategori

| Kategori | Antal | Exempel |
|----------|------:|---------|
| profil | 5 | Pontus profil, aktörskarta, tidslinje, sjukskrivning |
| insikt | 2 | Maktbalans, identitet/ordbajs |
| diagnos | 4 | ADHD F90.0B, GAD F41.1, hypervigilans, allostatisk belastning |
| medicin | 3 | Slutenvård F155, F155 kontext, Alimemazin |
| strategi | 5 | Grey Rock 10/90, BIFF, soc-strategi, JADE, systemisolering |
| myndighet | 2 | Soc samordning, drogtester |
| metod | 9 | DARVO, gaslighting, narcissistiska dynamiker, dokumentation |
| barn | 5 | Kasper, Arvid, mammaveckor, BBIC, neutral logg |
| värdering | 3 | Parallel föräldraskap, trygga hamnen, citat |
| coping | 7 | 4-7-8, RSD, ACT, självmedkänsla, Måbra, panik |
| varning | 1 | Tappa inte bort dig själv |
| **Totalt** | **47** | |

## Domänagent-källor

| Agent | Poster |
|-------|--------|
| ProfilAgent | profil, insikt (delvis) |
| NeuroAgent | diagnos, medicin, RSD |
| KonfliktAgent | strategi, myndighet |
| ForaldraAgent | barn, värdering |
| CopingAgent | coping, varning |
| MetodAgent | metod |

## Merge från kandidater

Alla 12 rader från [`Kladd-2026-05-21-kampspar-kandidater.md`](Kladd-2026-05-21-kampspar-kandidater.md) ingår (dedup på title). Utökade poster med samma titel har mer detalj i separata poster (t.ex. "Slutenvård F155" + "F155 — engångsepisod kontext").
