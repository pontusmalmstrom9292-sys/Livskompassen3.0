# FP-TI-S10 · Tactile Mid-Depth premium dark — tokens & hub-arketyper

**Roll:** Design systems architect · **Scope:** sandbox (`--fp-*` i `design-freeport.css`) · prod Obsidian Calm orörd  
**Referens:** D Skiffer sammet (`tactile-slate`) · **Datum:** 2026-06-18

---

## 1. Tjugo designtokens

| Token | Värde |
|-------|-------|
| `--fp-bg` | `#0c0e14` |
| `--fp-surface` | `#111827` |
| `--fp-surface-2` | `#1a2234` |
| `--fp-surface-3` | `#232d42` |
| `--fp-accent` | `#8b7d9e` |
| `--fp-accent-dim` | `rgba(139,125,158,.38)` |
| `--fp-accent-glow` | `rgba(139,125,158,.2)` |
| `--fp-border` | `rgba(139,125,158,.16)` |
| `--fp-border-strong` | `rgba(139,125,158,.34)` |
| `--fp-glass` | `rgba(17,27,45,.78)` |
| `--fp-elevation-1` | `0 4px 16px rgba(0,0,0,.28)` |
| `--fp-elevation-2` | `0 8px 32px rgba(0,0,0,.45)` |
| `--fp-inset-top` | `inset 0 1px 0 rgba(255,255,255,.04)` |
| `--fp-inset-pressed` | `inset 0 2px 4px rgba(0,0,0,.35)` |
| `--fp-blur` | `16px` |
| `--fp-radius-sm` | `8px` |
| `--fp-radius` | `10px` |
| `--fp-radius-lg` | `14px` |
| `--fp-font-display` | `Outfit, Inter, system-ui, sans-serif` |
| `--fp-morph-ms` | `350ms` |

*Princip:* 3 ytnivåer, en accent per tema, max en rörelse per interaktion.

---

## 2. Tabell: token | värde | användning | ADHD-notering

| Token | Värde | Användning | ADHD-notering |
|-------|-------|------------|---------------|
| `--fp-bg` | `#0c0e14` | App-bakgrund | Mörk skiffer — inte rent svart |
| `--fp-surface` | `#111827` | Inset, viewport | Tredje plan utan extra färg |
| `--fp-surface-2` | `#1a2234` | Kort, knappar | Primär interaktionsyta |
| `--fp-surface-3` | `#232d42` | Aktiv/hover | Sparsamt — undvik «allt lyser» |
| `--fp-accent` | `#8b7d9e` | CTA, vald flik | Avviker från prod-guld |
| `--fp-accent-dim` | `rgba(…,.38)` | Aktiv kant, fokusring | Dämpad — ej varning |
| `--fp-accent-glow` | `rgba(…,.2)` | Statisk halo | Ingen puls |
| `--fp-border` | `rgba(…,.16)` | Standardkant | Tunn struktur |
| `--fp-border-strong` | `rgba(…,.34)` | Hover/vald | Endast *en* hover-signal |
| `--fp-glass` | `rgba(17,27,45,.78)` | Hub-kort, header | Glas utan neon |
| `--fp-elevation-1` | `0 4px 16px …` | Discovery-kort | Mjuk drop |
| `--fp-elevation-2` | `0 8px 32px …` | Chameleon-shell | Zon-djup utan rörelse |
| `--fp-inset-top` | `inset 0 1px 0 …` | Viewport | Taktil «inåt» |
| `--fp-inset-pressed` | `inset 0 2px 4px …` | Pressad knapp | Djup utan animation |
| `--fp-blur` | `16px` | Glas-ytor | GPU — testa Android |
| `--fp-radius-sm` | `8px` | Chips, mode-knappar | Memo minimum |
| `--fp-radius` | `10px` | Zon-kort | Mjukare än skarpa 4px |
| `--fp-radius-lg` | `14px` | Hub-kort, phone | Större yta = mjukare |
| `--fp-font-display` | Outfit, Inter | Rubriker | Cinzel bara medvetet (E) |
| `--fp-morph-ms` | `350ms` | Chameleon | `prefers-reduced-motion` → 0ms |

---

## 3. Hub-layout-arketyper (samma tokens)

**Lista** — vertikal stack: `--fp-glass` hub → rader `--fp-surface-2` → inset `--fp-surface`. *ADHD:* en skanningsväg.

**Grid** — 4 zon-ikoner + discovery; `--fp-border-strong` på aktiv. *ADHD:* kräver tydlig aktiv markering.

**Fokus** — ett hub-kort (glas + blur), meta-chips, inset-ruta; shell elevation-2. *ADHD:* ett fokusobjekt.

---

## 4. CSS-only vs liten Three.js (sandbox)

| | CSS-only | Three.js |
|--|----------|----------|
| **För** | Noll dependency; billig drift; reduced-motion enkelt | Subtil kompass-parallax |
| **Nackdel** | `backdrop-filter` på äldre Android | GPU/batteri; arousal-risk |
| **Rekommendation** | **Default** | Opt-in, pausad, av vid reduced-motion |

---

## 5. Avvisat generiskt utkast

`color-bg-primary` (#1B1B1F), 4px hörn och saknad accent matchar inte S1-memo. Använd `--fp-*` kanon.

**Nästa:** 5 min A→E i `/dev/design-freeport`.
