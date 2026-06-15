# Familjen — UI SPEC (B3)

**Datum:** 2026-06-15  
**Status:** Implementerad  
**Route:** `/familjen?tab=…`

---

## Mål

Behåll Barnfokus och locked flows. Förbättra scroll-isolation i `FamiljenInputSuperModule` när inte desktop hub-lock.

---

## Ändringar (Cursor)

| Fil | Ändring |
|-----|---------|
| `FamiljenInputSuperModule.tsx` | `calm-scroll-island` på viewport (mobil) |

---

## Locked (MUST NOT)

- `BARNFOKUS_QUESTIONS`, `FamiljenBarnfokusDelegate`
- `FamiljenInputSuperModule` hub på `?tab=reflektion`
- Barnporten HITL → Valv

---

## Smoke

`npm run smoke:locked-ux`
