# GITHUB_SETUP — Nytt GitHub-repo för Livskompassen_PROD

Följ stegen i ordning. Byt ut `DITT_ANVÄNDARNAMN` och ev. repnamn.

---

## 1. Förutsättningar

- Git installerat (`git --version`)
- GitHub-konto
- [GitHub CLI](https://cli.github.com/) (valfritt men rekommenderat): `gh auth login`

---

## 2. Lokalt repo (redan initierat)

Projektmappen:

```text
/Users/Livskompassen/StudioProjects/Livskompassen_PROD
```

Initial commit innehåller styrande dokument (`.cursorrules`, `GEMINI.md`, `ARKITEKTUR_BESLUT.md`, m.fl.).

---

## 3. Skapa tomt repo på GitHub

### Alternativ A — GitHub CLI

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen_PROD

gh repo create Livskompassen_PROD \
  --private \
  --source=. \
  --remote=origin \
  --description="Livskompassen v2 — produktion (Single Source of Truth)" \
  --push
```

### Alternativ B — Webbgränssnittet

1. Gå till https://github.com/new  
2. Repository name: `Livskompassen_PROD`  
3. **Private** (rekommenderat)  
4. **Skapa inte** README, .gitignore eller license (finns redan lokalt)  
5. Kopiera URL, t.ex. `git@github.com:DITT_ANVÄNDARNAMN/Livskompassen_PROD.git`

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen_PROD

git remote add origin git@github.com:DITT_ANVÄNDARNAMN/Livskompassen_PROD.git
git branch -M main
git push -u origin main
```

---

## 4. Verifiera

```bash
git remote -v
git log -1 --oneline
```

Uppdatera `ARKITEKTUR_BESLUT.md` rad **0.4** med repo-URL.

---

## 5. Cursor / ny arbetsyta

1. **File → Open Folder** → `Livskompassen_PROD`  
2. Lägg **inte** gamla mappar (v2, 2.0, cursor) i samma workspace om du vill undvika förvirring  
3. `.cursorrules` i roten laddas automatiskt i många Cursor-upplägg

---

## 6. Skydd av main (valfritt)

På GitHub: **Settings → Branches → Add rule**

- Branch name: `main`
- Require pull request before merging (om du arbetar i team)
- Block force pushes

---

## 7. Secrets på GitHub (senare)

När Functions deployas, lägg secrets under **Settings → Secrets and variables → Actions** (eller Firebase/GCP direkt):

- `GEMINI_API_KEY` — endast om server-proxy behålls (målbild: Functions)
- Firebase service accounts — **aldrig** i repo

Använd GCP Secret Manager för produktion enligt GEMINI Layered Defense.
