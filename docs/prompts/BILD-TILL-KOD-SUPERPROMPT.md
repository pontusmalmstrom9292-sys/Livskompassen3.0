# BILD TILL KOD - SUPERPROMPT

*Använd denna prompt när du laddar upp en ny skiss, wireframe eller Figma-export och vill att AI-Orkestern automatiskt bygger hela funktionen från start till mål.*

---

**[KOPIERA OCH KLISTRA IN DETTA I CHATTEN TILLSAMMANS MED DIN BILD]**

Trigga `/bild-arkitekten`. Jag bifogar en skiss på en ny vy/komponent. 

Här är lite kontext:
1. **Syfte:** [T.ex. "Ett nytt sätt att spara humör"]
2. **Klick / Interaktion:** [T.ex. "När man trycker på 'Klar' ska det sparas"]
3. **Placering:** [T.ex. "Ska ligga som en under-vy i Dagboken"]

**Vänligen följ detta Orkester-flöde:**
1. **Bild-Arkitekten:** Analysera bilden. Vilka tokens och Chameleon-states behövs? Föreslå en plan.
2. **Design-Labbet:** När jag godkänt planen, implementera UI-koden (bara frontend/visuellt).
3. **Minnes-Arkitekten (Valfritt):** Om vi måste spara data, se till att det skrivs Firestore-logik som följer WORM.
4. **YOLO-vakten:** Kör en säkerhetsgranskning på den färdiga koden för att säkerställa att Valvet / Device Clear respekteras.
