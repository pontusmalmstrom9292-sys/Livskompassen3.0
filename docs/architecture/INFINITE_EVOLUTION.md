# Lagen om Evig Tillväxt (The Infinite Evolution Engine)

Livskompassen är inte ett statiskt verktyg; det är ett självuppbyggande, evolutionärt ekosystem som växer och anpassar sig i takt med användarens kapacitet och familjens livscykel. Detta dokument fastställer de oförstörbara reglerna och mekanismerna för denna motor.

---

## 1. De 5 Pelarna

Evolutionen mäts och drivs framåt balanserats över fem fundamentala områden:

1. **Kognitiv Grund (Cognitive Foundation)**
   - *Fokus*: Dygnsrytm, orientering, exekutiv avlastning och mental närvaro.
   - *Källor*: `checkins` (Morgonkompassen), slutförande av `user_daily_focus`.
   - *Evolution*: Från grundläggande paralysbrytning till proaktivt dygnsrytmsskapande.

2. **Emotionell Puls (Emotional Pulse)**
   - *Fokus*: Psykologisk återhämtning, självmedkänsla och känsloreglering.
   - *Källor*: `journal` (Hjärtat), `mabra_sessions` (KBT/ACT), `vit_entries` (Reflection/Play).
   - *Evolution*: Från akut stresshantering till djupgående värderingsstyrt liv (ACT).

3. **Vardagens Arkitektur (Everyday Architecture)**
   - *Fokus*: Ekonomi, tidshantering, matprepp och logistisk struktur.
   - *Källor*: `transactions`, `economy_ledger`, `budget_savings`, `time_entries`.
   - *Evolution*: Från skuld- och stressfri baskonsumtion till avancerade smarta verktyg och impulsfördröjning.

4. **Relationell Trygghet (Relational Security)**
   - *Fokus*: Tryggt föräldraskap, BBIC-fakta, neutral kommunikation och nätverksstöd.
   - *Källor*: `children_logs` (fysiologi/livslogg), `barnporten` interaktioner.
   - *Evolution*: Anpassar verktyg och gränssnitt i takt med att barnen växer.

5. **Valvets Integritet (Vault Integrity)**
   - *Fokus*: Oförändrad sanning, forensisk mönsteranalys och digitalt självförsvar.
   - *Källor*: `reality_vault` (WORM-bevis), `dossier_snapshots`.
   - *Evolution*: Från reaktiv bevisinsamling till strukturerad och hash-säkrad dossierframställning.

---

## 2. Oförstörbar WORM-Säkerhet (Progressive History)

Varje framsteg, nivåökning och upplåsning måste vila på en permanent och manipuleringssäker grund.

- **Princip**: Historiska framsteg får aldrig kunna raderas eller skrivas över.
- **Implementering**: 
  - **`evolution_ledger`**: En WORM (Write Once, Read Many) Firestore-samling. Alla händelser (milstolpar, nivåändringar, ålderskliv) sparas som separata, oföränderliga dokument.
  - **`evolution_hub`**: En mutable samling (`evolution_hub/{userId}`) som representerar det *nuvarande* konsoliderade tillståndet. Inga uppdateringar av det aktiva tillståndet i `evolution_hub` får göras utan att en motsvarande permanent logg skrivs till `evolution_ledger`.
- **Säkerhetsregler**: Firestore rules nekar strikt `update` och `delete` på `evolution_ledger`.

---

## 3. Adaptiv Barnporten (Ålderssegmentering)

Barnportens verktyg och gränssnitt för Kasper och Arvid växer med dem för att garantera ett åldersadekvat stöd.

| Ålderssegment | Ålder | Tillgängliga verktyg & UX | Datadrivet syfte |
|---|---|---|---|
| **Småbarn & Förskola** | 3–5 år | Mood-ikoner, rita känslor, bubbel-andning (UX) | Känslomässig identifiering utan textkrav |
| **Tidig Skolgång** | 6–9 år | Enkel textinmatning, skriva till förälder, enkla checklistor | Grundläggande kommunikation & trygghet |
| **Pre-teen** | 10–13 år | Journaling, personliga mål, röstanteckningar, guidade självövningar | Autonomi, reflektion och kognitiv struktur |
| **Tonåring** | 14+ år | Fullt livs-OS, tonårs-chatt, veckopeng/ekonomisimulering | Ansvarstagande, avancerat stöd & direkt feedback |

---

## 4. Kapacitetsstyrd Ekonomi & Planering

Avancerade planerings- och ekonomiverktyg låses upp dynamiskt endast när användarens kognitiva grund och emotionella puls visar stabil kapacitet. Detta skyddar mot överväldigande (ADHD/GAD-sårbarhet).

- **Kapacitetsindikatorer**:
  - `checkins` (Morgonkompassen) > 4 unika dagar per kalendervecka.
  - Avklarade `planning_tasks` > 5 per vecka.
  - Stabil stress-/mående-indikator i MåBra under de senaste 14 dagarna.
- **Nivåer**:
  - **Nivå 1 (Rehab/Lugn)**: 
    - *Planering*: Endast ett konkret mikrosteg i taget visas (Paralys-Panel). Full Kanban är dold för att undvika överväldigande.
    - *Ekonomi*: Enkel saldoövervakning samt snabbknappar för veckopeng/matlåda. Inga avancerade sparmål eller budgetkuvert syns.
  - **Nivå 2 (Aktiv Planering & Struktur)**:
    - *Planering*: Full Kanban och projektblock låses upp.
    - *Ekonomi*: Sparmål (`budget_savings`) och kuvertmetodik (`budgets`) blir synliga.
  - **Nivå 3 (Evolutionär Optimering)**:
    - *Planering*: Avancerade e-post- och projektregler aktiveras.
    - *Ekonomi*: Impulsfördröjnings-kö (`economy_impulse_queue`) och intelligenta spar-simuleringar blir tillgängliga.

---

## 5. Riktlinjer för AI-Agenter

1. **Undvik statisk kod**: Skapa aldrig vyer som antar en fixerad uppsättning verktyg. Kontrollera alltid aktiva feature-flaggor via `evolution_hub`.
2. **Respektera Silos**: Även om tillståndet är sammankopplat i evolutionen, får rådata *aldrig* korsläsas mellan Kunskap, Valv och Barnen.
3. **Bevara WORM**: Förändra aldrig nivåer utan att skriva en utförlig milstolpe till `evolution_ledger`.
