# Smart Inkast — Lockdown & färdigställande

**Datum:** 2026-06-06  
**Status:** **Färdigställd** (låst för vidare kod utan godkännande från Pontus)  
**Smoke:** `npm run smoke:inkast` · `npm run smoke:inbox`  
**Prod:** https://gen-lang-client-0481875058.web.app

---

## 1. Syfte

Bekräfta att modulen **Smart Inkast (G10)** uppfyller specifikationen efter implementation av:

- Manuell silo + universell tagg-matris (flerval)
- Egna taggar (`user_tags` / Firestore)
- Hjälp-widget (tagg-guide från `TAG_GROUPS`)
- Avbryt uppladdning vid AI-förslag
- Obsidian Calm UI

---

## 2. Kanoniska filer (faktiska sökvägar)

| Komponent | Sökväg |
|-----------|--------|
| Manuellt redigeringsformulär | `src/modules/inkast/components/InkastManualEditForm.tsx` |
| Tagg-väljare (återanvändbar) | `src/modules/shared/components/TaggSelector.tsx` |
| Tagg-hjälp (utfällbar) | `src/modules/shared/components/TaggHelpPanel.tsx` |
| Tagg-taxonomi + API | `src/modules/inkast/api/inkastService.ts` |
| Egna taggar (Firestore klient) | `src/modules/shared/tags/userTagsApi.ts` |
| Bekräftelse + abort | `src/modules/inkast/components/InkastConfirmPanel.tsx` |
| Persist / silo-routing (backend) | `functions/src/lib/inboxPersist.ts` |
| Manuell klassificering | `functions/src/lib/inboxClassifier.ts` |
| Callable pipeline | `functions/src/lib/submitInkastLite.ts` |

**Notera:** Det finns inga filer på `src/modules/features/capture/InkastManualEditForm.tsx` eller `src/modules/core/firebase/inboxPersist.ts` — capture använder `CapturePanel.tsx`; persist ligger i Cloud Functions.

---

## 3. Röktest 2026-06-06

| Steg | Kommando | Resultat |
|------|----------|----------|
| Functions build | `cd functions && npm run build` | **PASS** |
| Frontend build | `npm run build` | **PASS** |
| G10 inbox | `npm run smoke:inbox` | **PASS** |
| Inkast lockdown | `npm run smoke:inkast` | **PASS** |

### `smoke:inkast` verifierar

1. **Statisk struktur** — alla kanonfiler finns; `TaggSelector` flerval; `InkastManualEditForm` + `TaggHelpPanel`; `inboxPersist` skriver `inboxTags`; `user_tags` i `firestore.rules`.
2. **TAG_GROUPS (SSOT)** — `#gaslighting`, `#mående` (Barn-grupp), `#återhämtning` (Personligt).
3. **Obsidian Calm-markörer** — `chip--active`, `chip--idle`, `text-text-muted`, `text-text-dim`, `bg-surface` i UI-filer.
4. **Callable → Firestore** — `submitInkastLite` med `manualRouting: kunskap`, `manualTags: [gaslighting, aterhamtning]` → `action: persisted`, `collection: kb_docs`, `classification.tags: manuell, gaslighting, aterhamtning`.

---

## 4. Funktionell spec — uppfylld

| Krav | Status |
|------|--------|
| G10 silo (Dagbok/Kunskap, Valv/Bevis, Barnen) | ✅ |
| AI-förslag → Godkänn / Ändra / Avbryt uppladdning | ✅ |
| Universell tagg-matris (Narcissism, Barn, Personligt, Egen) | ✅ |
| Flerval taggar (max 12) | ✅ |
| Egna taggar → `user_tags` | ✅ |
| Hjälp-widget (Manipulation, Barn, Personligt) | ✅ |
| Multi-fil + PDF/dokument | ✅ |
| Manuell override bypassar AI (`confidence: 1`, tag `manuell`) | ✅ |
| `inboxTags` på `reality_vault` / `children_logs` / `kb_docs` | ✅ |

---

## 5. UI — Obsidian Calm (mörkt läge)

Verifierat via statisk kodgranskning + prod-deploy:

- Mörka ytor: `bg-surface-2`, `bg-surface-3`, `border-border/*`
- Taggar: `chip--active` / `chip--idle` (guld vid val)
- Hjälp: dämpad text `text-text-muted`, rubriker `text-accent/90`
- Ingen ny custom CSS utanför befintliga design tokens

**Manuell spot-check (Pontus):** Hem → Smart Inkast → Ändra → flikar + Hjälp + flerval pills.

---

## 6. Låspolicy

**Från 2026-06-06:** Agent och utvecklare ska **inte** ändra följande utan explicit OK från **Pontus**:

- `src/modules/inkast/components/InkastManualEditForm.tsx`
- `src/modules/shared/components/TaggSelector.tsx`
- `src/modules/shared/components/TaggHelpPanel.tsx`
- `src/modules/inkast/api/inkastService.ts` (`TAG_GROUPS`, tagg-hjälpare)
- `src/modules/shared/tags/userTagsApi.ts`
- `functions/src/lib/inboxPersist.ts`
- `functions/src/lib/inboxClassifier.ts` (manuell klassificering)
- `functions/src/lib/submitInkastLite.ts`

**Tillåtet utan lock-OK:** bugfix som bryter smoke (dokumentera i ny eval), säkerhetsfix i `firestore.rules` för `user_tags`.

**Smoke före merge:** `npm run smoke:inkast` + `npm run smoke:inbox`.

---

## 7. Referenser

- Modulregister: `docs/MODUL-FUNKTIONS-REGISTER.md` (inkast · `smoke:inbox`)
- GAP: `docs/MODUL-GAP-OVERSIKT.md` (inkast **stabil**)
- Deploy: `functions:submitInkastLite`, `hosting`, `firestore:rules` (user_tags)

---

## Fas 5 — Domän-autosort preview (done 2026-06-06)

- [x] `previewInboxClassification` tar `sourceModule` — samma `[sourceModule:…]`-prefix som submit
- [x] Heuristik `valv_samla` → bevis · `planering_inkorg` → review
- [x] `CapturePanel` skickar sourceModule till preview + domän-ledtråd (`captureDomainCopy.ts`)
- [x] Smoke: `npm run smoke:inkast` (preview valv_samla)

**Deploy:** `firebase deploy --only functions:previewInboxClassification,functions:submitInkastLite,hosting`
