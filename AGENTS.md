# AGENTS.md — Livskompassen3.0

This file defines how coding agents should work in this repository.

## Principles
- Make minimal, safe, task-scoped changes.
- Follow existing architecture and coding conventions.
- Ask clarifying questions when requirements are ambiguous.

## Hard boundaries
Do not change any of the following without explicit human approval:
- CI/CD workflows
- secrets/auth configuration
- infrastructure/deployment config
- database migrations
- major dependency changes

## Definition of Done
A task is considered done when:
1. Relevant tests are added/updated and passing
2. Lint is passing (if configured)
3. Build/typecheck is passing (if configured)
4. Change summary + verification + risk notes are provided

## Implementation guidance
- Keep controllers/handlers thin; business logic belongs in services.
- Reuse existing utilities before introducing new abstractions.
- Handle errors explicitly; do not swallow exceptions.
- Avoid logging secrets or sensitive personal data.

## Delivery format
When presenting completed work, always include:
1. What changed
2. Why
3. How it was tested
4. Risks / follow-ups
