This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/DOC-INDEX.md, docs/external-ai/DESIGN-KEEP-REGISTER.md, docs/external-ai/HYGIENE-LOG.md, docs/external-ai/REPO-HYGIENE.md, docs/evaluations/SESSION-INDEX.md, docs/archive/README.md, docs/archive/design-2026-06/README.md, docs/evaluations/2026-06-15-fas19-archive-pmir.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: docs/archive/design-2026-06/README.md
````markdown
# Arkiv — design-prototyper (Fas 19.6)

**Status:** Reserverad mapp. Theme-prototyper (ej `DESIGN-PACK-*`) flyttas hit **zon för zon** efter Theme Lab-verifiering — ingen bulk-flytt i 19.6 (Pontus OK 2026-06-15).

**Kanon kvar i repo:** `docs/design/themes/DESIGN-PACK-*`, `OBSIDIAN-DEPTH-SPEC.md`, `ICON-STYLE-GUIDE.md`, Theme Lab `/dev/theme-lab`.
````

## File: docs/archive/README.md
````markdown
# Archive

Historiskt material — **läs-only**. Använd inte som aktiv sanning.

## Innehåll

| Mapp / fil | Beskrivning |
|------------|-------------|
| [`evaluations-fas19-2026-06/`](evaluations-fas19-2026-06/) | Hub-analyser + ombyggnad 2026-05-31 (Fas 19 prep) |
| [`evaluations-fas19-6-2026-06/`](evaluations-fas19-6-2026-06/) | **Fas 19.6** arkiv-batch (2026-06-15) |
| [`evaluations-fas20-2026-06/`](evaluations-fas20-2026-06/) | Maj–juni tidiga cursor-planer + 2026-06-06 byggpass |
| [`evaluations-fas21-2026-06/`](evaluations-fas21-2026-06/) | Superhub deep + multitask juni 2026 |
| [`design-2026-06/`](design-2026-06/) | Reserverad — theme-prototyper (defer) |
| [`evaluations-2026-05/`](evaluations-2026-05/) | Grunder/Vision + **ORKESTER-NATT-ROLLING**, **CONTENT-AUTORUN-ROLLING**, Maj-2026 batch |
| [`evaluations-2026-05-23/`](evaluations-2026-05-23/) | Systemkontroll A–E + modulrapporter 2026-05-23 |
| [`evaluations-closed-2026-05-29/`](evaluations-closed-2026-05-29/) | Vertex dagbok-spec + superseded PMIR (batch) |
| [`CONSOLIDATION-PLAN.md`](CONSOLIDATION-PLAN.md) | Repo-konsolidering (klart 2026-05-24) |
| [`CHAT-ANALYS-2026-05-24.md`](CHAT-ANALYS-2026-05-24.md) | Copilot-snapshot (delvis föråldrad) |
| [`WAVE4_DEFERRED.md`](WAVE4_DEFERRED.md) | Uppskjutet spår — G13 m.fl. nu done i GAP |
| [`kladd/`](kladd/) | Konsoliderad notebook-scratch (PII-möjlig) |
| [`repomix/`](repomix/) | Repomix-snapshots + låsta konsolideringsbeslut |
| [`server-legacy/`](server-legacy/) | Arkiverad Express-backend |
| [`OVERNIGHT_REPORT.md`](OVERNIGHT_REPORT.md) | Punkt-i-tid nattkörning 2026-05-22 |
| [`GITHUB_SETUP.md`](GITHUB_SETUP.md) | Superseded — se [`docs/GITHUB_STANDALONE_SETUP.md`](../GITHUB_STANDALONE_SETUP.md) |
| [`Kompis.md`](Kompis.md) | Tidigt konceptdokument |
| [`GCP-INVENTORY-2026-05-21.md`](GCP-INVENTORY-2026-05-21.md) | Superseded — se [`docs/GCP-INVENTORY-LATEST.md`](../GCP-INVENTORY-LATEST.md) |
| [`legacy-system-plan.md`](legacy-system-plan.md) | Superseded — se [`.context/system-plan.md`](../../.context/system-plan.md) |

