# Automatisering med Gemini CLI: Mina Verktyg och Funktioner

Som din Gemini CLI-agent har jag en specifik uppsättning verktyg (tools) som jag kan använda för att automatisera ditt byggande, skriva kod, undersöka buggar och bygga strukturer. 

Du kan instruera mig att använda dessa genom att berätta vad du vill ha gjort. Jag kommer automatiskt att välja rätt verktyg.

## 📂 Filsystem och Navigering
* **`list_directory`**: Jag kan snabbt skanna av mappar för att se vilka filer och undermappar som finns (t.ex. "Vilka komponenter finns i `src/components`?").
* **`glob`**: Ett blixtsnabbt sätt för mig att hitta specifika filer baserat på mönster i stora kodbaser (t.ex. hitta alla `*.tsx` filer som rör "Kompis").

## 📖 Läsning och Undersökning
* **`read_file`**: Jag kan läsa innehållet i specifika filer, eller avgränsade delar (rad 10 till 50) av stora filer för att spara kontext och agera snabbare.
* **`grep_search`**: Sökverktyget. Om vi letar efter var en specifik funktion används eller var ett fel uppstår, kan jag söka igenom hela projektet med reguljära uttryck.
* **`web_fetch`**: Jag kan surfa till dokumentation, GitHub-repon (raw files) eller artiklar för att läsa på om specifika paket eller ny teknik (t.ex. "Kolla dokumentationen för framer-motion på denna URL").
* **`google_web_search`**: Jag kan göra riktade Google-sökningar för att hitta aktuell dokumentation, lösa obskyra felmeddelanden eller göra research.

## ✍️ Kodning och Modifiering
* **`write_file`**: Jag kan skapa helt nya filer och skriva komplett kod till dem direkt från mina svar.
* **`replace`**: För kirurgiska ingrepp i existerande kod. Jag kan byta ut specifika kodblock mot ny, uppdaterad kod utan att skriva om hela filen (vilket är mycket snabbare och säkrare).

## 🛠️ Terminal och Exekvering
* **`run_shell_command`**: **(Ett av de kraftfullaste verktygen)**. Jag kan köra terminalkommandon direkt i ditt projekt.
  * *Exempel:* Installera paket (`npm install`), köra linter (`npm run lint`), bygga appen (`npm run build`), hantera Git (`git status`), eller starta tester.
  * Jag kan även starta bakgrundsprocesser (t.ex. starta en utvecklingsserver) och läsa loggarna från den medan jag jobbar.

## 🧠 Sub-agenter (Experter)
För tunga, komplexa eller repetitiva uppgifter kan jag delegera till mina "kollegor":
* **`codebase_investigator`**: En agent specialiserad på djup arkitektonisk analys. Används om vi behöver mappa upp hur hela Sub-Synaptiska nätverket hänger ihop innan vi kodar.
* **`generalist`**: En arbetsmyra för storskaliga refaktoreringar (t.ex. "Uppdatera Tailwind-konfigurationen i alla 50 komponenter").

## 🗺️ Planering
* **`enter_plan_mode`**: När du ger mig en väldigt stor och komplex uppgift (t.ex. "Bygg hela backend-integrationen för Agenten"), växlar jag till detta läge. Då gör jag research, skapar en design-fil och ber om ditt godkännande innan jag börjar skriva koden.

---

### 💡 Hur du använder mig bäst för automation:
Ge mig **Direktiv** snarare än frågor om du vill ha kod skriven.
* *Istället för:* "Hur lägger man till framer-motion?"
* *Säg:* "Installera framer-motion i projektet, integrera det i `KompisAvatar.tsx` så den pulserar, och uppdatera testerna." (Jag kommer då att köra shell commands för installation, läsa filen, skriva ny kod och köra linting, allt i ett flöde).
