# Navigation Master — Livskompassen v2

**Status:** Variant A aktiv (8 ikoner). Variant B dokumenterad för framtida beslut.

---

## Variant A (nuvarande — aktiv)

**FloatingDock** ([`FloatingDock.tsx`](../../src/modules/core/layout/FloatingDock.tsx)):

| Ikon | Route | AuthGate | Notering |
|------|-------|----------|----------|
| Hem | `/` | nej | Bento-översikt alla moduler |
| Kompasser | `/kompasser` | nej | Morgon/dag/kväll |
| Valv (Shield) | `/valv` | ja | **3s long-press** + WebAuthn → Fyren |
| Hamn | `/hamn` | ja | BIFF |
| Dagbok | `/dagbok` | ja | Lager 1 |
| Kunskap | `/kunskap` | ja | Kompis + Tidshjulet |
| Barnen | `/barnen` | ja | PIN |
| Ekonomi | `/ekonomi` | nej | Placeholder |

**Ej i dock:**

| Route | Ingång |
|-------|--------|
| `/speglar` | HomePage bento + bro från dagbok (efter sparad post) |

---

## Variant B (blueprint — planerad)

Förenklad dock (4–5 ikoner):

| Ikon | Route |
|------|-------|
| Hem | `/` |
| Kompasser | `/kompasser` |
| Dagbok | `/dagbok` |
| Hamn | `/hamn` |
| (valfritt) Barnen | `/barnen` |

- **Verklighetsvalvet:** långtryck 3s på **Dagbok-ikon** (Shield försvinner från dock)
- Kunskap/Ekonomi: sekundärt från Hem-bento

---

## AuthGate-routes

Se [`AppRoutes.tsx`](../../src/modules/core/routing/AppRoutes.tsx): `/valv`, `/hamn`, `/dagbok`, `/kunskap`, `/barnen`, `/speglar`

---

## Beslut

| Fråga | Status |
|-------|--------|
| A vs B | **A aktiv** — omställning när hjärtklustret är stabiliserat |
| Speglar i dock | **Nej** — nås via Hem + dagbok-bro |
