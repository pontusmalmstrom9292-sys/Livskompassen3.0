# Mabra-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + kodgranskning mot `src/modules/mabra/`.  
Konsoliderad till [`.context/modules/mabra_sidan.md`](../../../.context/modules/mabra_sidan.md).

## 1. Syfte och användarbehov

**Proaktiv rehabiliteringszon** — KBT/ACT-inspirerat självarbete, självmedkänsla och nervsystemsreglering efter allostatisk belastning. För ADHD (F90.0B), GAD och RSD: **kravlöst**, inga streaks, inget misslyckande.

Syfte:

- Vagusnerv-stimulering (4-7-8, grounding) vid hyperarousal
- Reframing / thought record light — bryta people-pleasing och självkritik
- ACT värderingskompass — hitta **egna** kärnvärden
- Återknyta till identitet **inåt** — inte mot ex eller gaslighting

**Strikt skild från:**

- **Speglar** — reaktivt gaslighting-skydd
- **Dagbok** — daglig humörlogg (Lager 1)
- **Hamn** — BIFF/Grey Rock mot ex
- **Verklighetsvalvet** — forensisk bevisbank
- **Kunskapsvalvet** — livsminne/RAG (ingen auto-ingest av Måbra-data)

## 2. Route och ingång

| | |
|---|---|
| **Route** | `/mabra` |
| **AuthGate** | Ja |
| **Kluster** | Hem (`ClusterGrid` — Måbra / Inre kompass) |
| **Dock** | **Inte** i FloatingDock — nås via hem |
| **Stack** | React + Vite ( **inte** Next.js) |

**Planerade broar in:** diskret länk från Dagbok vid låg energi; valfri länk från/till Kvällskompass (`/vardagen`, evening flow). **Ingen** auto-trigger från dagbok i MVP.

## 3. UX-flöde (Progressive Disclosure)

### Idag (kod)

- **MVP klart:** `MabraPage` orchestrerar hub → duration → breathing → complete.
- `SymptomHub` (3 val), `DurationPicker` (1/3/5 min), `BreathingExercise` (4-7-8, offline), `MabraComplete` (länkar Dagbok/Kompasser).
- `saveMabraSession()` → `mabra_sessions` (WORM rules + index i repo; deploy Firestore vid prod).

### Målbild (MVP)

1. **Symptom-hub:** 3–4 stora knappar (t.ex. *Panik/RSD*, *Självkritik*, *Hitta mig* / *Här och nu*).
2. **Ett steg i taget:** max en mening/instruktion per vy; knappar **"Gå vidare"** / **"Avsluta nu"** — undvik **"Avbryt"** (RSD).
3. **Längd:** default **3 min**; valfria **1 / 3 / 5 min**.
4. **Andning (MVP #1):** 4-7-8-cirkel — **offline-first**, lokal CSS/framer-motion, **ingen** nätverksblockering.
5. **Avslut:** mjukt meddelande (*"Du har landat."*) — **ingen** poäng/streak/frö/löv.
6. **Valfritt efter övning:** *"Spara insikt till Dagbok"*; länk *"Gå till kväll?"* → `/vardagen` — **inte** auto check-in Kompasser.

### Planerat (efter MVP)

- Thought record light, reframing, 5-4-3-2-1 grounding
- ACT värderingskompass + `coreValues`
- Akut-ingång under Panik/RSD (skam/undvikande — **inte** röd larm-UI)
- Opt-in AI-coach; Web Speech sv-SE i textövningar
- Guardrail: ex-konflikt i text → föreslå **Speglar**, inte bearbeta här

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md) — **låst 2026-05-21**.

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta / glass | `#0f172a` + blur |
| Rubriker / aktiv | `#FDE68A` (guld) |
| Fortsätt / knappar | `#818CF8` (indigo) |
| Klar / bekräftelse | `#2DD4BF` (emerald) |
| AI-coach bubblor | `#6366F1` (samma som Speglar AI) |
| Typografi | Outfit + Inter |

