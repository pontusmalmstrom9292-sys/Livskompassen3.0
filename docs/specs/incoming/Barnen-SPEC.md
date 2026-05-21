# Barnen-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + kodgranskning mot `src/modules/barnens_livsloggar/` och `functions/`.  
Konsoliderad till [`.context/modules/barnens_livsloggar.md`](../../../.context/modules/barnens_livsloggar.md).

## 1. Syfte och användarbehov

**Den trygga hamnen** — neutral, objektiv dokumentation av **Kasper** och **Arvids** basbehov och vardag. Grey Rock-ton: observerbara fakta, ingen JADE, ingen vuxenkonflikt i barnens datalager.

Syfte:

- BBIC-orienterat underlag (sömn, aptit, ångest, rutiner, skola/överlämning)
- 7-dagars mönster via Balansmätaren (deterministisk, lågaffektiv)
- Export för socialtjänst/skola — **rent** från forensisk gaslighting-logg
- Parallellt föräldraskap: dokumentera **din** förutsägbarhet och trygg hamn

**Strikt skild från:**

- **Dagbok (Lager 1)** — personlig reflektion, inte barnjuridik
- **Verklighetsvalvet (Lager 2)** — vuxenbevis; incident-kopiering **endast explicit** (§14)

## 2. Route och ingång

| | |
|---|---|
| **Route (primär)** | `/familjen` — `FamiljenPage` → `BarnensPage` embedded |
| **Redirect** | `/barnen` → `/familjen` |
| **AuthGate** | Ja (Firebase Auth) |
| **Kluster** | Familjen |
| **Dock** | Heart → `/familjen` |
| **PIN** | **Separat** från valv — enkel `PinGate` ( **inte** WebAuthn/Fyren) |
| **Titlar** | Kluster: **Familjen**; innehåll: **Livsloggar** / barnnamn |

## 3. UX-flöde (Progressive Disclosure)

### Idag (kod)

**En sida** — inte steg-wizard. Två **separata** WORM-sparningar.

1. **PIN:** skapa/ange familje-PIN (`CHILDREN_PIN_KEY` i `localStorage`).
2. **Barnval:** flikar Kasper \| Arvid.
3. **Balansmätare:** 7-dagars index + knapp **Exportera stabilitetsrapport (JSON)**.
4. **Fysiologi:** skala 1–5 sömn, ångest, aptit → **Spara dagens signaler** → `action: 'fysiologi'`.
5. **Livslogg:** kategori + observation + valfri barnpåverkan → **Spara livslogg** → `action: 'livslogg'`.
6. **Tidslinje:** poster filtrerade per barn.
7. **Lås modul:** manuell knapp.

**Kategorier (livslogg):** `vardag`, `skola`, `halsa`, `overlamning`.

**Inte idag:** wizard steg-för-steg, "Allvarlig incident"-knapp, tredjepartstagg, PDF, larmtrösklar, offline-kö.

### Målbild (planerad)

- Wizard: fysiologi → livslogg → bekräfta (ett steg i taget)
- Knapp **"Spara som bevis?"** → ny post i `reality_vault` med `sourceRef` (§14)
- Tredjepart: kategori/tag (t.ex. skola/resurslärare)
- PDF juridisk stabilitetsrapport + hash via Dossier
- Diskret larmtext vid lågt 7-dagars-snitt ( **ingen** röd flagga MVP)
- Sandbox/Ankare: samma data, olika copy/UX per barn-flik

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta / glass | `#0f172a` + blur |
| Aktiv barn-flik / balans | `#FDE68A` (guld) |
| Sekundär | `#818CF8` (indigo) |
| Spara | `#2DD4BF` (emerald) — `btn-pill--accent` |
| Typografi | Outfit + Inter |

**Balansmätare:** horisontell bar + textlabel — **ingen** linjegraf, streak eller count-up.

**Förbjudet:** regnbåge, gamification, trafikljus-larm, nature themes, count-up.

## 5. Datamodell (Firestore, WORM)

Security Rules: `create` med `ownerId == auth.uid`; `update, delete: if false`.

Index: `ownerId` + `createdAt` (desc). Barn filter **klient-side** (`childAlias`).

### Collection: `children_logs`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs (`withUserId`) |
| `userId` | string | Spegel |
| `childAlias` | string | `Kasper` \| `Arvid` |
| `action` | string | `fysiologi` \| `livslogg` |
| `signals` | object? | `{ somn, angest, aptit }` 1–5 — **endast** fysiologi |
| `observation` | string? | Livslogg / valfri fysio-notering |
| `truth` | string? | Spegel av `observation` vid livslogg |
| `category` | string? | Livslogg |
| `childrenImpact` | string? | Valfri barnpåverkan |
| `createdAt` | timestamp | server-side |

