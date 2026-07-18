# Minne GCS Archive (Evigt Minne)

**Syfte:** Långsiktig kopia av WORM Minne (`kampspar`, `kb_docs`) — inte 30-dagars Backup.

## Dry-run

```bash
npm run minne:archive:dryrun
```

## Live export (PMIR)

Kräver fras **OK minne apply** + kostnadsräkning. Export-path design:

`gs://livskompassen-minne-archive/worm/{uid}/{collection}/{yyyy}/{docId}.json`

## Chunking (design)

Långa `kb_docs` (>8k tecken): parent-dokument WORM behåller fulltext; child-chunks (valfri collection `kb_doc_chunks`) bär embedding 768 för ANN. Parent = sanningskälla.

## MUST NOT

- Soft-delete Minne för att “spara utrymme”
- Cross-silo archive blandning
- Vertex / Matching Engine
