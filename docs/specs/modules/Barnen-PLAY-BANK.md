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

**Status:** dokument kanon · **ingen prod-wire** utan PMIR (Fas 4.3 / Agent D).

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

- [ ] PMIR enligt `docs/MERGE-IMPACT-RAPPORT.md`
- [ ] `npm run smoke:locked-ux` (Barnfokus pool, `valv_safe`, optimistic save)
- [ ] Ingen borttagning av `BARNFOKUS_QUESTIONS` utan locked-ux-godkännande
- [ ] Ev. `barnfokusCatalog.ts` genererad från bank — samma mönster som `dagligMixCatalog.ts`
- [ ] **Ej** auto-promote till `reality_vault`

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

Ej mappade ännu: `g3`, `k3`, `n2`–`n3`, `l1`–`l3`, `u1`–`u2`, `v1`–`v2` — nästa kuratorvåg.
