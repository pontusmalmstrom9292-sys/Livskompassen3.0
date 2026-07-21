# Delrapport: Benchmark drogfria-/nykterhetsappar

**Datum:** 2026-07-21  
**Roll:** Research/Benchmark-expert (Cursor · Composer)  
**Scope:** Global kartläggning + feature-gaps vs Livskompassen Drogfrihet  
**Kod:** Ingen. Endast analys.

### Legend för trovärdighet
| Märkning | Betydelse |
|----------|-----------|
| **VF** | Verifierad fakta (officiell produktinfo, FDA-dokument, peer-reviewed studie, eller kod i detta repo) |
| **PR** | Produktantagande / branschmönster (App Store-jämförelser, sekundära bloggar, marknadspositionering — ej primärkälla) |
| **OS** | Osäkerhet — behöver manuell App Store-/produktverifiering |

---

## 0. Nuläge Livskompassen (kontext för gap-analys)

**VF (kod):** Drogfrihet-hubben (`MOD-FAM-DROG`) har redan:
- Dagräknare/badge
- Reflektionskort (HALT, trigger, mikrosteg, återfall utan skam)
- Kunskapsfakta + 12-stegsjournal
- Stödresurser (113, 1177, Mind, AA-info)
- `RecoveryUrgeSosModule` (urge/SOS)
- Reality-check-formulär
- Katalogtext: *inga streaks* (medvetet)

**Produktantagande:** Livskompassens unika yta är Life OS + HCF/trauma + svensk vårdväg + privat WORM — inte "ännu en streak-app".

---

## 1. Benchmark-tabell

