# Hub-analys och ombyggnad — leverans (2026-05-31)

**Plan:** hub-analys och ombyggnad (8 hubbar + syntes + Fas 1)

---

## Våg 0 — Baseline

PASS — se `2026-05-31-hub-baseline.md`

---

## Våg 1 — Analyser (8 filer)

| Fil | Hub |
|-----|-----|
| `2026-05-31-hub-kompass-analys.md` | Hem, drawer, Fyren |
| `2026-05-31-hub-dagbok-analys.md` | Dagbok, Speglar, Vävaren |
| `2026-05-31-hub-vardag-analys.md` | Vardagen, MåBra |
| `2026-05-31-hub-familjen-analys.md` | Familjen, Barnporten |
| `2026-05-31-hub-gora-analys.md` | Göra, Planering, Projekt |
| `2026-05-31-hub-arbetsliv-analys.md` | Arbetsliv |
| `2026-05-31-hub-trygghet-analys.md` | Hamn, Drogfrihet |
| `2026-05-31-hub-valv-analys.md` | Valv-zon |

---

## Våg 2 — Syntes

`2026-05-31-hub-syntes-nav.md`

---

## Våg 3 — Ombyggnadsplaner (Fas 1)

`2026-05-31-{kompass,dagbok,vardag,familjen,gora,arbetsliv,trygghet,valv}-ombyggnad-plan.md`

---

## Våg 4 — Implementerad kod (Fas 1)

| Område | Ändring |
|--------|---------|
| Header | Dagbok/Arkiv/Göra etiketter |
| Göra | Default kanban; verktyg `?tab=hub` |
| Trygghet | Drogfrihet tab-labels; Hamn «Till Speglar» |
| Arbetsliv | Ekonomilogg; ikoner; Tid utan dubbel stämpel |
| Valv | Weaver-badge `valv_samla`; Monster copy |
| Familjen | Barnporten i hubContextBar |
| Dagbok | Wizard unmount cleanup |
| Kompass | Fyren `/projekt/ny`; drawer footer hint |
| Hamn | BiffTriage riskScore normalisering |

**Smoke efter implementering:** build, locked-ux, design-modules, orkester, arbetsliv — **PASS**

**Deploy:** endast **hosting** (`firebase deploy --only hosting`) — inga functions/rules ändrade.

---

## Kvar (PMIR / manuellt)

- Fas 5A manuell prod (#3, #4, #2d)
- Barnporten kanon-UI §7b
- Dubbel TabBar på Planering (Fas 2)
- Doc-synk module_plan / specs
