# Pack 01 — Arkitektur + navigation + zonstruktur

Ladda upp `exports/gpt-handoff/repomix/gpt-pack-01-arkitektur.md` till GPT.

---

## Prompt för GPT

Du granskar **Livskompassen v2** — ett personligt Life OS med tre produktzoner och en PIN-gated Valv-silo.

**Det här pack-et innehåller INTE** dekorativa UI-komponenter (BentoCard, ikoner, assets). Fokus är:

1. **Zonstruktur** — hur `/hjartat`, `/vardagen`, `/familjen`, `/valvet`, `/planering` hänger ihop
2. **Navigation** — `AppRoutes`, `navTruth`, `FloatingDock` (ej BottomNav), `NavigationDrawer`, `MainLayout`
3. **App shell** — `App.tsx`, providers, auth gates, vault session lifecycle
4. **State** — `useStore`, `useVaultStore`, `useEvolutionStore`, `useCapacityGate`
5. **Data-silos** — `reality_vault`, `children_logs`, `journal`, `kampspar` i types + firestore
6. **AI-koppling** — tre separata callables och RAG-libs (ingen cross-RAG)

### Kartläggning

| Generiskt | Livskompassen |
|-----------|---------------|
| BottomNav | `FloatingDock.tsx` |
| AppShell | `App.tsx` |
| Router | `AppRoutes.tsx` |
| features/vault | `lifeJournal/evidence/vault/` |

### Uppgift

1. Rita en **zon- och router-karta** (vilka routes, vilka hub-sidor, vilka legacy-redirects).
2. Beskriv **hur navigation fungerar** (dock vs drawer vs hub-tabs).
3. Beskriv **hur data är uppdelad** mellan silos.
4. Beskriv **hur AI-funktionerna är kopplade** (vilken callable → vilken collection).
5. Verifiera:
   - **Ingen Cross-RAG** mellan Kunskap, Valv och Barnen
   - **Silo-isolering** (separata agents + RAG-libs + guards)
   - **WORM** för `reality_vault` och `children_logs`
   - **Plausible deniability** — Valv-länkar i publikt läge

6. Ge rekommendationer om:
   - vilka moduler som bör slås ihop
   - vilka som bör brytas ut till supermoduler
   - hur Life OS-flödet kan förenklas
   - onödig kognitiv belastning i navigation

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.

---

## Checklista (självverifiering innan upload)

- [ ] `AppRoutes.tsx` finns i pack
- [ ] `navTruth.ts` + `FloatingDock.tsx` finns
- [ ] `functions/src/index.ts` exporterar tre query-callables
- [ ] INTE `node_modules`, `public/assets`, `BentoCard`
- [ ] `firestore.rules` ingår
- [ ] Pack ~130k tokens (ej hela `index.css` — endast `obsidian-calm-2.css` för tokens)
