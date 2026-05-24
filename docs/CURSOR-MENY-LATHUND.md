# Cursor & editor — menylathund (1 sida · utskrift)

**Version:** 2026-05-24 · Gäller **Cursor på Mac** + fil du redigerar (GitHub web / Preview)

**Inte samma som:** [`GIT-LATHUND.md`](./GIT-LATHUND.md) (git) · [`DESIGN-LATHUND.md`](./design/DESIGN-LATHUND.md) (teman)

---

## A. Cursor-menyn (kub-ikon i Mac-menyraden)

Ikonen kan visa en **siffra** = olästa notiser från agenter.

| Menyval | Vad det gör | Livskompassen-tips |
|---------|-------------|-------------------|
| **Senaste agenter** (lista) | Öppnar en **gammal AI-chatt** igen | Bra för att hitta "viktig laga github" — **sanning** ligger ändå i `main` + docs |
| **View More** | Fler gamla chattar | — |
| **Clear All Notifications** | Rensar siffran på ikonen | Gör när det känns rörigt — påverkar inte kod |
| **New Agent** | **Ny tom chatt** | Använd när ny uppgift; klistra in prompt från `GIT-LATHUND` |
| **Open Cursor** | Visar editorfönstret | — |
| **Settings** | **Cursor-appens** inställningar | Inte Firebase/Git — bara editor |
| **Quit** | Stänger Cursor | Spara/commit först om du har ändringar |

**Kom ihåg:** Agent-listan = **historik**. Projektets sanning = **`main`** + [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md).

---

## B. Filmenyn `…` (vid en öppen fil, t.ex. `.md`)

Ofta när du redigerar på **GitHub i webbläsaren** eller Preview. Samma idé i Cursor: **Save** = spara fil.

| Menyval | Vad det gör | Varning |
|---------|-------------|---------|
| **Save File** (`⌘S`) | Sparar filen | Lokalt i Cursor → sedan *committa + pusha main* |
| **Discard Changes** | **Kastar** alla osparade ändringar | Kan inte ångras |
| **Copy Relative Path** | t.ex. `docs/BRANCH-KARTA.md` | Bra i markdown-länkar |
| **Copy Remote URL** | GitHub-länk till filen | Dela / bokmärka |
| **Diff View** | Visar vad du ändrat vs senast sparade | Bra före commit |
| **Line Numbers** | Radnummer på/av | Smak |
| **Word Wrap** | Radbrytning | Bekvämt för långa md-filer |
| **Auto Save** | Sparar medan du skriver | På = säkrare; **ersätter inte** git push |

**Preview / Markdown:** växla mellan **utseende** och **rå text**.

---

## C. Cursor i projektfönstret (vanliga knappar)

| Visar | Betyder | Du ska |
|-------|---------|--------|
| **M** vid fil | Ändrad, ej committad | Spara · commit när klart |
| **↑** (ahead) | Commits ej pushade | *"Pusha main"* |
| **↓** (behind) | GitHub har nyare kod | `git pull --ff-only origin main` |
| **Sync / Publish Branch** | Vill skapa/pusha gren | **Avbryt** — jobba på `main` |
| **Merge** | Slå ihop grenar | **Avbryt** om du redan är på `main` |

Mer: [`GITHUB_ANVANDARGUIDE.md`](./GITHUB_ANVANDARGUIDE.md) § Cursor-knappar.

---

## D. Vad är "Actions"?

| Var du ser det | Betyder |
|----------------|---------|
| **Allmänt** | Åtgärder = något som **gör** något (spara, pusha, köra smoke) |
| **Cursor AI / Agent** | Verktyg agenten får använda: läsa filer, terminal, redigera — enligt [`.cursor/rules/git-main-trunk.mdc`](../.cursor/rules/git-main-trunk.mdc) |
| **GitHub "Actions"** (annat!) | Automatisk CI i molnet — **inte** filmenyn `…` |

---

## E. Var du redigerar Livskompassen (rekommenderat)

| Plats | När |
|-------|-----|
| **Cursor** → `~/StudioProjects/Livskompassen2.0` | Kod + docs + commit |
| **GitHub web** | Snabb läsning / en rad md — committa gärna via Cursor efteråt |
| **`docs/design/.../index.html`** | Bläddra teman (Finder → dubbelklick) |

**Prompt efter ändring:**

```
Committa och pusha main till origin (Livskompassen3.0).
Kör smoke:locked-ux om jag rört Barnen eller Valv.
```

---

## F. Övriga lathundar (skriv ut tillsammans)

| Fil | Innehåll |
|-----|----------|
| [`KOMPASS-MINNESKARTA.md`](./KOMPASS-MINNESKARTA.md) | Helhet · moduler · git · öppet |
| [`GIT-LATHUND.md`](./GIT-LATHUND.md) | Main · PMIR · inga sidogrenar |
| [`design/DESIGN-LATHUND.md`](./design/DESIGN-LATHUND.md) | Teman · galleri · flik-bilder |

---

*Skriv ut · `Cmd+P` · lägg vid skärmen*
