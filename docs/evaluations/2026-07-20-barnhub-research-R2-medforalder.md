# R2 — Medförälderns perspektiv (sane parent / HCF co-parenting)

**Datum:** 2026-07-20  
**Typ:** Research only — ingen prod-kod  
**Scope:** Barnhub (barn-fokus) vs befintlig Hamn / Speglar / Valv / Kunskap  
**Domänlins:** `.context/domän-covert-narcissism.md` · `domän-covert-narcissism.mdc`  
**Jämfört mot kod:** `safeHarbor/` · `analyzeMessage` · `tacticPatternLibrary.ts` (`cn-*`) · Speglar (Zero Footprint)

---

## 1. Kort sammanfattning

I högkonflikt-medföräldraskap (HCF) med covert/NPD-liknande dynamik är den «sane parent»-rollen att: (1) skydda barn från lojalitetspress och känslosmitta, (2) svara bara på logistik (Grey Rock / BIFF), (3) dokumentera beteende + datum — aldrig diagnos, (4) reglera egen nervsystem-belastning utanför barnens synfält.

**Livskompassen har redan vuxen-/bevis-lagret.** Hamn ger BIFF/Grey Rock; Speglar ger Zero Footprint-validering; Valv + `cn-*` ger mönster/bevis; Kunskap (`bh-*`, `jur-*`, `cop-*`) ger metod/fakta. **Barnhub ska inte duplicera det.** Barnhub ska länka dit och bara äga det som är **barn-nära**: trygg rutin, observation utan smitta, parallellt föräldraskap i praktiken med barnen.

---

## 2. Research-kärna (kliniskt, Sverige-orienterat)

### 2.1 Co-parenting med NPD/HCP-mönster

Terapeutisk konsensus (HCF / parallel parenting, inte «cooperative parenting» när samarbete utnyttjas):

| Princip | Innebörd för sane parent |
|--------|---------------------------|
| Parallel parenting | Separata hushållsregler; minimal kontakt; skriftlig logistik |
| Struktur före känsla | Fast schema, skriftliga överlämningar, inga ad-hoc-förhandlingar |
| Barn = neutralt fält | Ingen allierad, ingen budbärare, ingen «sanning om mamma» |
| Fasad vs hem | Motpart kan vara charmig utåt — dokumentera *beteende*, inte etikett |
| Skrift före telefon | Hot om samtal/möte utan agenda → håll skrift (se `cop-007` / Hamn `written_only_escalation`) |

Covert-mönster som redan mappas i appen (`tacticPatternLibrary` + Kunskap): DARVO, gaslighting, JADE-bete, hoovering, smear, maternal fasad, ekonomisk kontroll, trauma bonding, juridik-hot, tyst straff.

### 2.2 Grey Rock & BIFF

- **Grey Rock:** kort, tråkigt, faktabaserat; ingen känslomässig mat.
- **BIFF:** Kort · Informativ · Vänlig · Bestämd (parallellt föräldraskap).
- **JADE förbjudet:** Justify, Argue, Defend, Explain — det är betet.

**Redan i Hamn:** `hamnCopy.ts` (10 % logistik / 90 % beten), Brusfilter-hint, `BiffPublicPanel` / `BiffTriagePanel`, `jadeDetector.ts`, `analyzeMessage` med `module: 'safe_harbor'` → Gräns-Arkitekten / BIFF-Skölden. Inget skickas automatiskt. Klar → Zero Footprint.

### 2.3 Dokumentering (bevis, inte terapi)

Klinisk + juridisk praxis (SE):

1. **Vad:** datum, tid, plats, vad som *skedde* / *sades* (citat), vem som såg.
2. **Inte:** «hon är narcissist», PA-etikett, spekulation om diagnos.
3. **Barn:** `[citat]` vs `[tolkning]` (se `barn-observation-epistemik.mdc`).
4. **Kedja:** Inkast/Hamn → manuell spara → Valv WORM (`reality_vault`). Barnlogg auto-promotas **inte**.

### 2.4 Juridiska skyddsstrategier (Sverige — orientering, ej juridisk rådgivning)

