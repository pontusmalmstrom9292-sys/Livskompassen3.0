# Prompt 4 — Barnen/Familjen som skyddad modul

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Produktstrateg · säkerhetsarkitekt · integritetsdesign

---

## Nuläge (kort)

**Route:** `/familjen` — Barnfokus, Livslogg, Fysiologi, Vardagsstruktur, Inkast, Trygg Hamn (BIFF separat tab).

**FamiljenInputSuperModule** — sex lägen (`familjenInputModes.ts`):

| Läge | WORM | Valv HITL |
|------|------|-----------|
| Barnfokus (PLAY) | ✅ | ❌ |
| Ny stund | ✅ | ❌ |
| Fysiologi 1–5 | ✅ | ❌ |
| Livslogg observation | ✅ | ✅ (`SaveAsEvidencePrompt`) |
| Vardagsstruktur | ✅ | ❌ |
| Inkast | review | ❌ |

**Barnporten:** QR-pairing, inkorg → Valv (§7b HITL), BarnportenOrkester, widgets CB1–CB4, `visibility`/`audience: child` — **aldrig auto-promote**.

**Analys:** `ChildrenLogsChat` → `childrenLogsQuery` (barnen-silo only) · `BalansMatare` 7-dagars neutral aggregering · `exportBalansReport` · epistemic `[citat]/[tolkning]` (`childObservationEpistemics.ts`).

**Dossier:** `FamiljenReflektionTab` länkar `?sources=children_logs&child=` — wizard stödjer `children_logs` som källa.

---

## 12 nya funktioner / modulutbyggnader

### 1. Livslogg tidslinje per barn

| Fält | Innehåll |
|------|----------|
| **Nytta** | Överblick utan "feed" — datumaxel med stunder, fysiologi, observationer |
| **Användare/situation** | Förälder inför möte med BUP/skola; behöver hitta "den veckan" |
| **Datamodell** | Ingen ny collection — read `children_logs` grupperat på `childAlias` + `createdAt` |
| **Säkerhet/etik** | Låg — undvik ranking/sortering efter "problem" |
| **Rekommendation** | **Bygg** |

---

### 2. Epistemic badges i hela livslogg-UI

| Fält | Innehåll |
|------|----------|
| **Nytta** | Tydlig skillnad citat vs tolkning i lista, export och chat-citat |
| **Användare/situation** | Soc/advokat-läsning; förälder som vill vara korrekt |
| **Datamodell** | Befintligt `observation`-prefix; ev. derived UI-fält endast |
| **Säkerhet/etik** | Låg — stärker WORM-kvalitet |
| **Rekommendation** | **Bygg** (utöka `smoke:barn-epistemik`) |

---

### 3. Dossier-snabbstart från Familjen

| Fält | Innehåll |
|------|----------|
| **Nytta** | "Skapa dossier för Kasper, senaste 90 dagar, endast barnloggar" — ett steg |
| **Användare/situation** | Vårdnadskonflikt; behöver neutral barn-dokumentation |
| **Datamodell** | Deep link till befintlig Dossier wizard; `includedDocIds.children_logs` |
| **Säkerhet/etik** | Medel — kräver Valv PIN; varning att journal default av |
| **Rekommendation** | **Bygg** (UI-länk; ingen ny WORM) |

---

### 4. Fysiologi trend (7/30 dagar)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Se sömn/ångest/aptit över tid — mönster, inte dom |
| **Användare/situation** | Barn som mår ojämnt mellan hus; förälder trött på att minnas |
| **Datamodell** | Befintliga `signals` på `children_logs`; ev. read-only aggregate cache (mutable OK) |
| **Säkerhet/etik** | Medel — måste **inte** bli "barnbetyg" eller röd/grön dom |
| **Rekommendation** | **Bygg** (neutral copy som Balansmätare) |

---

### 5. Barnporten åldersladder (CB1→CB4)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Barnets UI växer med `currentBracket` från evolution_hub |
| **Användare/situation** | Kasper 6 år vs tonår — samma hamn, olika verktyg |
| **Datamodell** | `evolution_hub` bracket redan kanon; Barnporten widget variants |
| **Säkerhet/etik** | Medel — child UX får inte exponera Valv/BIFF |
| **Rekommendation** | **Bygg** (efter Barnporten av-paus) |

---

