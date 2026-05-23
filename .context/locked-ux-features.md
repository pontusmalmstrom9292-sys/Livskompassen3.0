# Locked UX Features (låsta — får inte tas bort)

**Status:** Låst 2026-05-23. Ändring kräver explicit produktbeslut i commit/PR.

Dessa är **inte** Sacred Features i säkerhetslagret, men de är **låsta produktflöden** för trygg hamn (Barnen) och Pansaret (Valv). Agent och refaktor får inte ta bort, döpa om eller gömma dem utan att uppdatera denna fil och smoke.

---

## 1. Middagsfrågan (Familjen / Barnen)

| | |
|---|---|
| **Route** | `/familjen` → `BarnensPage` |
| **Syfte** | Lekfulla middagssvar → omedelbar minneslista (dopamin + trygghet) |
| **Kod** | `MiddagsfraganPanel.tsx`, `middagsQuestionForToday`, `category: 'middag'` |
| **Krav** | Knapp **Spara till {barn}s logg**; optimistisk minneslista under formuläret |
| **Smoke** | `npm run smoke:locked-ux` (statisk) · manuell #19 i `docs/SMOKE_CHECKLIST.md` |

---

## 2. Pansaret — Mönster & Orkester (Valv / Bevis)

| | |
|---|---|
| **Route** | `/dagbok?tab=bevis` → `VaultPage` |
| **Flikar** | **Mönster** · **Orkester** (bredvid Logga, Sök, Dossier) |
| **Mönster** | `VaultMonsterPanel` + `buildVaultFrequencyReport` (deterministisk regex, ingen LLM-sanning) |
| **Orkester** | `VaultOrkesterPanel` + `PRODUCT_AGENTS` + SMS-tråd → `analyzeMessage` |
| **Smoke** | `npm run smoke:locked-ux` · manuell #20 i `docs/SMOKE_CHECKLIST.md` |

---

## 3. Planeringssidan (design låst)

| | |
|---|---|
| **Route (plan)** | `/planering` |
| **Spec** | `docs/design/PLANERINGSSIDA-SPEC.md`, mockups `docs/design/planering/` |
| **Krav** | P1–P4 layouter dokumenterade; e-postregler `planning_email_rules`; **inte** ex-brus hit |
| **Smoke** | Spec-fil + nyckelsträngar i `smoke_locked_ux.mjs` |

---

## 4. Fyren Edge — widget + tyst inspelning (design låst)

| | |
|---|---|
| **Spec** | `docs/design/WIDGET-BAR-SPEC.md` |
| **Krav** | W1–W4 dokumenterade; **ingen synlig REC** för barn vid tyst inspelning (förälder) |
| **Data** | `reality_vault` WORM, `category: tyst_inspelning` |
| **Smoke** | Spec-fil + nyckelsträngar |

---

## 5. Barnporten — barnens hub (design låst)

| | |
|---|---|
| **Route (barn)** | `/barnporten` (PWA) · **förälder** `/familjen?tab=barnporten` |
| **Spec** | `docs/design/BARNPORTEN-SPEC.md`, infografik `docs/design/barnporten/infographic.html` |
| **Orkester** | `src/modules/barnporten/constants/barnportenAgents.ts` — **egen** barn-Orkester (skild från Valv-Orkester) |
| **Valv** | Endast HITL `promoteChildLogToVault` — **aldrig** auto från privat barnlogg |
| **Widget** | CB1–CB4 (barn); **inte** samma som förälder W1 |
| **Smoke** | Spec + `barnportenAgents.ts` + mockup-mapp |

---

## Verifiering

```bash
npm run smoke:locked-ux
```

Vid refaktor av `VaultPage`, `BarnensPage`, eller borttagning av specs ovan: kör smoke innan merge.