**Förbjudet:** skogsgrön palett, lila (utöver indigo), turkos, regnbåge, **naturteman** (frö/löv/skott), streak/count-up, gamification.

Animationer: långsamma (framer-motion finns i projektet) — andningscirkel, inga blinkande element.

## 5. Datamodell (Firestore)

**Beslut:** metadata sparas; känslig fritext **inte** som default.

### Collection: `mabra_sessions`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs |
| `userId` | string | Spegel vid create |
| `exerciseType` | string | t.ex. `breathing`, `reframing`, `act_values`, `grounding` |
| `durationSeconds` | number? | |
| `completedAt` | timestamp | server-side |

**Inte default:** `notes` / reflektion — endast om användaren trycker *"Spara insikt"* (→ Dagbok eller opt-in fält).

### Collection: `mabra_progress` (planerat)

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Ett doc per user eller append — TBD vid implementation |
| `coreValues` | string[]? | ACT värderingskompass |
| `updatedAt` | timestamp? | |

**Inte MVP:** streak, weekly counts, RAG-index.

Rules (planerat): `ownerId == auth.uid`; append/create only för sessions.

## 6. Backend och agenter

| Path | Roll |
|------|------|
| Klient övningar | Deterministiska (andning, grounding) — **ingen** LLM krävs för MVP |
| Planerad callable | Måbra-coach — Gemini via `functions/src/agents/` + `sharedRules.ts` |
| **Inte** | OpenAI/Anthropic; **inte** Kunskap `knowledgeVaultQuery`; **inte** proaktiv dagbok-läsning MVP |

**Coach-ton:** validerande, lågaffektiv, max 2–4 meningar, **ingen JADE**. Opt-in — tyst default; valfri *"Hjälp mig välja"*.

**Paralys/prokrastinering:** primärt **Kompasser** + Paralys-Brytaren (backend); Måbra får valfri länk *"Fastnat?"*.

## 7. Säkerhet

| Kontroll | Status |
|----------|--------|
| AuthGate | **done** |
| Isolering från Hamn/Valv dataflöde | **arkitektur** |
| Känslig fritext i RAM / "Glöm detta" | **planned** |
| Unmount cleanup osparad input | **planned** |
| Kill Switch global (`useShakeToKill`) | **done** (app-wide) |
| Ingen RAG-export till Kunskap | **beslut §14** |
| CMEK | **planned** (drift) |

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Route `/mabra` + AuthGate | **done** |
| `MabraPage` orchestrator (hub → duration → breathing → complete) | **done** |
| Kluster hem (`ClusterGrid`) | **done** |
| Symptom-hub (3 val) | **done** |
| 4-7-8 andning (offline) | **done** |
| `mabra_sessions` Firestore + rules/index | **done** (repo; deploy Firestore för prod) |
| Complete + länk Dagbok / Kompasser | **done** |
| `mabra_progress` / coreValues | **planned** |
| Måbra-coach callable | **planned** (fas 2) |
| Web Speech sv-SE | **planned** (återanvänd `useSpeechToText`) |
| Bro Dagbok in (låg energi) | **planned** |
| Guardrail → Speglar vid ex-text | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | AuthGate på `/mabra` | **done** |
| 2 | Max ett aktivt val/instruktion per vy (MVP övning) | **done** |
| 3 | Andning startbar utan nätverk | **done** |
| 4 | Ingen streak/count-up UI | **done** (designregel) |
| 5 | Obsidian Calm tokens — ingen förbjuden palett | **done** |
| 6 | `mabra_sessions` metadata vid completed | **done** |
| 7 | Fritext rensas vid unmount om ej sparad | **planned** |
| 8 | AI-coach opt-in; `#6366F1` bubblor | **planned** |
| 9 | Valfri "Spara insikt till Dagbok" | **planned** |
| 10 | Tydlig copy-skillnad mot Speglar | **planned** |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Dagbok** | Valfri bro in (låg energi) + *Spara insikt* ut — **inte** auto |
| **Kompasser** | Länk till kväll efter övning — **inte** auto check-in |
| **Speglar** | Guardrail vid ex/gaslighting-innehåll i input |
| **Hamn / Valv** | **Ingen** datakoppling |
| **Kunskap** | **Ingen** RAG på `mabra_*` |
| **Paralys-Brytaren** | Kompasser/backend — inte duplicera i Måbra |

