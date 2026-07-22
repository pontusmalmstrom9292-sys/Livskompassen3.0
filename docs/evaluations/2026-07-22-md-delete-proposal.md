# MD DELETE-förslag — 2026-07-22

**Status:** VÅG 5 — **UTFÖRD 2026-07-22** efter Pontus-OK (`OK radera DELETE-förslag 2026-07-22`).
**Resultat:** 27 filer under `exports/` borttagna via `git rm`. README / `LÄS-MIG.txt` / asset-png kvar. Kanon under `docs/` och `.context/` orörd.
**Regel:** Arkiv-först redan gjort. Detta är endast regenererbara / speglade tracked pack.

## Så godkänner du

Skriv t.ex. `OK radera DELETE-förslag 2026-07-22` i chatten. Då får agenten ta bort listade filer från git (inte Locked UX / `.context` / specs-original).

## Kandidater (tracked under `exports/`)

| Bytes | Path | Motivering |
|------:|------|------------|
| 2396506 | `exports/antigravity/repomix-antigravity-build.md` | Stor regenererbar repomix-snapshot |
| 449788 | `exports/repomix/karnkod-systemplan.md` | Stor regenererbar repomix-snapshot |
| 332075 | `exports/gemini-handoff/valv-upload/00-gemini-pack-valv-repomix.md` | Stor regenererbar repomix-snapshot |
| 137273 | `exports/chatbot-handoff/chatbot-pack-security.md` | Regenererbar handoff-pack |
| 134223 | `exports/chatbot-handoff/ui-design-pack.md` | Regenererbar handoff-pack |
| 90271 | `exports/chatbot-handoff/chatbot-pack-life-os-vision.md` | Regenererbar handoff-pack |
| 84557 | `exports/chatbot-handoff/chatbot-pack-supermodules.md` | Regenererbar handoff-pack |
| 47473 | `exports/chatbot-handoff/chatbot-pack-nav-wave3.md` | Regenererbar handoff-pack |
| 37955 | `exports/cursor-pipeline/agents-pack.md` | Regenererbar handoff-pack |
| 31136 | `exports/chatbot-handoff/ekonomi-dashboard-pack.md` | Regenererbar handoff-pack |
| 27766 | `exports/gemini-handoff/valv-upload/04-locked-ux-features.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 26020 | `exports/cursor-pipeline/copilot-rules-pack.md` | Regenererbar handoff-pack |
| 21806 | `exports/chatbot-handoff/chatbot-pack-design-tokens.md` | Regenererbar handoff-pack |
| 21792 | `exports/chatbot-handoff/chatbot-pack-hygiene.md` | Regenererbar handoff-pack |
| 13269 | `exports/gemini-handoff/valv-upload/02-Verklighetsvalvet-SPEC.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 8579 | `exports/gemini-handoff/valv-upload/05-arkiv-minne-silos.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 3402 | `exports/gemini-handoff/valv-upload/09-master-prompt-ref.md` | Regenererbar handoff-pack |
| 2794 | `exports/gemini-handoff/valv-upload/01-VALV-HUBB-SPEC.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 1485 | `exports/gemini-handoff/valv-upload/06-V1-valv-zone-wireframe.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 1249 | `exports/gemini-handoff/valv-upload/08-V1-PROMPT-klistra-in.md` | Regenererbar handoff-pack |
| 1057 | `exports/gemini-handoff/valv-upload/03-VALV-ICON-KANON.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 930 | `exports/gemini-handoff/valv-upload/07-M2-valv-drawer-copy.md` | Spegel av kanon-spec (original finns under docs/ / .context/) — pack regenereras |
| 774 | `exports/chatbot-handoff/prompts/PHASE-10-nav-wave3-pmir.md` | Pack-kopia av prompt — källa i docs/external-ai eller scripts |
| 751 | `exports/chatbot-handoff/prompts/PHASE-09-life-os-vision.md` | Pack-kopia av prompt — källa i docs/external-ai eller scripts |
| 729 | `exports/chatbot-handoff/prompts/PHASE-08-hygiene-audit.md` | Pack-kopia av prompt — källa i docs/external-ai eller scripts |
| 676 | `exports/chatbot-handoff/prompts/PHASE-12-supermodule-polish.md` | Pack-kopia av prompt — källa i docs/external-ai eller scripts |
| 606 | `exports/chatbot-handoff/prompts/PHASE-11-design-tokens.md` | Pack-kopia av prompt — källa i docs/external-ai eller scripts |

## Utfört

- `git rm` på alla 27 kandidater ovan.
- Regenerera vid behov: `npm run chatbot:pack:handoff`, `npm run gemini:pack:all`, m.fl.

## Explicit INTE i DELETE-listan

- `.context/**`, Locked UX, Sacred, `firestore.rules`
- `docs/evaluations/*unlock*`
- `widget_bible.md`, `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/DOC-INDEX.md`
- Allt under `docs/archive/` (behålls som historik)

## Redan utfört utan permanent DELETE

- Lokala regenererbara speglar borttagna (bifoga untracked, tier-3-repomix, untracked exports)
- ~249 + 154 evaluations **arkiverade** (inte raderade)
- Research-imports + planering-PNG **arkiverade**
