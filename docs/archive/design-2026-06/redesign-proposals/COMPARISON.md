# Jämförelse — Style A · B · C

**Datum:** 2026-06-07  
**Mockups:** [`gallery/index.html`](./gallery/index.html)

---

## Snabbval

| Om du vill… | Välj |
|-------------|------|
| Maximal lugn, minsta visuella brus | **A — Nordic Precision** |
| Värme, trygghet, kvällshamn (nära nuvarande ember/D1) | **B — Ember Sanctuary** |
| Futuristisk glas, norrsken, tydlig AI/Kompis-känsla | **C — Aurora Prism** |

---

## Tabell — helhetsstil

| Dimension | A Nordic Precision | B Ember Sanctuary | C Aurora Prism |
|-----------|-------------------|-------------------|----------------|
| **Theme ID** | `R-A-nordic-precision` | `R-B-ember-sanctuary` | `R-C-aurora-prism` |
| **Basfärg** | `#0f1419` kall skiffer | `#1a1410` varm charcoal | `#020617` deep void |
| **Primär accent** | Isblå `#38bdf8` | Guld `#d4af37` | Teal `#2dd4bf` |
| **Sekundär** | Silver `#94a3b8` | Koppar `#b87333` | Violet `#818cf8` |
| **Aktiv nav (låst)** | Guld `#c9a227` | Guld `#d4af37` | Guld `#d4af37` |
| **Panel style** | `obsidian` | `ember` | `aurora` |
| **Typografi** | Inter-first, minimal serif | Cinzel + Inter | Cinzel + Inter + mono data |
| **Kort-radius** | `rounded-xl` (12px) | `rounded-2xl` (16px) | `rounded-2xl` + glass blur |
| **Bakgrund** | Flat, ingen scenic | Varm gradient / optional scenic | Aurora blobs, glass |
| **CTA-känsla** | Kirurgisk, kall | Inbjudande, trygg | Futuristisk, energisk |
| **ADHD-lugn** | ★★★★★ | ★★★★☆ | ★★★☆☆ (mer glow) |
| **Närhet till prod idag** | Låg (stor break) | Hög (nära D1/ember) | Medel (aurora panel finns) |

---

## Zon — rekommenderad stil (subjektivt)

| Zon | A | B | C |
|-----|---|---|---|
| Hem / kompass | A eller B | **B** | C |
| Hjärtat / Dagbok | A | **B** | C |
| Valv / bevis | A | **B** | C (violet forensic OK) |
| Vardagen / Planering | A | B | C |
| Familjen / Barnfokus | B | **B** | C |
| Barnporten (barn) | B | **B** | B/C hybrid |
| Trygg Hamn / BIFF | A | **B** | C |

**Hybrid:** Prod kan teoretiskt bli `B` global + `C` endast Kompis/Orkester — kräver extra blueprint-rad (ej levererad).

---

## 18 skärmar — leveransstatus

| # | Skärm | A | B | C |
|---|--------|---|---|---|
| 1 | Hem | ✅ | ✅ | ✅ |
| 2 | Drawer Vardag | ✅ | ✅ | ✅ |
| 3 | Drawer Valv | ✅ | ✅ | ✅ |
| 4 | Dock + widget | ✅ | ✅ | ✅ |
| 5 | Dagbok | ✅ | ✅ | ✅ |
| 6 | Speglar | ✅ | ✅ | ✅ |
| 7 | Valv Logga | ✅ | ✅ | ✅ |
| 8 | Valv Mönster | ✅ | ✅ | ✅ |
| 9 | Valv Orkester | ✅ | ✅ | ✅ |
| 10 | Kunskapsbank | ✅ | ✅ | ✅ |
| 11 | Kompis | ✅ | ✅ | ✅ |
| 12 | Vardagen launcher | ✅ | ✅ | ✅ |
| 13 | Kanban P3 | ✅ | ✅ | ✅ |
| 14 | MåBra | ✅ | ✅ | ✅ |
| 15 | Barnfokus | ✅ | ✅ | ✅ |
| 16 | Trygg Hamn | ✅ | ✅ | ✅ |
| 17 | Barnporten | ✅ | ✅ | ✅ |
| 18 | Capture/Inkast | ✅ | ✅ | ✅ |

Verifiering: `grep -c 'screen-num' gallery/style-*/screens.html` → 18 each.

---

## Implementation-readiness

| Stil | SPEC | Blueprint | Mockups | Theme Lab kod |
|------|------|-----------|---------|---------------|
| A | ✅ | ✅ | ✅ | ❌ (efter ditt OK) |
| B | ✅ | ✅ | ✅ | ❌ |
| C | ✅ | ✅ | ✅ | ❌ |

---

## Nästa steg

1. Öppna [`gallery/index.html`](./gallery/index.html) i webbläsare  
2. Jämför samma skärmnummer across A/B/C  
3. Skriv t.ex. *«Godkänn stil B — implementera»*  
4. Agent kör [`STYLE-B-IMPLEMENTATION-BLUEPRINT.md`](./STYLE-B-IMPLEMENTATION-BLUEPRINT.md) → Theme Lab → smoke → deploy  

---

## Källfiler

- [STYLE-A-SPEC.md](./STYLE-A-SPEC.md) · [Blueprint A](./STYLE-A-IMPLEMENTATION-BLUEPRINT.md)
- [STYLE-B-SPEC.md](./STYLE-B-SPEC.md) · [Blueprint B](./STYLE-B-IMPLEMENTATION-BLUEPRINT.md)
- [STYLE-C-SPEC.md](./STYLE-C-SPEC.md) · [Blueprint C](./STYLE-C-IMPLEMENTATION-BLUEPRINT.md)
- [Master audit](../../evaluations/2026-06-07-design-redesign-master-audit.md)
