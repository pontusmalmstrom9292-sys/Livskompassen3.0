# Ekonomi-SPEC

Källa: blueprint + Kladd 2026-05-21. Konsoliderad till `.context/modules/ekonomi.md`.

**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §G.

## 1. Syfte och användarbehov

Kognitiv avlastning för vardagsekonomi: veckopeng, matlåda, enkel överblick — **inga grafer**, inga prestationsmått. Skild från forensik (Valv) och livsminne (Kunskap).

## 2. Route och ingång

- **Route:** `/ekonomi` (AuthGate planerad)
- **Dock:** Map
- **Ingång:** FloatingDock + Vardagen-flik ekonomi (planerad)

## 3. UX-flöde (Progressive Disclosure)

**Målbild:**

1. Saldo / veckobudget — en siffra
2. Snabbknappar: matlåda, veckopeng
3. Vinst-knapp — mikro-belöning utan skuld
4. Lista transaktioner (TimelineEntry)

**Idag:** `EconomyPage` shell med placeholder-värden.

## 4. Visuell design (Obsidian Calm)

- `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`
- Inga count-up, streaks, grafer
- Se [`docs/specs/design-master.md`](../design-master.md) §10

## 5. Datamodell (Firestore / Data Connect)

**Planerat:** `transactions`, `budgets` — uid-scoped, separat från `reality_vault`.

**Idag:** inget schema i appen. Data Connect avvaktar (system-plan).

## 6. Backend och agenter

Ingen LLM i MVP. Framtida: valfri sammanfattning via Kunskap — **inte** Livs-Coachen i denna modul.

## 7. Säkerhet

- PII — strikt `ownerId`
- Ingen auto-export till Dossier utan explicit användarval
- Zero Footprint vid unmount (planerat)

## 8. Status idag vs planerat

| Område | Kladd 2026-05-21 | Kod |
|--------|------------------|-----|
| UI shell | Inga grafer | **partial** |
| Veckopeng / matlåda | Notebook | **planned** |
| Vinst-knapp | Kladd §G | **planned** |
| Firestore schema | | **planned** |
| Livs-Coachen här | **Avvisat** | — |

## 9. Acceptanskriterier

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | Inga grafer/streaks | **done** (shell) |
| 2 | SaldoHero synlig | **done** placeholder |
| 3 | Transaktion CRUD | **planned** |
| 4 | uid-scoped rules | **planned** |

## 10. Kopplingar

- **Kunskap** — metod/livscoach — **inte** ekonomidata
- **Dossier** — endast vid explicit juridisk export (planerat)
- **Kompasser** — separata `checkins`

## 11. Navigation

- Dock Map → `/ekonomi`
- Vardagen ekonomi-flik (planerad paritet)

## 12. Tidigare diskussioner att bevara (vision)

- Ekonomi som **lugn** modul — inte ännu en prestationsyta.
- Veckopeng för barn (Kasper/Arvid) som pedagogisk rutin — inte skuld.
- Vinst-knapp = mikro-belöning efter svår vecka (ADHD-vänligt).

## 13. Avvisade eller alternativa idéer

- **Livs-Coachen / RAG i Ekonomi** — avvisat → Kunskap/Kompis.
- **Grafer och diagram** — avvisat (design-master).
- **Gamification** — avvisat (Kladd §G).
- **Gemensam collection med valv** — avvisat.

---

**Module plan:** [`src/modules/ekonomi/module_plan.md`](../../../src/modules/ekonomi/module_plan.md)  
**Flöde:** [`docs/specs/p2-flode.md`](../p2-flode.md)
