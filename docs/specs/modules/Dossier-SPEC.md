# Dossier-SPEC

**Källa:** Notebook #1–#4 (extern AI) + kodgranskning 2026-05-21.  
**Konsoliderad till:** [`.context/modules/dossier.md`](../../.context/modules/dossier.md)  
**Design:** [`docs/specs/design-master.md`](../design-master.md)

---

## Låsta beslut (notebook #1–#4)

| # | Beslut |
|---|--------|
| 1 | **PDF:** Backend (`pdf-lib` / PDFKit i Cloud Functions). **Inte** jsPDF, **inte** Genkit för layout. Klient `print`-PDF per valv-post **behålls** som snabbexport. |
| 2 | **Snapshot:** `dossier_snapshots` **WORM evigt** (parametrar, `includedDocIds`, `documentHash`, `createdAt`). PDF i Storage **TTL ~24 h** + signed URL; ingen permanent fil som default. |
| 3 | **Urval:** Datumintervall + källor → **granska hela WORM-dokument** (toggle per post, default alla på). **Inte** per mening/rad. |
| 4 | **Hash:** SHA-256 av **kanonisk payload** (sorterade docId + fält), inte bara ID-lista. Synlig på **första + sista** PDF-sida + i UI. |
| 5 | **Journal (`journal`):** **Opt-in** + stark varning (emotionell reflektion). `vävaren_metadata` default **av** i bevis-PDF. |
| 6 | **AI (Vävaren):** Valfritt **försätt** only — märkt *AI-sammanfattning*. Beviskropp = **ordagrant** WORM-fält. |
| 7 | **Delning:** Manuell nedladdning only — **ingen** auto-e-post/API till ombud/motpart. |
| 8 | **Async:** `jobId` + poll/Firestore-status om generering > ~10 s (indigo/guld progress, ingen stressanimation). |
| 9 | **Ingång:** Dold — bro från Valv/Barnen; route `/dossier` bakom **AuthGate + Fyren A** (`isVaultUnlocked` eller `hasVaultGate()`). |
| 10 | **BBIC:** `reportType: LEGAL \| BBIC` — BBIC-mall **fas 2**; MVP = kronologisk LEGAL. |
| 11 | **Masking:** Tredje parts namn → initialer **fas 2** (deterministisk regex, inte LLM). |
| 12 | **Media i PDF:** MVP = text/länk/tumnagel — inte full inbäddning av stora filer. |
| 13 | **Kunskapsbank/kampspar:** **Ej** primär beviskälla i MVP (annat syfte än WORM-valv/barnen). |

---

## 1. Syfte och användarbehov

Dossier-Generatorn är en **Sacred Feature**: samlar WORM-bevis från Verklighetsvalvet och Barnens livsloggar (valfritt Dagbok) till ett formellt, kronologiskt PDF-underlag för ombud eller myndighet — utan att användaren manuellt återupplever och omskriver traumat.

- **Objektivitet:** Grey Rock / BIFF — inga JADE-formuleringar i exportkärnan.
- **Integritet:** Kryptografisk hash + oföränderligt snapshot-kvitto.
- **Kontroll:** Explicit trigger; ingen auto-delning.

---

## 2. Route och ingång

| Punkt | Beslut |
|-------|--------|
| **Route** | `/dossier` |
| **Auth** | `AuthGate` |
| **Fyren A** | Kräver Valv upplåst (`isVaultUnlocked` i store **eller** `hasVaultGate()` i sessionStorage) |
| **Navigation** | **Ingen** dock-ikon (Variant B). Bro: *Skapa Dossier* från `/dagbok?tab=bevis` (Valv) och `/familjen` (Barnen) — **planerat** |
| **Kluster** | Lager 2 — juridisk export, inte vardagsnav |

---

## 3. UX-flöde (Progressive disclosure)

### Målbild (ett steg i taget)