| App | Fokus | Styrkor | Svagheter | Relevant för oss? |
|-----|--------|---------|-----------|-------------------|
| **I Am Sober** | Alkohol + flera beroenden (community per typ) **PR/VF** | Dagligt löfte + kvällsreflektion; stor community; milstolpar; sparade pengar; hög App Store-lojalitet **PR** | Community = social risk/skam; paywall på backup **PR**; svag akut cravings-protokoll; engelsk/US-kultur; inte trauma-/HCF-säker **PR** | **Ja** — ritual + community-mönster att *inte* kopiera rakt av |
| **Reframe** | Främst alkohol (minska/sluta) **PR** | CBT/neuroscience-lektioner; strukturerat program; drink-tracking; meditation **PR** | Dyr abonnemang (~$13/mån) **PR**; kurs-tung; alkohol-centrerad; begränsad icke-alkohol **PR** | **Ja** — lektionsformat; vi bör göra *kortare*, svensk, skamfri |
| **Quit That!** | Vanor generellt (nikotin, socker, osv.) **VF/PR** | Enkel multi-quit-räknare; gratis; sparade pengar **VF** (produktsida) | Ingen terapi/community/akut SOS **PR**; ren tracker | **Låg** — baseline för "räknare räcker inte" |
| **Nomo** | Multi-clock (alkohol, droger, beteenden) **PR** | Visuell klocka; accountability partner; digitala chips; enkla "refocus"-övningar **PR** | Åldrad UI **PR**; social vägg; begränsad vetenskaplig tyngd | **Ja** — accountability *privat* (1–2 personer) kan vinna |
| **Sober Time** | Främst alkohol/nikotin-tracker **PR** | Enkel, ofta gratis kärna; milstolpar **PR** | Ads; lite djup; svag craving-hjälp **PR** | **Låg** — marknadsstandard för counter |
| **Loosid** | Alkohol/sober social/dating **PR** | Social isolation → dating/events; SAM-check-ins **PR** | Dating = hög risk för trauma/HCF-användare; lätt tracking **PR** | **Nej som modell** — social/dating är anti-pattern för oss |
| **WEconnect** | Recovery peer support (US) **PR** | Peer specialists; möten; daglig struktur **PR** | US-vård/peer-modell; ej svensk vårdkedja **OS** | **Medel** — peer-idé, men lokalt (svenska linjer) |
| **Pear reSET / reSET-O** | SUD / OUD (receptbelagd PDT) **VF** | FDA-auktoriserad CBT-PDT; adjunkt till outpatient + contingency management **VF** (FDA De Novo DEN160018; PursueCare) | Kräver kliniker/recept; US; Pear gick i konkurs 2023 — produkt flyttad **VF/PR**; adherence ofta låg (nyare reSET-O-RCT underpowered, P≈0.053) **VF** | **Ja som klinisk referens** — *inte* som konsument-klon |
| **DynamiCare** | Alkohol, opioider, stimulanser, tobak **PR/VF** | Contingency management + breathalyzer + belöningskort; CBT-bibliotek; FDA Breakthrough Device (AUD-produkt under utveckling) **VF/PR** | Övervakning/incitament = kontrollkänsla; US payer-modell; ej trauma-first **PR** | **Medel** — evidens för CM; vi ska *inte* bygga belöningsekonomi |
| **Quit Genius → Pelago** | Tobak/alkohol/substanser (employer/clinical) **PR** | Coaching + digital CBT; publicerade rökstopps-RCT:er i arbetsgivarkontext **PR/VF** (behöver specifik studie-citat per claim) | B2B/employer; engelsk; abonnemang **PR** | **Medel** — coaching-kvalitet, inte B2B-copy |
| **SMART Recovery app** | Alla beroenden (4-punktsprogram) **VF** | CBA, Hierarchy of Values, urge toolkit; mötesfinder US/CA **VF** (Play Store) | Många verktyg öppnas i webbläsare **VF** (user reviews); begränsad svensk närvaro **PR** | **Ja** — verktygsbibliotek (Urge Surfing, CBA) |
| **Recovery Dharma** | Alla beroenden, buddhistisk peer **PR** | Meditation, craving-som-fenomen, icke-teistisk andlighet **PR** | Nisch; mötesbrist lokalt; app-ekosystem fragmenterat **PR/OS** | **Medel** — craving-mindfulness utan AA-teologi |
| **Undrunk** | Alkohol (mindre aktör) **OS** | Positionerad som modern alkoholfri lifestyle **PR/OS** | Liten marknadsandel; osäker feature-djup **OS** | **Låg** tills manuell App Store-check |
| **AlkoSmart (SE)** | Alkohol + livsstil (SMART: sömn/mat/…) **VF** | Svenska; terapeutbakgrund; samtalsstöd inom 24h **VF** (alkosmart.se) | Alkohol-centrerad; inte Life OS; droger/HCF osäkert **PR** | **Ja** — nordisk konkurrent att bevaka |
| **Alkoholhjälpen / IQ (SE)** | Alkohol, anonym rådgivning/självtest **VF** | Gratis, anonymt, svensk vårdkultur; Alkoholprofilen **VF** | Inte en full recovery-app; begränsad drogfokus **PR** | **Ja** — integrations-/länkpartner, inte konkurrent |
| **Mindler / Digidoktor (SE)** | Alkohol via KBT/vård **VF** | Legitimerad vård; IKBT **VF** | Betald vård; inte akut craving offline; drogsamverkan varierar **PR** | **Ja** — "eskalera till vård"-väg |
| **Previct Care (SE)** | Alkohol/droger/spel + vårdportal **VF** | CE-märkta tester; vårdgivardelning; kommunal förankring **VF** (Kontigo) | Övervakningslogik; kräver vårdavtal; ej privat Life OS **PR** | **Ja** — *motsats* till Zero Footprint; lär av vad vi *inte* ska vara |

---

## 2. Mönster som fungerar (evidens + produkt)

### 2.1 Produktmönster med hög retention **PR**
1. **Streak / day counter** — snabb dopamin, men skapar skam vid återfall (se §4).
2. **Morning pledge / evening check-in** (I Am Sober) — två touchpoints/dag = vanebildning.
3. **Community feed** — tillhörighet; samtidigt social jämförelse och integritetsrisk.
4. **CBT-lektioner i korta block** (Reframe, reSET) — färdigheter > bara dagar.
5. **Craving tools i stunden** — andning, urge surfing, spel/distraktion, "ring partner" (Nomo, SMART).
6. **Sparad tid/pengar** — konkret belöning utan vårdkrav.
7. **Accountability partner (1:1)** — starkare än publik vägg för många **PR**.
8. **Contingency management** (DynamiCare, reSET-adjunkt) — starkast *klinisk* evidens för abstinens i vissa populationer **VF** (CM har stor RCT-litteratur; app-implementation varierar).

