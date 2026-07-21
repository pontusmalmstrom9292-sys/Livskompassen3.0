# Delrapport: 12-steg → digital drogfrihet (Livskompassen)

**Typ:** Research / product plan — ingen kod  
**Datum:** 2026-07-21  
**Scope:** Översätta 12-stegsprinciper till inkluderande appfunktioner utan AA/NA/CA-låsning  
**Befintlig bas i appen:** `DF-STEP-01…12` (journalprompter), `DF-REF-*` (idag/craving), dagräknare, resurser — ingen gamification

**Legend källtyp**
- `[P]` = principöversättning (Big Book / 12-stegspraxis → digital praxis)
- `[E]` = evidens / publicerad forskning
- `[S]` = SMART Recovery-jämförelse (sekulär, kognitiv modell)

---

## 0. Designprincip för Livskompassen

| Krav | Konsekvens |
|------|------------|
| Inget organisationskrav | Visa “inspirerat av 12-steg” — inte “du är i AA” |
| Inkluderande “Higher Power” | Användare väljer: värden, natur, gemenskap, vetenskap, andlighet, “det som är större än suget” |
| Skamfri ton | Inventering = kartläggning, inte skuldprocess |
| Craving-first | Snabb hjälp idag före långsiktig steg-progress |
| Progressiv disclosure | Ett steg / en övning i taget |
| Journal = säker zon | Privat, frivillig delning, ingen social feed som default |

---

## 1. De 12 stegen → icke-religiös digital praxis

Klassiska AA-steg sammanfattas kort; **funktionerna är `[P]`**.

### Steg 1 — Erkännande (maktlöshet / ohanterligt liv)
**Digital praxis:** “Jag ser att substansen styr mer än jag vill.”

| # | Appfunktion | Not |
|---|-------------|-----|
| 1a | **Ärlighetscheck (60 sek):** “Vad är svårast att erkänna just nu?” → koppla `DF-STEP-01` | `[P]` |
| 1b | **Konsekvenskarta:** 3 rutor — kropp / relationer / vardag (valfritt) | `[P]` |
| 1c | **Craving-loggen:** “Vad hände precis före suget?” (`DF-REF-02`, `DF-REF-11`) | `[P]` + CBT-närhet `[S]` |

### Steg 2 — Hopp (att hjälp är möjlig)
**Digital praxis:** “Något utanför suget kan bära mig idag.”

| # | Appfunktion |
|---|-------------|
| 2a | **Hoppkälla-väljare:** värden / person / rutin / andlighet / “vetenskap & kropp” (ingen default-Gud) `[P]` |
| 2b | **Mikrosteg-idag:** ett beslut för närmaste timmar (`DF-REF-08`, `DF-REF-12`) `[P]` |
| 2c | **Bevisbank:** 3 sparade “det fungerade”-minnen (ej streak) `[P]` |

### Steg 3 — Överlåtelse (beslut att släppa kontroll)
**Digital praxis:** “Jag överlåter *dagens* kontrollbehov — inte hela livet.”

| # | Appfunktion |
|---|-------------|
| 3a | **Överlåtelse-kort:** “Vad släpper jag till i kväll?” (`DF-STEP-03`) `[P]` |
| 3b | **Kontroll vs acceptans-lista:** 2 kolumner, max 3 rader `[P]` |
| 3c | **SOS-överlåtelse:** vid hög craving — “ring / skriv / gå” + akutresurser `[P]` |

### Steg 4 — Moralisk inventering
**Digital praxis:** Strukturerad självkarta utan skametikett.

| # | Appfunktion |
|---|-------------|
| 4a | **Inventeringsmall:** resentments / fear / harm / assets (styrkor) — se §4 `[P]` |
| 4b | **“Utan att döma”-prompt:** spegla `DF-STEP-04` / `DF-STEP-10` `[P]` |
| 4c | **Sessionsläge:** max 10 min; paus & spara; ingen “måste bli klar”-pressure `[P]` |

