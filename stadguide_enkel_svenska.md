# Stadguide — Livskompassen (enkel svenska)

Detta dokument beskriver **nuläget i koden** (inte bara gamla docs).  
Uppdaterad: **2026-05-24**.

**Ord du kan möta:**
- **Firestore** = Googles databas i molnet (dina loggar, valv, kunskap).
- **Silo** = tre separata minnesytor som AI **inte** får blanda.
- **WORM** = data som inte ska tyst ändras eller raderas (bevis).
- **Smoke** = snabba automatiska kontroller i terminalen.

---

## Aktiv status (Var är vi nu?)

### Vad fungerar nu?

| Område | Status |
|--------|--------|
| Starta app lokalt | `npm run dev` (Vite, port 5173) |
| Bygga frontend | `npm run build` — PASS enligt `docs/SMOKE_RESULTS.md` (2026-05-23) |
| Bygga Functions | `cd functions && npm run build` — PASS |
| Inloggning | Firebase Auth (e-post + anonym) i `src/modules/core/firebase/init.ts` |
| Låst UX (Barnfokus, Valv Mönster/Orkester, Planering Kanban) | Kod finns; `npm run smoke:locked-ux` — **PASS** 2026-05-23 |
| Orkester / synapser i kod | `npm run smoke:orkester` — **PASS** 2026-05-23 |
| Hosting prod | Projekt `gen-lang-client-0481875058` (se `.firebaserc`) |

**Stämpelklocka:** Finns **inte** som egen modul i `src/modules/`. Sökning på "stämpelklocka" gav inget. Det som finns är **tidsstämplar** (server-tid) på loggar och inspelningar — inte en punch-clock-app.

### Aktiva moduler (kod i `src/modules/`)

| Modul | Route / var | Vad den gör |
|-------|-------------|-------------|
| **core** | Överallt | Auth, meny, hem, Firebase-init, Fyren-widget |
| **dagbok** (Hjärtat) | `/dagbok` | Reflektion, Bevis (Valv), Speglar |
| **verklighetsvalvet** | Via `/dagbok?tab=bevis` | Valv, Mönster, Orkester |
| **barnens_livsloggar** | `/familjen` | Barnlogg, Barnfokus-frågor |
| **safe_harbor** | `/hamn` | BIFF / Grey Rock mot ex |
| **kompasser** + **ekonomi** + **kompis** (kunskap) | `/vardagen` | Kompasser, ekonomi, kunskapsvalv |
| **mabra** | `/mabra` | MåBra, KBT, reglering |
| **planering** | `/planering` | Kanban (ATT GÖRA / VÄNTAR / KLART) |
| **projekt** | `/projekt` | Projekt-hub (listor, anteckningar) |
| **dossier** | `/dossier` | Dossier-export |
| **speglings_system** | `/dagbok?tab=speglar` | Speglar / VIVIR |
| **widgets** | `/widget/*` | Hemskärms-widgetar (inspelning m.m.) |
| **barnporten** | **Ingen egen route** | Spec + `barnportenAgents.ts` — **delvis** |

### Firebase och Google Drive

| Del | Var | Live? |
|-----|-----|-------|
| Firebase-projekt | `gen-lang-client-0481875058` (`.firebaserc`) |
| Functions-region | `europe-west1` (`init.ts` rad 15) |
| Firestore-regler | `firestore.rules` |
| Hosting | `dist/` via `firebase.json` |
| **Apps Script** | `scripts/google-apps-script/sorter.gs` | **Manuell** kopiering till Google — **ingen clasp** i repot |
| Drive → moln | Apps Script → `notifyNewFile` → `kb_docs` (kunskap-silo) | Kod live; du måste ha Script Properties + secret (se `docs/DRIVE_AUTOMATION.md`) |

### Var landar data? (tre silos — regel U1)

| Silo | Firestore (huvudsak) | AI-anrop (backend) |
|------|----------------------|-------------------|
| **Kunskap** | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| **Valv** | `reality_vault` | `valvChatQuery`, `analyzeMessage` |
| **Barnen** | `children_logs` | `childrenLogsQuery` |

**WORM** (ska inte purgas): `children_logs`, `reality_vault`, `journal`, `dossier_snapshots` (se `.context/arkiv-minne.md`).

**Övrigt som appen också använder:** `checkins`, `transactions`, `dcap_alerts`, planeringsuppgifter, Storage för ljud (`vault_evidence/...`).

### Routes (router: `src/modules/core/routing/AppRoutes.tsx`)

| Väg | Sida |
|-----|------|
| `/` | Hem |
| `/vardagen` | Kompasser / Ekonomi / Kunskap |
| `/dagbok` | Hjärtat (flikar: reflektion, bevis, speglar) |
| `/hamn` | Trygg hamn |
| `/familjen` | Familjen |
| `/mabra` | MåBra |
| `/planering` | Planering Kanban |
| `/projekt` | Projekt |
| `/dossier` | Dossier |
| `/dev/themes` | Tema-förhandsvisning (dev) |

