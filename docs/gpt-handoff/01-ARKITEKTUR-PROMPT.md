# Pack 01 — Arkitektur + navigation + zonstruktur

**Senast uppdaterad:** 2026-06-15  
Ladda upp `exports/gpt-handoff/repomix/gpt-pack-01-arkitektur.md` till GPT.

Pack-et inkluderar eval-docs: `2026-06-15-arkitektur-nav-analys.md`, `2026-06-15-fas19-masterplan-v2.md`, `LIFE-OS-BUILD-STATE.md`.

---

## Prompt för GPT

Du granskar **Livskompassen v2** — ett neuroanpassat Life OS med tre produktzoner och en PIN-gated Valv-silo.

**Målbild (produkt):** Fyra platser under "Den Trygga Hamnen" — Hjärtat, Familjen, Vardagen, Valvet — plus **Fyren i bakgrunden** (kapacitet, mikrosteg), inte som femte nav-plats.

**Det här pack-et innehåller INTE** dekorativa UI-komponenter (BentoCard, ikoner, assets). Fokus är:

1. **Zonstruktur** — `/hjartat`, `/vardagen`, `/familjen`, `/valvet`, `/planering`, legacy-redirects
2. **Navigation** — `AppRoutes`, `navTruth`, `FloatingDock`, `NavigationDrawer`, `MainLayout`, `LivLauncherGrid`, `FyrenWidgetBar`
3. **App shell** — `App.tsx`, providers, auth gates, vault session lifecycle
4. **State** — `useStore`, `useVaultStore`, `useEvolutionStore`, `useCapacityGate`
5. **Data-silos** — `reality_vault`, `children_logs`, `journal`, `kampspar` i types + `firestore.rules`
6. **AI-koppling** — tre separata callables och RAG-libs (ingen cross-RAG)
7. **G10 Inkast** — `CapturePanel`, `submitInkastLite`, DCAP-routing, `inkastSourceModule` allowlist

### Kartläggning

| Generiskt | Livskompassen |
|-----------|---------------|
| BottomNav | `FloatingDock.tsx` (4 zoner) |
| AppShell | `App.tsx` |
| Router | `AppRoutes.tsx` |
| features/vault | `lifeJournal/evidence/vault/` |
| Smart capture | `src/modules/capture/` + `src/modules/inkast/` |

### Redan implementerat (Våg A — 2026-06-15)

Verifiera att dessa finns i koden — de är **inte** öppna förslag:

| ID | Åtgärd | Effekt |
|----|--------|--------|
| **F1** | Handling bort från `LivLauncherGrid` | −1 dubbelväg till Kanban |
| **F2** | Dock-label **Hjärtat** (inte "Dagbok") | Matchar `NAV_PATHS.HJARTAT` |
| **F4** | Fyren widget: **"Lås upp"** i publikt läge | Plausible deniability ↑ |
| **F5** | `picked=1` på dock-Handling → Kanban direkt | −1–2 klick |

### Uppgift

1. Rita en **zon- och router-karta** (routes, hub-sidor, legacy-redirects).
2. Beskriv **hur navigation fungerar** (dock vs drawer vs launcher vs Fyren vs hub-tabs).
3. Räkna **upplevda mentala hubbar** — jämför mot målbild 4 + bakgrunds-Fyren.
4. Beskriv **hur data är uppdelad** mellan silos.
5. Beskriv **hur AI-funktionerna är kopplade** (callable → agent → collection).
6. Granska **G10 Inkast** — routing till rätt silo, ingen auto-promote till Valv.
7. Verifiera:
   - **Ingen Cross-RAG** mellan Kunskap, Valv och Barnen
   - **Silo-isolering** (separata agents + RAG-libs + guards)
   - **WORM** för `reality_vault` och `children_logs`
   - **Plausible deniability** — drawer + Fyren i publikt läge
   - **Kapacitetsgrind** — styr den global navigation eller bara Ekonomi/Barnporten?

8. Ge rekommendationer för **Våg B** (kräver PMIR):
   - H1: `/ekonomi` → `/vardagen?tab=ekonomi`
   - H2: MåBra endast via Vardagen-ingång
   - H3: deprecate `/arkiv`
   - F3: slå ihop Familjen tab + inputMode (Barnfokus kvar)

9. **Ge INTE kod.** Ge beslutsmemo: Godkänn / Ändra X / Defer.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.

---

## Checklista (självverifiering innan upload)

- [ ] `npm run gpt-handoff:pack:01` körd idag
- [ ] `AppRoutes.tsx`, `navTruth.ts`, `FloatingDock.tsx` finns i pack
- [ ] `capture/`, `inkast/` ingår (G10)
- [ ] `functions/src/index.ts` exporterar tre query-callables + inkast
- [ ] INTE `node_modules`, `public/assets`, `BentoCard`
- [ ] `firestore.rules` ingår
- [ ] Eval-docs (`arkitektur-nav-analys`, `fas19-masterplan-v2`) ingår
- [ ] Pack ~170k tokens (ej hela `index.css` — endast `obsidian-calm-2.css`)
