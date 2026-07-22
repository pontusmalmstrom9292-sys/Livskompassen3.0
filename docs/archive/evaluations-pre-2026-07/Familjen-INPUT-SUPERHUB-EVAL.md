# Fas 7 — Familjen: djupanalys för Universal Input Superhub

**Datum:** 2026-06-14  
**Status:** **Djupanalys — väntar godkännande** · ingen kod förrän Pontus godkänner SPEC (Fas 7A)  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) § Fas 6 (zon 2: Super-Familjen Input) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §1, §7, §7b · [`docs/INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md)  
**Mönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](../specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md) · [`2026-06-14-fas6-mabra-superhub-djupanalys.md`](./2026-06-14-fas6-mabra-superhub-djupanalys.md) · [`2026-06-06-supermodule-master-plan.md`](./2026-06-06-supermodule-master-plan.md)

---

## Slutsats

Familjen-zonen har **minst 8 distinkta inmatningsytor** som skriver till **`children_logs`** (WORM), plus **3 HITL-promotionvägar** till **`reality_vault`**, plus **1 read-only RAG-yta** (`childrenLogsQuery`). Inmatningen är **delvis centraliserad** via `useFamiljenShell` → `saveChildrenLog`, men **UX är splittrad** över två hub-flikar (`reflektion` / `livslogg`), tre livslogg-delvyer (`stunder` / `om` / `favoriter`), Barnporten (separat route), widget (WH5) och G10-inkast (Hem/Valv).

**Rekommendation:** Inför **`FamiljenInputSuperModule`** (polymorf lägesväxlare) enligt samma router-delegate-mönster som **`MabraInputSuperModule`** (Fas 6). Behåll **`BarnfokusFraganPanel`** och **Barnporten HITL** orörda som delegates — migrera, ersätt inte. **Hamn (BIFF)** och **Drogfrihet** ligger utanför Barnen-silon och ska **inte** ingå i Superhub v1.

---

## REASONS (kort)

| Dimension | Familjen Superhub |
|-----------|-------------------|
| **Requirements** | En inmatningshub per Familjen-pelare; lägesbyte (barnfokus, stund, fysio, livslogg, inkast) utan sidbyte; indigo glow (`glow-bottom-blue`) |
| **Entities** | `children_logs` WORM; `reality_vault` endast via HITL; callable `childrenLogsQuery` (read); `saveChildrenLog`, `saveBarnportenLog` |
| **Approach** | Tunn router (`FamiljenInputSuperModule`) → befintliga paneler; utöka `BarnfokusSuperModule` eller ersätt stegvis; deprecate spridda textarea stegvis |
| **Structure** | `/familjen?inputMode=…` eller `/familjen/input`; `familjenInputModes.ts`; Färgburkar indigo |
| **Operations** | Djupanalys (denna fil) → SPEC → migrering Fas 7A→E → `smoke:locked-ux` + `smoke:children` → lås i `locked-ux-features.md` |
| **Norms** | U6: Barnen `PLAY`/`EVIDENCE`; ex/konflikt **inte** i barnlogg; Grey Rock neutral ton |
| **Safeguards** | WORM create-only; HITL före Valv; U1 — endast `childrenLogsQuery`; offline block på `children_logs`; locked Barnfokus optimistic save |

---

## 1. Nuvarande tillstånd

### 1.1 Routing och shell

| Route | Komponent | Mönster |
|-------|-----------|---------|
| `/familjen` | `FamiljenPage` | En route + `?tab=` (ingen `FamiljenRoutes.tsx`) |
| `/familj`, `/barnen` | redirect | → `/familjen?tab=reflektion` |
| `/barnporten` | `BarnportenPage` | Barn-PWA (separat från hub-flik) |
| `/widget/familjen` | `WidgetFamiljenPage` | WH5 snabb-inmatning |
| `/widget/barnporten` | `WidgetBarnportenPage` | Barn-widget → `saveBarnportenLog` |

**FamiljenPage** (`src/modules/core/pages/FamiljenPage.tsx`) använder `HubDropdownNav` med sex flikar:

| Tab ID | Label | Inmatning? | Collection |
|--------|-------|------------|------------|
| `reflektion` (default) | Dagens Barnfokus | **Ja** (flera paneler) | `children_logs` |
| `livslogg` | Livslogg | **Ja** (stunder, fysio) | `children_logs` |
| `tillsammans` | Tillsammans | Nej (read-only statistik) | — |
| `barnporten` | Barnporten | Delvis (HITL read → Valv) | read `children_logs` |
| `hamn` | Trygg Hamn (BIFF) | Nej (Grey Rock, ej barnlogg) | — |
| `drogfrihet` | Drogfrihet | Nej (MåBra-silo) | `mabra_sessions` m.fl. |

**State-hub:** `useFamiljenShell()` — all Familjen-skrivning till `children_logs` går via tre handlers:

- `handleSaveBarnfokus` — optimistic UI + `category: barnfokus`
- `handleSaveObservation` — livslogg/stund/observation
- `handleSavePhysio` — `action: fysiologi`, `signals`

### 1.2 Befintlig supermodul (delvis)

**`BarnfokusSuperModule`** (`src/modules/features/family/children/components/familjen/BarnfokusSuperModule.tsx`):

| Variant | Delegate | Scope |
|---------|----------|-------|
| `reflektion` | `FamiljenReflektionTab` | Barnfokus + regler + balans + RAG-chatt |
| `livslogg` | `FamiljenLivsloggTab` | Stunder / Om / Favoriter |

Detta är en **tab-nivå-router**, inte en **input-läges-router** som `MabraInputSuperModule`. Den täcker inte inkast, widget-bro eller enhetlig lägesväxlare.

### 1.3 Inmatningskartläggning — Firestore-skrivande ytor

| Komponent | Plats | Input | `action` | `category` (typ) | WORM |
|-----------|-------|-------|----------|------------------|------|
| `BarnfokusFraganPanel` | reflektion | textarea svar | `livslogg` | `barnfokus` (+ `bankId?`) | Ja |
| `BarnfokusReglerCard` | reflektion | rutinobservation | `livslogg` | `vardagsstruktur` | Ja |
| `ChildSubLogPanel` `stund` | livslogg → stunder | textarea stund | `livslogg` | `positivt` m.fl. | Ja |
| `ChildSubLogPanel` `livslogg` | livslogg (legacy path) | observation + påverkan | `livslogg` | `vardag`, `skola`, … | Ja |
| `PhysiologicalControls` | livslogg → om | skala 1–5 ×3 | `fysiologi` | — (`signals`) | Ja |
| `WidgetFamiljenPage` | `/widget/familjen` | snabb textarea | `livslogg` | `widget_snabb` | Ja |
| `saveBarnportenLog` | `/barnporten`, widget | barnmeddelande | `livslogg` | `barnporten*` | Ja |
| G10 `persistChildrenLogFromInbox` | backend | inkast-routing | `livslogg` | klassificerad | Ja |

**Write layer (canonical):** `saveChildrenLog()` i `src/modules/core/firebase/firestore.ts` — `guardedAddDoc`, `assertWormPayload`, `assertOfflineWriteAllowed`.

### 1.4 Inmatning utan molnpersistens / read-only

| Komponent | Plats | Beteende |
|-----------|-------|----------|
| `ChildrenLogsChat` | reflektion | Callable **`childrenLogsQuery`** — read-only RAG |
| `BalansMatare` | reflektion, om | Aggregerar `fysiologi`-rader — ingen write |
| `KanslotempletParentCard` | reflektion | Läser senaste `barnporten`-rad |
| `PositivaMinnesankare` | reflektion | Filter på befintliga loggar |
| `ChildMomentFavoriterPanel` | livslogg → favoriter | Read-only |
| `FamiljenTillsammansTab` | tillsammans | Veckostatistik (read) |
| `BarnfokusReglerCard` (regellista) | reflektion | **local state** — regler sparas ej till Firestore |
| `SafeHarborPage` | hamn | BIFF/Grey Rock — **ej** `children_logs` |
| `DrogfrihetHubPage` | drogfrihet | Drogfrihet-silo — **ej** `children_logs` |

### 1.5 HITL-flöden (children_logs → reality_vault)

| Flöde | Komponent | Trigger | Krav |
|-------|-----------|---------|------|
| Post-save prompt | `SaveAsEvidencePrompt` | Efter `ChildSubLogPanel`-spar | Explicit knapp; `sourceRef: children_logs/{id}` |
| Timeline promote | `ChildMomentStunderPanel` | Retroaktiv på befintlig rad | Samma HITL-mönster |
| Barnporten inkorg | `BarnportenInboxPanel` | Förälder granskar barnmeddelande | **§7b locked** — ingen auto-promote |
| Inkast-bro | `InkastBarnenValvBridge` | Efter G10 persist till Barnen | Hem/Valv review-kö — **ej** på FamiljenPage idag |

**Valv-payload:** `buildVaultPayloadFromChildLog()` — `action: barnen_livslogg`, `sourceRef`, `truth` med neutral prefix.

### 1.6 CaptureSuperModule — Familjen-relation

**`CaptureSuperModule`** har varianter: `hem-capture`, `hem-inkast`, `valv-compact`, `planering`, `kompass`, `mabra`.

**Ingen `familjen`-variant idag.** MåBra Fas 6D etablerade mönstret `variant="mabra"` — Familjen behöver motsvarande **`variant="familjen"`** med HITL och DCAP-routing till Barnen-silo (ej auto-Valv).

### 1.7 Legacy och drift

| Problem | Detalj | Risk |
|---------|--------|------|
| **BarnensPage deprecated** | Monolitisk legacy; fortfarande i `smoke:locked-ux` | Dubbel underhåll om inte avvecklad efter migrering |
| **Tab vs läge** | `reflektion`/`livslogg` = hela sidor, inte input-lägen | Användaren byter “sida” för att byta input-typ |
| **Spridda ingångar** | Widget, Barnporten, inkast utanför hub | Kognitiv belastning — samma problem Fas 6 löste för MåBra |
| **PIN borttagen i shell** | `useFamiljenShell` — publikt utan PIN; legacy BarnensPage hade PIN | Dokumentera i SPEC om PIN ska återinföras i hub |

---

## 2. Datamodell och silo-gränser

### 2.1 `children_logs` — fält (verifierat)

| Fält | Roll |
|------|------|
| `childAlias` | `Kasper` \| `Arvid` |
| `action` | `livslogg` \| `fysiologi` |
| `observation` / `truth` | Text (WORM) |
| `category` | t.ex. `barnfokus`, `vardag`, `skola`, `barnporten`, `widget_snabb` |
| `signals` | `{ somn, angest, aptit }` vid fysiologi |
| `childrenImpact` | Valfri påverkanstext |
| `authorRole` | `child` \| `parent` |
| `channel` | `barnporten` \| `familjen` \| `widget` |
| `visibility` | `private_child` \| `parent` \| `vault_candidate` |
| `bankId` | BP-PLAY-* (Barnen-PLAY-BANK) |
| `ownerId` / `userId` | Ägarskap |

**Firestore rules:** `create` only (`update, delete: false`); `isOwnerCreateSensitive()`; parent-visible filter vid read.

### 2.2 Tre silos (U1) — Barnen

| Silo | Collection | Callable | Familjen Superhub |
|------|------------|----------|-------------------|
| **Barnen** | `children_logs` | `childrenLogsQuery` | **Enda write-target** för hub-lägen |
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | **Förbjudet** — ingen auto-ingest |
| Valv | `reality_vault` | `valvChatQuery` | **Endast HITL** via `SaveAsEvidencePrompt` |

**`ChildrenLogsChat`** får endast **läsa** via `childrenLogsQuery` — Superhub får inte blanda Kunskap/Valv-RAG i samma query.

### 2.3 Innehåll (U6)

| Klass | Familjen-exempel | Regel |
|-------|------------------|-------|
| **PLAY** | `BARNFOKUS_QUESTIONS`, `bankId: BP-PLAY-*` | Parafras bank; **ej** Valv-promote |
| **EVIDENCE** | Livslogg skola/tredjepart → HITL Valv | WORM; dossier — **inte** kurator-lek |
| **REFLECTION** | — | Tillhör Vit/MåBra — **inte** barnlogg |
| **FACT** | — | Kunskap-seed — **inte** auto i barninput |

Kurator: `specialist-barn-lek` · Bank: [`Barnen-PLAY-BANK.md`](../specs/modules/Barnen-PLAY-BANK.md) · Katalog: `barnfokusCatalog.ts`.

---

## 3. Säkerhets- och databegränsningar (MUST bevaras)

### 3.1 WORM

| Regel | Tillämpning |
|-------|-------------|
| Append-only | `saveChildrenLog` → `guardedAddDoc`; rules `update/delete: false` |
| Inga retroaktiva ändringar | Superhub **får inte** införa edit/delete på befintliga rader |
| `assertWormPayload` | Alla payloads valideras före write — behåll i delegate-lager |

### 3.2 HITL (Human-in-the-Loop)

| Regel | Tillämpning |
|-------|-------------|
| Valv kräver explicit klick | `SaveAsEvidencePrompt` — **aldrig** auto efter barnfokus/stund/fysio |
| Barnporten §7b | `BarnportenInboxPanel` — **ingen** auto-promote från `private_child` |
| `sourceRef` obligatorisk | `children_logs/{id}` på alla Valv-promotioner |
| Inkast | Granska innan persist; vid Barnen-target → valfri Valv-bro **efter** persist |

### 3.3 Tre silos

- Hub-lägen skriver **endast** till `children_logs`.
- RAG-chatt (`ChildrenLogsChat`) anropar **endast** `childrenLogsQuery`.
- Ex/konflikt-text ska **inte** sparas i barnlogg — routing till Hamn/Speglar (guard), samma princip som MåBra → Speglar.

### 3.4 Zero Footprint

| Mekanism | Familjen |
|----------|----------|
| Offline block | `children_logs` ∈ `OFFLINE_WRITE_BLOCKED_COLLECTIONS` — **ingen** tyst SDK-kö |
| Shell cleanup | `useFamiljenShell` rensar `evidenceForLogId` vid barnbyte/unmount |
| Form cleanup | `ChildSubLogPanel` rensar textarea vid unmount/barnbyte |
| Logout | Global `invalidateSession` — ingen persistent känslig text utan explicit save |
| Utkast | Barnporten har **egen** offline-kö (`barnportenOfflineQueue`) — **ej** samma som Draft Layer för `children_logs` |

### 3.5 Locked UX (får inte regressera)

| ID | Krav | Källa |
|----|------|-------|
| Barnfokus | `BARNFOKUS_QUESTIONS`, **Spara till {barn}s logg**, **Annan fråga**, optimistic minneslista | locked-ux §1 |
| Barnporten HITL | `BarnportenInboxPanel`, mockup-kanon, SERVER-TIDSSTÄMPEL, **Granska i Valv** | locked-ux §7b |
| Smoke | `npm run smoke:locked-ux` · `npm run smoke:children` | |

---

## 4. Föreslagen arkitektur — `FamiljenInputSuperModule`

### 4.1 Mönster (strikt Fas 6-paritet)

```
src/modules/features/family/children/supermodule/
  FamiljenInputSuperModule.tsx    # Canonical router — inga direkta Firestore-skrivningar
  familjenInputModes.ts           # Mode union + labels + metadata
  index.ts
```

**Principer (identiska med `MabraInputSuperModule`):**

1. **Tunn router** — delegerar till befintliga paneler.
2. **Lägesväxlare** — URL `?inputMode=` ( eller `/familjen/input?inputMode=` ).
3. **Shell-injection** — tar `FamiljenShell` som prop ( eller `useFamiljenShell()` i parent ).
4. **Färgburkar** — `calm-card` + **`glow-bottom-blue`** (Familjen/Valv-silo).
5. **Metadata på save** — `{ zone: 'familjen', inputMode, childAlias, content_class?, bankId? }` (metadata i payload där schema tillåter — **ingen ny collection** v1).

### 4.2 Föreslagna input modes (lägen)

| Mode ID | Etikett (UI) | Delegate | Firestore |
|---------|--------------|----------|-----------|
| `barnfokus` | Barnfokus | `BarnfokusFraganPanel` | `children_logs` WORM · `category: barnfokus` |
| `livslogg_stund` | Ny stund | `ChildSubLogPanel` `variant="stund"` | `children_logs` WORM |
| `livslogg_observation` | Livslogg | `ChildSubLogPanel` `variant="livslogg"` | `children_logs` WORM + post HITL |
| `fysiologi` | Fysiologi | `PhysiologicalControls` + save-knapp | `children_logs` · `action: fysiologi` |
| `vardagsstruktur` | Vardagsstruktur | `BarnfokusReglerCard` (observationsdel) | `children_logs` · `category: vardagsstruktur` |
| `inkast` | Inkast | `CaptureSuperModule` **`variant="familjen"`** (ny) | HITL → routing · ev. `children_logs` via G10 |

**Primära lägen (synliga växlare, max ~5):** `barnfokus`, `livslogg_stund`, `fysiologi`, `livslogg_observation`, `vardagsstruktur`.

**Under "Mer…":** `inkast`.

**Utanför Superhub v1 (behåll som separata flikar/routes):**

| Yta | Varför |
|-----|--------|
| `barnporten_inbox` | Read + HITL — inte create; stannar på `?tab=barnporten` |
| `ChildrenLogsChat` | Read-only RAG — kan ligga **under** hub som "Fråga loggen" (read) |
| `BalansMatare`, export, Dossier-länk | Read/verktyg — ej input-läge |
| `SafeHarborPage`, `DrogfrihetHubPage` | Andra silos/zoner |
| `/barnporten` barn-PWA | Barn-input med `authorRole: child` — separat produktyta |
| `/widget/familjen` | Deep-link till hub-läge `livslogg_stund` eller behåll widget |

### 4.3 Relation till `BarnfokusSuperModule`

**Fas 7A:** Inför `FamiljenInputSuperModule` **parallellt** — `BarnfokusSuperModule` delegerar till input-hub för reflektion/livslogg-inmatning, eller ersätts stegvis i Fas 7C.

**Mål:** En canonical import — konsumenter importerar **inte** `BarnfokusFraganPanel` / `ChildSubLogPanel` direkt från `FamiljenPage` efter migrering (smoke-guard, samma som design-modules).

### 4.4 URL och entry

| Entry | Rekommendation |
|-------|----------------|
| Canonical | `/familjen?tab=reflektion&inputMode=barnfokus` (Fas 7A) |
| Alternativ | `/familjen/input?inputMode=…` (Fas 7B — enhetlig med `/mabra/input`) |
| Default mode | `barnfokus` (matchar Familjen default tab + locked UX) |
| Barnväljare | `FamiljenChildPicker` — synlig för alla lägen utom read-only |

---

## 5. Migreringsstrategi (Fas 7A → 7E)

**Regel:** Ett delsteg i taget; **ingen** breaking change utan smoke PASS; locked UX orörd tills explicit migrerad med samma beteende.

### Fas 7A — Spec + router-skelett (ingen WORM-ändring)

- [ ] Godkänn denna eval → skriv `docs/specs/modules/Familjen-INPUT-SUPERHUB-SPEC.md`
- [ ] `FamiljenInputSuperModule.tsx` — läges-router, **inga** nya collections
- [ ] `familjenInputModes.ts` — mode union + parse helpers
- [ ] Mount under `FamiljenPage` (reflektion eller dedikerad input-entry)
- [ ] Fas 7A exponerar **ett** läge (`barnfokus`) som bevis på mönster

### Fas 7B — Konsolidera Barnfokus + stund + fysio

- [ ] Lägen `barnfokus`, `livslogg_stund`, `fysiologi` i router
- [ ] Behåll **optimistic save** i `handleSaveBarnfokus` (locked §1)
- [ ] `FamiljenChildPicker` kopplad till alla lägen
- [ ] Avveckla duplicerad mount av samma paneler utanför hub (smoke-guard)

### Fas 7C — Livslogg observation + vardagsstruktur + HITL

- [ ] Lägen `livslogg_observation`, `vardagsstruktur`
- [ ] `SaveAsEvidencePrompt` oförändrad delegate efter livslogg-spar
- [ ] `ChildMomentStunderPanel` timeline-HITL — behåll utanför hub eller länka tillbaka

### Fas 7D — Inkast-läge

- [ ] `CaptureSuperModule` **`variant="familjen"`** (ny fil/wrapper — spegla `mabra`)
- [ ] DCAP routing till Barnen; **ingen** auto-Valv
- [ ] Valfri `InkastBarnenValvBridge` efter persist (samma som idag i review-kö)
- [ ] Smoke: `smoke:inkast`, `smoke:children`

### Fas 7E — Lås

- [ ] Registrera i `.context/locked-ux-features.md` (ny §12)
- [ ] Uppdatera `.context/system-plan.md` — Fas 7 **AVSLUTAD**
- [ ] PMIR + explicit OK från teknikledare (Pontus)
- [ ] **Ingen AI-ändring av kärnlogik utan åsidosättande tillstånd**

### Parallellt (ej blockerande v1)

| Spår | Beslut |
|------|--------|
| `BarnensPage` legacy | Avveckla efter smoke bekräftar `FamiljenPage`-paritet |
| Widget WH5 | Deep-link till hub eller behåll som snabb-ingång |
| `/barnporten` | Oförändrat — barn-input med egen offline-kö |
| Hamn / Drogfrihet-flikar | Oförändrat — **ej** Superhub-lägen |

---

## 6. Smoke- och acceptanskriterier (före lås)

- [ ] `npm run build` PASS
- [ ] `npm run smoke:locked-ux` PASS (Barnfokus + Barnporten §7b)
- [ ] `npm run smoke:children` PASS
- [ ] `npm run smoke:innehall` PASS (bankId på barnfokus-frågor)
- [ ] Manuell: barnfokus → optimistic lista → server-id
- [ ] Manuell: livslogg → HITL → Valv med `sourceRef`
- [ ] Manuell: lägesbyte utan full sidreload
- [ ] Manuell: offline → tydligt fel (ej tyst kö) för `children_logs`
- [ ] Ingen ny spridd textarea utanför Superhub efter migrering (Familjen-zon)

---

## 7. Bevaras (MUST NOT regress)

- Locked **Barnfokus-frågor** (`BARNFOKUS_QUESTIONS`, knappcopy, optimistic minneslista)
- **Barnporten inkorg → Valv** HITL (§7b) — mockup-kanon, `sourceRef`, SERVER-TIDSSTÄMPEL
- **`children_logs` WORM** — create-only client + rules
- **Tre silos** — ingen cross-RAG; `childrenLogsQuery` endast Barnen
- **Ex/konflikt** — inte i barnlogg; Hamn/Speglar separat
- **Valv Mönster/Orkester/Kunskapsbank** — orörda
- **`npm run smoke:locked-ux`** Barnfokus-strängar

---

## 8. Dubletter och risker (att adressera i SPEC)

| # | Problem | Superhub-åtgärd |
|---|---------|-----------------|
| D1 | Tab `reflektion` vs `livslogg` = sidbyte | Hub-lägesväxlare inom en yta |
| D2 | Widget + panel duplicerar livslogg-textarea | Widget deep-link eller deprecate |
| D3 | Inkast saknar Familjen-ingång | Läge `inkast` (7D) |
| D4 | BarnensPage vs FamiljenPage | Avveckla legacy efter paritet |
| D5 | Barnporten offline-kö vs hub offline-block | Dokumentera — barnporten-kö flushas separat |
| D6 | Regler i `BarnfokusReglerCard` local-only | Behåll — endast observation sparas till WORM |

---

## 9. Nästa steg (ett)

**Väntar på godkännande:** Skriv `Familjen-INPUT-SUPERHUB-SPEC.md` (Fas 7A) utifrån denna analys — **ingen kod** förrän Pontus säger godkänn.

---

## Bilaga — filreferenser

| Område | Sökväg |
|--------|--------|
| Hub shell | `src/modules/core/pages/FamiljenPage.tsx` |
| State / writes | `src/modules/features/family/children/hooks/useFamiljenShell.ts` |
| Firestore WORM | `src/modules/core/firebase/firestore.ts` (`saveChildrenLog`) |
| Offline policy | `src/modules/core/firebase/offlineWritePolicy.ts` |
| Tab-router (nu) | `src/modules/features/family/children/components/familjen/BarnfokusSuperModule.tsx` |
| Barnfokus (locked) | `src/modules/features/family/children/components/BarnfokusFraganPanel.tsx` |
| Livslogg form | `src/modules/features/family/children/components/ChildSubLogPanel.tsx` |
| HITL Valv | `src/modules/features/family/children/components/SaveAsEvidencePrompt.tsx` |
| Valv payload | `src/modules/features/family/children/utils/childLogEvidence.ts` |
| Barnporten inbox | `src/modules/features/onboarding/barnporten/components/BarnportenInboxPanel.tsx` |
| Barnporten write | `src/modules/features/onboarding/barnporten/api/saveBarnportenLog.ts` |
| Inkast HITL | `src/modules/inkast/components/InkastBarnenValvBridge.tsx` |
| Capture mönster | `src/modules/capture/CaptureSuperModule.tsx` |
| MåBra referens | `src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraInputSuperModule.tsx` |
| RAG read | `src/modules/features/family/children/components/ChildrenLogsChat.tsx` |
| Rules | `firestore.rules` → `children_logs` |
| Innehåll | `docs/INNEHALL-REGISTER.md`, `barnfokusCatalog.ts` |
| Locked UX | `.context/locked-ux-features.md` §1, §7, §7b |
