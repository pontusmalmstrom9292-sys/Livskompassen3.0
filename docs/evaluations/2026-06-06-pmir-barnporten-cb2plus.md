# Pre-Merge Impact Report (PMIR) — Barnporten CB2+

**Datum:** 2026-06-06  
**Gren:** `main` (direkt på trunk — ingen feature-gren än)  
**Agent / session:** handoff autonom byggpass v3  
**Scope:** CB2–CB4 widget-varianter · QR enhetskoppling · push (P2)

---

## Sammanfattning

**P1 + CB1 är live och pushad.** CB2+ är **P2 idé** med tidigare Master YOLO **SKIP** ([`2026-05-31-blocker-barnporten-fas2.md`](./2026-05-31-blocker-barnporten-fas2.md)).

Rekommendation: **Våg A** (widget-varianter CB2–CB4, ingen rules) efter produktbeslut om standard-variant. **Våg B** (QR) och **Våg C** (push) kräver separat godkännande + ev. `firestore.rules` deploy.

---

## Nuläge (läst i kod)

| Leverans | Status | Kod |
|----------|--------|-----|
| Barn-hub 2×2 | **done** | `BarnportenPage.tsx` |
| Route `/barnporten` | **done** | `AppRoutes.tsx` |
| Familjen flik + inkorg HITL | **done** | `FamiljenPage.tsx`, `BarnportenInboxPanel.tsx` |
| Orkester → Valv-länk | **done** | `BarnportenOrkesterPanel.tsx` |
| CB1 stjärn-prick | **done** | `BarnportenWidget.tsx`, `/widget/barnporten` |
| Offline-kö | **done** | `barnportenOfflineQueue.ts`, `useBarnportenOfflineFlush` |
| PWA manifest + shortcuts | **done** | `public/barnporten-manifest.webmanifest` |
| CB2–CB4 UI | **saknas** | endast CB1 CSS i `index.css` |
| QR enhetskoppling | **saknas** | spec `barnporten_devices` (P2) |
| Push till förälder | **saknas** | P2 idé |
| Mockups CB2–CB4 | **saknas** | endast `barnporten-widget-CB1.png` |

**Manuell smoke #3** (barn → `children_logs`): fortfarande **USER** — blockerar inte CB2-kod men bör köras före prod på barnenhet.

---

## Gap vs BARNPORTEN-SPEC

| Spec | Idag | CB2+ gap |
|------|------|----------|
| CB1 Stjärn-prick | Implementerad | — |
| CB2 Hjärta-båge (nedre kant, varm) | Nej | CSS + gest (lik W2-form, **inte** Fyren-färger) |
| CB3 Kompass-mini (höger nere) | Nej | Barn-LivskompassMark-liknande, varm palett |
| CB4 Ingen widget | Nej | `variant=none` — endast PWA-ikon |
| QR koppla enhet | Nej | Ny collection + förälder-HITL |
| Push | Nej | FCM / valfritt |
| Valbart CB per enhet | Nej | `localStorage` eller `?cb=` P0; QR P1 |

---

## Följer med till main (vid godkänd Våg A)

- [ ] `BarnportenWidget` — variant-fabrik (`cb1` \| `cb2` \| `cb3` \| `none`)
- [ ] CSS: `.barnporten-widget__arc` (CB2), `.barnporten-widget__compass` (CB3)
- [ ] `WidgetBarnportenPage` — väljare / install-hjälp (CB4 = dölj overlay)
- [ ] Mockups: `docs/design/barnporten/mockups/barnporten-widget-CB{2,3,4}.png`
- [ ] Ev. `barnporten-manifest.webmanifest` shortcut per variant
- [ ] **Oförändrat:** `BarnportenInboxPanel` §7b, `SaveAsEvidencePrompt`, `barnportenAgents.ts`
- [ ] Låst UX — `npm run smoke:locked-ux`: **PASS** (mål)

### Följer med (Våg B — separat PMIR)

- [ ] Collection `barnporten_devices` (append metadata, parent-approved)
- [ ] QR engångskod-flöde (förälder `/familjen?tab=barnporten`)
- [ ] **`firestore.rules`** — **PMIR-STOP** (Master YOLO)

### Följer med (Våg C — valfritt)

- [ ] FCM push vid nytt barnmeddelande (kostnad + enhetsregistrering)

---

## Försvinner