### 6. Barnporten synlighetsnivåer (child privacy)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Barn väljer "bara för mig" vs "får förälder läsa" — high privacy default |
| **Användare/situation** | Tonår som behöver ventilera utan att allt blir bevis |
| **Datamodell** | Ev. utökad `visibility`/`audience` på `children_logs` (append-only ny post, inte mutation) |
| **Säkerhet/etik** | Hög — fel design = övervakningskänsla; default privat |
| **Rekommendation** | **Vänta** (PMIR + barnporten-spec; juridisk/etisk review) |

---

### 7. Mikrosteg-livslogg (lågenergi)

| Fält | Innehåll |
|------|----------|
| **Nytta** | En rad + barn + spara — skip påverkan-fält |
| **Användare/situation** | ADHD-förälder efter hämtning; dissociation |
| **Datamodell** | Samma `children_logs`; färre required fields i UI |
| **Säkerhet/etik** | Låg |
| **Rekommendation** | **Bygg** |

---

### 8. Positiva minnesankare (utökad)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Fästa glädje-/stund-poster separat från "tung" logg |
| **Användare/situation** | Motverka negativitetsspiral i konflikt; stärka relationen |
| **Datamodell** | Ev. `isPinned` eller `anchor: true` på nya poster (forward-only keys, PMIR om schema-lås) |
| **Säkerhet/etik** | Låg — PLAY/EVIDENCE redan separerat |
| **Rekommendation** | **Bygg** (liten utökning av `PositivaMinnesankare`) |

---

### 9. Balans-/stabilitetsexport v2 (PDF)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Neutral 7-dagarsrapport för ombud — utöver JSON (`exportBalansReport`) |
| **Användare/situation** | Soc samtal; "hur mår barnet hos mig vs där" utan anklagelser |
| **Datamodell** | Read-only export; inga nya writes |
| **Säkerhet/etik** | Medel — copy måste säga "inte diagnos" |
| **Rekommendation** | **Bygg** (PDF paritet med dossier print) |

---

### 10. Veckosammanfattning livslogg (opt-in)

| Fält | Innehåll |
|------|----------|
| **Nytta** | 3 neutrala bullets per barn — "denna vecka loggades X stunder" |
| **Användare/situation** | Förälder som glömmer att titta tillbaka |
| **Datamodell** | Callable read-only aggregate; ingen ny WORM |
| **Säkerhet/etik** | Medel — får inte skicka push med skuld; opt-in |
| **Rekommendation** | **Vänta** (efter core UX stabil) |

---

### 11. Kunskap FACT-bro (bh-* i Familjen)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Kuraterade kort om barn i HCF — separat från livslogg-RAG |
| **Användare/situation** | Förälder behöver fakta om triangulering/alienation — inte AI-gissning |
| **Datamodell** | `kb_docs`/`kampspar` bh-* seeds; **ingen** cross-read till `children_logs` i samma svar |
| **Säkerhet/etik** | Medel — silo-gräns; FACT-only via dirigent |
| **Rekommendation** | **Bygg** (`FamiljenKunskapHubTab` + innehållsvåg) |

---

### 12. Offline optimistic spar (Barnfokus/Livslogg)

| Fält | Innehåll |
|------|----------|
| **Nytta** | Direkt feedback; sync när nät finns |
| **Användare/situation** | Dålig täckning vid hämtning/skola |
| **Datamodell** | Lokal kö + `offlineWritePolicy`; WORM vid server confirm |
| **Säkerhet/etik** | Medel — rensa kö vid panic; barn-data krypterad lokalt |
| **Rekommendation** | **Vänta** (efter inkast offline-mönster i våg 3) |

---

## 5 förbättringar av nuvarande flöden

### F1. SaveAsEvidencePrompt — tydligare tvåsteg

**Nytta:** Förälder förstår skillnad livslogg vs bevis före `WormSaveConfirmSheet`.  
**Situation:** Livslogg observation med känslig text.  
**Datamodell:** Ingen.  
**Risk:** Låg.  
**Rekommendation:** **Bygg** — visa kort neutral preview + `sourceRef`-förklaring.

---

### F2. Barnporten Inkorg — filtrera per barn + dismiss

