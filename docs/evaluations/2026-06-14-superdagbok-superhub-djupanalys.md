# Superdagbok — Universal Input Superhub (Djupanalys)

**Datum:** 2026-06-14  
**Fas:** 11A (analys) → 11B (router) → 11C (delegater + skuggrutt)  
**Arbetspaket:** W4 (isolera — W5 integrerar i live-app)  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) · [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)  
**SPEC:** [`docs/specs/Superdagbok-INPUT-SUPERHUB-SPEC.md`](../specs/Superdagbok-INPUT-SUPERHUB-SPEC.md)  
**Referensmönster:** [`Planering-INPUT-SUPERHUB-SPEC.md`](../specs/Planering-INPUT-SUPERHUB-SPEC.md) · [`Arbetsliv-INPUT-SUPERHUB-SPEC.md`](../specs/Arbetsliv-INPUT-SUPERHUB-SPEC.md)

---

## 1. REASONS — sammanfattning

| Dimension | Beslut |
|-----------|--------|
| **Requirements** | En Universal Input Hub för Hjärtat (dagbok) med lägesväxlare utan sidbyte; indigo glow (`glow-bottom-blue`); WORM journal via befintliga API:er |
| **Entities** | `journal` (append-only WORM), `weaveJournalEntry` (Valv-gated), `journalQuickMirror` callable, valfri `journal_woven` opt-in |
| **Approach** | Tunn router + två skriv-delegater + read-only arkiv-läge; **ingen** duplicering av persist-logik |
| **Structure** | `lifeJournal/diary/supermodule/` + `routing/DagbokInputRoutes.tsx` shadow på `/hjartat/input` |
| **Operations** | W4 skelett → W5 montering i `HjartatPage` / `AppRoutes` → `smoke:superdagbok-superhub` |
| **Norms** | Routern skriver aldrig till Firestore; backend journal WORM oförändrat (G7 weave opt-in) |
| **Safeguards** | Skrivskyddade beroenden (`useJournalFlow`, `journalQuickMirrorService`, `weaverService`); forensic-readonly stannar i `DagbokSuperModule` (Valv) |

---

## 2. Backend-tillstånd (GAP + system-plan)

| Post | Status | Evidens |
|------|--------|---------|
| G1–G14 | **done** | [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) |
| G7 `journal_woven` | **done** | Opt-in i ConfirmStep — **MUST NOT** auto-ingest |
| `journal` WORM | **live** | Append-only i Firestore rules; `saveJournalEntry` klient |
| `weaveJournalEntry` | **deployad** | `functions/src/callables/agents.ts` — Valv-gated i `useJournalFlow` |
| `journalQuickMirror` | **deployad** | Callable + `journalQuickMirrorFallback` — spegling efter snabb-spar |
| Fas 6 MåBra superhub | **AVSLUTAD** | `dagbok_bridge` via `DagbokSuperModule variant="mabra-bridge"` — **ej** dupliceras här |

**Slutsats:** Backend är låst och färdig. W4 migrerar endast **frontend-router** till Universal Input Hub-mönstret.

---

## 3. Nuläge (Fas 1 → 11)

### 3.1 Befintlig `DagbokSuperModule` (Fas 1 done)

| Variant | Mount | Roll |
|---------|-------|------|
| `reflektion` | `/hjartat?tab=reflektion` via `DagbokPage` | Skrivflöde + arkiv i samma kort |
| `forensic-readonly` | Valv `VaultForensicPanel` | WORM read-only — **stannar utanför Input Hub** |
| `mabra-bridge` | MåBra `MabraDagbokBridgePanel` | Lågenergi-bro — **stannar i MåBra superhub** |

### 3.2 Spridd inmatning i `DagbokPage`

`DagbokPage` har **intern** `DagbokModeNav` med tre lägen:

| Intern mode | UI | Write-target |
|-------------|-----|--------------|
| `reflektera` | Mood → Text → Confirm → Saved wizard | `journal` WORM + opt-in weave |
| `snabb` | `JournalQuickMode` + `journalQuickMirror` | `journal` WORM + spegling |
| `arkiv` | `JournalArchiveReadonly` | read-only |

**Gap:** Ingen `?inputMode=`-konvention, ingen `/hjartat/input`-skuggrutt, ingen gemensam supermodule-mapp. `DagbokSuperModule` delegerar hela `DagbokPage` — inte polymorf hub.

