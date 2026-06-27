# Aktivera Cursor Automation: pr-yolo-audit

**Syfte:** När en PR öppnas eller uppdateras kommenterar en Cursor-agent med **GO** eller **NO-GO** (read-only). Stoppar **inte** merge — extra råd utöver GitHub `smoke`.

**Mall:** `docs/cursor-automations/prefill-pr-yolo-audit.json`

---

## Viktigt: Automations finns INTE under Settings (kugghjul)

Det är ett vanligt missförstånd. Använd **en** av vägarna nedan.


## Väg A — Webbläsare (enklast)

1. Logga in på samma Cursor-konto som i appen.
2. Öppna: **https://cursor.com/automations/new**
3. **Trigger:** GitHub → Pull request → repo `pontusmalmstrom9292-sys/Livskompassen3.0` → events *opened* + *pushed*
4. **Tools:** Comment on Pull Request (på)
5. **Repository:** Single repo → samma repo, branch `main`
6. **Instructions** — klistra in:

```
Readonly YOLO audit for this PR against main.

Checklist: WORM append-only, three silos (no cross-RAG), DCAP before LLM, prompts only in sharedRules.ts, Locked UX intact, no secrets in diff.

Run static review from diff only. Comment GO or NO-GO with one next step.

MUST NOT: merge, push to main, modify Sacred paths (firestore.rules, sharedRules.ts, locked UX) without PMIR.

If uncertain, cite: npm run smoke:predeploy, npm run smoke:mdc.
```

7. Namn: `pr-yolo-audit` → **Save** → **Enable**

Översikt: **https://cursor.com/automations**

---

## Väg B — I Cursor (Agents-fönster)

1. Öppna **Agents**-panelen (inte Settings).
   - Mac: ofta **Cmd + L** eller ikonen för Agent/Chat i sidofältet.
2. Leta efter fliken **Automations** (finns i Cursor 3.5+).
3. **New automation** → samma trigger/tools/instructions som Väg A.

Saknas fliken **Automations** → använd **Väg A (web)** eller uppdatera Cursor (**Cursor → About Cursor**).

---

## Väg C — Skriv i Agent-chatt

I en **ny Agent-chatt** i detta repo, klistra in:

```
/automate

När en pull request öppnas eller får ny push mot main i pontusmalmstrom9292-sys/Livskompassen3.0: kör read-only YOLO-audit på diffen. Kommentera GO eller NO-GO på PR med ett nästa steg. Kolla WORM, tre silos, inga secrets, Locked UX, prompts bara i sharedRules.ts. Får inte mergea eller ändra sacred paths utan PMIR.
```

Granska utkastet Cursor föreslår → **Save** → **Enable**.

---

## Krav (varför du kanske inte ser funktionen)

| Orsak | Lösning |
|-------|---------|
| Letade under Settings | Använd Väg A, B eller C ovan |
| Gammal Cursor-version | Uppdatera appen |
| Free-plan utan Cloud Agents | Automations kräver betald plan med Cloud Agents — då räcker **GitHub smoke + branch protection** (redan aktivt) |
| GitHub inte kopplat | Cursor Settings → **Integrations** / **GitHub** → Connect |

---

## Efter aktivering

| Händelse | Resultat |
|----------|----------|
| Ny PR mot `main` | GO/NO-GO-kommentar |
| Ny push på PR | Uppdaterad kommentar |

Merge kräver fortfarande grön **`smoke`** (GitHub Lås 2).

---

## Relaterat

- Hårt lås: `docs/governance/BRANCH-PROTECTION-PONTUS.md`
- Manuell audit: skriv `/yolo-vakt` i Cursor-chatt
