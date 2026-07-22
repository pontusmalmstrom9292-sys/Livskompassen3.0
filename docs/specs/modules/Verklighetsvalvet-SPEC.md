# Verklighetsvalvet-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + Kladd 2026-05-21 + kodgranskning.  
Konsoliderad till [`.context/modules/verklighetsvalvet.md`](../../../.context/modules/verklighetsvalvet.md).  
**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §D–§H.

## 1. Syfte och användarbehov

**Sacred Feature — Sanningens Sköld (Lager 2).** WORM-bevisbank mot gaslighting: append-only, tidsstämplade sanningar med objektiv struktur (tvåspalt, tresteg, magkänsel). Skyddar verklighetsuppfattning utan JADE — fakta före tolkning.

**Strikt skild från Dagbok (Lager 1):** dagboken är mjuk och helande; valvet är kallt, forensiskt och juridiskt orienterat. **Plausible deniability:** appen ska kunna framstå som vanlig dagbok utåt; valv nås via **Fyren** (dold gest).

## 2. Route och ingång

| | |
|---|---|
| **Route (primär)** | `/valvet?vaultTab=…` — `ValvetRoutePage` → `VaultPage` (egen silo) |
| **Redirect** | `/valv`, `/valvet` (legacy redirect), `/kunskap`, `/dossier` → `/valvet?vaultTab=…` |
| **AuthGate** | Ja (Firebase Auth) + WebAuthn/biometri → `issueVaultSession` |
| **Kluster** | Valv (separat route — **ingen** Bevis-flik på Hjärtat) |
| **Fyren (dold ingång)** | **3s långtryck** på **dock BookOpen** → WebAuthn → `/valvet` |
| **Synlig ingång** | Drawer Valv-sektion efter upplåsning; Resurser → Säkerhet |
| **Direkt `/valvet`** | Kräver `hasVaultGate()` — annars `VaultLockedGate` + Fyren-instruktion |

**Ingen egen Shield-ikon i dock** — Fyren sitter på BookOpen (Variant B i notebook = aktiv kod).

## 3. UX-flöde (Progressive Disclosure)

**Ett steg i taget vid stress/ångest.**

### Ingång och auth

1. **Fyren:** 3s long-press BookOpen → WebAuthn → navigera till bevis-flik.
2. **Valv-gate:** WebAuthn via Fyren (3s long-press) → `issueVaultSession` server-token. Ingen client-PIN i prod (`VITE_VAULT_PIN` borttagen).
3. **Upplåst valv:** flikar **Logga \| Sök** (Valv-Chat).

### Inmatning (flik Logga)

Välj `entryType` → fyll fält → spara → lista uppdateras.

| `entryType` | UI | Sparade fält |
|-------------|-----|--------------|
| `simple` | Enkel text | `truth` |
| `two_column` | Hens version / min verklighet | `theirVersion`, `myReality`, `truth` (kombinerad) |
| `three_shield` | Vad händer / känsla / gräns (progressive) | `shieldWhat`, `shieldFeeling`, `shieldBoundary`, `truth` |
| `body_signal` | Text-chips (`BODY_SIGNALS`) + valfri notering | `bodySignals[]`, `truth` |

**Media:** en fil via `uploadVaultEvidence` → Storage `vault_evidence/{uid}/` → `evidenceUrl` (singular, **inte** `mediaUrls[]`).

**Röst:** Web Speech API (`sv-SE`) — transkriberad text **appendas till `truth`**, ingen ljud-Blob till Storage.

**Inte i valv-form idag:** `childImpact` / "Barnens citat" — det hör till `children_logs` (Barnen).

### Sök (flik Sök)

`ValvChatPanel` → `valvChatQuery` → Sannings-Analytikern. Session **nollställs** vid flikbyte/unmount (`useValvChatSession`).

### Stäng och panik

