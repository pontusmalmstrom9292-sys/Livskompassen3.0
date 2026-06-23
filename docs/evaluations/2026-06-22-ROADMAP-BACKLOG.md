# Konsoliderad Roadmap & Backlog (Juni 2026)

**Sammanställning av AI-diskussioner och prioriteringar (2026-06-22)**
*Denna fil sammanfattar insikterna från diskussionerna kring prioriteringar, optimering, sprintplanering och den pragmatiska roadmapen.*

---

## 1. Top 3 Högsta Prioritet (Nästa actions)
Dessa uppgifter balanserar låg risk med extremt användarvärde och strikt WORM-efterlevnad.

1. **Deploy & Verifiering av Ingest Våg 1**
   - Måste driftsättas eftersom koden blockerar pipelinen på `main`.
2. **Dossier BBIC `reportType` (Socialtjänst-anpassad export)**
   - Utnyttjar Valvets WORM-data till max för myndighetsbevis. Högt värde, ingen arkitekturrisk.
3. **Projekt P1 & Life OS kopplingar (Kanban & Rutiner)**
   - Om tid finns: Adderar stort värde i Vardagen via färdiga superhubbar utan att röra tunga säkerhetskomponenter.

*(Undvik omedelbart: Data Connect SQL Migration och Drogfrihet Supermodul - dessa är massiva, riskfyllda projekt som kräver PMIR-planering).*

---

## 2. Nästa Sprint (UI/UX och Stabilitet)
Fokus på basplattan, navigeringen och "The Silent Wins". Kan köras parallellt:

- **Delade Design Tokens:** Sätter grunden för konsekvent utseende (hörnradie 8-14px) över Familjen, Ekonomi och Arbetsliv. Minskar CSS-skuld.
- **Hem Layout A (Mobil) & Inkast-strip Preview:** Högst synlighet.
- **Valv Orkester (State-säker Collapsible) & Valv Samla:** Progressiv disclosure och städar upp UI. Koda sekventiellt för att undvika state-resets.
- **Lågmäld Feedback & Dämpad Låsikon:** Sista touchen för Clean Input.
- **Chameleon Supermodul (Transitions):** Om tid finns, mjuka övergångar.

---

## 3. Pragmatisk 4-veckors plan

**Vecka 1: Stabilitet & Prestanda (The Silent Wins)**
- Städa bort hårdkodade hex-färger i de 16 feature-filerna.
- Sätt upp Vite lazy-loading för `/valvet` och `/familjen` (bundle splitting).
- Expandera `typecheck:core-strict` över `features/` och åtgärda linting-varningar.

**Vecka 2: Konsolidering & UI Polish**
- Slå ihop `/oversikt` och `/dashboard` (rensa den redundanta routen).
- Radera gamla inmatningskomponenter som ersattes av Superhubbarna (Fas 6-11).
- View Transitions / CSS-övergångar i Superhubbarna (MåBra och Dagbok).

**Vecka 3: Säkerhet & Fysisk Verifiering (No-code week)**
- Firebase Console: App Check till "Enforce".
- Manuella Motorola-tester: Valv (#3), Barnporten (#4) och Native Google Auth.
- Fullständig offline-test av Familjens inmatning på telefonen.

**Vecka 4: Tyst Värdeskapande (Backend/Data)**
- Kör batch-ingest för Kunskapsvalvet (Våg 8 / FACT).
- Utvärdera befintliga `routineTemplates` och `materialPacks` för nya Superhub-lägen.

---

## 4. "Low-Effort, High-Impact" Förbättringar (Små fixar)
Saker att plocka när det finns dödtid (kräver minimal kodning):
- **Vänliga "Empty States":** Returnera mjuka textsträngar ("Det är tryggt och tomt här...") istället för null i listvyer.
- **Pull-to-refresh för PWA (Swipe-down):** Lös med `overscroll-behavior-y: contain` och simpel fetch.
- **Teckenräknare i Inkast och Reflektion:** Smidigt för myndighetskrav (`text.length` tecken), ger känsla av progression.
