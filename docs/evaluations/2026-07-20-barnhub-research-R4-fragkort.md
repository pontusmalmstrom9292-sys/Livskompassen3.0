# R4 — Frågekorts-taxonomi (Barnhub)

**Datum:** 2026-07-20  
**Typ:** Research only — ingen prod-kod  
**Schema:** [`2026-07-20-barnhub-research-R4-fragkort-schema.json`](./2026-07-20-barnhub-research-R4-fragkort-schema.json)  
**Overlay:** Nya kort ersätter **inte** locked `BARNFOKUS_QUESTIONS` — endast tillägg.

---

## 1. Kort sammanfattning

Åtta kategorier. Fas A prioriterar **Akut stöd** + **Vad hände idag?** (`fasA: true`).  
Ex-kommunikation och juridik pekar till `hamn_link` eller `kunskap_factId` — aldrig blandad Barnen-RAG.  
Barn-audience: endast `silo: barnen`, `crisisTier` ≤ 1.

---

## 2. Seed-kort (~40)

### Akut stöd (fasA)

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-akut-01 | Andas ut långsamt tre gånger — hur känns kroppen nu? | Öppna SOS om panik; annars skriv en mening om vad som hände. | 3 | barnen |
| bh-r4-akut-02 | Behöver barnet dig nära just nu — eller tyst sällskap? | Välj en: sitt bredvid / håll hand / säg «jag är här». | 2 | barnen |
| bh-r4-akut-03 | Vad sa barnet ordagrant — ett citat? | Skriv `[citat] "…"` i incidentfältet. | 2 | barnen |
| bh-r4-akut-04 | Vad är din tolkning — separat från citatet? | Skriv `[tolkning] …` efter citatet. | 2 | barnen |
| bh-r4-akut-05 | Är det akut fara för barnet just nu? | Om ja: 112/socialtjänst. Om nej: fortsätt lugnt. | 3 | barnen |

### Vad hände idag? (fasA)

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-hande-01 | Vad hände idag — en mening, utan att förklara dig? | Spara som incident / livslogg. | 1 | barnen |
| bh-r4-hande-02 | Vilket barn gäller det — Kasper eller Arvid? | Välj alias innan du sparar. | 0 | barnen |
| bh-r4-hande-03 | Var det överlämning, skola, kväll eller annat? | Markera kategori vardag/överlämning/skola. | 0 | barnen |
| bh-r4-hande-04 | Hörde du något som lät som budskap från den andra föräldern? | Logga citat; öppna inte konflikt framför barnet. | 1 | barnen |
| bh-r4-hande-05 | Vad behöver barnet höra av dig ikväll — en kort mening? | Använd lojalitetsfri fras (R3-script). | 1 | barnen |
| bh-r4-hande-06 | Vad gick bra idag — en liten sak? | Spara som positivt ankare. | 0 | barnen |

### Barnets signaler

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-sig-01 | Sömn senaste natten — 1–5? | Logga fysiologi. | 0 | barnen |
| bh-r4-sig-02 | Aptit idag — 1–5? | Logga fysiologi. | 0 | barnen |
| bh-r4-sig-03 | Oro/ångest-nivå du observerar — 1–5? | Logga fysiologi; ingen diagnos. | 1 | barnen |
| bh-r4-sig-04 | Verkade barnet som budbärare idag? | Notera beteende + datum; validera barnet. | 1 | barnen |
| bh-r4-sig-05 | Verkade barnet trösta dig mer än tvärtom? | Notera; ge tillbaka trygg vuxenroll. | 1 | barnen |

### Pappas inre arbete

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-pappa-01 | Vad triggade dig mest i det som hände? | Skriv en rad; öppna Speglar om det svider. | 1 | barnen |
| bh-r4-pappa-02 | Kan du skilja barnets behov från din egen smärta just nu? | Om nej: Speglar först, sedan barn-samtal. | 1 | barnen |
| bh-r4-pappa-03 | Ett steg under fem minuter som lugnar dig? | Gör det innan du svarar barnet. | 1 | barnen |
| bh-r4-pappa-04 | Vad skulle en trygg vän säga till dig nu? | En mening — ingen JADE. | 0 | barnen |
| bh-r4-pappa-05 | Har du sovit tillräckligt för att hålla dig lugn? | Om nej: sänk kravet på dig själv ikväll. | 1 | barnen |

### Kommunikation med ex (hamn_link / kunskap)

