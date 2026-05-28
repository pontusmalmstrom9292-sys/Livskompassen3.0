# IA — modul- och flikflytt (2026-05-28)

**Kanon:** [`navTruth.ts`](../../src/modules/core/navigation/navTruth.ts) · [`MENU-DRAWER-KANON.md`](./references/MENU-DRAWER-KANON.md) · [`TAB-REGISTRY.md`](./TAB-REGISTRY.md)

## Beslutsmatris

| # | Förslag | Nu | Mål | Status | Smoke |
|---|---------|-----|-----|--------|-------|
| B1 | MåBra som underflik under Vardagen | `/mabra` | `/vardagen?tab=mabra` | **NEJ** (behåll egen route + dock) | — |
| B2 | Familjen-flikar endast från `navTruth` | `familjenTabs.ts` + `useHubTab` | `useHubTab('familjen')` SSOT | **GODKÄND** | `smoke:locked-ux` |
| B3 | Drogfrihet "Kunskap" → "Stöd & resurser" | `?tab=kunskap` | samma path, ny label | **GODKÄND** | `smoke:locked-ux` |
| B4 | Fas 2-kluster (kompis, ekonomi, hamn, stampla) | rot under `src/modules/` | se mappar nedan | **GODKÄND** | `build` + `orkester:night` |

## Fas 2-kluster (B4)

| Modul | Kanonisk mapp | Legacy-shim (tills imports noll) |
|-------|---------------|----------------------------------|
| kompis | `evidence/kompis/` | `modules/kompis` |
| ekonomi | `wellbeing/economy/` | `modules/ekonomi` |
| safe_harbor | `family/safeHarbor/` | `modules/safe_harbor` |
| stampla | `admin/stampla/` | `modules/stampla` |

**Ej på bordet:** publik `/vardagen?tab=kunskap`; borttag Valv-grupper; ny PIN-modell.

## Godkännande

Implementerat i kod enligt status ovan. B1 reserverad för separat produkt-PMIR.
