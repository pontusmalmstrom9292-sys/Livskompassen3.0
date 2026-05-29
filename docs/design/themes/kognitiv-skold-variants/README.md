# Kognitiv Sköld — variantpaket (10 st)

**Kanon-referens:** användarens mockup (sjö, `KOGNITIV SKÖLD`, guldsköld, rutiner/budget/utveckling, Dagens riktning).

**Förhandsvisa i Cursor:** [`PREVIEW.md`](./PREVIEW.md) → `Cmd + Shift + V`.

## Innehåll

| Mapp | Innehåll |
|------|----------|
| `reference/` | Uppladdade PNG-referenser |
| `svg/` | K01–K10 vektor-mockups (390×844) |
| `preview/` | PNG för Markdown-preview |

## Implementation (P1 — wired)

- **Kod:** [`kognitivSkoldVariants.ts`](../../../../src/modules/core/home/kognitivSkoldVariants.ts) · [`LivskompassHero.tsx`](../../../../src/modules/core/home/LivskompassHero.tsx)
- **Default:** `K06-nordic-flat` (Obsidian/Nordic guld)
- **Byt variant:** `/?kSkold=K01-sjo-solnedgang` (sparas i `localStorage` `livskompass.kSkold`)
- **Preview:** alla K01–K10 i [`PREVIEW.md`](./PREVIEW.md)

Nästa (P2):

1. Orbit-ikoner per `iconMode` (emboss/gem/pansar)
2. Foto-asset om variant kräver bildbakgrund
3. [`HOME-HERO-KANON.md`](../../references/HOME-HERO-KANON.md) · [`COMPACT-THEME-SPEC.md`](../../compact/COMPACT-THEME-SPEC.md)

## Skript

```bash
npm run kognitiv-skold:generate   # skriv om svg/
npm run kognitiv-skold:preview    # svg → png + öppna PREVIEW.md
```