1. **Period:** `dateFrom` / `dateTo` + snabbval (3 / 6 månader).
2. **Källor:** Valv + Barnen förkryssade; Dagbok opt-in med varning; valfri kategori/BBIC-filter.
3. **Granskning:** Lista **hela poster** i perioden — toggle per dokument (default alla på).
4. **Generera:** *Generera låst dossier* → backend (`generateDossier`) eller async job.
5. **Leverans:** Hash + signed URL; tydlig text: *inte skickat till någon*.
6. **Zero Footprint:** Rensa urval/state vid unmount, *Klar*, eller Kill Switch.

### Idag (kod)

[`DossierPage.tsx`](../../../src/modules/dossier/components/DossierPage.tsx): wizard UI (period → källor → granskning → generera). Callable **kopplad**.

---

## 4. Visuell design (Obsidian Calm)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta | `#0f172a` + glass blur |
| Urval / juridisk markör | Guld `#FDE68A` |
| Fortsätt / AI-arbetar | Indigo `#818CF8` |
| Nedladdning / Klar | Emerald `#2DD4BF` |
| Typografi | Outfit + Inter |

**Förbjudet:** lila, turkos/regnbåge, naturteman, röda larmfärger, count-up.

---

## 5. Datamodell (Firestore)

### Läser (WORM-källor)

| Collection | Inkludering |
|------------|-------------|
| `reality_vault` | Standard |
| `children_logs` | Standard |
| `journal` | Opt-in + varning |
| `vävaren_metadata` | Default **av** |

### Skriver

**Collection: `dossier_snapshots`** (WORM — `create` + `read` only)

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `ownerId` | string | UID |
| `dossierId` | string | UUID |
| `parameters` | map | `dateFrom`, `dateTo`, `sources`, `reportType`, filters |
| `includedDocIds` | map | `{ reality_vault: string[], children_logs: string[], journal?: string[] }` |
| `documentHash` | string | SHA-256 kanonisk payload |
| `status` | string | `pending` \| `ready` \| `failed` (async) |
| `jobId` | string? | Async job |
| `createdAt` | timestamp | serverTimestamp |

**PDF-fil:** Storage, signed URL ~24 h; **inte** permanent `fileUrl` i snapshot som standard.

**Valfritt:** `dossier_jobs/{jobId}` för poll under generering.

---

## 6. Backend och agenter

| Komponent | Roll | Status |
|-----------|------|--------|
| `generateDossier` (Callable) | Hämtar valda docs, hash, PDF, snapshot | **done** |
| PDF-rendering | `pdf-lib` — deterministisk layout | **done** |
| Vävaren (opt-in) | Kort försätt — **inte** beviskropp | **planerad** |
| `exportVaultRecordAsPdf` | En valv-post, klient print | **done** |
| `exportBalansReport` | Barnen JSON | **done** (stub) |

### Hash-kedja (MVP)

```
För varje inkluderat doc (sorterat på collection + docId):
  docId + createdAt + kanoniska WORM-fält
→ SHA-256 → documentHash
```

---

## 7. Säkerhet

- **AuthGate + Fyren A** — ingen export utan Lager 2-upplåsning
- **ownerId**-scoped reads i callable — LLM får **inte** auktorisera
- **Zero Footprint** — ingen PDF-cache i localStorage/IndexedDB
- **Kill Switch** — avbryt generering, rensa state
- **CMEK** — Firebase/GCP standard för projektet
- **Ingen auto-delning**

---

## 8. Status idag vs planerat

| Area | Status | Kodreferens |
|------|--------|-------------|
| Route `/dossier` + AuthGate | **done** | `AppRoutes.tsx` |
| Fyren A på `/dossier` | **done** (UI) | `DossierPage.tsx` |
| Wizard UI (period/källor/granskning) | **done** (UI) | `DossierPage.tsx` |
| `generateDossier` callable | **done** | `functions/src/lib/generateDossierInternal.ts` |
| `dossier_snapshots` + rules | **done** | `firestore.rules` |
| Backend PDF + hash | **done** | `lib/dossierPdf.ts`, `lib/dossierCanonicalHash.ts` |
| Bro Valv/Barnen | **planned** | — |
| Valv per-post print-PDF | **done** | `exportVaultRecord.ts` |
| Barnen JSON Balans | **done** | `exportBalansReport.ts` |

