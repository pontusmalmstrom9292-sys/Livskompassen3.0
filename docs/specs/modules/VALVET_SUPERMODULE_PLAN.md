# Valvet SuperModule — Fas 1 inventering & implementationsplan

**Datum:** 2026-06-14  
**Status:** Fas 1A–1E implementerad 2026-06-15 (UI-våg B1)  
**Scope:** Frontend-only · `src/modules/features/lifeJournal/evidence/vault/**` (+ route-skal `ValvetRoutePage.tsx`)  
**Kanon:** [`.context/locked-ux-features.md`](../../../.context/locked-ux-features.md) §2 · [`docs/design/VALV-HUBB-SPEC.md`](../../design/VALV-HUBB-SPEC.md)  
**Referensmönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](./Mabra-INPUT-SUPERHUB-SPEC.md) · [`Familjen-INPUT-SUPERHUB-SPEC.md`](../Familjen-INPUT-SUPERHUB-SPEC.md)

---

## 1. Sammanfattning

Valvet har idag **14 routable `vaultTab`-IDs**, **6 zoner**, **7 input-lägen** (`valvMode`), plus **6+ drawer-rader** och **sub-TabBar per zon** — kognitiv överbelastning för användaren (ADHD/GAD-profil).

Fas 1 (pågående WIP) introducerar `ValvInputSuperModule` med lägesväxlare (`spara`, `granska`, `analysera`, …) och tar bort den synliga **inbox-zonen**. Inbox-buggen (zon → `hamn_analys`) har **identifierad rotorsak** i den gamla `handleValvZoneChange`-logiken i `VaultPage.tsx`. WIP fixar delar av detta men **lämnar kvar desynk-problem** mellan `valvMode` och `vaultTab`.

Målbild efter full Fas 1:

| Lager | Användaren ser | Routable params |
|-------|----------------|-----------------|
| **Primär** | Ett **Inkast** (dropzone) + lägesväxlare | `?valvMode=spara\|granska\|…` |
| **Sekundär** | Sub-flikar per zon (progressive disclosure) | `?vaultTab=…` (synkas från läge) |
| **Forensik** | Endast aktiv flik + "Visa fler" | `?vaultTab=hamn_analys\|…` bakom `valvMode=mer` |

**Locked UX oförändrat:** `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel` — flik-ID:n `monster`, `orkester`, `kunskapsbank`, `aktorskarta` får **inte** byta namn eller tas bort.

---

## 2. Nuvarande struktur (inventering)

### 2.1 Routable `vaultTab`-IDs (14 st)

Källa: `vaultTabs.ts`

| Grupp | IDs | Antal |
|-------|-----|-------|
| **Samla** | `logga`, `sok` | 2 |
| **Analysera** (locked) | `monster`, `orkester` | 2 |
| **Exportera** | `dossier` | 1 |
| **Kunskap** (locked) | `kunskapsbank`, `aktorskarta` | 2 |
| **Vit** | `mitt_vit` | 1 |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, `dagbok_arkiv`, `familjen_monster`, `arbetsliv_franvaro`, `arbetsliv_lon` | 6 |
| **Totalt** | | **14** |

Parsing: `parseVaultTab(raw)` → okänd sträng faller tillbaka till `'logga'`.

### 2.2 Zoner (`ValvZone`) — 6 synliga

Källa: `VALV_ZONE_VISIBLE_IDS` i `vaultTabs.ts`

```
samla → analysera → kunskap → vit → exportera → forensik
```

**Borttagen i WIP:** `inbox` (fanns i committed `VALV_ZONE_IDS`).

`resolveValvZone(tab)` mappar `vaultTab` → zon. Ingen `vaultTab` mappas explicit till inbox; kommentar rad 75 erkänner att inbox saknar tab-mapping.

### 2.3 Input-lägen (`ValvInputMode`) — 7 st

Källa: `valvInputModes.ts`

| Mode | Label | Zone | defaultVaultTab |
|------|-------|------|-----------------|
| `spara` | Spara | samla | `logga` |
| `granska` | Granska | samla | `logga` |
| `analysera` | Analysera | analysera | `monster` |
| `kunskap` | Kunskap | kunskap | `kunskapsbank` |
| `vit` | Mitt Vit | vit | `mitt_vit` |
| `rapporter` | Rapporter | exportera | `dossier` |
| `mer` | Mer | forensik | `hamn_analys` |

