# GPT — Fortsättning efter Cursor arkitekturanalys

**Förutsättning:** Du har redan diskuterat målbild (4 platser, Fyren i bakgrunden) i GPT.  
**Kanon sparad:** [`docs/evaluations/2026-06-15-arkitektur-nav-analys.md`](../evaluations/2026-06-15-arkitektur-nav-analys.md)

---

## Prompt (kopiera till ny GPT-chatt)

Klistra in hela blocket. Ersätt `[KLISTRA IN]` med innehållet från eval-filen (från `# Livskompassen 3.0 — Arkitekturanalys` och nedåt), eller bifoga filen.

```markdown
# Livskompassen 3.0 — Fortsättning: från vision till prioriterad väg

## Bakgrund (du har redan sagt detta — behåll som målbild)

Livskompassen är ett neuroanpassat Life OS, inte en produktivitetsapp.
Målbild:
- Fyra platser under "Den Trygga Hamnen": Hjärtat, Familjen, Vardagen, Valvet
- Fyren = bakgrundssystem (kapacitet, dagsform, kognitiv grind) — INTE en egen plats
- Behåll identitet: Fyren, Valvet, Hjärtat, Familjen, nordisk ceremoniell känsla
- Hjärtat som primär start: god morgon, dagens fokus, nästa mikrosteg
- Valvet publikt: endast 🔒 Låst — inga detaljer, räknare eller länkar före PIN

Största risken: för många mentala lager mellan
"jag är överbelastad" → "jag vet mitt nästa lilla steg".

## Ny input: teknisk verifiering från Cursor (READ-ONLY mot riktig kod)

[KLISTRA IN]

## Låsta produktregler (får INTE brytas utan explicit beslut)

- Barnfokus / FamiljenInputSuperModule / BARNFOKUS_QUESTIONS
- P3 Kanban fast på `/planering?tab=handling`
- Valv: Mönster, Orkester, Kunskapsbank, Aktörskarta bakom PIN
- SaveAsEvidencePrompt — aldrig auto-promote barnlogg → Valv
- WORM: reality_vault, children_logs append-only
- Tre silos — ingen cross-RAG (Kunskap / Valv / Barnen)

## Din uppgift nu

Utgå från BÅDE din tidigare vision OCH Cursor-analysen ovan.

1. **Bekräfta eller justera** din tidigare rekommendation (4 platser, Fyren i bakgrunden, Hjärtat som start) givet vad koden faktiskt visar.

2. **Prioriterad väg i 3 vågor** — arkitektur/navigation, INTE UI-polish:
   - **Våg A** (minsta risk, största kognitiva vinst): max 4 åtgärder
   - **Våg B** (kräver PMIR): route-sammanslagningar, hub-förenkling
   - **Våg C** (strategiskt): Fyren som global kapacitetsmotor

3. För varje åtgärd i Våg A:
   - Vad användaren upplever före/efter (1 mening)
   - Vilka låsta regler som påverkas (ja/nej)
   - Om Cursor-F1/F2/F4/F5 ska ingå — och i vilken ordning

4. **Svara explicit på:**
   - Ska Planering vara egen dock-plats eller bara under Vardagen?
   - Ska Hem (`/`) finnas kvar eller ersättas av Hjärtat?
   - Hur ska Fyren synas i publikt läge utan att bryta plausible deniability?

5. **Ge INTE kod.** Ge en beslutsmemo Pontus kan godkänna med: Godkänn / Ändra X / Defer.

Håll svaret strukturerat och kort nog att jag kan läsa det med trött ADHD-hjärna — max en sida per våg, punktlistor.
```
