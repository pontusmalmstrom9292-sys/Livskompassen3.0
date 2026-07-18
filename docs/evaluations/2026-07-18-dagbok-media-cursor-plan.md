# Cursor-plan — Dagbok / uppladdning bild + bildtext

**Datum:** 2026-07-18  
**Status:** Fas 1 under körning (Pontus: Kör Fas 1)  
**PMIR:** firestore.rules journal attachment — godkänd via Kör Fas 1

## REASONS

| Bokstav | Innehåll |
|---------|----------|
| **R** | Bilder + valfri bildtext i dagbok (vuxen), barnlivslogg, och alla uppladdningsytor; max 2 bilder; tidslinje + bild+text-vy; Locked UX efter leverans |
| **E** | `CaptionedAttachment`, `attachments[]`, legacy `attachment`, Storage-prefix per silo |
| **A** | Delad `MediaAttachWithCaption` först → journal → barn → Inkast/Valv → lås |
| **S** | `src/modules/shared/media/**`, journal types, firestore.rules, zon-UI |
| **O** | Agenter per våg; smoke:media-attach; MOD-SHARED-MEDIA |
| **N** | WORM, tre silor, ingen dagbok→Valv auto, Barnfokus orörd i Fas 1 |
| **S** | Unlock-doc, smoke asserts, re-lock Fas 5 |

## Fas 1 (denna våg)

- Typer + `MediaAttachWithCaption`
- `firestore.rules`: caption + attachments max 2
- Bakåtkompat läsning
- Agent `specialist-media-attach` + MOD-SHARED-MEDIA developing
