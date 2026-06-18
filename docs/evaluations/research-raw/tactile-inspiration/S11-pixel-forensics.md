# FP-TI-S11 — Pixel-forensik (5-skärms kanon)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S11` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast (`/dev/design-freeport`, `data-fp-theme="tactile-obsidian"`) |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **Viewport-referens** | 390×844 px (iPhone 14 Pro logisk bredd), `devicePixelRatio` 3 |

---

## 1. Globala mätvärden (alla fem skärmar)

### 1.1 Färg — `tactile-obsidian`

| Token | Hex / rgba | Användning |
|-------|------------|------------|
| `--fp-bg` | `#000000` | Rotbakgrund, telefonram |
| `--fp-surface` | `#0a0a0a` | Nav-gradient botten |
| `--fp-surface-2` | `#121212` | Kortfyllnad botten |
| `--fp-surface-3` | `#1e1e1e` | Kortfyllnad topp, aktiv rad |
| `--fp-text` | `#f5f5f4` | Primär brödtext |
| `--fp-text-muted` | `#a8a29e` | Sekundär text, undertitlar |
| `--fp-text-dim` | `#78716c` | Etiketter, metadata |
| `--fp-accent` | `#d4af37` | Rubriker, ikoner, linjer |
| `--fp-accent-dim` | `rgba(212, 175, 55, 0.48)` | Kant aktiv |
| `--fp-accent-glow` | `rgba(212, 175, 55, 0.32)` | Fokusring, FAB-skugga |
| `--fp-border` | `rgba(212, 175, 55, 0.28)` | Standardkant 2 px |
| `--fp-border-strong` | `rgba(212, 175, 55, 0.55)` | Hover / vald kant |
| Guld highlight (bevel topp) | `#f9e498` | 1 px inset highlight |
| Guld skugga (bevel botten) | `#7a5c2f` | 3 px yttre skugga under kort |
| Positiv transaktion | `#10b981` | Belopp + (ICA m.m.) |
| Logout gradient start | `#7f1d1d` | Inställningar — knapp topp |
| Logout gradient slut | `#000000` | Inställningar — knapp botten |

### 1.2 Typografi

| Roll | Font | Vikt | Storlek | Letter-spacing | Transform |
|------|------|------|---------|----------------|-----------|
| Skärmtitel (HEM, EKONOMI …) | Cinzel | 600 | `1.75rem` (28 px) | `0.22em` | uppercase |
| Sektionsetikett | Inter | 600 | `0.625rem` (10 px) | `0.2em` | uppercase |
| Brödtext | Inter | 400 | `0.9375rem` (15 px) | `0` | none |
| Listrad titel | Inter | 600 | `0.9375rem` (15 px) | `0` | none |
| Listrad meta | Inter | 400 | `0.75rem` (12 px) | `0` | none |
| Saldo (EKONOMI) | Inter | 700 | `2rem` (32 px) | `-0.02em` | none |
| Nav-etikett | Inter | 500 | `0.625rem` (10 px) | `0.08em` | none |

### 1.3 Spacing & geometri

| Element | Mått |
|---------|------|
| Safe area topp | 59 px (status bar inkl. Dynamic Island) |
| Horisontell sidomarginal | `1rem` (16 px) |
| Vertikal stack-gap mellan sektioner | `1rem` (16 px) |
| Kort padding | `1.125rem` (18 px) |
| Kort border-radius | `14px` (`--fp-radius`) |
| Kort border-width | `2px` (`--fp-border-bevel-strong`) |
| Listrad höjd | min `52px`, padding `1rem 0.75rem` |
| Bottom nav höjd | `72px` + safe area `34px` |
| FAB diameter | `56px` (`3.5rem`), offset `-24px` (`-1.5rem`) ovanför nav |

### 1.4 Skuggor & elevation

| Nivå | CSS-värde |
|------|-----------|
| Kort (elevation-2) | `0 12px 40px rgba(0, 0, 0, 0.52)` |
| Kort inset topp | `inset 0 2px 0 rgba(255, 255, 255, 0.07)` |
| Kort guld-botten | `0 3px 0 rgba(212, 175, 55, 0.48)` |
| FAB | `0 8px 24px rgba(212, 175, 55, 0.32), 0 4px 0 #7a5c2f` |

---

## 2. Skärm 1 — HEM

**Referensregion:** vänster skärm i kanonbilden.

