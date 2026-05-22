# Modul — ekonomi

**Route:** `/ekonomi` | **Collections:** `transactions`, `economy_profiles`

## PASS

- Firestore WORM `transactions` L95–99
- `economy_profiles` per uid
- Ekonomi-SPEC + `.context/modules/ekonomi.md`
- Data Connect avvaktas — Firestore kanon

## GAP

- Ingen dedikerad smoke-script i byggpass-kedjan
- Full ekonomi-RAG ej scope MVP

## Sacred / säkerhet

Ej Sacred Feature. WORM transactions **PASS**. Ingen cross-silo.

## Rekommenderat

Manuell smoke: spara transaktion i UI.
