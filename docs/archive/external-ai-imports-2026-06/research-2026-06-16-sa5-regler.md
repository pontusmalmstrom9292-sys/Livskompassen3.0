# Research — SA-5 Regler, prioritering & slutfas

**Datum:** 2026-06-16 · **Agent:** SA-5 (Cursor baseline)

---

## Modul-matris (MODUL-FUNKTIONS-REGISTER)

| Modul | Route | Status | Research-kommentar |
|-------|-------|--------|-------------------|
| core | /, Fyren, drawer | **KEEP** | Anti-overwhelm: en sak i taget bekräftat (Daylio/Finch-linje) |
| wellbeing/compasses | /vardagen?tab=kompasser | **KEEP** | Morgonkompass Sacred |
| evidence/kompis | Valv kunskapsbank | **STÄRK** | FACT våg 27 fyller luckor |
| wellbeing/economy | vardagenTab=ekonomi | **STÄRK** | Kapacitets-gating Nivå 1–3 |
| diary/diary | /hjartat | **KEEP** | |
| evidence/vault | /valvet | **KEEP** | Mönster/Orkester locked |
| diary/mirror | speglar | **KEEP** | Zero Footprint |
| family/safeHarbor | /familjen?tab=hamn | **STÄRK** | Nya wire-signaler |
| family/children | /familjen | **KEEP** | Barnfokus locked |
| barnporten | /barnporten | **LUCKA** | Teen PLAY + evolution bracket |
| wellbeing/mabra | /vardagen?tab=mabra | **STÄRK** | hybrid-8 Fas 19.2 klar |
| admin/planning | /planering | **KEEP** | P3 Kanban locked |
| admin/projects | /projekt | **DEFER** | polish efter tokens |
| evidence/vault/dossier | dossier | **KEEP** | |
| widgets | /widget/* | **KEEP** | WH1/WH2 locked |
| admin/stampla | arbetsliv | **KEEP** | |
| arbetsliv | /arbetsliv | **KEEP** | |
| drogfrihet | /drogfrihet | **KEEP** | |
| inkast | #inkast-lite | **KEEP** | G10 locked |

---

## 8 regel-förslag (`.cursor/rules/`)

1. **`research-content-gate.mdc`** — Ingen FACT ingest utan `source_tier` + URL; research → CANDIDATE → manuell KEEP.
2. **`capacity-ui-gate.mdc`** — Nivå 1 döljer `economy_advanced` och `planning_kanban`; dokumentera i evolution_hub.
3. **`hamn-written-default.mdc`** — Vid HCF-upload-prior: föreslå skriftlig kanal före telefon i Hamn-copy.
4. **`barn-observation-epistemik.mdc`** — children_logs: citat/observation skilt från tolkning (bh/ep-koppling).
5. **`worry-time-mabra-only.mdc`** — Worry time som REFLECTION/PLAY i MåBra; FACT i Kunskap — aldrig cross-RAG.
6. **`no-diagnosis-labels.mdc`** — Förstärk domän-regel: inga narcissist-/diagnos-etiketter i WORM/UI (redan delvis i domän-covert).
7. **`slutfas-stop-list.mdc`** — Stop doing: streak, 5-tab nav, Hem→Hjärtat merge, Flutter, cross-RAG.
8. **`weekly-money-checkin.mdc`** — Ekonomi: veckovis check-in som default, inte månatlig djupbudget vid Nivå 1.

---

## Stop doing list (10)

1. Streak / XP / leaderboard  
2. Teal primär chrome  
3. Cross-RAG "sök överallt"  
4. Auto-promote barnlogg → Valv  
5. Diagnos på motpart i dossier  
6. Flutter/RN-migrering  
7. Hem→Hjärtat merge utan PMIR  
8. Wow-animationer (ADHD-säkerhet)  
9. 30+ budgetkategorier som default  
10. LLM skapar FACT utan bank

---

## Prioriterad ordning (slutfas)

| Fas | Innehåll |
|-----|----------|
| 19.3 | hex→tokens (pågår) |
| 19.4 | JOY-17 mabraCoach bank-synk |
| 19.5 | evolution_ledger dual-write |
| Content våg 27 | SA-1 worry/body-double + SA-3 ekonomi + SA-4 bh-015 |
| Content våg 28 | SA-2 parenting coordinator + skriftlig default |
| 19.6 | Arkiv-batch PMIR |

---

## Vad andra appar gör (KEEP vs REJECT)

| App | KEEP-lärdom | REJECT |
|-----|-------------|--------|
| Daylio | En handling, låg friktion | Social feed |
| Bearable | Symtom + trigger logg | Medicinsk diagnos i UI |
| Finch | Mikrosteg, mild gamification | **Vi REJECT** streak/pet — bekräftat |
| Notion Life OS | Modulär struktur | Komplexitet utan gating |

**Content separation:** Fakta (RAG) · Reflektion (bank parafras) · Journal (WORM) · Coaching ephemeral (Hamn/Speglar).
