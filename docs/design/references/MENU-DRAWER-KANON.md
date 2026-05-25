# Sidomeny (hamburger) — KANON

**Status:** **Låst** 2026-05-23 — denna layout ska vi ha.  
**Bild:** [`MENU-DRAWER-KANON.png`](./MENU-DRAWER-KANON.png)

---

## Visuellt (oförändrat)

| Element | Spec |
|---------|------|
| **Bakgrund** | Samma nordiska skymningsfoto som hem (blur + mörk overlay ~55%) |
| **Bredd** | ~68% skärm, glid in från vänster |
| **Header** | `LIVSKOMPASSEN` serif guld + dekoration (tre rutor) |
| **Stäng** | Guld `×` uppe vänster |
| **Rad** | Cirkel-ikon guld (48px) · etikett · chevron `›` |
| **Aktiv rad** | **Guld** bakgrundsstreck (inte turkos/teal) |
| **Ikoner** | Detaljerade guld line-in-circle (L2) |

---

## Menyrader (ordning)

| # | Etikett | Route | Ikon (mål) |
|---|---------|-------|------------|
| 1 | **Hem Kompass** | `/` | Kompassros |
| 2 | **Familjen** | `/familjen` | Familj (3 figurer) |
| 3 | **Trygg hamn** | `/hamn` | Ratt / ankare (UI-text — inte «Hamn» ensamt) |
| 4 | **Vardagen** | `/vardagen` | Rutiner / ekonomi / kunskap (flikar) |
| 5 | **Valv** | `/dagbok?tab=bevis` | Valvbåge |
| 6 | **Planering** | `/planering` | Kalender |
| 7 | **Arbetsliv** | `/arbetsliv` | Klocka |
| 8 | **MåBra** | `/mabra` | Lotus / gnista |
| 9 | **Inställningar** | `/installningar` eller konto-meny | Kugghjul |

---

## Beteende

| Gest | Resultat |
|------|----------|
| Öppna | Hamburgermeny i header (alla skärmar med `MainLayout`) |
| Stäng | `×`, swipe vänster, tap utanför |
| Rad-tryck | Navigera + stäng drawer |
| Zero Footprint | Stäng drawer vid utloggning |

---

## Implementation (P1)

| Komponent | Fil (plan) |
|-----------|------------|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` |
| `DRAWER_NAV_ITEMS` | `src/modules/core/navigation/drawerNav.ts` (paths från `navTruth.ts`) |
| `HubPageShell` | `src/modules/core/layout/HubPageShell.tsx` |
| Bakgrund | Delad `AmbientBackground` / samma asset som hem |

Koppla till befintliga `LIFE_CLUSTERS` + Planering + Inställningar.

---

## Färgkorrigering vs mockup

Mockup visar **teal** markering på Hamn — **produktion:** aktiv rad endast **guld** `#d4af37` (se [`COLOR-POLICY.md`](../COLOR-POLICY.md)).
