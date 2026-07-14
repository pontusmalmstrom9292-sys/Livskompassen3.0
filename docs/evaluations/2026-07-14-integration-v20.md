# Integration dry-run v20 — P161

**Datum:** 2026-07-14  
**Agent:** marathon-arkiv (integration dry-run)  
**Fas:** P161

## Smokes (obligatoriska)

| Smoke | Resultat |
|-------|----------|
| `smoke:innehall` | **PASS** — register, kanon, domän-specialister |
| `smoke:content-waves` | **PASS** — våg 9–16 + curriculum catalog |

## Dry-run (ingen --apply)

| Steg | Resultat | Not |
|------|----------|-----|
| `integration:preflight` | **PARTIAL** | `integration:sync:all` exit 1 — saknad källa `docs/external-ai/bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md` i `gemini:sync:kunskap`; `smoke:mdc` + `smoke:projekt-regler` **PASS** vid separat körning |
| `seed_kampspar_profile.mjs --dry-run` | **PASS** | 47 poster, inget skrivet |

## PMIR-scan

| Resurs | Status |
|--------|--------|
| Live Kunskap-ingest (`--apply`) | **SKIP** — ej körd |
| `firestore.rules` / `storage.rules` | ej rörd |
| Deploy | ej utförd |

## Kodändringar (P161)

**Inga** — integration dry-run utan live ingest.

## Verdict

**GO** — obligatoriska smokes gröna, seed dry-run grön. Preflight-sync har känd saknad källa (ej blockerande för innehållsintegration). Startgate → P162 yolo-vakt slutgate.
