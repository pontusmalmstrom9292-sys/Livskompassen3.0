# Fristående GitHub-repo — Livskompassen2.0

Steg-för-steg på svenska. Målet: **en tydlig huvudlinje** med all app-kod, utan merge-röra.

---

## Ordlista (30 sekunder)

| Ord | Betyder |
|-----|---------|
| **Repo** | Projektmappen + all sparad historik (git) |
| **Branch** | En utvecklingslinje (t.ex. `main` = det som ska vara “sanningen”) |
| **Push** | Skicka dina commits till GitHub (backup i molnet) |
| **Merge** | Slå ihop två linjer — behövs sällan om du bara jobbar på `main` |
| **origin** | Standard-namnet på GitHub-kopian |

**Din Mac är primär.** GitHub ändrar inget lokalt förrän du kör `git pull` eller merge själv.

---

## Vad som gäller för detta projekt (2026-05)

| Branch | Roll |
|--------|------|
| **`main` (GitHub)** | Ska peka på samma kod som `cleanup-phase-1` — hela Livskompassen v2 |
| **`cleanup-phase-1`** | Var all utveckling skett; kan bytas namn till `main` lokalt |
| **Gamla `pr/fas1-*`** | Historiska del-PR:er — kan ignoreras eller raderas på GitHub senare |
| **Lokal `main` (gammal)** | Copilot-spår — **inte** samma som GitHub `main` efter synk |

**Firebase / app-data** ligger i Google Cloud (`gen-lang-client-0481875058`) — separat från GitHub.

---

## Alternativ A — Samma repo, `main` = cleanup-phase-1 (rekommenderat)

Redan klart om agenten kört:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0
git fetch origin
git push origin cleanup-phase-1:main
```

Detta är en **fast-forward** (ingen force): GitHub `main` får all modulkod utan att radera historik våldsamt.

### Efter push — jobba på `main` lokalt

```bash
git branch -f main cleanup-phase-1
git checkout main
git branch -u main origin/main
```

Framöver:

```bash
git add .
git commit -m "beskrivning av ändringen"
git push origin main
```

**Gör inte** “Merge with main” i Cursor om du redan står på `main` och pushat — onödigt.

### GitHub-inställning (webb)

1. Öppna https://github.com/pontusmalmstrom9292-sys/Livskompassen2.0  
2. **Settings → General → Default branch** → ska vara **`main`**  
3. (Valfritt) **Settings → Branches → Branch protection** → block force push på `main`

---

## Alternativ B — Helt nytt tomt repo (maximalt fristående)

Använd om du vill **lämna** det gamla repot och bara ha Livskompassen på en ny URL.

### 1. Skapa repo på GitHub (webb)

1. https://github.com/new  
2. Namn t.ex. `Livskompassen` eller `Livskompassen-v2`  
3. **Private**  
4. **Ingen** README / .gitignore / license (finns lokalt)  
5. Skapa — kopiera URL (HTTPS eller SSH)

### 2. Koppla från din Mac

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0

# Behåll gamla origin som backup (valfritt)
git remote rename origin origin-old

# Ny GitHub-URL — BYT UT nedan
git remote add origin https://github.com/DITT_KONTO/NYTT_REPO.git

git push -u origin cleanup-phase-1:main
```

### 3. Verifiera

```bash
git remote -v
git log -1 --oneline
```

Öppna repot i webbläsaren — du ska se `src/modules/`, `functions/`, `.context/`.

---

## Alternativ C — Bara lokal backup (ingen GitHub-strul)

```bash
# Finder: duplicera mappen
cp -R Livskompassen2.0 Livskompassen2.0-BACKUP-$(date +%Y-%m-%d)
```

GitHub behövs inte för att appen ska fungera lokalt (`npm run dev`).

---

## Vad du ska undvika

| Gör inte | Varför |
|----------|--------|
| Force push `main` utan att förstå det | Skriver om GitHub-historik |
| Blanda StudioProjects-rot med flera `package.json` | Förvirrar Cursor (se `docs/MONOREPO_LAYOUT.md`) |
| Committa `.env`, API-nycklar | Säkerhetsrisk |
| Förvänta dig att Valv-Chat söker barnloggar | Fel datalager — se `.context/arkiv-minne.md` |

---

## Felsökning

**“Behind / ahead” i Cursor**  
→ Kör `git fetch origin` och `git status`. Jobba på `main` som trackar `origin/main`.

**Merge-konflikter utan att du gjort något**  
→ Stäng merge i Cursor; kör `git merge --abort` om merge pågår. Läs denna fil igen.

**`gh: command not found`**  
→ Använd Alternativ A eller B via webbläsaren (ingen CLI krävs).

---

## Relaterat

- [`GITHUB_SETUP.md`](GITHUB_SETUP.md) — äldre PROD-mall  
- [`MONOREPO_LAYOUT.md`](MONOREPO_LAYOUT.md) — var mappen ska ligga  
- [`DEPLOY.md`](DEPLOY.md) — Firebase deploy (separat från Git)
