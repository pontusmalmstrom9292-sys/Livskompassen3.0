# Bästa Design — Code Connect & prod parity

**Plattform:** Cursor · **Tema:** `ME-basta-design` (Executive Midnight DAD)

## Figma Make (källa)

| Resurs | URL |
|--------|-----|
| Make-prototyp | https://www.figma.com/make/XAkUe9ztRt1Nes0ysXL8Xb/bästa-design |

Make returnerar React-källkod, **inte** publicerade Design-noder. `get_code_connect_suggestions` fungerar **inte** mot Make-filer.

## Prod-mappning

| Figma Make (skärm) | Prod-komponent | Route / tema |
|--------------------|----------------|--------------|
| Home — Dagens reflektion | `BastaDesignHero` | `/` + `BastaDesignHome` |
| Home — kort (fokus, coach, ankar, plan) | `BastaCard`, `BastaCardHeader`, `BastaButton` | `bastaDesignParts.tsx` |
| Header | `BastaDesignHeader` | `app-shell--basta-design` |
| Dock + kompass | `BastaDesignDock` → `ExecutiveDockBar` | Locked UX |
| Ekonomi / Resurser / Dagbok / Inställningar | Befintliga hub-routes | `/vardagen`, overlay, `/hjartat`, `/installningar` |

**Lab:** `/dev/basta-design`  
**Tokens:** `src/modules/core/theme/themePackBastaDesign.ts`, `src/styles/basta-design.css`

### Token-drift (Make → prod)

| Make | Prod (`--bd-*`) |
|------|-----------------|
| `#c9a435` | `#d4af37` (`--bd-accent`) |
| `#080a12` | `#07101d` (`--bd-bg`) |

Prod använder kanoniska DAD-tokens; header-ornament använder `currentColor` + `var(--bd-accent)`.

## Code Connect-filer

| Fil | Kod |
|-----|-----|
| `src/figma/connect/basta-design/BastaCard.figma.tsx` | `BastaCard` |
| `src/figma/connect/basta-design/BastaButton.figma.tsx` | `BastaButton` |
| `src/figma/connect/basta-design/BastaDesignHero.figma.tsx` | `BastaDesignHero` |
| `src/figma/connect/basta-design/BastaDesignHeader.figma.tsx` | `BastaDesignHeader` |
| `src/figma/connect/basta-design/BastaDesignDock.figma.tsx` | `BastaDesignDock` |

Node-id pekar tills vidare på **Obsidian Calm**-placeholders. När Bästa Design publiceras som komponentbibliotek i Figma Design: uppdatera URL + `node-id` i respektive `.figma.tsx`.

## Publicera Code Connect

```bash
npx figma connect publish
```

Kräver Figma CLI-inloggning och att target-noder finns i en **Design**-fil (inte Make).

## Verifiering

```bash
npm run build
npm run smoke:locked-ux
```

Visuell kontroll: `/dev/basta-design` eller aktivera `ME-basta-design` i Theme Lab.
