# PHASE-08 — Hygiene audit (read-only)

**Modell:** GPT-5.4 Mini  
**Bifoga:** `chatbot-pack-hygiene.md` + `01-register/DOC-INDEX.md`

---

## UPPDRAG: REPO-HYGIENE-AUDIT-2026-06

1. Bekräfta våg B fillista (~25 evaluations → arkiv) — flagga om smoke eller `.cursor/rules` refererar filen
2. Bekräfta våg D design-arkiv (~400 filer) — MUST NOT-lista från DESIGN-KEEP-REGISTER
3. Föreslå MERGE för uppenbara dubletter (t.ex. `galleri/barnporten/` vs `barnporten/mockups/`)
4. Leverans: `leveranser/2026-06-XX-hygiene-audit.md` med KEEP / ARCHIVE / MERGE per rad

**MUST NOT:** radera filer, ändra prod-kod, `firestore.rules`, locked specs

Jämför mot bifogad repomix. Märk KEEP/DEFER/REJECT. Ett steg i taget.
