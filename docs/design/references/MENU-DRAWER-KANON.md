# Sidomeny (hamburger) — KANON

**Status:** **Låst** 2026-05-27 — Vardag (publikt) + Valv (endast efter PIN/gate) · accordion-hubbar.  
**Bild:** [`MENU-DRAWER-KANON.png`](./MENU-DRAWER-KANON.png) *(referens; UI kan sakna Valv-växlare i publikt läge)*

---

## Visuellt

| Element | Spec |
|---------|------|
| **Bakgrund** | Samma nordiska skymningsfoto som hem (blur + mörk overlay ~55%) |
| **Bredd** | ~68% skärm, glid in från vänster |
| **DOM** | `<aside class="nav-drawer">` före `.nav-drawer__backdrop` (drawer `z-[201]`, backdrop `z-[200]`) |
| **Header** | `LIVSKOMPASSEN` serif guld + dekoration (tre rutor) |
| **Stäng** | Guld `×` uppe vänster |
| **Lägesväxlare** | **Ingen** i publikt läge. I Valv: en diskret **Vardag**-knapp (tillbaka), **inte** synlig **Valv**-flik |
| **Snabbåtgärder** | **Ej** i drawer (`nav-drawer__quick-grid` borttagen). Snabbvägar via Fyren-widget / hubbar |
| **Rad** | Cirkel-ikon guld (48px hub / 36px sub) · etikett · chevron |
| **Aktiv rad** | **Guld** bakgrundsstreck (inte turkos/teal) |
| **Sektion** | Rubrik **Vardag** eller **Valv** efter aktivt läge |

---

## Läge Vardag (publikt — standard)

Visas när Valv **inte** är upplåst på en Valv-route.

| Hub | Underflikar |
|-----|-------------|
| Hem Kompass | Inkast (`/#inkast-lite`) |
| Dagbok | Reflektion · Speglar *(Bevis dold vid G18)* |
| Vardagen | Kompasser · Ekonomi |
| MåBra | — |
| Familjen | Reflektion · Livslogg · Tillsammans |
| Planering | Handling · Fokus · Inkorg |
| Arbetsliv | Stämpel · Tid & flex · Logg |
| Trygg hamn | Översikt · BIFF · Speglar · Barnfokus |
| Projekt | Nytt projekt |
| Drogfrihet | Idag · Stöd · Reflektion · Kunskap |
| Inställningar | Allmänt · Drogfrihet |

**MUST NOT:** publik `/vardagen?tab=kunskap` — Kunskap endast via Valv `kunskapsbank`.  
**MUST NOT:** exponera Valv (växlare, Valv-flik, snabbchips) i publikt drawer-läge.

---

## Läge Valv (PIN i VaultPage)

Visas **endast** när `isVaultUnlocked` eller `hasVaultGate()` **och** route är Valv (`?tab=bevis`, `vaultTab=…`, eller `/dossier`).

Tre expanderbara grupper:

| Grupp | Rader |
|-------|--------|
| **Pansaret** | Arkiv · Triage · Mönster · Orkester · Dossier · full vy (`/dossier`) |
| **Kunskap** | Kunskapsbank |
| **Forensik** | Hamn · Analys · Speglar · Fördjupat · Dagbok · Arkiv · Familjen · Mönster · Arbetsliv · Frånvaro · Arbetsliv · Lön |

Alla Valv-rader (utom Dossier-export) → `/dagbok?tab=bevis&vaultTab=…`

**Tillbaka:** `DrawerModeToggle` med **Vardag** → `/dagbok?tab=reflektion` (stänger drawer).

---

## Beteende

| Gest | Resultat |
|------|----------|
| Öppna | Hamburgermeny i header (`AppHeaderBar`) |
| Publikt | Endast Vardag-index — ingen Valv-växlare |
| Valv upplåst + Valv-route | Valv-index + **Vardag**-tillbaka |
| Hub med barn | Ikon+etikett → hub-path; **chevron** fäller ut underflikar |
| Valv-grupp | Rad fäller ut (ingen path) |
| Stäng | `×`, swipe vänster, tap utanför, route change |
| Valv-rad | Navigera → PIN-gate → Valv-baksida |

Widget-routes `/widget/*` ingår **inte** i drawer (deep links / PWA).

---

## Implementation

| Komponent | Fil |
|-----------|-----|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` (`isInValvDrawerContext`) |
| `DrawerModeToggle` | `src/modules/core/layout/DrawerModeToggle.tsx` (`showValvShell`) |
| `DrawerHubAccordion` | `src/modules/core/layout/DrawerHubAccordion.tsx` |
| Sanning | `src/modules/core/navigation/navTruth.ts` |
| Hub-flikar (synk med drawer) | `src/modules/core/navigation/hubTabs.tsx` · `hooks/useHubTab.ts` |
| Ikoner | `src/modules/core/navigation/drawerNav.ts` |

Kanon: [`COLOR-POLICY.md`](../COLOR-POLICY.md) — aktiv rad endast **guld** `#d4af37`.