### 2.2 Publicerade digitala interventioner (urval) **VF**
| Studie / produkt | Resultat (kort) | Implikation |
|------------------|-----------------|-------------|
| Digital CBT + weekly monitoring (JAMA Netw Open, AUD) | Ökad % abstinenta dagar över 8 mån vs TAU/CBT i ITT-analys | Digital CBT *med* lätt klinisk uppföljning fungerar bättre än app ensam |
| Drink Less RCT (EClinicalMedicine 2024) | Primär ITT konservativ: ej signifikant; multiple imputation: −2 enheter/vecka | Effekt känslig för missing data; "app vs råd" ger måttlig effekt |
| Digital medicine support models mild–mod AUD (npj Digit Med) | Tung drinking ↓ i alla armar; kliniskt integrerad arm bättre QoL men högre attrition | Autonomi/anonymitet värderas — tung coaching kan skrämma bort |
| reSET-O + MOUD RCT (PubMed 41833956) | Retention 70.8% vs 51.9%, P=0.053; låg lektionsadherence | PDT hjälper inte om användaren inte öppnar appen |
| CM generellt | >100 RCT:er i substansfältet (DynamiCare/NIAAA-kommunikation) **PR/VF** | Belöning fungerar kliniskt — men krockar med trauma/Zero Footprint-produkt |

**App Store-review-mönster (aggregat) PR:** Beröm = community, milstolpar, enkelhet. Klagomål = paywall på backup/statistik, skam efter reset, ads, "kursen känns lång", privacy-oro på sociala feeds.

---

## 3. Feature-gaps (≥15) där Livskompassen kan vinna

*Markerat: redan delvis i kod = **har stub**; resten = gap.*

1. **Akut craving ≤60 sek** — offline, kroppsligt (vagus/andning/kyla), utan gamification. (**har stub:** Urge SOS — utöka till full "krisbana".)
2. **Craving per substansklass** — alkohol ≠ amfetamin ≠ cannabis ≠ opioider ≠ nikotin (olika peak-tid, risk, råd). **Gap.**
3. **Svensk akutkedja one-tap** — 113, 1177, Alkohollinjen, regionberoende, Jourhavande medmänniska. (**har:** 113/1177/Mind — utöka + regional.)
4. **HCF/trauma-säker craving** — ingen "dela med community"; ingen offentligt relapse-post; Grey Rock-stress som *triggerkategori*. **Unikt gap.**
5. **Konflikt → craving-bro** — Speglar/BIFF-session → "ökad risk idag" utan skuld. **Unikt.**
6. **ADHD/GAD-anpassad urge-hjälp** — en sak i taget, stora knappar, 2-minuters mikroåtgärd (redan ton i reflektionskort). **Förstärk.**
7. **Återfall utan streak-skam** — "data punkt", inte "du misslyckades"; learning loop. (**VF:** katalog säger inga streaks — behåll.)
8. **Multi-substans + beteende** utan att tvinga AA-språk. **Gap vs alkoholappar.**
9. **Privat accountability (1–2 personer)** — krypterad nudge, inte Loosid-feed. **Gap.**
10. **Trigger-karta kopplad till Life OS** — plats/tid/sömn/ekonomi/vårdnad (befintliga moduler). **Unikt.**
11. **Sömn/allostatisk belastning → riskflagga** — fysiologisk krasch som återfallsrisk, inte moral. **Unikt för er user story.**
12. **Anhörig-läge (barn/pappa)** — skydda barnfokus; ingen "sober dating". **Gap i marknaden.**
13. **WORM-bevis vs "social proof"** — valfri, privat dokumentation av nykterhetsperiod för juridik/vård — utan community. **Unikt (Valvet).**
14. **Zero Footprint exit** — radera lokal craving-logg vid utloggning; motsats till Previct-vårdportal. **Unikt.**
15. **Svenska klarspråks-lektioner ≤3 min** — inte 12-veckors engelska kurser. **Gap.**
16. **Urge surfing + HALT + "ring X"** i *samma* SOS-flöde (SMART-verktyg + svensk telefon). **Delvis.**
17. **Medicinsk eskalering utan att bli PDT** — tydlig disclaimer + länk Mindler/1177/beroendecentrum när risk hög. **Policy-gap att produktifiera.**
18. **Ingen paywall på krisverktyg** — branschstandard är att låsa backup/SOS bakom premium (**PR**). **Etisk win.**