## Aktiva referenser (ej arkiv)

- **Grunder slides:** [`docs/specs/modules/grunder-slides/`](../specs/modules/grunder-slides/) — se [`INVENTAR.md`](../specs/modules/grunder-slides/INVENTAR.md)
- **Drive pipeline:** [`docs/DRIVE_AUTOMATION.md`](../DRIVE_AUTOMATION.md)

## Säkerhet

- `drive-backup/` är gitignored (kan innehålla familjedokument och PII).
- Committa inte PII till publikt repo.
````

## File: docs/external-ai/REPO-HYGIENE.md
````markdown
# REPO-HYGIENE — kontinuerlig städning

Städa **medan** vi bygger. **Arkiv-först** — aldrig massradering utan lista i `HYGIENE-LOG.md`.

## Tre klasser

| Klass | Åtgärd |
|-------|--------|
| **KEEP** | Behåll — registrera i `DESIGN-KEEP-REGISTER.md` |
| **ARCHIVE** | Flytta till `docs/archive/YYYY-MM/` |
| **DELETE** | Endast tomma/trasiga placeholders efter ARCHIVE eller uppenbart säkert |

## Vid varje CHECKPOINT (steg 9)

1. Lista nya/ändrade filer sedan förra CP
2. Klassificera KEEP / ARCHIVE / DELETE (GPT-5.4 Mini eller Cursor)
3. Skriv rad i `HYGIENE-LOG.md`
4. Flytta ARCHIVE — radera inte design-historik direkt
5. Uppdatera `DESIGN-KEEP-REGISTER.md`

## Dedikerad design-audit

- **CHECKPOINT-2** (mellan SPEC och kod) eller **CHECKPOINT-7** (final)
- Modell: Opus 4.8 eller GPT-5.4 Mini
- Uppdrag: *Lista filer i docs/design som inte refereras av KEEP-register eller kod — föreslå ARCHIVE.*

## Mappar att städa löpande

| Mapp | Åtgärd |
|------|--------|
| `docs/design/icons-proposals/` | ARCHIVE (ej valda SVG) |
| `docs/design/redesign-proposals/` | ARCHIVE |
| `docs/design/themes/` (utom aktiv) | ARCHIVE → `docs/archive/design-2026-06/` |
| `docs/evaluations/` (duplicerade) | ARCHIVE om ersatta av fas19-masterplan-v2 |
| `exports/` | OK rensa lokalt — regenereras med pack |

## Förbjudet utan PMIR

- Radera locked UX-specs
- Radera `.cursor/rules` refererade specs
- Mass-delete `docs/design/` utan KEEP-register

Se [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md).
````

## File: docs/DOC-INDEX.md
````markdown
# DOC-INDEX — var hittar jag vad?

**Senast uppdaterad:** 2026-06-16 (Fas 0 handoff)  
**Regel:** Om två filer säger olika saker — **register vinner** (se tabell nedan).

---

## 1. Vad gäller nu? (läs dessa först)

| Fråga | Fil |
|-------|-----|
| Vad är LOCK / WIP / nästa steg? | [`docs/external-ai/LIFE-OS-BUILD-STATE.md`](external-ai/LIFE-OS-BUILD-STATE.md) |
| UI-körplan (Körfält B) | [`docs/evaluations/2026-06-16-supermodule-ui-masterplan.md`](evaluations/2026-06-16-supermodule-ui-masterplan.md) |
| Backend Fas 19–24 | [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](evaluations/2026-06-15-fas19-masterplan-v2.md) |
| 1-sides status | [`docs/evaluations/SENASTE-SAMMANFATTNING.md`](evaluations/SENASTE-SAMMANFATTNING.md) |
| Routes + moduler | [`docs/MODUL-FUNKTIONS-REGISTER.md`](MODUL-FUNKTIONS-REGISTER.md) |
| Låst UX (får inte tas bort) | [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) |

