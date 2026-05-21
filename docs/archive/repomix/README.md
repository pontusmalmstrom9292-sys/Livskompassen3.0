# Repomix — Hela arkivet (historiska snapshots)

Mapp för **externa Repomix-exporter** som jämförs mot nuvarande repo och GCP live (`gen-lang-client-0481875058`).

## Ladda upp filer

Du behöver **inte** exakta datum. Använd beskrivande namn:

```
repomix-okand-hela-projekt.md
repomix-okand-functions-backend.md
repomix-okand-docs-context.md
repomix-krasch-fore-merge.md
```

Alternativ: generera nya lokalt:

```bash
cd Livskompassen2.0
npx repomix --include "functions/**,.context/**,docs/specs/**,firebase.json,firestore.rules" \
  --output docs/archive/repomix/repomix-$(date +%Y-%m-%d)-backend.md
```

**Känslig data:** Redigera bort PII innan filer hamnar här.

## Analys

Per fil skapas `ANALYS-repomix-*.md` (READ-ONLY jämförelse mot repo + [`../GCP-INVENTORY-*.md`](../)).

**Konsoliderad arkitektur (låst):** [`KONSOLIDERING-2026-05-21.md`](./KONSOLIDERING-2026-05-21.md) — gemensamma beslut, unika fynd, GAP P1–P3.

## Baseline (repo)

Nuvarande kod behöver inte Repomix — agenten läser [`Livskompassen2.0/`](../../..) direkt.

**Baseline snapshot i denna mapp:** `repomix-baseline-2026-05-21-backend.md` (genererad från aktivt repo).
