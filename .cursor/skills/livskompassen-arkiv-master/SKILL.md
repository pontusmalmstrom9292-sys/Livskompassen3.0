---
name: livskompassen-arkiv-master
description: Editorial review of Hela arkivet / Life OS memory architecture. Use for cross-module memory, permanent minne, three silos, Dossier vs RAG, or final review before merge.
---

# Livskompassen — Arkiv Master

## Canonical sources (read first)

- [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md)
- [`docs/specs/incoming/Arkiv-SPEC.md`](../../docs/specs/incoming/Arkiv-SPEC.md)
- [`docs/archive/GCP-INVENTORY-2026-05-21.md`](../../docs/archive/GCP-INVENTORY-2026-05-21.md)
- [`docs/archive/repomix/KONSOLIDERING-2026-05-21.md`](../../docs/archive/repomix/KONSOLIDERING-2026-05-21.md)

## MUST

- Preserve three silos: Kunskap (`kampspar`+`kb_docs`) | Valv (`reality_vault`) | Barnen (`children_logs`).
- Treat WORM collections as permanent minne — never auto-delete.
- Dossier = aggregated export; Kunskap RAG ≠ Hela arkivet.

## MUST NOT

- Merge Valv-Chat and Kunskap into one RAG.
- Route barnfrågor through Valv-Chat.
- Trust legacy Python RAG (us-central1) as canonical without review.

## Review checklist

1. Does change respect `.context/arkiv-minne.md`?
2. GCP live state documented if touching RAG/Vector?
3. Gap registered in `Arkiv-GAP-REGISTER.md` if not implementing?

Jämför mot hela projektet. Sluta inte förrän konsekvent med arkiv-minne.