**Nästa arbetsgren:** Våg 3 Nav H1–H4 — **PMIR före kod**.

---

## 2. Var lägger jag nya filer?

| Typ | Mapp | Exempel |
|-----|------|---------|
| Beslut / eval | `docs/evaluations/` | `2026-06-16-nav-pmir.md` |
| Modul-SPEC | `docs/specs/modules/` | `Mabra-INPUT-SUPERHUB-SPEC.md` |
| Design (aktiv) | `docs/design/` | endast KEEP enligt register |
| ChatBox-leverans | `docs/external-ai/leveranser/` | `2026-06-16-fas-09-vision.md` |
| Extern import | `docs/external-ai/imports/` | deep-research, gap-matrix |
| Handoff (genereras) | `exports/chatbot-handoff/` | `npm run chatbot:pack:handoff` |
| Arkiv (historik) | `docs/archive/` | flyttade utkast — **inte** sanning |

---

## 3. Vad är arkiv vs aktiv?

| Mapp | Roll |
|------|------|
| `docs/archive/` | Historik — läs för kontext, bygg inte härifrån |
| `docs/archive/design-2026-06/` | Reserverad för design-flytt (icons-proposals m.m.) |
| `exports/` | **Regenereras** — bifoga till ChatBox, redigera inte manuellt |
| `docs/external-ai/bifoga/` | Speglad kopia för upload — `npm run chatbot:sync:bifoga` |

---

## 4. AI-verktyg — vilket för vad?

| Verktyg | När | Pack / prompt |
|---------|-----|----------------|
| **Cursor** | Prod-kod, smoke, LOCK | — |
| **ChatBox** | SPEC, PMIR, wireframes | `exports/chatbot-handoff/` + `bifoga/` |
| **Google AI Studio** | Design-remix + mockup-bild | `npm run design:pack` + `docs/ai-studio/DESIGN-REMIX-PROMPT.md` |
| **NotebookLM** | Research, motsägelser | `npm run google-ai-pro:pack` |

Se [`docs/external-ai/MODEL-PICKER.md`](external-ai/MODEL-PICKER.md).

---

## 5. Design — vad är aktivt?

Kanon: [`docs/external-ai/DESIGN-KEEP-REGISTER.md`](external-ai/DESIGN-KEEP-REGISTER.md)

**~570 filer** i `docs/design/` — de flesta är labb/utkast. Rör inte `icons-proposals/` utan hygiene-PMIR.

---

