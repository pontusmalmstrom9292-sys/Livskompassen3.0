# Research — SA-5 Meta (Cursor baseline)

**Datum:** 2026-06-16 · **Agent:** SA-5 (Cursor)  
**Källor:** [`MODUL-FUNKTIONS-REGISTER.md`](../../MODUL-FUNKTIONS-REGISTER.md) · [`gap-matrix-2026-06-16.md`](../bifoga/05-research-handoff/gap-matrix-2026-06-16.md) · [`2026-06-15-fas19-masterplan-v2.md`](../../evaluations/2026-06-15-fas19-masterplan-v2.md) · [`2026-06-16-research-slutfas.md`](../../evaluations/2026-06-16-research-slutfas.md) · SA-1..4 imports · [`research-2026-06-16-master-syntes.md`](./research-2026-06-16-master-syntes.md)

---

## Executive summary

Deep Research slutfas bekräftar att Livskompassen redan har rätt arkitektur (tre silos, Obsidian Calm, locked UX, anti-XP). Luckorna sitter i **innehåll** (worry time, ADHD-ekonomi, HCF skriftlig, barn lojalitet), **kapacitets-gating** (evolution_hub Nivå 1–3) och **Hamn wire** — inte i ny stack eller nav-merge. Våg 27 är CANDIDATE (17 poster); teknikspår 19.3–19.6 går före ingest. Daylio/Bearable/Finch validerar KEEP-mönster (en handling, låg friktion, logg utan social) och REJECT-mönster (streak/pet, medicinsk diagnos-UI, social feed).

---

## 1. Modul-matris (KEEP / STÄRK / DEFER / LUCKA)

### 1.1 Infrastruktur & minne

| Område | Komponent | Route / pipeline | Beslut | Motivering |
|--------|-----------|------------------|--------|------------|
| Tre silos (U1) | Kunskap / Valv / Barnen | `kampspar`, `reality_vault`, `children_logs` | **KEEP** | gap-matrix + grunder-kanon — ingen cross-RAG |
| SynapseBus | `driveIngestSynapse`, `journalWovenSynapse`, `dcapAlertSynapse`, `paralysBrytarenSynapse` | live | **KEEP** | G10/G7 done; händelsestyrt minne |
| Backend callables | `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery`, `analyzeMessage`, … | — | **KEEP** | G1–G16 done per Arkiv-GAP |

### 1.2 Frontend-moduler (MODUL-FUNKTIONS-REGISTER)

| Modul (mapp) | Route(s) | Beslut | Motivering |
|--------------|----------|--------|------------|
| **core** | `/`, Fyren, drawer, `/widget/*` | **KEEP** | 4-zons dock + navTruth kanon; anti-overwhelm (Daylio-linje) |
| **wellbeing/compasses** | `/vardagen?tab=kompasser` | **KEEP** | Morgonkompass Sacred; kompasser locked |
| **evidence/kompis** | Valv `kunskapsbank` | **STÄRK** | våg 27 FACT fyller GAD/ADHD/eko-luckor; 117→128 FACT vid ingest |
| **wellbeing/economy** | `vardagenTab=ekonomi` | **STÄRK** | `capacity-ui-gate` Nivå 1–3; eko-001–004 CANDIDATE; veckocheck-in default |
| **diary/diary** | `/hjartat` | **KEEP** | Hjärtat-hub; journal WORM-adjacent |
| **evidence/vault** | `/valvet` | **KEEP** | B1 LOCK — Mönster/Orkester/Aktörskarta; endast visuell förfining |
| **evidence/vaultChat** | Valv Sök | **KEEP** | Egen silo; G1 deployad |
| **diary/mirror** | `/hjartat?tab=speglar` | **KEEP** | Zero Footprint; ex/gaslighting-routing |
| **family/safeHarbor** | `/familjen?tab=hamn` | **STÄRK** | våg 28: `written_only_escalation` wire; skrift-före-telefon copy |
| **family/children** | `/familjen` | **KEEP** | Barnfokus locked §12; livslogg WORM |
| **barnporten** | `/barnporten` (PWA) | **LUCKA** | HITL delvis; teen PLAY (BP-PLAY-27) + `currentBracket` wire saknas |
| **wellbeing/mabra** | `/vardagen?tab=mabra` | **STÄRK** | Fas 19.2 hybrid-8 klar; våg 27 REFLECTION/PLAY; JOY-17 → 19.4 |
| **admin/planning** | `/planering` | **KEEP** | P3 Kanban locked §14; kapacitet döljer vid Nivå 1 |
| **admin/projects** | `/projekt` | **DEFER** | Hybrid spec klar; polish efter 19.3 tokens + wave-2 |
| **evidence/vault/dossier** | `/valvet` dossier | **KEEP** | WORM beteende+datum; taktikfilter v23 |
| **widgets** | `/widget/*` | **KEEP** | WH1/WH2 locked; WH1→Valv |
| **admin/stampla** | `/arbetsliv?tab=stampla` | **KEEP** | Arbetsliv smoke PASS |
| **arbetsliv** | `/arbetsliv` | **KEEP** | Tid, logg, lönespec vardag |
| **drogfrihet** | `/drogfrihet` | **KEEP** | df-001–006 bank done; låg prioritet polish |
| **inkast** | `#inkast-lite` | **KEEP** | G10 locked 2026-06-06; upload unified = våg 30 teknik |