### 3.3 Design (silo-glow)

Enligt [`design-calm.mdc`](../../.cursor/rules/design-calm.mdc) §5:

- **Hjärtat / Dagbok / bevis** → **`glow-bottom-blue`** (indigo)
- **INTE** guld (Vardagen/planering) eller smaragd (MåBra)

`DagbokPage` använder redan `BentoCard glow="blue"`.

---

## 4. Målbild (Fas 11B→11C)

```
/hjartat/input?inputMode=reflektion|quick_mirror|arkiv
```

| Läge | Delegate | Wrappar |
|------|----------|---------|
| `reflektion` | `DagbokReflektionDelegate` | `useJournalFlow` + wizard-steg (Mood/Reflection/Confirm/Saved) |
| `quick_mirror` | `DagbokQuickMirrorDelegate` | `useJournalFlow.handleQuickSave` + `JournalQuickMode` |
| `arkiv` | *(inline i router)* | `JournalArchiveReadonly` + `getJournalEntries` via delegate hook |

**Principer:**

1. Routern skriver **aldrig** direkt till Firestore — endast delegates via `useJournalFlow`.
2. `DagbokSuperModule` (Fas 1) förblir orörd tills W5-integration.
3. `tab` = Hjärtat-skals flik (`reflektion` / `speglar`); `inputMode` = hub-läge.
4. Indigo glow — Hjärtat-silo enligt Obsidian Calm 2.0.

---

## 5. Arkitektur (W4-leverans)

```
src/modules/features/lifeJournal/diary/
  supermodule/
    DagbokInputSuperModule.tsx   ← router + lägesnav
    dagbokInputModes.ts          ← union + parser
    index.ts
    delegates/
      DagbokReflektionDelegate.tsx
      DagbokQuickMirrorDelegate.tsx
  routing/
    DagbokInputRoutes.tsx        ← skuggrutt /hjartat/input (W5 wire)
```

**URL-exempel (efter W5-integration):**

- `/hjartat/input?inputMode=reflektion`
- `/hjartat/input?inputMode=quick_mirror`
- `/hjartat/input?inputMode=arkiv`
- `/hjartat?tab=reflektion&inputMode=quick_mirror` (embedded variant, W5)

**Legacy mapping:**

| `DagbokPage` `?mode=` | Superhub `inputMode` |
|-----------------------|----------------------|
| `reflektera` | `reflektion` |
| `snabb` | `quick_mirror` |
| `arkiv` | `arkiv` |

---

## 6. Avgränsning W4 vs W5

| W4 (detta paket) | W5 (integration) |
|------------------|------------------|
| SPEC + djupanalys | `AppRoutes.tsx` mount |
| Router + modes + delegater | `HjartatPage` / `DagbokPage` embed |
| `DagbokInputRoutes` skelett | Nav-länkar + legacy redirect |
| `smoke_superdagbok_superhub.mjs` | `package.json` script + orkester |

**Förbjudet i W4:** `AppRoutes.tsx`, `HjartatPage.tsx`, `DagbokPage.tsx`, `DagbokSuperModule.tsx`, firestore.rules, journal API-filer.

---

## 7. Smoke-kriterier

1. Alla W4-filer existerar.
2. `dagbokInputModes.ts` exporterar `reflektion`, `quick_mirror`, `arkiv`.
3. `DagbokInputSuperModule` har indigo glow och **ingen** Firestore-skrivning.
4. Delegater anropar `useJournalFlow` / `JournalQuickMode` — inte rå SDK.
5. Skuggrutt `path="input"` lazy-loadar supermodule.
6. SPEC + djupanalys refererar W4/W5.

---

## 8. Risker

| Risk | Mitigering |
|------|------------|
| Dubbel `useJournalFlow` om både `DagbokPage` och hub monteras | W5 ersätter eller embeddar hub — inte parallell mount |
| State försvinner vid lägesbyte | Förväntat — samma som MåBra/Familjen superhub |
| Forensic-readonly exponeras i publikt läge | Arkiv-läge är **journal read-only**, inte Valv-bevis — tydlig copy |

---

**Godkännande:** W4 levererar isolerat skelett. Integration W5 kräver explicit användar-OK enligt git-main-trunk.