URL: `/valvet?valvMode=…&vaultTab=…` · legacy `?samlaView=granska` → `granska`.

### 2.4 Routing-kedja

```
/valvet
  └─ ValvetRoutePage.tsx          ← läser searchParams, synkar URL
       └─ VaultPage.tsx           ← gate, zonväljare, state
            └─ ValvInputSuperModule.tsx   ← lägesväxlare (7 knappar)
                 ├─ granska → InboxReviewQueue (inkast/kompis)
                 └─ övriga → ValvSuperModule.tsx   ← variant = zone
                      ├─ samla    → ValvSamlaZone.tsx
                      ├─ analysera → ValvAnalyseraZone.tsx  [locked panels]
                      ├─ kunskap  → ValvKunskapZone.tsx     [locked panels]
                      ├─ vit      → ValvVitZone.tsx
                      ├─ exportera → ValvExporteraZone.tsx
                      └─ forensik → ValvForensikZone.tsx    [progressive disclosure]
```

### 2.5 Import-graf (mandatory files + direkta barn)

#### `VaultPage.tsx`

| Import | Roll |
|--------|------|
| `@/core/navigation/navTruth` | `NAV_PATHS`, stäng → Hjärtat |
| `@/core/store`, `useVaultStore` | Auth, logg-pagination |
| `@/core/auth/sessionService` | `hasVaultGate()` |
| `@/core/security/vaultSessionLifecycle` | Session sync |
| `./VaultValvBreadcrumb` | Brödsmulor (zon + tab) |
| `./VaultErrorBoundary`, `@/core/components/VaultLockedGate` | Gate UI |
| `../supermodule/ValvInputSuperModule` | **Huvud-UI efter WIP** |
| `../supermodule/valvInputModes` | Mode → tab mapping |
| `../supermodule/valvLastModeStorage` | localStorage last mode |
| `../utils/vaultTabs` | `resolveValvZone`, `VaultTab` |
| `./ValvZoneModulValjare` | Första PIN-session picker |

**State:** `vaultTab`, `valvMode`, `highlightLogId`, `showZonePicker`, `sessionSyncError`.

#### `ValvSamlaZone.tsx`

| Import | Roll |
|--------|------|
| `@/core/navigation/tabRegistry` | `getSamlaVaultTabBarItems()` |
| `@/core/ui/TabBar` | Sub-flikar Arkiv / Granska inkommande |
| `@/features/lifeJournal/evidence/vaultChat` | `ValvChatPanel` (tab `sok`) |
| `./VaultSamlaHub` | Inkast + entry form + granska-knapp |
| `./VaultLogList`, `./WeaverPendingVaultBanner` | Arkivlista, G10 banner |

#### `vaultTabs.ts`

| Export | Konsumenter |
|--------|-------------|
| Tab-ID constants | `tabRegistry.ts`, `navTruth.ts`, zoner, smoke |
| `resolveValvZone` | `VaultPage`, `valvInputModes`, breadcrumb |
| `parseVaultTab` | `ValvetRoutePage`, redirects |
| `FORENSIC_*` | `ValvForensikZone`, drawer |

#### `ValvInputSuperModule.tsx` (WIP)

| Import | Roll |
|--------|------|
| `@/modules/inkast/components/InboxReviewQueue` | Granska-läge (HITL) |
| `./ValvSuperModule` | Alla icke-granska lägen |
| `./valvInputModes`, `./valvLastModeStorage` | Mode metadata + persist |

#### `ValvSuperModule.tsx`

| Zone case | Zone-komponent | Locked innehåll |
|-----------|----------------|-----------------|
| `samla` | `ValvSamlaZone` | — |
| `analysera` | `ValvAnalyseraZone` | `VaultMonsterPanel`, `VaultOrkesterPanel` |
| `kunskap` | `ValvKunskapZone` | `VaultKunskapsbankPanel`, `VaultAktorskartaPanel` |
| `vit` | `ValvVitZone` | Vit hub |
| `exportera` | `ValvExporteraZone` | `DossierPage` embedded |
| `forensik` | `ValvForensikZone` | `VaultForensicPanel` × 6 |

**Orphan (WIP):** `ValvInboxZone.tsx` — finns kvar men **importeras inte** efter borttaget `case 'inbox'`.

### 2.6 Drawer & externa länkar