| Zon | Spec |
|-----|------|
| Header | Flex `space-between`, titel vänster, notis-knapp `40×40px` (`2.5rem`), `border-radius: 999px` |
| Hälsning | `1.125rem`, namn i `#d4af37` |
| Undertitel | `0.625rem`, `letter-spacing: 0.2em`, text «DEN TRYGGA HAMNEN» |
| Dagens ankare | Enkelt kort, brödtext `0.9375rem`, exempel: «Ett mikrosteg räcker.» |
| Dagens steg | 3 rader; checkbox-ikon `36×36px` cirkel; tid höger `0.75rem` (#a8a29e) |
| Snabbstart | Grid `3×1`, tile `min-height: 88px`, ikon-cirkel `40×40px` |
| Statuskort (botten) | 3 kolumner, etikett `0.5625rem`, värde `0.8125rem` |
| Kompass-dekor | SVG/PNG höger, bredd `~120px`, opacity `1.0` |

**Mätbar acceptans:** titel–första kort avstånd `20px` (1.25rem); ankarkort höjd `≥72px`.

---

## 3. Skärm 2 — EKONOMI

**Referensregion:** andra skärm från vänster.

| Zon | Spec |
|-----|------|
| Header | Titel + liten diagram-ikon `20×20px` höger |
| Översikt-kort | Saldo `2rem` / `#f5f5f4`; diagramhöjd `140px` |
| Diagram linje | stroke `#d4af37`, `2px`; area fill `rgba(212, 175, 55, 0.18)` |
| X-axel etiketter | `0.625rem`, månad «Aug» i `#d4af37`, övriga `#78716c` |
| Konton-lista | 3 rader; ikon `32×32px`; «Visa alla >» `0.6875rem` guld höger |
| Transaktioner | Radhöjd `48px`; belopp negativt `#f5f5f4`, positivt `#10b981` |
| Transaktions-avatar | `36×36px`, `border-radius: 8px` |

**Mätbar acceptans:** översiktskort tar `~38%` av scrollhöjd ovanför konton; saldo baseline `32px` från kortets topp-padding.

---

## 4. Skärm 3 — RESURSER

**Referensregion:** mitten-skärm (fullskärmsmeny).

| Zon | Spec |
|-----|------|
| Header | Titel + stäng-ikon `24×24px` (`×`) höger |
| Listposter | 9 rader; radhöjd `56px`; ikon vänster `24×24px`; chevron `>` `16px` guld |
| Radbakgrund | Gradient `165deg, #1e1e1e 0%, #121212 100%`; kant `2px rgba(212,175,55,0.28)` |
| Rad-gap | `8px` mellan rader |
| Sökfält | Höjd `48px`, `border-radius: 14px`, placeholder `0.875rem` `#78716c` |
| Sökfält position | `16px` ovanför bottom nav, full bredd minus `32px` sidomarginal |

**Listordning (låst i ref):** Hem → Ekonomi → Planering → Resurser → MåBra → Dagbok → Familjen → Valvet → Inställningar.

---

## 5. Skärm 4 — DAGBOK

**Referensregion:** fjärde skärm.

| Zon | Spec |
|-----|------|
| Header | Titel + ny-post-ikon `24×24px` |
| Datumväljare | Rad höjd `64px`; cirkel aktiv `44×44px`, bakgrund `#d4af37`, text `#000000` |
| Inaktiv datum | `0.75rem`, `#a8a29e` |
| Reflektionskort | Höjd `~200px`; foto-overlay `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)` |
| Reflektionstext | `0.9375rem` vit, `line-height: 1.55`, max 3 rader |
| Historiklista | 4 rader, ikon `20×20px`, datum `0.75rem` `#78716c` |
| CTA «+ Ny anteckning» | Full bredd, höjd `52px`, guld-kant `2px`, text `0.8125rem` uppercase |

---

## 6. Skärm 5 — INSTÄLLNINGAR

**Referensregion:** femte skärm (höger).

| Zon | Spec |
|-----|------|
| Grupp «Konto & Profil» | 5 rader, samma listspec som RESURSER |
| Grupp «Support» | 2 rader |
| Gruppavstånd | `24px` mellan grupper |
| Logga ut | Höjd `52px`, gradient `180deg, #7f1d1d 0%, #000000 100%`, text `#ffffff` `0.875rem` 600 |
| Logout marginal | `24px` ovanför bottom nav |

---

## 7. Bottom navigation (gemensam)

| Slot | Ikon | Etikett | Tillstånd aktiv |
|------|------|---------|-----------------|
| 1 | Hem (outline) | Hem | Ikon + etikett `#d4af37`, glow `0 0 8px rgba(212,175,55,0.32)` |
| 2 | Rutnät | Resurser | — |
| 3 | FAB Kompass | (ingen etikett) | `56×56px`, D1 `LivskompassMark` |
| 4 | Inkorg | Inkorg | — |
| 5 | Mer (⋯) | Mer | — |

Nav-bakgrund: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.92) 35%, #000 100%)`, `backdrop-filter: blur(12px)`.

---

## 8. Sandbox-mappning (implementationskontroll)

| Ref-klass / element | Sandbox-fil |
|---------------------|-------------|
| `.design-freeport__screen-title` | `src/styles/design-freeport.css` rad ~1078 |
| `.design-freeport__phone--executive` | `FreeportHemV3Lab.tsx` |
| `.design-freeport__exec-bottom-nav` | `ExecutiveExactBottomNav.tsx` (CSS saknas — se S14) |
| Tema `tactile-obsidian` | `design-freeport.css` rad ~137 |

**Mätbar gate:** visuell diff mot kanonbild ≤ 2 % per skärm vid 390×844 (se S15).
