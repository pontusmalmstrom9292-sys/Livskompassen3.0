# R3 — Psykoeducation-bibliotek för Barnhub

**Datum:** 2026-07-20  
**Typ:** Research only (ingen prod-kod, ingen ingest, ingen Valv-promote)  
**Kurator-plan:** `specialist-barn-lek` → bank KEEP · **ej** `specialist-kunskap-seed` utan separat seed-våg  
**Källbas (kod):** `src/modules/features/family/children/content/barnfokusCatalog.ts` (BP-PLAY-01..29)  
**Källbas (bank):** `docs/specs/modules/Barnen-PLAY-BANK.md` (KEEP PLAY; våg 27 BP-PLAY-25..29)  
**Silo:** Barnen (PLAY/REFLECTION) · **MUST NOT:** cross-RAG · auto-promote till `reality_vault`

---

## 1. Syfte

Bygga ett **förälder-nära psykoed-bibliotek** i Barnhub: korta scripts som hjälper dig (1) reglera dig själv, (2) co-reglera barnet, (3) prata om svåra saker **utan att prata illa om den andra föräldern**.

Detta är **inte** Kunskap-FACT. Rader här är `PLAY` eller `REFLECTION` — bank-utkast tills dirigent + Pontus KEEP. FACT (bh-*) finns redan i Kunskap och länkas bara som **pekare**, aldrig som cross-RAG-innehåll i Barnen.

---

## 2. Teknikram (kort, klinisk)

| Teknik | Kärna (förälder) | Barnspråk / UI-hint | Bracket-vikt |
|--------|------------------|---------------------|--------------|
| **Wise Parent / gott-enough** | Bra nog > perfekt. Ett lugnt ögonblick räcker. | «Jag behöver inte göra allt rätt — bara vara trygg just nu.» | alla |
| **Window of Tolerance** | För smal = frys/explodera; bredda med andning, paus, rutin. | «Kroppen är för full — vi gör ett litet steg.» | early_school+ |
| **Polyvagal (barnspråk)** | Trygg / mobiliserad / avstängd — inte «bråkig». | «Kroppen säger stopp / spring / lugn.» | toddler → teen (olika ord) |
| **Co-regulation** | Din nervsystem-stil smittar. Först du, sen barnet. | «Jag andas — du kan andas med.» | toddler_preschool starkast |
| **Validation** | Känsla OK; beteende kan ha gräns. | «Det är okej att det känns så. Vi gör X.» | alla |
| **Lojalitetsfrihet** | Älska båda. Vuxenkonflikt = vuxenansvar. | «Du behöver inte välja.» | pre_teen / teen |
| **Svåra samtal utan badmouth** | Fakta + känsla + trygghet. Ingen karaktärsdom på andra föräldern. | «Vuxna bestämmer logistik. Du är inte skyldig.» | alla |

**Overlap mot befintligt (duplicera inte):**

| Befintligt | Roll | R3-åtgärd |
|------------|------|-----------|
| BP-PLAY-22..24 | Parent prompts: parentification, citat, lojalitet | **Återanvänd** som vardags-entry; R3 ger *scripts* (vad säga) |
| BP-PLAY-25..29 | Bracket-frågor (känsla, trygg, budbärare, teen-rad) | **Koppla** BP-CRISIS/PARENT → samma bracket + lens |
| kunskap-fact-bh-001..020 | FACT i Kunskap (lojalitet, budbärare, m.m.) | Pekare `knowledgeFactId?` i senare wire — **ingen** RAG i Barnen |

---

## 3. Åldersbrackets (3–12 + teen-paritet)

| Bracket | Ålder (kanon) | Script-stil | Max längd |
|---------|---------------|-------------|-----------|
| `toddler_preschool` | 3–5 | Korta meningar, kropp, peka, «vi» | 1–2 meningar till barn; 2–3 till förälder |
| `early_school` | 6–9 | En känsla + en trygg handling | max 3 meningar |
| `pre_teen` | 10–13 | Lojalitetsfrihet, budbärar-nej, «vuxenfråga» | max 3 meningar |
| `teen` | 14+ | Respekt, valfrihet att prata, ingen press | max 3 meningar |