| Källa | URL-mönster |
|-------|-------------|
| `navTruth.ts` `DRAWER_VALV_ENTRIES` | 6 zon-rader + leaf-tabs via `vaultDrawerPath(tab)` |
| `inkastService.ts` `VALV_SAMLA_GRANSKA_LINK` | `?vaultTab=logga&valvMode=granska` |
| `VaultOverviewPanel` | `<Link to={vaultDrawerPath('monster\|orkester\|dossier')}>` |
| Barnporten HITL | "Granska i Valv" → `/valvet` (generisk) |

---

## 3. Rotorsak: inbox-zon → `hamn_analys`

### 3.1 Historisk bug (committed kod före WIP)

I **committed** `VaultPage.tsx` fanns zon-TabBar med `getVaultZoneTabBarItems()` som inkluderade **`inbox`** (via `VALV_ZONE_IDS` + `VALV_ZONE_LABELS.inbox: 'Inkorg'` i `valvNavCopy.ts`).

Zon-byte hanterades av:

```typescript
// VaultPage.tsx (committed — borttaget i WIP)
const handleValvZoneChange = (zone: ValvZone) => {
  if (zone === 'samla') setVaultTab('logga');
  else if (zone === 'analysera') setVaultTab('monster');
  else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
  else if (zone === 'vit') setVaultTab(VIT_VAULT_TAB);
  else if (zone === 'exportera') setVaultTab('dossier');
  else setVaultTab('hamn_analys');   // ← ALLT som inte matchar ovan, inkl. inbox OCH forensik
};
```

**Kedja när användaren klickade Inkorg:**

1. TabBar `onChange('inbox')` → `handleValvZoneChange('inbox')`
2. Ingen `if (zone === 'inbox')` → **`else` → `setVaultTab('hamn_analys')`**
3. `valvZone = resolveValvZone('hamn_analys')` → **`'forensik'`**
4. `ValvSuperModule variant={valvZone}` → **`forensik`**, tab `hamn_analys`
5. UI visar **Hamn · Analys** — inte inkorg

**Dubbel fel:** Även om `ValvSuperModule` hade `case 'inbox': return <ValvInboxZone />`, nåddes det **aldrig via zon-TabBar** eftersom `variant` sattes från `resolveValvZone(vaultTab)` (redan `forensik`), inte från det klickade zonenamnet.

### 3.2 Kvarvarande relaterade problem (WIP)

| Problem | Var | Effekt |
|---------|-----|--------|
| **`sok` felmärkt** | `valvNavCopy.ts`: `sok: 'Granska inkommande'` | Tab visar `ValvChatPanel` (RAG-sök), inte inkorg |
| **`valvMode`/`vaultTab` desynk** | `ValvetRoutePage` + `VaultPage` | Drawer sätter bara `vaultTab`; `valvMode` default `spara` → fel zon-innehåll |
| **Forensik fallback** | `ValvSuperModule.tsx:80` | I `mer`-läge: icke-forensic `vaultTab` → tvingas `hamn_analys` |
| **Orphan `ValvInboxZone`** | Ej importerad | Död kod; granska sker via `InboxReviewQueue` i SuperModule |
| **`resolveValvZone` inbox-kommentar** | `vaultTabs.ts:75` | Ingen mapping för legacy inbox-navigering |

### 3.3 WIP-fix (delvis)

WIP ersätter zon-TabBar med `ValvInputSuperModule` och mappar granska via:

- `valvMode='granska'` → `InboxReviewQueue` (korrekt inbox-upplevelse)
- `handleZonePickerSelect` → `modeMap` utan inbox (OK)
- Borttaget `case 'inbox'` i `ValvSuperModule` (OK om granska-läge är enda vägen)

**Ej löst i WIP:** URL-synk när användaren kommer via drawer med enbart `vaultTab=monster` men `valvMode` saknas; samt label-förvirring `sok` vs granska.

---

## 4. Föreslagen målarkitektur (Fas 1 färdigställande)

### 4.1 Ett Inkast — tre lager

