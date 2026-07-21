# Unlock — MOD-VARD-PLAN (tab=bygg · W3)

**Datum:** 2026-07-21  
**Modul:** `MOD-VARD-PLAN`  
**Våg:** W3 (masterplan v2.2 «Egna moduler»)  
**approved: yes**

**Pontus OK:** 2026-07-21 — «godkänn v2.2 kör hela planen».

**Relaterat:**  
- Masterplan: [`docs/evaluations/2026-07-21-modulbygg-pin-kanon-masterplan.md`](./2026-07-21-modulbygg-pin-kanon-masterplan.md)  
- Motor-unlock: [`docs/evaluations/2026-07-21-unlock-MOD-WIDGET-egna-moduler-w1.md`](./2026-07-21-unlock-MOD-WIDGET-egna-moduler-w1.md)

---

## Syfte

Smal unlock av Planering-skalet för **endast** `?tab=bygg` («Mina moduler»-hub) — länkar till widget-motorn. Ingen ny MOD-BYGG.

---

## In-scope (W3)

| Yta | Tillåtet |
|-----|----------|
| `PlaneringTab` / parse | Lägg till `bygg` |
| `PlaneringPage` + hub config | Render panel för `tab=bygg` |
| Entry copy / navigation | Länk till `/widget/moduler` eller inbäddad motor-vy |
| Progressive disclosure | En hub — inte ersätta Handling/Fokus/Inkorg |

---

## Out-of-scope (MUST NOT)

- Ändra Handling / Fokus / Inkorg / Regler / Framsteg-beteende utöver additiv tab
- Ny MOD-BYGG-modul
- Dual-pin localStorage-features (migrate = W4)
- Fyren / record / ingest
- Hem DAD-omstrukturering
- Widget-motor-internals (ägare: MOD-WIDGET)

---

## Förutsättning

W1 (motor) DoD + re-lock GO innan W3 feature landar i prod-flöde.  
W0 docs (denna unlock) får finnas i förväg — **kod** först när vågordning tillåter.

---

## Lock-kontrakt

```
unlock-doc (approved: yes) + register developing
  → feature (additiv tab=bygg)
  → smoke: locked-ux (+ design-modules vid UI)
  → lock_module.mjs
```

**Status:** approved for W3; developing först när W1/W2 DoD klar per masterplan §6.

---

*Docs only i W0.*
