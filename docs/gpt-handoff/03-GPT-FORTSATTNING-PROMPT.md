# GPT — Fortsättning efter Våg A (Våg B-beslut)

**Senast uppdaterad:** 2026-06-15  
**Förutsättning:** Pack 01 granskat. Våg A (F1, F2, F4, F5) **implementerad + deployad**.  
**Kanon:** [`docs/evaluations/2026-06-15-arkitektur-nav-analys.md`](../evaluations/2026-06-15-arkitektur-nav-analys.md)  
**Körplan:** [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](../evaluations/2026-06-15-fas19-masterplan-v2.md)

---

## Prompt (kopiera till ny GPT-chatt)

Klistra in hela blocket. Ersätt `[KLISTRA IN]` med relevanta avsnitt från eval-filen (§1–§8), eller bifoga filen.

```markdown
# Livskompassen 3.0 — Våg B: från Våg A till prioriterad väg

## Bakgrund (målbild — oförändrad)

Livskompassen är ett neuroanpassat Life OS, inte en produktivitetsapp.

Målbild:
- Fyra platser: Hjärtat, Familjen, Vardagen, Valvet
- Fyren = bakgrundssystem (kapacitet, dagsform, kognitiv grind) — INTE en egen plats
- Hjärtat som primär start: god morgon, dagens fokus, nästa mikrosteg
- Valvet publikt: endast 🔒 / "Lås upp" — inga detaljer före PIN

## Våg A — KLART 2026-06-15

| ID | Åtgärd | Status |
|----|--------|--------|
| F1 | Handling bort från launcher | ✅ Deployad |
| F2 | Dock "Hjärtat" (inte Dagbok) | ✅ Deployad |
| F4 | Fyren "Lås upp" i publikt läge | ✅ Deployad |
| F5 | `picked=1` → Kanban direkt | ✅ Deployad |

Smoke: `locked-ux` PASS · hosting live.

## Teknisk verifiering (READ-ONLY mot riktig kod)

[KLISTRA IN — arkitektur-nav-analys §1–§8]

## Levande build-state (2026-06-15)

| Komponent | Status |
|-----------|--------|
| Security core (WORM + vault) | LOCK (CP-1) |
| G10 Inkast backend + UI | LOCK (CP-3, CP-4) |
| Upload unified DirectPanel | WIP — defer |
| Fas 19.2–19.6 (MåBra hybrid-8, hex→tokens, evolution_ledger) | Planerad |

## Låsta produktregler (får INTE brytas utan explicit beslut)

- Barnfokus / FamiljenInputSuperModule / BARNFOKUS_QUESTIONS
- P3 Kanban fast på `/planering?tab=handling`
- Valv: Mönster, Orkester, Kunskapsbank, Aktörskarta bakom PIN
- SaveAsEvidencePrompt — aldrig auto-promote barnlogg → Valv
- WORM: reality_vault, children_logs append-only
- Tre silos — ingen cross-RAG (Kunskap / Valv / Barnen)

## Din uppgift nu — Våg B (kräver PMIR)

Utgå från målbilden OCH att Våg A redan är live.

1. **Prioritera Våg B** (max 4 åtgärder, ordnad):
   - H1: `/ekonomi` → `/vardagen?tab=ekonomi`
   - H2: MåBra endast via Vardagen (ta bort parallell mental hub)
   - H3: deprecate `/arkiv`
   - F3: slå ihop Familjen tab + inputMode (Barnfokus default)

2. För varje åtgärd:
   - Vad användaren upplever före/efter (1 mening)
   - Locked UX påverkad? (ja/nej — vilken §)
   - Smoke som måste PASS efter merge
   - Risk: låg / medel / hög

3. **Strategiska beslut (Våg C — defer om osäkert):**
   - B1: Fyren = kapacitetsring, inte 8-nav-panel
   - B2: Global kapacitetsgrind döljer launcher vid låg kapacitet
   - B3: Kompis-knapp → Speglar/Hem, inte Kunskapsbank i publikt läge

4. **Svara explicit på:**
   - Ska `/` (Hem) ersättas av Hjärtat som default route?
   - Ska Planering vara egen dock-plats eller enbart Vardagen-tab? (nu: egen dock-slot)
   - Hur balanseras Fas 19.2 (MåBra hybrid-8) mot nav-förenkling?

5. **Ge INTE kod.** Ge beslutsmemo Pontus kan godkänna: Godkänn / Ändra X / Defer.

Håll svaret strukturerat — max en sida per våg, punktlistor. ADHD-vänligt.
```

---

## Efter GPT-svar

1. Spara beslut i `docs/evaluations/` (ny fil med datum).
2. Skriv PMIR per [`docs/MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) innan Våg B-kod.
3. Kör `npm run smoke:locked-ux` efter varje nav-ändring.
