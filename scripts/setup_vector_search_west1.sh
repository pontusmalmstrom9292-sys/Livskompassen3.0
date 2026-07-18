#!/usr/bin/env bash
# DECOMMISSIONED 2026-07-18 — Vertex AI Vector Search är borttagen.
# RAG = Firestore Native findNearest + GEMINI_API_KEY (@google/genai).
# Se: docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md
set -euo pipefail
echo "[LOCKED] setup_vector_search_west1.sh är spärrad — återaktiverar INTE Vertex Vector Search."
echo "Använd Firestore Native findNearest. Kostnad ~\$330/mån om denna körs."
echo "Kanon: docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md · smoke:cost-guard"
exit 1
