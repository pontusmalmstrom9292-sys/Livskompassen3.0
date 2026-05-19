# Visuell Estetik och Designspråk

Användargränssnittet för Livskompassen v2 ska spegla en levande, trygg och avancerad upplevelse.

## Centrala Element
- **Kompis Avatar:** Agentens fysiska form på skärmen.
    - *Viloläge:* En pulserande aura.
    - *Aktivt läge:* Definierad struktur (geometrisk stjärna/kompassros) när den processar data.
- **Tidshjulet:** En interaktiv, flerlagrad kompassnål och tidslinje för navigering genom tid och "Kampspår". Prediktiva analyser framhävs med visuella pulseringar.
- **Sub-Synaptisk Bakgrund:** Visuell representation av nätverket (neuralt nätverk, gyllene trådar) implementerat via WebGL/Canvas för hög prestanda utan att tynga UI.

## Styling (Tailwind CSS)
- **Färgpalett:** Fokuserar på guld- och blåtoner.
- Måste kännas modern, "alive" och polerad med konsekvent spacing, typografi och interaktiv feedback.
- Undvik tunga, prestandakrävande DOM-manipulationer för bakgrundsanimationer; använd WebGL/Canvas (`SubSynapticBackground.tsx`) enligt arkitekturen.
