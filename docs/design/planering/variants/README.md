# Planeringssidan + Widget — 4+4 varianter

**Tema:** E — samma guld/skymning som [`HOME-HERO-KANON.md`](../../references/HOME-HERO-KANON.md).  
**Ikoner:** L2/L3 endast (line gold) — **inte** kompass-emboss.

Full spec: [`PLANERINGSSIDA-SPEC.md`](../../PLANERINGSSIDA-SPEC.md)

---

## Planeringssidan (välj en)

| ID | Namn | Beskrivning |
|----|------|-------------|
| **P1** | Trippel-flik | `Inkorg` \| `Kalender` \| `Handling` — tydligast ADHD |
| **P2** | Dags-tidslinje | En vertikal “idag” med e-post + möten + mikrosteg |
| **P3** | Byrå-kanban | Att göra / Väntar / Klart |
| **P4** | Handlingskö | Regelfilter överst + en lista |

**Rekommendation:** **P1** först, **P2** som andra vy (toggle).

---

## Widget bar (välj en)

| ID | Aktivering tyst inspelning | Diskretion |
|----|---------------------------|------------|
| **W1** | Dubbeltryck kant-prick | Högst — default |
| **W2** | Långtryck nedre båge | Medel |
| **W3** | Håll dock-kompass 1s | Medel (risk: barn ser dock) |
| **W4** | Trippeltryck hörn 12px | Högst men svårare hitta |

**Rekommendation:** **W1** + samma guld-prick som dock-centrum i kanonbilden.

---

## Snabb wireframe (text)

### P1
```
[PLANERING]  guld
[ Inkorg | Kalender | Handling ]
─────────────────────────
📧 Skola: utvecklingssamtal    →
📧 Advokat: komplettering      →
─────────────────────────
```

### W1 (expanderad)
```
        │ 🎙 tyst
 screen │ 📝 anteckning
        │ 📅 planering
        │ ◆ (prick)
```

---

## Mockup-bilder

| Fil | Status |
|-----|--------|
| `P1-trippel-flik.png` | ✓ |
| `P2-dags-tidslinje.png` | ✓ (återställd) |
| `P3-byrå-kanban.png` | ✓ |
| `P4-handlingskö.png` | ✓ |

Galleri: [`../../galleri/planering-variants/`](../../galleri/planering-variants/) · W1–W4 i [`../../galleri/widget/`](../../galleri/widget/).