| Strategi | Kommentar | Var i LK |
|----------|-----------|----------|
| Skriftlig kommunikation | Bevisvärde; mindre eskalering | Hamn + Valv |
| Saklig vårdnads-/umgängesdokumentation | FB 6 kap. — barnets bästa; fakta före etiketter | Valv dossier / export |
| Orosanmälan / LVU-kontext | Hot om anmälan = `LEGAL_PRESSURE` (`cn-juridik-*`); agera lugnt, dokumentera | Kunskap `jur-*` · Hamn signal |
| Parallellt föräldraskap i avtal | Tydliga byten, skola, vård — utan «samarbetssamtal» som vapen | Fas B/C defer |
| Ombud / Familjerätten | Vid eskalering — inte app-ersättning | Länk i Fas C |
| Diagnos i handlingar | **Skadar ofta** den som skriver det | MUST NOT |

Appen ger **stöd och struktur**, inte advokat. Inga nya juridik-API:er.

### 2.5 Mental hälsa (medförälder)

- Allostatisk belastning, hypervigilans, RSD, ADHD: **ett steg i taget**, kroppsreglering före problemlösning.
- Terapeuter rekommenderar ofta: egen terapi/stöd *utanför* barnens närvaro; begränsa ex-kontakt till logistikfönster; sömn/mat/rörelse som bas.
- I LK: SOS / MåBra Recovery (andning, ankare) · Speglar (validering, Zero Footprint) · *inte* Barnhub som ventil för ex-oro.

### 2.6 Hur man INTE smittar barnen med oro

Terapeutisk kärna (emotional contagion / parentification-prevention):

1. **Reglera dig själv först** — barn läser ton och ansikte före ord.
2. **Ingen vuxeninfo** — process, ekonomi, juridik, «mamma gör fel» hör hemma i Hamn/Speglar/Valv, inte i barnrummet.
3. **Svara på barnets känsla, inte din teori** — «Du får känna dig ledsen. Här är du trygg.»
4. **Ingen lojalitetstest** — fråga inte «vem älskar du mest»; pressa inte till allians.
5. **Rutin = trygghet** — förutsägbarhet minskar barnets behov av att «läsa» konflikten.
6. **Efter svår överlämning:** kort grounding för dig (SOS), sedan närvaro — dokumentera senare, ensam.

**Barnhub-läge:** tips och checklista *för närhet till barn*; länka till Hamn när det handlar om sms till motpart.

### 2.7 Terapeuters återkommande rekommendationer (sammanfattat)

- Parallel parenting framför forced cooperation vid HCF.
- Grey Rock / BIFF på skrift.
- Dokumentera beteende + tid; spara bevis separat från känslodagbok.
- Skydda barn från parentification och triangulering.
- Egen reglering + professionellt stöd; undvik JADE i sms *och* i huvudet inför barn.
- Vid myndighetskontakt: sakligt, kort, barnets bästa — ingen diagnoskampanj.

---

## 3. Explicit jämförelse mot Livskompassen

### 3.1 Vad som REDAN finns

| Yta | Vad den gör | Källor (verifierat) |
|-----|-------------|---------------------|
| **Hamn BIFF** | Klistra sms → triage logistik/beten → Grey Rock-svar; JADE-detektor; taktik-signaler; sparval till Valv | `src/modules/features/family/safeHarbor/` · `biffService.ts` · `hamnTaktikWire.ts` |
| **analyzeMessage / Gräns-Arkitekten** | Callable; `module: 'safe_harbor'` / `valv_orkester`; DCAP före LLM; ingen klient-RAG | `functions/src/callables/agents/analyzeMessage.ts` |
| **tacticPatternLibrary (`cn-*`)** | Deterministiska mönster: DARVO, gaslight, JADE, written escalation, hoover, smear, ekonomi, maternal fasad, trauma bond, juridik, silent treatment | `shared/patterns/tacticPatternLibrary.ts` |
| **Speglar** | Känsla → spegling → VIVIR; session kan rensas; Zero Footprint; forensic kräver Valv-session | `SpeglingsSystem.tsx` · Hjärtat `/hjartat?tab=speglar` |
| **Valv** | WORM-bevis, Mönster, Orkester, dossier, Kunskapsbank (PIN) | `reality_vault` · locked UX |
| **Barnfokus / children_logs** | Barnobservation; epistemik citat/tolkning; ingen auto-promote | Familjen · `barn-observation-epistemik.mdc` |
| **Kunskap** | FACT `cn-*`, `bh-*` (barn_hcf), `jur-*`, `cop-007` skrift-default | kampspar / content bank |
| **Domän** | ~80 % inkast = HCF/bevis-lins; routingstabell; MUST NOT diagnos | `.context/domän-covert-narcissism.md` |
| **SOS / MåBra** | Krisankare, andning — vuxenreglering | `SOSOverlay` · Recovery SOS |