### Steg 5 — Delning (ärlighet mot någon)
**Digital praxis:** Ärlighet är valfri; peer-check-in ≠ obligatorisk sponsor.

| # | Appfunktion |
|---|-------------|
| 5a | **Delningsutkast:** välj 1 mening från inventering → “skicka senare / kopiera” `[P]` |
| 5b | **Trygg person-lista:** 1–3 kontakter (lokal, ej app-socialt nätverk som default) `[P]` |
| 5c | **Själv-5:** läs högt för dig själv / röstanteckning om ingen finns `[P]` |

### Steg 6 — Beredskap att släppa skadliga mönster
**Digital praxis:** Identifiera mönster → vilja att ändra *ett* beteende.

| # | Appfunktion |
|---|-------------|
| 6a | **Mönster-taggar:** HALT, ensamhet, konflikt, pengar, tristess (`DF-REF-03`) `[P]` |
| 6b | **“Sluta göra idag”-kort** (`DF-STEP-06`) `[P]` |
| 6c | **Trigger → ersättning:** 2-min substitut (`DF-REF-06`) `[P]`/`[S]` |

### Steg 7 — Ödmjukhet / be om hjälp
**Digital praxis:** Be om hjälp utan religiös bön som krav.

| # | Appfunktion |
|---|-------------|
| 7a | **Hjälp-en-mening:** “Var behöver du be om hjälp?” (`DF-STEP-07`) `[P]` |
| 7b | **Hjälpmeny:** kontakt / 1177 / lokala stödlinjer / egen lista `[P]` |
| 7c | **Kroppsförst-check:** vatten, mat, paus (`DF-REF-10`) — ADHD-vänligt `[P]` |

### Steg 8 — Lista över skadade personer
**Digital praxis:** Lista utan omedelbar kontaktplikt.

| # | Appfunktion |
|---|-------------|
| 8a | **Reparationslista (privat):** namn/initial + typ av skada + “redo?” ja/nej/senare `[P]` |
| 8b | **Säkerhetsfilter:** flagga om kontakt kan skada dig eller barn — “vänta / via ombud” `[P]` |
| 8c | **Mikrosteg-prompt** (`DF-STEP-08`) `[P]` |

### Steg 9 — Gottgörelse (när det inte skadar)
**Digital praxis:** Gottgörelse = konkret mikrosteg, inte stor bekännelse.

| # | Appfunktion |
|---|-------------|
| 9a | **Gottgörelse-wizard:** ursäkt / handling / gräns / “inte nu” (`DF-STEP-09`) `[P]` |
| 9b | **BIFF-hjälp för textutkast** (kort, sakligt) — särskilt vid konflikt/ex `[P]` (produktpassning) |
| 9c | **Själv-gottgörelse:** sömn, mat, medicin, barn-tid — giltig gottgörelse `[P]` |

### Steg 10 — Daglig inventering
**Digital praxis:** Kort kvälls-/morgoncheck, se §2.

| # | Appfunktion |
|---|-------------|
| 10a | **Kvällsinventering 3 frågor** (se §2) `[P]` |
| 10b | **Mönster utan dom** (`DF-STEP-10`) `[P]` |
| 10c | **Återfalls-vänlig omstart:** “idag är en ny dag” — ingen streak-skam `[P]` |

### Steg 11 — Närvaro / “kontakt”
**Digital praxis:** Meditation, andning, natur, värden — användarvalt.

| # | Appfunktion |
|---|-------------|
| 11a | **Närvaro-meny:** andning 2 min / promenad / tyst / egen ritual (`DF-STEP-11`) `[P]` |
| 11b | **Värde-ord idag** (`DF-REF-07`) `[P]` |
| 11c | **Valfri andlig/sekulär text** — aldrig påtvingad `[P]` |

### Steg 12 — Service / bära vidare
**Digital praxis:** Tjäna *din* nykterhet + frivillig hjälp till andra utan rekrytering.