**Obs:** Uppdraget nämner 3–12; `teen` ingår ändå för paritet med BP-PLAY-27 och evolution_hub.

---

## 4. Bank-schema (utkast)

```ts
type BarnhubPsykoedRow = {
  id: string;                 // BP-PARENT-* | BP-CRISIS-*
  content_class: 'PLAY' | 'REFLECTION';  // ej FACT utan seed-våg
  audience: 'parent' | 'child';
  bracket?: 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';
  lens: 'kanslor' | 'valv_safe' | 'lojalitet' | 'reflektion' | 'utveckling' | 'gladje';
  text_sv: string;            // kris: max 3 meningar
  hint_sv?: string;           // förälder-meta, ej till barn
  pairs_with?: string[];      // BP-PLAY-* länkar
  knowledgeFactId?: string;   // deterministisk pekare — ej RAG
  status: 'CANDIDATE';
};
```

**MUST NOT:** Valv-promote · cross-RAG · diagnos på motpart · streak/XP · LLM-genererad FACT.

---

## 5. Bank-utkast — rader (≥12 scripts)

### 5.1 Kris (`BP-CRISIS-*`) — max 3 meningar

| id | content_class | audience | bracket | lens | text_sv | pairs_with | hint_sv |
|----|---------------|----------|---------|------|---------|------------|---------|
| BP-CRISIS-01 | PLAY | parent | toddler_preschool | kanslor | Jag ser att det är mycket just nu. Vi sätter oss en stund och andas tillsammans. Du är trygg här. | BP-PLAY-25 | Co-reg: först din andning, sen barnets. |
| BP-CRISIS-02 | PLAY | child | toddler_preschool | kanslor | Din kropp är som en stor känsla just nu. Vi kan hålla handen och andas tre gånger. | BP-PLAY-25 | Polyvagal barnspråk: «stor känsla» ≠ bråkig. |
| BP-CRISIS-03 | REFLECTION | parent | early_school | kanslor | Fönstret är smalt — paus före svar. Jag säger: «Jag hör dig. Vi tar en minut, sen löser vi ett litet steg.» | BP-PLAY-26 | Window of Tolerance — bredda före problemlösning. |
| BP-CRISIS-04 | PLAY | child | early_school | valv_safe | Det är okej att det känns läskigt eller argt. Vi hittar en trygg sak — ett ord eller en ritning. | BP-PLAY-26 | Validation + trygg ankare. |
| BP-CRISIS-05 | REFLECTION | parent | pre_teen | lojalitet | Du behöver inte välja sida och du behöver inte bära budskap. Vuxna pratar med vuxna. Jag älskar dig oavsett. | BP-PLAY-28, BP-PLAY-24 | Lojalitetsfrihet; ingen badmouth. |
| BP-CRISIS-06 | PLAY | child | pre_teen | lojalitet | Om någon ber dig säga något till din andra förälder: «Det är en vuxenfråga.» Du får älska båda. | BP-PLAY-28 | Samma linje som BP-PLAY-28 — kris-variant. |
| BP-CRISIS-07 | REFLECTION | parent | teen | reflektion | Jag vill inte pressa dig att prata. När du vill: en mening räcker. Konflikten är vuxnas — inte ditt fel. | BP-PLAY-27 | Gott-enough: närvaro utan förhör. |
| BP-CRISIS-08 | PLAY | child | teen | reflektion | Du får skriva en rad till dig själv eller till en förälder — du behöver inte skicka den. Du får känna två saker samtidigt. | BP-PLAY-27 | Dubbla känslor = normalt vid två hem. |

### 5.2 Vardag (`BP-PARENT-*`) — gott-enough + validation

