# Nästa fas — plan efter Android-landning + MåBra Daglig Mix

**Datum:** 2026-05-27  
**Git:** `main` · **Föregående landning:** [`2026-05-26-session-landning.md`](./2026-05-26-session-landning.md) · [`2026-05-27-android-landning.md`](./2026-05-27-android-landning.md)  
**GAP-kanon:** [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md) · **Orkester:** [`2026-05-27-orkester-natt.md`](./2026-05-27-orkester-natt.md) PASS

**Nuläge (kort):** Android auth + APK **verifierad** · Daglig Mix **done i kod** (`DagligMixPanel`, DM-* bank) — mount kan vara **olcommittad lokalt** · Arkiv G1–G16 **done** · Life OS Fas A–C **done** · Projekt P1 **done**

---

## Prioriterade spår (6)

| # | Spår | Insats | Varför nu |
|---|------|--------|-----------|
| 1 | **MåBra polish** | S | Stäng loopen på pågående arbete; låg risk |
| 2 | **Manuell smoke-batch** | S | Bekräftar WORM + auth i prod innan större UI |
| 3 | **Projekt P2** | M | Life OS Fas D; P1 klart — naturlig fortsättning |
| 4 | **Inkast fas 2** | M | Inkast Lite 0–1 klart; nästa steg i Life OS-inkorg |
| 5 | **Kunskap UX** | M | Deferred gap-analys; citations + Valv-panel polish |
| 6 | **Barnporten P1** | L | Stort, låst design — kräver egen fokuserad chatt |

---

## Spår 1 — MåBra polish

**Scope**
- Bekräfta `DagligMixPanel` monterad på `/mabra` hub (lokal diff → commit vid behov)
- U6: DM-* poster i `Mabra-CONTENT-BANK` + `INNEHALL-REGISTER` (`content_class: REFLECTION/PLAY`, `bankId`)
- Deterministisk rotation (`pickDagligMix.ts`) — ingen streak/XP
- Smoke: `npm run smoke:innehall`, `npm run smoke:locked-ux`, `npm run build`

**Dependencies**
- Android-landning klar (klar)
- Curator/registrar godkända DM-*-id (U6)

**Agent-kommando**

```text
kör måbra daglig mix polish — mount + bank + smoke. Ingen Kunskap-RAG, inga streaks.
Jämför mot hela projektet. npm run build && npm run smoke:locked-ux && npm run smoke:innehall före klart.
```

**Insats:** **S** (½–1 chatt)

**Definition of done**
- [x] Hub visar Daglig Mix med dagens kort/spel
- [x] Alla DM-* har `bankId` + register-rad (KEEP)
- [x] `npm run smoke:innehall` + `smoke:locked-ux` PASS
- [x] `module_plan.md` / cursor-plan speglar **done** — [`2026-05-29-mabra-cursor-plan.md`](./2026-05-29-mabra-cursor-plan.md)

---

## Spår 2 — Manuell smoke-batch

**Scope**
- En kväll: [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md) **#1, #2, #18** (minimum)
- Utökning samma vecka: **#3–7, #19–20** (Valv, Barnen, Kunskap, låst UX)
- Valv: Firestore Console verifiering av `journal`, `reality_vault`, `children_logs`, `transactions`
- Android: flygplansläge enligt [`OFFLINE-ANDROID.md`](../OFFLINE-ANDROID.md) om ej redan gjort

**Dependencies**
- Inloggad (Google på telefon / Anonymous web)
- Deploy eller lokal `npm run dev` — samma miljö hela batchen

**Agent-kommando**

```text
kör manuell smoke batch — guida mig steg för steg enligt docs/SMOKE_CHECKLIST.md #1+#2+#18.
Skriv resultat till docs/SMOKE_RESULTS.md. Bygg ingen ny kod.
```

**Insats:** **S** (användartid ~30–45 min; agent dokumenterar)

**Definition of done**
- [ ] #1 Auth utan konsolfel
- [ ] #2 Dagbok → rad i `journal`
- [ ] #18 Ekonomi → rad i `transactions`
- [ ] Resultat loggade i `docs/SMOKE_RESULTS.md` med datum
- [ ] (Valfritt) #3–7, #19–20 gröna

---

## Spår 3 — Projekt P2

**Scope** (från [`PROJEKT-SPEC.md`](../design/PROJEKT-SPEC.md) + [`system-plan.md`](../../.context/system-plan.md))
- **Bild-uppladdning:** `project_blocks` type `image` + Storage
- **Regler/automation:** `/projekt/regler` — `project_rules`, koppling `planning_email_rules`
- **Widget-sheet:** Fyren expanderad → `/projekt/ny` (WIDGET-BAR-SPEC v2)
- **MaterialPack-editor:** redigera `materialPacks` per LifeHubPreset (Fas D light)

