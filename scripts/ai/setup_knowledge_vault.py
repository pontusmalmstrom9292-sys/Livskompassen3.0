#!/usr/bin/env python3
"""DECOMMISSIONED 2026-07-18 — Vertex Matching Engine / Vector Search.

RAG uses Firestore Native findNearest + @google/genai (GEMINI_API_KEY).
See docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md
"""
from __future__ import annotations
import sys

print(
    "[LOCKED] setup_knowledge_vault.py is disabled — will NOT provision Vertex Vector Search.",
    file=sys.stderr,
)
print(
    "Use Firestore Native findNearest. Re-enabling costs ~$330/month.",
    file=sys.stderr,
)
sys.exit(1)
