# Stadguide — Livskompassen 3.0 (enkel svenska)

**Datum:** 2026-05-24  
**Typ:** Planeringsrapport — **ingen kod ändrad**  
**Källa:** Kod, smoke-tester och kanoniska docs i `Livskompassen3.0`

**Ord du kan möta:**
- **Firestore** = Googles databas (loggar, valv, kunskap).
- **Silo** = tre separata minnesytor som AI **inte** får blanda.
- **WORM** = data som inte ska tyst ändras eller raderas (bevis).
- **Smoke** = snabba tester i terminalen som visar att kärnan fungerar.

---

## 1. 🛡️ AKTIV STATUS (Livskompassen 3.0)

### Var sanningen bor

| Vad | Var |
|-----|-----|
| Aktiv kod | `~/StudioProjects/Livskompassen3.0/` |
| GitHub (push hit) | https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0 |
| Gren | `main` (en trunk) |
| Firebase-projekt | `gen-lang-client-0481875058` |
| Live app | https://gen-lang-client-0481875058.web.app |

### Fas just nu

**Fas 4 — verifiering och polish.**  
Arkiv-GAP G1–G16 är **klara i kod**. Det som återstår är mest **manuella tester** i webbläsaren och några produktval (t.ex. Barnporten PWA).

---

### Flikar och sidor som fungerar bäst

#### Sidomeny (hamburger)

| Flik | Route | Status |
|------|-------|--------|
| Hem Kompass | `/` | **Aktiv** — hero, check-in, minneskort |
| Familjen | `/familjen` | **Aktiv** — barnfokus, livslogg, 5 flikar |
| Trygg hamn | `/hamn` | **Aktiv** — BIFF / Grey Rock |
| Valv | `/valvet` | **Aktiv** — bevis, Mönster, Orkester |
| Planering | `/planering` | **Aktiv** — Kanban (ATT GÖRA / VÄNTAR / KLART) |
| MåBra | `/mabra` | **Aktiv** — KBT, andning, coach |
| Inställningar | (ingen route) | **Aktiv** — öppnar konto-panel |

#### Kluster (fler flikar på samma route)

| Kluster | Route | Flikar | Status |
|---------|-------|--------|--------|
| **Vardagen** | `/vardagen` | Kompasser · Ekonomi · Kunskap | **Aktiv** |
| **Hjärtat** | `/dagbok` | Reflektion · Bevis · Speglar | **Aktiv** |
| **Familjen** | `/familjen` | Reflektion · Livslogg · Tillsammans · Mönster · Kunskapshub | **Aktiv** |

#### Övriga routes

| Route | Vad | Status |
|-------|-----|--------|
| `/dossier` | Dossier-export | **Aktiv** |
| `/projekt` | Projekt-hub | **Delvis** — listor/anteckningar P1 |
| `/widget/*` | Hemskärms-widgetar | **Aktiv** (route finns) |
| `/dev/themes` | Tema-förhandsvisning | **Dev only** |

**Gamla bokmärken funkar:** `/kompasser`, `/ekonomi`, `/kunskap` → `/vardagen`. `/valv`, `/speglar` → `/dagbok`. `/barnen` → `/familjen`.

---

### Moduler — vad som är mest färdigt

| Rang | Modul | Varför |
|------|-------|--------|
| 1 | **Verklighetsvalvet + Valv-Chat** | WORM-bevis, Mönster (regex), Orkester (`analyzeMessage`), smoke PASS |
| 2 | **Kunskap / Kompis** | RAG, Tidshjul, Drive-ingest → `kb_docs`, smoke PASS |
| 3 | **Trygg hamn** | BIFF mot ex, sparar bevis vid behov |
| 4 | **Speglar** | VIVIR, Zero Footprint-session, smoke PASS |
| 5 | **MåBra** | Hub, KBT, coach, andning, smoke PASS |
| 6 | **Dagbok** | Journal + vävare, prod smoke PASS (2026-05-24) |
| 7 | **Dossier** | Generator + snapshots, smoke PASS |
| 8 | **Kompasser** | Morgon/dag/kväll, Paralys, KASAM, smoke PASS |
| 9 | **Planering** | Kanban live på `/planering`, locked UX smoke PASS |
| 10 | **Core** | Auth, Zero Footprint, Kill Switch, Fyren, drawer |

