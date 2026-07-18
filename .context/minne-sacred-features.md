# Minne Sacred Features (Evigt Minne)

**MUST**
1. Text+metadata = sanningskälla; embeddings = härledda (kan återskapas).
2. Append-only forever — ingen update/delete av innehåll.
3. Korrektion = ny doc med `supersedesDocId` (ej soft-delete).
4. Auto till Kunskap endast via grindar (trauma, conf, FACT, silo).
5. Journal → Minne endast `optIn === true`.
6. Barn/widget/Vit aldrig auto till `kb_docs`.
7. Cost-guard: `aiplatform` blocked; setup-scripts exit 1.
8. Stack: Firestore Native findNearest + Gemini embed + lexical hybrid.

**MUST NOT**
1. Återaktivera Vertex / Matching Engine / setup_vector_search*.
2. Soft-delete eller städjobb som raderar Minne.
3. Cross-RAG Valv↔Kunskap↔Barnen.
4. Mock-WORM eller fri client create utan schema (mål: Admin-only create).
5. Betald vektordatabas utan PMIR + budget-OK.
6. Följa stale Vertex-instruktioner framför DECOMMISSION-runbook.

**YOLO**
- Auto: v55–v60 (`npm run minne:yolo:build`)
- Paus: `OK rules` → v61 · `OK deploy` → v62