| id | content_class | audience | bracket | lens | text_sv | pairs_with | hint_sv |
|----|---------------|----------|---------|------|---------|------------|---------|
| BP-PARENT-01 | REFLECTION | parent | *(alla)* | utveckling | Gott nog idag: ett lugnt ögonblick räcker. Perfekt förälder finns inte — trygg närvaro gör det. | BP-PLAY-01, BP-PLAY-05 | Wise Parent / gott-enough. |
| BP-PARENT-02 | PLAY | parent | toddler_preschool | kanslor | Spegla kroppen först: «Jag ser att du stampade / grät.» Sen gräns: «Vi gör det lugnt tillsammans.» | BP-PLAY-25 | Validation före gräns. |
| BP-PARENT-03 | PLAY | parent | early_school | gladje | En sak som gick bra idag — säg den högt utan betyg. «Jag såg att du…» | BP-PLAY-04, BP-PLAY-15 | Stärk utan prestation. |
| BP-PARENT-04 | REFLECTION | parent | early_school | kanslor | Efter överlämning: tyst stund, vatten, snack — innan frågor. Kroppen behöver landa. | BP-PLAY-05, BP-PLAY-26 | Decompression / polyvagal «landa». |
| BP-PARENT-05 | REFLECTION | parent | pre_teen | lojalitet | Fråga aldrig «vem har rätt». Fråga: «Hur var det för dig?» Lyssna utan att tolka in den andra föräldern. | BP-PLAY-23, BP-PLAY-24 | Epistemik: citat vs tolkning. |
| BP-PARENT-06 | PLAY | child | early_school | valv_safe | Rita eller säg en person utanför hemmet du kan prata med om det känns tungt. | BP-PLAY-29 | Trygg vuxen-nät (Bris/kurator). |

### 5.3 Lojalitetsfrihet + svåra samtal utan badmouth

| id | content_class | audience | bracket | lens | text_sv | pairs_with | hint_sv |
|----|---------------|----------|---------|------|---------|------------|---------|
| BP-PARENT-07 | REFLECTION | parent | *(alla)* | lojalitet | Script: «Mamma/pappa och jag är oense om vuxensaker. Det är inte ditt fel. Du får älska oss båda.» Ingen detalj om fel. | BP-PLAY-24 | Anti-badmouth; BRIS-linje. |
| BP-PARENT-08 | PLAY | parent | pre_teen | lojalitet | Om barnet frågar om den andra: «Hen är din förälder. Om du saknar hen — det är okej. Vill du skicka en hälsning via mig som vuxen?» | BP-PLAY-28 | Ingen skuld; vuxenkanal. |
| BP-PARENT-09 | REFLECTION | parent | teen | reflektion | Svår nyhet (schema/flytt): fakta → känsla → trygghet. «Det här ändras. Du får vara ledsen/arg. Vi fixar det praktiska.» | BP-PLAY-27 | Ingen karaktärsdom på andra föräldern. |
| BP-PARENT-10 | PLAY | child | toddler_preschool | kanslor | «Ibland är vuxna ledsna eller trötta. Det är deras sak. Du är trygg hos mig.» | BP-PLAY-25 | Skydda från vuxenbörda (anti-parentification). |
| BP-PARENT-11 | REFLECTION | parent | *(alla)* | utveckling | Co-reg-check: Är *jag* utanför fönstret? I så fall: paus, vatten, omstart — innan jag pratar med barnet. | BP-PLAY-22 | Parentification-guard: barn ska inte lugna dig. |
| BP-PARENT-12 | PLAY | child | pre_teen | lojalitet | Du får ha det bra hos båda — utan att det betyder att du sviker någon. | BP-PLAY-24, BP-PLAY-28 | Lojalitetsbind-motgift. |

**Antal scripts i tabellerna:** 8 kris + 6 vardag + 6 lojalitet/svåra = **20** (≥12).  
**ID-serie:** BP-CRISIS-01..08 · BP-PARENT-01..12.

---

## 6. Koppling BP-PLAY-* (wire-karta)

