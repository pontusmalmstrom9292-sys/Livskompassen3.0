# Kunskapsbank i Valv — layoutkanon (2026-06)

**Status:** Godkänd referens av Pontus · **Användning:** Valv-zon Kunskap, framtida supermoduler  
**Prod:** `/valvet?vaultTab=kunskapsbank` (PIN bakom Valv)  
**Skärmbild:** [`kunskapsbank-valv-kanon-ref.png`](./kunskapsbank-valv-kanon-ref.png)

---

## Varför detta upplägg

Pontus bedömning **2026-06-19:** Kunskapsbank-fliken i Valv känns **skitsnygg** och **på god väg** — tät men lugn hierarki, inga staplade banners, naturlig sidscroll. Detta ska vara **referensmall** när vi bygger fler Valv-zoner och inbäddade kunskapsmoduler.

| Egenskap | Beskrivning |
|----------|-------------|
| **Kompakt hub-header** | En rad: `Valv` / `Sanningsarkiv` — ingen CognitiveLoadStrip, ingen dubbel ARKIV-banner |
| **En scroll-yta** | Hela sidan scrollar — **ingen** nästad `calm-scroll-island` med `max-h` |
| **Bento-kort** | `BentoCard` med indigo glow — innehåll i lager, inte flytande paneler |
| **Progressive disclosure** | Filarkiv och Familjen-upload i `CalmCollapsible` (stängda som default) |
| **Lokal zon-rubrik** | `KunskapsbankHeader compact` — ikon + titel + kort etikett, inte `elongated-module` |
| **Obsidian Calm** | Mörk yta, guld accenter, dämpad indigo på kort |

---

## Anatomi (lager uppifrån)

```
┌ HubPageShell ─────────────────────────────┐
│ eyebrow: Valv · title: Sanningsarkiv      │  ← enda sid-header
├ ValvBentoShell (showZonePill=false) ───────┤
│ [ValvInputSuperModule — mode picker]      │  ← endast när zon ≠ kunskap
├ VaultKunskapsbankPanel ──────────────────┤
│ [📖 Kunskapsbanken · Fakta och minne]     │  ← compact header
│ ┌ BentoCard (KunskapPage embedded) ─────┐ │
│ │ SANNINGSARKIV / KUNSKAP · chat/RAG    │ │
│ └───────────────────────────────────────┘ │
│ ▼ Filarkiv (CalmCollapsible)              │
│ ▼ Familjen — kunskap (CalmCollapsible)    │
│ länk: Aktörskarta                         │
└───────────────────────────────────────────┘
```

**Scroll:** `ValvetRoutePage` utan `lockViewport` / `hub-view-lock`. Ingen `overflow-hidden` på huvudkort som klipper innehåll.

---

## Produktbeslut (2026-06-19)

| Beslut | Detalj |
|--------|--------|
| **Behåll** | Kompakt `HubPageShell`, `KunskapsbankHeader compact`, `BentoCard`-stack, collapsibles |
| **Ta bort** | Triple-header (Arkiv + CognitiveLoadStrip + zone pill + forensic banner) |
| **Ta bort** | Nästad scroll (`calm-scroll-island max-h-[min(75vh,720px)]`) i supermodul |
| **Framtida zon** | Nya Valv-flikar ska följa samma **en header + bento + collapsible**-mönster |

---

## Kodkoppling

| Del | Fil |
|-----|-----|
| Route + sid-header | `src/modules/core/pages/ValvetRoutePage.tsx` |
| Valv-skals (ingen zone-pill) | `ValvBentoShell` · `VaultPage.tsx` |
| Kunskapsbank-panel | `VaultKunskapsbankPanel.tsx` |
| Kompakt rubrik | `KunskapsbankHeader.tsx` (`compact`) |
| RAG / chat-innehåll | `KunskapPage.tsx` (`embedded`) |
| Filarkiv | `AutonomousArchivePanel` i `CalmCollapsible` |
| Familjen-upload | `FamiljenKunskapHubTab` i `CalmCollapsible` |

---

## MUST (framtida byggen)

- En primär scroll per vy på mobil (G85).
- Max **en** sid-header + **en** lokal zon-rubrik per flik.
- Sekundärt innehåll (arkiv, upload, metadata) i collapsible — inte ovanför huvud-CTA.
- Kunskap bakom Valv-PIN — **ingen** publik `/vardagen?tab=kunskap` (U1 silo).

## MUST NOT

- `lockViewport` / `hub-view-lock` på Valv-rutter utan PMIR.
- Nästad `calm-scroll-island` med fast `max-h` inuti redan scrollande hub.
- `elongated-module--gold` banner **plus** `HubPageShell` title **plus** zone pill (triple stack).
- Cross-RAG mellan Kunskap och Valv-bevis (U1).

---

## Smoke

`npm run smoke:locked-ux` · `npm run smoke:innehall` (Kunskap RAG)
