# Valv hubb — Konflikt & bevis (IA våg 1)

**Datum:** 2026-05-29  
**Status:** Implementerad i kod (`vaultTabs.ts`, `VaultPage.tsx`)  
**Låst UX:** Mönster, Orkester, Kunskapsbank, Aktörskarta — **får inte tas bort** ([`.context/locked-ux-features.md`](../../.context/locked-ux-features.md))

---

## Princip

Samma `vaultTab`-IDs och callables som tidigare. Endast **zon-navigation** (färre val åt gången) och drawer-grupper ändras.

| Zon (UI) | Flikar (`vaultTab`) | Användning |
|----------|---------------------|------------|
| **Samla** | `logga`, `sok` | Bevis, sms, triage, Valv-Chat |
| **Analysera** | `monster`, `orkester` | Mönster, agent-orkester |
| **Kunskap** | `kunskapsbank`, `aktorskarta` | RAG fakta, nyckelpersoner (G9) |
| **Exportera** | `dossier` | Dossier-generator (+ `/dossier` i drawer) |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, … | Djup analys Hamn/Speglar/Arbetsliv |

## Produktbeslut — Hamn vs Valv (**godkänt 2026-05-29**)

| Lager | Route | Roll |
|-------|-------|------|
| **Snabb ingång** | `/hamn` (Vardag-drawer) | Grey Rock/BIFF-svar, Speglar-bro, låg friktion — **ingen** riskpanel eller auto-bevis |
| **Djup + bevis** | Valv → zon **Forensik** · `hamn_analys` | Full BIFF Triage, DCAP, *Spara som bevis*, Orkester, Mönster, Dossier |

**MUST NOT:** flytta publik BIFF till Valv-only eller kräva PIN för första Grey Rock-svar.  
**MUST:** `?tab=analys` på `/hamn` redirectar till Valv `hamn_analys` (redan i `TryggHamnHub.tsx`).  
**Handoff:** `valvHandoff` i Hamn-text → mjuk länk till Valv (ingen auto-WORM).

---

## Triggers (våg 2)

| Källa | Trigger | Effekt |
|-------|---------|--------|
| Dagbok | `shouldShowValvHandoff` | `HandoffBox` → `/valvet` |
| Hamn BIFF | samma | HandoffBox efter klistra-in |
| Valv logga | samma + `shouldSuggestVaultPatternScan` | Handoff + länk till Mönster |

Ingen auto-WORM från Lager 1.

---

## Budget

Deterministiska regex/DCAP — **inte** LLM per tangenttryckning.

---

## Kunskapsbank — layoutreferens (**godkänd 2026-06-19**)

Pontus: upplägget i Kunskapsbank-fliken är **snugg, proffsigt och på god väg** — använd som mall för framtida Valv-zoner.

| Aspekt | Kanon |
|--------|-------|
| Route | `/valvet?vaultTab=kunskapsbank` |
| Header | Kompakt `HubPageShell` + `KunskapsbankHeader compact` — **ingen** triple-banner |
| Scroll | En sidscroll — **ingen** nästad `calm-scroll-island` |
| Innehåll | `BentoCard` + `CalmCollapsible` för arkiv/upload |

Full spec + skärmbild: [`references/KUNSKAPSBANK-VALV-KANON.md`](./references/KUNSKAPSBANK-VALV-KANON.md) · [`kunskapsbank-valv-kanon-ref.png`](./references/kunskapsbank-valv-kanon-ref.png)

---

## Smoke

`npm run smoke:locked-ux` · `npm run smoke:orkester`
