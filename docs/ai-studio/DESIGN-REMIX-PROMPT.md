# AI Studio — Design remix (Livskompassen v2)

**Bifoga:** `exports/ai-studio/repomix-design-full.md` (generera med `npm run design:pack`)

---

## 1. Modell (välj i listan)

| Uppgift | Modell |
|--------|--------|
| **Första körningen — helhets-remix** | **Gemini 3.1 Pro Preview** |
| Snabba följdfrågor / en komponent | Gemini 3.5 Flash |
| Billigare utkast | Gemini 3.1 Flash Lite |

**Välj Pro Preview** tills du har en tydlig designlinje. Byt till Flash när du bara finjusterar header, dock eller en flik.

**Temperature:** 0,3–0,4

---

## 2. Ordning i AI Studio

1. **Ladda upp** `repomix-design-full.md`
2. **Systeminstruktioner** — kort roll + regler (nedan) — *inte* hela uppdraget
3. **Första chattmeddelandet** — hela briefen (nedan) + output-format

---

## 3. Systeminstruktioner (klistra här — kort)

```
Du är senior UI/UX-designer för Livskompassen v2 (Obsidian Calm).

Bifogat repomix = designkanon, CSS/Tailwind, tema, chrome (header, dock, drawer, Fyren) och modul-UI.

MUST: mörk skifferbas + dämpat guld + indigo sekundär. 3 zoner (/dagbok, /vardagen, /familjen). Låsta ikoner D1 LivskompassMark och M2 KompisMark. Låst UX (Barnfokus, Valv-flikar, Planering Kanban, Barnporten HITL). Cinzel för zontitlar, Inter/Outfit för bröd. Ett steg i taget — ingen gamification i MåBra.

Svara på svenska. Inga backend-/Firestore-förslag. Ge konkreta tokens (CSS-variabler), rem-mått och komponentnamn från repomix — inte vaga moodboards.
```

---

## 4. Första chattmeddelandet (klistra som första prompt)

```
Jag är vilsen i layouten för hela appen.

Repomixen visar att vi har många delar som inte känns som samma produkt: dock, sidomeny, header, Fyren, zontitlar, flikar, moduler, sidor, knappar och ikoner krockar i skala, form och hierarki. Jag vill ha EN sammanhållen visuell linje där allt hänger ihop — inte fler varianter.

Analysera bifogad repomix och föreslå en sammanhållen design-remix som:

- Behåller trygghet, struktur och låg kognitiv belastning (ADHD/GAD-vänligt)
- Enar chrome: header (meny, lås, Kompis), dock-zoner, drawer, Fyren — samma geometri, hörnradie och knappstorlek
- Enar moduler och flikar så sidor i Hem, Vardagen, Familjen och Valv känns som samma app
- Enar ikoner och knappar till ett system (inte blandade stilar)
- Dokumenterar tokens (CSS-variabler + Tailwind-semantik) — inte random hex i komponenter

Output (i denna ordning):

1. Nuläge — 3–5 punkter: vad fungerar / vad krockar
2. Design tokens — tabell: token, värde, användning
3. Chrome-spec — header, dock, drawer, Fyren (mått i rem, en rad vardera)
4. Zon per zon — Hem, Vardagen, Familjen, Valv: rubrik + 2 konkreta UI-förslag
5. Prioriterad roadmap — max 5 steg, P1 först

Börja med punkt 1 och 2. Vänta på mitt OK innan du går vidare till 3–5.
```

---

## 5. Följdfrågor (efter första svaret)

- *"P1: Ge mig exakt chrome-spec för header + dock — rem, border, radius, färgtokens."*
- *"Skriv om endast `design-packs.css` + relevanta Tailwind-klasser enligt din remix."*
- *"Jämför mockup-skin vs icke-mockup — var ska vi slå ihop till en linje?"*
- *"Lista vilka ikon-set vi ska behålla vs ersätta (utom D1/M2)."*