**Nytta:** `BarnportenInboxPanel` hanterbar när många poster.  
**Situation:** Två barn, olika inkorg.  
**Datamodell:** Client filter på `childAlias`.  
**Risk:** Låg.  
**Rekommendation:** **Bygg**.

---

### F3. ChildrenLogsChat — epistemic badge på citat

**Nytta:** AI-svar visar om källan var citat eller tolkning.  
**Situation:** "Vad sa Kasper om skolan?"  
**Datamodell:** Parse prefix i citation renderer.  
**Risk:** Medel (AI kan sammanfatta fel — citat måste quote exakt).  
**Rekommendation:** **Bygg** + begränsa parafras.

---

### F4. Barnfokus optimistic save + minneslista

**Nytta:** Locked UX §12 — direkt feedback efter spar (redan kanon).  
**Situation:** Barnfokus med barn närvarande.  
**Datamodell:** Ingen.  
**Risk:** Låg.  
**Rekommendation:** **Bygg** (om inte redan fullt implementerat).

---

### F5. Balansmätare + export — en knapp "Exportera neutral rapport"

**Nytta:** Koppla `BalansMatare` till `exportBalansReport` / print.  
**Situation:** Inför samtal med samordnare.  
**Datamodell:** Read-only.  
**Risk:** Låg om copy neutral.  
**Rekommendation:** **Bygg**.

---

## 5 riskabla idéer att undvika

| # | Idé | Varför undvika | Rekommendation |
|---|-----|----------------|----------------|
| R1 | **Auto-promote barnlogg → Valv** | Bryter HITL, Barnporten-kanon, relation till barn | **Undvik** |
| R2 | **Beteende-poäng / "barnindex" / röd-grön dom** | Övervakningskänsla; juridiskt gift i konflikt | **Undvik** |
| R3 | **AI-profilering av barnets personlighet/diagnos** | Etiskt oacceptabelt; oansvarig inferens | **Undvik** |
| R4 | **Cross-RAG barnen ↔ Valv i samma chat** | Bryter U1; läckage risk | **Undvik** |
| R5 | **Delad familj-vy synlig för motpart/ex** | Integritetsbrott; motsats till high privacy | **Undvik** |

---

## Framtida vision (6–12 månader)

**Barnen-modulen** ska vara **"Den trygga hamnens loggbok"** — inte en övervakningsapp.

**Målbild:**

1. **Dokumentation:** Förälder loggar neutralt (citat/tolkning) med mikrosteg vid låg energi; fysiologi och stunder ger tidslinje utan dom.
2. **Barnets röst:** Barnporten aktiv med åldersanpassad widget — barn äger sin synlighet; inget når Valv utan förälder HITL.
3. **Analys utan skrämsel:** `childrenLogsQuery` + epistemic UI hjälper *minnas mönster*, inte döma barn. Kunskap FACT (bh-*) ger kontext separat.
4. **Export när det behövs:** Dossier och balans-PDF med `children_logs` som valbar källa — alltid bakom Valv PIN, alltid manuellt valda poster.
5. **Ingen silo-läckage:** Barnfokus förblir PLAY; BIFF/Hamn förblir vuxen zon; Valv förblir explicit bevis.

**Prioriterad ordning:**

| Fas | Leverans |
|-----|----------|
| **M1–3** | Epistemic badges, mikrosteg livslogg, SaveAsEvidencePrompt UX, Barnporten inkorg filter, optimistic barnfokus |
| **M4–6** | Tidslinje, fysiologi trend, dossier-snabbstart, Balans PDF, Kunskap bh-bro |
| **M7–12** | Barnporten åldersladder + ev. synlighetsnivåer (PMIR), offline kö, opt-in veckosammanfattning |

**Framgångsmått (icke-gamifierade):** Andel poster med korrekt epistemic prefix · HITL-promote rate (medvetet låg) · tid till sparad observation · zero cross-silo incidents i smoke.

---

## Invariants (alltid)

- `children_logs` WORM append-only
- Barnen-silo RAG only i `childrenLogsQuery`
- `SaveAsEvidencePrompt` + `WormSaveConfirmSheet` för Valv — aldrig auto
- Barnporten `audience: child` → aldrig auto-promote
- Beteende + datum — aldrig diagnos på barn eller motpart
- Locked UX: `BARNFOKUS_QUESTIONS`, `FamiljenBarnfokusDelegate`, Barnporten HITL-design