**Dependencies**
- Projekt P1 **done** (klar)
- Life OS Fas A–C **done** (klar)
- Firestore rules-review vid Storage — **ingen** ändring utan uttrycklig order

**Agent-kommando**

```text
kör projekt P2 — bild, regler, widget-sheet, MaterialPack-editor enligt PROJEKT-SPEC.
Bygg INTE om P1 kanban eller drawer. npm run smoke:locked-ux PASS före klart.
```

**Insats:** **M** (2–3 chattar; dela i under-leveranser om överväldigande)

**Definition of done**
- [ ] Skapa bild-block med Storage-ref; visas i `/projekt/:id`
- [ ] Minst en `project_rule` CRUD + koppling till kanban/inkorg
- [ ] Widget **+** öppnar samma ny-projekt-sheet som `/projekt/ny`
- [ ] MaterialPack kan redigeras (minst en hub)
- [ ] `npm run smoke:locked-ux` PASS

---

## Spår 4 — Inkast fas 2

**Scope**
- Inkast Lite **fas 0–1 done** — bygg **inte** om `InkastLiteCard` / `submitInkastLite`
- Fas 2: utökad inkorg på Planering/Hem — Gmail/e-post routing light ([`PLANERINGSSIDA-SPEC.md`](../design/PLANERINGSSIDA-SPEC.md) Fas 2-idéer)
- G10 backend-routing: samma silos som Drive-ingest; confidence &lt; 0.75 → granskning
- Granskningskö UI (förälder godkänner innan Valv/Kunskap)

**Dependencies**
- `submitInkastLite` + G10 **live** (klar)
- Produktbeslut: e-post vs manuell inklistring i fas 2 (Gmail OAuth = större scope → håll smalt)

**Agent-kommando**

```text
kör inkast fas 2 — läs inkast_life_os plan + G10 backend. Fas 0–1 redan klart.
Bygg INTE om InkastLiteCard. Deploy vid behov. Ny chatt för fas 3+.
```

**Insats:** **M** (1–2 chattar för smal fas 2; Gmail OAuth = L → defer)

**Definition of done**
- [ ] Inkorg visar status: routed / review / rejected
- [ ] Granskningskö: användaren kan godkänna eller avvisa
- [ ] Routing respekterar U1 (tre silos; ingen cross-RAG)
- [ ] `npm run smoke:orkester` PASS efter functions-ändring

---

## Spår 5 — Kunskap UX

**Scope**
- **Klickbara citations** i `KnowledgeVaultChat` (källa → Tidshjul/post)
- `VaultKunskapsbankPanel` polish (redan bakom PIN — gap-analys före mer)
- Policy oförändrad: **ej** auto-ingest Kladd; dagbok→kampspar endast opt-in (G7)
- **Ej** ny FACT utan `specialist-kunskap-seed`

**Dependencies**
- `kunskapsvalv_ux_v2` markerad **deferred** i session-landning — gap-analys först
- Kunskap UI bakom Valv PIN (låst UX)

**Agent-kommando**

```text
kör kunskap UX — klickbara citations + VaultKunskapsbankPanel polish.
Gap-analys först. Ingen auto-ingest Kladd, ingen fjärde RAG-silo.
npm run smoke:orkester PASS.
```

**Insats:** **M** (1–2 chattar)

**Definition of done**
- [ ] Citation-klick öppnar relevant Minne-post eller Tidshjul-nod
- [ ] Vault Kunskapsbank: tydligare tom-state + felhantering
- [ ] Gap-dokumenterat i `src/modules/kompis/module_plan.md`
- [ ] Ingen policy-brott (U1, U6)

---

## Spår 6 — Barnporten P1

**Scope** ([`BARNPORTEN-SPEC.md`](../design/BARNPORTEN-SPEC.md))
- `BarnportenPage.tsx` — barn-hub 2×2 (Prata · Skriv · Humör · Bara för mig)
- `BarnportenWidget.tsx` CB1 + PWA manifest
- Familjen-flik + inkorg + `promoteChildLogToVault` (HITL)
- `BarnportenOrkesterPanel` → Valv Mönster/Orkester (låst)
- `children_logs` WORM, `authorRole: 'child'`, **ingen** cross-RAG

**Dependencies**
- Låst UX smoke (**MUST**)
- Barnens enhet / PWA-install (manuell test)
- HITL-design godkänd — barn text promoveras **aldrig** auto till Valv

**Agent-kommando**

```text
kör barnporten — P1 enligt BARNPORTEN-SPEC och module_plan. CB1 widget + HITL promote.
npm run smoke:locked-ux PASS. Rör inte firestore.rules utan uttrycklig order.
```

**Insats:** **L** (3+ chattar; isolera från andra spår)