| # | Appfunktion |
|---|-------------|
| 12a | **Service-mikrosteg** (`DF-STEP-12`) — t.ex. städa, svara ärligt, hjälpa barn `[P]` |
| 12b | **Peer-check-in (opt-in)** — se §3 `[P]` |
| 12c | **Resurskort:** länkar till *flera* mutual-help (AA/NA/SMART/andra) — neutral presentation `[P]`/`[S]` |

---

## 2. Dagliga rutiner (12-stegs-inspirerade)

Allt `[P]` om inte annat anges. **Ingen streak-gamification** (redan kanon i hub-help).

### Morgon — “One day at a time”
1. **Dagens beslut (1 mening):** nykterhet *idag*, inte “för alltid”.
2. **Riskscan (30 sek):** plats / känsla / tidpunkt som kan bli svår.
3. **Ett skydd:** person, plats, rutin, eller SOS-plan.
4. **Valfri steg-prompt:** rotera `DF-STEP-*` eller dagens `DF-REF-*`.

### Under dagen — craving-brygga
- **HALT-check** vid sug (`DF-REF-03`).
- **2-minuters substitut** (`DF-REF-06`).
- **Urge-surfing-timer** 10–20 min (våg-metafor) — CBT/SMART-närhet `[S]`.

### Kväll — inventory (Steg 10-light)
Tre frågor, max 5 min:
1. Vad gick okej idag? (assets)
2. Var blev jag irriterad / rädd / frestad? (utan skam)
3. Vad gör jag annorlunda imorgon bitti? (ett mikrosteg)

**Återfall:** omstartskort utan “förlorade dagar”-skam — dagräknare får nollställas lugnt; fokus på lärdom (`DF-REF-04`).

---

## 3. Sponsorskap-inspirerade check-ins (utan fysisk sponsor)

**Mål:** accountability + ärlighet utan hierarki, rekrytering eller “du måste ha sponsor”.

| Modell | Hur det funkar i appen | Risk att undvika |
|--------|------------------------|------------------|
| **A. Själv-sponsor** | Schemalagd check-in till dig själv (notis + 3 frågor) | Ingen “falsk sponsor”-persona som låtsas vara människa |
| **B. Buddy-par (opt-in)** | Två användare utbyter *status* (grön/gul/röd) + valfri mening — ej full journal | Ingen matchmaking-algoritm som känns sektig |
| **C. Trygg kontakt utanför appen** | Påminnelse: “Skicka SMS till X?” + färdig kort text | Appen lagrar inte andras konversationer som default |
| **D. Professionell länk** | Lista terapeut/stödlinje som “accountability” | Inte ersätta vård |

**Check-in-protokoll (förslag, `[P]`):**
1. Färg: trygg / skakig / akut  
2. En mening: “Vad behöver du?”  
3. Ett åtagande till nästa check (tid, inte moral)

**Frekvens:** dagligen tidigt i recovery; sedan 3×/vecka — användarstyrt.

---

## 4. Inventeringar som säkra journalövningar

Alla privata som default. **REFLECTION**-klass, inte bevis/Valv om användaren inte aktivt flyttar.

### 4.1 Moral inventory (Steg 4-light)
Kolumner (klassisk AA-struktur, sekulariserad) `[P]`:
| Situation | Känsla | Min del / mönster | Vad jag vill skydda framåt |

### 4.2 Resentments
- Prompt: “Vem/vad irriterar mig — och vilket behov ligger under?”
- Regel: skriv klart *före* eventuell kontakt.
- Avslut: “Vad kan jag påverka idag?” (1 sak)

### 4.3 Fear inventory
- Lista rädslor → “Vad skyddar den?” → “Vad är ett litet steg trots rädslan?”
- Koppla ADHD/GAD: korta sessioner, ingen “gräv tills du mår sämre”.

### 4.4 Harm inventory (Steg 8-förberedelse)
- Initialer + typ av skada + “redo för gottgörelse?”  
- Automatisk varning vid våld/hot/vårdnadskonflikt: rekommendera BIFF/ombud, inte impulsiv kontakt.