**Gamla bokmärken:** `/valv`, `/speglar` → `/dagbok`; `/barnen` → `/familjen`; `/kompasser`, `/ekonomi`, `/kunskap` → `/vardagen`.

**Widget-routes** (`WidgetRoutes.tsx`): `/widget/inspelning`, `anteckning`, `kompass`, `hamn`, `familjen`.

**Meny (hamburger):** `drawerNav.ts` — Hem, Familjen, Hamn, Valv, Planering, MåBra, Inställningar.  
**Inställningar** har **ingen** `/installningar`-route; menyn öppnar **konto-panel** (`NavigationDrawer` → `onOpenSettings`).

### Stub vs live (ärligt)

| Funktion | Bedömning |
|----------|-----------|
| SynapseBus (`driveIngest`, `journal_woven`, `dcap_alert`) | **Live kod** — inte bara logg-stub |
| Valv Mönster (regex) | **Live** — LLM är inte sanning |
| Valv Orkester (`analyzeMessage`) | **Live** |
| Kunskap RAG + Vector | **Live** enligt inventory/smoke (2026-05-22–23) |
| Bevis-flik synlig i UI | **Ofta dold** — `VITE_SHOW_BEVIS_TAB=true` eller Fyren + PIN (`HIDE_BEVIS_TAB`) |
| Barnporten PWA | **Spec + agents** — ingen `/barnporten` i router |
| Genkit som huvudmotor | **Ej kanon** — väntar (GAP) |
| Manuell smoke i webbläsare | **Delvis** — checklista `docs/SMOKE_CHECKLIST.md` (#2–7, #18–20 ofta tomma) |

---

## Arkeologi (Vad ligger och skräpar?)

### Gamla filer och mappar (i repot)

| Plats | Vad | Varför den finns kvar |
|-------|-----|------------------------|
| `docs/archive/repomix/` | Stora Repomix-export + analyser | Jämföra mot gammal monolit utan att köra den |
| `docs/archive/server-legacy/` | Express `server.ts`, gamla routes | Arkiverad backend före Firebase Functions |
| `docs/archive/evaluations-2026-05/` | Grunder U1–U5, Vision-diff | Beslutshistorik för silos och säkerhet |
| `docs/archive/specs-incoming-duplicates-2026-05/` | Dubbla spec-kopior | Inkorg vid konsolidering |
| `docs/archive/kladd/` | Personliga utkast | Inte produktkod |
| `docs/archive/drive-backup/` | (gitignored) Personliga Drive-filer | PII — ska inte in i git |
| `AGENTS.md` / gamla walkthroughs | Påstår ibland "allt klart" | Varning i `ANALYS-archive-walkthrough-legacy.md` |

### Namn som bytts (valv / arkiv)

| Gammalt (repomix) | Nu (kanon) |
|-------------------|------------|
| `vault` | `reality_vault` |
| `kids_records` | `children_logs` |
| `diary` | `journal` |
| Express-server | `functions/` |
| Python RAG (us-central1) | Borta — Node `europe-west1` |
| SuperArchive → `kb_docs` för bevis | **Förbjudet** — bevis ska till Valv-silon |

### Dubletter och design-leftovers

- **Två GCP-inventory-filer:** `docs/GCP-INVENTORY-LATEST.md` (levande) vs `docs/archive/GCP-INVENTORY-2026-05-21.md` (snapshot).
- **Modul-README + `module_plan.md`** i många mappar — planer, inte alltid färdig UI.
- **`ThemePreviewPage`** — dev-route `/dev/themes`.
- **Parked git-grenar** `feat/*` (se `docs/BRANCH-KARTA.md`) — inkorg, inte trash.

### Utanför projektmappen (dokumenterat)

| Plats | Kommentar |
|-------|-----------|
| Git `origin-old` → Livskompassen2.0 | Gammalt repo — titta, pusha inte |
| `~/StudioProjects/Livskompassen2.0-ARKIV-2026-05-22/` | Finder-säkerhetskopia |
| `~/StudioProjects/Repomix bygge/` | Stora exports |
| `~/StudioProjects/Livskompassen_PROD` | Äldre setup (`docs/archive/GITHUB_SETUP.md`) |

### Apps Script utan clasp

Källkod: `scripts/google-apps-script/sorter.gs`.  
Deploy = klistra in i Apps Script UI + Script Properties (`docs/DRIVE_AUTOMATION.md`).  
**clasp** finns **inte** i projektet (grep: 0 träffar).

---

## Återställningsplan (Om allt skiter sig)

Målet: få tillbaka en **fungerande app** efter dålig uppdatering eller trasig merge.  
En punkt i taget. Vänta med nästa tills föregående är klar.

1. **Stanna.** Spara inte mer kod. Andas ut en gång om du är stressad.

2. **Kolla var du är.** Öppna Terminal i projektmappen och kör:
   ```bash
   cd ~/StudioProjects/Livskompassen2.0
   git status -sb
   git branch
   ```
   Du ska helst stå på `main`.

3. **Kasta osparade kodändringar** (bara om du **inte** behöver dem):
   ```bash
   git restore .
   git clean -fd   # VARNING: tar bort ospårade filer — läs listan först med git clean -fdn
   ```

4. **Hämta senaste fungerande main från GitHub:**
   ```bash
   git fetch origin
   git checkout main
   git pull --ff-only origin main
   ```
   Om `pull` vägrar: fråga agent om hjälp — **inte** `git push --force` på main.

5. **Återgå till en tagg eller commit** (om du vet att en äldre version funkade):
   ```bash
   git log --oneline -15
   git checkout <commit-hash>   # tillfälligt — "detached HEAD"
   ```
   För att bo kvar där: skapa gren `git checkout -b fix/rollback-2026-05-24`.

6. **Lokal stash** (om du hade osparade ändringar du vill rädda):
   ```bash
   git stash list
   git stash pop   # bara om du vet vad som ligger i stash
   ```

7. **Återinstallera beroenden och bygg om:**
   ```bash
   npm ci
   npm run build
   cd functions && npm ci && npm run build && cd ..
   ```

8. **Kör smoke (bevis att kärnan lever):**
   ```bash
   npm run smoke:locked-ux
   npm run smoke:orkester
   ```
   Båda ska visa PASS. Om FAIL: notera feltext — fixa eller rollback ett steg till.

9. **Starta appen lokalt:**
   ```bash
   npm run dev
   ```
   Öppna http://localhost:5173 och testa inloggning + en sida du använder dagligen.

10. **Merge-regel (om problemet kom från gren):** Innan du mergar igen — skriv **PMIR** (`docs/MERGE-IMPACT-RAPPORT.md`) och säg **"godkänn merge"** först. Pusha bara till `origin` (Livskompassen3.0), **aldrig** `origin-old`.

11. **Finder-säkerhetskopia** (sista utväg utan git): Kopiera tillbaka från `~/StudioProjects/Livskompassen2.0-ARKIV-2026-05-22/` till en **ny** mapp — jämför, radera inte originalet förrän allt funkar.

---

## Rensningslista (Vad kan vi ta bort direkt?)

### 100 % säkert att radera **lokalt** (genereras om / ska inte committas)

Dessa påverkar **inte** källkod i git om du bara tar bort lokala kopior:

| Vad | Varför säkert |
|-----|----------------|
| `.orkester/runs/*.json` | Körlogg — i `.gitignore` |
| `dist/` | Byggs med `npm run build` |
| `functions/lib/` | Byggs med `cd functions && npm run build` |
| `firebase-debug.log` och `firebase-debug.*.log` | CLI-skrot |
| `.firebase/` (lokal cache) | CLI-skrot |
| `.DS_Store` | macOS-skrot |
| `node_modules/` | Åter med `npm ci` (tar tid att ladda ner igen) |

**Kommando-exempel (en mapp i taget):**
```bash
rm -rf dist functions/lib .orkester/runs
```

### Inte 100 % säkert — **vänta**

| Vad | Vänta tills |
|-----|-------------|
| Allt under `docs/archive/` | Du har läst `KONSOLIDERING-2026-05-21.md` och inte behöver historik |
| `docs/archive/server-legacy/` | Du är säker på att ingen jämför Express-routes |
| Repomix-filer i rot (`repomix-output*.txt/xml`) | Redan gitignored — men kan vara referens |
| `src/dataconnect-generated/` | Du vet hur du regenererar Data Connect |
| Parked `feat/*`-grenar på GitHub | Feature är merged eller medvetet avskriven (`BRANCH-KARTA.md`) |
| Git-repo **Livskompassen2.0** (`origin-old`) | Main på 3.0 kör stabilt i minst några veckor |
| `~/StudioProjects/Livskompassen2.0-ARKIV-2026-05-22/` | Samma som ovan |
| `firestore.rules`, WORM-samlingar i Firebase | **Aldrig** "städa" utan explicit säkerhetsorder |

### Sammanfattning

**I git-trackad källkod finns nästan inget som är 100 % säkert att radera "nu".**  
Det mesta som är skräp är **lokala byggfiler och loggar** (tabellen ovan).  
Arkiv under `docs/archive/` är medvetet kvar — ta bort först efter migration/beslut.

---

*Dokument skapat/uppdaterat: 2026-05-24*
