# Livskompassen 3.0 — Projektminne & Arkitektur (Knowledge File)

Ladda ner detta dokument och ladda upp det som en **Knowledge File** i din nya Gem.

---

## 1. Vision & Syfte
**Livskompassen 3.0 (Den Trygga Hamnen)** är ett privat Life OS. Matematisk målbild är att minimera den ovidkommande kognitiva belastningen ($L_{\text{extraneous}} \to 0$) för att maximera sannolikheten att användaren agerar ($P_{\text{initiation}} = 1 / (1 + e^{F-E})$ där F är friktion och E är energi).

## 2. De Fyra Supermodulerna
All interaktion i appen är konsoliderad till:
1. **Fyren (Ambient OS):** Tyst statusindikator i sidhuvudet. Ändrar gränssnittets känslighet baserat på tre tillstånd (Låg, Medel, Hög kapacitet).
2. **Hjärtat (Supermodul 1):** Landningssidan. Visar "Vad behöver jag just nu?" och ett mikrosteg med en stor direkt [ Gör nu ]-knapp. Inga oändliga listor.
3. **Familjen (Supermodul 2):** Fokus på relationer. Kapslar in inmatning (Barnfokus m.m.) i ett minimalistiskt skal utan administrativ känsla.
4. **Vardagen (Supermodul 3):** Den operativa motorn för planering, rutiner och kalender. Helt dold routing för minskad kognitiv belastning.
5. **Valvet (Supermodul 4):** PIN-låst skyddszon. Delas in i Valvet, Mönster, Orkester, Kunskapsbank, och Aktörskarta.

## 3. Data & Säkerhetslagar
- **WORM-säkerhet:** `reality_vault`, `children_logs`, `journal`. Append-only. Aldrig update eller delete på klientenheten. Skydd mot impulsradering.
- **Silor:** Tre strikta databassilor: Kunskap, Valvet, Barnen. AI-agenter får ALDRIG göra cross-RAG mellan dessa.

## 4. Utvecklingsstrategi (Backend vs Flow)
- Applikationens **kodbas-backend är låst** (Code Freeze på Node.js Cloud Functions). 
- **Nya verktyg:** AI-tunga verktyg som "Brusfiltret" eller "Dossier-Generatorn" utvecklas och orkestreras istället externt via **Google Flow / Vertex AI**. 
- Geminis uppgift är att skräddarsy exakta promptkedjor, systembeslut och nod-grafer som kan klickas ihop i Google Flow, för att sedan exponeras till appens frontend via en enkel Callable Endpoint.

## 5. Designspråk (Obsidian Calm)
- Inga aggressiva varningar, inga streck/XP, inget tävlande.
- Mjuka Tailwind-tokens: `bg-surface`, `text-accent`, `border-border`.
- Stora tryckytor (minst 44x44px). Vänsterställd text. Generös radhöjd.