### Gap vs delvis export

| Krav (full Dossier) | Valv export | Barnen export |
|---------------------|-------------|---------------|
| Flera collections | Nej | Nej |
| Datumintervall | Nej | 7 dagar fast |
| Hash + snapshot | Nej | Nej |
| Aggregation | Nej | Nej |

---

## 9. Acceptanskriterier

1. Oautentiserad eller fel `ownerId` → callable avvisar.
2. PDF innehåller tidsstämplar från ursprungliga WORM-poster (ordagrant).
3. Varje generering skapar `dossier_snapshots` med hash och `includedDocIds`.
4. Unmount / Kill Switch nollställer wizard-state och temporära länkar.
5. Inget material skickas automatiskt externt.
6. Journal endast efter explicit opt-in + varningsbekräftelse.

---

## 10. Kopplingar

| Modul | Koppling |
|-------|----------|
| Verklighetsvalvet | Primär beviskälla; per-post PDF är byggsten |
| Barnen (`/familjen`) | `children_logs` |
| Dagbok | `journal` opt-in |
| Hamn | Isolerad — dossier för ombud, inte motpartskommunikation |
| Valv-Chat | Läser samma data — skild funktion |

Se [`docs/specs/p2-flode.md`](../p2-flode.md).

---

## 11. Navigation

- **Variant B:** Ingen dock-ikon.
- Kontextuella *Skapa Dossier*-knappar i Valv/Barnen (**planerat**).
- `/dossier` nåbar direkt när Fyren är öppen (dold men inte hemlig URL).

---

## 12. Notebook-korrigeringar (#1–#4)

| Notebook påstod | Verklighet |
|-----------------|------------|
| jsPDF i frontend | **Finns inte** — print/HTML per post |
| `DossierGeneratorPage.tsx` | **Finns inte** — `DossierPage.tsx` |
| Genkit layoutar hela PDF | **Avvisat** för beviskropp |
| GAS/HtmlService | **Avvisat** |
| Permanent PDF i Storage | **Nej** — TTL ~24 h |
| Kunskapsbank i MVP-urval | **Ej** primär beviskälla |

---

## 13. Avvisade eller alternativa idéer

- **jsPDF / frontend layout av hel dossier** — avvisat; backend pdf-lib.
- **Genkit skriver beviskropp** — avvisat; ordagrant från WORM.
- **GAS / HtmlService** — avvisat.
- **Permanent PDF i Storage** — avvisat; TTL ~24 h.
- **Auto-delning till soc/ex** — avvisat; manuell nedladdning only.
- **Stjärnbilder / gamification i export** — avvisat (Kladd §G).

## 14. Tidigare diskussioner att bevara (vision)

- Dossier för **ombud/myndighet** — inte motpartskommunikation (Hamn separat).
- BBIC-teman: barnets utveckling, föräldraförmåga, skydd, relationer (Kladd §I.4 — bekräfta med ombud).
- Kanonisk hash = integritet vid senare granskning.
- Bevisprioritet från Kladd §D aggregeras här — källor matas in via valv/barnen först.

## 15. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §D, §F, §G.

| Kladd | Kod |
|-------|-----|
| `generateDossier` + hash | **done** |
| Wizard period/källor/granskning | **done** |
| BBIC-mall | **planned** fas 2 |
| Bro Valv/Barnen | **planned** |

## 16. Implementationsordning

1. **UI wizard** — **done**
2. `dossier_snapshots` + rules — **done**
3. `generateDossier` + hash + PDF — **done** (deploy krävs)
4. Bro-knappar Valv/Barnen — **planerat**
5. Async job + Vävaren försätt + BBIC — **planerat**
