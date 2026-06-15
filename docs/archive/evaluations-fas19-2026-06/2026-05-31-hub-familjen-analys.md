# Hub-analys: Familjen (Familjen · Barnporten)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/familjen`, `/barnporten`, barnfokus, Valv HITL

---

## Syfte & route

**Familjen** = föräldrahub med barnlogg, reflektion och inbäddad **Barnporten**-föräldervy. **Barnporten** (`/barnporten`) = separat barn-PWA med egen Orkester — Valv endast via förälder HITL.

| Flik | Route | Innehåll |
|------|-------|----------|
| Reflektion | `/familjen?tab=reflektion` | Barnfokus-frågor, `FamiljenReflektionTab` |
| Livslogg | `/familjen?tab=livslogg` | Barnloggar per barn |
| Tillsammans | `/familjen?tab=tillsammans` | Familjeaktiviteter |
| Barnporten | `/familjen?tab=barnporten` | Inkorg + Orkester + länk till PWA |

Legacy: `/barnen` → `/familjen` (`AppRoutes.tsx` 106). Kunskap/monster-flikar redirectar till Valv (`FamiljenPage` 24–28).

Nav: `navTruth.ts` 151–190.

---

## Användarresa ×3

### 1. Barnfokus-fråga (locked)
Familjen → **Reflektion** → `BarnfokusFraganPanel` med dagens fråga från pool (`BarnfokusFraganPanel` 26–28). Spar optimistiskt till `children_logs` med `category: 'barnfokus'`. Knappcopy: **Spara till {alias}s logg**.

### 2. Livslogg per barn
Flik **Livslogg** → barnväljare (`FamiljenChildPicker`) → logg/chat mot `children_logs` silo (U1).

### 3. Barnporten inkorg → Valv (HITL)
Flik **Barnporten** → `BarnportenInboxPanel` filtrerar `category.startsWith('barnporten')` (`BarnportenInboxPanel` 46–49) → `SaveAsEvidencePrompt` — **ingen** auto-promote till Valv. Barn öppnar `/barnporten` separat.

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| BARNFOKUS pool + panel | locked-ux | `BarnfokusFraganPanel.tsx` 1–28 | ✅ |
| Barnporten spec + agents | BARNPORTEN-SPEC | `barnportenAgents.ts`, `BarnportenOrkesterPanel` | ✅ |
| Inkorg → Valv HITL | §7b kanon | `BarnportenInboxPanel` + `SaveAsEvidencePrompt` | ✅ |
| Ej auto-promote barnlogg | Sacred | ingest kräver förälder | ✅ |
| Dock Familjen | inDock | `navTruth` 156 `inDock: true` | ✅ |
| children_logs silo | U1/U3 WORM | Firestore rules (ej läst här) | ✅ (arkitektur) |

---

## Navigationsproblem

1. **Barnporten dubbel entry:** Flik i Familjen + egen route `/barnporten` — förälder vs barn roll inte alltid tydlig i UI.
2. **Hamn “Barnfokus”** pekar till Familjen (`TryggHamnHub` 55–62) — extra hopp.
3. **Legacy tab redirects** (kunskap/monster) kan överraska om gamla bokmärken.
4. **Child picker döljs** på Reflektion och Tillsammans — olika UX per flik (`FamiljenPage` 43–66).

---

## Locked UX

| Feature | Kod / register |
|---------|----------------|
| BarnfokusFraganPanel | `BarnfokusFraganPanel.tsx` rad 1 |
| BARNFOKUS_QUESTIONS pool | constants (smoke) |
| BarnportenInboxPanel | smoke + kanon png |
| Barnporten agents registry | `barnportenAgents.ts` |
| Optimistic save | `handleSaveBarnfokus` (smoke) |

**MUST NOT:** ta bort HITL, auto-promote till Valv, eller middag-only label utan godkännande.

---

## Smoke

| Script | Kontroller |
|--------|------------|
| `npm run smoke:locked-ux` | Barnfokus, Barnporten inkorg, manifest |
| `npm run smoke:orkester` | barn-Orkester wiring |
| `npm run build` | Familjen chunk |

---

## Ombyggnadsidéer P1–P3

**P1:** Tydlig “Förälder / Barn” etikett på Barnporten-länken i Familjen-fliken.  
**P2:** Enhetlig child picker eller förklaring varför Reflektion skiljer sig.  
**P3:** Barnporten widget CB1–CB4 dokumenterad i hub (ej förälder W1-inspelning).

---

## diff-scope

| Område | Filer |
|--------|-------|
| Familjen shell | `FamiljenPage.tsx`, `useFamiljenShell.ts` |
| Barnfokus | `BarnfokusFraganPanel.tsx`, `BarnensPage.tsx` (legacy mount) |
| Barnporten | `BarnportenPage.tsx`, `BarnportenInboxPanel.tsx`, `saveBarnportenLog.ts` |
| Nav | `navTruth.ts`, `familjenTabs` |
| Valv bro | `SaveAsEvidencePrompt`, evidence ingest |

**Firestore:** `children_logs` rules — separat säkerhets-scope.
