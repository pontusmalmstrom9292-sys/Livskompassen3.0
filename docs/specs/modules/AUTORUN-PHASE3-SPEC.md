# Specifikation: Autorun Phase 3 (Kognitiv Avlastning & UI-Polering)

Denna specifikation fungerar som en blueprint för nästa batch av isolerade UI-förbättringar (Autorun Fas 3). Inga av dessa ändringar rör databas-regler, Firebase-säkerhet eller backend-logik, vilket gör dem säkra för autonom implementering.

## 1. Inaktivitets-blur & Säkerhet (App-shell)
**Mål:** Skydda användarens integritet från axelsurfare (shoulder surfing) när enheten lämnas upplåst, utan att kräva biometri för varje kort paus.
- **Trigger:** När fönstret tappar fokus (`window.onblur`) eller vid inaktivitet (ingen mus/touch) i mer än 30 sekunder.
- **Implementation:** Ett transparent overlay med `backdrop-blur-md` (via Tailwind) renderas högst upp i komponentträdet (`ModuleShell.tsx` eller App.tsx).
- **Återställning:** Ett enkelt klick eller "Svep upp för att fortsätta" (likt iOS) som tar bort blureffekten. Endast om tiden överstiger X minuter krävs Valvets PIN/Biometri.

## 2. Mönster-Highlight i Valvet
**Mål:** Hjälpa användaren att snabbt visualisera återkommande mönster i sina bevis/loggar utan tunga backend-analyser.
- **Mekanism:** Ren CSS/Regex-färgkodning på klientsidan.
- **Implementation:** En inställning i `VaultPage` som aktiverar en highlighter-funktion. Ordbibliotek hämtas från en statisk konfiguration (t.ex. rött för "skuld", "bråk", "stress"; blått för "lugn", "paus").
- **Design:** Istället för skrikiga färger används dämpade `bg-amber-900/30 text-amber-200` för att behålla "Obsidian Calm"-estetiken.

## 3. Distraktionsfritt "Töm Huvudet"-läge
**Mål:** När den kognitiva kapaciteten är noll, ska Hjärtat (dagboken) kunna skalas ner till en blank skärm med endast en textinmatningsruta och en spara-knapp.
- **Design:** Döljer alla menyer, taggar, historik och navigerings-bars.
- **Åtkomst:** En "Zen-mode"-knapp intill vanliga "Nytt Inkast".
- **Interaktion:** Web Speech API-stöd ("Diktera") framhävs för att låta användaren blunda och prata rakt ut. Spara-knappen tvingar Zero-Footprint (inget sparas i webläsarens cache).

## 4. "Bara Lyssna"-Toggle (Hjärtat)
**Mål:** Ibland vill användaren bara ventilera utan att Kompis-agenterna ger goda råd, lösningsförslag eller reframings.
- **Mekanism:** En checkbox bredvid "Spara" som sätter flaggan `isListeningOnly: true`.
- **Systempåverkan:** När flaggan är satt, ignorerar AI-prompterna i `DagbokReflektionDelegate` kravet på att svara konstruktivt. Den svarar istället enbart med spegling och empatisk bekräftelse ("Jag hör dig. Det är sparat.").

## 5. Teckenräknare & Clipboard Sync
**Mål:** Bättre kontroll vid extremt långa inlägg och säkrare kopiering inför app-krascher.
- **Teckenräknare:** En diskret, dämpad siffra (`text-white/20`) nere i högra hörnet av text-arean.
- **Clipboard Sync:** En knapp för att kopiera hela texten direkt till urklipp med en haptisk/visuell toast: "Sparat i minnet". Detta förhindrar oro för dataförlust innan man vågar klicka "Spara till Valvet".

---
*Dessa uppgifter rekommenderas att implementeras av en frontend-fokuserad agent så fort `Orkester nattpass` är färdig med strukturändringarna.*
