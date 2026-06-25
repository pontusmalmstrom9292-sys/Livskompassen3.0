# Drive backup — privat (gitignored)

**Syfte:** Lokal mapp för PII-material från Pontus Drive (familjekonflikt, narcissism-analyser, fotograferade utredningar).

**Regel:** Hela `docs/archive/drive-backup/` är listad i `.gitignore` (utom denna README). Inget innehåll här committas till git.

---

## Vad som ska bo här

| Källa | Destination | Kommentar |
|---|---|---|
| Tidigare `narcissistisk förälder/` (root, 24 MB) | `docs/archive/drive-backup/narcissistisk-foralder/` | RTF-rapporter + PNG-bilder. PII. **Borttaget från git** 2026-06-25 — finns kvar i historik. |
| Drive-importer (familjeunderlag, ex-mejl, etc.) | `docs/archive/drive-backup/<mapp>/` | Allt som klassas som PII enligt `.context/security.md` |

---

## För Pontus (Mac) — så flyttar du privat material lokalt

Efter att du pullar denna ändring i `Livskompassen3.0`-repot:

```bash
cd ~/StudioProjects/Livskompassen3.0
mkdir -p docs/archive/drive-backup/narcissistisk-foralder

# Om du har en lokal kopia kvar (utanför repot):
mv ~/Documents/narcissist-backup/* docs/archive/drive-backup/narcissistisk-foralder/

# Om filerna finns kvar i git-historik och du vill återställa dem lokalt:
git show HEAD~1:"narcissistisk förälder/Barnet_och_den_dolda_narcissismen.png" > docs/archive/drive-backup/narcissistisk-foralder/Barnet_och_den_dolda_narcissismen.png
# (upprepa för varje fil — se git log för exakta sökvägar)

# Verifiera att inget av detta är tracked av git:
git status        # ska INTE visa filerna
```

---

## Säkerhetsnotering — git-historik

Filerna är borttagna från `HEAD` men **finns kvar i git-historiken**. Om repot någonsin görs publikt eller delas med extern part måste du köra `git filter-repo` för att skriva om historiken. **Detta är ett medvetet val** — repot är privat under utveckling.

**Komihåg:** Lägg aldrig PII direkt på root igen. Använd alltid `docs/archive/drive-backup/` (gitignored) eller mappar utanför repot.