## 11. Navigation

- **Hem:** kluster **Måbra** (Sparkles, lavender tone)
- **Direkt:** `/mabra`
- **Ej:** FloatingDock

## 12. Tidigare diskussioner att bevara (vision)

- **People-pleasing / 27 års anpassning** — hitta egna åsikter och värderingar
- **Vagus före djup ACT** vid panik/RSD
- **Kognitiv trötthet** — modulen får aldrig kännas som läxa
- **Frizon:** läkning (Måbra) ≠ försvar (Valv/Speglar/Hamn)
- **Coach = second brain** när exekutiv funktion brister — inte fixa/bota
- **Grey Rock mot ex** tillhör **Hamn** — redan implementerat där
- **IFS/grounding, gränser, mindfulness** — planerat innehåll

## 13. Avvisade eller alternativa idéer

- **Next.js / OpenAI primary** — avvisat; Vite + Gemini/Vertex
- **Chatbot som primärt UI** — avvisat; symptom-hub + guidade steg
- **Nordisk Skymning skogsgrön** — avvisat; Obsidian Calm låst
- **Gamification:** frö/löv/stjärna/streak — avvisat MVP
- **"X övningar denna vecka"** — avvisat MVP
- **Proaktiv AI från dagbok** — avvisat MVP
- **Måbra → Kunskap Vector Search** — avvisat (cross-contamination)
- **Auto check-in Kvällskompass** — avvisat MVP
- **100% Zero Footprint** — avvisat; metadata `mabra_sessions` sparas
- **Integration mot ex/BIFF** — avvisat; Hamn modul

## 14. Öppna produktbeslut (låsta 2026-05)

| # | Fråga | Beslut | Låst |
|---|-------|--------|------|
| 1 | Sparande | **`mabra_sessions` metadata ON**; fritext RAM eller opt-in *Spara insikt* | **Ja** |
| 2 | Övningslängd | Default **3 min**; valfria **1 / 3 / 5 min** | **Ja** |
| 3 | AI-coach | **Manuellt / opt-in** — inte proaktiv från dagbok MVP | **Ja** |
| 4 | Dagbok | Valfri knapp **"Spara insikt till Dagbok"** — inte auto | **Ja** |
| 5 | Gamification | Mjukt avslut only — **ingen** streak/frö/veckoräknare MVP | **Ja** |
| 6 | Design | **Obsidian Calm** — inte skogsgrön/natur | **Ja** |
| 7 | Hub | **Symptom först** (Panik/RSD, Självkritik, Hitta mig) | **Ja** |
| 8 | Kunskap RAG | **Nej** — isolerad datasilo | **Ja** |
| 9 | Kompasser | **Länk** efter övning — inte auto check-in | **Ja** |
| 10 | Prokrastinering | **Kompasser** primärt; Måbra länk valfritt | **Ja** |
| 11 | AI-accent | **`#6366F1`** coach; **`#818CF8`** knappar | **Ja** |
| 12 | Röst | Opt-in **Web Speech sv-SE** i textövningar | **Ja** |
| 13 | Ex-konflikt i text | Föreslå **Speglar** — inte bearbeta i Måbra | **Ja** |
| 14 | Andning | **Offline-first** lokal animation | **Ja** |

---

**Module plan (kod):** [`src/modules/mabra/module_plan.md`](../../../src/modules/mabra/module_plan.md)  
**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)  
**Kladd-routing:** [`docs/specs/ai-prompts-kladd-kampspar.md`](../ai-prompts-kladd-kampspar.md)
