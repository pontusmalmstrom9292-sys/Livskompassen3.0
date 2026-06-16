# Cursor Multitask — Deep Research våg 27 (utan Gemini)

**Datum:** 2026-06-16 · **Klistra in hela kodblocket** i ny chatt med **Multitask / flera agenter** påslaget.

---

```
LIVSKOMPASSEN — MULTITASK DEEP RESEARCH (ersätter Gemini)

## Situation
Pontus orkar inte Gemini. Kör all research, syntes och bank-uppdatering HÄR i Cursor.
Baseline finns redan — jämför och förbättra, duplicera inte blint.

Läs först (readonly):
- docs/external-ai/imports/research-2026-06-16-master-syntes.md (+ sa1..sa5)
- docs/evaluations/2026-06-16-research-slutfas.md
- docs/specs/modules/Kunskap-CONTENT-SEED.md § våg 27 CANDIDATE
- docs/MODUL-FUNKTIONS-REGISTER.md
- docs/INNEHALL-REGISTER.md
- .context/domän-covert-narcissism.md

## KANON (brott = stopp)
- Tre silos — ingen cross-RAG
- content_class: FACT | REFLECTION | PLAY | EVIDENCE — aldrig blanda
- WORM = beteende + datum — aldrig diagnos på motpart
- Ex/gaslighting → Hamn/Speglar, INTE MåBra
- Ingen streak/XP
- BARNFOKUS_QUESTIONS / locked UX — rör inte utan PMIR
- Bank: CANDIDATE tills Pontus säger "godkänn KEEP"
- seed:kunskap-facts ENDAST efter KEEP

## MULTITASK — starta 5 subagents PARALLELLT (Task tool)

### Agent A — SA-1 Psyk (explore eller generalPurpose)
WebSearch + läs repo. Tema: GAD worry time, ADHD body doubling, RSD, grounding, 1177/NHS.
Leverans: docs/external-ai/imports/research-cursor-2026-06-16-sa1.md
Minst 15 YAML-fynd med source_url, existing_overlap, recommendation.
Jämför mot gad_angest, adhd_vardag, Mabra MB-REF-GAD-*.

### Agent B — SA-2 HCF (explore)
Tema: parallel parenting AFCC, BIFF/Grey Rock, DARVO, skriftlig kommunikation, parenting coordinator.
Källor: AFCC, BRIS, Föräldrabalken översikt — INTE clickbait.
Leverans: research-cursor-2026-06-16-sa2.md
Jämför cn-*, cop-*, jur-*, bh-*.

### Agent C — SA-3 Ekonomi (explore)
Tema: ADHD budget, kuvert, 24h-regel, veckobudget, kapacitetsstyrd UI, evolution_hub nivåer.
Leverans: research-cursor-2026-06-16-sa3.md
Jämför kunskap-fact-009, eko-001..004 CANDIDATE.

### Agent D — SA-4 Barn (explore)
Tema: BRIS lojalitet, budbärare, ålderssegment 3–5/6–9/10–13/14+, PLAY ≤2 min.
Leverans: research-cursor-2026-06-16-sa4.md
Jämför bh-*, BP-PLAY-25..27 CANDIDATE.

### Agent E — SA-5 Regler (explore)
Tema: modul-matris KEEP/STÄRK/DEFER, stop-doing list, 8 cursor rule-förslag, våg 27–28 ordning.
Leverans: research-cursor-2026-06-16-sa5.md
Jämför gap-matrix, fas19 masterplan.

YAML-schema per fynd:
id, content_class, target_zone, target_module, route, category, source_tier, source_url, source_title, claim_sv, why, existing_overlap, recommendation, rule_impact

## PARENT (efter alla 5 klara)

1. Skriv docs/external-ai/imports/research-cursor-2026-06-16-master-syntes.md
   - Executive summary max 15 rader
   - Top 25 NEW rankade (max 25 — resten OVERLAP/DEFER)
   - Diff mot baseline research-2026-06-16-*

2. Dirigent-routing → uppdatera banker:
   - NEW FACT → Kunskap-CONTENT-SEED § våg 27 (CANDIDATE)
   - NEW REFLECTION/PLAY → Mabra / Barnen-PLAY-BANK
   - Befintlig CANDIDATE: behåll om overlap; uppgradera citation om bättre källa

3. Uppdatera docs/evaluations/2026-06-16-research-slutfas.md

4. Implementera nya cursor rules om SA-5 rekommenderar och de saknas:
   - research-content-gate.mdc (finns)
   - capacity-ui-gate.mdc (finns)
   - ev. hamn-written-default, barn-observation-epistemik (endast om motiverat)

5. Kör: npm run smoke:innehall
   - FAIL → fixa tills PASS
   - INTE seed:kunskap-facts (vänta KEEP)

6. Kort slutrapport till Pontus:
   - Vad som NEW vs redan CANDIDATE
   - Ett steg: "godkänn KEEP" eller "justera X"

## FÖRBJUDET
- Flutter/RN, 5-tab nav, streak, cross-RAG, diagnos-etiketter
- Mass-radering, firestore.rules, deploy utan fråga
- Committa inte om Pontus inte bett om det

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke:innehall PASS och filer är sparade.
```

---

## Hur du startar (Mac)

1. **Cmd + L** → ny chatt  
2. Slå på **Multitask** (om Cursor frågar)  
3. Klistra in **hela kodblocket** ovan  
4. Låt köra — gå och vila, kom tillbaka till slutrapporten  

Ingen Gemini. Ingen handoff-mapp. Baseline i repo räcker.
