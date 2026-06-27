# Copilot Jules — bygg i molnet (säkert)

**Syfte:** Maximera GitHub Copilot Pro Max i **molnet** parallellt med lokal `yolo` — utan PMIR-brott.

**Setup i repo:** [`.github/workflows/copilot-setup-steps.yml`](../../.github/workflows/copilot-setup-steps.yml) (Jules installerar Node, npm, Playwright).

**PR-gate:** [`pr-smoke-gate.yml`](../../.github/workflows/pr-smoke-gate.yml) kör `smoke:predeploy` på PR mot `main`.

---

## Två spår — när du använder vad

| Spår | Kommando | Var det körs | Bäst för |
|------|----------|--------------|----------|
| **Lokal YOLO** | `yolo` / `yolo loop` | Din Mac | Snabb kod, många vågar, Copilot CLI agent |
| **Jules moln** | GitHub Issue → Assign **Copilot** | GitHub Actions | PR i molnet medan du vilar / Cursor-kvot slut |

Kör **inte** båda på samma branch samtidigt.

---

## Så startar du Jules (3 steg)

1. **GitHub** → Issues → **New issue** → mall **Copilot Jules (moln)**
2. Fyll i scope + välj **GRÖN** eller **GUL** (inte RÖD utan PMIR)
3. **Assignee → Copilot** (Coding Agent). Vänta på PR.

Jules kör `copilot-setup-steps`, bygger, och öppnar PR. Du granskar + merge när CI är grön.

---

## Moln-säker matris

### GRÖN — skicka till Jules fritt

| Uppgift | Exempel |
|---------|---------|
| Smoke-fix loop | Första FAIL i `npm run smoke:tier1` |
| Typecheck / build | `npm run typecheck:core-strict` |
| UI polish | Executive Midnight, hex→tokens, widget |
| Docs / eval-logg | `docs/evaluations/…` |
| Readonly audit | WORM/silo-rapport **utan** rules-ändring |
| Android prep | `build:web`, `cap sync`, platform smoke |

### GUL — Jules OK om scope är **smal** (en modul, inga rules)

| Uppgift | Villkor |
|---------|---------|
| Ny komponent i zon | Max ~5 filer, `smoke:locked-ux` PASS |
| Ny callable (ej rules) | Endast functions/src, deploy **ej** i samma PR |
| Content ingest prep | Kod + static smoke, ingen prod-deploy |

### RÖD — PMIR / Pontus OK — **inte** Jules

| Blockerat | Varför |
|-----------|--------|
| `firestore.rules` · `storage.rules` | WORM / silo-gränser |
| `functions/src/sharedRules.ts` | Runtime-prompter |
| `NavigationDrawer.tsx` · Locked UX borttagning | Sacred UX |
| `firebase deploy` | Prod + Pontus OK |
| Barnporten kanon-UI struktur | Locked |
| Mass-radering · App Check Enforce | Irreversibelt |

Kryssa PMIR i issue-mallen → **assignera inte Copilot** förrän du uttryckligen godkänt.

---

## Färdiga Jules-uppgifter (från YOLO-kön)

| ID | Jules? | Notering |
|----|--------|----------|
| `modul-smoke-fix-loop` | **GRÖN** | Perfekt för moln-PR |
| `executive-home-motion` | **GRÖN** | UI + smoke |
| `projekt-p1-widget` | **GRÖN** | hosting deploy separat (du) |
| `android-g85-prep` | **GUL** | Ingen Play Store-deploy |
| `w2-backend-audit` | **GRÖN** | Doc-only audit OK |
| `lifeos-kopplingar-c` | **GUL** | Smal wire per PR |
| `ingest-vag1-deploy-prep` | **RÖD** | Deploy functions — PMIR |

---

## Verifiering Jules måste passera

```bash
cd functions && npm run build && cd ..
npm run build
npm run smoke:predeploy
```

PR från Jules ska få grön **PR smoke gate** innan merge.

**Deploy:** Jules ska **inte** deploya. Efter merge — Pontus OK först:

```bash
firebase use gen-lang-client-0481875058
firebase deploy --only hosting
```

---

## Parallell körning (max kvot, min risk)

| Tid | Du |
|-----|-----|
| Terminal | `COPILOT_YOLO_SKIP_PREFLIGHT=1 yolo loop` |
| GitHub | 1–2 Jules-issues (GRÖN), assign Copilot |
| Review | Merge PR när CI grön; lokal yolo på egen gren |

---

## Kanon för Jules

- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)
- [`AGENTS.md`](../../AGENTS.md)

Pack: `npm run cursor:pipeline:pack:copilot`
