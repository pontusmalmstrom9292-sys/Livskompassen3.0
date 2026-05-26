# Sidomeny (hamburger) — KANON

**Status:** **Låst** 2026-05-26 — helhetsindex med Vardag/Valv-växlare + accordion-hubbar.  
**Bild:** [`MENU-DRAWER-KANON.png`](./MENU-DRAWER-KANON.png)

---

## Visuellt (oförändrat)

| Element | Spec |
|---------|------|
| **Bakgrund** | Samma nordiska skymningsfoto som hem (blur + mörk overlay ~55%) |
| **Bredd** | ~68% skärm, glid in från vänster |
| **Header** | `LIVSKOMPASSEN` serif guld + dekoration (tre rutor) |
| **Stäng** | Guld `×` uppe vänster |
| **Lägesväxlare** | Segment **Vardag** \| **Valv** (guld aktiv) |
| **Rad** | Cirkel-ikon guld (48px hub / 36px sub) · etikett · chevron |
| **Aktiv rad** | **Guld** bakgrundsstreck (inte turkos/teal) |
| **Sektion** | Rubrik speglar aktivt läge |

---

## Läge Vardag (publikt)

Snabbåtgärder (chips) visas **endast i Vardag-läge**.

| Hub | Underflikar |
|-----|-------------|
| Hem Kompass | Inkast (`/#inkast-lite`) |
| Dagbok | Reflektion · Speglar *(Bevis dold vid G18)* |
| Familjen | Reflektion · Livslogg · Tillsammans |
| Trygg hamn | Översikt · BIFF · Speglar · Barnfokus |
| Vardagen | Kompasser · Ekonomi |
| Planering | Handling · Fokus · Inkorg |
| Arbetsliv | Stämpel · Tid & flex · Logg |
| MåBra | — |
| Projekt | Nytt projekt |
| Inställningar | — |

**MUST NOT:** publik `/vardagen?tab=kunskap` — Kunskap endast via Valv `kunskapsbank`.

---

## Läge Valv (PIN i VaultPage)

Tre expanderbara grupper:

| Grupp | Rader |
|-------|--------|
| **Pansaret** | Arkiv · Triage · Mönster · Orkester · Dossier · full vy (`/dossier`) |
| **Kunskap** | Kunskapsbank |
| **Forensik** | Hamn · Analys · Speglar · Fördjupat · Dagbok · Arkiv · Familjen · Mönster · Arbetsliv · Frånvaro · Arbetsliv · Lön |

Alla Valv-rader (utom Dossier-export) → `/dagbok?tab=bevis&vaultTab=…`

---

## Beteende

| Gest | Resultat |
|------|----------|
| Öppna | Hamburgermeny i header (`AppHeaderBar`) |
| Vardag \| Valv | Visar endast relevant index |
| Hub med barn | Ikon+etikett → hub-path; **chevron** fäller ut underflikar |
| Valv-grupp | Rad fäller ut (ingen path) |
| Stäng | `×`, swipe vänster, tap utanför, route change |
| Valv-rad | Navigera → PIN-gate → Valv-baksida |

Widget-routes `/widget/*` ingår **inte** i drawer (deep links / PWA).

---

## Implementation

| Komponent | Fil |
|-----------|-----|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` |
| `DrawerModeToggle` | `src/modules/core/layout/DrawerModeToggle.tsx` |
| `DrawerHubAccordion` | `src/modules/core/layout/DrawerHubAccordion.tsx` |
| Sanning | `src/modules/core/navigation/navTruth.ts` |
| Ikoner | `src/modules/core/navigation/drawerNav.ts` |

Kanon: [`COLOR-POLICY.md`](../COLOR-POLICY.md) — aktiv rad endast **guld** `#d4af37`.
