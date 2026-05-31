# Domänanalys — dold kvinnlig narcissism, barn och bevis

**Datum:** 2026-06-01  
**Scope:** Produktkrav för Supersidor v2 — Familj-, Arkiv- och Capture-hubbar  
**Källor:** G09, G52, `Kampspar-BARN-REFERENS-SEED.json`, Barnen-SPEC Appendix A, SafeHarbor-SPEC, `mabraCoachGuard.ts`

---

## 1. Covert vs grandiose

**Dold/covert** passar bättre än grandiose i detta case:

| Covert mönster | App-konsekvens |
|----------------|----------------|
| Offerroll, perfekt fasad utåt (skola, BVC, soc) | Bevis = **beteenden + datum**, inte etiketter i WORM |
| Små kränkningar, tyst straff, invalidation | Hamn: BIFF 10% logistik; Speglar: validering utan JADE |
| Triangulation via barn/skola | Barnen-silo: **barnets perspektiv**; vuxenkonflikt → Valv/Hamn |
| DARVO, gaslighting, projektion | DCAP + Mönster/Orkester; `mabraCoachGuard` → Speglar |

---

## 2. Taktik → modul-mappning

| Taktik | Modul | Silo |
|--------|-------|------|
| Ex-sms/mejl | Hamn → BIFF; spara som bevis | `reality_vault` |
| Gaslighting / tidslinje | Speglar, Svart på vitt, Valv Mönster | Valv (PIN) |
| Barnobservation (Kasper/Arvid) | Familjen livslogg, Barnfokus | `children_logs` |
| Parentification, lojalitetsfälla | Barnfokus-frågor, seed-referens | Barnen (ej diagnos) |
| Skola/soc/BVC | Inkast/capture → bevis eller review | `reality_vault` / `inbox_queue` |
| Metod/fakta (BBIC, PA) | Kunskapsbank bakom PIN | `kb_docs` / `kampspar` |

---

## 3. Barnets skydd (Familj-shell)

- **Default-flik:** Reflektion / Barnfokus — **inte** Hamn (undvik att appen känns som konflikt)
- **Tab-ordning:** Reflektion → Livslogg → Tillsammans → Barnporten → Hamn → Drogfrihet
- Barnlogg: observerbara fakta, datum, BBIC-kategorier — **ingen** vuxenkonflikt i posten
- Lojalitetsfrihet i copy: barn får älska båda; ingen «sida med pappa»
- Barnporten → Valv: **HITL only** (`SaveAsEvidencePrompt`)

---

## 4. Bevis-hubbens jobb (Arkiv/Valv)

- Tidslinje, WORM, Mönster, Dossier — **sanningens ankare**, inte hämnd eller terapi
- Forensisk neutralitet: «Hon skrev X datum Y» — inte «hon är narcissist»
- Kunskap-RAG **aldrig** publikt — Fyren-gate
- Review-kö vid trauma/LVU/vårdnad (`confidence < 0.75`, `requiresHumanReview`)

---

## 5. Autosortering (capture → routing)

| Signal | Routing | Collection |
|--------|---------|------------|
| `sourceModule: hamn` / ex-sms-mönster | `bevis` | `reality_vault` |
| Kasper/Arvid + observation | `barnen` | `children_logs` |
| BBIC/metod utan kommunikation | `kunskap` | `kb_docs` |
| LVU/vårdnad/trauma | `review` | `inbox_queue` |
| Osäker | `review` | fail-closed |

Heuristik i [`inboxClassifier.ts`](../../functions/src/lib/inboxClassifier.ts) **före** LLM.

---

## 6. Copy & UX

- Lågaffektivt, kliniskt, ingen JADE
- Hamn: Grey Rock / BIFF — affärsmässigt
- Speglar: «Jag tror dig» — validering utan fixande
- **Aldrig** prod-coach: «din ex är narcissist»
- Familj-shell titel: barn/minnen — Hamn som separat flik längre bak

---

## 7. Hub-specifika krav

| Hub | Domänkrav |
|-----|-----------|
| **Familj och gränser** | Hamn + Barnen separata flikar; default barn |
| **Arkiv / Valv** | Forensisk ton; alla låsta flikar kvar |
| **Barnporten** | Barnets röst; HITL till Valv |
| **Capture** | `sourceModule` metadata + heuristik |
| **Review-kö** | Människa granskar före WORM vid osäkerhet |

---

## 8. MUST NOT

- Cross-RAG mellan `children_logs` och `reality_vault` / `kampspar`
- Etiketter («narcissist») i WORM-poster
- Barn som vittnen eller budbärare i UI-flöden
- PA-autodiagnos i Barnen-MVP
- Auto-promote barnlogg → Valv
- LLM beslutar auth eller WORM-routing utan DCAP/heuristik

---

**Not:** Domänanalysen är produktkrav och stöd — **inte** terapi eller juridisk rådgivning.
