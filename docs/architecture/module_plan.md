# Modul- och Funktionsplanering (Pre-flight Checklist)

Denna mall måste fyllas i av alla utvecklare eller AI-agenter **innan** någon kodändring initieras för en ny funktion eller modul. Syftet är att upprätthålla strikt arkitekturstyrning och bevara systemets integritet enligt projektets regler.

## 1. Grundläggande Information

- **Modul/Funktionsnamn:** [Fyll i namn]
- **Beskrivning:** [Kort beskrivning av vad modulen eller funktionen ska åstadkomma]
- **Datum:** [YYYY-MM-DD]
- **Utvecklare/Agent:** [Fyll i]

## 2. Checklista före flygning (Obligatorisk)

Följande punkter **måste** verifieras innan kodskrivning påbörjas:

### Domäntilldelning
Modulen måste vara strikt tilldelad en av följande godkända domäner:
- [ ] Kärna (Core)
- [ ] Kunskap
- [ ] Valv
- [ ] Familj/Barn
- [ ] Vardag

**Vald domän:** [Ange domän här]

### Integrationsregler
- [ ] Jag har läst och verifierat att modulen till fullo följer reglerna i `MASTER_INTEGRATION_MANIFEST.md`.

### WORM-kompatibilitet och Datasäkerhet
- Berör denna modul eller funktion känslig data i huvudboken (evolution_ledger) eller Valvet?
  - **Svar (Ja/Nej):** [Ange svar]
- [ ] **Om Ja:** Jag bekräftar att implementationen är 100% WORM-kompatibel (Write Once, Read Many). Ingen känslig data skrivs över eller modifieras, endast oföränderliga (immutable) tillägg sker.

### Beroenden Mellan Domäner
- Finns det beroenden till andra domäner? (t.ex. Vardag behöver läsa från Kunskap)
  - **Svar/Lista på beroenden:** [Ange beroenden eller skriv "Inga"]
- [ ] **Om beroenden finns:** Jag intygar att dessa domänöverskridande beroenden har deklarerats och godkänts av Core Backbone-arkitekturen för att undvika cirkulära eller osäkra kopplingar.

## 3. Sammanfattning av Förändringar

*(Beskriv kort vilka filer som kommer att skapas/ändras, vilka Firestore-regler som berörs och eventuella nya tillstånd i Zustand)*