### 1.3 Sammanfattning per beslut

| Beslut | Antal | Moduler |
|--------|-------|---------|
| **KEEP** | 15 | core, kompasser, hjärtat, valv, vaultChat, speglar, barn/familj, planering, dossier, widgets, stämpel, arbetsliv, drogfrihet, inkast + infra |
| **STÄRK** | 4 | kunskapsbank, ekonomi, hamn, mabra |
| **DEFER** | 1 | projekt (polish) |
| **LUCKA** | 1 | barnporten (PWA-route + teen bracket) |

---

## 2. Stop doing list (10)

Bekräftat av gap-matrix, governance och SA-1..5. **Bygg inte:**

1. **Streak / XP / leaderboard / pet-belöning** — Finch-linje avvisad; ADHD-säker governance  
2. **Teal primär chrome** (`#2E6466`, fylld teal aktiv flik) — Obsidian Calm + guld kanon  
3. **Cross-RAG / "sök överallt"** — U1; tre silos separata callables  
4. **Auto-promote barnlogg → Valv** — HITL only; locked UX § Barnporten  
5. **Diagnos-etiketter på motpart** i WORM, dossier eller UI — beteende+datum only  
6. **Flutter / React Native omskrivning** — Capacitor investerat; stack KEEP  
7. **Hem → Hjärtat merge utan PMIR** — superhub-beslut; gap-matrix DEFER  
8. **Wow-animationer / gamification-ton** — hypervigilans + kognitiv trötthet  
9. **30+ budgetkategorier som default** — Nivå 1 = veckosaldo + 4–5 kuvert max  
10. **LLM skapar FACT utan bank-post** — research → CANDIDATE → manuell KEEP → ingest  

---

## 3. Åtta cursor rule-förslag (med motivation)

| # | Regel | Status | Motivation |
|---|-------|--------|------------|
| 1 | **`research-content-gate.mdc`** | ✅ Implementerad | Extern research (Gemini/Cursor/WebSearch) får inte bli prod-FACT direkt. CANDIDATE + `source_tier` + URL stoppar hallucinerad ingest och håller U6 (FACT vs REFLECTION). |
| 2 | **`capacity-ui-gate.mdc`** | ✅ Implementerad | SA-3 + infinite-evolution: Nivå 1 döljer `economy_advanced` och `planning_kanban`. Förhindrar paralys vid hög stress — Bearable-lik logg, inte Notion-komplexitet. |
| 3 | **`hamn-written-default.mdc`** | Eval → våg 28 | ~80% HCF-upload; telefon eskalerar konflikt. Deterministisk copy: föreslå skrift (BIFF) före samtal. Kopplar till `written_only_escalation` wire (SA-2). |
| 4 | **`barn-observation-epistemik.mdc`** | Eval → våg 29 | `children_logs` WORM: skilj citat/observation från tolkning. Skyddar dossier/myndighet och bh-015/016 FACT. |
| 5 | **`worry-time-mabra-only.mdc`** | Eval → våg 27/28 | Worry time FACT (`gad-036`) i Kunskap; övning MB-REF-GAD-07 / MB-PLAY-GAD-02 i MåBra — aldrig cross-RAG (SA-1 lucka). |
| 6 | **`no-diagnosis-labels.mdc`** | Eval → våg 28 | Förstärker `domän-covert-narcissism.mdc`: inga "narcissist"/diagnos-etiketter i WORM/UI. Bearable REJECT-linje (medicinsk diagnos i UI). |
| 7 | **`slutfas-stop-list.mdc`** | Eval → våg 30 | Kodifierar §2 ovan som agent-gate: streak, 5-tab, Hem-merge, Flutter, cross-RAG — stoppar scope creep i slutfas. |
| 8 | **`weekly-money-checkin.mdc`** | Eval → våg 28 | Ekonomi default = veckovis synligt saldo (eko-004), inte månadsdjupbudget vid Nivå 1. Kopplar UI till evolution_hub. |

---

## 4. Prioriterad ordning — våg 27–30 + Fas 19.3–19.6

Ingen konflikt med locked UX. **Teknik före content-ingest** (research-slutfas §4).

### 4.1 Integrerad tidslinje

