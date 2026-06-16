# M2 — Valv-drawer etiketter (Gemini handoff)

**Datum:** 2026-05-30  
**Status:** Delvis integrerat — endast KEEP-rader i prod.

| groupId | Label (prod) | drawerHint (Gemini KEEP) | Status |
|---------|--------------|--------------------------|--------|
| `valv_grp_samla` | Samla | Objektiv registrering av skriftliga meddelanden och logistik. | **Integrerad** |
| `valv_grp_analysera` | Analysera | Strukturerad kartläggning av återkommande mönster och beteenden. | **Integrerad** |
| `valv_grp_kunskap` | Kunskapsbank | RAG-underlag, lagrum och verifierad aktörskarta (G9). | **Integrerad** (hint) |
| `valv_grp_exportera` | Exportera | Sammanställning av material för manuell delning med juridisk part. | REJECT — låst zonnamn |
| `valv_grp_forensik` | Forensik | Tidsstämplat material med obruten versionshistorik. | **Integrerad** (hint) |

Övriga grupper behåller befintliga `drawerHint` i `navTruth.ts`.
