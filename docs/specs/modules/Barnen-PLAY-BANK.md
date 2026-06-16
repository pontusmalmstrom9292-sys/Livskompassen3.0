# Barnen — Play Bank

**Datum:** 2026-05-29  
**Kurator:** `specialist-barn-lek` *(plan)*  
**Syfte:** Lekfulla frågor till **Familjen / Barnfokus** — **PLAY**, inte Valv-bevis.

**Register:** [`INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md) · **Låst UX:** `BarnfokusFraganPanel` · **Data:** `children_logs` (`category: barnfokus`)

---

## KEEP — Content autorun våg 4

| id | content_class | source_tier | status | lens | text_sv |
|----|---------------|-------------|--------|------|---------|
| BP-PLAY-01 | PLAY | product_copy | KEEP | gladje | Vad var roligast med {ChildAlias} idag — en sak? |
| BP-PLAY-02 | PLAY | product_copy | KEEP | knas | Berätta ett knasigt ögonblick — kort som en gåta. |
| BP-PLAY-03 | PLAY | product_copy | KEEP | lara_kanna | En ny sak du lärde dig om {ChildAlias} denna vecka. |
| BP-PLAY-04 | PLAY | product_copy | KEEP | utveckling | Vad blev {ChildAlias} bättre på — utan betyg? |
| BP-PLAY-05 | PLAY | product_copy | KEEP | valv_safe | En trygg stund hemma — vad hände? |

**MUST NOT:** vuxenkonflikt, diagnos, auto-promote till `reality_vault`.

**Smoke:** `npm run smoke:locked-ux` · `npm run smoke:content-waves`

---

## Harmonisation — bank ↔ `BARNFOKUS_QUESTIONS` (bank-only, 2026-06-11)

**Status:** **aktiv** 2026-06-11 — child wire BP-PLAY-06..21 (alla legacy_id) · parent BP-PLAY-01..05 i `ParentReminderFooter`.

### Publik

| Källa | `audience` | Antal | Användning |
|-------|------------|-------|------------|
| **BP-PLAY-01–05** (denna bank) | `parent` | 5 | Kurator-seed, wave 4 — förälder reflekterar om `{ChildAlias}` |
| **`BARNFOKUS_QUESTIONS`** (`constants.ts`) | `child` | 15 | `BarnfokusFraganPanel` — barnet svarar vid kväll |

Båda är `PLAY` · `children_logs` · **inte** Valv. Parent-rader kan visas som “minnesprompt” för förälder; child-rader roteras i UI.

### Drift (E4)

| Topic | Bank | Kod |
|-------|------|-----|
| Perspektiv | förälder om barn | barn direkt |
| `lens` | 5 (saknar `kunskap`) | 6 inkl. `kunskap` (k1–k3) |
| `bankId` | BP-PLAY-* | `g1`, `n1`, … (ingen bankId) |
| `valv_safe` | 1 parent-rad | 2 child (`v1`, `v2`, `source: valv_curated`) |

### bankId-mapping (plan vid wire)

1. Lägg `audience` + `bankId` i bankschema (se agent `.cursor/agents/specialist-barn-lek.md`).
2. Behåll befintliga kod-id (`g1`…) som `legacy_id`; mappa till `BP-PLAY-06+` när kurator KEEP:ar motsvarande child-copy.
3. Parent BP-PLAY-01–05: antingen separat “förälderprompt”-UI **eller** dual-mode i panel — **PMIR-beslut**.
4. `kunskap`: utöka bank med child KEEP (B1 i dirigent-routing) före wire — annars `kunskap` stannar kod-only.

### Wire-checklista (PMIR)

- [x] PMIR enligt `docs/MERGE-IMPACT-RAPPORT.md` (2026-06-11)
- [x] `npm run smoke:locked-ux` (Barnfokus pool, `valv_safe`, optimistic save)
- [x] Ingen borttagning av `BARNFOKUS_QUESTIONS` — overlay wire via `barnfokusCatalog.ts`
- [x] `barnfokusCatalog.ts` — samma mönster som `dagligMixCatalog.ts`
- [x] **Ej** auto-promote till `reality_vault` · `bankId` i `children_logs` metadata

---

## KEEP — child audience (Fas 6 Agent D, 2026-06-11)

**Status:** bank-only · **ingen wire** · kurator `specialist-barn-lek`.

| id | audience | lens | `legacy_id` | text_sv |
|----|----------|------|-------------|---------|
| BP-PLAY-06 | child | gladje | `g1` | Vad fick dig att skratta idag? |
| BP-PLAY-07 | child | gladje | `g2` | Vad var det bästa med din dag? |
| BP-PLAY-08 | child | kunskap | `k1` | Vet du var regnbågar kommer ifrån? *(hint: Gissa — vi googlar inte i kväll.)* |
| BP-PLAY-09 | child | kunskap | `k2` | Vilket djur tror du sover mest på jorden? |
| BP-PLAY-10 | child | knas | `n1` | Om du fick en superkraft i kväll — vilken? |

Alla: `content_class: PLAY` · `source_tier: product_copy` · `status: KEEP`.

### `legacy_id` ↔ kod (wire-plan)

| `legacy_id` | `bankId` | lens |
|-------------|----------|------|
| `g1` | BP-PLAY-06 | gladje |
| `g2` | BP-PLAY-07 | gladje |
| `k1` | BP-PLAY-08 | kunskap |
| `k2` | BP-PLAY-09 | kunskap |
| `n1` | BP-PLAY-10 | knas |

Alla child `legacy_id` mappade: BP-PLAY-06..21 (MT-1 2026-06-11).

### `barnfokusCatalog.ts` (plan — PMIR)

**Plats:** `src/modules/features/family/children/content/barnfokusCatalog.ts`  
**Mönster:** `dagligMixCatalog.ts` — readonly KEEP-rader, `bankId` + metadata.

```ts
export type BarnfokusCatalogEntry = {
  bankId: string;           // BP-PLAY-06+
  legacy_id: string;        // g1… (rotation key tills migrerat)
  audience: 'child' | 'parent';
  lens: BarnfokusQuestionKind;
  content_class: 'PLAY';
  source_tier: 'product_copy';
  status: 'KEEP';
  text_sv: string;
  hint_sv?: string;
  source?: 'builtin' | 'valv_curated';
};
```

**Wire (PMIR):** `constants.ts` importerar `BARNFOKUS_CATALOG_CHILD` (filter `audience: child`) · `BarnfokusQuestion` får `bankId?` + behåll `id` som `legacy_id` · `handleSaveBarnfokus` ev. `bankId` i logg-metadata (ej Valv).

---

## Våg 27 — Deep Research 2026-06-16 (KEEP)

**Källa:** [`research-cursor-2026-06-16-master-syntes.md`](../../external-ai/imports/research-cursor-2026-06-16-master-syntes.md) · SA-4 Cursor · **Ålder:** evolution_hub bracket

| id | audience | lens | bracket | status | text_sv |
|----|----------|------|---------|--------|---------|
| BP-PLAY-25 | child | kanslor | toddler_preschool | KEEP | Visa tre känsloikoner — peka vilken som passade mest idag. Inget rätt svar. |
| BP-PLAY-26 | child | valv_safe | early_school | KEEP | En trygg sak idag — rita eller skriv ett ord. Max en minut. |
| BP-PLAY-27 | child | reflektion | teen | KEEP | Skriv en rad till din förälder — något du vill att hen ska veta. Du behöver inte skicka det. |
| BP-PLAY-28 | child | lojalitet | pre_teen | KEEP | Om någon ber dig förmedla ett meddelande: "Det där är en vuxenfråga — prata med min andra förälder." Du behöver inte bära det. |
| BP-PLAY-29 | child | valv_safe | early_school | KEEP | Rita eller skriv en person du kan prata med utanför familjen — kurator, Bris eller annan trygg vuxen. |

**MUST NOT:** vuxenkonflikt, diagnos, auto-promote till Valv. **Locked UX:** ändra inte `BARNFOKUS_QUESTIONS` — wire via catalog overlay (våg 29).
