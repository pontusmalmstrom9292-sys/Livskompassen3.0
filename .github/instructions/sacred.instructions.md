---
applyTo: "firestore.rules,storage.rules,functions/src/sharedRules.ts,.context/locked-ux-features.md"
excludeAgent: "cloud-agent"
---

# Sacred paths — PMIR required

These files require **Pre-Merge Impact Report (PMIR)** and explicit owner approval before any change.

- `firestore.rules` / `storage.rules` — WORM, silo boundaries, auth
- `functions/src/sharedRules.ts` — all runtime LLM system prompts
- `.context/locked-ux-features.md` — locked product UX registry

**Copilot cloud agent:** do not open PRs that modify these files autonomously.

For code review: flag any diff here as **CRITICAL** and request PMIR + smoke:valv-security + smoke:locked-ux.
