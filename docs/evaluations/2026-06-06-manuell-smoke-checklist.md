# Manuell smoke — Cursor-native rollout (2026-06-06)

**Efter:** Upload Fas 1–3 + Liv launcher + Drogfrihet + SpeglarSuperModule  
**Autorun kanon:** [`2026-06-06-cursor-native-autorun.md`](./2026-06-06-cursor-native-autorun.md)  
**Checklista:** [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md)

---

## Agent autorun (du behöver inte köra)

```bash
npm run rollout:night
```

| # | Test | Täcks av |
|---|------|----------|
| **Hem** | CaptureSuper hem-capture | `smoke:locked-ux` |
| **Kompass** | Smart inkast | `smoke:inkast` (om `.env`) |
| **Liv** | 6 kort + LivBackLink | `smoke:design-modules` + `smoke:arbetsliv` |
| **Familjen** | Drogfrihet-flik + redirect | `smoke:design-modules` |
| **Planering** | Länk till granskningskö | rollout static guards |
| **Valv Samla** | Canonical InboxReviewQueue | `smoke:locked-ux` |
| **#3** | WORM `reality_vault` | `smoke:vault-worm` (om `.env`) |
| **#4** | Optimistic save (kod + backend) | rollout static + `smoke:children` |
| **Speglar** | SpeglarSuperModule + callable | `smoke:design-modules` + `smoke:speglar` |

---

## Du kör (~5 min)

| # | Test | Förväntat |
|---|------|-----------|
| **#2d** | Dagbok → Reflektera → bilaga | &lt;5 MB → `attachment` i `journal` + Storage `journal_memories/` |
| **Valfritt** | Hem visuellt | En Skriv-yta — ingen dubbel inkast |
| **Valfritt** | Speglar ACT | En «Fortsätt till VIVIR»-knapp efter spegling |

---

## Deploy (efter rollout:night PASS)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase deploy --only hosting
```

Hard refresh: `Cmd + Shift + R`
