# Hub-analys: Dagbok (Reflektion · Speglar · Bevis · Vävaren HITL)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/dagbok`, Hjärtat-flikar, inbäddat Valv, journalvävare

---

## Syfte & route

Dagbok-hubben (**Hjärtat**) samlar **publik reflektion** (journal), **speglingscoaching** (Zero Footprint) och **Valv-baksida** (bevis) bakom Fyren-session. Legacy paths `/valv`, `/speglar` redirectas till `/dagbok?tab=…` (`AppRoutes.tsx` 70–107).

| Flik | Route | Komponent |
|------|-------|-----------|
| Reflektion | `/dagbok` (default) | `DagbokPage` embedded |
| Speglar | `/dagbok?tab=speglar` | `SpeglingsSystem` |
| Bevis / Valv | `/dagbok?tab=bevis&vaultTab=…` | `VaultPage` embedded |

Nav-sanning: `navTruth.ts` 82–115; fliklogik: `useHjartatHub.ts`, `tabRegistry.ts` 125–141.

---

## Användarresa ×3

### 1. Daglig reflektion
Användaren öppnar Dagbok → flik **Reflektion** → `DagbokPage` wizard (snabb/reflektera/arkiv). Spar till `journal` (WORM). MåBra-brygga via `?from=&energy=` sätter lågenergi-läge (`DagbokPage` 45–49).

### 2. Spegla känsla utan Valv-RAG
Flik **Speglar** → `SpeglingsSystem` — validering utan persistent cross-RAG (U4). Länk till Valv kräver Fyren-session (`SpeglingsSystem` copy i smoke).

### 3. Bevis + Vävaren HITL
Fyren → `tab=bevis` → `VaultPage` med zoner. Efter journalspar kan **Vävaren** föreslå metadata; förälder godkänner i `WeaverApprovalPanel` innan ingest till Valv (`WeaverApprovalPanel` 26–51, `vavarenCopy.ts`). Drawer visar badge på **Spara & sök** vid pending (`NavigationDrawer` 70–76).

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| Tre flikar Reflektion/Speglar/Bevis | Hjärtat-hub | `HjartatPage` 17–33 | ✅ |
| Bevis kräver gate | Sacred Valv | `VaultPage` 180–192; `useHjartatHub` 76–89 strippar utan gate | ✅ |
| G18 döljer Bevis-flik | `HIDE_BEVIS_TAB` | `getVisibleHjartatTabIds` `tabRegistry.ts` 125–128 | ✅ (flag) |
| Vävaren HITL | ADK / journal_woven | `WeaverApprovalPanel`, drawer badge | ✅ |
| `/kunskap` → Valv kunskapsbank | Ingen publik kunskap | `AppRoutes.tsx` 97 | ✅ |
| Journal WORM | U3 | `useJournalFlow`, Firestore `journal` | ✅ |

---

## Navigationsproblem

1. **Dubbel namngivning:** UI säger “Hjärtat”, drawer säger “Dagbok” (`navTruth` 82–88 vs `HjartatPage` 17).
2. **Bevis utan Fyren:** Deep link `?tab=bevis` rensas om gate saknas (`useHjartatHub` 76–89) — bra säkerhet men ingen förklaring utom Valv-kortet.
3. **`isVaultUnlocked` tvingar bevis-flik** (`useHjartatHub` 28–29) — användaren kan inte stanna på Reflektion medan Valv-session är öppen utan att stänga Valv.
4. **Vävaren timeout 45 s** (`WeaverApprovalPanel` 46) — tyst avslut kan feltolkas som “inget hände”.

---

## Locked UX

| Feature | Kod |
|---------|-----|
| Valv Mönster + Orkester (i Bevis) | `VaultMonsterPanel`, `VaultOrkesterPanel` (smoke) |
| Fyren-gate, ingen direkt-PIN i UI | `VaultPage` 187–189 |
| Speglar-system | `SpeglingsSystem` |
| Optimistic journal save | `useJournalFlow` (smoke Barnfokus-parallell) |
| Vävare pending badge drawer | `NavigationDrawer` 70–76 |

---

## Smoke

| Script | Kontroller |
|--------|------------|
| `npm run smoke:locked-ux` | Fyren, Valv-baksida, Hjärtat paths |
| `npm run smoke:orkester` | journal_woven, Valv-zoner |
| `npm run build` | Dagbok + Vault chunk |

---

## Ombyggnadsidéer P1–P3

**P1:** Enhetlig titel “Dagbok” eller “Hjärtat” i drawer + sidhuvud.  
**P2:** Explicit toast när `?tab=bevis` blockeras (gate saknas).  
**P3:** Vävaren-status i Reflektion efter spar (inline panel) utan att kräva Valv-flik.

---

## diff-scope

| Område | Filer |
|--------|-------|
| Hjärtat shell | `HjartatPage.tsx`, `useHjartatHub.ts` |
| Reflektion | `DagbokPage.tsx`, `useJournalFlow.ts`, `WeaverApprovalPanel.tsx` |
| Speglar | `SpeglingsSystem.tsx`, `mirror/*` |
| Bevis embed | `VaultPage.tsx`, `vaultTabs.ts` |
| Routing | `AppRoutes.tsx`, `tabRegistry.ts` |
| Copy | `vavarenCopy.ts`, `valvNavCopy.ts` |

**Backend:** `functions/src` (vävare callables) — separat deploy-scope.
