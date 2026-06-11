# Sidomeny (hamburger) — KANON

**Status:** **Låst** 2026-05-27 — uppdaterad 2026-05-31 (hub-konsolidering).  
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

Visas när Valv **inte** är upplåst (endast Vardag-sektion).

**Supersidor (2026-06-01):** fyra drawer-rader — flikar väljs **inuti shell-sidor** (`?tab=`), inte som drawer-underrader.

| Drawer-rad | Route | Inuti sidan (ej drawer) |
|------------|-------|-------------------------|
| **Hem — Skriv** | `/` | CapturePanel · ReviewQueue · adaptiva kort |
| **Liv och göra** | `/liv` | Kompasser · MåBra · Handling (P3 Kanban) · Projekt · Arbetsliv |
| **Familj och gränser** | `/familj` | Reflektion (Barnfokus default) · Livslogg · Tillsammans · Barnporten · Hamn · Drogfrihet |
| **Inställningar** | `/installningar` | Allmänt · Rensa enheten |

**Legacy redirects:** `/mabra`, `/planering`, `/hamn`, `/familjen`, `/arbetsliv`, `/drogfrihet`, `/vardagen` → motsvarande `/liv?tab=` eller `/familj?tab=`.

**Dagbok / Reflektion:** `/dagbok` kvar (Fyren-kompass + Valv-bevis). Reflektion nås även via Familj-shell.

**MUST NOT:** publik `/vardagen?tab=kunskap` — Kunskap endast via Valv `kunskapsbank`.  
**MUST NOT:** exponera Valv (växlare, Valv-flik, snabbchips) i publikt drawer-läge.

---

## Läge Valv (PIN i VaultPage)

Visas när `isVaultUnlocked` eller `hasVaultGate()` — **under** Vardag-sektionen (båda syns samtidigt).

**Platta rader** (ingen accordion-grupp i drawer):

| Menyrad | Öppnar | Inuti VaultPage |
|---------|--------|-----------------|
| Spara & sök | `vaultTab=logga` | Logga · Sök |
| Mönster | `vaultTab=monster` | Mönster · Meddelanden/SMS-analys (Orkester) |
| Kunskapsbank | `vaultTab=kunskapsbank` | Kunskapsbank · Aktörskarta |
| Rapporter | `vaultTab=dossier` | Dossier · export |
| Djupare | `vaultTab=hamn_analys` | Forensik-flikar (Hamn, Speglar, …) |

*(Legacy namn **Pansaret** = zoner Spara & sök + Mönster + Rapporter i VaultPage.)*

Alla Valv-rader → `/valvet?vaultTab=…` (utom `/dossier` full vy via sida).

**Tillbaka:** `DrawerModeToggle` med **Vardag** → `/` (Hem — Skriv).

---

## Beteende

| Gest | Resultat |
|------|----------|
| Öppna | Hamburgermeny i header (`AppHeaderBar`) |
| Publikt | Endast Vardag-sektion — ingen Valv-växlare |
| Valv upplåst | **Vardag + Valv** i samma drawer · **Vardag**-knapp → Hem |
| Hub utan drawer-barn | Rad → hub-path; flikar i sidan |
| Valv-rad | Navigera → PIN-gate om stängt → Valv-baksida |
| Stäng | `×`, swipe vänster, tap utanför, route change |

Widget-routes `/widget/*` ingår **inte** i drawer (deep links / PWA).

---

## Implementation

| Komponent | Fil |
|-----------|-----|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` (Vardag + Valv när `vaultOpen`) |
| `DrawerModeToggle` | `src/modules/core/layout/DrawerModeToggle.tsx` (`showValvShell`) |
| `DrawerHubAccordion` | `src/modules/core/layout/DrawerHubAccordion.tsx` |
| Sanning | `src/modules/core/navigation/navTruth.ts` |
| Hub-flikar (synk med nav) | `src/modules/core/navigation/hubTabs.tsx` · `getNavChildren` · `hooks/useHubTab.ts` |
| Göra-flikar | `src/modules/core/navigation/GoraHubTabBar.tsx` |
| Ikoner | `src/modules/core/navigation/drawerNav.ts` |

Kanon: [`COLOR-POLICY.md`](../COLOR-POLICY.md) — aktiv rad endast **guld** `#d4af37`.