**Delvis / öppet:**
- **Ekonomi** — Firestore funkar; manuell smoke #18 ej körd.
- **Projekt** — hub finns; vissa block säger "Byggs · P1".
- **Barnporten** — agents i kod; ingen `/barnporten`-route än.
- **Manuell prod-smoke** — bara Auth + Dagbok PASS (2026-05-24); resten tom i checklistan.

---

### Smoke — automatiska tester (senast PASS)

| Test | Resultat | Datum |
|------|----------|-------|
| `npm run build` (frontend + functions) | PASS | 2026-05-23 |
| `npm run smoke:locked-ux` | PASS | 2026-05-23 |
| `npm run smoke:orkester` | PASS | 2026-05-23 |
| `npm run smoke:all` | PASS | 2026-05-23 |
| `smoke:valv`, `smoke:kunskap`, `smoke:dossier`, `smoke:compass`, `smoke:mabra` | PASS | 2026-05-22 |

---

### Tre silos (minne — får aldrig blandas)

| Silo | Data i Firestore | AI-anrop |
|------|------------------|----------|
| **Kunskap** | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| **Valv** | `reality_vault` | `valvChatQuery`, `analyzeMessage` |
| **Barnen** | `children_logs` | `childrenLogsQuery` |

**WORM (får inte raderas av retention):** `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`.

---

## 2. 🗺️ NY STRUKTUR FÖR DE 3 KOMPASSERNA

### Nuläge (gemensam hub)

Idag sitter **Morgon**, **Dag** och **Kväll** i **samma modul** under `/vardagen` → fliken Kompasser.

```
Startskärm (/)          Vardagen (/vardagen)
     │                        │
     ├─ LivskompassHero       ├─ flik: Kompasser  ←── Morgon / Dag / Kväll (flikar)
     ├─ check-in panel        ├─ flik: Ekonomi
     └─ minneskort            └─ flik: Kunskap
```

**Kod idag:**
- `src/modules/kompasser/components/DashboardPage.tsx` — alla tre flöden
- `src/modules/kompasser/utils/compassTime.ts` — väljer rätt kompass efter klockan
- `src/modules/kompasser/components/VardagenPage.tsx` — gemensam "Vardagen"-hub

**Tidsregler (logik):**
- Morgon: kl 05–11
- Dag: kl 12–16
- Kväll: resten

**Det finns redan design** för tre **avlånga moduler** på Hem (`docs/design/KOMPASS-MODUL-SPEC.md`) och komponenter (`CompassModuleStrip.tsx`) — men Hem använder ännu `HomeHeroKanon`, inte den nya layouten.

---

### Målbild (tre fristående hubbar på startskärmen)

```
                    STARTSKÄRM (/)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   MORGON-HUB         DAG-HUB          KVÄLL-HUB
   (05–11 aktiv)     (12–16 aktiv)    (17–04 aktiv)
        │                 │                 │
   Egen expanderbar   Egen expanderbar   Egen expanderbar
   modul-rad          modul-rad          modul-rad
        │                 │                 │
   Spara → checkins   Spara → checkins   Spara → checkins
   (compass_morning)  (compass_day)      (compass_evening)
```

**Principer (låsta i spec):**
- Bara **en** kompass är "aktiv" efter klockan — men du kan byta manuellt.
- **Ingen skuld** om du missar morgon.
- Kompass skriver **aldrig automatiskt** till Valv (`reality_vault`).
- Sparade check-ins är **WORM** — ingen redigering efteråt.

---

### Föreslagen mappstruktur (i `src/modules/kompasser/`)

