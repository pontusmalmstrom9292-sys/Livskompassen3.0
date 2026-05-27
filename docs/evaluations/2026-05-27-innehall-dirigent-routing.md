# Innehållsdirigent — routing & TOP-gaps (2026-05-27)

**Roll:** `specialist-innehall-dirigent` (dirigerar, skriver inte KEEP-poster).  
**Kanon:** [`docs/INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) · [`.context/innehall-kanon.md`](../../.context/innehall-kanon.md) · U1 tre silos + Vit utan cross-RAG.

**MUST NOT (denna rapport):** `FACT` i `Mabra-CONTENT-BANK` · `PLAY` i `reality_vault` · Vit → `kampspar`/`kb_docs` · fjärde RAG-silo · ändra `firestore.rules` / `sharedRules.ts`.

---

## Modul × `content_class` → mål-bank / collection

| Modul | Route / zon | FACT | REFLECTION | PLAY | EVIDENCE |
|-------|-------------|------|------------|------|----------|
| **Kunskap** | Valv PIN `kunskapsbank` · `/vardagen?tab=kunskap` | **`kampspar`**, **`kb_docs`** via `Kunskap-CONTENT-SEED` → ingest · RAG `knowledgeVaultQuery` | **NOT allowed** (→ MåBra-bank) | **NOT allowed** (→ Vit / Barnen) | **NOT allowed** (→ Valv `reality_vault`) |
| **MåBra / Vit** | `/mabra` · `vit_hub` / `vit_entries` *(P1)* | **NOT allowed** i bank — **ROUTE:** `specialist-kunskap-seed` → seed → ingest | **`Mabra-CONTENT-BANK`** · `mabra_sessions` metadata | **`Mabra-CONTENT-BANK`** · `dagligMixCatalog.ts` (DM-*) | **NOT allowed** (→ `children_logs` / Valv) |
| **Barnen** | `/familjen` · Barnfokus | **NOT allowed** i Familjen-UI — **ROUTE:** kunskap-seed (t.ex. BBIC fakta) | **NOT allowed** (vuxenreflektion → MåBra) | **`Barnen-PLAY-BANK`** *(plan)* · kod: `BARNFOKUS_QUESTIONS` → `children_logs` `category: barnfokus` | **`children_logs`** ingest-only · RAG `childrenLogsQuery` · **ingen** auto-promote Valv |
| **Valv** | `/dagbok?tab=bevis` · PIN | **NOT allowed** som ny Valv-post — läs befintlig **`kampspar`/`kb_docs`** i Kunskapsbank-panel | **NOT allowed** | **NOT allowed** | **`reality_vault`** ingest/HITL/WORM · `valvChatQuery` · **ingen** content-kurator |
| **Planering** | `/planering` · `planning_tasks` / inkorg | **ROUTE:** kunskap-seed (myndighet/skola **fakta**) — **ej** i kanban | **NOT allowed** som bank — mikrocopy i spec/UI only | **NOT allowed** | **ROUTE:** Valv om PDF/beslut · annars **NOT** (uppgifter ≠ bevis) |
| **Familjen** | `/familjen` (hub + logg) | **NOT allowed** — föräldrafakta → kunskap-seed | **NOT allowed** (vuxen → MåBra) | **`BARNFOKUS_QUESTIONS`** / framtida `Barnen-PLAY-BANK` | **`children_logs`** neutral observation · WORM |
| **Ekonomi** | `/vardagen?tab=ekonomi` | **NOT in module** — **`transactions`** är siffror, inte RAG — utbildning → kunskap-seed | **NOT allowed** | **NOT allowed** | **NOT allowed** i ekonomi — juridik/lön → Valv `arbetsliv_*` |
| **Arbetsliv** | `/arbetsliv` · Valv `arbetsliv_franvaro` / `arbetsliv_lon` | **NOT in hub** — FK/VAB/regler → kunskap-seed | **NOT allowed** | **NOT allowed** | **Valv ingest** (lönespec, frånvaro) · publika flikar = operativ data, ej content-bank |

### Snabbreferens — banker & callables

| Bank / data | Fil / collection | Kurator / väg |
|-------------|------------------|---------------|
| Kunskap FACT | `docs/specs/modules/Kunskap-CONTENT-SEED.md` → `kampspar`, `kb_docs` | `specialist-kunskap-seed` |
| MåBra REFLECTION/PLAY | `docs/specs/modules/Mabra-CONTENT-BANK.md` → `vit_entries` *(P1)* | `specialist-mabra-curator` |
| Barnen PLAY | `docs/specs/modules/Barnen-PLAY-BANK.md` *(plan)* · `BARNFOKUS_QUESTIONS` | `specialist-barn-lek` *(plan)* |
| Valv EVIDENCE | `reality_vault` | ingest / HITL — **none** |
| Ex / BIFF / gaslighting | Speglar / Hamn | **ROUTE_SPEGLAR** — ingen kurator-bank |

---

## TOP innehållsgaps per zon (3–5 · titel + intent · kurator)

### Kunskap (`FACT` → `Kunskap-CONTENT-SEED` / `kampspar`)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| K1 | **Föräldrabalk 6 kap — växelboende (neutral)** | Verifierbar översikt för RAG-citat vid vårdnadsfrågor — **inte** BIFF-dialog | `specialist-kunskap-seed` |
| K2 | **BBIC — observation utan diagnos** | Hur man loggar utveckling/skydd/ relationer (kompletterar befintlig barn-seed) | `specialist-kunskap-seed` |
| K3 | **ADHD exekutiv funktion — vardagsmetoder** | `psychoeducation_general` med tier; stöd Kompis, **inte** MåBra-frågekort | `specialist-kunskap-seed` |
| K4 | **Dokumentation vid konflikt (processfakta)** | Tidslinje, neutral logg, vad som **inte** ska skrivas — **ROUTE** från Speglar om sms-svar | `specialist-kunskap-seed` |
| K5 | **Försäkringskassan / VAB — fältöversikt** | Fakta för Planering/Ekonomi-länkar; ingest separat från `transactions` | `specialist-kunskap-seed` |

*Registerläge:* `Kunskap-CONTENT-SEED.md` KEEP-tabell **tom** (skelett 2026-05-25); profil finns i `Kampspar-PROFIL-SEED.json` (47) — ny kurering ska **inte** duplicera coping/BIFF som redan finns där utan `id` + tier.

### MåBra / Vit (`REFLECTION` · `PLAY` → `Mabra-CONTENT-BANK`)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| M1 | **Dagtrötthet / medicin-biverkning (validering)** | REFLECTION utan dos/råd; koppla `find_self`, låg energi | `specialist-mabra-curator` |
| M2 | **Hyperfokus → paus (mikrospel)** | PLAY ≤2 min, offline, ingen streak | `specialist-mabra-curator` |
| M3 | **Kvälls-hyperarousal (C-* pool)** | Reflektion efter barnvecka — **ingen** ex-analys | `specialist-mabra-curator` |
| M4 | **Daglig mix DM-* utökning** | Fler roterande `bankId` (vila, en handling) — deterministisk | `specialist-mabra-curator` |
| M5 | **P1 `vit_entries` från KEEP** | Wire `C-se-*` / projekt till Firestore — implementation, inte ny textmassa | `specialist-mabra-curator` *(+ dev)* |

*Avvisat här:* all **FACT** (F1–F8 i banken är *produkt-copy guardrails*, inte RAG-fakta) · ex/BIFF · streak.

### Barnen (`PLAY` · `EVIDENCE` → pool / `children_logs`)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| B1 | **`lara_kanna` — fler korta frågor** | Utöka pool (idag ~3) — barnvänligt, inget “rätt svar” | `specialist-barn-lek` *(plan)* |
| B2 | **`valv_safe` — trygghetsfrågor** | PLAY som förbereder logg, **inte** Valv-promote auto | `specialist-barn-lek` *(plan)* |
| B3 | **`utveckling` utan diagnos** | Observation lek (språk, kompisar) — förälder sparar EVIDENCE | `specialist-barn-lek` *(plan)* |
| B4 | **Harmonisera `Barnen-PLAY-BANK.md` ↔ kod** | Flytta `BARNFOKUS_QUESTIONS` till bank-dokument med `content_class` | `specialist-barn-lek` *(plan)* |
| B5 | **Logg-guide (product_copy i spec)** | *Hur* man skriver neutral `children_logs` — **EVIDENCE**, ej RAG till Kunskap | **none** (spec only) |

### Valv (`EVIDENCE` → ingest)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| V1 | **Skol-PDF → `reality_vault` playbook** | Deterministisk ingest + taggar för Mönster | **none** (ingest) |
| V2 | **Dossier tidslinje-mallar** | Struktur för export — WORM snapshots | **none** |
| V3 | **HITL Barnen → Valv (policy)** | När promote är OK — **inte** lek-bank | **none** |
| V4 | **Kunskapsbank läslista (länkar)** | UI pekar på befintlig FACT i `kampspar` — **ingen** ny silo | `specialist-kunskap-seed` *(seed only)* |
| V5 | **Mönster-taggar taxonomi** | Forensik metadata — kod/spec, inte LLM-fakta | **none** |

### Planering (operativ — **ingen** content-bank)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| P1 | **E-post `route: planering` hjälptext** | product_copy i UI — skola/FK, **inte** Hamn | **none** |
| P2 | **Paralys-mikrosteg mallar** | ADK `user_overwhelm` — **inte** MåBra-bank | **none** |
| P3 | **Myndighetsfakta i kanban** | Länka till Kunskap RAG — **ROUTE** K1/K5 | `specialist-kunskap-seed` |
| P4 | **Inkast fas 2–5** | Produkt-GAP — ingest till inkorg, ej REFLECTION-bank | **none** |

### Familjen (hub — PLAY + EVIDENCE)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| F1 | **Utöka `knas` / `gladje` pooler** | Lekfull Barnfokus — samma klass som B1–B3 | `specialist-barn-lek` *(plan)* |
| F2 | **Kategori `barnfokus` vs legacy `middag`** | Dokumentera i spec — kod redan optimistic save | **none** |
| F3 | **Familjelog “en rad idag”** | EVIDENCE-minne — förälder skriver, ingen coach-fakta | **none** |
| F4 | **Barnporten CB1–4 PLAY** | Framtida barn-PWA — **ej** Valv auto | `specialist-barn-lek` *(plan)* |

### Ekonomi (siffror — **ingen** RAG-bank)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| E1 | **ADHD-vänlig veckobudget (fakta)** | Metod i **Kunskap**, inte i `transactions` | `specialist-kunskap-seed` |
| E2 | **`budgets` collection (plan)** | Produkt-GAP — strukturdata, ej content_class | **none** |
| E3 | **Kronofogd / F-skatt översikt** | FACT för länk från Planering — seed | `specialist-kunskap-seed` |
| E4 | **Vinst-knapp copy** | product_copy i `Ekonomi-SPEC` — redan done i kod | **none** |

### Arbetsliv (operativ + Valv forensic)

| # | Titel (utkast) | Intent (en rad) | Kurator |
|---|----------------|-----------------|---------|
| A1 | **VAB/FK FACT-pack** | Samma som K5 — läs i Kunskap, inte i stämpel-UI | `specialist-kunskap-seed` |
| A2 | **Lönespec ingest (Valv)** | EVIDENCE `arbetsliv_lon` — server-only | **none** |
| A3 | **Frånvaro-PIN flöde** | Forensik zon — **ingen** REFLECTION-bank | **none** |
| A4 | **Stämpel / tid (publik data)** | Operativ logg — **NOT** content-bank | **none** |

---

## Dirigent-beslutsträd (påminnelse)

1. Ex / SMS / gaslighting / BIFF → **Speglar / Hamn** (`ROUTE_SPEGLAR`) — **ingen** kurator-bank.  
2. Bevis / dossier / WORM → **Valv ingest** — **ingen** kurator-bank.  
3. Verifierbar referens / lag / metod → **`specialist-kunskap-seed`** · `FACT` · `kampspar`/`kb_docs`.  
4. Frågekort / självkänsla / lek inåtvänd → **`specialist-mabra-curator`** · `REFLECTION`/`PLAY` · **aldrig** Kunskap-RAG.  
5. Barnfråga / lek med barn → **`specialist-barn-lek`** *(plan)* · `PLAY` · `children_logs`.  
6. Blandat FACT + PLAY → **två** uppgifter, två klasser — **aldrig** en post.

**Trigger:** `dirigera innehåll: …` · `kör kunskap seed` · `kör mabra curator` · `kör barn lek` *(när bank finns)*.

**Smoke efter kod:** `npm run smoke:innehall` · zon: `smoke:kunskap` · `smoke:mabra` · `smoke:locked-ux` (Barnfokus).

---

## Nästa steg (ett — för produktägare)

Välj **en** zon och kör kurator-trigger, t.ex. `kör kunskap seed: K3 ADHD exekutiv` **eller** `kör mabra curator: M2 hyperfokus mikrospel` — dirigent skriver inte KEEP själv.

*Jämför ändringar mot hela projektets kontext. Arbeta autonomt tills routing är tydlig med exakt en nästa kurator eller ROUTE.*
