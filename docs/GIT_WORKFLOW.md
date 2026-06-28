# GIT WORKFLOW — säker vardagsrutin mot kodförlust

**Mål:** minimera risk för tappad kod, konflikter och osynkad branch.

## 1) Daglig standardrutin

1. Starta från uppdaterad `main`
   - `git checkout main`
   - `git pull --ff-only origin main`
2. Skapa feature-branch
   - `git checkout -b feature/<kort-beskrivning>`
3. Jobba i små steg
   - commit ofta med tydligt meddelande
   - push regelbundet till samma branch
4. Öppna liten PR
   - en tydlig förbättring per PR
   - kör verifiering före merge

## 2) Säker sync mot main (innan merge)

```bash
git checkout main
git pull --ff-only origin main
git checkout feature/<din-branch>
git merge origin/main
```

- Lös konflikter direkt i små delar.
- Kör verifiering igen efter konfliktlösning.
- Push branch och uppdatera PR.

## 3) Anti-kodförlust checklista (kort)

- [ ] Jag jobbar inte direkt på `main`
- [ ] Jag committar ofta (små, logiska commits)
- [ ] Jag pushar varje arbetspass
- [ ] Jag öppnar små PR:er
- [ ] Jag syncar branch med senaste `main` innan merge
- [ ] Jag låter CI vara grön innan merge

## 4) Praktisk commit/push-rutin

```bash
git status
git add <fil1> <fil2>
git commit -m "feat: kort och tydlig förändring"
git push -u origin feature/<din-branch>
```

Tips: om du är osäker, pusha hellre en WIP-commit än att lämna värdefull kod lokalt länge.

## 5) Konflikthantering (enkel modell)

1. Läs konfliktfilen och välj rätt version rad för rad.
2. Säkerställ att båda sidors viktiga ändringar finns kvar.
3. `git add <fil>`
4. `git commit`
5. Kör projektets checks igen.

## 6) Återställning när något gått fel

- Se senaste läge:
  - `git log --oneline --decorate -n 15`
- Ångra lokal fil till senaste commit:
  - `git restore <fil>`
- Hämta tillbaka borttappad commit:
  - `git reflog`
  - `git checkout <sha>`
- Om branch är i kaos:
  - skapa ny branch från `main`
  - cherry-picka säkra commits

## 7) Rekommenderade repokommandon

- Snabb kvalitetsbaslinje: `npm run quality:baseline`
- Full merge-gate: `npm run smoke:predeploy:build`
- Trunk-kontroll: `npm run check:main-trunk`
