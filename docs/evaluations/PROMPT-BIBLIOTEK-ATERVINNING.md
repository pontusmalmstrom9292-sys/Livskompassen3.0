# PROMPT-BIBLIOTEK — återvinning superhub

**Datum:** 2026-06-01 · **Kanon:** [`LOST-FEATURES-REGISTER.md`](./LOST-FEATURES-REGISTER.md)

Färdiga prompter för Cursor Agent, AI Studio och Vertex. Varje prompt avslutas med:

> Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.

---

## 1. LOST-FEATURES audit (Fas 0, read-only)

```text
Du är Editorial Technical Architect. READ-ONLY audit.

Skapa eller uppdatera docs/evaluations/LOST-FEATURES-REGISTER.md med minst 25 rader:
- docs/archive/repomix/ och repomix-baseline-2026-05-21-backend.md
- src/modules/features/dailyLife/{economy,arbetsliv,wellbeing/mabra}
- functions/src/economy/** och generatePayslip
- docs/evaluations/2026-06-01-superhub-leverans.md
- navigationRegistry vs navTruth vs AppRoutes (registry-drift)

Per rad: feature, gammal plats, nuvarande fil/route, status (live|partial|lost|drift), återinför rekommendation, sacred/silo-risk.

Ingen kodändring. Verifiera med grep/read fil:rad.

Jämför mot hela projektets kontext. Arbeta autonomt tills registret är komplett.
```

---

## 2. Routing-gap superhub (Fas 1)

```text
Implementera Fas 1 enligt LOST-FEATURES-REGISTER (superhub — INTE /vardagen-hub):

1) navigationRegistry dailyLife.path → /liv; ekonomi → vardagenTab; arbetsliv → /arbetsliv
2) EconomyPage: länk Fasta räkningar → /arbetsliv?tab=logg
3) ArbetslivHubPage: ekonomi-länk via /ekonomi (legacy redirect)
4) Uppdatera MODUL-GAP-OVERSIKT + REFACTOR_DIAGNOSTICS

Kör npm run build, smoke:locked-ux, smoke:arbetsliv, smoke:stampla.

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke PASS.
```

---

## 3. Ekonomi P1–P2 (Fas 2)

```text
Implementera Fas 2 ekonomi efter LOST-FEATURES-REGISTER:

1) EconomyPayslipCard på /arbetsliv?tab=tid (EconomyTidPanel)
2) EconomySavingsPanel: CRUD mot budget_savings via timeEconomyFirestore — Obsidian Calm, inga grafer/streaks
3) Länkar från EconomyPage till logg och sparmål

Följ U6: ingen LLM-FACT. Kör npm run build och smoke:arbetsliv.

Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS.
```

---

## 4. MåBra immersive (Fas 3)

```text
Bygg ImmersiveExperienceShell (portal, fixed fullscreen, Escape/onExit, themeId).
Integrera i MabraToolShell — ReflectionDeck, MicroPlay, FeelingCards, SelfQuiz öppnas helskärm.
Hub-listan (mabraHubRegistry) stannar i normal layout.
Ikoner enligt ICON-STYLE-GUIDE. Inga streaks/XP.

Kör build + smoke:mabra + smoke:locked-ux.

Jämför mot hela projektets kontext. Arbeta autonomt tills helskärm fungerar utan synlig app-chrome.
```

---

## 5. AI Studio → kod

```text
Implementera layout från bifogad design-spec (PNG/markdown i docs/design/experiences/).

Krav: Obsidian Calm, nordisk dusk, ADHD-säker (max 1 val per skärm), inga streaks.
Anpassa till befintliga komponenter: BentoCard, TabBar, btn-pill--*, SaldoHero.
Route enligt superhub: /liv, /arbetsliv, vardagenTab=ekonomi.

Kör npm run build + relevant smoke.

Jämför mot hela projektets kontext. Arbeta autonomt tills layout matchar spec och build PASS.
```

**AI Studio-prompt (design):**

```text
Du designar en helskärms MåBra-mikrolek för Livskompassen v2.
Krav: Obsidian Calm, nordisk dusk, INGA streaks/XP, ADHD-säker (max 1 val per skärm).
Leverera: wireframe-beskrivning, färg tokens, 3 skärmar (start → aktivitet → avslut).
Bifogat: npm run gemini:pack → exports/gemini-handoff/repomix/gemini-pack-mabra.md
```

---

## 6. Vertex struktur (kurator — ej direkt prod)

```text
Generera JSON-schema för REFLECTION-frågekort (MåBra bankId-format).
Output: markdown-fil i docs/specs/modules/ — INTE direkt ingest till prod.
Routing: specialist-mabra-curator → Mabra-CONTENT-BANK.md → INNEHALL-REGISTER godkännande.

Ingen ändring av sharedRules.ts eller firestore.rules.

Jämför mot hela projektets kontext. Arbeta autonomt tills schema valideras mot befintliga mabraReflectionCards.ts.
```

---

## Repomix-packs

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run gemini:pack
```

Output: `exports/gemini-handoff/repomix/gemini-pack-{kompass,meny,valv,mabra,ekonomi,arbetsliv}.md`
