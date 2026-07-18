# Audit — client create till kampspar / kb_docs

**Datum:** 2026-07-18 · **Våg:** v58

## Resultat: PASS (noll client create)

| Path | Write? | Notes |
|------|--------|-------|
| `src/.../firestore.ts` subscribe/getKampspar / getKbDocs | **read only** | onSnapshot / getDocs |
| `ingestKampsparEntry` / `ingestKnowledgeDocument` | Admin via callable | OK |
| `persistKbDocFromDrive` / inbox confirm | Admin | OK |
| `promoteKbDocToKampspar` | Admin | OK |
| Direct `addDoc` till kampspar/kb_docs i `src/` | **inga träffar** | |

## Slutsats

Redo för Admin-only rules (`allow create: if false`) efter `OK rules`.
