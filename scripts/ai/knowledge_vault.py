#!/usr/bin/env python3
"""DECOMMISSIONED 2026-07-18 — Vertex Matching Engine client.

Production RAG is TypeScript Cloud Functions:
  Firestore Native findNearest + generateEmbeddingInternal (GEMINI_API_KEY).

See docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md
"""
from __future__ import annotations
import sys

print(
    "[LOCKED] knowledge_vault.py is disabled — Vertex Vector Search client removed.",
    file=sys.stderr,
)
print("Use Cloud Functions knowledgeVaultQuery / kampsparQueryRag instead.", file=sys.stderr)
sys.exit(1)
