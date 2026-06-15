# Fas 19 — Theme Lab: MåBra + Obsidian Calm inventering

**Datum:** 2026-06-15  
**SPEC:** [`MABRA-3.0-MASTER-SPEC.md`](../specs/modules/MABRA-3.0-MASTER-SPEC.md) §6

---

## Design-gap

| Aspekt | Nuläge | Mål M3.0-B |
|--------|--------|------------|
| Hub L0 | 6 kort `MabraModulValjare` | **8 pelarkort** (Kat 1–8) |
| Tokens | Delvis hex i features | `bg-surface-2`, `calm-card`, `glow-bottom-green` |
| Ikoner | Emoji i hub registry | Pelarikoner Theme Lab (fas 19.4) |

---

## M3.0-B wiring (Fas 19.2)

| Pelare | Route |
|--------|-------|
| Kat 1 Personlig | `daglig_mix` |
| Kat 2 Rörelse | `category: akut` |
| Kat 3 Näring | `tool: self_quiz` |
| Kat 4 Utbildning | `tool: education` |
| Kat 5 Mål | `tool: goals` |
| Kat 6 Prova nytt | `tool: explore_weekly` |
| Kat 7 Identitet | `category: projekt` |
| Kat 8 Återhämtning | `/familjen?tab=drogfrihet` |

Kat 2/3/6 grönt fält — wired till närmaste live verktyg tills M3.0-C.

---

## Hex-drift (fas9 — backlog 19.4)

Prioritera: Oracle/quick capture paths, `MabraHubView` surrounds.  
Smoke: `npm run smoke:design-modules`

---

## Ikon-scope (19.4)

8 pelare · semantiska SVG per `ICON-STYLE-GUIDE.md` — ej D1 ros som tvångsmall.
