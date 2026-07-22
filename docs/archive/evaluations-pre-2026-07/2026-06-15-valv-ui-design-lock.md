# Valv — UI design lock (Obsidian Calm 2.0)

**Datum:** 2026-06-15  
**Status:** LOCK för B1-implementation  
**Kanon:** `src/styles/obsidian-calm-2.css` · `.cursor/rules/design-calm.mdc`

---

## Skal

| Element | Klass / komponent | Regel |
|---------|-------------------|-------|
| Huvudkort | `BentoCard` `glow="blue"` | Indigo bottom-glow (Familj/Valv-silo) |
| Yta | `calm-card` / `bg-surface-2/70` | `backdrop-blur-xl`, `rounded-2xl` |
| Scroll | `calm-scroll-island` | Endast innehåll scrollar — hub-view-lock på shell |
| Rubrik zon | `valv-forensic-header` | `font-display-serif`, uppercase, `tracking-[0.2em]` |
| Etiketter | `text-text-muted`, `text-xs`, uppercase | Ingen tung fetstil i hub |

---

## Lägesväljare (Fas 1B)

- Primära pills: **Inkast** · **Granska** · **Analysera** · **Kunskap**
- Native `<select>` för **Mer…**: Min utveckling, Rapporter, Mer (forensik)
- Mönster: `familjen-mode-picker` / `od-depth__pill` (samma som Familjen/MåBra)

---

## Förbjudet

- Streak, XP, gamification
- Naturtema, regnbågsgradienter
- Turkos/indigo som **aktiv** chrome (guld = aktiv enligt COLOR-POLICY)
- Ta bort eller döpa om locked flikar: `monster`, `orkester`, `kunskapsbank`, `aktorskarta`
- Publikt exponera Valv-terminologi

---

## Copy

| ID | Label |
|----|-------|
| `spara` | Inkast (UI) — internt ID `spara` |
| `sok` | Sök i arkiv (inte «Granska inkommande») |
| `granska` | Granska (kö) |

---

## Progressive disclosure

- **Samla:** dropzone först; `VaultEntryForm` under `<details>` «Manuell post»
- **Forensik:** aktiv flik + «Visa fler» (redan i `ValvForensikZone`)
- **Zonväljare:** första PIN-session — kort per zon inkl. forensik
