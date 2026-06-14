# KompassSuperHub — Utvecklings-Deck + Vit-koppling

**Datum:** 2026-06-14  
**Status:** **P0 klar** (Forge lab mock · naming · 12-bento deck) — P1–P4 planerade enligt tabell nedan  
**Kanon:** [MABRA-PROJEKT-VIT-HUB-SPEC](../design/MABRA-PROJEKT-VIT-HUB-SPEC.md) · [INNEHALL-REGISTER](../INNEHALL-REGISTER.md) U6 · [OBSIDIAN-FORGE-SPEC](../design/themes/OBSIDIAN-FORGE-SPEC.md)

---

## A. REASONS (kort)

### Requirements
- Levande hemkompass-supermodul — Obsidian Calm, ett steg i taget, ingen jargon/gamification.
- Snabbstart **ovanför primär CTA** — täcker inte hälsning.
- Enklare svenska etiketter i `compassWidgetCatalog.ts` + Forge.
- **Utforska** → 12 bento-kategorier → ett kort (REFLECTION/PLAY) via `bankId` — ingen LLM-fakta.
- Valfri reflektion → `vit_entries`; Valv-promote endast via `MabraVitEvidencePrompt` + `sourceRef`.
- Statistik i Valv **Mitt Vit** — separat från WORM-bevis.
- `evolution_ledger` vid första spar per kategori — ingen streak/XP.

### Entities
| Entitet | Roll |
|---------|------|
| `discoveryBentoCatalog.ts` | 12 kategorier, accent, `projectId`, `bankId[]` |
| `vit_entries` | Append-only + `categoryId` + `inputMode: kompass_discovery` |
| `evolution_ledger` | WORM milestone `kompass_discovery` |
| `OdForgeKompassSuperHub` | Forge + prod-bridge shell |
| `HomeForgeKompassBridge` | Prod-wire bakom `FORGE_PROD_WIRE_ENABLED` |

### Approach
P0 Forge layout + naming → P1 deck + rotation → P2 Vit persist → P3 evolution → P4 prod-bridge (flag off).

### Safeguards
- Ingen fjärde RAG-silo · ingen auto-promote Valv · `FORGE_PROD_WIRE_ENABLED = false` tills PMIR.

---

## B. UX-spec

Layout (Kompass-läge): fas → läge → inline chips → **snabb-rad ovanför CTA** → CTA → **Utforska** → bento-deck → kort-vy → Spara/Hoppa över.

Etiketter: KASAM→**Stäng dagen**, Fokus→**Nästa steg**, Mikrosteg→**Ett litet steg**, Frågesport→**Snabb fråga**.

Återanvänder: `OdForgeBentoGrid`-mönster, `CompassQuickWidgetRail`-mönster, `saveVitEntry`, `MabraVitEvidencePrompt`, `VaultVitHubPanel`.

---

## C. Innehållskatalog

Fil: `src/modules/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog.ts`  
Rotation: `pickDiscoveryCard.ts` (FNV-1a, samma mönster som `pickDagligMix`).

12 kategorier: `ha_kul`, `lar_ny`, `utveckling`, `varderingar`, `sjalvkansla`, `kropp`, `lek_paus`, `kanslor`, `lugn`, `identitet`, `nar_det_knar`, `min_uppgift` — minst 4 KEEP `bankId` vardera.

Extra coach-bank: `discoveryCoachBank.ts` (MB-REF-01..06, MB-PLAY-01..04).

---

## D. Backend / Firestore

- `vit_entries`: valfritt `categoryId` (whitelist i rules), `inputMode: kompass_discovery`.
- Valv: `?vitCategory=` filter + `categoryCounts` i stats.
- `evolution_ledger`: `recordDiscoveryMilestoneIfNew` — idempotent via cache + ledger read.

**Deploy efter godkännande:** `firebase deploy --only firestore:rules` (P2).

---

## E. Faser — leverans

| Fas | Status | Smoke |
|-----|--------|-------|
| P0 Forge + naming | **done** | `npm run build` · `npm run smoke:locked-ux` |
| P1 Deck + rotation | **done** (kortflöde i UI) | `npm run smoke:discovery-deck` |
| P2 Vit write + Valv filter | **done** | `npm run smoke:mabra` |
| P3 evolution_ledger | **done** | `npm run smoke:evolution-discovery` |
| P4 prod-bridge | **done** (flag on) | `npm run smoke:locked-ux` |

### Nyckelfiler
- `OdForgeKompassSuperHub.tsx`, `KompassDiscoveryDeck.tsx`, `KompassDiscoveryCardFlow.tsx`
- `discoveryBentoCatalog.ts`, `pickDiscoveryCard.ts`, `discoveryBankResolver.ts`
- `vitHubFirestore.ts`, `filterVitEntries.ts`, `VaultVitHubPanel.tsx`
- `evolutionLedgerFirestore.ts`, `HomeForgeKompassBridge.tsx`

---

## F. PMIR-checklista före prod-wire (P4)

- [ ] `npm run smoke:locked-ux` PASS
- [ ] `npm run smoke:compass` PASS
- [ ] `npm run smoke:discovery-deck` PASS
- [ ] U6 — alla bankIds KEEP
- [ ] Ingen auto-promote `reality_vault`
- [ ] Användaren sagt «godkänn Forge» → sätt `FORGE_PROD_WIRE_ENABLED = true`
- [ ] `firebase deploy --only firestore:rules,hosting`

---

**P1 kortflöde live 2026-06-15** — Utforska → kategori → reflektionskort → Spara till Vit / Hoppa över. Test: `/dev/obsidian-forge` eller Hem + Obsidian Depth.
