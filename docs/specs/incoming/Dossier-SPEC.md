# Dossier-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/dossier.md`.

## 1. Syfte och användarbehov

Dossier-Generatorn är en **Sacred Feature** som skapar formella, objektiva och juridiskt användbara sammanställningar (PDF-rapporter). Genom att aggregera oföränderlig WORM-data från appens olika lager hjälper den användaren att överlämna kalla fakta till ombud eller myndigheter utan att själv behöva återuppleva och skriva ner traumat.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A** | Route `/dossier` (AuthGate) — diskret ikon i huvudmenyn |
| **B (rekommenderad)** | Ingen huvudnav — endast *"Skapa Dossier"* från `/valv` och `/barnen` |

**Idag (kod):** Ingen route. Delvis export finns i Valv (per-post PDF) och Barnen (JSON) — se gap-tabell §8.

## 3. UX-flöde (progressive disclosure)

1. **Urval** — tidsperiod och källor (Valvet, Dagbok, Barnens loggar).
2. **Förhandsgranskning** — minimalistisk lista på inkluderade bevis (inga textväggar).
3. **Generering** — *"Skapa Dossier"*; glass blur-laddning med guldindikator medan agenten arbetar asynkront.
4. **Nedladdning & radering** — PDF laddas ner; *"Klar"* triggar Zero Footprint.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund: `#020617` (slate-950)
- Yta: `#0f172a` (slate-900) + glass blur
- Rubriker / aktivt val: guld `#FDE68A`
- Fortsätt: indigo `#818CF8`
- Spara / Klar: emerald `#2DD4BF`
- Typografi: Outfit + Inter
- **Förbjudet:** lila, turkos, regnbåge, naturteman, count-up

## 5. Datamodell (Firestore, WORM)

Modulen skapar **ingen ny rådata** utan **läser** WORM-dokument från:

| Collection | Innehåll | Inkludering |
|------------|----------|-------------|
| `reality_vault` | Bevis, media-URL | Standard |
| `journal` | Dagboksposter | Valfritt |
| `children_logs` | Barnens livsloggar, fysiologi | Valfritt |
| `vävaren_metadata` | Async taggar från dagbok | Valfritt kontext — ofta exkluderad i bevisjämförelse |

Vid generering skapas **`dossier_snapshot`** i Firestore med kryptografisk hash av alla inkluderade källdokument — bevis att ingen manipulering skett mellan loggtillfälle och export.

**Idag (kod):** Ingen `dossier_snapshot`-collection. Ingen hash-pipeline.

## 6. Backend och agenter

| Komponent | Roll | Status |
|-----------|------|--------|
| `generateDossier` (Callable) | Samlar begärd data från Firestore, skapar snapshot + PDF | **planerad** |
| Dossier-Agent (Genkit) | Gemini — Editorial Technical Architect-prompt; objektiv PDF utan JADE | **planerad** |
| `exportVaultRecordAsPdf` | Enstaka valv-post → utskriftsdialog (klient) | **delvis** — inte full Dossier |
| `exportBalansReport` + `downloadBalansReportJson` | Enstaka barn, 7 dagar → JSON (klient) | **delvis** — inte PDF, inte samlad Dossier |

## 7. Säkerhet

- **AuthGate** + **CMEK** — endast inloggad användare triggar export
- **Zero Footprint** — omedelbar rensning av urval/UI-state efter PDF eller vid navigering bort
- **Kill Switch** — `useShakeToKill` för akut avbrott
- **Integritet** — hash i PDF kopplad till `dossier_snapshot`
- **Ingen auto-delning** till motpart

## 8. Status idag vs planerat

| Area | Status | Kodreferens |
|------|--------|-------------|
| Route `/dossier` | **planned** | — |
| Urval UI (period + källor) | **planned** | — |
| `generateDossier` callable | **planned** | — |
| `dossier_snapshot` + hash | **planned** | — |
| Dossier-Agent (Genkit PDF) | **planned** | — |
| Master-prompt testad (NotebookLM/Gemini) | **partial** | — |
| Valv per-post PDF (utskrift) | **done** | `exportVaultRecordAsPdf` i `VaultLogList` |
| Barnen JSON stabilitetsrapport | **done** (stub) | `exportBalansReport` i `BarnensPage` |
| Samlad multi-källa-export | **planned** | — |

### Gap vs delvis export idag

| Krav (full Dossier) | `exportVaultRecord.ts` | `exportBalansReport.ts` |
|---------------------|--------------------------|-------------------------|
| Flera collections | Nej — en `reality_vault`-post | Nej — `children_logs` per barn |
| Datumintervall | Nej | Nej — fast 7-dagars fönster i balans |
| `journal` / vävaren | Nej | Nej |
| PDF med hash | Print-dialog, ingen hash | JSON, ingen PDF |
| `dossier_snapshot` | Nej Firestore-write | Nej Firestore-write |
| Agent-sammanställning | Nej — statisk HTML | Nej — deterministisk JSON |

## 9. Acceptanskriterier

1. Hämtar och slår ihop WORM från `reality_vault` och `children_logs` (och valfritt `journal`) för valt datumintervall.
2. PDF inkluderar synlig hash kopplad till skrivskyddat `dossier_snapshot`.
3. Utdata strikt objektiv (BIFF-kompatibel) — inga hallucinationer eller JADE.
4. Avbrutet flöde nollställer formulär direkt (Zero Footprint).

## 10. Kopplingar till andra moduler

| Modul | Koppling |
|-------|----------|
| Verklighetsvalvet (`/valv`) | Huvudkälla för bevis och media; per-post PDF är byggsten, inte målbild |
| Barnen (`/barnen`) | Incidentrapporter; JSON Balans-export är byggsten för framtida PDF |
| Dagbok (`/dagbok`) | `journal` + async `vävaren_metadata` som valfri kontext |
| Valv-Chat | Läser samma `reality_vault` — skild funktion, ingen export-write |

Se [`docs/specs/p2-flode.md`](../p2-flode.md) och [`docs/specs/hjartat-flode.md`](../hjartat-flode.md).

## 11. Navigation

- **Variant B (rekommenderad):** Ingen plats i huvudnavigation — endast export-knappar i `/valv` och `/barnen`.
- Fullständig Dossier-export skild från enkel per-post-PDF i valvlistan och JSON-knapp i Barnen.
