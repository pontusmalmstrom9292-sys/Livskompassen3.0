# Livskompassen 3.0 – Fas 23 Sprint-plan & Förbättrings-Backlog

Detta dokument sammanställer den omedelbara sprint-planeringen ("Etapp 2" / Kognitiv Avlastning) samt en backlog på 20 högeffektiva förbättringsförslag ("Quick Wins") som kan plockas in vid behov. Allt fokuserar på låg risk (inga ändringar av säkerhetsregler) och hög impact.

---

## Aktuell Sprint: Etapp 2 (Kognitiv Avlastning)

Fokus ligger på UI, UX och routing för att minska tröskeln för interaktion dagar då den kognitiva kapaciteten är i botten.

### Huvuduppgifter
- [ ] **Paralys-Brytare Mini-Widget i Planering:** Återanvänd logik från "Uppgifts-Krossaren" direkt i planeringen. En knapp ("Bryt ner") som tar en överväldigande uppgift och genererar 3 mikrosteg.
- [x] **"Töm Skallen" (Audio-inkast):** Bygg in Web Speech API i Inkast-vyn för att transkribera röst till text. Radera ljudfilen omedelbart (Zero Footprint).
- [x] **"Bara ord"-inmatning:** Extremt låg tröskel där användaren bara trycker på 3-5 förvalda känsloord istället för att skriva.
- [x] **"Bara Lyssna"-toggle:** Inställning i chatten/inkastet som tvingar "Speglings-Coachen" att enbart validera, utan råd eller frågor.

### UI & Layout Polering (7-10 Punkters Masterplan)
1. **Delade Design Tokens** – Konsekvent utseende (hörnradie 8-14px, samma färgskalor) för alla Superhubbar.
2. **Hem Layout A (Mobil & Token-synk)** – Åtgärda rutnät för mobiler och rätta till token-drift (Obsidian Calm).
3. **Inkast-strip Preview & Hem V3 Genvägar** – Riktig preview på "Senaste" på startsidan, plus 2-klicks genvägar in i modulerna.
4. **Valv Orkester – State-säker Collapsible (A2.4)** – Förhindra att Brusfilter-statet nollställs när containern fälls ihop. (Kritisk buggförebyggande).
5. **Valv Samla – Progressiv Disclosure** – Lägg "Manuell post" och "Drive-hint" bakom en `CalmCollapsible`.
6. **Chameleon Supermodul Transitions** – Sömlösa fade-transitions (300-400ms) vid mode-byten.
7. **Lågmäld Feedback & Dämpad Låsikon** – Byt aggressiva "red dots" mot subtilt glow; dämpa Hänglåsikonen (förbättrad Plausible Deniability).

---

## Förbättrings-Backlog (20 High-Impact / Low-Effort)

Dessa bygger vidare på existerande komponenter utan att äventyra Zero Footprint eller WORM.

1. **Unified "Dagens Sammanfattning" Notifikation:** En kvällssammanfattning av dagsdata.
2. **Auto-Kategorisering av Utgifter:** Återanvänd Gemini-vävaren för att auto-tagga utgifter vid inkast.
3. **Valv-Export Wizard "Quick PDF":** Snabbknapp för att exportera Dossier/Bevis.
4. **"Grey Rock" Träningsläge:** Torr-öva mot fiktiva triggande meddelanden (sandbox, ingen sparning).
5. **Snabb-Logg för Sömn & Fysiologi:** 1-10 slider som appendar `physiology` i journalen.
6. **Widget för "Dagens Fokus":** Visa Dagens P1-task i "Fyren"-widgeten (Plausible deniability).
7. **Barnfokus: Åldersanpassade Frågor:** Stöd `minAge`/`maxAge` i `BARNFOKUS_QUESTIONS`.
8. **Mönster-Highlight i Valvet:** Ren visuell regex-highlighting av trigger-ord i existerande bevis.
9. **Arbetsliv: "Gick hem"-knapp:** Kognitiv avstängning av jobbet.
10. ~~**"Ångra Inkast" (Inom 10 sekunder):** Frontend-timer/debounce före Firestore-sparning.~~ *(REDAN BYGGT)*
11. **Tysta Notiser ("Ghost Mode"):** Visuell dämpning av alla toasts (Plausible deniability).
12. **Sök-autokomplettering i Kunskapsbanken:** Snabbare sök via in-memory indexering.
13. **Sammanfogad "Veckans Puls" Dashboard:** Enkel graf över veckans energi.
14. **Mörkare "Skymningsläge":** Extra låg kontrast i CSS för sena kvällar/migrän.
15. **PIN-kod Timeout Synlig Nedräkning:** Visuell indikator i Valvet på hur länge sessionen är öppen.
16. **"Fäst i toppen" i Hjärtat:** Pinna viktiga insikter i Dagboken.
17. **Export av Ekonomi-historik till CSV:** Enkel nedladdning för bevis eller budgetering.
18. **Kontextuella Andningsövningar:** Exponera 4-7-8 andning (från MåBra) direkt inuti Inkastet/Valvet.
*(Notera: Punkterna för Töm Skallen och Paralys-brytare är lyfta upp till pågående sprint ovan).*