### Säkerhetsregler (MUST)
- Ingen delning till AI-träning / social feed utan explicit opt-in.
- Panic-exit: stäng övning, öppna SOS / kroppsövning.
- Skamfilter i copy: “mönster”, aldrig “du är dålig”.
- Barn/ex-relaterat: erbjud flytt till lämplig zon (Speglar/Valv) — silo-respekt.

---

## 5. Vad som MÅSTE undvikas

| Undvik | Varför | Alternativ |
|--------|--------|------------|
| AA/NA/CA som enda väg | Låsning, alienisering | Multi-path: 12-steg-inspirerat + SMART-verktyg + egen plan |
| Religiös tvång / “måste tro på Gud” | Exkluderar, skapar skuld | Hoppkälla-väljare |
| Sekt-/brödraskap-ton (“vi”, “du tillhör”) | Hypervigilans, RSD | Neutral, klinisk, valfri gemenskap |
| Skam, moralism, “svag vilja” | Ökar relapse-risk subjektivt | Skamfri kartläggning |
| Streaks, badges, leaderboards | Gamification förbjuden i hub | Dagar som info, inte poäng |
| Obligatorisk sponsor / peer | Inte alla har nätverk | Själv-sponsor + externa kontakter |
| Tvingad “fullständig” Steg 4 | Överväldigande (ADHD/GAD) | 10-min sessioner |
| Appen som “guru” eller falsk terapeut | Etik + säkerhet | Verktyg + resurser + vårdlänkar |
| Rekrytering / “värva andra” | Sektkänsla | Service = egen nykterhet först |
| Public confessions | Integritet, Zero Footprint-anda | Privat journal, opt-in delning |

---

## 6. Femton feature-idéer (P0/P1/P2 × L/M/H)

| ID | Feature | Prio | Complexity | Steg-koppling | Anteckning |
|----|---------|------|------------|---------------|------------|
| F01 | **Craving SOS-flöde** (HALT → 2-min substitut → SOS) | P0 | M | 1, 3, 6 | Bygger på befintliga `DF-REF-*` |
| F02 | **One-day decision-kort** (morgon, 1 mening) | P0 | L | 2, 10 | Redan nära `DF-REF-08/12` |
| F03 | **Kvällsinventering 3 frågor** | P0 | L | 10 | Steg 10-light |
| F04 | **Steg-journal med `DF-STEP-*`** (en prompt/session) | P0 | L | 1–12 | Katalog finns — UX-polish |
| F05 | **Hoppkälla-väljare** (sekulär/andlig) | P0 | L | 2, 3, 11 | Inkludering |
| F06 | **Återfalls-omstart utan skam** (copy + reset-flow) | P0 | M | 1, 10 | Kritiskt för retention |
| F07 | **Resentment/fear-mallar** (guided journal) | P1 | M | 4 | Säker journalövning |
| F08 | **Reparationslista + säkerhetsfilter** | P1 | M | 8, 9 | Viktigt vid HCF/vårdnad |
| F09 | **Gottgörelse-mikrosteg-wizard** | P1 | M | 9 | + valfri BIFF-hjälp |
| F10 | **Själv-sponsor check-in** (notis + färgstatus) | P1 | M | 5, 12 | Inget peer-krav |
| F11 | **Urge-surfing timer** | P1 | L | 1, 6 | SMART/CBT-brygga `[S]` |
| F12 | **Bevisbank / “det fungerade”** (max 10 kort) | P1 | L | 2 | Anti-skam |
| F13 | **Buddy status-ping (opt-in, minimal)** | P2 | H | 5, 12 | Privacy + matchning = tungt |
| F14 | **Närvaro-meny** (andning/promenad/tyst) | P2 | M | 11 | Kan återanvända MåBra |
| F15 | **Multi-path resurser** (AA/SMART/övrigt, neutral) | P2 | L | 12 | Informera, inte rekrytera |

**Rekommenderad leveransordning:** F01–F06 → F07–F12 → F13–F15.

---

## 7. Källor och evidensgränser

