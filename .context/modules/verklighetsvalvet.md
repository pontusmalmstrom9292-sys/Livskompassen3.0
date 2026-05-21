# Verklighetsvalvet

**Sacred Feature.** **Route:** `/valv` · **AuthGate:** ja  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/Verklighetsvalvet-SPEC.md`](../../docs/specs/incoming/Verklighetsvalvet-SPEC.md)

---

## 1. Syfte och användarbehov

WORM-bevisbank (Lager 2) mot gaslighting. Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1).

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | FloatingDock Shield — 3s long-press → PIN |
| **B (planerad)** | Long-press BookOpen (Dagbok) → `/valv` |

## 3. UX-flöde

1. Fyren 3s + PIN (WebAuthn partial)
2. Välj inmatningstyp → spara → lista
3. **Enkel** — fakta/text  
4. **Tvåspalt** — hens version vs min verklighet  
5. **Trestegs-sköld** — vad händer / känsla / gräns (progressive)  
6. **Magkänsel** — snabbknappar + valfri notering  
7. **Stäng** → `/dagbok`  
8. **Shake** → `/` (kill switch)

**Klart (kod):** media-uppladdning, röst-memo, per-post PDF (`exportVaultRecordAsPdf`).  
**Planerat:** full Dossier-sammanställning — se [`.context/modules/dossier.md`](dossier.md).

## 4. Visuell design

Glass card, guld/indigo/emerald enligt design-master. PIN-fält obsidian.

## 5. Datamodell

| Collection | Fält | WORM |
|------------|------|------|
| `reality_vault` | action, truth, category, entryType, theirVersion, myReality, bodySignals, shieldWhat/Feeling/Boundary, isLocked, serverTimestamp, weaverTags | ja |

Vävaren från Dagbok: `category: vävaren_metadata`.

## 6. Backend

- `notifyNewFile` callable — Drive/webhook (**webhook planerad**)
- Genkit entity extraction async (**planerat**)

## 7. Säkerhet

Fyren, PIN, Shake-to-Kill, Zero Footprint (vault session), CMEK, `assertWormPayload`.

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| PIN, Fyren 3s, WORM rules + client guard | WebAuthn prod | Full Dossier-export |
| Enkel, tvåspalt, tresteg, magkänsel | Vault session store | notifyNewFile webhook |
| VaultLogList, saveVaultLog, media, röst-memo | | Variant B long-press Dagbok |
| Per-post PDF (`exportVaultRecordAsPdf`) | | Valv-Chat |
| Stäng → `/dagbok`, shake → `/` | | |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | WORM — ingen update/delete | **done** (rules + assertWormPayload) |
| 2 | Shake → `/` snabbt | **done** |
| 3 | Tvåspalt + media/röst sparbar | **done** |
| 4 | Per-post PDF (utskrift) | **done** — `exportVaultRecord.ts` |
| 5 | Full Dossier (hash + snapshot) | **planned** — se `dossier.md` |

## 10. Kopplingar

- **Dagbok** — Vävaren async; Variant B dold route
- **Speglings-Systemet** — EvidenceCompare läser valv
- **Kunskap/Kampspår** — RAG indirekt
- **Dossier** — per-post PDF idag; samlad export planerad → [`dossier.md`](dossier.md)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/verklighetsvalvet/` · plan: `src/modules/verklighetsvalvet/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. Full Dossier — *Skapa Dossier* + `generateDossier` (se `dossier/module_plan.md`)  
2. `notifyNewFile` webhook (se `docs/DRIVE_AUTOMATION.md`)  
3. Variant B long-press på Dagbok (nav-beslut)  
4. Valv-Chat