| Vad | Detalj |
|-----|--------|
| Gren | Ingen — arbete på `main` eller ny `feat/barnporten-cb2` |
| Commits som inte mergas | N/A |
| CB1-only hårdkodning | Ersätts av variant-prop; **CB1 förblir default** om inget val |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, U1 silo 3 `children_logs` | **PASS** — samma save-path |
| **Design** | `BARNPORTEN-SPEC.md`, `locked-ux-features.md` §7–7b | **GAP** — CB2–4 mockups saknas; §7b kanon **får inte** regress |
| **Säkerhet** | `.context/security.md`, WORM, `firestore.rules` L53–57 | **PASS** (Våg A) · **STOP** (Våg B rules) |
| **Silo** | Ingen cross-RAG; Valv endast HITL | **PASS** — oförändrat |
| **Parent W1** | `FyrenWidgetBar` / WH1 | **MUST NOT** blanda barn CB med förälder inspelning |

### Sacred / locked — får inte röras

- Auto-promote barnlogg → Valv
- Ta bort `BarnportenInboxPanel` / HITL / `sourceRef`
- Privat `barnporten_privat` i förälder-inkorg
- Barnfokus (`BarnfokusFraganPanel`) på Familjen

---

## Teknisk approach (Våg A — minimal diff)

```
BarnportenWidget({ variant?: 'cb1'|'cb2'|'cb3'|'none', childAlias })
  ← readVariant() from localStorage 'barnporten_widget_variant' or ?cb=
  ← default 'cb1' (bakåtkompat)

CB2: fixed bottom-0 inset-x-0, heart-arc SVG/button, long-press → quickAvsig (samma saveBarnportenLog)
CB3: fixed bottom-right, mini mark, tap → /barnporten, long-press → quickAvsig
CB4: return null (PWA-only)
```

**Delad logik:** behåll `saveBarnportenLog`, `useLongPress`, offline-kö — endast chrome skiljer.

**Inställning:** enkel rad på `/widget/barnporten` eller Barnporten footer — *"Välj widget för den här enheten"* (ingen server P0).

---

## Risker

| Risk | Mitigering |
|------|------------|
| CB2 förväxlas med förälder W2 | Varm amber/skymning; **aldrig** samma CSS-klasser som `FyrenWidgetBar` |
| Skola blockerar overlay | CB4 + PWA shortcuts (redan i manifest) |
| Rules-deploy utan PMIR | Våg B isolerad; Våg A utan rules |
| Saknad barnenhet-test | Manuell #3 före "klart" på prod |

---

## Smoke (efter Våg A)

| Kommando | Förväntat |
|----------|-----------|
| `npm run smoke:locked-ux` | PASS |
| `npm run smoke:orkester` | PASS |
| `npm run build` | PASS |
| Manuell | Barnenhet: CB2 long-press → rad i `children_logs` · CB4 = ingen prick |

---

## Produktbeslut (krävs före kod)

1. **Standard-variant:** CB1 (spec rekommendation) eller **CB2** (surfplatta)?
2. **Våg A nu?** (CB2–CB4 UI only, ingen QR)
3. **QR (Våg B)** — ja/nej i denna sprint?
4. **Inkorg tvåkorts kanon-UI** — redan delvis i `BarnportenInboxPanel`; full pixel-match = separat polish-PMIR?

---

## Rekommendation

- [x] **Våg A** — CB2–CB4 variant-fabrik på `main` / `feat/barnporten-cb2` efter beslut (1)–(2)
- [ ] **Våg B** — QR + `barnporten_devices` — **vänta** tills manuell #3 PASS + explicit rules-OK
- [ ] **Våg C** — push — defer (kostnad)
- [ ] **Merge + push** — endast efter smoke + ditt OK
- [ ] **Avbryt** — behåll CB1-only (nuvarande prod är redan acceptabel P2-del)

---

## Godkännande

**Användaren:** ☑ godkänn Våg A (CB2 default) · ☐ godkänn Våg B (rules) · ☐ avbryt  
**Leverans:** `76f1e9f4` push + hosting deploy 2026-06-06  
**Datum:** 2026-06-06

---

Se även: [`2026-05-29-barnporten-cursor-plan.md`](./2026-05-29-barnporten-cursor-plan.md) · [`docs/design/BARNPORTEN-SPEC.md`](../design/BARNPORTEN-SPEC.md)