**Inte i scope MVP:** `childId`, nested `physiology{}`/`lifeLog{}`, `hash`, `is_incident`, `isThirdParty` på dokument.

**Två poster:** fysiologi och livslogg sparas som **separata** dokument (inte ett kombinerat wizard-dokument).

## 6. Backend och agenter

| Path | Roll |
|------|------|
| Klient `saveChildrenLog` | `addDoc` → `children_logs` — **inte** callable |
| Klient `getChildrenLogs` | Lista per `ownerId`, sorterad desc |
| `computeBalansIndex` | Deterministisk 7-dagars aggregering — **endast** `action: fysiologi` |
| `exportBalansReport` / `downloadBalansReportJson` | Klient JSON-export per barn |

**Planerat:**

- `generateDossier` — PDF + hash, BBIC-struktur, per barn
- Incident-bro: ny `reality_vault`-post med `sourceRef` + sammanfattning
- Opt-in AI Grey Rock-granskare före save ( **inte** MVP)
- Ingen RAG/Kunskap på `children_logs` som standard

**Prompts:** eventuell Dossier-agent i `sharedRules.ts` — Grey Rock, ingen JADE.

## 7. Säkerhet

| Kontroll | Status |
|----------|--------|
| AuthGate + Firestore `ownerId` | **done** |
| WORM rules (`update/delete: false`) | **done** |
| Separat PIN (skild från valv) | **done** |
| PIN låses vid `visibilitychange` | **done** |
| Manuell **Lås modul** | **done** |
| Kill Switch global | **done** — **OBS:** `executeKillSwitch` **raderar** `CHILDREN_PIN_KEY` (måste skapa PIN igen) |
| Formulär rensas efter livslogg-save | **done** |
| Unmount cleanup osparad input | **partial** |
| CMEK | **planned** (drift/GCP) |
| Offline LocalForage | **planned** — ej MVP |

**PIN fel:** felmeddelande only — **ingen** lockout/kill vid fel PIN (§14).

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| FamiljenPage + BarnensPage | **done** |
| PIN setup/verify | **done** |
| Kasper / Arvid-flikar | **done** |
| Fysiologi 1–5 | **done** |
| Livslogg (kategori, observation, impact) | **done** |
| Balansmätare 7 dagar | **done** |
| Tidslinje per barn | **done** |
| JSON-export per barn | **done** |
| WORM Firestore | **done** |
| Wizard progressive disclosure | **planned** |
| PDF juridisk rapport + hash | **planned** (Dossier) |
| Incident → `reality_vault` | **planned** |
| Tredjepartstagg / BBIC-exportmall | **planned** |
| Larmtrösklar (diskret) | **planned** |
| Umgängesschema-korrelation | **planned** (post-MVP) |
| Sandbox / Identitets-Ankare UX | **planned** (vision; flikar idag) |
| AI JADE-granskare | **planned** (opt-in) |
| Offline pending sync | **planned** |
| Tidslinje paginering | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | `/familjen` kräver Auth + familje-PIN | **done** |
| 2 | WORM: update/delete nekas i rules | **done** |
| 3 | Fysiologi/livslogg sparas med `serverTimestamp` | **done** |
| 4 | Balans uppdateras **per barn**, endast fysiologi | **done** |
| 5 | JSON-export innehåller endast `children_logs` för valt barn | **done** |
| 6 | Separat PIN från valv | **done** |
| 7 | PIN låses vid `visibilitychange` | **done** |
| 8 | Wizard steg-för-steg | **planned** |
| 9 | PDF + hash | **planned** |
| 10 | Incident-bro explicit till valv | **planned** |
| 11 | Unmount cleanup osparad input | **partial** |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Verklighetsvalvet** | Isolerad datasilo; planerad **envägs**-bro med explicit knapp + `sourceRef` |
| **Dossier** | Opt-in aggregation; PDF/hash — **inte** auto-bifoga (§14) |
| **Dagbok** | **Ingen** auto-ingest; Variant B tagg → balans **planerad** |
| **Kunskap / RAG** | **Ingen** standardläsning av `children_logs` |
| **Hamn / BIFF** | Separata moduler; vuxenkommunikation inte i barnlogg |
| **Speglar / Valv-Chat** | Läser **inte** barnlogg |

