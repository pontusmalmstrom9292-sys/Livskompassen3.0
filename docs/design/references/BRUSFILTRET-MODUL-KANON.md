# Brusfiltret-modulen — layoutkanon (2026-06)

**Status:** Godkänd referens av Pontus · **Användning:** SuperModule / widget / kompakt panel  
**Prod:** `/widget/hamn` · Fyren · sidomeny (Brusfiltret)

---

## Varför denna modul

Upplägget i `brusfiltret-modul-kanon-ref.png` är **snugg, proffsigt och kognitivt lugnt**. Det ska vara **mall** för fler moduler — inte bara Hamn/BIFF.

| Egenskap | Beskrivning |
|----------|-------------|
| **Tät hierarki** | Rubrik → ett fält → en primär CTA → hjälptext → sekundär låda |
| **En handling i taget** | Ett textarea, en huvudknapp — inget menyrace |
| **Sekundär zon** | Avgränsad footer-ruta (taktik-lexikon / handoff) utan att konkurrera med CTA |
| **Obsidian Calm** | Mörk yta, guld accenter, dämpad teal på primärknapp (silo kan bytas) |

---

## Anatomi (5 lager)

```
┌─────────────────────────────────────┐
│ [ikon] Titel                    [×] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ textarea (placeholder lugn)    │ │
│ └─────────────────────────────────┘ │
│ [──────── Primär CTA ────────]       │
│ hjälptext · länkar (muted + guld)   │
├─────────────────────────────────────┤
│ ┌ footer-submodule ───────────────┐ │
│ │ förklarande brödtext (2–3 rader)│ │
│ │ [ sekundär outline-knapp ]      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Mått (mobil G85):** max-bredd ~360–420px i popover; widget-route kan använda full `WidgetShell`.

---

## Färgvarianter (samma skelett)

| Variant | Silo | Primär CTA | Glow / kant |
|---------|------|------------|-------------|
| **A · Hamn (kanon)** | Indigo | Teal/smaragd | `glow-bottom-blue` |
| **B · SuperModule** | Indigo | Indigo `#6366f1` | Större kort, fler tabs ovanför fält |
| **C · MåBra / Vit** | Smaragd | Emerald `#10b981` | `glow-bottom-green` |
| **D · Valv / Bevis** | Guld | Guld `#d4af37` | `glow-bottom-gold` |

Exempelbilder:

- `brusfiltret-modul-kanon-ref.png` — prod-referens
- `brusfiltret-variant-supermodule-indigo.png` — större, flikrad
- `brusfiltret-variant-mabra-emerald.png` — grön silo
- `brusfiltret-variant-valv-gold-expanded.png` — guld + fylligare footer

---

## Utökning till SuperModule

1. **Behåll** fält + CTA + hjälptext oförändrat.
2. **Lägg till** mode-tabs *ovanför* textarea (max 4–6 synliga).
3. **Flytta** sekundära verktyg till footer-submodule — inte ny FAB.
4. **Fylligare meny** = drawer eller Fyren — inte fler flytande knappar.

---

## Kodkoppling

| Del | Komponent |
|-----|-----------|
| Brusfiltret / BIFF | `BiffPublicPanel` → `WidgetHamnPage` |
| Voice-to-Vault | `QuickCapturePanel` → `WidgetVoiceVaultPage` |
| Widget-skals | `WidgetShell` |
| Fyren / meny | `FyrenWidgetBar` · `navTruth` `fyren_*` |

---

## MUST NOT

- Flytande FAB ovanpå dock.
- Fler än en primär CTA i samma vy.
- Cross-RAG-länkar utan silo-etikett.

## Theme Lab (Variant B — kodprototyp)

Interaktiv jämförelse: **`/dev/theme-lab/brusfiltret-supermodule`**

- Shell: `src/modules/sandbox/brusfiltret/BrusfiltretSupermoduleShell.tsx`
- Lab-sida: `src/modules/core/pages/BrusfiltretSupermoduleLabPage.tsx`
- CSS: `src/styles/theme-lab-brusfiltret-supermodule.css`