## 6. Kommandon (handoff)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run chatbot:pack:handoff    # alla ChatBox-repomixar
npm run chatbot:sync:bifoga     # speglar till bifoga/
```

Bifoga-mapp: `docs/external-ai/bifoga/` — se [`bifoga/README.md`](external-ai/bifoga/README.md).

---

## 7. Kanon-tier (planering-kanon-guard)

1. `.context/system-plan.md`
2. `docs/specs/modules/Arkiv-GAP-REGISTER.md`
3. `docs/BRANCH-KARTA.md`
4. `docs/evaluations/` (senaste indexerade)
5. `.context/locked-ux-features.md`
6. `docs/INNEHALL-REGISTER.md`
7. `docs/SYSTEM_PLAN_v2.md`
8. `docs/evaluations/2026-06-15-fas19-masterplan-v2.md`
````

## File: docs/evaluations/2026-06-15-fas19-archive-pmir.md
````markdown
# Fas 19 — Arkiv-manifest (PMIR)

**Datum:** 2026-06-15  
**Status:** **Utförd** 2026-06-15 (Pontus: «flytta»)  
**Batch-logg:** [`../archive/evaluations-fas19-6-2026-06/README.md`](../archive/evaluations-fas19-6-2026-06/README.md)  
**Princip:** Arkiv-först · **Radera-lista tom**

---

## Behåll (aktiv kanon)

Alla filer i skyddad lista: [`fas19-repo-inventory.md`](./2026-06-15-fas19-repo-inventory.md)

---

## Flytta (Fas 19.3 — efter godkännande)

| Från | Till | Notering |
|------|------|----------|
| `docs/evaluations/2026-05-23-*` … äldre utan länk i README | `docs/archive/evaluations-2026-05/` | Behåll pekare i SESSION-INDEX |
| Överflödiga theme-prototyper (ej DESIGN-PACK) | `docs/archive/design-2026-06/` | **Defer** — mapp reserverad; zon för zon efter Theme Lab |

---

## Implementera (backlog i masterplan-v2)

M3.0-C Kat 2/3/6 grönt fält · DF-CLEAR · NAV-2.7 · evolution_ledger 19.5

---

## Defer

JOY-17 · BP-PUSH · LEG-VAULT rules · Genkit V1

---

## Radera

**Inga filer** i denna PMIR — tom lista.
````

## File: docs/external-ai/DESIGN-KEEP-REGISTER.md
````markdown
# DESIGN-KEEP-REGISTER — vad som är aktivt

Filer i `docs/design/` som **används nu** — rör ej vid städning.

## Specs & policy (KEEP)

- `docs/design/COLOR-POLICY.md`
- `docs/design/CHROME-POLICY.md`
- `docs/design/CHROME-EMBER-KANON.md`
- `docs/design/TYPE-SCALE.md`
- `docs/design/ICON-STYLE-GUIDE.md`
- `docs/design/KOMPASS-MODUL-SPEC.md`
- `docs/design/PLANERING-PROJEKT-HYBRID.md`
- `docs/design/PLANERINGSSIDA-SPEC.md`
- `docs/design/WIDGET-BAR-SPEC.md`
- `docs/design/BARNPORTEN-SPEC.md`
- `docs/design/VALV-HUBB-SPEC.md`
- `docs/design/FAMILJEN-HUB-SPEC.md`
- `docs/design/ANDROID-WIDGETS-SPEC.md`
- `docs/design/HOMESCREEN-WIDGETS-SPEC.md`
- `docs/design/MABRA-PROJEKT-VIT-HUB-SPEC.md`
- `docs/design/planering/PLANERING-P3-KANBAN-SPEC.md`

## References / kanon (KEEP)

- `docs/design/references/MENU-DRAWER-KANON.md`
- `docs/design/references/DOCK-KANON.md`
- `docs/design/references/VALV-ICON-KANON.md`
- `docs/design/references/KOMPASS-TRE-TIDPUNKTER.md`

## Galleri — låst widget (KEEP)

- `docs/design/galleri/widget/v2/` — W1–W4 (locked UX hybrid)
- `docs/design/galleri/barnporten/` — barnporten-infografik
- `docs/design/galleri/README.md`

## Tema — aktivt (KEEP)

- `src/styles/obsidian-calm-2.css` (kod — inte i design-mappen)
- `docs/design/themes/phone-icon-variants/PREVIEW.md`
- `docs/design/theme-lab/` (om aktiv Theme Lab-session)

## Ikoner låsta (KEEP — kod)

- `.context/locked-icons.md` — D1, M2, WH1, WH2

## ARKIV-KANDIDATER (zon för zon)

| Mapp | Antal (ca) | Destinationsförslag |
|------|------------|---------------------|
| `docs/design/icons-proposals/` | 200+ SVG | `docs/archive/design-2026-06/icons-proposals/` |
| `docs/design/redesign-proposals/` | STYLE A/B/C | `docs/archive/design-2026-06/redesign-proposals/` |
| `docs/design/themes/` (ej aktiv) | A-sacred, B-elevated, E-aurora, kognitiv-skold | `docs/archive/design-2026-06/themes/` |
| `docs/design/compact/` | gamla modul-mockups | `docs/archive/design-2026-06/compact/` |

**Regel:** Flytta, radera inte — förrän Pontus godkänt HYGIENE-LOG-rad.
````

## File: docs/external-ai/HYGIENE-LOG.md
````markdown
# HYGIENE-LOG

KEEP / ARCHIVE / DELETE / **REJECT** (ChatBox-förslag som bryter låst UX).  
Flytta/radera **inte** utan Pontus-OK + PMIR.

| Datum | CP | Fil/mapp | Beslut | Destination | Anteckning |
|-------|-----|----------|--------|-------------|------------|
| 2026-06-15 | CP-7 | `docs/design/icons-proposals/` (~215 SVG) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/icons-proposals/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/redesign-proposals/` (STYLE A/B/C) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/redesign-proposals/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/themes/` (ej `phone-icon-variants/`) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/themes/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/compact/` | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/compact/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/planering/variants/*.png` | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/planering-variants/` | **KEEP** `PLANERING-P3-KANBAN-SPEC.md` |
| 2026-06-15 | CP-7 | `docs/external-ai/leveranser/*.rtf` | **ARCHIVE-kandidat** | `docs/archive/external-ai-2026-06/` | ChatBox RTF-export |
| 2026-06-15 | CP-7 | `docs/external-ai/docs:external-ai:*` (fel filnamn) | **DELETE** | — | Städad 2026-06-15 |
| 2026-06-16 | Handoff | `docs/archive/evaluations-fas22-2026-06/` (21 eval) | **ARCHIVE** | — | PMIR wave B |
| 2026-06-16 | Handoff | `docs/archive/design-2026-06/*` | **ARCHIVE** | — | PMIR wave D — KEEP register |
| 2026-06-16 | Handoff | `docs/archive/root-2026-06/` (5 rot-md) | **ARCHIVE** | — | PMIR wave C |
| 2026-06-16 | Handoff | Legacy `DagbokSuperModule` (features/diary) | **ARCHIVE** | `code-legacy-2026-06/` | LazyDiary → Hjärtat länk |

## ChatBox PHASE-07 — granskade förslag (REJECT)

| ChatBox föreslog | Beslut | Varför |
|------------------|--------|--------|
| `docs/design/VALV-HUBB-SPEC.md` → arkiv | **REJECT** | KEEP — Valv hub, locked UX |
| `docs/design/galleri/widget/v2/` → arkiv | **REJECT** | KEEP — W1–W4 locked hybrid |
| `docs/design/references/MENU-DRAWER-KANON.md` → arkiv | **REJECT** | KEEP — drawer design lock |
| `docs/design/barnporten/mockups/` → arkiv | **REJECT** | KEEP — `barnporten-inkorg-valv-kanon.png` m.fl. |
| `docs/design/themes/obsidian-depth/` | **SKIP** | Mappen finns ej i repo (ej verifierat) |
| `docs/design/planering/` (hela) → arkiv | **REJECT** | KEEP spec; endast `variants/` PNG kandidat |

Källa: [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md) · ChatBox rå: [`leveranser/2026-06-15-fas-07-chatbox-raw.md`](./leveranser/2026-06-15-fas-07-chatbox-raw.md)
````

## File: docs/evaluations/SESSION-INDEX.md
````markdown
# Sessionsindex — evaluations

**Aktuell status (1 sida):** [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md) · **Öppet per modul:** [`../MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md)

| Session | Datum | Nyckelfiler | Status |
|---------|-------|-------------|--------|
| S1 Grunder | 2026-05-22 | [`archive/evaluations-2026-05/`](../archive/evaluations-2026-05/) | Stängd |
| S2 Systemkontroll | 2026-05-23 | [`archive/evaluations-2026-05-23/`](../archive/evaluations-2026-05-23/) | Historik |
| S3 Docs Del B | 2026-05-24 | [`DOC-DRIFT-RAPPORT.md`](../DOC-DRIFT-RAPPORT.md), [`archive/CONSOLIDATION-PLAN.md`](../archive/CONSOLIDATION-PLAN.md) | Stängd |
| S4 Theme Pack J | 2026-05-26 | [`2026-05-26-session-landning.md`](./2026-05-26-session-landning.md) | Stängd |
| S5 Android | 2026-05-27 | [`2026-05-27-android-landning.md`](./2026-05-27-android-landning.md) | Delvis (smoke) |
| S6 Modul-batch | 2026-05-29 | `*-cursor-plan.md` (**closed**), [`pmir-modul-rollout-batch.md`](../archive/evaluations-fas20-2026-06/2026-05-29-pmir-modul-rollout-batch.md) | Stängd i kod · öppet i [`MODUL-GAP-OVERSIKT`](../MODUL-GAP-OVERSIKT.md) |
| S7 Content | 2026-05-29 | [`content-autorun-program.md`](../archive/evaluations-fas20-2026-06/2026-05-29-content-autorun-program.md), [`content-autorun-vag-8-ingest.md`](./2026-05-29-content-autorun-vag-8-ingest.md) | Ingest öppen |
| S8 Vävaren HITL | 2026-05-31 | [`2026-05-31-pmir-session-rniv.md`](./2026-05-31-pmir-session-rniv.md) | Mergad till `main` · functions live · rules/hosting vid behov |
| S9 Fas 13 | 2026-06-15 | [`archive/evaluations-fas22-2026-06/`](../archive/evaluations-fas22-2026-06/) (`fas13-vag-*`, leverans) | **arkiverad** 2026-06-16 |
| S10 Fas 14–16 | 2026-06-15 | [`archive/evaluations-fas22-2026-06/`](../archive/evaluations-fas22-2026-06/) (`fas14-*`) | **arkiverad** 2026-06-16 |
| S11 Fas 17–18 | 2026-06-15 | [`fas17-typecheck-shared.md`](./2026-06-15-fas17-typecheck-shared.md), [`fas18-android-cap-sync.md`](./2026-06-15-fas18-android-cap-sync.md) | **done** |
| S12 Fas 19 | 2026-06-15 | [`2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md), `fas19-theme-lab-mabra`, `fas19-credits-audit`, `fas19-repo-inventory` | **done** · arkiv 19.6 **done** 2026-06-15 |
| S13 Backend djupanalys | 2026-06-15 | [`2026-06-15-backend-djupanalys.md`](./2026-06-15-backend-djupanalys.md) | Kartlagd · åtgärd #1–8 öppen |
| S14 Arkitektur + nav | 2026-06-15 | [`2026-06-15-arkitektur-nav-analys.md`](./2026-06-15-arkitektur-nav-analys.md), [`gpt-handoff/03-GPT-FORTSATTNING-PROMPT.md`](../gpt-handoff/03-GPT-FORTSATTNING-PROMPT.md) | **open** · F1–F5 ej implementerat |

**Fas 19.6 arkiv-batch:** [`../archive/evaluations-fas19-6-2026-06/README.md`](../archive/evaluations-fas19-6-2026-06/README.md) · manifest [`2026-06-15-fas19-archive-pmir.md`](./2026-06-15-fas19-archive-pmir.md)

**Orkester natt (24–28):** [`archive/evaluations-2026-05/ORKESTER-NATT-ROLLING.md`](../archive/evaluations-2026-05/ORKESTER-NATT-ROLLING.md) · **Senaste:** [`../archive/evaluations-fas19-2026-06/2026-05-29-orkester-natt.md`](../archive/evaluations-fas19-2026-06/2026-05-29-orkester-natt.md)

**Helhetsstatus A (2026-05-31):** [`2026-05-31-A-helhetsstatus.md`](./2026-05-31-A-helhetsstatus.md)

**Stängda arkiv:** [`archive/evaluations-closed-2026-05-29/`](../archive/evaluations-closed-2026-05-29/) (vertex-spec, äldre PMIR)

**Mall ny modul-plan:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)
````
