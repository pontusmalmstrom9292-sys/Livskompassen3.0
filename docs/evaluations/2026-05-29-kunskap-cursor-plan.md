# Kunskap UX — genomförbarhetsplan (Cursor, utan Vertex)

**Datum:** 2026-05-29  
**Metod:** Gap-analys mot live kod + U1 silo  
**Kanon:** [`docs/specs/modules/Kunskap-SPEC.md`](../specs/modules/Kunskap-SPEC.md) · [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md)  
**Kod:** `src/modules/evidence/kompis/` · `src/modules/evidence/knowledge/`  
**Skills:** `livskompassen-rag-retrieval`, `livskompassen-memory-silo-guard`  
**Mall:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)

---

## Slutsats

**Kunskapsvalv RAG + klickbara citations är live.** `VaultKunskapsbankPanel` monterar `KunskapPage` + Familjen-upload bakom Valv-PIN.

**Nästa steg är polish (Fas 1.5)** — tydligare tom-state, felhantering, Tidshjul-highlight — **inte** ny RAG eller auto-ingest Kladd.

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Kunskap silo only; citations till Minne; PIN-gated Valv |
| **Entities** | `kampspar`, `kb_docs`; callable `knowledgeVaultQuery` |
| **Approach** | UX polish på befintlig chat; ingen fjärde silo |
| **Structure** | Valv tab `kunskapsbank`; legacy `/kunskap` redirect |
| **Operations** | RAG + ingest opt-in |
| **Norms** | FACT via seed-bank only (U6) |
| **Safeguards** | Aldrig cross-RAG Valv/Barnen |

---

## Vad som redan fungerar

| Krav | Kod |
|------|-----|
| RAG chat | `KnowledgeVaultChat`, `knowledgeVaultQuery` |
| Klickbara citations | `KnowledgeCitationList`, Tidshjul focus |
| Valv-panel | `VaultKunskapsbankPanel` i `VaultPage` |
| Familjen scoped sök | `FamiljenKunskapHubTab` |
| Vector ANN | G2/G3 done (Arkiv-GAP) |

---

## Gap-analys (spår 5 vs kod)

| nasta-fas spår 5 | Kod idag | Gap |
|------------------|----------|-----|
| Klickbara citations | Ja | **Ingen** |
| VaultKunskapsbank polish | Bas-UI | **Fas 1.5** — tom-state, felcopy, loading |
| Policy: ej auto-ingest Kladd | Ja | **Ingen** |
| Dagbok→kampspar | Opt-in G7 only | **Policy** — oförändrad |

---

## Bevaras (MUST NOT regress)

- Kunskap UI bakom Valv PIN (locked UX)
- Ingen auto-ingest Kladd till `kampspar`
- Prompts endast i `sharedRules.ts`
- U1: `knowledgeVaultQuery` läser endast Kunskap-silo

---

## Fas 1.5 — UX polish (ingen backend)

| # | Leverans |
|---|----------|
| 1 | `VaultKunskapsbankPanel` — tydlig tom-state + retry vid nätverksfel |
| 2 | `KnowledgeVaultChat` — citation-fokus scroll/highlight förbättring |
| 3 | `KunskapPage` embedded-läge — kompaktare header i Valv |

**Acceptans**

- [x] Tom-state och felhantering testad manuellt
- [x] Citation-klick → Tidshjul/post fungerar
- [x] `npm run smoke:kunskap` + `smoke:orkester` PASS (batch 2026-05-29)
- [x] Ingen U1/U6-brott

---

## Fas 2 — Innehåll (kuraterat)

- Nya FACT endast via `specialist-kunskap-seed` → `Kunskap-CONTENT-SEED.md`
- **Ej** LLM-genererad FACT i prod

---

## Nästa steg

Svara **`kör Kunskap Fas 1.5`** för Valv-panel polish.