### 3.2 Tabell — Hamn/Speglar/Valv vs länk vs ny Barnhub

| Behov (medförälder) | Redan i Hamn / Speglar / Valv | Barnhub ska bara länka | Ny i Barnhub (barn-fokus) |
|---------------------|-------------------------------|------------------------|---------------------------|
| Svara på ex-sms | Hamn BIFF + analyzeMessage | «Öppna Hamn» / deep-link | — |
| Rensa beten / validera gaslight | Speglar + Brusfilter-bro | «Öppna Speglar» | — |
| Spara bevis (sms, tidslinje) | Valv WORM + Inkast | «Spara i Valv» (HITL) | — |
| Identifiera taktik (DARVO m.m.) | `cn-*` + Mönster + Hamn-signal | Taktik-lexikon via Valv-PIN / Hamn-bro | — |
| Skrift före telefon | Hamn `written_only_escalation` + `cop-007` | Kort tip-länk | — |
| Egen krisreglering | SOS / MåBra | «Öppna SOS» | — |
| Metod/fakta HCF | Kunskap `bh-*` / `cn-*` (PIN) | «Läs i Kunskapsbank» | — |
| Barnobservation (vad barnet sa/visade) | Barnfokus → `children_logs` | Kan återanvända samma sparflöde | **UI-yta** om Barnhub är barnets/förälderns barn-zon |
| Skydda barn från känslosmitta | Delvis i `bh-*` FACT | Länk till fakta-kort | **Kort checklista** «före/efter överlämning» (ingen LLM) |
| Trygg rutin / parallellt föräldraskap *med barnen* | Schema kan finnas i Planering | Länk till Planering om schema | **Barn-nära rutin-kort** (morgon/hämtning/kväll) — max 1 skärm |
| Lojalitetsfrihet / «du behöver inte välja» | `bh-*` + Barnporten-design | FACT-länk | **En mening + övning** åldersanpassad (PLAY, bank) |
| PA / diagnos-etikett | **Förbjudet** i WORM/UI | — | **Förbjudet** även här |
| BIFF-coaching i barnvy | Hamn | Endast länk | **MUST NOT** bygga om BIFF i Barnhub |
| Cross-RAG barn ↔ Valv | Blockerat | — | **MUST NOT** |

---

## 4. Protokoll — pappa i kris (max 5 steg, ADHD-vänligt)

Använd när sms/överlämning/ångest eskalerar. **Ett steg i taget.**

1. **Kropp först (1–3 min)** — Öppna SOS: andning / kallt vatten / fötter i golvet. Svara inte på telefon/sms än.
2. **Parkera barn** — Om barn är närvarande: kort trygg fras («Jag tar en minut, jag är här»). Ingen förklaring om konflikten.
3. **Logistik eller bete?** — Öppna Hamn. Svara bara på datum/tid/plats/hämtning. Ignorera skuld/anklagelser.
4. **Dokumentera ensam** — När barn sover/är upptagna: spara fakta till Valv (beteende + datum). Känsla → Speglar (Zero Footprint), inte framför barn.
5. **Klar** — Tryck Klar / rensa session. Du behöver inte svara mer i dag.

*Om akut fara för liv/hälsa: 112. Självmordstankar: 90101 / 1177.*

---

## 5. MUST NOT — diagnos på motpart i WORM / UI

