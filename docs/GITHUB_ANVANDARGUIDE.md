# Livskompassen — GitHub & projekt (utskriftsguide)

**Version:** 2026-05-22 · **Läs tid:** 8 min · Skriv ut och lägg vid datorn.

---

## 0. Är det redan fixat? (JA)

**Du behöver inte ställa in något.** Commit och push går automatiskt till det **nya** repot.

| Inställning | Värde nu | Betyder |
|-------------|----------|---------|
| Branch | `main` | Din enda utvecklingslinje |
| `origin` (push) | **Livskompassen3.0** | Dit all kod skickas |
| `origin-old` | Livskompassen2.0 | Bara arkiv — pushas **aldrig** hit av misstag om du följer guiden |
| Tracking | `main` → `origin/main` | `git push` utan extra flaggor = rätt repo |

**Verifiera själv (valfritt):** Be agenten *"Visa git remote och branch"* — du ska se `Livskompassen3.0` som `origin`.

---

## 1. Ordlista — vad varje sak betyder

```
Din Mac (Cursor)          GitHub (molnet)           Firebase/GCP
StudioProjects/           Livskompassen3.0          gen-lang-client-0481875058
Livskompassen2.0/    ←→   repo / main          ✗   Firestore, Functions, data
     kod                    backup kod                appens data (ej GitHub)
```

| Ord | Enkelt sagt | Analogi |
|-----|-------------|---------|
| **Repo (arkiv)** | Projektmappen + all sparad historik på GitHub | Ett fotoalbum för koden |
| **Branch** | En utvecklingslinje | Du har **en** bok — `main` |
| **Commit** | Sparad snapshot av dina ändringar | "Spara version" med meddelande |
| **Push** | Skicka commits från Mac → GitHub | Backup i molnet |
| **Pull** | Hämta commits från GitHub → Mac | Behövs sällan — du jobbar ensam på Mac |
| **origin** | Namnet på ditt **aktiva** GitHub-repo | = Livskompassen3.0 |
| **origin-old** | Gammalt repo — bara för att titta tillbaka | Rör inte i vardagen |
| **Merge** | Slå ihop två kodlinjer | **Undvik** — du har bara `main` |
| **Staged / Unstaged** | Filer markerade för commit vs inte | Cursor/agent sköter detta |
| **`.env`** | Hemligheter lokalt (API-nycklar) | Finns **aldrig** på GitHub |

**Regel:** Kod = GitHub + Mac. Data (loggar, bevis, användare) = Firebase. Blanda inte.

---

## 2. Var sanningen bor

| Vad | Var |
|-----|-----|
| **Aktiv kod** | Mac: `StudioProjects/Livskompassen2.0/` |
| **Molnsbackup kod** | https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0 |
| **Arkiv (gammal historik)** | https://github.com/pontusmalmstrom9292-sys/Livskompassen2.0 (tag: `archive/pre-clean-repo-2026-05-22`) |
| **Finder-säkerhetskopia** | `StudioProjects/Livskompassen2.0-ARKIV-2026-05-22/` |
| **Hemligheter (.env)** | Bara på Mac — **aldrig** i GitHub |
| **App-data** | Firebase/GCP — separat från Git |
| **Repomix (helhetsanalys)** | `StudioProjects/Repomix bygge/` — **utanför** projektmappen |

---

## 3. När ska jag göra vad?

| Situation | Gör detta | Gör **inte** detta |
|-----------|-----------|---------------------|
| Du kodat klart för idag | Be agent: *"Committa och pusha main"* | Force push, merge, ny branch |
| Cursor frågar om merge | Avbryt — be agent hjälpa | Klicka "Merge" utan att förstå |
| Du vill bara spara lokalt | `Cmd + S` räcker | Commit behövs inte efter varje rad |
| Du vill backupa kod i molnet | Push (via agent) | Kopiera hela mappen manuellt till GitHub |
| Du behöver gammal kod | Be agent kolla `origin-old` eller Finder-arkiv | Radera gamla repot |
| Appen ska köras lokalt | `npm run dev` | Deploy behövs inte för lokal test |
| Kod ska live i Firebase | Se [`DEPLOY.md`](DEPLOY.md) | Deploy ≠ push till GitHub |
| Osäker vilken branch | Du ska vara på **`main`** | Byt inte branch i Cursor |
| Cursor visar "Sync" / "Publish" | Be agent committa + pusha | Klicka inte "Publish Branch" på ny branch |

### Commit vs push — skillnaden

| Steg | Var sparas det? | När? |
|------|-----------------|------|
| **Spara fil** (`Cmd + S`) | Bara på Mac | Hela tiden |
| **Commit** | I git-historik lokalt | När en uppgift är klar |
| **Push** | På GitHub (molnet) | Efter commit — backup + synk |

**Commit utan push** = sparat lokalt men inte i molnet. **Push utan commit** = inget nytt att skicka.

---

## 4. Daglig rutin (det enda du behöver minnas)

1. Jobba i Cursor — spara filer (`Cmd + S`).
2. När något är klart: **"Committa och pusha main."**
3. Klart.

### Prompt för Cursor (kopiera vid behov)

```
Committa alla ändringar på main och pusha till origin (Livskompassen3.0).
Pusha INTE till origin-old.
Jämför dina ändringar mot hela projektets kontext.
Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```