| Ordning | Spår | Innehåll | Gate / smoke |
|---------|------|----------|--------------|
| **1** | Teknik **19.3** | Hex→tokens P0, zon-shells, typecheck expansion | `smoke:design-modules`, `typecheck:core-strict` |
| **2** | Teknik **19.4** | JOY-17 prod-wire + `mabraCoach` bank-synk | `smoke:mabra`, `smoke:innehall` |
| **3** | Content **våg 27** | KEEP + ingest: 11 FACT + 3 MåBra + 3 Barnen PLAY | Pontus "godkänn våg 27 KEEP" → `seed:kunskap-facts`, `smoke:kunskap` |
| **4** | Teknik **19.5** | `evolution_ledger` dual-write | `smoke:evolution-discovery` |
| **5** | Content **våg 28** | Hamn wire (`written_only_escalation`, `parenting_coordinator_ref`); regler 3, 5, 6, 8 | `smoke:design-modules` |
| **6** | Content **våg 29** | Barnporten teen bracket + BP-PLAY-25..27 wire; `barn-observation-epistemik.mdc` | `smoke:locked-ux`, `smoke:children` |
| **7** | Teknik **19.6** | Arkiv-batch PMIR (hygiene våg D) | `orkester:night` |
| **8** | Content **våg 30** | UI wave-2 polish (gap-matrix BUILD #5); upload unified steg 2; regler 7 + `slutfas-stop-list` | `smoke:locked-ux`, `smoke:inkast` |

### 4.2 Content våg 27–30 (detalj)

| Våg | Tema | Poster / leverans | Källa |
|-----|------|-------------------|-------|
| **27** | Deep Research slutfas | gad-036, adhd-029, eko-001–004, cop-006–007, jur-009, bh-015–016; MB-REF-GAD-07, MB-REF-ADHD-05, MB-PLAY-GAD-02; BP-PLAY-25..27 | SA-1..4 · **CANDIDATE** |
| **28** | HCF kommunikation + regler | Hamn deterministiska signaler; `hamn-written-default`, `no-diagnosis-labels`, `weekly-money-checkin`, `worry-time-mabra-only` | SA-2 · dirigent routing |
| **29** | Barn + evolution | Barnporten PWA-route; `currentBracket` pre_teen/teen; barn-epistemik; PLAY wire | SA-4 · MODUL-GAP öppet |
| **30** | Slutfas polish | Wave-2 UI (expanders, guld states, touch-yta); upload unified; `slutfas-stop-list`; Life OS-loop copy **DEFER** om ej READY | gap-matrix BUILD #5 |

**DEFER efter våg 30:** M3.0-C Fitness/Näring · AI-assistent UI · Fyren global kapacitetsmotor (Våg C) · Hem→Hjärtat merge · Kanban flip cards · design-arkiv ~400 filer.

---

## 5. Daylio / Bearable / Finch — KEEP vs REJECT

| App | KEEP (lärdom för Livskompassen) | REJECT (vi bygger inte) |
|-----|----------------------------------|-------------------------|
| **Daylio** | En handling per session; emoji/humör på &lt;30 s; privat logg utan social; påminnelser valfria | Social feed, jämförelse med andra, publik profil |
| **Bearable** | Symtom + trigger-logg; korrelation över tid; export; medicinsk **neutral** copy (inte diagnos på tredje part) | Medicinsk diagnos-UI på motpart; klinisk etikettering i bevis; 50+ spåringsdimensioner default |
| **Finch** | Mikrosteg (Paralys-Brytaren-linje); mild struktur; låg visuell arousal i vissa flows | **Pet/streak/XP** — bekräftat REJECT; daglig skuld om "missad" session; gamification som primär motor |

### 5.1 Content-separation (seriösa appar vs Livskompassen)

| Lager | Livskompassen | Daylio/Bearable-liknande |
|-------|---------------|---------------------------|
| Fakta (RAG) | Kunskap `kampspar` — seed bank | Hjälpartiklar, inte LLM-fritt |
| Reflektion / övning | MåBra bank parafras | Guided CBT-liknande prompts |
| Journal / bevis | Valv WORM, Barnen logs | Privat logg — **vi adderar** juridisk WORM + silo |
| Coaching ephemeral | Hamn BIFF, Speglar | Chat-stöd — **vi: Zero Footprint** |

**Slutsats:** KEEP = en sak i taget, privat, låg friktion, logg+export. REJECT = streak, social, diagnos-etiketter, cross-silo "smart search", komplexitet utan kapacitets-gating.

---

## 6. Definition of done — privat single-user Life OS (slutfas)

- [ ] Fas 19.3–19.6 smoke PASS  
- [ ] Våg 27 KEEP + ingest (128 FACT manifest)  
- [ ] 6 eval-regler → `.mdc` eller medveten DEFER med PMIR  
- [ ] Barnporten teen route + bracket wire  
- [ ] Hamn `written_only_escalation` live  
- [ ] `npm run smoke:orkester` + `smoke:innehall` grön  
- [ ] Ingen regression: locked UX, tre silos, Obsidian tokens  

---

## 7. Nästa steg (Pontus — ett steg)

Granska CANDIDATE i [`Kunskap-CONTENT-SEED.md`](../../specs/modules/Kunskap-CONTENT-SEED.md) § våg 27. Svara **"godkänn våg 27 KEEP"** för ingest, eller markera enskilda rader REJECT.

---

*Jämfört mot: [`research-2026-06-16-sa5-regler.md`](./research-2026-06-16-sa5-regler.md) (baseline utökad med vaultChat, våg 28–30, Fas 19-integration).*
