# Multitask pass — agent docs (2026-06-06)

**Repo:** Livskompassen3.0 · **Gren:** `main`  
**Prod:** https://gen-lang-client-0481875058.web.app  
**Agent:** Docs (multitask AGENT DOCS)

---

## Session scope

| Agent | Roll | Resultat |
|-------|------|----------|
| **Code** | Barnporten polish + functions refactor | `2ceb0fff` · `032b84f7` |
| **Docs** | Kanon-sanning multitask | denna fil · `SENASTE-SAMMANFATTNING` · `MODUL-GAP-OVERSIKT` |

**Föregående pass:** [`2026-06-06-1h-autonom-rapport.md`](./2026-06-06-1h-autonom-rapport.md)

---

## Git @ session slut

| Fält | Värde |
|------|-------|
| **HEAD** | `2ceb0fff` |
| **Ahead of `origin/main`** | **1** commit (`2ceb0fff` — Barnporten polish) |
| **Working tree** | ren (utom untracked `.orkester/autonom-2026-06-06-state.json`) |
| **Push** | **ej gjord** denna session |

### Senaste 15 commits (urval)

| Hash | Meddelande |
|------|------------|
| `2ceb0fff` | fix(barnporten): polish alias, needs_auth pairing, barn PWA manifest hook |
| `032b84f7` | refactor(functions): split index.ts into callables modules + chat-audit docs |
| `b9a7ee96` | docs(smoke): Fas 5A #3 Valv batch PASS — USER UI kvar |
| `339e1e02` | docs(eval): refresh Agent 5 night logs after resume run |
| `e65b1d57` | docs(eval): stäng 1h autonom rapport — Agent 5 + slutstatus |
| `76f1e9f4` | feat(barnporten): Våg A CB2–CB4 widget-varianter med CB2 som default |
| `ad38fc4e` | feat(barnporten): Våg B QR enhetskoppling med callables och rules |

---

## Leveranser denna multitask

### Barnporten polish — **LANDAD** (`2ceb0fff`)

| Item | Status |
|------|--------|
| Widget sparar kopplat barn-alias | **done** — `WidgetBarnportenPage` |
| `?pair=` utan inloggning → tydlig prompt | **done** — `useBarnportenPairClaim` needs_auth |
| Barn-PWA manifest på `/barnporten`-rutter | **done** — `useBarnportenWebManifest` + `barnportenRoutes` |
| Inkorg §7b HITL | **orörd** |

**Deploy:** kräver `npm run build` + `firebase deploy --only hosting` efter push.

### Functions refactor — **LANDAD** (`032b84f7`, redan på origin)

| Modul | Fil |
|-------|-----|
| Valv callables | `functions/src/callables/valv.ts` |
| Inbox callables | `functions/src/callables/inbox.ts` |
| Knowledge callables | `functions/src/callables/knowledge.ts` |
| Agents callables | `functions/src/callables/agents.ts` |
| Shared helpers | `functions/src/callables/shared.ts` |

Exports oförändrade i `index.ts`. Billing/collection audit: [`2026-06-06-billing-audit.md`](./2026-06-06-billing-audit.md) · [`2026-06-06-collection-audit.md`](./2026-06-06-collection-audit.md).

**Functions deploy:** ej körd denna session (refaktor = samma beteende).

### MaterialPack Våg A — **EJ LANDAD**

| Scope | Status |
|-------|--------|
| Familjen-mount `MaterialPackShortcuts` | **PMIR-STOPP** — plan only |
| Referens | [`2026-06-06-pmir-materialpack-editor.md`](./2026-06-06-pmir-materialpack-editor.md) |

Fas 3 light editor (`/projekt/genvagar`) fortsatt **done** på `main`.

---

## Deploy-status

| Tier | Status | Not |
|------|--------|-----|
| **Hosting** | Senaste prod **2026-06-06** (ValvSuper Fas 2–3) | Barnporten polish **ej deployad** — 1 commit ahead |
| **Functions** | Oförändrad prod | Refaktor pushad tidigare; ingen ny deploy |
| **Firestore rules** | Barnporten Våg B deployad tidigare | — |
| **Deploy logg** | Ingen lokal firebase deploy-logg hittad | SMOKE_RESULTS + CI-HOSTING referens |

**Rekommendation efter push:** `npm run build && firebase deploy --only hosting`

---

## Fas 5A (USER vs agent)

| # | Test | Agent/autorun | USER |
|---|------|---------------|------|
| **3** | Valv Shield→PIN→spara post | **PASS** (build + 8 smokes · WORM/static) | **ÖPPEN** — kräver Pontus i app |
| **4** | Barnporten QR + loggrad | **PASS** | **PASS** 2026-06-06 (Motorola) |

**Checklist:** [`2026-06-01-USER-nasta-steg.md`](./2026-06-01-USER-nasta-steg.md) · [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)

---

## Rekommenderat nästa steg

1. **Ett steg (du):** Fas 5A **#3 Valv** — Shield 3 s → PIN → spara enkel post → skriv `Fas 5A: #3 PASS` eller FAIL.
2. **Agent (valfritt):** Push + hosting deploy för Barnporten polish (`2ceb0fff`).
3. **Ej brådskande:** MaterialPack Våg A efter PMIR-godkännande · Barnporten Våg C (push/FCM).

---

## Kanon uppdaterad

- [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md)
- [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md)
- Denna rapport

---

## 5-agent coordinated pass (Agent 5 — docs + deploy)

**Tid:** 2026-06-06 · **Koordinator:** Agent 5 (körs sist)  
**HEAD före docs:** `22a2f056` · **Build:** **PASS** (`tsc -b && vite build`)

### Agent-roller

| Agent | Roll | Resultat |
|-------|------|----------|
| **1** | XSS / secureExport | Mergat från origin — `d0dc8d5e`–`46f79cc3` |
| **2** | (parallell kod) | MaterialPack Våg A · `c5116a2d` · `22a2f056` |
| **3** | Planering kalender P2 | `c2ce1dc0` veckovy · `1ef411e3` ICS-export |
| **4** | Smoke/lint fixes | `6848398e` lint fix MaterialPack hook |
| **5** | Docs + hosting deploy | denna sektion · kanon-uppdatering · `firebase deploy --only hosting` |

### Leveranser

| Item | Status | Commits |
|------|--------|---------|
| **XSS export-säkerhet** | **done** (merge origin) | `d0dc8d5e` · `d3116aa0` · `719d0cc9` · `46f79cc3` |
| **MaterialPack Våg A** | **done** | `c5116a2d` · `6848398e` · `22a2f056` (under Barnfokus) |
| **Planering kalender P2** | **done** | `c2ce1dc0` · `1ef411e3` (ICS via secureExport) |
| **Fas 5A #3 Valv USER** | **öppen** | Agent/autorun PASS — Shield→PIN→spara ej USER-testad |

### Deploy (Agent 5)

| Tier | Åtgärd |
|------|--------|
| **Hosting** | `firebase use gen-lang-client-0481875058` → `npm run build` → `firebase deploy --only hosting` |
| **Functions** | **ej** — refaktor/XSS = frontend + befintliga callables |
| **Firestore rules** | **ej** |

### Git @ pass slut

| Fält | Värde |
|------|-------|
| **Doc commit** | `dcec283c` (kanon) · `b8f360bb` (multitask appendix) |
| **Push** | `git push origin main` efter hosting PASS |
| **Fas 5A #3 USER** | **ÖPPEN** — markera ej PASS utan Pontus i app |