```
┌─────────────────────────────────────────────────┐
│  ValvInputSuperModule                           │
│  ┌───────────────────────────────────────────┐  │
│  │ Lägesväxlare (max 4 primära + "Mer")      │  │
│  │ [Inkast] [Granska] [Analysera] [Mer…]     │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ Läge = spara (Inkast)                     │  │
│  │  • VaultInkastCompact (CaptureSuperModule)│  │
│  │  • VaultEntryForm (manuell post)          │  │
│  │  • VaultLogList (arkiv)                   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ Läge = granska                            │  │
│  │  • InboxReviewQueue (HITL, oförändrad)    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- **Döp om läget `spara` → `inkast`** i UI (internt ID kan behållas för migration).
- Sub-TabBar i `ValvSamlaZone`: döp `sok` till **"Sök i arkiv"** (eller flytta chat bakom sekundär länk) — **inte** "Granska inkommande".
- **Ta bort** duplicerad inkast-yta: `VaultSamlaHub` + `VaultOverviewPanel` förenklas till en ingress-rad + dropzone.

### 4.2 Progressive disclosure — Forensik (redan påbörjad)

`ValvForensikZone.tsx` visar **endast aktiv flik** + knapp "Visa fler" → expanderar till 6 TabBar-items. **Behåll** detta mönster; applicera samma princip på:

- `ValvAnalyseraZone` — 2 flikar OK som är
- `ValvKunskapZone` — 2 flikar OK (locked)
- Lägesväxlaren — **tier `primary` | `more`** som MåBra/Familjen (4 synliga + resten under "Mer")

### 4.3 URL-kontrakt (efter fix)

| Intent | Canonical URL |
|--------|---------------|
| Inkast + arkiv | `/valvet?valvMode=spara` |
| Granskningskö | `/valvet?valvMode=granska` |
| Mönster (locked) | `/valvet?valvMode=analysera&vaultTab=monster` |
| Orkester (locked) | `/valvet?valvMode=analysera&vaultTab=orkester` |
| Kunskapsbank (locked) | `/valvet?valvMode=kunskap&vaultTab=kunskapsbank` |
| Aktörskarta (locked) | `/valvet?valvMode=kunskap&vaultTab=aktorskarta` |
| Hamn analys | `/valvet?valvMode=mer&vaultTab=hamn_analys` |

**Regel:** Vid `vaultTab`-byte (drawer/sub-TabBar) ska `valvMode` **härledas** via `resolveValvInputModeFromVaultTab(tab)` och skrivas till URL.

---

## 5. Exakta filändringar (implementationsplan)

### Fas 1A — Bugfix & synk (minimal, måste först)

| Fil | Ändring |
|-----|---------|
| `ValvetRoutePage.tsx` | Vid `handleVaultTabChange`: sätt även `valvMode` via `resolveValvInputModeFromVaultTab(next)`. Vid init: om `valvMode` saknas i URL, härled från `vaultTab`. |
| `VaultPage.tsx` | `useEffect` på `[initialVaultTab, initialValvMode]`: om desynk, prioritera `initialValvMode` eller härled mode från tab. Ta bort risk att `setValvMode` skriver om tab felaktigt vid granska. |
| `valvInputModes.ts` | Lägg `granska` i `vaultTabForValvInputMode` guard (returnera alltid `logga`, ignorera forensic currentTab). Ev. lägg `resolveValvInputModeFromVaultTab('sok')` → `'spara'` (chat ≠ granska). |
| `valvNavCopy.ts` | Byt `sok`-label från `'Granska inkommande'` → `'Sök i arkiv'` (eller `'Valv-Chat'`). |
| `vaultTabs.ts` | Ta bort/ uppdatera inbox-kommentar; ev. `parseVaultTab` legacy alias: `'inbox'` → trigga granska (dokumentera i redirect-hjälpare, inte som VaultTab). |

### Fas 1B — Inkast-konsolidering

| Fil | Ändring |
|-----|---------|
| `ValvInputSuperModule.tsx` | Tier-växlare: primära `[inkast/spara, granska, analysera, kunskap]` + dropdown "Mer" (`vit`, `rapporter`, `mer`). |
| `valvInputModes.ts` | Lägg `tier: 'primary' \| 'more'` per mode (som MåBra). Ev. alias `inkast` som display för `spara`. |
| `VaultSamlaHub.tsx` | Förenkla till **en** ingress: dropzone (`VaultInkastCompact`) + kompakt pending-badge → `onOpenGranska`. Flytta `VaultEntryForm` under fold "Manuell post". |
| `ValvSamlaZone.tsx` | Behåll sub-TabBar `logga`/`sok` men med korrigerade labels; `onOpenGranska` oförändrat. |
| `VaultOverviewPanel.tsx` | Minska länkar (Mönster/Orkester/Rapporter) — eller flytta till breadcrumb/drawer endast. |
| `zones/ValvInboxZone.tsx` | **Ta bort** filen eller markera `@deprecated` re-export → `InboxReviewQueue` (ingen separat zon). |

### Fas 1C — Forensik progressive disclosure (polish)

| Fil | Ändring |
|-----|---------|
| `ValvForensikZone.tsx` | Redan implementerat — verifiera att `valvMode=mer` alltid föregår forensic tabs i URL. |
| `ValvSuperModule.tsx` | Forensik-fallback: om `vaultTab` inte är forensic **och** mode är `mer`, använd `def.defaultVaultTab` — **inte** tyst `hamn_analys` om currentTab är samla-tab. |
| `ValvZoneModulValjare.tsx` | Lägg tillbaka `forensik` som valfritt picker-kort (finns i drawer men saknas i `PICKER_ZONES`). |

### Fas 1D — Nav & copy (utan locked ID-ändring)

| Fil | Ändring |
|-----|---------|
| `navTruth.ts` | Drawer `valv_triage` (`sok`): uppdatera label via `valvNavCopy`. Lägg ev. drawer-rad `valv_granska` → `?valvMode=granska`. |
| `tabRegistry.ts` | Synka `getSamlaVaultTabBarItems` labels efter copy-fix. |
| `inkastService.ts` | `VALV_SAMLA_GRANSKA_LINK` — oförändrad (redan korrekt). |
| `scripts/smoke_locked_ux.mjs` | Assert: ingen `inbox` i `VALV_ZONE_VISIBLE_IDS`; assert `valvMode` synk; assert locked panel-strängar oförändrade. |

### Fas 1E — Export & index

| Fil | Ändring |
|-----|---------|
| `vault/index.ts` | Ev. exportera `parseValvInputMode`, `ValvInputMode` för externa länkar. |
| `.context/locked-ux-features.md` | Lägg § Valv SuperModule (efter produkt-OK) — **inte i detta inventeringssteg**. |

---

## 6. Filer som **inte** får ändras (locked panels)

| Fil | Anledning |
|-----|-----------|
| `VaultMonsterPanel.tsx` | Locked UX §2 |
| `VaultOrkesterPanel.tsx` | Locked UX §2 |
| `VaultKunskapsbankPanel.tsx` | Locked UX §2 |
| `VaultAktorskartaPanel.tsx` | Locked UX §2 |
| `vaultPatternScan.ts` | Locked — smoke |
| `functions/src/index.ts` (`addEntityProfile`) | G9 backend |

---

## 7. Verifiering

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:entities
npm run smoke:orkester
```

