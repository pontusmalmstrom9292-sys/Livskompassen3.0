# Curriculum-mall — Kunskap FACT + MåBra övning

**Kanon:** [`CONTENT-WAVES.md`](./CONTENT-WAVES.md) · **Register:** [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md)

Blandat format: läs FACT-kapitel → gör kopplade frågekort/microspel. **Ingen streak.**

---

## YAML-mall

```yaml
curriculum_id: CUR-EXAMPLE-01
title: "Titel — kurs 1"
wave: 1
theme: adhd_vardag
status: done
chapters:
  - title: "Kapitel rubrik"
    kunskap_fact_id: kunskap-fact-016
    fact_title_sv: "Kort titel (mirror från seed)"
    fact_summary_sv: "1–3 meningar för UI — från seed content"
    citation_hint: "NICE NG87 …"
    mabra_bank_ids:
      - bankId: DM-CARD-01
        kind: reflection
      - bankId: MB-PLAY-05
        kind: play
    cta_label: "Gör övningen"
  - title: "…"
    kunskap_fact_id: kunskap-fact-021
    mabra_bank_ids: [MB-REF-ADHD-01]
bro_links:
  - label: "Kunskapsbank (RAG)"
    route: "/dagbok?tab=bevis&vaultTab=kunskapsbank"
  - label: "Speglar (personlig bearbetning)"
    route: "/dagbok?tab=speglar"
    when: "taktik_konflikt"
```

---

## Regler (U6)

| Fält | Krav |
|------|------|
| `kunskap_fact_id` | MUST finnas i `Kunskap-CONTENT-SEED.md` KEEP |
| `mabra_bank_ids` | MUST finnas i bank + `curriculumCatalog.ts` |
| `bro_links` Speglar/Hamn | Endast för taktik/medföräldraskap — **inte** MåBra-coaching om ex |
| `status` | `open` → `done` efter smoke + manuell granskning |

**Kod:** [`src/modules/wellbeing/mabra/content/curriculumCatalog.ts`](../../src/modules/wellbeing/mabra/content/curriculumCatalog.ts)