## 11. Navigation

- **Dock:** Heart → `/familjen`
- **Kluster:** Familjen (`ClusterGrid` → Livsloggar / Balansmätare)
- **Redirect:** `/barnen` → `/familjen`

## 12. Tidigare diskussioner att bevara (vision)

- **Kasper (7–8 år):** autism/ADHD, förutsägbarhet, skola, lojalitetskonflikt — logga **objektivt** (t.ex. resurslärare Ann).
- **Arvid (4 år):** emotionell smitta, regression (sömn, mat) — separat flik.
- **BBIC:** basbehov före anklagelser; export anpassad socialtjänst **planerad**.
- **Tredjepart:** skola/BUP/resurs tyngre än egna tolkningar — formulera som observation.
- **KASAM / parallellt föräldraskap:** dokumentera **din** trygga hamn, inte styra motparten.
- **Grey Rock:** ingen JADE i barnformulär; inte plats för egen smärtbearbetning.
- **Sandbox / Identitets-Ankare:** visionär UX-djup — samma `children_logs`, olika ram per barn senare.

## 13. Avvisade eller alternativa idéer

- **Google Apps Script / Kalkylark** — avvisat; Firestore.
- **Gemensam logg båda barnen** — avvisat; separata flikar/posters.
- **Blanda barnlogg + dagbok + valv** — avvisat; separata collections.
- **Auto-kopiering incident → valv** — avvisat; explicit knapp (§14).
- **Auto-keywords eskalering** — avvisat.
- **Röda larmflaggor / trafikljus** — avvisat MVP; diskret text senare.
- **WebAuthn för barn-PIN** — avvisat MVP; enkel PIN för snabbloggning.
- **Balans viktad av livslogg-incidenter** — avvisat; fysiologi only.
- **Callable `saveChildLog`** — avvisat; klient WORM create med rules.
- **Nested schema** (`physiology{}`, `lifeLog{}`) — avvisat; platta fält + `action`.
- **Offline LocalForage MVP** — avvisat; planerat senare.
- **"Narcissist" i formulär/export** — avvisat; fakta + barnets bästa (Kladd §C).

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](./Kladd-2026-05-21-PERSONAL-MASTER.md) §D, §F.

| Bevis / observation (Kladd) | Modul | Valv |
|----------------------------|-------|------|
| Skola Ann/Lena, mammaveckor | `category: skola` | manuell PDF |
| Barnsamtal 2026-03-12 | livslogg neutral | ev. valv |
| Kasper utagerande / trötthet | fysio + livslogg | **inte** auto |

## 15. Öppna produktbeslut (låsta 2026-05)

| # | Fråga | Beslut | Låst |
|---|-------|--------|------|
| 1 | PIN-livslängd | Lås vid **`visibilitychange`** — inte hård flik-låsning som valv | **Ja** |
| 2 | PIN fel | Felmeddelande only — **inte** kill/lockout | **Ja** |
| 3 | PIN-typ | **Enkel PIN** — inte WebAuthn/Fyren | **Ja** |
| 4 | Incident → valv | Knapp **"Spara som bevis?"** → ny `reality_vault`-post med **`sourceRef`** — **aldrig** auto | **Ja** |
| 5 | Balansmätare | **Endast fysiologi**, 7 dagar — inte livslogg, inte umgängesschema MVP | **Ja** |
| 6 | Export | **JSON klient nu**; PDF klient print → **Dossier callable + hash** senare; **per barn** | **Ja** |
| 7 | Tredjepart | Kategori **`skola`** + valfri tagg senare — inte wizard MVP | **Ja** |
| 8 | Sandbox/Ankare | Samma **`children_logs`** — olika UX/copy per flik senare | **Ja** |
| 9 | Dossier | **Opt-in** — inte auto-bifoga rapporter | **Ja** |
| 10 | Larmtrösklar | Planerat — **diskret text**, ingen röd flagga MVP | **Ja** |
| 11 | WORM | Firestore rules (**klart**) + hash vid export senare | **Ja** |
| 12 | Route/titel | Route **`/familjen`**, dock **Familjen**, innehåll **Livsloggar** | **Ja** |
| 13 | AI JADE-granskare | Opt-in **planerat** — inte MVP | **Ja** |

---

**Module plan (kod):** [`src/modules/barnens_livsloggar/module_plan.md`](../../../src/modules/barnens_livsloggar/module_plan.md)  
**Flöde:** [`docs/specs/p2-flode.md`](../p2-flode.md)  
**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)
