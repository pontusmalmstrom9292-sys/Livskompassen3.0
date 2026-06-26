# Familjen/Barnporten – Framtida Förbättringsstrategi

Detta dokument sammanställer pragmatiska och säkerhetsmedvetna analyser av Familjen-modulen. Fokus ligger på att stärka bevisvärdet och kognitiva avlastningen för föräldern, utan att skapa övervakningsmönster (gaslighting) som kan vändas mot användaren.

---

## 5 Förbättringar för Livslogg & Fysiologi

**1. Viktad fysiologisk trend (Balansmätaren)**
* **Kategori:** Kodnära rekommendation
* **Idé:** Ersätt det rakt rullande 7-dagarsmedelvärdet i `utils/balansIndex.ts` med ett exponentiellt glidande medelvärde (EMA) där de senaste 2–3 dagarna väger tyngre.
* **Varför:** Svarar snabbare på akuta dropp i sömn eller aptit, utan stressande larm.

**2. Objektiv "Tredjeparts-wizard" (Skola/Förskola)**
* **Kategori:** Produktidé / Kodnära
* **Idé:** Om föräldern väljer kategorin `skola` eller `tredjepart`, ändras formuläret till en strukturerad wizard: *"Vem sa vad?"*, *"När?"*, *"Objektiv observation"*.
* **Varför:** Tvingar fram ett Grey Rock-faktaspråk och utesluter egen emotionell tolkning (JADE). Detta ger starkare trovärdighet vid en orosanmälan.

**3. "Min Trygga Hamn"-markörer (KASAM-loggning)**
* **Kategori:** Framtidsspår
* **Idé:** Utöka `children_logs` med `action: 'trygg_hamn'`. Låt föräldern checka i diskreta basrutiner (t.ex. "Nattade lugnt").
* **Varför:** Bygger objektiv bevisbörda över tid kring den egna stabiliteten vid parallellt föräldraskap.

**4. Kontextuella, neutrala "Tags" till fysiologin**
* **Kategori:** Kodnära rekommendation
* **Idé:** Knyt fördefinierade taggar till fysiologin, t.ex. `#överlämning_dag`, `#sjukdom`, `#avvikelse_rutin`.
* **Varför:** Fritext tenderar att bli känslosam; taggar ger ren och filtrerbar data för Dossier.

**5. Lågmäld textuell trend-feedback**
* **Kategori:** Produktidé / UX
* **Idé:** Generera en enkel, viskande textsträng (ex. *"Kasper har haft en något oroligare sömn än snittet"*) istället för siffror eller linjegrafer.
* **Varför:** Stöttar "Obsidian Calm"-konceptet och motverkar datastress och mikromanagement.

---

## 5 Idéer för tryggare Export & Dossier-koppling

**6. Lokal "Sanering" inför Dossier-export**
* **Kategori:** Produktidé / UX
* **Idé:** Ett gränssnitt vid export (PDF/JSON) där föräldern kan tillfälligt klicka ur ("maska") specifika loggposter i webbläsaren.
* **Säkerhet:** Rör inte originaldatan (WORM). Ger förskolan/soc en ren utskrift av relevant data.

**7. "Valv-kopplad"-indikator utan update (Visuell markör)**
* **Kategori:** Kodnära rekommendation
* **Idé:** Gör en lookup i klienten mot `reality_vault` filtrerat på `sourceRef` för att rendera en liten Valv-ikon på livsloggen, istället för att uppdatera `children_logs`.
* **Säkerhet:** Bibehåller `update: false` på WORM-dokumenten.

**8. Kryptografisk Hash i PDF-fot (Zero Footprint)**
* **Kategori:** Produktidé
* **Idé:** Beräkna en SHA-256 hash av payloaden direkt i webbläsaren vid PDF-generering och stämpla längst ner.
* **Varför:** Bevisar att dokumentet inte ändrats i Word i efterhand.

**9. Automatisk BBIC-mappning vid utskrift**
* **Kategori:** Kodnära rekommendation
* **Idé:** Mappa `LIVSLOGG_CATEGORIES` mot socialtjänstens BBIC-områden (Barnets behov, Föräldraförmåga, Familj/Miljö) när PDF genereras.

**10. "Dossier Snapshots" (Export-loggning)**
* **Kategori:** Säkerhetsrisk / Framtidsspår 
* **Idé:** Spara "ett kvitto" på *vad* som exporterades, och *när*.
* **Regler:** Kräver en ny `dossier_exports`-collection (`create: true`, `update: false`).

---

## 5 Idéer som BÖR UNDVIKAS (Skapar övervakning/gaslighting)

**11. Automatisk Valv-eskalering från Barnporten**
* **Varför undvika:** Skapar övervakningskänsla och raserar "Den trygga hamnen". Föräldern *måste* vara explicit HITL.

**12. Trafikljus, Rött Larm och Push-notiser för låg Fysiologi**
* **Varför undvika:** Går strikt emot Obsidian Calm. Triggar förälderns trauma-nervsystem och omvandlar appen till en stressfaktor.

**13. "Cross-RAG" (Mönsteranalys mellan Valv och Barnlogg)**
* **Varför undvika:** AI får aldrig dra egna psykoanalytiska slutsatser genom att samläsa motpartens lögner i `reality_vault` med barnets ångestnivåer. Detta tangerar diagnostik och riskerar hallucinationer som skapar falska bevis. Silos *måste* hållas isär.

**14. Delad "Familje-vy" med medföräldern (Motpart)**
* **Varför undvika:** Bygg aldrig inloggning där den andra föräldern kan se barnets balans. Detta ger en covert narcissist plattform för digital kontroll. Asymmetriskt försvar är centralt.

**15. Gamification (Poäng/Streaks) i Barnporten**
* **Varför undvika:** Förflyttar fokus från autentisk kommunikation till prestation. Modulen ska förbli en kravlös yta.
