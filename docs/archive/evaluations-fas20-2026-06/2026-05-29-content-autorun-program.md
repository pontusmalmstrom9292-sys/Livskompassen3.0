# Content Autorun — helprogram klart (2026-05-29)

**Scope:** Våg 0–7 implementerade i repo · Våg 8 ingest-checklista (kräver dig)

---

## Levererat

| Våg | Innehåll | UI |
|-----|----------|-----|
| 0 | `content:night`, `CONTENT-WAVES.md`, export manifest (53 FACT) | — |
| 1 ADHD | FACT 026–028, MB-REF/PLAY ADHD | CUR-ADHD-01 |
| 2 GAD | FACT 029–035, MB-REF-GAD, MB-PLAY-GAD-01 | CUR-GAD-01 |
| 3 Känslor/ACT | FACT 036–040, C-feel, MB-REF-ACT | CUR-FEEL-01, CUR-ACT-01 |
| 4 Föräldraskap | FACT 041–042, BP-PLAY-01–05 | CUR-PARENT-01 |
| 5 Taktiker | FACT 043–047 (referens) | CUR-TAKTIK-01 → Speglar/Valv |
| 6 Medföräldraskap | befintliga FACT | CUR-COPARENT-01 → Hamn |
| 7 Droger | df-*, DF-REF-11/12 | CUR-SOBRIETY-01 |
| 8 | [`content-autorun-vag-8-ingest.md`](./2026-05-29-content-autorun-vag-8-ingest.md) | — |

**App:** `/mabra` → **Dina kurser** (`VitCurriculumPanel`)

---

## Smoke (PASS 2026-05-29)

```bash
npm run content:night
npm run orkester:night
npm run smoke:content-waves
npm run smoke:innehall
```

---

## Nästa steg (1)

Manuell granskning → `node scripts/seed_kampspar_profile.mjs --manifest=kunskap-facts --dry-run` → live ingest efter OK.
