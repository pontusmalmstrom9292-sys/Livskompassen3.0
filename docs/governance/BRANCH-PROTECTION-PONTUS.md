# Branch protection — så jobbar du (Pontus)

**Senast verifierat:** 2026-06-27 · Repo: `pontusmalmstrom9292-sys/Livskompassen3.0`

GitHub **Lås 2** är aktivt på `main`. Du behöver inte klicka runt i Settings varje gång — följ bara flödet nedan.

---

## Vad som är påslaget (automatiskt)

| Regel | Betyder |
|-------|---------|
| **PR krävs** | Ingen kan pusha direkt till `main` |
| **Status `smoke` måste vara grön** | PR smoke gate (CI) måste PASS |
| **Branch up-to-date** | PR måste vara synkad med senaste `main` |
| **Ingen force-push** | Historik på `main` får inte skrivas om |
| **Admin bypass av** | Även du följer samma regler |
| **Sacred paths** | Ändringar i `firestore.rules`, `storage.rules`, `sharedRules.ts`, locked UX kräver **din** CODEOWNER-granskning |

---

## Ditt flöde varje gång (3 steg)

### 1. Låt agenten jobba i en branch

Agenten skapar branch, committar, pushar. **Inte** till `main`.

Lokal säkerhet (Mac): Husky kör `validate:session` vid push (~2–3 min).

### 2. Öppna PR på GitHub

1. Gå till repot → **Pull requests** → **New pull request**
2. Vänta tills **Checks** visar grön **`smoke`** (PR smoke gate)
3. Om röd: läs loggen, be agenten fixa, pusha igen

**Merge när:** grön `smoke` + (vid sacred filer) du har godkänt som CODEOWNER.

### 3. Deploy till prod (separat lås)

Merge till `main` **deployar inte** automatiskt.

1. GitHub → **Actions** → **Deploy Hosting (main)**
2. **Run workflow**
3. Kryssa i: *"Jag har läst PR-checklistan…"*
4. Skriv kort vad och varför → **Run**

---

## När något stoppar dig

| Meddelande | Vad du gör |
|------------|------------|
| Merge disabled — failing checks | Vänta/fixa tills `smoke` är grön |
| Review required (CODEOWNERS) | Du ändrat sacred path — granska PR själv och **Approve** |
| Branch out of date | Klicka **Update branch** på PR |
| Husky stoppar push lokalt | Kör `npm run validate:session`, fixa felet, pusha igen |

---

## Vad du **inte** behöver göra

- Ställa in branch protection igen (redan klart)
- Installera Cloud Code i VS Code
- Deploya från terminal utan smoke + checklista (om du följer Lås 3)

---

## Verifiera inställningarna (valfritt)

GitHub → **Settings** → **Branches** → regel för `main`.

Eller i terminal (om `gh` är inloggat):

```bash
gh api repos/pontusmalmstrom9292-sys/Livskompassen3.0/branches/main/protection
```

Ska visa `"context":"smoke"` och `"enforce_admins":{"enabled":true}`.

---

## Relaterat

- CI: `.github/workflows/pr-smoke-gate.yml`
- Deploy: `.github/workflows/firebase-hosting-main.yml` (manuell)
- Sacred paths: `.github/CODEOWNERS`
- Husky: `.husky/pre-push` → `npm run validate:session`

---

## Valfritt: AI-kommentar på PR (Cursor Automation)

**Mjuk gate** — kompletterar `smoke`, stoppar inte merge.

Aktivering (en gång): se `docs/cursor-automations/AKTIVERA-PR-YOLO-AUDIT.md`.