**Manuell checklista:**

1. `/valvet?valvMode=granska` → `InboxReviewQueue`, **inte** Hamn analys.
2. Klick "Granskningskö" i Samla → samma kö, URL uppdateras.
3. Drawer → Mönster → `valvMode=analysera`, `VaultMonsterPanel` synlig.
4. Drawer → Orkester → `VaultOrkesterPanel` synlig.
5. `/valvet?valvMode=mer&vaultTab=speglar_fordjupat` → rätt forensic panel; "Visa fler" expanderar.
6. Legacy `/valvet?vaultTab=sok` → Valv-Chat, **inte** inkorg.
7. `npm run smoke:locked-ux` PASS.

---

## 8. Risker & avgränsningar

| Risk | Mitigering |
|------|------------|
| Bryta deep links med gammal `inbox`-zon | Redirect `valvMode=granska` i `ValvetRoutePage` |
| Plausible deniability | Inga nya publika ord; Valv fortfarande PIN-gated |
| Cross-RAG (U1) | Ingen ändring av query-callables i Fas 1 |
| Scope creep | **Ingen** backend/Firestore/rules i detta paket |

---

## 9. Nästa steg (ett i taget)

**Steg 1:** Implementera Fas 1A (URL-synk + label-fix) — löser kvarvarande desynk och `sok`/granska-förvirring.

Prompt för Cursor:

```
Implementera Fas 1A i docs/specs/modules/VALVET_SUPERMODULE_PLAN.md: URL-synk valvMode↔vaultTab i ValvetRoutePage och VaultPage, fixa sok-label i valvNavCopy, verifiera granska-läge. Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och npm run smoke:locked-ux passerar.
```

---

*Inventering genomförd 2026-06-14. Rotorsak inbox→hamn_analys dokumenterad i §3.*
