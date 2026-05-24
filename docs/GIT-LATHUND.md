# Git-lathund — Livskompassen (1 sida)

**Version:** 2026-05-24 · Skriv ut och lägg vid datorn.

**Helhet (moduler + öppet + silos):** [`KOMPASS-MINNESKARTA.md`](./KOMPASS-MINNESKARTA.md)

---

## Var bor sanningen?

| Vad | Var |
|-----|-----|
| Kod du jobbar i | `~/StudioProjects/Livskompassen3.0` |
| Molnet (backup) | GitHub **Livskompassen3.0** → branch **`main`** |
| Gammalt repo | `origin-old` (2.0) — titta, **pusha inte** |
| App-data | Firebase/GCP — inte GitHub |
| Plan / fas | `.context/system-plan.md` |
| Låst UX | `.context/locked-ux-features.md` |
| Grenstatus | `docs/BRANCH-KARTA.md` |
| Merge-beslut | `docs/MERGE-IMPACT-RAPPORT.md` (mall) |

---

## Daglig rutin (3 steg)

1. `git checkout main` && `git pull --ff-only origin main`
2. Jobba i Cursor — spara (`Cmd + S`)
3. Klart → *"Committa och pusha main"* eller *"Synka main — PMIR"*

---

## När agenten ska hjälpa dig städa

| Du säger | Agent gör |
|----------|-----------|
| *"Förbered merge av [gren] till main"* | Skriver **PMIR** (följer med / försvinner / regelanalys) |
| *"godkänn merge"* | Merge, smoke, push, ev. stäng gren |
| *"Är jag på rätt branch?"* | Visar branch, remote, parked grenar |
| *"Kör check:main-trunk"* | Branch + remote + `smoke:locked-ux` (ingen push) |

Regel (alltid aktiv): `.cursor/rules/git-main-trunk.mdc`

---

## Gör aldrig

- Ny branch för vardagsjobb
- `git push origin-old`
- `git push --force` på `main`
- Merge hela `feat/*`-inkorgen
- Committa `.env`, `.orkester/state.json`

---

## Snabb-kontroll (30 sek)

```bash
git status -sb
git remote -v    # origin = Livskompassen3.0
git branch       # * main
npm run check:main-trunk
```

---

## Prompt till agent

```
Synka main: inventera grenar, skriv PMIR, vänta på mitt OK.
Kör smoke:locked-ux. Pusha bara origin (Livskompassen3.0).
Pusha INTE till origin-old.
Ändra inte security eller Sacred utan explicit order.
```

---

## Del A / Del B

| Fas | Innehåll |
|-----|----------|
| **Del A** | Git, main, stäng mergade grenar, regler (denna lathund) |
| **Del B** | Helhetsstädning docs/moduler — starta med *"starta Del B"* efter Del A |

Full guide: [`GITHUB_ANVANDARGUIDE.md`](./GITHUB_ANVANDARGUIDE.md)