### 7.1 Principöversättning `[P]`
- **AA Big Book / Twelve Steps and Twelve Traditions** — principer: powerlessness, hope, inventory, amends, daily inventory, service, “one day at a time”, sponsorship som *peer*-stöd.
- Denna rapport **citerar inte** upphovsskyddad AA-text ordagrant. Funktionen är *översättning av princip*, inte AA-medlemskap eller mötesersättning.
- Traditionsanda som är relevant digitalt: anonymitet, icke-professionell peer-hjälp, frivillighet — **utan** att appen blir en AA-klon.

### 7.2 SMART Recovery-jämförelse `[S]`
| 12-stegs-tema | SMART-nära digital motsvarighet |
|---------------|----------------------------------|
| Powerlessness / craving | Urge surfing, ABC (CBT), “Disarming urges” |
| Inventory | Kostnad–nytta, self-management |
| Sponsor | Coach/peer valfritt; fokus egen agency |
| Higher Power | Sekulär self-empowerment |

**Produktimplikation:** Livskompassen bör erbjuda **båda språken** (steg-inspirerat + verktygs-/CBT-språk) bakom samma craving-flöde — användaren väljer ton, inte organisation.

### 7.3 Evidens `[E]` (kort, med gränser)
1. **Kelly, Humphreys & Ferri (2020), Cochrane CD012880** — Manualiserad *Twelve-Step Facilitation (TSF)* kopplad till AA-deltagande har *high-certainty* stöd för **högre kontinuerlig abstinens** vs andra etablerade behandlingar (t.ex. CBT) vid alkoholproblem; effekt delvis via fortsatt AA-deltagande efter intervention.  
   - **Viktigt:** Evidensen gäller främst **AA/TSF för AUD**, inte “en app med 12 steg-prompter”. Digital principöversättning ≠ bevisad TSF.
2. **Kostnader:** Samma översikt tyder på att AA/TSF sannolikt minskar sjukvårdskostnader jämfört med vissa alternativ (ekonomiska studier i reviewen).
3. **Alternativa mutual-help:** Forskning (t.ex. longitudinella jämförelser inklusive SMART, LifeRing, Women for Sobriety) tyder på att **flera mutual-help-vägar kan ge liknande nytta** för dem som engagerar sig — men ofta **svagare evidensbas** än AA/TSF.  
   - **Implikation:** Presentera flera vägar; tvinga ingen.
4. **Okänt / ej hävda här:** Effekten av *just Livskompassens* steg-journal, buddy-ping eller craving-timer — kräver egen utvärdering. Markera produktpåståenden som hypotes tills mätt.

### 7.4 Tydlig gräns för marknadsföring
| Tillåtet | Inte tillåtet |
|----------|---------------|
| “Verktyg inspirerade av 12-stegsprinciper” | “Godkänd av AA” / “ersätter AA” |
| “Forskning visar att AA/TSF kan hjälpa många med alkoholproblem” | “Denna app är bevisat lika effektiv som AA” |
| “Du kan också använda SMART-verktyg” | “12-steg är den enda vetenskapliga vägen” |

---

## 8. Mappning mot befintlig kodbas (orientering)

| Befintligt | Rapportens användning |
|------------|------------------------|
| `recoveryTwelveStepCatalog.ts` (`DF-STEP-*`) | Kärna för F04 — behåll skamfri ton |
| `drogfrihetCatalog.ts` (`DF-REF-*`) | Craving/idag — F01–F03 |
| Dagräknare | Visa dagar som fakta; F06 omstart |
| Hub-flik “12 steg” | Progressive disclosure — ett steg i taget |
| “Ingen gamification” (module help) | Lås — streaks förbjudna |

---

## 9. Nästa steg (ett)

**Godkänn P0-paketet F01–F06** som produktbacklog för nästa drogfrihetsvåg; övriga features väntar tills P0 finns i UI och copy är granskad mot §5 (skam/sekt/religion).

---

*Slut på delrapport. Ingen kod ändrad i denna leverans.*
