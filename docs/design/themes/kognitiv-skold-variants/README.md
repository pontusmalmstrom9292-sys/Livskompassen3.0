# Kognitiv Sköld — variantpaket (10 st)

**Kanon-referens:** användarens mockup (sjö, `KOGNITIV SKÖLD`, guldsköld, rutiner/budget/utveckling, Dagens riktning).

**Förhandsvisa i Cursor:** [`PREVIEW.md`](./PREVIEW.md) → `Cmd + Shift + V`.

## Innehåll

| Mapp | Innehåll |
|------|----------|
| `reference/` | Uppladdade PNG-referenser |
| `svg/` | K01–K10 vektor-mockups (390×844) |
| `preview/` | PNG för Markdown-preview |

## Implementation (nästa steg)

När variant är vald:

1. Bakgrund: CSS gradient eller foto-asset i `LivskompassHero` / hem-layout
2. Sköld: `livskompass-hero__*` tokens från vald palett
3. Orbit-ikoner: `ChromeV4Icon` eller dedikerade SVG per slot (max 4, L1)
4. Koppling: [`HOME-HERO-KANON.md`](../../references/HOME-HERO-KANON.md) · [`COMPACT-THEME-SPEC.md`](../../compact/COMPACT-THEME-SPEC.md)

## Skript

```bash
npm run kognitiv-skold:generate   # skriv om svg/
npm run kognitiv-skold:preview    # svg → png + öppna PREVIEW.md
```
