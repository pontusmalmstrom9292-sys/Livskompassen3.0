# GIT_WORKFLOW — Godkända steg → commit → GitHub

Detta dokument definierar rutinen för **Livskompassen_PROD**. Cursor-agenten ska följa den när du uttryckligen godkänner ett steg.

---

## 1. När ska git användas?

| Händelse | Git-åtgärd |
|----------|------------|
| Nytt **godkänt vertikalt steg** (1–6 i `ARKITEKTUR_BESLUT.md`) | Commit + push till `main` |
| Mindre fix inom pågående steg | Commit lokalt; push vid steggodkännande eller på begäran |
| Secrets, `.env`, nycklar | **Commit aldrig** |
| Experiment | Branch `experiment/kort-beskrivning` (valfritt) |

---

## 2. Ditt godkännande (obligatoriskt före push)

Skriv i chatten något i stil med:

```text
Godkänt steg 1 — datamodell. Pusha till GitHub.
```

Agenten ska då:

1. Verifiera att inga secrets staged (`git status`, `.gitignore`).
2. Uppdatera `ARKITEKTUR_BESLUT.md` (status + ev. commit-hash).
3. Committa med meddelande enligt §3.
4. Pusha till `origin main` (om remote finns).

**Utan** formulering som "godkänt" + stegnummer: **ingen push**.

---

## 3. Commit-meddelanden

Format:

```text
step(N): kort beskrivning på svenska eller engelska.

Valfri brödtext: vad som ändrats och varför (1–2 meningar).
```

Exempel:

```text
step(0): init PROD repo med styrande dokument och konfliktkarta.

Etablerar Livskompassen_PROD som Single Source of Truth.
```

---

## 4. Kommandon (manuellt eller via agent)

### Första gången (GitHub)

Se [`GITHUB_STANDALONE_SETUP.md`](GITHUB_STANDALONE_SETUP.md).

### Efter godkänt steg

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen_PROD

# Kontrollera
git status
git diff

# Stage (agent väljer relevanta filer — aldrig .env, vertex-sa.json, etc.)
git add ARKITEKTUR_BESLUT.md firestore.rules  # exempel

git commit -m "$(cat <<'EOF'
step(1): synka firestore.rules med blueprint userId.

EOF
)"

git push origin main
```

### Hjäpskript

```bash
./scripts/git-approved-step.sh 1 "synka firestore.rules med blueprint"
```

---

## 5. Filer som aldrig ska committas

- `.env`, `.env.local`, `vertex-sa.json`, `google-services.json` (om den innehåller hemligheter)
- `node_modules/`, `dist/`, `functions/lib/` (byggoutput)
- Firebase debug-loggar, `.firebase/`
- Personlig data / exports

Se `.gitignore`.

---

## 6. Agent-rutin (checklista)

- [ ] Steg godkänt av användaren (citera stegnummer)
- [ ] `.cursorrules` och `GEMINI.md` respekterade
- [ ] Inga parallella agentspår introducerade
- [ ] `ARKITEKTUR_BESLUT.md` uppdaterad
- [ ] `git status` ren från secrets
- [ ] Commit + push (eller rapportera om remote saknas)
- [ ] Kort sammanfattning till användaren med commit-hash

---

## 7. Branch-strategi (enkel)

- **`main`** — alltid deploybar planerad kod
- **`experiment/*`** — korta försök; merge eller ta bort efter beslut
- Inga force-push till `main` utan uttrycklig begäran