---

## 4. Vad vi INTE ska kopiera

| Undvik | Varför |
|--------|--------|
| Publik community-vägg / sober dating | Integritet, RSD, HCF-risk, skamjämförelse **PR** |
| Streak som primär KPI / "chip"-skam | Återfall → självattack; ni har medvetet valt bort streaks **VF** |
| Contingency management med pengar/övervakning | Kliniskt potent men kontroll/trauma-inkompatibelt; Previct-liknande vårdlogik **PR** |
| Receptbelagd PDT-positionering (reSET-klon) | Regulatorisk kostnad, US-vårdmodell, adherence-problem **VF** |
| Långa paywallade kurser som enda värde | Drop-off; kognitiv belastning vid ADHD **PR** |
| Engelsk 12-stegs-tvång | Ni har 12-steg *valfritt*; behåll neutral ton **VF** |
| Breathalyzer-krav för "riktig" nykterhet | Exkluderar, stigmatiserar, dyr hårdvara **PR** |
| Employer-surveillance (Pelago B2B-anda) | Zero Footprint-motsats |

---

## 5. Konkret vinnarposition (rekommendation)

**En mening:**  
Livskompassen vinner inte som "bättre I Am Sober" — utan som **privat, svensk, trauma-/HCF-säker craving- och återhämtningsyta inuti ett Life OS**, där konfliktstress, sömn och barntrygghet är *första klassens triggers*, och där krisverktyg aldrig göms bakom paywall eller social feed.

**Antaget produktmål (PR):**  
SOS → 60 sek kropp → 2 min mikroåtgärd → valfri privat kontakt → svensk vårdlänk.  
Allt offline-först. Ingen community.

---

## 6. Källor och trovärdighet

### Primära / starka
- FDA De Novo summary reSET (DEN160018) — accessdata.fda.gov **VF**
- PursueCare / reSET produktindikationer — reachforreset.com **VF**
- reSET-O RCT (MOUD retention) — PubMed 41833956 **VF**
- Digital CBT AUD RCT — JAMA Network Open (fullarticle/2824103) **VF**
- Drink Less RCT — EClinicalMedicine 2024; doi:10.1016/j.eclinm.2024.102534 **VF**
- Digital medicine support models AUD — npj Digital Medicine (s41746-024-01241-2) **VF**
- SMART Recovery Play Store listing **VF**
- AlkoSmart, IQ/Alkoholhjälpen, Mindler, Digidoktor, Kontigo Previct Care — officiella SE-sidor **VF**
- Livskompassen `drogfrihetCatalog.ts`, `resources.ts`, `DrogfrihetHubPage.tsx` **VF**

### Sekundära / svagare (feature-jämförelser)
- SobrMate / sober-tracker / BACtrack bloggar 2025–2026 — **PR** (marknadsförda jämförelser; kan vara bias)
- DynamiCare press om Breakthrough Device / CM — **VF/PR** (företagskommunikation)
- I Am Sober Google Play data safety / reviews — **PR** (stickprov, ej systematisk review)

### Ej verifierat i denna runda (OS)
- Exakt feature-lista för **Undrunk**, **WEconnect** aktuell build
- Om **Quit Genius**-varumärket fortfarande syns separat från Pelago i SE App Store
- Recovery Dharma "officiell" app vs tredjepart (Recovery Path m.fl.)

---

## 7. Nästa steg (ett i taget — för produktägare)

**Förslag till enda nästa beslut:**  
Godkänn vinnarpositionen i §5 som kanon för Drogfrihet-roadmap (SOS-first, ingen community, svensk vårdkedja, HCF-trigger) — innan någon ny feature byggs.

---

*Rapportstatus: research only. Ingen kod ändrad.*
