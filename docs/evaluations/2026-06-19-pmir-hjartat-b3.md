# Pre-Merge Impact Report (PMIR) — Hjärtat B3 progressive disclosure

**Datum:** 2026-06-19  
**Gren:** `cursor/hjartat-b3-polish-7746`  
**Agent:** specialist-hjartat-inkast-builder (B3 polish)

---

## Syfte

Progressive disclosure för Hjärtat (Dagbok + Speglar) — samma mönster som Valv A2.x:

- **Primär:** reflektion / spegling synlig först
- **Sekundär:** tips, bevis, avancerat i `CalmCollapsible`
- Obsidian Calm-tokens (`glow="gold"` Hjärtat, `glow="blue"` forensik)

---

## Följer med till gren

| Fil | Ändring |
|-----|---------|
| `DagbokReflektionDelegate.tsx` | Wizard primär; tips i CalmCollapsible |
| `ReflectionStep.tsx` | Röst + gaslighting-handoff i fold; detaljer via JournalDetailsPanel |
| `JournalDetailsPanel.tsx` | Migrerad till CalmCollapsible (kategori & minne) |
| `ConfirmStep.tsx` | Märkning, weave-opt-in, Vävaren-hint i fold |
| `SpeglingsSystem.tsx` | ACT primär; tips/session/forensik-sekundär i fold |
| `SpeglarSuperModule.tsx` | Kommentar B3 (ingen beteendeförändring) |

---

## Oförändrat (MUST)

- Zero Footprint: `clearSpeglarSession`, `handleClearSession`, forensic `resetSession`
- WORM-skrivningar via befintliga API:er (`useJournalFlow`, `saveVaultLog`)
- Locked UX: wizard-steg, VIVIR, Hamn-länk, WeaverApproval, vault-gate
- Inga ändringar i `firestore.rules`, `sharedRules.ts`, andra zoner

---

## Regelanalys

| Lager | Status |
|-------|--------|
| Tre silos / ingen cross-RAG | PASS — inga nya queries |
| DCAP före LLM | PASS — oförändrat |
| Zero Footprint | PASS — session clear kvar |
| Obsidian Calm | PASS — CalmCollapsible + semantiska tokens |
| Locked UX | PASS — smoke:locked-ux |

---

## Smoke (efter implementation)

| Kommando | Förväntat |
|----------|-----------|
| `npm run build` | PASS |
| `npm run smoke:locked-ux` | PASS |

---

## Risk

| Risk | Bedömning |
|------|-----------|
| Dold kritisk funktion | Låg — spara/confirm alltid synligt |
| Regression Speglar smoke | Låg — VivirQuickEntry/SvartPaVitt kvar i fil |
| ADHD overload | Minskad — färre synliga block vid start |

---

## Rekommendation

- [x] Merge till `main` efter smoke PASS + Pontus OK
- [ ] Deploy hosting vid godkännande (`firebase deploy --only hosting`)

---

## Godkännande

**Användaren:** ☐ godkänn merge  
**Datum:** ___
