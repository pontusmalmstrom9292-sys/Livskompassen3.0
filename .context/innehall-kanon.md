# Innehållskanon — låst med Grunder (U6)

**Status:** Låst princip (2026-05-25). Konsoliderar U1 silos + Utvecklingszon utan fjärde RAG.

**Register:** [`docs/INNEHALL-REGISTER.md`](../docs/INNEHALL-REGISTER.md) · **Smoke:** `npm run smoke:innehall` (ingår i `smoke:orkester`)

---

## U6 — Innehållszoner (MUST)

| Zon | `content_class` | RAG? | Kurator |
|-----|-----------------|------|---------|
| Kunskap | `FACT` | Ja — `knowledgeVaultQuery` | `specialist-kunskap-seed` |
| Valv | `EVIDENCE` | Ja — `valvChatQuery` | Ingest/HITL — ingen lek-bank |
| Barnen | `EVIDENCE`, `PLAY` | `childrenLogsQuery` — ej Kunskap | `specialist-barn-lek` *(planerad)* |
| Utveckling (Vit) | `REFLECTION`, `PLAY` | **Nej** — ingen export till Kunskap | `specialist-mabra-curator` |

**Dirigent:** `specialist-innehall-dirigent` — klassar, skriver inte innehåll.

---

## MUST NOT

- Fjärde RAG-silo eller “sök överallt”
- LLM skapar `FACT` i prod utan `Kunskap-CONTENT-SEED` + ingest
- LLM skapar frågekort/lek i prod utan `Mabra-CONTENT-BANK` + `bankId` (P1)
- `FACT` i MåBra-bank · `PLAY` som WORM-bevis i Valv
- Auto-ingest `vit_*` → Vector Search / `kampspar`

---

## Content-banker (dokumentsanning)

| Bank | Fil |
|------|-----|
| MåBra | `docs/specs/modules/Mabra-CONTENT-BANK.md` |
| Kunskap | `docs/specs/modules/Kunskap-CONTENT-SEED.md` |
| Barnen lek | `docs/specs/modules/Barnen-PLAY-BANK.md` |

**Runtime prompts:** endast `functions/src/sharedRules.ts` — kuratorer ändrar inte prompts utan explicit order.

---

## Modul ↔ innehåll

| Modul | Tillåtna klasser | Callable / data |
|-------|------------------|-----------------|
| `/mabra` | REFLECTION, PLAY | `mabraCoach`, `mabra_sessions`, `vit_entries` *(P1)* |
| Kunskap/Kompis | FACT | `knowledgeVaultQuery`, `kampspar`, `kb_docs` |
| `/familjen` | PLAY (frågor), EVIDENCE (logg) | `children_logs` |
| Valv/Hamn/Speglar | EVIDENCE, Hamn BIFF | WORM / guardrails |

Se [`arkiv-minne.md`](./arkiv-minne.md) för permanent minne vs Utvecklingszon.