Gäller **alla** ytor inklusive framtida Barnhub:

| Förbjudet | Tillåtet |
|-----------|----------|
| «Narcissist», NPD, HCP som etikett på person | Teknik-/mönsternamn i **Kunskap** (metod), t.ex. DARVO som begrepp |
| PA-autodiagnos i barnlogg / UI | Observerbart: vad barnet sa/gjorde + tid |
| Diagnos i soc-/tingsrättsutkast genererade av appen | Beteende + datum + citat |
| BIFF-svar som «du är X» | Neutral logistikmening |
| Auto-tagg av motpart-profil med klinisk diagnos | Aktörskarta: beteendemönster (manuell, saklig) |

Kanon: domän MUST NOT · `barn-observation-epistemik.mdc` · Hamn written-default · sharedRules (ingen diagnos i BIFF-ton).

---

## 6. Silo-routing (påminnelse)

| Signal | Modul | Silo |
|--------|-------|------|
| Ex-sms → svar | Hamn | ephemeral → Valv om sparat |
| Gaslighting / egen känsla | Speglar | Zero Footprint |
| Bevis / tidslinje | Valv | `reality_vault` WORM |
| Barn sa/visade | Barnfokus / Barnhub-barnzon | `children_logs` |
| Metod / taktik-fakta | Kunskapsbank (PIN) | `kampspar` (`cn-*`, `bh-*`) |
| Osäkert / LVU | Granska | HITL |

Ingen cross-RAG. Ingen BIFF-coaching i Kunskap-RAG. Ingen auto-promote barn → Valv.

---

## 7. Avslut (obligatoriskt)

### Återanvänd

- Hamn BIFF (`safeHarbor/` + `analyzeMessage` / Gräns-Arkitekten) — **ingen ny BIFF-motor i Barnhub**.
- Speglar Zero Footprint — ventil för vuxenoro.
- Valv WORM + `cn-*` sidecar — bevis och mönster.
- Kunskap `bh-*` / `jur-*` / `cop-007` — FACT-länkar, inte om-skrivning.
- Barnfokus epistemik + SOS — observation respektive krisreglering.
- Domänrouting från `.context/domän-covert-narcissism.md`.

### Fas A (max 5 bullets)

1. Barnhub: **länkkort** till Hamn / Speglar / SOS / Valv (HITL) — ingen ny callable.
2. Deterministisk checklista «före/efter överlämning» (max 5 punkter, copy-only).
3. En barn-nära fras-bank (lojalitetsfrihet) från befintlig `bh-*` / PLAY-bank — ingen LLM.
4. MUST NOT-banner i copy: aldrig diagnos på motpart; citat vs tolkning.
5. Smoke: befintliga `smoke:hamn` · `smoke:children` · `smoke:locked-ux` — ingen ny prod-yta utan PMIR.

### B / C defer

- **B:** Schemavy för parallellt föräldraskap kopplad till Planering; utökad åldersanpassad PLAY; advokat-/Familjerätten-checklistor som FACT-seed.
- **C:** Juridisk dokumentmall-generator; externa juridik-API:er; Barnhub-egen BIFF; cross-silo «barnoro → Valv»-automation; diagnosassisterande UI.

### Kostnad

**0 nya betal-API:er.** Endast återanvändning av befintlig Gemini-callable (`analyzeMessage`) via Hamn-länk; Barnhub Fas A = copy + navigation + bank-innehåll. Scale-to-zero oförändrad.

---

## 8. Källor i repo (lästa / shell)

- `.context/domän-covert-narcissism.md`
- `.cursor/rules/domän-covert-narcissism.mdc`
- `src/modules/features/family/safeHarbor/**` (`hamnCopy.ts`, `biffService.ts`, paneler)
- `functions/src/callables/agents/analyzeMessage.ts`
- `shared/patterns/tacticPatternLibrary.ts`
- Speglar Zero Footprint (`SpeglingsSystem.tsx`)
- `barn-observation-epistemik.mdc` · `hamn-written-default.mdc`

*Research-dokument. Ingen implementering.*