```
kompasser/
├── index.ts                      # exporter + routes
├── shared/                       # det som alla tre delar
│   ├── config/
│   │   ├── compassFlows.ts       # (finns redan)
│   │   └── compassTime.ts        # (finns redan)
│   ├── hooks/
│   │   └── useCompassTimeFlow.ts # (finns redan)
│   ├── api/
│   │   └── compassService.ts     # Paralys-callable
│   └── components/
│       └── CompassShell.tsx      # gemensam ram (ny — bryt ut från DashboardPage)
│
├── hubs/
│   ├── morning/
│   │   ├── MorningHubPage.tsx    # morgon-vy
│   │   └── MorningAnchorPanel.tsx  # Sanningens Ankare (read-only från valv)
│   ├── day/
│   │   ├── DayHubPage.tsx
│   │   └── ParalysPanel.tsx      # (finns redan)
│   └── evening/
│       ├── EveningHubPage.tsx
│       └── KasamEvening.tsx        # (finns redan)
│
├── shell/
│   └── VardagenPage.tsx            # ekonomi + kunskap kvar här
└── widgets/
    └── WidgetCompassPage.tsx       # väljer aktiv hub efter tid
```

**Vardagen behåller Ekonomi och Kunskap.** Bara kompass-delarna flyttas ut till tre hubbar.

---

### Routes — tre alternativ

| Alternativ | Routes | Fördel |
|------------|--------|--------|
| **A (rekommenderad)** | `/morgon`, `/dag`, `/kvall` | Tydliga deep-links; matchar spec post-MVP |
| **B** | `/vardagen/morgon` m.fl. | Behåller Vardagen-klustret |
| **C** | `/vardagen?compass=morning` | Minst router-ändring; svagare "egen hubb"-känsla |

**Redirect-plan:**
- `/kompasser` → `/morgon` (eller tids-default hub)
- Hem (`/`) visar **CompassModuleStrip** — tre avlånga rader; aktiv rad expanderas
- `/widget/kompass` → samma tidslogik

---

### Firebase-synk per kompass-hub

Alla tre hubbar skriver till **samma collection** men med olika `questionId`:

| Hub | Firestore | Fält | Callable (läsning) |
|-----|-----------|------|-------------------|
| **Morgon** | `checkins` | `questionId: compass_morning`, `taskCategory: morning` | Valv read-only preview (planerat) |
| **Dag** | `checkins` | `questionId: compass_day`, `taskCategory: day` | `breakDownResponse` (Paralys) |
| **Kväll** | `checkins` | `questionId: compass_evening`, `taskCategory: evening` | Bro till Speglar/Valv/MåBra/Barnen (navigering — **ingen auto-skriv**) |

**Regler i `firestore.rules`:** `checkins` — append-only (update/delete: false). **Ingen ny collection behövs.**

**Planerat (ej MVP):** historiska `checkins` → `kampspar` (Kunskap-silo, opt-in).

**Ekonomi och Kunskap** stannar i Vardagen-silon:

| Modul | Collection | Callable |
|-------|------------|----------|
| Ekonomi | `transactions`, `economy_profiles` | — (direkt Firestore) |
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery`, `ingestKampsparEntry` |

---

### Implementationsordning (när du säger "kör kompass-hubbar")

1. Bryt ut `CompassShell` från `DashboardPage.tsx` (ingen beteendeändring).
2. Skapa `hubs/morning`, `hubs/day`, `hubs/evening` med befintliga paneler.
3. Lägg routes `/morgon`, `/dag`, `/kvall` i `AppRoutes.tsx`.
4. Byt Hem till `CompassModuleStrip` (design redan skriven).
5. Kör `npm run smoke:compass` + `smoke:locked-ux`.
6. Behåll redirect `/kompasser` → tids-default hub.

---

## 3. 🗑️ SANERINGSPLAN — stänga de 7 gamla arkiven

Dokumentet "7 arkiv" finns inte ordagrant — listan bygger på `system-plan.md`, `GITHUB_ANVANDARGUIDE.md` och konsolideringsdocs.

### De 7 arkiven

| # | Namn | Var | GitHub |
|---|------|-----|--------|
| 1 | **Livskompassen2.0** | Git remote `origin-old` + ev. lokal mapp | https://github.com/pontusmalmstrom9292-sys/Livskompassen2.0 (tag: `archive/pre-clean-repo-2026-05-22`) |
| 2 | **livskompassen-trasig** | Bara i Repomix-export | https://github.com/pontusmalmstrom9292-sys/livskompassen-trasig |
| 3 | **Finder-säkerhetskopia** | `~/StudioProjects/Livskompassen2.0-ARKIV-2026-05-22/` | — (lokal) |
| 4 | **Livskompassen_PROD** | `~/StudioProjects/Livskompassen_PROD` | Gammal experiment-setup |
| 5 | **Repomix bygge** | `~/StudioProjects/Repomix bygge/` | — (lokal exports) |
| 6 | **`docs/archive/`** | Inuti Livskompassen3.0 | — (git-historik i 3.0) |
| 7 | **Borttagna lokala kloner** | v2, HOME-klon, drive-download, cursor-workspace | Redan raderade enligt system-plan |

---

### Checklista — innan du stänger något

**Steg 0 — Bevis att 3.0 klarar sig själv**

- [ ] `main` på Livskompassen3.0 har kört stabilt **minst 2–4 veckor**
- [ ] `npm run build` — PASS
- [ ] `npm run smoke:locked-ux` — PASS
- [ ] `npm run smoke:orkester` — PASS
- [ ] Manuell smoke #1–7 + #18 i `docs/SMOKE_CHECKLIST.md` — minst de du använder dagligen
- [ ] Tag `archive/pre-clean-repo-2026-05-22` finns på GitHub Livskompassen2.0
- [ ] Du har sagt **"godkänn stängning"** — agenten väntar på explicit OK

---

### Checklista — stäng lokalt (Mac)

| # | Arkiv | Åtgärd | Säker? |
|---|-------|--------|--------|
| 1 | `~/StudioProjects/Livskompassen2.0` (om den finns) | Radera mappen **efter** steg 0 | Vänta |
| 2 | `~/StudioProjects/Livskompassen2.0-ARKIV-2026-05-22` | Radera **sist** av alla | Vänta |
| 3 | `~/StudioProjects/Livskompassen_PROD` | Radera | Vänta |
| 4 | `~/StudioProjects/Repomix bygge/` | Radera eller flytta till extern disk | Vänta |
| 5 | `git remote remove origin-old` (i 3.0) | Ta bort pekare till gammalt repo | Vänta |
| 6 | `docs/archive/` i 3.0 | **Radera inte** utan separat beslut — innehåller beslutshistorik | Senare |
| 7 | Borttagna kloner | Inget att göra — redan borta | Klart |

**Säkert att radera när som helst (lokalt, genereras om):**

- [ ] `dist/`
- [ ] `functions/lib/`
- [ ] `.orkester/runs/*.json`
- [ ] `node_modules/` (åter med `npm ci`)

---

### Checklista — stäng på GitHub

| # | Repo | Åtgärd | Säker? |
|---|------|--------|--------|
| 1 | **Livskompassen2.0** | Sätt repo till **Archived** (read-only) — **radera inte** först | Efter steg 0 |
| 2 | **livskompassen-trasig** | Archive eller radera — inget unikt som saknas i 3.0 | Efter steg 0 |
| 3 | **Livskompassen3.0** | **Behåll** — detta är sanningen | Aldrig stäng |
| 4 | Parked `feat/*`-grenar | Stäng **bara** efter PMIR + ditt OK (`docs/BRANCH-KARTA.md`) | Separat |

**Regel:** Pusha **aldrig** till `origin-old`. Bara till `origin` (Livskompassen3.0).

---

### Checklista — städa docs som pekar fel

Efter arkiv-stängning — uppdatera paths från `Livskompassen2.0` → `Livskompassen3.0`:

- [ ] `docs/DEPLOY.md`, `docs/FIREBASE_SYNC.md`, `docs/DRIVE_AUTOMATION.md`
- [ ] `docs/CURSOR-MENY-LATHUND.md` (+ html-versioner)
- [ ] `.gemini/extensions/firebase/gemini-extension.json`
- [ ] `.context/arkitektur-beslut.md` (PROD → 3.0)
- [ ] `package.json` namn `livskompassen-v2` → kosmetiskt val

---

## 4. 📊 KONSEKVENSANALYS — varför de 7 arkiven kan bort

### Kort svar

**Livskompassen 3.0 är en ren start.** All viktig logik, backend och UI-moduler finns redan i 3.0. De gamla arkiven är **backup och historik** — inte det som appen kör idag.

---

### Vad som redan flyttats (bevis i kod + smoke)

| Gammalt | Nytt i 3.0 | Status |
|---------|------------|--------|
| Express `server.ts` | `functions/` (Node, europe-west1) | Klart |
| Python RAG (us-central1) | Node callables | GCP raderat (FAS4 done) |
| `vault` | `reality_vault` | Klart |
| `kids_records` | `children_logs` | Klart |
| `diary` | `journal` | Klart |
| Monolit `src/pages/*` | `src/modules/*` | Klart |
| Drive webhook (Python) | `notifyNewFile` → `kb_docs` | G6 done |
| BIFF/Brusfilter (Python) | `analyzeMessage` | Klart |
| Vector Search north1 (tom) | west1 ANN (54+ vektorer) | G2–G3 done |
| Agent-prompter i klient | `sharedRules.ts` | Klart |
| GAP G1–G16 | Alla **done** i register | 2026-05-22 |

**Slutsats:** Att radera lokala kopior eller arkivera GitHub-repon **stoppar inte** appen. Firebase-data (Firestore) ligger **inte** i git-arkiven.

---

### Vad som **inte** finns i 3.0 (medvetet kvar i gamla arkiv)

| Gammalt mönster | Varför det **inte** ska tillbaka |
|-----------------|----------------------------------|
| Python Cloud Run 14+ agenter | Dubbel RAG-pipeline — förbjudet |
| Vertex AI Search Data Store | Fel produkt — kanon = Vector Search ANN |
| SuperArchive → `kb_docs` för bevis | Bryter Valv-silon |
| Hårdkodad PIN `6469` | Säkerhetsrisk |
| "Silo 3" = ex-partner/juridik | Fel terminologi vs Barnen-silo |
| Genkit som huvudmotor | **WAIT** — inte kanon |
| Express + klient-side Gemini | Ingen Layered Defense |

**Konsekvens:** Du förlorar **inte** fungerande prod genom att stänga arkiv. Du förlorar bara **referens** om du behöver jämföra gammal kod.

---

### Tre hubbar vs gamla arkiv

| Fråga | Svar |
|-------|------|
| Behöver vi ett gammalt repo för 3-kompass-planen? | **Nej** — spec och kod finns i 3.0 (`De-3-Kompasserna-SPEC.md`, `kompasser/`) |
| Påverkar arkiv-stängning Firebase? | **Nej** — data i `gen-lang-client-0481875058` |
| Påverkar det WORM/bevis? | **Nej** — `reality_vault`, `children_logs`, `journal` i molnet |
| Påverkar det locked UX? | **Nej** — Barnfokus, Mönster, Orkester, Planering finns på `main` |
| Vad händer om något går fel? | GitHub-tag + Finder-ARKIV finns **tills du medvetet raderar dem** |

---

### Risker om du stänger **för tidigt**

| Risk | Skydd |
|------|-------|
| Behöver gammal commit | GitHub Livskompassen2.0 + tag `archive/pre-clean-repo-2026-05-22` |
| Mac kraschar | Finder-kopia `Livskompassen2.0-ARKIV-2026-05-22` |
| Osäker på beslutshistorik | `docs/archive/` **inuti 3.0** — radera separat |
| Push till fel repo | Behåll regeln: bara `origin` = Livskompassen3.0 |

---

### Rekommenderad tidslinje

```
NU (2026-05-24)     → Jobba i 3.0, kör manuell smoke
+2–4 veckor         → Om allt känns stabilt: archive GitHub Livskompassen2.0
+4–8 veckor         → Radera lokala kopior (PROD, 2.0-mapp, Repomix)
Sist                → Radera Finder-ARKIV (sista säkerhetsnätet)
Aldrig utan order   → Firestore, WORM-regler, GCP prod-radering
```

---

## Sammanfattning (1 skärm)

| Område | Status |
|--------|--------|
| **Aktiv app** | Livskompassen3.0 / `main` — moduler live, smoke PASS |
| **3 kompasser idag** | En hub (`/vardagen`) — plan: egna hubbar på `/` + routes |
| **7 gamla arkiv** | Backup/historik — kan stängas **efter** stabil 3.0 + ditt OK |
| **Konsekvens** | Ingen prod-logik bara i arkiv — Firebase-data orörd |

---

*Rapport skapad read-only 2026-05-24. Ingen befintlig kod i Livskompassen3.0 ändrades eller raderades.*