| R3-id | Primär BP-PLAY | Syfte med koppling |
|-------|----------------|--------------------|
| BP-CRISIS-01/02 | BP-PLAY-25 | Känsloikoner → kris-co-reg |
| BP-CRISIS-03/04 | BP-PLAY-26 | Trygg-ord → Window + validation |
| BP-CRISIS-05/06 | BP-PLAY-28 (+24) | Budbärare-nej i kris |
| BP-CRISIS-07/08 | BP-PLAY-27 | Teen-rad utan press |
| BP-PARENT-01 | BP-PLAY-01, 05 | Gott-enough efter gladje/trygg |
| BP-PARENT-03 | BP-PLAY-04, 15 | Utveckling utan betyg |
| BP-PARENT-05 | BP-PLAY-23, 24 | Citat + lojalitet |
| BP-PARENT-06 | BP-PLAY-29 | Trygg vuxen utanför |
| BP-PARENT-07..12 | BP-PLAY-22/24/28 | Parentification + lojalitetsfrihet |

**UI-idé (Fas B+ — ej nu):** Visa R3-script som *footer* under matchande Barnfokus-fråga (`pairs_with`), audience-filterad. Ingen ny route. Locked UX (`BARNFOKUS_QUESTIONS`) orörd — overlay via catalog.

---

## 7. Silo- och säkerhetsgränser

| Regel | Status |
|-------|--------|
| Ingen Valv-promote av child-svar | MUST |
| Ingen cross-RAG (Barnen ↔ Kunskap/Hamn) | MUST |
| `knowledgeFactId` endast deterministisk pekare | OK senare |
| `content_class` PLAY/REFLECTION — **ej FACT** i denna fil | MUST |
| Observation i `children_logs`: `[citat]` / `[tolkning]` | Oförändrad kanon |
| Diagnos/etikett på motpart i scripts | FÖRBJUDET |
| Streak/XP | FÖRBJUDET |

---

## 8. Avslut — återanvänd / Fas A–C / kostnad

### Återanvänd (kostnad 0)

1. `barnfokusCatalog.ts` + BP-PLAY-01..29  
2. `Barnen-PLAY-BANK.md` KEEP-mönster  
3. Parent prompts BP-PLAY-22..24 (lojalitet/parentification)  
4. Bracket-filter `barnfokusCatalogForBracket` / `evolution_hub.currentBracket`  
5. Kunskap bh-* som **pekare** (ej ingest i Barnen)

### Fas A — max 5 CANDIDATE till bank (rekommenderad KEEP-ordning)

| Prio | id | Varför först |
|------|-----|--------------|
| 1 | BP-CRISIS-05 | Lojalitetskris — högst HCF-nytta |
| 2 | BP-CRISIS-06 | Child-mirror av budbärar-nej (paritet BP-PLAY-28) |
| 3 | BP-PARENT-07 | Anti-badmouth script (vardag) |
| 4 | BP-CRISIS-01 | Toddler co-reg (mest använd) |
| 5 | BP-PARENT-01 | Gott-enough — sänker RSD/skam hos förälder |

Övriga 15 = backlog Fas B.

### Fas B–C (senare, PMIR)

| Fas | Vad | Kräver |
|-----|-----|--------|
| **B** | Lägg KEEP-rader i `Barnen-PLAY-BANK.md` + ev. `barnfokusCatalog` parent/crisis overlay | PMIR + `specialist-barn-lek` |
| **B** | UI: visa script under Barnfokus / ParentReminderFooter | Locked UX-smoke |
| **C** | Valfri `knowledgeFactId` → bh-001/015/016 (deterministisk) | Dirigent; **ingen** RAG |
| **C** | Teen/pre_teen A/B copy-test på G85 | Pontus OK |

### Kostnad

| Post | Belopp |
|------|--------|
| Denna research-fil | **0** |
| Fas A bank-text (markdown only) | **0** |
| Vertex/LLM/ingest | **0** (ingen seed, ingen callable) |
| Ny dependency / infra | **0** |

---

## 9. Nästa steg (ett)

**Rekommendation:** Godkänn Fas A (5 CANDIDATE → KEEP i `Barnen-PLAY-BANK.md` som bank-only) — ingen prod-wire förrän PMIR.

👉 **Nästa steg för Pontus:** Säg «KEEP Fas A R3» (eller REJECT enskilda id) — därefter kurator `specialist-barn-lek` skriver KEEP-rader i banken.