### Cursor-knappar — vad de betyder

| Cursor/Git visar | Betyder | Du ska… |
|------------------|---------|---------|
| **M** vid fil | Fil ändrad, ej committad | Spara — commit när klart |
| **↑2** (ahead) | 2 commits ej pushade | Be agent pusha |
| **↓1** (behind) | GitHub har något du saknar | Be agent synka |
| **Sync Changes** | Push + ev. pull | Be agent — inte klicka blind |
| **Merge with main** | Försök slå ihop branches | **Avbryt** om du redan är på `main` |
| **Publish Branch** | Skapa ny branch på GitHub | **Nej** — använd bara `main` |

---

## 5. Projektets delar (modulkarta)

| Route | Mapp | Syfte |
|-------|------|-------|
| (start) | `src/modules/core/` | App-shell, routing, UI, Firebase |
| `/vardagen` | `src/modules/kompasser/` | Morgon-/kvällskompass, paralys |
| `/vardagen?tab=kunskap` | `src/modules/kompis/` | Kunskapsvalvet, Kompis, entiteter |
| `/dagbok` | `src/modules/dagbok/` | Dagbok, Hjärtat-hub |
| `/dagbok?tab=bevis` | `src/modules/verklighetsvalvet/` | Verklighetsvalvet (bevis) |
| Bevis → Sök | `src/modules/valv_chatt/` | Valv-Chat (egen silo) |
| `/dagbok?tab=speglar` | `src/modules/speglings_system/` | Speglings-Systemet |
| `/familjen` | `src/modules/barnens_livsloggar/` | Barnens livsloggar |
| `/hamn` | `src/modules/safe_harbor/` | Grey Rock / BIFF |
| `/mabra` | `src/modules/mabra/` | Akut/reglering |
| `/dossier` | `src/modules/dossier/` | Dossier-Generator |
| `/ekonomi` | `src/modules/ekonomi/` | Ekonomi |
| — | `functions/` | Backend, agenter, RAG |
| — | `.context/` | Systemlagar (läs före kod) |
| — | `docs/` | Drift, deploy, specs |

**Backend** (`functions/`) anropas från frontend via Firebase callables — inte från `src/modules/` direkt.

---

## 6. Starta appen lokalt

```bash
cd ~/StudioProjects/Livskompassen2.0
npm run dev
```

Öppna http://localhost:5173 i webbläsaren.

Kräver `.env` lokalt (finns i Finder-arkiv om den saknas). Kopiera **aldrig** `.env` till GitHub.

---

## 7. Gör aldrig detta

| Gör inte | Varför |
|----------|--------|
| `git push origin-old` | Skickar till **gamla** repot |
| Force push (`git push --force`) | Skriver om historik — farligt |
| Committa `.env`, API-nycklar | Säkerhetsrisk |
| Lägg Repomix-dumpar i projektmappen | Blåser upp repot |
| Skapa `package.json` i `StudioProjects/`-rot | Förvirrar Cursor |
| Radera `origin-old` eller arkiv-repot | Förlorar gammal historik |
| Skapa ny branch för vardagsjobb | Du behöver bara `main` |
| Förvänta dig att GitHub = Firebase | Data ligger i GCP, inte Git |
| Klicka "Merge" i Cursor utan att förstå | Skapar onödig röra |

---

## 8. Om något strular

| Symptom | Åtgärd |
|---------|--------|
| Cursor säger "behind/ahead" | Be agent: *"Synka main med origin"* |
| Merge-fönster du inte bad om | Be agent: *"Avbryt merge"* (`git merge --abort`) |
| Osäker vilket repo push går till | Be agent: *"Visa git remote -v"* — ska vara Livskompassen3.0 |
| Appen startar inte | Kontrollera `.env` finns lokalt |
| Osäker vilken branch | Du ska alltid vara på **`main`** |
| Behöver gammal kod | Be agent kolla `origin-old` eller Finder-arkiv |
| Push nekas (auth) | Logga in GitHub i webbläsaren / be agent fixa credentials |

---

## 9. Deploy (kort)

Deploy sker mot **samma Firebase-projekt** som tidigare — nytt GitHub-repo ändrar inte GCP.

| Åtgärd | När |
|--------|-----|
| `git push` | Backup kod till GitHub — gör ofta |
| Firebase deploy | När kod ska **live** — gör mer sällan |

Se [`DEPLOY.md`](DEPLOY.md) och [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md).

---

## 10. Checklista: clean baseline (klar 2026-05-22)

- [x] Nytt repo: **Livskompassen3.0** med branch `main`
- [x] `origin` pekar på Livskompassen3.0 (push går hit automatiskt)
- [x] Gammalt repo sparat som `origin-old`
- [x] Tag `archive/pre-clean-repo-2026-05-22` på gamla repot
- [x] Finder-kopia: `Livskompassen2.0-ARKIV-2026-05-22`
- [x] Alla stale branches bortstädade lokalt
- [ ] Efter 1–2 veckor: bekräfta att allt fungerar, **sedan** ev. arkivera/radera gamla repot på GitHub

---

*Relaterat: [`GITHUB_STANDALONE_SETUP.md`](GITHUB_STANDALONE_SETUP.md) · [`MONOREPO_LAYOUT.md`](MONOREPO_LAYOUT.md) · [`docs/README.md`](README.md)*
