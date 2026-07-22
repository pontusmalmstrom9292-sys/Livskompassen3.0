# FP-TI-S13 — Nav-chrome: ref 5-slot vs prod 3-zon

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S13` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox jämförelse — **ingen** prod-IA-ändring utan PMIR |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **Sandbox** | `ExecutiveExactBottomNav.tsx`, `FreeportHemV3Lab.tsx` |
| **Prod** | `navTruth.ts`, `FloatingDock.tsx`, `NavigationDrawer.tsx` |

---

## 1. Referens-bottom-nav (5 slot)

| # | ID | Etikett | Ikon | Slot-bredd | FAB |
|---|-----|---------|------|------------|-----|
| 1 | `hem` | Hem | `Home` | 20% | nej |
| 2 | `resurser` | Resurser | `LayoutGrid` | 20% | nej |
| 3 | `fab` | Kompass | `LivskompassMark` | 56×56 px | **ja** |
| 4 | `inkorg` | Inkorg | `Inbox` | 20% | nej |
| 5 | `mer` | Mer | `MoreHorizontal` | 20% | nej |

**Mått:** nav `72px` höjd; ikon `20×20px`; etikett `10px`; aktiv `#d4af37`.

RESURSER = fullskärms overlay från slot 2.

---

## 2. Sandbox Modell A (nuvarande)

| # | Etikett | State |
|---|---------|-------|
| 1 | Hem | `navActive='hem'` |
| 2 | Hjärtat | zone `hjartat` |
| 3 | FAB | `Kompass` supermod |
| 4 | Vardagen | zone `vardagen` |
| 5 | Familjen | zone `familjen` |

**Gap:** 3-zon nav ≠ ref 5-slot.

---

## 3. Prod 3-zonsystem (låst)

| Zon | Route | Drawer |
|-----|-------|--------|
| Hjärtat | `/hjartat?tab=reflektion\|speglar` | ej leaf |
| Vardagen | `/vardagen?tab=…` | «Liv och göra» |
| Familjen | `/familjen?tab=…` | «Familj och gränser» |
| Valv | `/valvet?vaultTab=…` | PIN-sektion |

Chrome: `FloatingDock` + `NavigationDrawer` (Vardag + Valv vid `vaultOpen`).

---

## 4. RESURSER-lista → prod IA

| Ref-rad | Prod | Path |
|---------|------|------|
| Hem | Hem | `/` |
| Ekonomi | Plånbok | `/vardagen?tab=ekonomi` |
| Planering | Handling | `/vardagen?tab=handling` |
| Resurser | (meta) | öppnar drawer |
| MåBra | MåBra | `/vardagen?tab=mabra` |
| Dagbok | Reflektion | `/hjartat?tab=reflektion` |
| Familjen | Barnfokus | `/familjen?tab=reflektion` |
| Valvet | Samla | `/valvet?vaultTab=logga` |
| Inställningar | Inställningar | `/installningar` |

Valv-rad: dold utan `vaultSessionOpen`.

---

## 5. Ref slot → prod

| Slot | Prod |
|------|------|
| Hem | `/` + Fyren |
| Resurser | `DRAWER_VARDAG_ITEMS` |
| FAB | Fyren Kompass |
| Inkorg | Smart Inkast |
| Mer | Drawer + inställningar |

---

## 6. Beslut

| Alt | Rekommendation |
|-----|----------------|
| A — 5-slot i ny `FP-TI Exact` panel | **Ja** |
| B — Behåll 3-zon i sandbox | Nej som slutmål |
| C — Dual nav toggle | Ja dev-only |

---

## 7. CSS-klasser

| Klass | Spec |
|-------|------|
| `.design-freeport__exec-bottom-nav` | `fixed; bottom:0; height:72px; max-width:390px` |
| `.design-freeport__exec-bottom-nav-item--on` | `#d4af37`, glow `0 0 8px rgba(212,175,55,0.32)` |

---

## 8. Acceptans

1. 5 slot med svenska etiketter = ref.
2. Resurser → 9-raders lista utan route-change.
3. Valvet dold utan PIN-mock.
4. `navTruth.ts` orörd.
