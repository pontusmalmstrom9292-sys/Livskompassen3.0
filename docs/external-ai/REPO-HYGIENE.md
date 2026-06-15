# REPO-HYGIENE — kontinuerlig städning

Städa **medan** vi bygger. **Arkiv-först** — aldrig massradering utan lista i `HYGIENE-LOG.md`.

## Tre klasser

| Klass | Åtgärd |
|-------|--------|
| **KEEP** | Behåll — registrera i `DESIGN-KEEP-REGISTER.md` |
| **ARCHIVE** | Flytta till `docs/archive/YYYY-MM/` |
| **DELETE** | Endast tomma/trasiga placeholders efter ARCHIVE eller uppenbart säkert |

## Vid varje CHECKPOINT (steg 9)

1. Lista nya/ändrade filer sedan förra CP
2. Klassificera KEEP / ARCHIVE / DELETE (GPT-5.4 Mini eller Cursor)
3. Skriv rad i `HYGIENE-LOG.md`
4. Flytta ARCHIVE — radera inte design-historik direkt
5. Uppdatera `DESIGN-KEEP-REGISTER.md`

## Dedikerad design-audit

- **CHECKPOINT-2** (mellan SPEC och kod) eller **CHECKPOINT-7** (final)
- Modell: Opus 4.8 eller GPT-5.4 Mini
- Uppdrag: *Lista filer i docs/design som inte refereras av KEEP-register eller kod — föreslå ARCHIVE.*

## Mappar att städa löpande

| Mapp | Åtgärd |
|------|--------|
| `docs/design/icons-proposals/` | ARCHIVE (ej valda SVG) |
| `docs/design/redesign-proposals/` | ARCHIVE |
| `docs/design/themes/` (utom aktiv) | ARCHIVE → `docs/archive/design-2026-06/` |
| `docs/evaluations/` (duplicerade) | ARCHIVE om ersatta av fas19-masterplan-v2 |
| `exports/` | OK rensa lokalt — regenereras med pack |

## Förbjudet utan PMIR

- Radera locked UX-specs
- Radera `.cursor/rules` refererade specs
- Mass-delete `docs/design/` utan KEEP-register

Se [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md).
