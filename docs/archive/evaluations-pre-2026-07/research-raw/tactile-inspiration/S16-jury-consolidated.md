# FP-TI-S16 — Jury konsoliderad: 10 gaps (sandbox vs ref)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S16` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **Jury** | Multi-model (Sonnet, GPT-5.5, Gemini, Opus, Grok) — prompts i `research-raw/prompt-*.md` |
| **Sandbox** | `/dev/design-freeport`, `tactile-obsidian` |

---

## Sammanfattning

| # | Gap | Δ px/visuellt | Prioritet | Våg (S8) |
|---|-----|---------------|-----------|----------|
| G1 | Bottom nav IA (3-zon vs 5-slot) | ~120 px etikett-layout | P0 | W2 |
| G2 | `exec-*` CSS saknas | 100% primitiver | P0 | W1 |
| G3 | EKONOMI-skärm ej implementerad | hel skärm | P0 | W3 |
| G4 | RESURSER overlay saknas | hel skärm | P0 | W2 |
| G5 | DAGBOK foto-kort + datum-pill | ~200 px höjd | P1 | W4 |
| G6 | INSTÄLLNINGAR + röd logout | 52 px knapp | P1 | W5 |
| G7 | Kompass-dekor HEM header | ~120 px bredd | P2 | W2 |
| G8 | Snabbstart 3×1 vs 2×2 grid | ~24 px tile | P2 | W2 |
| G9 | Transaktionsfärg semantik | hex `#10b981` | P2 | W3 |
| G10 | Playwright visual gate | 0% CI coverage | P1 | W6 |

**Konsensus:** G1–G4 blockerar «exact match»-claim; G5–G10 är polish men mäts i S15.

---

## G1 — Bottom navigation IA

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Slots | Hem, Resurser, FAB, Inkorg, Mer | Hem, Hjärtat, FAB, Vardagen, Familjen |
| Komponent | `ExecutiveExactBottomNav` | `FreeportHemV3Lab` BOTTOM_NAV |
| CSS | `.design-freeport__exec-bottom-nav` | `.design-freeport__bottom-nav` (delvis) |

**Åtgärd:** Ny panel `exact` med `ExecutiveExactBottomNav`; behåll Modell A som separat tab.

**Mätt:** etikettbredd diff > `40px` på slot 2 och 4.

---

## G2 — Executive CSS primitiver

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Primitiver | 15× `design-freeport__exec-*` (S14) | 0 fullständiga |
| Bevel | 3-lager shadow | delvis `--fp-inset-top` |
| FAB | 56 px guld gradient | 56 px delvis |

**Åtgärd:** Infoga S12 + S14 i `design-freeport.css`.

**Mätt:** `grep -c design-freeport__exec` ≥ 15 i CSS.

---

## G3 — EKONOMI-skärm

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Skärm | Full ekonomi-vy | Saknas (`FreeportEkonomiLab` planerad) |
| Diagram | 140 px SVG | — |
| Saldo | 124 560 kr | — |

**Åtgärd:** S4 spec → `FreeportEkonomiLab.tsx`.

---

## G4 — RESURSER overlay

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| 9-raders lista | Ja | Nej |
| Sökfält | 48 px bottom | — |
| Valv-rad conditional | Ja | Ej implementerad |

**Åtgärd:** S5 → `ExecutiveResourcesOverlay.tsx`.

---

## G5 — DAGBOK reflektion

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Foto-kort | 200 px, gradient overlay | Text-only delegate |
| Datum-pill | 44 px cirkel aktiv | Saknas |
| CTA outline | «+ Ny anteckning» | Prod copy avviker |

**Åtgärd:** S6 → utöka `FreeportHjartatHub`.

---

## G6 — INSTÄLLNINGAR + logout

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Grupper | Konto + Support | Saknas |
| Logout | `#7f1d1d` gradient | Saknas i sandbox |
| Danger klass | `__exec-btn-danger` | Saknas |

**Åtgärd:** S7 → `FreeportSettingsLab.tsx`.

---

## G7 — HEM kompass-dekor

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Dekor | Stor kompass höger header | Bell-ikon endast |
| Storlek | ~120×120 px | — |

**Åtgärd:** Lägg `LivskompassMark` dekorativ `120px` i `.design-freeport__executive-top` (ej FAB).

---

## G8 — Snabbstart grid

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Layout | 3 kolumner × 1 rad | 2×2 grid (`__quick-grid`) |
| Tiles | Anteckning, Inspelning, Inkast | 4 moduler |

**Åtgärd:** `grid-template-columns: repeat(3, 1fr)` i executive-läge.

---

## G9 — Transaktionsfärger

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Positiv | `#10b981` | Ej verifierad |
| Negativ | `#f5f5f4` (neutral) | Prod kan använda rött |

**Åtgärd:** `.design-freeport__exec-amount--positive` i sandbox only.

---

## G10 — Visual regression CI

| Aspekt | Ref | Sandbox nu |
|--------|-----|------------|
| Playwright | 5 screenshots | Ej i `package.json` |
| Baselines | 5 PNG | Mapp saknas |
| Smoke | `smoke:fp-ti-visual` | Saknas |

**Åtgärd:** S15 implementation W6.

---

## Jury-metod

1. Varje modell jämförde kanon PNG mot `FreeportHemV3Lab` + `design-freeport.css`.
2. Gaps deduplicerades till 10 poster (≥3/5 modeller nämnde = inkluderad).
3. Prioritet: P0 = blockerar exact claim; P1 = synlig vid side-by-side; P2 = pixel-diff < 5 % enskilt.

---

## Stängningskriterium

Alla G1–G10 **Stängd** när:
- S15 snapshot PASS för berörd skärm, **och**
- relevant S4–S7 acceptanslista ✓.

**Status 2026-06-18:** alla G **Öppna** (research only).
