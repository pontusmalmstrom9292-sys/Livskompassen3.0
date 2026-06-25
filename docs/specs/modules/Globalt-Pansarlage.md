# Specifikation: Globalt Pansarläge (Survival Mode)

Detta dokument beskriver beslutsunderlaget och arkitekturen för "Globalt Pansarläge", framtaget för att erbjuda maximal kognitiv avlastning utan att påverka de underliggande WORM/Silo-reglerna.

---

### 1. Feature
**Globalt Pansarläge (Survival Mode)**: En global kognitiv grind som ersätter hela gränssnittet (döljer menyer, Valv, Planering, dashboards) med en mörk, minimalistisk vy (Obsidian Calm). Vyn tillåter endast tre handlingar när användaren är i extrem stress eller HCF-konflikt: 
1) Ett mikrosteg/andning (via `BiochemicalShieldHub`).
2) Kognitiv dumpning via en ren Inkast-textruta.
3) Diskret PIN-gate för att stänga läget och återgå till normalvy.

### 2. Varför nu
`evolution_ledger` och `capacityBand` har rullats ut (Fas 19.5), och superhubbarna har konsoliderat all inmatning. Systemet är redo för ett överordnat skyddsnät som bryter exekutiv paralys.

### 3. Vad som påverkas (Klient)
- **Frontend / Routing:** `AppRoutes.tsx` får en villkorlig wrapper.
- **State:** En minimalistisk Zustand-store `usePansarStore`.
- **UI:** En ny komponent `GlobalPansarView.tsx` som återanvänder mycket från `InkastLite` och `ParalysPanel`.

### 4. Vad som INTE påverkas (Säkerhet)
- **Backend / WORM:** Databasen, `firestore.rules` och WORM-garantierna rörs inte. Inkastet från Pansarläget går via befintlig `inboxClassifier.ts`.
- **Silor / RAG:** Inget cross-RAG. Data isoleras som vanligt. 

### 5. Riskanalys
- **Säkerhetsutlåsning:** Risk att man inte kan logga kritiska bevis om man fastnar i läget. 
  - *Mitigering:* Inkastet sparar allt till Inbox där bakgrundsagenter kan flagga det, plus en tydlig men diskret PIN-bypass.
- **State loop:** Risk för flimmer om AI-coachens bedömning av kapacitet pendlar. 
  - *Mitigering:* Läget låser sig och kräver manuell PIN/Biometri för avstängning; det stängs inte av sig självt.

### 6. Security & Privacy Impact
- **Positiv (Plausible Deniability):** Perfekt vid "shoulder surfing" i högkonfliktsituationer. Vid aktivering ser appen bara ut som en avskalad andningsövning. 

### 7. UX Impact
- **Maximal kognitiv avlastning:** Eliminering av Hick's Law. Döljer komplexitet och tvingar systemet att bryta exekutiv paralys. 

### 8. Rollout-strategi
1. Bygg frontend-state (`usePansarStore`).
2. Skapa `GlobalPansarView` med integrerat Inkast.
3. Wrappa `AppRoutes` och lägg in en "Trigga Pansarläge"-knapp i Hem-vyn.

### 9. Riktlinjer för Exekvering
- **Strikt Manuellt:** Pansarläget får aldrig aktiveras *automatiskt* av systemet, oavsett vad `capacityBand` är. Användaren måste explicit klicka på en "Panik"-knapp eller liknande (SOS-ankare).
- **Inkast Undantag:** Inkastet inuti Pansarläget tillåts rendera direkt på skärmen som en nödvy, utan att bryta mot Superhub-principen.
