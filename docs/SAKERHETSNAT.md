# Säkerhetsnät för otekninsk användare

> Klick-för-klick-guide för Pontus. Allt här är **gratis** — inga månadskostnader.
> Tre lås hindrar att något går snett innan det når produktion.

| Lås | Vad | Var | Stoppar |
|-----|-----|-----|---------|
| **1. Husky** | Lokala git-hookar | Datorn (efter `npm install`) | Korta commit-meddelanden · secrets · trasig kod pushas |
| **2. GitHub** | Branch protection + Dependabot | github.com → Settings | Direkt push till `main` · gamla beroenden · obeordnad merge |
| **3. Deploy** | Kryssruta + budget-alert | Actions + GCP Console | Oavsiktlig deploy · skenande GCP-kostnader |

---

## Lås 1 — Husky (lokal dator)

### Vad det gör

| Hook | När | Kontroll |
|------|-----|----------|
| `commit-msg` | Vid `git commit` | Avvisar meddelanden **< 15 tecken** eller utan conventional-prefix (`feat`, `fix`, `docs`, …) |
| `pre-commit` | Före `git commit` | Kör `npm run smoke:secrets` — letar API-nycklar / tokens / `.env` i staged filer |
| `pre-push` | Före `git push` | Kör `npm run validate:session` — smoke + typecheck + e2e tokens |
| `post-checkout` | Efter branch-byte | Varnar (men blockerar ej) om du lämnat ohanterade filer |