| id | question | nextStep | crisisTier | silo | knowledgeFactId |
|----|----------|----------|------------|------|-----------------|
| bh-r4-ex-01 | Behöver du svara på ett sms från ex? | Öppna Hamn BIFF — skriv inte framför barnen. | 1 | hamn_link | |
| bh-r4-ex-02 | Är meddelandet logistik eller bete? | Hamn / Brusfilter. | 1 | hamn_link | |
| bh-r4-ex-03 | Vill du hålla dig till skrift? | Använd written-default (cop-007). | 0 | kunskap_factId | kunskap-fact-cop-007 |
| bh-r4-ex-04 | Känner du dig dragen till att förklara dig (JADE)? | Stopp → Grey Rock i Hamn. | 1 | hamn_link | |
| bh-r4-ex-05 | Ska svaret sparas som bevis? | HITL till Valv efter BIFF. | 0 | hamn_link | |

### Juridik/dokumentering

| id | question | nextStep | crisisTier | silo | knowledgeFactId |
|----|----------|----------|------------|------|-----------------|
| bh-r4-jur-01 | Är detta något att spara som bevis? | HITL Valv — beteende + datum. | 0 | hamn_link | |
| bh-r4-jur-02 | Har du tidpunkt och plats tydligt? | Komplettera observation innan spara. | 0 | barnen | |
| bh-r4-jur-03 | Behöver du fakta om vårdnad/LVU? | Öppna Kunskap FACT (jur). | 0 | kunskap_factId | kunskap-fact-jur-004 |
| bh-r4-jur-04 | Är texten fri från diagnosetiketter? | Ta bort etiketter; behåll beteende. | 0 | barnen | |
| bh-r4-jur-05 | Ska kurator se en avidentifierad export? | Använd export (Fas C) — alias only. | 0 | hamn_link | |

### Självreglering

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-reg-01 | Kan du känna fötterna i golvet just nu? | 30 sek grounding, sedan prata. | 2 | barnen |
| bh-r4-reg-02 | Behöver du kallt vatten eller kort promenad? | Gör det; återkom till barnet. | 2 | barnen |
| bh-r4-reg-03 | Är din röst lugn nog för barnet? | Om nej: en minut tystnad först. | 2 | barnen |
| bh-r4-reg-04 | Ett Window of Tolerance-check: för hög / lagom / för låg? | Anpassa tempo efter barnet. | 1 | barnen |
| bh-r4-reg-05 | Vill du öppna Speglar istället för att «fixa» barnet? | Länk Speglar — Zero Footprint. | 1 | hamn_link |

### Framsteg och hopp

| id | question | nextStep | crisisTier | silo |
|----|----------|----------|------------|------|
| bh-r4-hopp-01 | En sak du gjorde bra som pappa idag? | Skriv den — behåll den. | 0 | barnen |
| bh-r4-hopp-02 | En trygg stund med barnet denna vecka? | Spara som ankare. | 0 | barnen |
| bh-r4-hopp-03 | Märkte du något litet framsteg hos barnet? | Notera utan betyg. | 0 | barnen |
| bh-r4-hopp-04 | Har du hållit dig till skrift/BIFF i kontakten med ex? | Kryssa mental milstolpe (Fas C). | 0 | hamn_link |
| bh-r4-hopp-05 | Vad vill du ge dig själv ikväll utan dåligt samvete? | En liten sak — gör den. | 0 | barnen |

**Antal:** 40 kort. **fasA: true:** akut-01..05 + hande-01..06 (11 st).

---

## 3. Avslut

### Återanvänd
- `BARNFOKUS_QUESTIONS` + `barnfokusCatalog` (locked)
- R3 scripts `BP-CRISIS-*` / `BP-PARENT-*`
- Hamn / Speglar / SOS-länkar
- Kunskap via `knowledgeFactId`

### Fas A (max 5)
1. Wire **11 fasA-kort** (Akut + Vad hände) som overlay/bank — ingen borttagning av locked pool.
2. Primär CTA «Skriv vad som hände» visar 1 kort i taget.
3. Ex-/juridik-kort = länkar, ingen Barnen-RAG.
4. Koppla akutkort till R3 crisis-scripts.
5. Smoke: schema-assert + `smoke:locked-ux` (pool kvar).

### B / C
- B: övriga kategorier + lokal rotation.
- C: milstolpar / export.

### Kostnad
**0 nya betal-API:er.**

**R4-status:** Schema + seed komplett · ingen prod-wire · overlay only.