- **Stäng:** låser valv, rensar gate, tillbaka till Reflektion (`/dagbok`).
- **Flikbyte** från Bevis: `clearVaultGate()` + `setVaultUnlocked(false)` i `HjartatPage`.
- **Shake-to-Kill:** global `useShakeToKill` — tröskel **15 m/s²**, debounce **2s** → `executeKillSwitch()` + navigera `/`.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` (slate-950) |
| Yta / glass | `#0f172a` + blur |
| Aktiv / accent | `#FDE68A` (guld) |
| Fortsätt | `#818CF8` (indigo) |
| Spara / fakta | `#2DD4BF` (emerald) |
| Typografi | Outfit + Inter |

**Förbjudet:** lila (utöver indigo), turkos, regnbåge, naturteman, ljusa bakgrunder, count-up, gamification.

**Magkänsel:** text-chips — **inte** SVG-ikoner (notebook #5).

## 5. Datamodell (Firestore, WORM)

Skrivskydd via Security Rules: `create` med `ownerId == auth.uid`; `update, delete: if false`. Klient: `assertWormPayload` blockerar mutationsfält.

### Collection: `reality_vault`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs (via `withUserId`) |
| `userId` | string | Spegel av ownerId |
| `action` | string | `'bevis'` (standard från form) |
| `truth` | string | Huvudtext / sammanfattning |
| `category` | string? | Valfri kategori |
| `entryType` | string? | `simple`, `two_column`, `three_shield`, `body_signal` |
| `theirVersion` | string? | Tvåspalt |
| `myReality` | string? | Tvåspalt |
| `shieldWhat/Feeling/Boundary` | string? | Tresteg |
| `bodySignals` | string[]? | Magkänsel |
| `evidenceUrl` | string? | **En** media-URL (Storage) |
| `isLocked` | boolean | Sätts `true` vid create (`saveVaultLog`) |
| `weaverTags` | object? | Async från Vävaren (`vävaren_metadata`) |
| `createdAt` | timestamp | server-side |

**Async från Dagbok:** `weaveJournalEntry` → `category: vävaren_metadata` (filtreras bort i Valv-Chat RAG som standard).

**Drive idag:** `notifyNewFile` / ingest → **`kb_docs`** (Kunskap) — **inte** auto till `reality_vault`.

## 6. Backend och agenter

Prompts **endast** i [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts).

| Callable / lib | Roll |
|----------------|------|
| Klient `saveVaultLog` | Direkt Firestore `addDoc` → `reality_vault` — **inte** callable |
| `uploadVaultEvidence` | Storage → `evidenceUrl` |
| `weaveJournalEntry` | Dagbok → async WORM i `reality_vault` |
| `valvChatQuery` | `valvChatAgent` + `fetchVaultEvidenceForQuery` (token-match) → JSON `{ answer, citations[] }` |
| `getVaultLogs` | Klient-read för lista + Speglar |

**Valv-Chat agent:** **Sannings-Analytikern** — **inte** Livs-Arkivarien / Mönster-Arkivarien.

**RAG:** token-match på senaste ~100 poster (`vaultRag.ts`); exkluderar `vävaren_metadata`. **Ingen** ANN/Vector Search i MVP.

**PDF:** klient `exportVaultRecordAsPdf` (utskriftsdialog) per post — **inte** server-side BBIC batch.

**Planerat:** `generateDossier` (Dossier-modul), Drive → valv med manuellt godkännande, `notifyNewFile`-webhook för valv-kandidater.

## 7. Säkerhet

| Kontroll | Status |
|----------|--------|
| AuthGate + Firestore `ownerId` | **done** |
| WORM `reality_vault` (rules + `assertWormPayload`) | **done** |
| Fyren: WebAuthn + `setVaultGate` | **done** (client MVP) |
| PIN-gate före innehåll | **done** |
| Session lock vid flikbyte (`HjartatPage`) | **done** |
| Valv-Chat RAM-reset (`useValvChatSession`) | **done** |
| Kill Switch + shake | **done** (15 m/s², 2s debounce) |
| Zero Footprint idle (`useZeroFootprint` 5 min) | **partial** |
| PIN-hash i `localStorage` | **done** (medvetet avvägning vs full Zero Footprint) |
| CMEK / crypto-shredding | **planned** (drift/GCP) |
| Duress-PIN | **planned** (ej MVP) |

**Inte i MVP:** dold decoy-PIN, justerbar shake-tröskel i UI.

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Fyren 3s + progress ring på BookOpen | **done** |
| WebAuthn vid Fyren | **done** (client MVP) |
| PIN setup/verify i VaultPage | **done** |
| WORM rules + client guard | **done** |
| Enkel / tvåspalt / tresteg / magkänsel | **done** |
| Media upload (`evidenceUrl`) | **done** |
| Röst → text i `truth` | **done** |
| VaultLogList + per-post PDF | **done** |
| Valv-Chat (Sök-flik, `valvChatQuery`) | **done** |
| Stäng → Lager 1, flikbyte låser | **done** |
| Shake-to-Kill | **done** |
| Synlig Bevis-flik i Hjärtat | **done** (produktgap vs plausible deniability) |
| Klickbara citations i Valv-Chat | **planned** |
| Dölj Bevis-flik (endast Fyren) | **planned** (beslut §14) |
| Drive → `reality_vault` (manuellt) | **planned** |
| `generateDossier` multi-källa + hash | **done** (deploy callable) |
| BBIC `reportType` / mass-mall | **planned** fas 2 |
| Sanningens Ankare (pinned WORM-poster) | **planned** |
| CMEK-verifiering i drift | **planned** |
| Duress-PIN | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Firestore Rules blockerar `update`/`delete` på `reality_vault` | **done** |
| 2 | Spara via klient `saveVaultLog` med `serverTimestamp` | **done** |
| 3 | Fyren 3s BookOpen → WebAuthn → bevis-flik | **done** |
| 4 | PIN krävs före form/lista | **done** |
| 5 | Alla fyra `entryType` sparbar | **done** |
| 6 | Media → Storage → `evidenceUrl` | **done** |
| 7 | Röst fyller text, ingen ljudfil | **done** |
| 8 | Valv-Chat läser endast `reality_vault` (exkl. vävaren) | **done** |
| 9 | Chat nollställs vid flikbyte/unmount | **done** |
| 10 | Per-post PDF (print) | **done** |
| 11 | Flikbyte från Bevis låser session | **done** |
| 12 | Shake → kill switch + `/` | **done** |
| 13 | Klickbara citations | **planned** |
| 14 | Dold Bevis-flik (Fyren only) | **planned** |
| 15 | BBIC/Dossier mass-export | **planned** |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Dagbok** | Vävaren async → `vävaren_metadata`; Fyren delad ingång |
| **Valv-Chat** | Flik Sök i `VaultPage`; se [`Valv-Chat-SPEC.md`](./Valv-Chat-SPEC.md) |
| **Speglings-Systemet** | `getVaultLogs` + `matchVaultEvidence` i EvidenceCompare |
| **Hamn / BIFF** | `SafeHarborPage` kan `saveVaultLog` (valfri bevis-post) |
| **Kunskap / Minne** | **Skild** — Drive → `kb_docs`; **ingen** gemensam RAG med Valv-Chat |
| **Dossier** | Planerad aggregation från `reality_vault` + journal + barnen |
| **Barnen** | `childrenImpact` i `children_logs` — **inte** i valv-form |

## 11. Navigation

- **Dock:** BookOpen kort klick → `/dagbok` (Reflektion); **Fyren** 3s → `/valvet`
- **Kluster:** Hjärtat — Reflektion \| Bevis \| Speglar
- **Redirects:** `/valv` → `/valvet`
- **ClusterGrid:** länk "Verklighetsvalvet" → `?tab=bevis` (synlig idag)
- **Mål (§14):** dölj synlig Bevis-flik — endast Fyren

## 12. Tidigare diskussioner att bevara (vision)

- **Plausible deniability:** yttre granskare ser dagbok; valv via dold gest.
- **Tvåspaltssystemet:** hens version vs min verklighet — JADE-stop via struktur.
- **Trestegs-sköld:** objektivt → känsla → gräns (progressive disclosure).
- **Magkänsel:** somatosensorisk ankring under hypervigilans.
- **Sanningens Ankare:** pinned WORM-poster som referens vid gaslighting (planerat).
- **BBIC / juridisk dossier:** batch-export via Dossier — inte MVP per-post print.
- **Drive som kladd:** auto till Kunskap; valv kräver mänskligt godkännande.

## 13. Avvisade eller alternativa idéer

- **Google Apps Script / Kalkylark** — avvisat; Firebase Firestore.
- **Callable `saveVaultLog`** — avvisat; klient WORM create med rules.
- **`mediaUrls[]` / flera filer per post i MVP** — avvisat; en `evidenceUrl`.
- **Röstmemo som ljudfil i Storage** — avvisat; transkribera till `truth`.
- **Gemensam databas dagbok + valv** — avvisat; separata collections.
- **Redigera/radera bevis** — avvisat (WORM).
- **Valv-Chat → Kunskapsvalv RAG** — avvisat (cross-contamination).
- **Drive auto → `reality_vault`** — avvisat; manuellt godkännande (§14).
- **Shield som egen dock-ikon (Variant A)** — avvisat; Fyren på BookOpen.
- **Magkänsel SVG-ikoner** — avvisat; text-chips.
- **Livs-Arkivarien i Valv-Chat** — avvisat; Sannings-Analytikern.
- **Stjärnbilder / gamification** — avvisat (Kladd §G).
- **Nordisk skymning grön UI** — avvisat; Obsidian Calm.
- **GAS / FastAPI / Kalkylark-WORM** — avvisat; Firebase Functions + Firestore.
- **Auto Storage → Agentic Vision → valv** — avvisat MVP; manuellt godkännande.

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §D–§H.

| Prioritet bevis | Status produkt |
|-----------------|----------------|
| Orosanmälan 2026-03-05 | Användaren laddar PDF manuellt |
| Skola Ann/Lena, barnsamtal | Manuellt + ev. Barnen `skola` |
| SMS tvåspalt som PDF-export | **done** entry modes; metod: hel tråd |
| Vävaren-godkännande före permanent tagg | **done** 2026-05-31 — `weaver_pending` + HITL |

## 15. Öppna produktbeslut (låsta 2026-05)

| # | Fråga | Beslut | Låst |
|---|-------|--------|------|
| 1 | Drive → `reality_vault` | **Manuellt godkännande**; Drive-auto endast till `kb_docs` | **Ja** |
| 2 | PDF-export | **Klient per post nu**; BBIC/mass via **Dossier callable** senare | **Ja** |
| 3 | Valv-Chat session | **Nollställ vid flikbyte** (behåll `useValvChatSession`) | **Ja** |
| 4 | Auth | **WebAuthn + PIN**; duress-PIN **inte** MVP | **Ja** |
| 5 | Synlig Bevis-flik | **Dölj** — implementera när **Fyren sitter i muskelminnet**; synlig flik tills dess | **Ja** |

---

**Module plan (kod):** [`src/modules/verklighetsvalvet/module_plan.md`](../../../src/modules/verklighetsvalvet/module_plan.md)  
**Valv-Chat:** [`docs/specs/modules/Valv-Chat-SPEC.md`](./Valv-Chat-SPEC.md)  
**Prompter:** [`docs/specs/ai-prompts-heart.md`](../ai-prompts-heart.md), [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)  
**Flöde:** [`docs/specs/hjartat-flode.md`](../hjartat-flode.md)