**Definition of done**
- [ ] Route `/barnporten` + Familjen-flik
- [ ] CB1 widget + barn-PWA manifest
- [ ] Spara → `children_logs`; Valv endast via HITL
- [ ] `npm run smoke:locked-ux` PASS
- [ ] Infografik/spec uppdaterad vid avvikelse

---

## Bygg INTE (uppskjutet från session-landning)

| Objekt | Status | Anledning |
|--------|--------|-----------|
| Drawer Vardag/Valv, Inkast Lite 0–1, Life Hub Fas A–B | **done** | Bygg inte om |
| Fyren W1 rutnät 4×2 | **cancelled** | Life Hub + drawer räcker |
| `måbra_hub_utbyggnad` | **cancelled** | → Daglig Mix |
| `p0_ux_inkorg_build` | **cancelled** | → Inkast Lite |
| Header blur (rest) | **deferred** | Endast vid full header-plan |
| `valv-tier_+_3_hubbar` B3–E | **deferred** | B1–B2 done |
| `grunder_och_systemordning` GCP U6 | **deferred** | Ops senare |
| `kunskapsvalv_ux_v2` (full) | **deferred** | Gap-analys före rest (spår 5 = smal start) |
| Genkit V1 | **wait** | Ej påbörjad |
| MåBra streak/XP/gamification | **rejected** | Mabra-SPEC, U6 |
| Fjärde RAG-silo / cross-read | **förbjudet** | U1 |
| Gmail OAuth full (Inkast) | **defer** | Ta manuell/klistra-in i fas 2 först |
| `firestore.rules` / Sacred paths | **förbjudet** | Utan uttrycklig order |
| Merge utan PMIR + `godkänn merge` | **förbjudet** | [`git-main-trunk.mdc`](../../.cursor/rules/git-main-trunk.mdc) |

---

## Rekommenderad ordning (ADHD-säker — ett steg i taget)

**Regel:** Avsluta **ett** steg helt (DoD) innan nästa kommando. Ingen parallell produktutveckling.

| Steg | Gör | Kommando / åtgärd | Klart när |
|------|-----|-------------------|-----------|
| **0** | Bekräfta grön bas | `npm run orkester:night` | Rapport PASS (redan 2026-05-27) |
| **1** | Stäng MåBra-loopen | `kör måbra daglig mix polish` | Spår 1 DoD |
| **2** | Verifiera data i Firestore | Manuell smoke #1+#2+#18 | Spår 2 DoD (minimum) |
| **3** | Android offline (om ej gjort) | Flygplansläge-test | Android-landning #4 PASS |
| **4** | Ett Life OS-spår | **`kör projekt P2`** *eller* **`kör inkast fas 2`** | Välj **ett**; DoD för valt spår |
| **5** | Kunskap citations | `kör kunskap UX` | Spår 5 DoD |
| **6** | Barnporten (egen sprint) | `kör barnporten` | Spår 6 DoD — **inte** blanda med steg 4–5 |

**Beslut punkt 4:** Om du vill **se material i vardagen** → Projekt P2. Om du vill **tömma inkorg/e-post** → Inkast fas 2. Båda kan vänta tills steg 1–3 är gröna.

---

## Snabbreferens — agentprompter

### MåBra polish (steg 1)

```text
kör måbra daglig mix polish — mount + bank + smoke. Ingen Kunskap-RAG, inga streaks.
Jämför mot hela projektet. npm run build && npm run smoke:locked-ux && npm run smoke:innehall före klart.
```

### Manuell smoke (steg 2)

```text
kör manuell smoke batch — guida mig steg för steg enligt docs/SMOKE_CHECKLIST.md #1+#2+#18.
Skriv resultat till docs/SMOKE_RESULTS.md. Bygg ingen ny kod.
```

### Projekt P2 (steg 4a)

```text
kör projekt P2 — bild, regler, widget-sheet, MaterialPack-editor enligt PROJEKT-SPEC.
Bygg INTE om P1 kanban eller drawer. npm run smoke:locked-ux PASS före klart.
```

### Inkast fas 2 (steg 4b)

```text
kör inkast fas 2 — läs inkast_life_os plan + G10 backend. Fas 0–1 redan klart.
Bygg INTE om InkastLiteCard. Deploy vid behov. Ny chatt för fas 3+.
```

---

## Relaterade filer

| Fil | Roll |
|-----|------|
| [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md) | Modul-GAP live |
| [`2026-05-26-session-landning.md`](./2026-05-26-session-landning.md) | Plan-register |
| [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) | Fas C–D |
| [`MABRA-DAGLIG-MIX-PROMPT.md`](../prompts/MABRA-DAGLIG-MIX-PROMPT.md) | Daglig Mix kanon |
| [`2026-05-27-android-landning.md`](./2026-05-27-android-landning.md) | Android DoD |
