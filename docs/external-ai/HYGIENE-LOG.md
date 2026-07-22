# HYGIENE-LOG

KEEP / ARCHIVE / DELETE / **REJECT** (ChatBox-förslag som bryter låst UX).  
Flytta/radera **inte** utan Pontus-OK + PMIR.

| Datum | CP | Fil/mapp | Beslut | Destination | Anteckning |
|-------|-----|----------|--------|-------------|------------|
| 2026-06-15 | CP-7 | `docs/design/icons-proposals/` (~215 SVG) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/icons-proposals/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/redesign-proposals/` (STYLE A/B/C) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/redesign-proposals/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/themes/` (ej `phone-icon-variants/`) | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/themes/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/compact/` | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/compact/` | DESIGN-KEEP |
| 2026-06-15 | CP-7 | `docs/design/planering/variants/*.png` | **ARCHIVE-kandidat** | `docs/archive/design-2026-06/planering-variants/` | **KEEP** `PLANERING-P3-KANBAN-SPEC.md` |
| 2026-06-15 | CP-7 | `docs/external-ai/leveranser/*.rtf` | **ARCHIVE-kandidat** | `docs/archive/external-ai-2026-06/` | ChatBox RTF-export |
| 2026-06-15 | CP-7 | `docs/external-ai/docs:external-ai:*` (fel filnamn) | **DELETE** | — | Städad 2026-06-15 |
| 2026-06-16 | Handoff | `docs/archive/evaluations-fas22-2026-06/` (21 eval) | **ARCHIVE** | — | PMIR wave B |
| 2026-06-16 | Handoff | `docs/archive/design-2026-06/*` | **ARCHIVE** | — | PMIR wave D — KEEP register |
| 2026-06-16 | Handoff | `docs/archive/root-2026-06/` (5 rot-md) | **ARCHIVE** | — | PMIR wave C |
| 2026-06-16 | Handoff | Legacy `DagbokSuperModule` (features/diary) | **ARCHIVE** | `code-legacy-2026-06/` | LazyDiary → Hjärtat länk |

| 2026-07-22 | Doc-kanon | `docs/external-ai/bifoga/` speglor (52 untracked), `gemini-kunskap` tier-2/3/kanon speglor, untracked `exports/**/*.md` | **DELETE (local regenerable)** | — | Spår B våg 1 — återskapas med chatbot:sync / gemini:sync / pack-skript. Tracked exports orörda → DELETE-lista våg 5. |

| 2026-07-22 | Doc-kanon | `docs/evaluations/*` (249 st, pre-juli) | **ARCHIVE** | `docs/archive/evaluations-pre-2026-07/` | Spår B våg 2 — unlock/fas24/2026-07+ kvar |
| 2026-07-22 | Doc-kanon | juli sessionloggar (154 st) | **ARCHIVE** | `docs/archive/evaluations-2026-07-session-logs/` | Spår B våg 3 — YOLO/security/drift/ux-guardian |
| 2026-07-22 | Doc-kanon | `docs/external-ai/imports/research-*` m.fl. (23) | **ARCHIVE** | `docs/archive/external-ai-imports-2026-06/` | Spår B våg 3 — klistra-in-mål kvar |
| 2026-07-22 | Doc-kanon | `docs/design/planering/variants/*.png` (4) | **ARCHIVE** | `docs/archive/design-2026-06/planering-variants/` | Spår B våg 3 — README-stub kvar |
| 2026-07-22 | Doc-kanon | `.cursorignore` omskriven | **KEEP** | — | Spår A — kanon indexeras; archive/exports/kalla evals ut |

| 2026-07-22 | Doc-kanon | 27 tracked `exports/**` (DELETE-förslag) | **DELETE** | — | Pontus-OK: `OK radera DELETE-förslag 2026-07-22`. README/LÄS-MIG kvar. |

## ChatBox PHASE-07 — granskade förslag (REJECT)

| ChatBox föreslog | Beslut | Varför |
|------------------|--------|--------|
| `docs/design/VALV-HUBB-SPEC.md` → arkiv | **REJECT** | KEEP — Valv hub, locked UX |
| `docs/design/galleri/widget/v2/` → arkiv | **REJECT** | KEEP — W1–W4 locked hybrid |
| `docs/design/references/MENU-DRAWER-KANON.md` → arkiv | **REJECT** | KEEP — drawer design lock |
| `docs/design/barnporten/mockups/` → arkiv | **REJECT** | KEEP — `barnporten-inkorg-valv-kanon.png` m.fl. |
| `docs/design/themes/obsidian-depth/` | **SKIP** | Mappen finns ej i repo (ej verifierat) |
| `docs/design/planering/` (hela) → arkiv | **REJECT** | KEEP spec; endast `variants/` PNG kandidat |

Källa: [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md) · ChatBox rå: [`leveranser/2026-06-15-fas-07-chatbox-raw.md`](./leveranser/2026-06-15-fas-07-chatbox-raw.md)
