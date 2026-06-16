# PHASE-10 — Nav Våg 3 PMIR (read-only)

**Modell:** Claude Opus 4.8  
**Bifoga:** `chatbot-pack-nav-wave3.md` + `chatbot-pack-security.md` (locked UX)

---

## UPPDRAG: NAV-VAG3-PMIR-2026-06

Skriv PMIR enligt `docs/MERGE-IMPACT-RAPPORT.md` för:

| ID | Åtgärd |
|----|--------|
| H1 | `/ekonomi` → redirect `/vardagen?tab=ekonomi` |
| H2 | MåBra-ingång konsolidering |
| H3 | `/arkiv` route/launcher |
| H4 | drogfrihet launcher |

Per rad: följer med / försvinner / regelanalys (locked UX §) / smoke-lista / risk.

**MUST NOT:** prod-kod, firestore.rules, ta bort dock Handling-slot, Fyren som femte tab

Leverans: `leveranser/2026-06-XX-nav-vag3-pmir.md` + ev. `docs/evaluations/2026-06-XX-nav-vag3-pmir.md`

Jämför mot bifogad repomix. Ett steg i taget.
