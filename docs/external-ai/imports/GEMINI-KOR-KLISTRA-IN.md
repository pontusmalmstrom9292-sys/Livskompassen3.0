# Gemini Deep Research — KOR klistra-in (med kanon)

**Datum:** 2026-06-16 · **Användning:** Ny Gemini-chatt → bifoga `05-research-handoff/` → klistra in **hela kodblocket** nedan.

Ersätter körning utan kanon-block. Spara svar i `GEMINI-SVAR-KLISTRA-HAR.md`.

---

```
VIKTIGT — LIVSKOMPASSEN-KANON (läs före all research):
- Jämför mot bifogade register (MODUL, INNEHALL, gap-matrix, domän-covert).
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG.
- content_class: FACT | REFLECTION | PLAY | EVIDENCE — aldrig blanda.
- WORM = beteende + datum + citat — aldrig diagnos på motpart.
- Ex/gaslighting → Hamn/Speglar, inte MåBra.
- Ingen streak/XP. Källor: 1177, BRIS, NHS, AFCC, Konsumentverket — undvik clickbait.
- Varje fynd: full YAML med existing_overlap, recommendation, source_url.
- Leverans: executive summary + våg 27-plan (15–25 poster) + 8 regel-förslag.

SCOPE-BEGRÄNSNING:
- Max 25 NEW-fynd totalt (rankade). Resten: OVERLAP eller DEFER.
- Sverige först: 1177, BRIS, Socialstyrelsen, Konsumentverket, Föräldrabalken (översikt).
- Undvik: terapiprogram, diagnos på motpart, clickbait, Flutter/RN, streak/gamification.
- Jämför mot befintlig bank (117 FACT + CANDIDATE våg 27 i bifogad kontext).

═══════════════════════════════════════════════════════════════
LIVSKOMPASSEN — DEEP RESEARCH MASTER (Fakta & slutfas-regler)
═══════════════════════════════════════════════════════════════

## ROLL
Du är forskningsledare för Livskompassen v2 — privat Life OS (React/Firebase) för neuroinkludering, medföräldraskap i högkonflikt, och bevishantering. Ton: klinisk, lågaffektiv, evidensbaserad. Inget JADE.

## UPPDRAG
Djup extern research med 5 parallella underagenter (SA-1..5). INTE app-kod — utan:
1) Fakta och best practice från myndigheter och etablerad psychoeducation
2) Mappa varje fynd till modul, route, content_class
3) Luckor vs befintlig Kunskap (117 FACT) och MåBra-bank
4) Starkare slutfas-regler (KEEP / DEFER / REJECT)

## 5 UNDERAGENTER
| ID | Zon | Fokus |
|----|-----|-------|
| SA-1 | Vardagen/MåBra | GAD, ADHD, RSD, grounding/vagus |
| SA-2 | Valv/Hamn/Speglar | HCF, parallel parenting, BIFF, DARVO — beteende inte diagnos |
| SA-3 | Ekonomi/Planering | ADHD-ekonomi, impulser, kapacitetsstyrd UI |
| SA-4 | Familjen/Barnporten | Barn HCF, lojalitet, ålderssegment |
| SA-5 | Meta | Prioritering, anti-overwhelm, Life OS UX |

## OUTPUT-SCHEMA (obligatoriskt per fynd)
```yaml
id: "research-{sa}-{nnn}"
content_class: FACT|REFLECTION|PLAY|EVIDENCE
target_zone: kunskap|mabra|barnen|hamn|valv|rules
target_module: "från MODUL-FUNKTIONS-REGISTER"
route: "/vardagen?tab=..."
category: "t.ex. gad_angest, ekonomi_vardag, barn_hcf"
source_tier: P1|P2|P3
source_url: "https://..."
source_title: "..."
claim_sv: "1-3 meningar neutral svensk fakta"
why: "varför relevant"
existing_overlap: "kunskap-fact-XXX eller INGEN"
recommendation: KEEP|NEW|DEFER|REJECT
rule_impact: "cursor rule om tillämpligt"
```

## LEVERANS
1. Executive summary (max 15 rader): top 10 luckor + top 5 regler
2. Per SA-1..5: alla fynd i YAML-schema
3. Våg 27-plan: 15–25 poster rankade
4. Max 8 regel-förslag till `.cursor/rules/`
5. Numrerad källista med URL

Börja med executive summary, sedan detaljtabeller.

Jämför alla fynd mot bifogade register. Markera OVERLAP vs GAP. Bryt inte locked UX (Barnfokus, Valv Mönster/Orkester, P3 Kanban).
═══════════════════════════════════════════════════════════════
```
