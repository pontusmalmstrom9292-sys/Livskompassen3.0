# Livskompassen — GitHub & projekt (utskriftsguide)

**Version:** 2026-05-22 · **Läs tid:** 5 min · Skriv ut och lägg vid datorn.

---

## 1. Vad är vad? (30 sekunder)

```
Din Mac (Cursor)          GitHub (molnet)           Firebase/GCP
StudioProjects/           Livskompassen3.0          gen-lang-client-0481875058
Livskompassen2.0/    ←→   repo / main          ✗   Firestore, Functions, data
     kod                    backup kod                appens data (ej GitHub)
```

| Ord | Betyder |
|-----|---------|
| **Repo (arkiv)** | Projektets kod + historik på GitHub |
| **Branch** | Utvecklingslinje — du har **en**: `main` |
| **Commit** | Sparad snapshot av ändringar |
| **Push** | Skicka commits Mac → GitHub |
| **origin** | Ditt aktiva repo: `Livskompassen3.0` |
| **origin-old** | Arkiv av gamla repot — rör inte |

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

## 3. Daglig rutin (det enda du behöver minnas)

1. Jobba i Cursor som vanligt — spara filer (`Cmd + S`).
2. Be agenten: **"Committa och pusha main."**
3. Klart. Du behöver inte förstå merge eller branches.

### Prompt för Cursor (kopiera vid behov)

```
Committa alla ändringar på main och pusha till origin.
Jämför dina ändringar mot hela projektets kontext.
Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```

---

## 4. Projektets delar (modulkarta)

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

## 5. Starta appen lokalt

```bash
cd ~/StudioProjects/Livskompassen2.0
npm run dev
```

Öppna http://localhost:5173 i webbläsaren.

Kräver `.env` lokalt (finns i Finder-arkiv om den saknas). Kopiera **aldrig** `.env` till GitHub.

---

## 6. Gör aldrig detta

| Gör inte | Varför |
|----------|--------|
| Force push (`git push --force`) | Skriver om historik — farligt |
| Committa `.env`, API-nycklar | Säkerhetsrisk |
| Lägg Repomix-dumpar i projektmappen | Blåser upp repot (MB skräp) |
| Skapa `package.json` i `StudioProjects/`-rot | Förvirrar Cursor |
| Radera `origin-old` eller arkiv-repot | Förlorar gammal historik |
| Förvänta dig att GitHub = Firebase | Data ligger i GCP, inte Git |

---

## 7. Om något strular

| Symptom | Åtgärd |
|---------|--------|
| Cursor säger "behind/ahead" | Be agent: "Synka main med origin" |
| Merge-fönster du inte bad om | `git merge --abort` — eller be agent avbryta |
| Appen startar inte | Kontrollera `.env` finns lokalt |
| Osäker vilken branch | Du ska alltid vara på **`main`** |
| Behöver gammal kod | Kolla `origin-old` eller Finder-arkiv |

---

## 8. Deploy (kort)

Deploy sker mot **samma Firebase-projekt** som tidigare — nytt GitHub-repo ändrar inte GCP.

Se [`DEPLOY.md`](DEPLOY.md) och [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md).

---

## 9. Checklista: ny clean baseline (klar 2026-05-22)

- [x] Nytt repo: **Livskompassen3.0** med branch `main`
- [x] Gammalt repo sparat som `origin-old`
- [x] Tag `archive/pre-clean-repo-2026-05-22` på gamla repot
- [x] Finder-kopia: `Livskompassen2.0-ARKIV-2026-05-22`
- [x] Alla stale branches bortstädade lokalt
- [ ] Efter 1–2 veckor: bekräfta att allt fungerar, **sedan** ev. arkivera/radera gamla repot på GitHub

---

*Relaterat: [`GITHUB_STANDALONE_SETUP.md`](GITHUB_STANDALONE_SETUP.md) · [`MONOREPO_LAYOUT.md`](MONOREPO_LAYOUT.md) · [`docs/README.md`](README.md)*
