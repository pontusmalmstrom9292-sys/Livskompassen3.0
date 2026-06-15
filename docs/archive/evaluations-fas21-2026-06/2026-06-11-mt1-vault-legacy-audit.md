# MT-1 — Legacy `vault` collection audit (read-only)

**Datum:** 2026-06-11  
**Agent:** δ (specialist-security-auditor)  
**Status:** **DEFER** rules-ändring till MT-2 (efter prod-data-koll)

---

## Sammanfattning

Firestore har **två** bevis-samlingar i rules:

| Collection | Roll | WORM |
|------------|------|------|
| `reality_vault` | **Kanon** — all prod-kod | Ja — `isValidRealityVaultCreate` |
| `vault` | **Legacy** — repomix-era alias | Delvis — create/update/delete utan `hasOnly` |

**Kod:** Ingen aktiv `collection('vault')` i `src/` hittad vid grep 2026-06-11. All Valv-UI skriver till `reality_vault`.

**Risk:** Legacy rules tillåter `vault` create med svagare schema än `reality_vault`. Om gamla dokument finns kvar kan de läsas av ägare.

---

## Rekommendation (MT-2)

1. Firebase Console → Firestore → sök `vault` (top-level) per uid — dokumentera antal.
2. Om **0 dokument** eller migrerade: ta bort `match /vault/{docId}` från `firestore.rules`.
3. Om dokument finns: engångsmigrering till `reality_vault` med script — **inte** i MT-1.

**MUST NOT:** Radera rules utan prod-data-verifiering.

---

## Verifiering

```bash
# Efter gcloud auth — manuell Console eller:
# firebase firestore:delete (endast med explicit user OK)
grep -n 'match /vault' firestore.rules
```

**Nästa:** MT-2 δ — rules cleanup efter Console-koll.