### Aktivering (en gång)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm install            # husky aktiveras automatiskt via "prepare"-skriptet
ls -la .husky          # bekräfta: commit-msg, pre-commit, pre-push, post-checkout
```

Om hookarna inte är körbara: `chmod +x .husky/*`.

### Vad du ser när det stoppar dig

**Exempel: för kort commit-meddelande**

```
[husky · commit-msg] STOPP — commit-meddelandet är för kort (5 tecken, minst 15).

Ditt meddelande:
  fixa

Skriv något mer beskrivande, t.ex.:
  fix(valv): hindra duplicerade WORM-poster vid retry
```

**Exempel: secret upptäckt**

```
[smoke:secrets] STOPP — möjliga hemligheter upptäckta:
  - .env — Förbjuden filsökväg (secrets-mall).
  - src/api.ts:42 — Misstänkt Google API Key: AIzaSyA1234…

Åtgärder:
  1. Ta bort nyckeln/filen ur staging: git restore --staged <fil>
  2. Flytta riktig secret till .env (lokalt) eller GitHub Actions secrets (CI).
```

### Undantag (för riktiga exempel/placeholders)

* Markera enskild rad med kommentaren `sakerhetsnat:allow`:
  ```js
  const example = "AIzaSyA1234567890BCDEFGHIJKLMNOPQRSTUV3"; // sakerhetsnat:allow
  ```
* Bypassa hela hooken i nödfall: `git commit --no-verify` eller `git push --no-verify`.
  **Gör det aldrig utan att berätta för ägaren efteråt.**

---

## Lås 2 — GitHub (branch protection + Dependabot)

### 2a. Branch protection — klick-för-klick

Detta hindrar att någon (inklusive AI-agenter) pushar direkt till `main` utan PR + grön smoke.

1. Öppna **<https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/settings/branches>** (kräver inloggning som ägare).
2. Klicka **Add branch ruleset** (eller **Add rule** i klassiska vyn).
3. Fyll i:
   * **Ruleset Name:** `Säkerhetsnät main`
   * **Enforcement status:** `Active`
   * **Target branches** → **Include default branch** (väljer `main` automatiskt).
4. Under **Branch protections**, kryssa i:
   - [x] **Restrict deletions** — hindrar att `main` raderas av misstag.
   - [x] **Require linear history** — inga merge-commits utan tillåtelse.
   - [x] **Require a pull request before merging**
     * **Required approvals:** `1` (du själv räcker — gratis-plan tillåter detta).
     * [x] Dismiss stale pull request approvals when new commits are pushed.
     * [x] Require review from Code Owners (aktiveras via `.github/CODEOWNERS`).
   - [x] **Require status checks to pass**
     * Klicka **+ Add checks** och välj exakt: `PR smoke gate / smoke`.
     * [x] Require branches to be up to date before merging.
   - [x] **Block force pushes** — hindrar `git push --force` till `main`.
5. Lämna resten tomt (allt extra kostar pengar i Team/Enterprise — vi vill ha gratis).
6. Klicka **Create** längst ner.

> Verifiera: gå till valfri öppen PR. Du ska se "Required" bredvid `smoke`-checken och mergeknappen ska vara grå tills checken är grön.

### 2b. Dependabot auto-merge (redan klart i kod)

`.github/dependabot.yml` + `.github/workflows/dependabot-auto-merge.yml` mergar automatiskt:

| Update | Auto-merge? | Krav |
|--------|-------------|------|
| **Patch** (alla beroenden) | ✅ Ja | PR smoke gate grön |
| **Minor** (dev-deps) | ✅ Ja | PR smoke gate grön |
| **Minor** (prod-deps) | ❌ Nej | Pontus manuell granskning |
| **Major** (alla) | ❌ Nej | Pontus manuell granskning + PMIR |
| `firebase-functions` major | ❌ Nej (ignored) | Manuell — bryter v1 callables |

Dependabot-PR:er får automatiskt labeln `säkerhetsnät` så du ser dem direkt.

### 2c. Kontrollera att auto-merge fungerar

1. Öppna en Dependabot-PR (efter nästa veckokörning eller manuellt: <https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/network/updates>).
2. Klicka **Insights → Network → Dependency graph** eller direkt PR-fliken.
3. Verifiera att PR har en kommentar: *"Pull request successfully created"* från Dependabot, och en check *"Dependabot auto-merge / auto-merge"*.
4. När smoke gate är grön mergas patch-PR:en automatiskt.

---

## Lås 3 — Deploy + GCP-budget

### 3a. Workflow-kryssruta (redan klart i kod)

`.github/workflows/firebase-hosting-main.yml` kräver två inputs vid `workflow_dispatch`:

1. **Jag har läst PR-checklistan och smoke-rapporten** — `true`/`false`, default `false`.
2. **Kort anteckning (vad och varför)** — fritext, syns i loggen.

**Så här deployar du manuellt:**

1. Öppna **<https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/actions/workflows/firebase-hosting-main.yml>**.
2. Klicka **Run workflow** (knapp uppe till höger).
3. I rutan som dyker upp:
   * **Use workflow from:** `main`.
   * **Jag har läst PR-checklistan…** → kryssa i rutan (annars stoppas du av `guard`-jobbet).
   * **Kort anteckning** → t.ex. `Fas 19 — barn-epistemik release efter PMIR PASS`.
4. Klicka **Run workflow**.
5. Vänta tills båda jobben (`guard` + `build_and_deploy`) är gröna.

Om du glömmer kryssa: jobbet `guard` failar omedelbart med exit 1 och meddelande
*"Kryssrutan … är inte ikryssad. Deploy avbruten."* — `build_and_deploy` startar inte.

### 3b. GCP budget alert — klick-för-klick

Detta varnar dig via mejl om molnräkningen börjar skena (t.ex. en runaway Vertex-loop).

1. Öppna **<https://console.cloud.google.com/billing>**.
2. Välj fakturakontot som är knutet till `gen-lang-client-0481875058`.
3. Klicka **Budgets & alerts** i vänstermenyn.
4. Klicka **+ Create budget** uppe.

**Steg 1 av 4 — Scope**

* **Name:** `Livskompassen-månadstak`
* **Time range:** `Monthly`
* **Projects:** välj **`gen-lang-client-0481875058`** (avmarkera alla andra).
* **Services:** lämna tomt (gäller alla — bra för Firebase + Vertex).
* Klicka **Next**.

**Steg 2 av 4 — Amount**

* **Budget type:** `Specified amount`
* **Target amount:** börja med **`100 SEK`** (= ca 10 USD). Justera när du ser hur mycket projektet faktiskt drar.
* Klicka **Next**.

**Steg 3 av 4 — Actions (det viktigaste)**

* Under **Threshold rules**, ställ in:
  - [x] **50% of budget** → email
  - [x] **90% of budget** → email
  - [x] **100% of budget** → email
  - [x] **120% of budget** → email (sista chansen att hinna stänga av)
* Under **Manage notifications**:
  - [x] **Email alerts to billing admins and users** (du får mejl till GCP-kontots e-post).
  - [ ] *Pub/Sub* — lämna tomt (kräver kod + kostar).
  - [ ] *Connect a Cloud Function* — lämna tomt (vi vill ha gratis).
* Klicka **Finish**.

**Steg 4 — Verifiera**

1. Du ska se `Livskompassen-månadstak` i budget-listan.
2. Klicka in på den — status ska visa `0 SEK spent of 100 SEK`.
3. Spara länken som bokmärke: <https://console.cloud.google.com/billing/budgets>.

> Tips: om du får en 50%-varning samma dag du satt upp budgeten — sänk inte
> budgeten i panik. Klicka in och se vilken tjänst som drar (vanligast: Vertex
> embeddings, Firestore reads). Hör av dig till en agent och be om analys
> *innan* du stänger av något.

### 3c. Akut stopp om något skenar

1. Öppna <https://console.cloud.google.com/iam-admin/quotas>.
2. Filtrera på *Vertex AI* eller *Cloud Functions*.
3. Sätt en hård kvot (t.ex. 100 requests/min) — billar du dig själv ur stora pengar.

Alternativt: pausa deploy-workflowen helt:

1. <https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/actions/workflows/firebase-hosting-main.yml>
2. **`···`** uppe till höger → **Disable workflow**.

---

## Vanliga frågor

### Varför har vi den här?

Du är icke-tekniker och kör ofta YOLO-deploy med flera AI-agenter parallellt.
Säkerhetsnätet är tre oberoende lager — om en agent missar något, fångar nästa
lager felet innan det når produktion eller fakturan.

### Varför inte använda GitHub Advanced Security?

Den är **dyr** (per-seat-licens) i privata repos. Allt i den här guiden är
gratis: husky + dependabot + GitHub Actions free tier + GCP billing budget
(notiser kostar inget).

### Får AI-agenter bypassa hookarna?

**Nej.** Se [`.cursor/rules/sakerhetsnat-husky.mdc`](../.cursor/rules/sakerhetsnat-husky.mdc).
Om en agent föreslår `--no-verify` ska du säga **stopp** och be om en
verklig fix istället.

### Vad gör jag om hooks failar och jag förstår inte felet?

1. Läs felmeddelandet — det är på svenska och pekar på exakt fil/rad.
2. Klistra in felet i Cursor/Copilot och be om *"Förklara på svenska och förslag på fix"*.
3. Om det fortfarande är otydligt: be om analys (inte fix) med plattform + modell
   enligt master-regeln i `AGENTS.md`.

### Hur testar jag att hookarna fungerar?

```bash
# Test 1 — för kort commit
echo "test" | git commit -F -                # ska avvisas

# Test 2 — bra commit
git commit -m "docs(sakerhetsnat): testar hookar"   # ska gå igenom

# Test 3 — fake secret
echo 'const k = "AIzaSyA1234567890BCDEFGHIJKLMNOPQRSTUV3"' > /tmp/test.js
git add /tmp/test.js && git commit -m "test"        # ska stoppas av pre-commit
git restore --staged /tmp/test.js                   # städa
rm /tmp/test.js
```

---

## Senast uppdaterad

2026-06-26 · Implementerad enligt plan från claude/review-session-history (Opus 4, 2026-06-26).

Relaterat:
- [`.cursor/rules/sakerhetsnat-husky.mdc`](../.cursor/rules/sakerhetsnat-husky.mdc) — AI-agent-regel
- [`scripts/smoke_secrets.mjs`](../scripts/smoke_secrets.mjs) — regex-skanner
- [`.husky/`](../.husky/) — fyra git-hookar
- [`.github/dependabot.yml`](../.github/dependabot.yml) — auto-merge-config
- [`.github/workflows/dependabot-auto-merge.yml`](../.github/workflows/dependabot-auto-merge.yml)
- [`.github/workflows/firebase-hosting-main.yml`](../.github/workflows/firebase-hosting-main.yml) — kryssruta
