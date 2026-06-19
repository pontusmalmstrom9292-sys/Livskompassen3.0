# Deep Research — Diskret näringsintag (M3.0-C+)

**Datum:** 2026-06-19 · **Status:** Godkänd för implementation (Pontus-brief)  
**Zon:** Vardagen → MåBra → Näring & vätska  
**Kanon:** [`docs/specs/modules/NARING-INTAG-SPEC.md`](../specs/modules/NARING-INTAG-SPEC.md)

---

## 1. Användarbehov (Pontus)

| Behov | Prioritet | Ton |
|-------|-----------|-----|
| Snabbt logga mat/dryck | P0 | &lt;10 sek, ingen skuld |
| Påminnelse vid dåligt val | P0 | Lågaffektiv, ingen röd alarm |
| Komma ihåg att äta rätt | P0 | Nudging, inte regler |
| Analys över tid | P1 | Dold tills aktiverad i inställningar |
| Dieter, vägning, makron | P2 | **Av** från start — opt-in i inställningar |

**Ej mål:** Kaloriräkning, streak/XP, moraliska etiketter ("dålig människa"), export till Valv.

---

## 2. Benchmark — wellness-appar (2025–2026)

| App | Kärnidé | Relevant för Livskompassen |
|-----|---------|---------------------------|
| [Melia](https://getmelia.com/) | Intuitiv ätning — hunger/mättnad/mood, AI-reflektion utan kalorier | **Ja** — känslomässig check-in, anti-diet |
| [Ridma](https://ridma.app/) | Rytm (när), inte vad; on-device; noll kalorier | **Ja** — diskret, låg friktion |
| [AteMate](https://www.atemate.com/) | Foto + reflektionsfrågor, måltidspåminnelser | Delvis — påminnelser; foto defer |
| [Eated](https://eated.io/) | Harvard Plate, habit builder, veckomönster | **Ja** — mönster över tid, inte våg från start |
| [Peace With Food](https://apps.apple.com/) | Hunger/fullness-skala, schemalagda notiser | **Ja** — skala utan skam |

### Gemensamma mönster (evidence-based UX)

1. **Sekunder att logga** — fri text eller en-tap, inte databas-sök.
2. **Ingen "bra/dålig person"** — energi/kroppssignal, inte moral.
3. **Progressive disclosure** — avancerat (makron, våg) bakom inställningar.
4. **Lokal/minimal data** — särskilt för känslig hälsa (Ridma on-device; vi: lokal + valfri molnsynk av dagssummering).
5. **Compassionate coaching** — AI som spegel, inte domare (Melia).

### Vad vi medvetet skippar (kostnad + kognitiv belastning)

- Barcode/OCR-matdatabas (dyrt, API-träsk)
- Foto-ML-plattanalys (Eated) — defer
- Push-notiser server-side — defer; in-app mjuka nudges först
- Gmail/kalender-koppling

---

## 3. Arkitekturbeslut

### 3.1 Placering

- **UI:** befintlig `MabraNutritionPanel` (`/vardagen?tab=mabra` → verktyg `nutrition`)
- **Inställningar:** ny flik `/installningar?tab=naring`
- **Data:** intagsrader **lokalt** (`localStorage`) — undviker Fas 22.3 PMIR-block på `firestore.rules` tills `intakeEntries` godkänns
- **Molnsynk:** befintlig `mabra_nutrition_log` behåller dagssummering (vatten, protein-markering) — oförändrat

### 3.2 Progressiva nivåer (låsta i spec)

| Nivå | Flagga (lokal pref) | Default | Innehåll |
|------|---------------------|---------|----------|
| **Kärna** | — | på | Snabb logg mat/dryck + mjuka nudges |
| **Trend** | `trendView` | av | 7-dagars översikt bra/ok/dålig |
| **Analys** | `detailedAnalysis` | av | Måltidsrytm, enkla mönster |
| **Avancerat** | `macroTracking` | av | Makron, våg, dietmallar (stub — UI låst tills Fas 22.3+) |

### 3.3 Nudging (deterministisk, ej LLM)

- Senaste logg `quality=poor` → ett kort tips (vatten + protein), ingen upprepning samma dag
- Efter kl 14 utan måltid idag → mild fråga "Har du ätit något litet?"
- ≥3 `poor` på 7 dagar → veckoreflektion (endast om `trendView` på)

### 3.4 Silo-gränser

- **Ej** `reality_vault`, **ej** cross-RAG, **ej** barnlogg
- Nutrition-coach (befintlig callable) förblir REFLECTION — ex/konflikt → Speglar-guard

---

## 4. Rekommendation

**Implementera Kärna + Trend + inställningspanel nu.** Avancerat (makron/våg) = toggle + "kommer snart"-lås. Firestore-utökning för `intakeEntries[]` → separat PMIR (Fas 22.3).

**Nästa steg efter godkännande:** smoke PASS → hosting deploy.
