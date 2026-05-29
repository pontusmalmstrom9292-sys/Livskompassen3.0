This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/design/VALV-HUBB-SPEC.md, docs/specs/modules/Verklighetsvalvet-SPEC.md, .context/locked-ux-features.md, src/modules/evidence/vault/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
.context/
  locked-ux-features.md
docs/
  design/
    VALV-HUBB-SPEC.md
  specs/
    modules/
      Verklighetsvalvet-SPEC.md
src/
  modules/
    evidence/
      vault/
        components/
          KunskapsbankHeader.tsx
          OrkesterAgentTrio.tsx
          PansaretHeader.tsx
          VaultEntryForm.tsx
          VaultForensicPanel.tsx
          VaultInkastCompact.tsx
          VaultLogList.tsx
          VaultMonsterPanel.tsx
          VaultOrkesterPanel.tsx
          VaultPage.tsx
          VaultPatternHandoff.tsx
          VaultSamlaDriveHint.tsx
          VaultSamlaHub.tsx
          VaultValvBreadcrumb.tsx
        constants/
          productAgents.ts
          vaultEntry.ts
          vavarenCopy.ts
        dossier/
          api/
            dossierService.ts
          components/
            DossierPage.tsx
          utils/
            dossierCandidates.ts
          index.ts
          module_plan.md
          README.md
          types.ts
        types/
          vaultEntry.ts
        utils/
          exportVaultRecord.ts
          normalizeVaultLog.ts
          smsThreadParse.ts
          vaultPatternScan.ts
          vaultTabs.ts
        index.ts
        module_plan.md
        README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="docs/specs/modules/Verklighetsvalvet-SPEC.md">
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
| **Route (primär)** | `/dagbok?tab=bevis` — `VaultPage` inbäddad i `HjartatPage` |
| **Redirect** | `/valv` → `/dagbok?tab=bevis` |
| **AuthGate** | Ja (Firebase Auth) |
| **Kluster** | Hjärtat (flikar: Reflektion \| Bevis \| Speglar) |
| **Fyren (dold ingång)** | **3s långtryck** på **dock BookOpen** → WebAuthn (`authenticateVaultGate`) → `setVaultGate()` → `/dagbok?tab=bevis` |
| **Synlig ingång idag** | Flik **Bevis** i Hjärtat + `ClusterGrid` länk — **svagare** plausible deniability (se §14) |
| **Standalone `/valv`** | Kräver `hasVaultGate()` — annars instruktion om Fyren |

**Ingen egen Shield-ikon i dock** — Fyren sitter på BookOpen (Variant B i notebook = aktiv kod).

## 3. UX-flöde (Progressive Disclosure)

**Ett steg i taget vid stress/ångest.**

### Ingång och auth

1. **Fyren:** 3s long-press BookOpen → WebAuthn → navigera till bevis-flik.
2. **PIN-gate** (`PinGate` i `VaultPage`): första gången = skapa PIN (hash i `localStorage`); därefter verifiering. `VITE_VAULT_PIN` endast dev.
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

- **Dock:** BookOpen kort klick → `/dagbok` (Reflektion); **Fyren** 3s → `/dagbok?tab=bevis`
- **Kluster:** Hjärtat — Reflektion \| Bevis \| Speglar
- **Redirects:** `/valv` → `/dagbok?tab=bevis`
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
| Vävaren-godkännande före permanent tagg | **planned** fas 2 |

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
</file>

<file path="src/modules/evidence/vault/components/OrkesterAgentTrio.tsx">
import { PRODUCT_AGENTS } from '../constants/productAgents';

const TRIO_IDS = ['agent_brusfiltret', 'agent_biff_skolden', 'agent_sannings_analytikern'] as const;

/** D17 — tre primära agenter i Orkester-vyn. */
export function OrkesterAgentTrio() {
  const trio = PRODUCT_AGENTS.filter((a) => TRIO_IDS.includes(a.id as (typeof TRIO_IDS)[number]));
  const display = trio.length >= 3 ? trio.slice(0, 3) : PRODUCT_AGENTS.slice(0, 3);

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {display.map((agent) => (
        <div key={agent.id} className="elongated-module p-3 text-center">
          <p className="text-xs font-medium text-accent">{agent.name}</p>
          <p className="mt-1 text-[10px] text-text-dim">{agent.role}</p>
        </div>
      ))}
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/PansaretHeader.tsx">
import { Shield } from 'lucide-react';

/** D16 — Pansaret-rubrik (Mönster-flik). */
export function PansaretHeader() {
  return (
    <div className="elongated-module elongated-module--gold mb-4 flex items-start gap-3 p-4">
      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-display text-base text-accent">Det Digitala Pansaret</p>
        <p className="mt-1 text-xs text-text-muted">
          Frekvens och mönster från dina WORM-poster — deterministiskt, inte gissning.
        </p>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultInkastCompact.tsx">
import { useCallback, useRef, useState } from 'react';
import { FileUp, Inbox, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { fileToBase64 } from '../../kompis/api/ingestKnowledgeDocumentService';
import {
  formatInkastResultMessage,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '../../../inkast/api/inkastService';

const TEXT_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

const BINARY_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function resolveMime(file: File): string {
  if (file.type) return file.type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

type Props = {
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
};

/** Kompakt Inkast i Valv Samla — samma callable som Hem, PIN-gated kontext. */
export function VaultInkastCompact({ onQueued, onPersistedBevis }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSubmit = useCallback(
    async (payload: Parameters<typeof submitInkastLite>[0]) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const result: SubmitInkastLiteResult = await submitInkastLite(payload);
        setSuccessMessage(formatInkastResultMessage(result));
        if (result.action === 'queued') {
          onQueued?.();
        } else if (
          result.action === 'persisted' &&
          result.collection === 'reality_vault' &&
          result.docId
        ) {
          onPersistedBevis?.(result.docId);
        }
        if (!payload.text) setText('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Inkast misslyckades.');
      } finally {
        setLoading(false);
      }
    },
    [onQueued, onPersistedBevis],
  );

  const handlePasteSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 12) {
      setError('Skriv minst några rader (sms, mejl, anteckning).');
      return;
    }
    void runSubmit({ text: trimmed, fileName: 'inkast-klistra.txt' });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0]!;
    const mimeType = resolveMime(file);
    const useBinary = BINARY_TYPES.has(mimeType);
    const useText =
      TEXT_TYPES.has(mimeType) || /\.(txt|md|csv|json)$/i.test(file.name);

    if (!useBinary && !useText) {
      setError('Stödda format: .pdf, .txt, .md, .csv, .json, .png, .jpg, .webp');
      return;
    }

    try {
      if (useBinary) {
        const base64 = await fileToBase64(file);
        await runSubmit({ fileName: file.name, mimeType, base64 });
      } else {
        const content = (await file.text()).trim();
        if (content.length < 12) {
          setError('Filen är tom eller för kort.');
          return;
        }
        await runSubmit({ text: content.slice(0, 12_000), fileName: file.name });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte läsa filen.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <BentoCard
      title="Inkast"
      description="Sms, mejl eller fil → rätt silo"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      <p className="mb-2 text-xs text-text-dim">
        Hög säkerhet → granskningskö. Bekräfta «Bevis» innan posten blir WORM.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Klistra sms eller mejl…"
        rows={3}
        className="input-glass w-full resize-none rounded-xl px-3 py-2 text-sm"
        disabled={loading}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-pill--secondary text-xs"
          disabled={loading || text.trim().length < 12}
          onClick={handlePasteSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              Sorterar…
            </>
          ) : (
            'Skicka'
          )}
        </button>
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="mr-1 inline h-3 w-3" />
          Fil
        </button>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-amber-400/90">{error}</p>}
      {successMessage && <p className="mt-2 text-xs text-success">{successMessage}</p>}
    </BentoCard>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultMonsterPanel.tsx">
/** @locked-ux Valv Mönster — do not remove; see `.context/locked-ux-features.md` */
import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { VaultLog } from '../../../core/types/firestore';
import { buildVaultFrequencyReport } from '../utils/vaultPatternScan';

type Props = {
  logs: (VaultLog & { id: string })[];
};

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const width = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-dim">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-accent/70 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function VaultMonsterPanel({ logs }: Props) {
  const report = useMemo(() => buildVaultFrequencyReport(logs), [logs]);
  const maxTechnique = report.topTechniques[0]?.count ?? 0;
  const maxMonth = Math.max(...report.monthlyCounts.map((m) => m.count), 1);

  if (logs.length === 0) {
    return (
      <BentoCard title="Mönster" description="Pansaret · deterministisk frekvens" icon={<BarChart3 className="h-4 w-4" />}>
        <EmptyState message="Inga valvposter ännu. Logga bevis under Logga — frekvensen visas här." />
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard
        title="Frekvensanalys"
        description="Pansaret · regex-lager (ingen LLM som sanning)"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          {report.totalPosts} poster · {report.smsLikePosts} kommunikationsrelaterade ·
          deterministisk skanning av dina WORM-texter.
        </p>
        <div className="mt-4 space-y-3">
          {report.topTechniques.length === 0 ? (
            <p className="text-sm text-text-dim">
              Inga kända manipulationstaktiker hittades i befintliga poster (bra tecken, eller
              kortare texter).
            </p>
          ) : (
            report.topTechniques.map(({ technique, count }) => (
              <BarRow key={technique} label={technique} count={count} max={maxTechnique} />
            ))
          )}
        </div>
      </BentoCard>

      <BentoCard title="Poster per månad" description="Systematisk tidsfrekvens">
        <div className="space-y-3">
          {report.monthlyCounts.map(({ month, count }) => (
            <BarRow key={month} label={month} count={count} max={maxMonth} />
          ))}
        </div>
      </BentoCard>

      <BentoCard title="Kategorier i valvet" description="Fördelning">
        <div className="space-y-2 text-sm text-text-muted">
          {Object.entries(report.categoryCounts).map(([cat, count]) => (
            <p key={cat}>
              {cat}: <span className="text-accent">{count}</span>
            </p>
          ))}
        </div>
      </BentoCard>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultPatternHandoff.tsx">
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';

/** Efter logg eller vid mönster-nyckelord — länk till Mönster (ingen auto-analys). */
export function VaultPatternHandoff({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`journal-handoff ${className}`.trim()}
      role="note"
      aria-label="Förslag om mönsteranalys"
    >
      <div className="journal-handoff__header">
        <BarChart3 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="journal-handoff__title">Leta mönster i bevisen?</p>
      </div>
      <p className="journal-handoff__body">
        När du har flera poster kan Mönster-fliken visa upprepningar över tid. Inget körs automatiskt.
      </p>
      <Link to={vaultDrawerPath('monster')} className="journal-handoff__cta btn-pill--ghost">
        Öppna Mönster →
      </Link>
    </aside>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultSamlaDriveHint.tsx">
import { HardDrive } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';

type Props = {
  pendingCount?: number;
  onOpenQueue: () => void;
};

/** G10 — Drive hamnar i granskningskö; ingen auto-WORM till reality_vault (SPEC §14). */
export function VaultSamlaDriveHint({ pendingCount, onOpenQueue }: Props) {
  return (
    <BentoCard
      title="Drive & oklara filer"
      description="Manuellt godkännande"
      icon={<HardDrive className="h-4 w-4 text-accent" />}
    >
      <p className="text-xs text-text-dim">
        Filer från Google Drive sparas <strong className="font-normal text-text-muted">inte</strong>{' '}
        automatiskt som bevis. De hamnar i granskningskö — välj «→ Bevis» när du är redo.
      </p>
      <button type="button" className="btn-pill--secondary mt-3 text-xs" onClick={onOpenQueue}>
        {pendingCount != null && pendingCount > 0
          ? `Öppna granskningskö (${pendingCount})`
          : 'Öppna granskningskö'}
      </button>
    </BentoCard>
  );
}
</file>

<file path="src/modules/evidence/vault/constants/productAgents.ts">
/** Produktroller (AGENTS.md) — UI-register för Orkester-fliken; routing sker i functions. */
export const PRODUCT_AGENTS = [
  {
    id: 'agent_sannings_analytikern',
    name: 'Sannings-Analytikern',
    role: 'Bevis & VIVIR',
    focus: 'Valv, strikt JSON',
  },
  {
    id: 'agent_monster_arkivarien',
    name: 'Mönster-Arkivarien',
    role: 'Frekvens & makro',
    focus: 'SMS-trådar, långsiktiga mönster',
  },
  {
    id: 'agent_grans_arkitekten',
    name: 'Gräns-Arkitekten',
    role: 'BIFF + DCAP',
    focus: 'Hamn, Grey Rock',
  },
  {
    id: 'agent_biff_skolden',
    name: 'BIFF-Skölden',
    role: 'Neutralt svar',
    focus: 'Kort, fast kommunikation',
  },
  {
    id: 'agent_brusfiltret',
    name: 'Brusfiltret',
    role: 'Clean Input',
    focus: 'Fakta ur manipulation',
  },
  {
    id: 'agent_livs_arkivarien',
    name: 'Livs-Arkivarien',
    role: 'Minne & RAG',
    focus: 'Kunskapsvalvet',
  },
  {
    id: 'agent_paralys_brytaren',
    name: 'Paralys-Brytaren',
    role: 'Ett mikrosteg',
    focus: 'Kompasser',
  },
  {
    id: 'agent_rsd_kylaren',
    name: 'RSD-Kylaren',
    role: 'Alternativ',
    focus: 'Kalla triggers',
  },
] as const;
</file>

<file path="src/modules/evidence/vault/constants/vaultEntry.ts">
import type { VaultEntryType } from '../types/vaultEntry';

export const BODY_SIGNALS = [
  'Tung över axlarna',
  'Klump i magen',
  'Svårt att andas',
] as const;

export const VAULT_ENTRY_MODES: { id: VaultEntryType; label: string }[] = [
  { id: 'simple', label: 'Enkel' },
  { id: 'two_column', label: 'Tvåspalt' },
  { id: 'three_shield', label: 'Tresteg' },
  { id: 'body_signal', label: 'Magkänsel' },
];

export const SHIELD_STEPS = [
  { key: 'what', label: 'Vad händer?', placeholder: 'Objektivt, utan tolkning...' },
  { key: 'feeling', label: 'Vad känner jag?', placeholder: 'Kroppsligt eller emotionellt...' },
  { key: 'boundary', label: 'Hur vill jag att det ska vara?', placeholder: 'Gräns eller önskat tillstånd...' },
] as const;
</file>

<file path="src/modules/evidence/vault/constants/vavarenCopy.ts">
/**
 * User-facing copy for Vävaren (async journal → `vävaren_metadata` in Valvet).
 * Fas 1.5 — clarity only; godkännande-flöde remains planned.
 */
export const VAVAREN_SAVED_HINT =
  'Sparad. Vävaren sätter AI-taggar i bakgrunden — de syns under Arkiv men räknas inte som bevis i Sök.';

export const VAVAREN_CONFIRM_HINT =
  'Efter sparande: Vävaren lägger AI-taggar i Valvet (bakgrund). Dina egna ord i dagboken ändras inte.';

export const VAVAREN_LOG_CATEGORY_LABEL = 'AI-taggar från dagbok';

export const VAVAREN_LOG_DISCLAIMER =
  'AI-sammanfattning — inte dina ord och inte beviskropp. Export med godkännande kommer i en senare fas.';

export const VAVAREN_VALVCHAT_HINT =
  'Sök använder dina WORM-poster. AI-taggar från dagboken (Vävaren) ingår inte.';

export const VAVAREN_DOSSIER_CHECKBOX = 'Kort AI-försätt (Vävaren) före rapporten';

export const VAVAREN_DOSSIER_HINT =
  'Bevisdelen är ordagrant från valvet. Försättet är valfritt och märks som AI-sammanfattning.';
</file>

<file path="src/modules/evidence/vault/dossier/api/dossierService.ts">
import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../../../core/firebase/init';
import type { GenerateDossierInput, GenerateDossierResult } from '../types';

const generateDossierCallable = httpsCallable<GenerateDossierInput, GenerateDossierResult>(
  functions,
  'generateDossier',
);

export async function generateDossier(
  input: GenerateDossierInput,
): Promise<GenerateDossierResult> {
  try {
    const result = await generateDossierCallable(input);
    return result.data;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/not-found' || fnError.code === 'functions/unimplemented') {
      throw new Error(
        'Backend generateDossier är inte deployad än. Wizard och urval är klara — nästa steg är Cloud Function + dossier_snapshots.',
      );
    }
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för att generera dossier.');
    }
    throw new Error(fnError.message || 'Kunde inte generera dossier.');
  }
}
</file>

<file path="src/modules/evidence/vault/dossier/utils/dossierCandidates.ts">
import type { VaultLog } from '../../../../core/types/firestore';
import type { ChildrenLogEntry } from '../../../../family/children/types';
import type { DossierCandidateDoc, DossierSourceKey, GenerateDossierInput } from '../types';

export function isoDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export function inDateRange(createdAt: string | undefined, from: string, to: string): boolean {
  if (!createdAt) return false;
  const day = isoDateOnly(createdAt);
  return day >= from && day <= to;
}

export function defaultDateRange(): { dateFrom: string; dateTo: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return {
    dateFrom: from.toISOString().slice(0, 10),
    dateTo: to.toISOString().slice(0, 10),
  };
}

export function shiftMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function vaultTitle(log: VaultLog & { id: string }): string {
  return log.category?.trim() || log.action || 'Valv-post';
}

function vaultPreview(log: VaultLog): string {
  const parts = [log.truth, log.myReality, log.theirVersion].filter(Boolean);
  const text = parts.join(' · ') || log.childrenImpact || '';
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

export function vaultToCandidate(log: VaultLog & { id: string }): DossierCandidateDoc {
  return {
    id: log.id,
    kind: 'reality_vault',
    createdAt: log.createdAt,
    title: vaultTitle(log),
    preview: vaultPreview(log),
    category: log.category,
  };
}

export function childrenToCandidate(log: ChildrenLogEntry): DossierCandidateDoc {
  const title = [log.childAlias, log.category || log.action].filter(Boolean).join(' · ') || 'Barnlogg';
  const preview =
    log.observation || log.truth || log.childrenImpact || 'Fysiologi/logg';
  return {
    id: log.id,
    kind: 'children_logs',
    createdAt: log.createdAt ?? '',
    title,
    preview: preview.length > 160 ? `${preview.slice(0, 160)}…` : preview,
    category: log.category,
  };
}

export function journalToCandidate(entry: {
  id: string;
  mood?: string;
  text?: string;
  createdAt?: string;
}): DossierCandidateDoc {
  const mood = entry.mood ? `Humör: ${entry.mood}. ` : '';
  const text = String(entry.text ?? '');
  return {
    id: entry.id,
    kind: 'journal',
    createdAt: entry.createdAt ?? '',
    title: 'Dagbok',
    preview: `${mood}${text}`.slice(0, 160),
  };
}

export function filterCandidates(
  docs: DossierCandidateDoc[],
  dateFrom: string,
  dateTo: string,
  enabledSources: Record<DossierSourceKey, boolean>,
  categoryFilter: string[],
): DossierCandidateDoc[] {
  return docs.filter((doc) => {
    if (!enabledSources[doc.kind]) return false;
    if (!inDateRange(doc.createdAt, dateFrom, dateTo)) return false;
    if (categoryFilter.length > 0 && doc.category) {
      return categoryFilter.some(
        (tag) => doc.category?.toLowerCase().includes(tag.toLowerCase()),
      );
    }
    if (categoryFilter.length > 0 && !doc.category) return false;
    return true;
  });
}

export function collectCategoryTags(docs: DossierCandidateDoc[]): string[] {
  const tags = new Set<string>();
  for (const doc of docs) {
    if (doc.category?.trim()) tags.add(doc.category.trim());
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'sv'));
}

export function groupIncludedIds(
  docs: DossierCandidateDoc[],
  included: Set<string>,
): GenerateDossierInput['includedDocIds'] {
  const ids: GenerateDossierInput['includedDocIds'] = {
    reality_vault: [],
    children_logs: [],
    journal: [],
  };
  for (const doc of docs) {
    if (!included.has(doc.id)) continue;
    ids[doc.kind].push(doc.id);
  }
  return ids;
}
</file>

<file path="src/modules/evidence/vault/dossier/index.ts">
export { DossierPage } from './components/DossierPage';
</file>

<file path="src/modules/evidence/vault/dossier/module_plan.md">
# dossier — module plan

## Overview

Dossier-Generator — Sacred Feature. Samlad WORM-export till PDF med hash + `dossier_snapshots`.

**Route:** `/dossier` (AuthGate + Fyren A) · **Canonical:** [`docs/specs/modules/Dossier-SPEC.md`](../../../docs/specs/modules/Dossier-SPEC.md), `.context/modules/evidence/vault/dossier.md`

## Låsta beslut (#1–#4)

Se Dossier-SPEC tabell. Fyren A, backend PDF, snapshot WORM evigt, hela dokument i granskning.

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Wizard + period/källor | Ombud/soc export | Ja | **done** |
| `generateDossier` + hash | Sacred Feature | Ja | **done** |
| `dossier_snapshots` WORM | Evigt snapshot | Ja | **done** |
| BBIC `reportType` | §I.4 öppen | Nej | **planned** |
| Flik Dossier i Valv | Logga/Sök/Dossier | Ja | **done** |
| Bro från Barnen | Kladd | Nej | **planned** |
| Vävaren försätt opt-in | AI endast försätt | Nej | **planned** |
| Async `dossier_jobs` | Lång kö | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Files

| Path | Role | Status |
|------|------|--------|
| `components/DossierPage.tsx` | Wizard: period → källor → granskning → generera | **done** (UI) |
| `types.ts` | Input/result types | **done** |
| `utils/dossierCandidates.ts` | Filter, kandidatlista | **done** |
| `api/dossierService.ts` | `generateDossier` callable | **done** |
| `functions/src/lib/generateDossierInternal.ts` | Hash, PDF, snapshot, signed URL / pdfBase64 | **done** |
| `scripts/smoke_dossier.mjs` | E2E smoke | **done** |

## Relaterad kod (snabbexport)

| Path | Roll |
|------|------|
| `verklighetsvalvet/utils/exportVaultRecord.ts` | Per-post print-PDF |
| `barnens_livsloggar/utils/exportBalansReport.ts` | JSON Balans |

## Deploy

```bash
firebase deploy --only firestore:rules,storage,functions:generateDossier
```

## Smoke

```bash
npm run smoke:dossier
```

Se [`docs/SMOKE_RESULTS.md`](../../../docs/SMOKE_RESULTS.md) § Dossier smoke.

## Nästa fas

1. Bro *Skapa Dossier* i Barnen (Valv-flik klar)
2. GCP: `signBlob` för signed URL (valfritt — base64 fungerar)
3. Async `dossier_jobs` om PDF > ~10 s
3. Vävaren opt-in försätt (AI)
4. BBIC `reportType`

## Security

Fyren A, explicit trigger, Zero Footprint on unmount/Klar, ingen auto-delning.
</file>

<file path="src/modules/evidence/vault/dossier/README.md">
# dossier

> Sacred Feature — Dossier-Generator. Formell WORM-sammanställning (PDF) för ombud/myndighet.

## Syfte

Aggregerar valv + barnen (+ valfritt journal) utan manuell omskrivning. Kanonisk hash, snapshot WORM, PDF Storage TTL ~24 h.

## Route och ingång

| | |
|---|---|
| **Route** | `/dossier` |
| **AuthGate** | ja + Fyren A |
| **Dock** | ingen ikon |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/DossierPage.tsx` | Wizard: period → källor → granska → generera |
| `api/dossierService.ts` | `generateDossier` callable |
| `utils/dossierCandidates.ts` | Kandidatfiltrering |

**Relaterad export (andra moduler):**

- `verklighetsvalvet/utils/exportVaultRecord.ts` — PDF per valv-post
- `barnens_livsloggar/utils/exportBalansReport.ts` — JSON Balans

## Data

| | |
|---|---|
| **Läser** | `reality_vault`, `children_logs`, opt-in `journal` |
| **Skriver** | `dossier_snapshots` (WORM), PDF i Storage (kortlivad) |

## Beror på

- `core` — auth, Fyren, layout
- `functions/` — pdf-lib PDF-generering

## Kopplingar

- **verklighetsvalvet** — primär beviskälla
- **barnens_livsloggar** — valfri källa
- **dagbok** — opt-in med varning i UI

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `dossier_snapshots` — WORM export-metadata |
| **RAG / chatt** | Nej — aggregerar valda källor |
| **PDF / samlad export** | **Ja** — närmast "hela arkivet + PDF" idag |
| **Planerat** | BBIC-mall, Kunskapskällor opt-in |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/evidence/vault/dossier.md)
- [Dossier-SPEC](../../../docs/specs/modules/Dossier-SPEC.md)
- [p2-flode](../../../docs/specs/p2-flode.md)
</file>

<file path="src/modules/evidence/vault/dossier/types.ts">
export type DossierReportType = 'LEGAL' | 'BBIC';

export type DossierSourceKey = 'reality_vault' | 'children_logs' | 'journal';

export type DossierSources = Record<DossierSourceKey, boolean>;

export type DossierWizardStep = 'period' | 'sources' | 'review' | 'result';

export type DossierDocKind = DossierSourceKey;

export interface DossierCandidateDoc {
  id: string;
  kind: DossierDocKind;
  createdAt: string;
  title: string;
  preview: string;
  category?: string;
}

export interface GenerateDossierInput {
  dateFrom: string;
  dateTo: string;
  sources: DossierSources;
  reportType: DossierReportType;
  includeAiForeword: boolean;
  categoryFilter?: string[];
  includedDocIds: {
    reality_vault: string[];
    children_logs: string[];
    journal: string[];
  };
}

export interface GenerateDossierResult {
  dossierId: string;
  documentHash: string;
  downloadUrl?: string;
  pdfBase64?: string;
  jobId?: string;
  status: 'ready' | 'pending';
}
</file>

<file path="src/modules/evidence/vault/types/vaultEntry.ts">
export type VaultEntryType = 'simple' | 'two_column' | 'three_shield' | 'body_signal';

export type VaultLogInput = {
  action: string;
  category?: string;
  truth: string;
  entryType?: VaultEntryType;
  theirVersion?: string;
  myReality?: string;
  bodySignals?: string[];
  shieldWhat?: string;
  shieldFeeling?: string;
  shieldBoundary?: string;
  evidenceUrl?: string;
  pinned?: boolean;
};
</file>

<file path="src/modules/evidence/vault/utils/exportVaultRecord.ts">
import type { VaultLog } from '../../../core/types/firestore';

function formatRecord(log: VaultLog & { id: string }): string {
  const lines = [
    'LIVSKOMPASSEN — VERKLIGHETSVALV (WORM)',
    `Datum: ${(log.createdAt ?? '').slice(0, 19)}`,
    `Kategori: ${log.category ?? 'bevis'}`,
    `Typ: ${log.entryType ?? 'simple'}`,
    '',
    log.truth ?? '',
  ];

  if (log.theirVersion || log.myReality) {
    lines.push('', '--- Tvåspalt ---', `Hens version: ${log.theirVersion ?? '—'}`, `Min verklighet: ${log.myReality ?? '—'}`);
  }
  if (log.evidenceUrl) {
    lines.push('', `Media: ${log.evidenceUrl}`);
  }

  return lines.join('\n');
}

/** Öppnar utskriftsdialog — användaren kan spara som PDF. */
export function exportVaultRecordAsPdf(log: VaultLog & { id: string }): void {
  const body = formatRecord(log)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Valv-bevis</title>
<style>body{font-family:Inter,sans-serif;padding:2rem;color:#0f172a;line-height:1.5}</style></head>
<body>${body}</body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.opener = null;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
</file>

<file path="src/modules/evidence/vault/utils/normalizeVaultLog.ts">
import type { VaultLog, WeaverTags } from '../../../core/types/firestore';

export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeWeaverTags(raw: unknown): WeaverTags | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const wt = raw as Record<string, unknown>;
  return {
    emotions: normalizeStringArray(wt.emotions),
    actors: normalizeStringArray(wt.actors),
    threatLevel:
      wt.threatLevel === 'low' ||
      wt.threatLevel === 'medium' ||
      wt.threatLevel === 'high' ||
      wt.threatLevel === 'none'
        ? wt.threatLevel
        : 'none',
    threatScore: typeof wt.threatScore === 'number' ? wt.threatScore : undefined,
    ragAnchors: Array.isArray(wt.ragAnchors) ? (wt.ragAnchors as WeaverTags['ragAnchors']) : [],
    model: 'gemini-1.5-pro',
    journalEntryId: typeof wt.journalEntryId === 'string' ? wt.journalEntryId : '',
  };
}

/** Säker normalisering — legacy Firestore-rader får inte krascha list-UI. */
export function normalizeVaultLogFields(
  log: VaultLog & { id: string; weaverTags?: unknown },
): VaultLog & { id: string; weaverTags?: WeaverTags } {
  const { weaverTags: _rawWeaver, bodySignals: _rawSignals, ...rest } = log;
  const weaverTags = normalizeWeaverTags(_rawWeaver);
  return {
    ...rest,
    truth: typeof log.truth === 'string' ? log.truth : String(log.truth ?? ''),
    bodySignals: normalizeStringArray(_rawSignals ?? log.bodySignals),
    ...(weaverTags ? { weaverTags } : {}),
  };
}
</file>

<file path="src/modules/evidence/vault/utils/smsThreadParse.ts">
/** Heuristisk uppdelning av inklistrad sms-tråd till tvåspalt (Hens / Min). */
export function parseSmsThreadToTwoColumn(raw: string): {
  theirVersion: string;
  myReality: string;
} | null {
  const text = raw.trim();
  if (text.length < 20) return null;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const mineMarkers = /^(jag|mig|min|mitt|mina|me|i)\b/i;
  const theirMarkers = /^(hen|de|du|dom)\b/i;

  const mine: string[] = [];
  const theirs: string[] = [];
  let bucket: 'mine' | 'theirs' | 'unknown' = 'unknown';

  for (const line of lines) {
    const headerMatch = line.match(/^([^:]{1,40}):\s*(.+)$/);
    if (headerMatch) {
      const who = headerMatch[1]!.trim();
      const body = headerMatch[2]!.trim();
      if (mineMarkers.test(who) || /^jag$/i.test(who)) {
        mine.push(body);
        bucket = 'mine';
      } else {
        theirs.push(body);
        bucket = 'theirs';
      }
      continue;
    }

    if (theirMarkers.test(line)) {
      theirs.push(line);
      bucket = 'theirs';
    } else if (mineMarkers.test(line)) {
      mine.push(line);
      bucket = 'mine';
    } else if (bucket === 'theirs') {
      theirs.push(line);
    } else if (bucket === 'mine') {
      mine.push(line);
    } else {
      theirs.push(line);
      bucket = 'theirs';
    }
  }

  if (mine.length === 0 && theirs.length === 0) return null;

  return {
    theirVersion: theirs.join('\n') || text,
    myReality: mine.join('\n') || '',
  };
}
</file>

<file path="src/modules/evidence/vault/index.ts">
export { VaultPage, parseVaultTab, type VaultTab } from './components/VaultPage';
</file>

<file path="src/modules/evidence/vault/README.md">
# verklighetsvalvet

> Sacred Feature — Sanningens Sköld. WORM-bevisbank (Lager 2) mot gaslighting.

## Syfte

Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1). Plausible deniability via **Fyren** (dold ingång).

## Route och ingång

| | |
|---|---|
| **Route** | `/dagbok?tab=bevis` (redirect `/valv`) |
| **AuthGate** | ja |
| **Fyren** | 3s long-press BookOpen → WebAuthn → PIN → bevis |
| **Flik Bevis** | Synlig idag; mål: endast Fyren |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/VaultPage.tsx` | PIN, flikar Logga \| Sök |
| `components/VaultEntryForm.tsx` | 4 inmatningslägen + media + röst |
| `components/VaultLogList.tsx` | Append-only lista + PDF/post |
| `utils/exportVaultRecord.ts` | Klient-PDF per post |
| `types/vaultEntry.ts` | Entry-typer |

**Valv-Chat:** `../evidence/vaultChat/` (Sök-flik)

## Data

| Collection | Innehåll |
|------------|----------|
| `reality_vault` | WORM-bevis (action, truth, category, media, …) |

**Klient:** `saveVaultLog`, `uploadVaultEvidence`  
**Callable:** `valvChatQuery` (via valv_chatt)

## Beror på

- `core` — PinGate, WebAuthn, EvidenceMediaAttach, firestore
- `valv_chatt` — Sök-flik i VaultPage

## Kopplingar

- **Dagbok** — Hjärtat-kluster, Vävaren
- **Speglings_system** — EvidenceCompare
- **safe_harbor** — spara BIFF som bevis
- **dossier** — aggregering till PDF

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `reality_vault` — WORM, glömmer inte |
| **RAG / chatt** | Valv-Chat via `valvChatQuery` (**deploy saknas i prod**) |
| **PDF / samlad export** | per post + Dossier |
| **Planerat** | klickbara citations |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/evidence/vault.md)
- [Verklighetsvalvet-SPEC](../../../docs/specs/modules/Verklighetsvalvet-SPEC.md)
- [valv_chatt README](../evidence/vaultChat/README.md)
</file>

<file path="docs/design/VALV-HUBB-SPEC.md">
# Valv hubb — Konflikt & bevis (IA våg 1)

**Datum:** 2026-05-29  
**Status:** Implementerad i kod (`vaultTabs.ts`, `VaultPage.tsx`)  
**Låst UX:** Mönster, Orkester, Kunskapsbank, Aktörskarta — **får inte tas bort** ([`.context/locked-ux-features.md`](../../.context/locked-ux-features.md))

---

## Princip

Samma `vaultTab`-IDs och callables som tidigare. Endast **zon-navigation** (färre val åt gången) och drawer-grupper ändras.

| Zon (UI) | Flikar (`vaultTab`) | Användning |
|----------|---------------------|------------|
| **Samla** | `logga`, `sok` | Bevis, sms, triage, Valv-Chat |
| **Analysera** | `monster`, `orkester` | Mönster, agent-orkester |
| **Kunskap** | `kunskapsbank`, `aktorskarta` | RAG fakta, nyckelpersoner (G9) |
| **Exportera** | `dossier` | Dossier-generator (+ `/dossier` i drawer) |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, … | Djup analys Hamn/Speglar/Arbetsliv |

## Produktbeslut — Hamn vs Valv (**godkänt 2026-05-29**)

| Lager | Route | Roll |
|-------|-------|------|
| **Snabb ingång** | `/hamn` (Vardag-drawer) | Grey Rock/BIFF-svar, Speglar-bro, låg friktion — **ingen** riskpanel eller auto-bevis |
| **Djup + bevis** | Valv → zon **Forensik** · `hamn_analys` | Full BIFF Triage, DCAP, *Spara som bevis*, Orkester, Mönster, Dossier |

**MUST NOT:** flytta publik BIFF till Valv-only eller kräva PIN för första Grey Rock-svar.  
**MUST:** `?tab=analys` på `/hamn` redirectar till Valv `hamn_analys` (redan i `TryggHamnHub.tsx`).  
**Handoff:** `valvHandoff` i Hamn-text → mjuk länk till Valv (ingen auto-WORM).

---

## Triggers (våg 2)

| Källa | Trigger | Effekt |
|-------|---------|--------|
| Dagbok | `shouldShowValvHandoff` | `HandoffBox` → `/dagbok?tab=bevis` |
| Hamn BIFF | samma | HandoffBox efter klistra-in |
| Valv logga | samma + `shouldSuggestVaultPatternScan` | Handoff + länk till Mönster |

Ingen auto-WORM från Lager 1.

---

## Budget

Deterministiska regex/DCAP — **inte** LLM per tangenttryckning.

---

## Smoke

`npm run smoke:locked-ux` · `npm run smoke:orkester`
</file>

<file path="src/modules/evidence/vault/components/KunskapsbankHeader.tsx">
import { BookOpen } from 'lucide-react';

type KunskapsbankHeaderProps = {
  compact?: boolean;
};

/** Kunskapsbank-zon — egen del av Valv (U1 Kunskap-silo, PIN). */
export function KunskapsbankHeader({ compact = false }: KunskapsbankHeaderProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="font-display text-sm text-accent">Kunskapsbanken</p>
        <span className="text-[10px] text-text-dim">· Minne · U1 silo</span>
      </div>
    );
  }

  return (
    <div className="elongated-module elongated-module--gold mb-4 flex items-start gap-3 p-4">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-display text-base text-accent">Kunskapsbanken</p>
        <p className="mt-1 text-xs text-text-muted">
          Tidshjul, RAG och uppladdning — separat från Pansaret. Ingen cross-RAG till bevisvalvet.
        </p>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultForensicPanel.tsx">
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../core/store';
import { getJournalEntries } from '../../../core/firebase/firestore';
import { getPeriodEconomySummary, type PeriodEconomySummary } from '../../../core/firebase/timeEconomyFirestore';
import { HamnForensicPanel } from '../../../family/safeHarbor/components/BiffPublicPanel';
import { SpeglingsForensicPanel } from '../../../diary/mirror/components/SpeglingsSystem';
import { JournalArchive } from '../../../diary/diary/components/JournalArchive';
import type { JournalEntry } from '../../../diary/diary/types/journal';
import { FamiljenMonsterTab } from '../../../family/children/components/familjen/FamiljenMonsterTab';
import { useFamiljenShell } from '../../../family/children/hooks/useFamiljenShell';
import { VaultEconomyPanel } from '../../../valv_ekonomi';
import { EconomyPeriodSummary } from '../../../wellbeing/economy/components/EconomyPeriodSummary';
import { EconomyPayslipCard } from '../../../wellbeing/economy/components/EconomyPayslipCard';
import type { ForensicVaultTab } from '../utils/vaultTabs';

function ArbetslivLonForensic() {
  const user = useStore((s) => s.user);
  const [summary, setSummary] = useState<PeriodEconomySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setSummary(await getPeriodEconomySummary(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div className="space-y-4">
      <EconomyPeriodSummary summary={summary} loading={loading} />
      <EconomyPayslipCard />
    </div>
  );
}

type Props = {
  tab: ForensicVaultTab;
};

/** Forensic paneler på Valv-baksidan — PIN redan upplåst i VaultPage. */
export function VaultForensicPanel({ tab }: Props) {
  const user = useStore((s) => s.user);
  const shell = useFamiljenShell();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (tab !== 'dagbok_arkiv' || !user) return;
    getJournalEntries(user.uid)
      .then((rows) => setJournalEntries(rows as JournalEntry[]))
      .catch(() => setJournalEntries([]));
  }, [tab, user]);

  switch (tab) {
    case 'hamn_analys':
      return <HamnForensicPanel initialMessage="" />;
    case 'speglar_fordjupat':
      return <SpeglingsForensicPanel userId={user?.uid} />;
    case 'dagbok_arkiv':
      return <JournalArchive entries={journalEntries} />;
    case 'familjen_monster':
      return shell.user ? <FamiljenMonsterTab shell={shell} /> : null;
    case 'arbetsliv_franvaro':
      return <VaultEconomyPanel />;
    case 'arbetsliv_lon':
      return <ArbetslivLonForensic />;
    default:
      return null;
  }
}
</file>

<file path="src/modules/evidence/vault/components/VaultOrkesterPanel.tsx">
/** @locked-ux Valv Orkester — do not remove; see `.context/locked-ux-features.md` */
import { useMemo, useState } from 'react';
import { Loader2, Network } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import {
  analyzeBiffMessage,
  type GransAnalysis,
} from '../../../family/safeHarbor/api/biffService';
import type { VaultLog } from '../../../core/types/firestore';
import { PRODUCT_AGENTS } from '../constants/productAgents';
import { OrkesterAgentTrio } from './OrkesterAgentTrio';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';

type Props = {
  logs?: (VaultLog & { id: string })[];
};

export function VaultOrkesterPanel({ logs = [] }: Props) {
  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grans, setGrans] = useState<GransAnalysis | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);

  const registeredDocs = useMemo(
    () =>
      logs
        .filter((log) =>
          /sms|mejl|kommunikation|myndighet|dokument/i.test(
            `${log.category ?? ''} ${log.action ?? ''}`,
          ),
        )
        .slice(0, 8),
    [logs],
  );

  const handleScan = async () => {
    if (!thread.trim()) return;
    setLoading(true);
    setError(null);
    setGrans(null);
    setRiskScore(null);
    setAgentName(null);
    try {
      const result = await analyzeBiffMessage(thread);
      setGrans(result.data?.gransAnalysis ?? null);
      setRiskScore(result.dcap?.riskScore ?? null);
      setAgentName(result.data?.agentName ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mönstersökning misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <OrkesterAgentTrio />

      <BentoCard
        title="AI-Orkestern"
        description="Det Digitala Pansaret · produktroller"
        icon={<Network className="h-4 w-4" />}
      >
        <ul className="space-y-2">
          {PRODUCT_AGENTS.map((agent) => (
            <li key={agent.id} className="glass-card p-3 text-sm">
              <p className="font-medium text-text">{agent.name}</p>
              <p className="text-xs text-text-dim">
                {agent.role} · {agent.focus}
              </p>
            </li>
          ))}
        </ul>
      </BentoCard>

      {registeredDocs.length > 0 && (
        <BentoCard title="Registrerade dokument" description="SMS, mejl, myndighet">
          <ul className="space-y-2">
            {registeredDocs.map((log) => {
              const tags = scanTechniquesForLog(log);
              return (
                <li key={log.id} className="glass-card p-3 text-sm">
                  <p className="text-[10px] uppercase tracking-widest text-text-dim">
                    {log.category ?? 'dokument'} · {(log.createdAt ?? '').slice(0, 10)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-text-muted">
                    {(log.truth ?? '').slice(0, 120) || '—'}
                  </p>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-accent/20 px-2 py-0.5 text-[10px] text-accent/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </BentoCard>
      )}

      <BentoCard
        title="Mönstersökning i SMS-tråd"
        description="Klistra in hela tråden — Brusfiltret + DCAP"
      >
        <p className="mb-3 text-sm text-text-muted">
          Exportera gärna hela tråden som text/PDF först (iMazing/Decipher). Kör sedan sökning
          här — resultatet är vägledning, inte dom.
        </p>
        <textarea
          value={thread}
          onChange={(e) => setThread(e.target.value)}
          placeholder="Klistra in sms-tråden här…"
          rows={8}
          className="input-glass rounded-xl px-3 py-2"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleScan}
          disabled={loading || !thread.trim()}
          className="btn-pill--accent mt-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kör mönstersökning
        </button>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        {(riskScore != null || grans) && (
          <div className="mt-4 space-y-3 border-t border-border-strong pt-4 text-sm">
            {agentName && (
              <p className="text-text-dim">
                Dirigerad av: <span className="text-accent">{agentName}</span>
              </p>
            )}
            {riskScore != null && (
              <p>
                DCAP riskpoäng: <span className="text-accent">{riskScore}</span>/100
              </p>
            )}
            {grans?.techniques?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-dim">Taktiker</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.techniques.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.cleanFacts?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-dim">Rena fakta</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.cleanFacts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.emotionalBait?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-dim">Känslomässigt bete</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.emotionalBait.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </BentoCard>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultSamlaHub.tsx">
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { InboxReviewQueue } from '../../../inkast/components/InboxReviewQueue';
import { fetchInboxQueue } from '../../kompis/api/inboxService';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultInkastCompact } from './VaultInkastCompact';
import { VaultSamlaDriveHint } from './VaultSamlaDriveHint';
import type { VaultLogInput } from '../types/vaultEntry';

export type SamlaView = 'logga' | 'granska';

function parseSamlaView(raw: string | null): SamlaView {
  return raw === 'granska' ? 'granska' : 'logga';
}

type Props = {
  userId: string;
  saving: boolean;
  saveError: string | null;
  onSave: (input: VaultLogInput) => Promise<void>;
  onBevisConfirmed: (docId: string) => void;
};

export function VaultSamlaHub({ userId, saving, saveError, onSave, onBevisConfirmed }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingInbox, setPendingInbox] = useState<number | null>(null);
  const samlaView = parseSamlaView(searchParams.get('samlaView'));

  const setSamlaView = useCallback(
    (view: SamlaView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set('tab', 'bevis');
          params.set('vaultTab', 'logga');
          if (view === 'granska') params.set('samlaView', 'granska');
          else params.delete('samlaView');
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await fetchInboxQueue();
      setPendingInbox(items.length);
    } catch {
      setPendingInbox(null);
    }
  }, []);

  useEffect(() => {
    if (samlaView !== 'granska') {
      void refreshPendingCount();
    }
  }, [refreshPendingCount, samlaView]);

  const handleBevisConfirmed = (docId: string) => {
    onBevisConfirmed(docId);
    setSamlaView('logga');
    void refreshPendingCount();
  };

  if (samlaView === 'granska') {
    return (
      <div className="space-y-4">
        <InboxReviewQueue
          prioritizeBevis
          onBevisConfirmed={handleBevisConfirmed}
          onBack={() => setSamlaView('logga')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VaultInkastCompact
        onQueued={() => setSamlaView('granska')}
        onPersistedBevis={handleBevisConfirmed}
      />
      <VaultSamlaDriveHint
        pendingCount={pendingInbox ?? undefined}
        onOpenQueue={() => setSamlaView('granska')}
      />
      <BentoCard title="Ny post" description="Append-only bevis">
        <VaultEntryForm userId={userId} saving={saving} onSave={onSave} />
        {saveError && <p className="mt-2 text-sm text-danger">{saveError}</p>}
      </BentoCard>
      <div className="flex justify-end">
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          onClick={() => setSamlaView('granska')}
        >
          Granskningskö
          {pendingInbox != null && pendingInbox > 0 ? ` (${pendingInbox})` : ''}
        </button>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultValvBreadcrumb.tsx">
import {
  forensicVaultTabLabel,
  isAnalyseraVaultTab,
  isExporteraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isSamlaVaultTab,
  type ValvZone,
  type VaultTab,
} from '../utils/vaultTabs';
import { getVaultZoneTabBarItems, vaultMainTabLabel } from '../../../core/navigation/tabRegistry';

type VaultValvBreadcrumbProps = {
  zone: ValvZone;
  vaultTab: VaultTab;
};

const ZONE_LABEL = Object.fromEntries(
  getVaultZoneTabBarItems().map((z) => [z.id, z.label]),
) as Record<ValvZone, string>;

/** Valv › zon › underflik — synkad med drawer-grupper. */
export function VaultValvBreadcrumb({ zone, vaultTab }: VaultValvBreadcrumbProps) {
  const parts: string[] = ['Valv', ZONE_LABEL[zone] ?? zone];

  if (isSamlaVaultTab(vaultTab) || isAnalyseraVaultTab(vaultTab) || isExporteraVaultTab(vaultTab)) {
    parts.push(vaultMainTabLabel(vaultTab));
  } else if (isKunskapVaultTab(vaultTab)) {
    parts.push(vaultMainTabLabel(vaultTab));
  } else if (isForensicVaultTab(vaultTab)) {
    parts.push(forensicVaultTabLabel(vaultTab));
  }

  return (
    <p className="text-xs uppercase tracking-widest text-text-dim" aria-label={parts.join(', ')}>
      {parts.join(' · ')}
    </p>
  );
}
</file>

<file path="src/modules/evidence/vault/dossier/components/DossierPage.tsx">
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { EmptyState } from '../../../../core/ui/EmptyState';
import { useStore } from '../../../../core/store';
import { hasVaultGate } from '../../../../core/auth/sessionService';
import {
  getChildrenLogs,
  getJournalEntries,
  getVaultLogs,
} from '../../../../core/firebase/firestore';
import { generateDossier } from '../api/dossierService';
import type {
  DossierCandidateDoc,
  DossierReportType,
  DossierSources,
  DossierWizardStep,
  GenerateDossierResult,
} from '../types';
import {
  childrenToCandidate,
  collectCategoryTags,
  defaultDateRange,
  filterCandidates,
  groupIncludedIds,
  journalToCandidate,
  shiftMonths,
  vaultToCandidate,
} from '../utils/dossierCandidates';
import {
  VAVAREN_DOSSIER_CHECKBOX,
  VAVAREN_DOSSIER_HINT,
} from '../../constants/vavarenCopy';

const INITIAL_SOURCES: DossierSources = {
  reality_vault: true,
  children_logs: true,
  journal: false,
};

const JOURNAL_WARNING =
  'Dagbok kan innehålla emotionell reflektion. Inkludera endast om ombud begärt det — annars riskerar juridiskt fokus att tunnas ut.';

function resetWizardState() {
  return {
    step: 'period' as DossierWizardStep,
    dateFrom: defaultDateRange().dateFrom,
    dateTo: defaultDateRange().dateTo,
    sources: { ...INITIAL_SOURCES },
    journalAck: false,
    categoryFilter: [] as string[],
    reportType: 'LEGAL' as DossierReportType,
    includeAiForeword: false,
    includedIds: new Set<string>(),
    candidates: [] as DossierCandidateDoc[],
    loadingDocs: false,
    generating: false,
    error: null as string | null,
    result: null as GenerateDossierResult | null,
  };
}

type DossierPageProps = {
  /** Inbäddad i Verklighetsvalvet — Fyren/PIN redan uppfylld av förälder. */
  embedded?: boolean;
};

export function DossierPage({ embedded = false }: DossierPageProps) {
  const [searchParams] = useSearchParams();
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultOpen = embedded || isVaultUnlocked || hasVaultGate();

  const [step, setStep] = useState<DossierWizardStep>('period');
  const [dateFrom, setDateFrom] = useState(defaultDateRange().dateFrom);
  const [dateTo, setDateTo] = useState(defaultDateRange().dateTo);
  const [sources, setSources] = useState<DossierSources>({ ...INITIAL_SOURCES });
  const [journalAck, setJournalAck] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [reportType, setReportType] = useState<DossierReportType>('LEGAL');
  const [includeAiForeword, setIncludeAiForeword] = useState(false);
  const [includedIds, setIncludedIds] = useState<Set<string>>(() => new Set());
  const [allCandidates, setAllCandidates] = useState<DossierCandidateDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateDossierResult | null>(null);

  const clearSession = useCallback(() => {
    const fresh = resetWizardState();
    setStep(fresh.step);
    setDateFrom(fresh.dateFrom);
    setDateTo(fresh.dateTo);
    setSources(fresh.sources);
    setJournalAck(fresh.journalAck);
    setCategoryFilter(fresh.categoryFilter);
    setReportType(fresh.reportType);
    setIncludeAiForeword(fresh.includeAiForeword);
    setIncludedIds(fresh.includedIds);
    setAllCandidates(fresh.candidates);
    setLoadingDocs(fresh.loadingDocs);
    setGenerating(fresh.generating);
    setError(fresh.error);
    setResult(fresh.result);
  }, []);

  useEffect(() => () => clearSession(), [clearSession]);

  const deepLinkChild = searchParams.get('child');
  const deepLinkSources = searchParams.get('sources');

  useEffect(() => {
    if (deepLinkSources === 'children_logs') {
      setSources({
        reality_vault: false,
        children_logs: true,
        journal: false,
      });
    }
  }, [deepLinkSources]);

  const filteredDocs = useMemo(
    () => filterCandidates(allCandidates, dateFrom, dateTo, sources, categoryFilter),
    [allCandidates, dateFrom, dateTo, sources, categoryFilter],
  );

  const categoryTags = useMemo(() => collectCategoryTags(allCandidates), [allCandidates]);

  const loadCandidates = useCallback(async () => {
    if (!user) return;
    setLoadingDocs(true);
    setError(null);
    try {
      const [vault, children, journal] = await Promise.all([
        getVaultLogs(user.uid),
        getChildrenLogs(user.uid),
        getJournalEntries(user.uid),
      ]);
      const docs: DossierCandidateDoc[] = [
        ...vault.map(vaultToCandidate),
        ...children.map((row) =>
          childrenToCandidate(row as Parameters<typeof childrenToCandidate>[0]),
        ),
        ...journal.map((row) =>
          journalToCandidate(row as { id: string; mood?: string; text?: string; createdAt?: string }),
        ),
      ];
      setAllCandidates(docs);
      const visible = filterCandidates(docs, dateFrom, dateTo, sources, categoryFilter);
      let ids = visible.map((d) => d.id);
      if (deepLinkChild) {
        const childDocs = visible.filter(
          (d) => d.kind === 'children_logs' && d.title.startsWith(deepLinkChild),
        );
        if (childDocs.length > 0) ids = childDocs.map((d) => d.id);
      }
      setIncludedIds(new Set(ids));
    } catch {
      setError('Kunde inte läsa bevis från databasen.');
    } finally {
      setLoadingDocs(false);
    }
  }, [user, dateFrom, dateTo, sources, categoryFilter, deepLinkChild]);

  useEffect(() => {
    if (step !== 'review' || !user || !vaultOpen) return;
    void loadCandidates();
  }, [step, user, vaultOpen, loadCandidates]);

  useEffect(() => {
    if (step !== 'review') return;
    const visible = filterCandidates(allCandidates, dateFrom, dateTo, sources, categoryFilter);
    setIncludedIds((prev) => {
      const next = new Set<string>();
      for (const doc of visible) {
        if (prev.has(doc.id)) next.add(doc.id);
      }
      if (next.size === 0 && visible.length > 0) {
        return new Set(visible.map((d) => d.id));
      }
      return next;
    });
  }, [step, allCandidates, dateFrom, dateTo, sources, categoryFilter]);

  const toggleDoc = (id: string) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (tag: string) => {
    setCategoryFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleGenerate = async () => {
    if (!user) return;
    const selected = filteredDocs.filter((d) => includedIds.has(d.id));
    if (selected.length === 0) {
      setError('Välj minst ett dokument att inkludera.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const payload = {
        dateFrom,
        dateTo,
        sources,
        reportType,
        includeAiForeword,
        categoryFilter: categoryFilter.length ? categoryFilter : undefined,
        includedDocIds: groupIncludedIds(filteredDocs, includedIds),
      };
      const data = await generateDossier(payload);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generering misslyckades.');
    } finally {
      setGenerating(false);
    }
  };

  if (!vaultOpen) {
    return (
      <div className={embedded ? 'space-y-4' : 'space-y-6'}>
        <BentoCard title="Dossier-Generator" icon={<Lock className="h-4 w-4" />}>
          <p className="mb-4 text-sm text-text-muted">
            Dossier kräver upplåst Valv (Fyren). I bottenmenyn: tryck på <strong>Hjärtat</strong>{' '}
            (bok-ikonen) och <strong>håll 3 sekunder</strong>, eller öppna fliken Bevis och ange PIN.
          </p>
          <Link
            to="/dagbok?tab=bevis"
            className="inline-flex rounded-lg bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30"
          >
            Öppna Bevis / Valv
          </Link>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      <BentoCard
        title={embedded ? 'Dossier' : 'Dossier-Generator'}
        description={embedded ? 'Samlad WORM-export' : undefined}
        icon={<FileText className="h-4 w-4" />}
      >
        {!embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Sacred Feature — samlad WORM-export. Inget skickas automatiskt; du laddar ner när du är
            redo.
          </p>
        )}
        {embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Inget skickas automatiskt. Du laddar ner PDF lokalt när den är klar.
          </p>
        )}

        {step === 'period' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">Steg 1 av 3 — tidsperiod</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-text-muted">Från</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-text-muted">Till</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -3));
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200"
              >
                Senaste 3 månaderna
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -6));
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200"
              >
                Senaste 6 månaderna
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep('sources')}
              className="w-full rounded-lg bg-indigo-500/25 py-2.5 text-sm font-medium text-indigo-100"
            >
              Fortsätt
            </button>
          </div>
        )}

        {step === 'sources' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">Steg 2 av 3 — källor</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.reality_vault}
                onChange={(e) =>
                  setSources((s) => ({ ...s, reality_vault: e.target.checked }))
                }
                className="rounded border-white/20"
              />
              Verklighetsvalvet (bevis)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.children_logs}
                onChange={(e) =>
                  setSources((s) => ({ ...s, children_logs: e.target.checked }))
                }
                className="rounded border-white/20"
              />
              Barnens livsloggar
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.journal}
                onChange={(e) => {
                  const on = e.target.checked;
                  setSources((s) => ({ ...s, journal: on }));
                  if (!on) setJournalAck(false);
                }}
                className="mt-1 rounded border-white/20"
              />
              <span>
                Dagbok (journal)
                <span className="mt-1 block text-xs text-amber-200/90">{JOURNAL_WARNING}</span>
              </span>
            </label>
            {sources.journal && (
              <label className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={journalAck}
                  onChange={(e) => setJournalAck(e.target.checked)}
                  className="mt-1"
                />
                <span>Jag förstår risken och vill inkludera dagbok i urvalet.</span>
              </label>
            )}
            {categoryTags.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-text-dim">Valfritt — filtrera på kategori/tag</p>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCategory(tag)}
                      className={
                        categoryFilter.includes(tag)
                          ? 'rounded-full bg-amber-500/25 px-3 py-1 text-xs text-amber-100'
                          : 'rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted'
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="flex cursor-pointer items-start gap-2 text-sm text-text-dim">
              <input
                type="checkbox"
                checked={includeAiForeword}
                onChange={(e) => setIncludeAiForeword(e.target.checked)}
                className="mt-0.5 rounded border-white/20"
              />
              <span>
                {VAVAREN_DOSSIER_CHECKBOX}
                <span className="mt-1 block text-xs text-text-muted">{VAVAREN_DOSSIER_HINT}</span>
              </span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as DossierReportType)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              aria-label="Rapporttyp"
            >
              <option value="LEGAL">Juridisk kronologi (MVP)</option>
              <option value="BBIC" disabled>
                BBIC-struktur (fas 2)
              </option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('period')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={sources.journal && !journalAck}
                onClick={() => setStep('review')}
                className="flex-1 rounded-lg bg-indigo-500/25 py-2 text-sm font-medium text-indigo-100 disabled:opacity-40"
              >
                Fortsätt till granskning
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">
              Steg 3 av 3 — hela dokument (avmarkera det som inte ska med)
            </p>
            {loadingDocs ? (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Läser bevis…
              </div>
            ) : filteredDocs.length === 0 ? (
              <EmptyState message="Inga poster i vald period och källor. Ändra period eller källor." />
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {filteredDocs.map((doc) => (
                  <li
                    key={`${doc.kind}-${doc.id}`}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <label className="flex cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={includedIds.has(doc.id)}
                        onChange={() => toggleDoc(doc.id)}
                        className="mt-1 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-amber-100/90">
                          {doc.title}
                        </span>
                        <span className="text-xs text-text-dim">
                          {doc.createdAt.slice(0, 10)} · {doc.kind.replace('_', ' ')}
                        </span>
                        <span className="mt-1 block text-xs text-text-muted">{doc.preview}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <p className="flex items-start gap-2 text-xs text-emerald-200/80">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Dokumentet skickas inte till någon. Du laddar ner lokalt när backend är kopplad.
            </p>
            {error && <p className="text-sm text-red-300/90">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('sources')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={generating || includedIds.size === 0}
                onClick={() => void handleGenerate()}
                className="flex-1 rounded-lg bg-amber-500/25 py-2 text-sm font-medium text-amber-100 disabled:opacity-40"
              >
                {generating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Genererar…
                  </span>
                ) : (
                  'Generera låst dossier'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4">
            {result?.status === 'ready' && (result.downloadUrl || result.pdfBase64) ? (
              <>
                <p className="text-sm text-emerald-200/90">
                  Dossier skapad. Inget har skickats externt.
                </p>
                {result.dossierId && (
                  <p className="text-xs text-text-dim">
                    ID: <span className="font-mono text-text-muted">{result.dossierId}</span>
                  </p>
                )}
                <p className="text-sm text-text-muted">
                  Hash (SHA-256):{' '}
                  <code className="break-all text-xs text-amber-100/90">{result.documentHash}</code>
                </p>
                <p className="text-xs text-text-dim">
                  {result.downloadUrl
                    ? 'Nedladdningslänk gäller ca 24 timmar (Zero Footprint i molnet).'
                    : 'PDF levereras direkt (signed URL ej tillgänglig i projektet).'}
                </p>
                <a
                  href={
                    result.downloadUrl ??
                    `data:application/pdf;base64,${result.pdfBase64 ?? ''}`
                  }
                  download={result.dossierId ? `dossier-${result.dossierId}.pdf` : 'dossier.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-emerald-500/25 py-2.5 text-center text-sm font-medium text-emerald-100"
                >
                  Ladda ner PDF
                </a>
              </>
            ) : (
              <EmptyState
                message={
                  result?.jobId
                    ? `Generering pågår (job ${result.jobId}). Poll kommer i nästa fas.`
                    : error || 'Generering slutfördes utan nedladdningslänk. Försök igen.'
                }
              />
            )}
            <p className="text-xs text-text-dim">
              Inget har skickats till ombud, socialtjänst eller motpart.
            </p>
            <button
              type="button"
              onClick={clearSession}
              className="w-full rounded-lg border border-white/10 py-2 text-sm"
            >
              Klar — rensa urval (Zero Footprint)
            </button>
          </div>
        )}
      </BentoCard>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/utils/vaultPatternScan.ts">
import type { VaultLog } from '../../../core/types/firestore';
import { normalizeStringArray } from './normalizeVaultLog';

export type VaultTechnique =
  | 'DARVO'
  | 'GASLIGHTING'
  | 'JADE_BAIT'
  | 'THREAT'
  | 'LOVE_BOMBING';

const SCAN_PATTERNS: { pattern: RegExp; technique: VaultTechnique }[] = [
  { pattern: /du är alltid så (känslig|dramatisk|överdriftig)/i, technique: 'DARVO' },
  { pattern: /du hittar på/i, technique: 'GASLIGHTING' },
  { pattern: /det har aldrig (hänt|sagts|gjorts)/i, technique: 'GASLIGHTING' },
  { pattern: /du är (galen|psykisk|instabil)/i, technique: 'GASLIGHTING' },
  { pattern: /varför gör du (alltid|aldrig)/i, technique: 'JADE_BAIT' },
  { pattern: /du måste (förklara|bevisa|motivera)/i, technique: 'JADE_BAIT' },
  { pattern: /(annars|om inte).*konsekvens/i, technique: 'THREAT' },
  { pattern: /jag ska se till att/i, technique: 'THREAT' },
  { pattern: /ingen (älskar|förstår|vet) dig som jag/i, technique: 'LOVE_BOMBING' },
];

function logText(log: VaultLog): string {
  return [
    log.truth,
    log.theirVersion,
    log.myReality,
    log.shieldWhat,
    log.shieldFeeling,
    log.shieldBoundary,
    ...(normalizeStringArray(log.bodySignals)),
  ]
    .filter(Boolean)
    .join('\n');
}

export type VaultFrequencyReport = {
  totalPosts: number;
  smsLikePosts: number;
  techniqueCounts: Record<VaultTechnique, number>;
  categoryCounts: Record<string, number>;
  monthlyCounts: { month: string; count: number }[];
  topTechniques: { technique: VaultTechnique; count: number }[];
};

export function buildVaultFrequencyReport(
  logs: (VaultLog & { id: string })[],
): VaultFrequencyReport {
  const techniqueCounts = Object.fromEntries(
    SCAN_PATTERNS.map((p) => [p.technique, 0]),
  ) as Record<VaultTechnique, number>;
  const categoryCounts: Record<string, number> = {};
  const monthMap = new Map<string, number>();
  let smsLikePosts = 0;

  for (const log of logs) {
    const text = logText(log);
    const category = log.category || 'okategoriserad';
    categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;

    const month = (log.createdAt ?? '').slice(0, 7) || 'okänd';
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);

    if (/sms|mejl|meddelande|kommunikation/i.test(`${category} ${log.action}`)) {
      smsLikePosts += 1;
    }

    for (const { pattern, technique } of SCAN_PATTERNS) {
      if (pattern.test(text)) {
        techniqueCounts[technique] += 1;
      }
    }
  }

  const monthlyCounts = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const topTechniques = (Object.entries(techniqueCounts) as [VaultTechnique, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([technique, count]) => ({ technique, count }));

  return {
    totalPosts: logs.length,
    smsLikePosts,
    techniqueCounts,
    categoryCounts,
    monthlyCounts,
    topTechniques,
  };
}

/** D19/D20 — teknik-taggar för en enskild post (deterministiskt). */
export function scanTechniquesForLog(log: VaultLog): VaultTechnique[] {
  const text = logText(log);
  const found = new Set<VaultTechnique>();
  for (const { pattern, technique } of SCAN_PATTERNS) {
    if (pattern.test(text)) found.add(technique);
  }
  return [...found];
}
</file>

<file path="src/modules/evidence/vault/module_plan.md">
# verklighetsvalvet — module plan

## Overview

Sacred Feature: WORM evidence vault (Verklighetsvalvet / Sanningens Sköld). Route `/dagbok?tab=bevis`; redirect `/valv`. Dold ingång via Fyren (3s long-press BookOpen + WebAuthn + PIN).

Canonical: `.context/modules/evidence/vault.md` · Spec: `docs/specs/modules/Verklighetsvalvet-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/VaultEntryForm.tsx` | Enkel/tvåspalt/tresteg/magkänsel + media + röst |
| `components/VaultPage.tsx` | PIN gate, Logga/Sök/**Mönster/Orkester**/Dossier, Stäng → Reflektion |
| `components/VaultMonsterPanel.tsx` | Låst UX — deterministisk frekvens (Pansaret) |
| `components/VaultOrkesterPanel.tsx` | Låst UX — agentregister + SMS mönstersökning |
| `components/VaultLogList.tsx` | Append-only lista + PDF-knapp per post |
| `utils/exportVaultRecord.ts` | Per-post PDF via utskriftsdialog |
| `constants/vaultEntry.ts` | BODY_SIGNALS, VAULT_ENTRY_MODES, SHIELD_STEPS |
| `constants/vavarenCopy.ts` | Vävaren — användarcopy (Fas 1.5) |
| `types/vaultEntry.ts` | VaultEntryType, VaultLogInput |
| `../diary/diary/components/HjartatPage.tsx` | Bevis-flik, session lock vid flikbyte |
| `../core/layout/FloatingDock.tsx` | Fyren — 3s progress + WebAuthn |
| `../core/auth/webauthn.ts` | Passkey-gate (client MVP) |
| `../core/hooks/useShakeToKill.ts` | 15 m/s², 2s debounce → kill switch + `/` |
| `../core/hooks/useSpeechToText.ts` | Röst → text i truth |
| `../core/firebase/firestore.ts` | `assertWormPayload`, `saveVaultLog`, `getVaultLogs` |
| `../core/firebase/storage.ts` | `uploadVaultEvidence` → `vault_evidence/{uid}/` |
| `../evidence/vaultChat/` | ValvChatPanel, `useValvChatSession`, `valvChatQuery` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Fyren 3s + WORM | Dold ingång, Sanningens Sköld | Ja | **done** |
| Tvåspalt / tresteg / magkänsel | Hens version vs sanning | Ja | **done** |
| Storage `evidenceUrl` | PDF/sms-export, ej Drive-auto | Ja | **done** |
| Shake-to-Kill | Panik + iOS-test | Ja | **done** |
| Orosanmälan + skolbevis | §D beviskandidater | Manuell | **use now** |
| Vävaren godkännande | Önskat före permanent AI-tagg | Auto idag | **planned** |
| Vävaren copy / tydlighet (Fas 1.5) | Arkiv, Sök, dagbok, Dossier | `vavarenCopy.ts` | **done** 2026-05-29 |
| Dölj Bevis-flik | Plausible deniability | Nej | **planned** |
| BBIC-filter export | Soc/jurist | Nej | **planned** (Dossier fas 2) |
| Sanningens Ankare landning | Notebook | Nej | **planned** |
| Auto Storage-analys | Notebook vision | Nej | **rejected** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Produktbeslut (låsta 2026-05)

1. Drive → valv: manuellt godkännande (Drive-auto → kb_docs)
2. PDF: klient per post; Dossier callable senare
3. Valv-Chat: nollställ vid flikbyte
4. WebAuthn + PIN; duress-PIN senare
5. Dölj Bevis-flik när Fyren sitter i muskelminnet

## Fas 1.5 — Vävaren UX polish (2026-05-29, lokal)

| # | Leverans | Status |
|---|----------|--------|
| 1 | `constants/vavarenCopy.ts` — gemensam copy | **done** |
| 2 | `VaultLogList` — tydlig etikett för `vävaren_metadata` + weaverTags | **done** |
| 3 | `ValvChatPanel` — förklarar att Sök exkluderar AI-taggar | **done** |
| 4 | Dagbok `SavedStep` / `ConfirmStep` — bakgrundstaggning förklarad | **done** |
| 5 | `DossierPage` — tydligare AI-försätt-checkbox | **done** |

**Ej i Fas 1.5:** godkännande-flöde, `firestore.rules`, borttag av Mönster/Orkester/Kunskapsbank.

## Nästa fas (implementera när användaren säger kör)

1. Dölj Bevis-flik + ClusterGrid-länk (Fyren only, feature flag)
2. Klickbara citations i ValvChatPanel
3. Drive-ingest med manuellt godkännande → `reality_vault`
4. ~~Full Dossier-generator~~ → **done** (`DossierPage` + `generateDossier`; kvar: BBIC-mall, Vävaren försätt)
5. Sanningens Ankare (`pinned`) + citation UX

## Security notes

- Demo PIN: `VITE_VAULT_PIN` endast lokal utveckling
- Zero Footprint: vault unlock + chat rensas vid flikbyte/kill switch
- Evidence: en fil per post (`evidenceUrl`); Storage uid-scoped
- Valv-Chat: isolerad från `knowledgeVaultQuery`
</file>

<file path="src/modules/evidence/vault/components/VaultLogList.tsx">
import { useEffect, useRef, type RefObject } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { VaultLog, WeaverTags } from '../../../core/types/firestore';
import {
  VAVAREN_LOG_CATEGORY_LABEL,
  VAVAREN_LOG_DISCLAIMER,
} from '../constants/vavarenCopy';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';
import { normalizeStringArray } from '../utils/normalizeVaultLog';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';

type VaultLogRow = VaultLog & { id: string; weaverTags?: WeaverTags };

function isVavarenMetadata(log: VaultLog): boolean {
  return log.category === 'vävaren_metadata';
}

type VaultLogListProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
  highlightLogId?: string | null;
};

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return String(value);
}

function formatLogBody(log: VaultLog): string {
  if (log.entryType === 'two_column' && (log.theirVersion || log.myReality)) {
    return `Hens: ${asText(log.theirVersion) || '—'}\nMin: ${asText(log.myReality) || '—'}`;
  }
  if (log.entryType === 'three_shield') {
    return [log.shieldWhat, log.shieldFeeling, log.shieldBoundary]
      .map(asText)
      .filter(Boolean)
      .join(' · ');
  }
  if (log.entryType === 'body_signal') {
    const signals = normalizeStringArray(log.bodySignals);
    if (signals.length > 0) {
      const truth = asText(log.truth);
      return `${signals.join(', ')}${truth ? ` — ${truth}` : ''}`;
    }
  }
  return asText(log.truth);
}

function formatLogDate(createdAt: VaultLog['createdAt'] | undefined): string {
  if (typeof createdAt === 'string') return createdAt.slice(0, 10);
  if (createdAt == null) return '—';
  return String(createdAt).slice(0, 10);
}

function formatServerTimestamp(createdAt: VaultLog['createdAt'] | undefined): string {
  if (typeof createdAt === 'string') return createdAt;
  if (createdAt == null) return '—';
  return String(createdAt);
}

function LogRow({
  log,
  highlightLogId,
  highlightRef,
}: {
  log: VaultLogRow;
  highlightLogId?: string | null;
  highlightRef: RefObject<HTMLLIElement | null>;
}) {
  const vavaren = isVavarenMetadata(log);
  const weaverTags = (log as VaultLogRow).weaverTags;
  const tags = vavaren ? [] : scanTechniquesForLog(log);
  return (
    <li
      key={log.id}
      ref={log.id === highlightLogId ? highlightRef : undefined}
      className={`glass-card p-3 text-sm ${
        log.id === highlightLogId ? 'ring-2 ring-accent/50' : ''
      } ${vavaren ? 'border border-indigo-400/20 bg-indigo-500/5' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            SERVER-TIDSSTÄMPEL · {formatServerTimestamp(log.createdAt)}
          </p>
          <p className="text-[10px] text-text-dim">ID · {log.id.slice(0, 12)}…</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">
            {log.pinned ? 'Ankare · ' : ''}
            {vavaren ? VAVAREN_LOG_CATEGORY_LABEL : (log.category ?? 'allmänt')}
            {!vavaren && log.entryType ? ` · ${log.entryType}` : ''} · {formatLogDate(log.createdAt)}
          </p>
          {vavaren && (
            <p className="mt-1 text-[10px] text-indigo-200/80">{VAVAREN_LOG_DISCLAIMER}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => exportVaultRecordAsPdf(log)}
          className="btn-pill--ghost shrink-0 py-1 px-2"
          title="Exportera som PDF (utskrift)"
        >
          <FileDown className="h-3 w-3" /> PDF
        </button>
      </div>
      <p className={`mt-1 whitespace-pre-wrap ${vavaren ? 'text-indigo-100/90' : 'text-text-muted'}`}>
        {formatLogBody(log)}
      </p>
      {vavaren && weaverTags && (
        <div className="mt-2 flex flex-wrap gap-1">
          {normalizeStringArray(weaverTags.emotions).map((e) => (
            <span
              key={`e-${e}`}
              className="rounded-full border border-indigo-400/25 px-2 py-0.5 text-[10px] text-indigo-200/90"
            >
              {e}
            </span>
          ))}
          {normalizeStringArray(weaverTags.actors).map((a) => (
            <span
              key={`a-${a}`}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-text-muted"
            >
              {a}
            </span>
          ))}
          {weaverTags.threatLevel && weaverTags.threatLevel !== 'none' && (
            <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-200/90">
              hot: {weaverTags.threatLevel}
            </span>
          )}
        </div>
      )}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/20 px-2 py-0.5 text-[10px] text-accent/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {log.evidenceUrl && (
        <a
          href={log.evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-accent-secondary hover:underline"
        >
          Visa bifogat bevis
        </a>
      )}
    </li>
  );
}

export function VaultLogList({ logs, loading, highlightLogId }: VaultLogListProps) {
  const highlightRef = useRef<HTMLLIElement | null>(null);
  const pinned = logs.filter((l) => l.pinned);
  const rest = logs.filter((l) => !l.pinned);

  useEffect(() => {
    if (highlightLogId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLogId, logs.length]);

  return (
    <BentoCard title="VaultLog">
      {loading && logs.length === 0 ? (
        <p className="text-sm text-text-dim flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar...
        </p>
      ) : logs.length === 0 ? (
        <EmptyState message="Inga poster ännu." />
      ) : (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-gold/80">
                Sanningens Ankare
              </p>
              <ul className="space-y-3">
                {pinned.map((log) => (
                  <LogRow key={log.id} log={log} highlightLogId={highlightLogId} highlightRef={highlightRef} />
                ))}
              </ul>
            </div>
          )}
          <ul className="space-y-3">
          {rest.map((log) => (
            <LogRow key={log.id} log={log} highlightLogId={highlightLogId} highlightRef={highlightRef} />
          ))}
        </ul>
        </div>
      )}
    </BentoCard>
  );
}
</file>

<file path="src/modules/evidence/vault/utils/vaultTabs.ts">
import { BookOpen, Users } from 'lucide-react';

/** Samla — arkiv + triage/chat. */
export const SAMLA_VAULT_TAB_IDS = ['logga', 'sok'] as const;

/** Analysera — mönster + orkester (locked UX). */
export const ANALYSERA_VAULT_TAB_IDS = ['monster', 'orkester'] as const;

/** Exportera — dossier. */
export const EXPORTERA_VAULT_TAB_IDS = ['dossier'] as const;

/** Legacy union — alla huvudflikar utom kunskap/forensik. */
export const PANSARET_VAULT_TAB_IDS = [
  ...SAMLA_VAULT_TAB_IDS,
  ...ANALYSERA_VAULT_TAB_IDS,
  ...EXPORTERA_VAULT_TAB_IDS,
] as const;

export type SamlaVaultTab = (typeof SAMLA_VAULT_TAB_IDS)[number];
export type AnalyseraVaultTab = (typeof ANALYSERA_VAULT_TAB_IDS)[number];
export type ExporteraVaultTab = (typeof EXPORTERA_VAULT_TAB_IDS)[number];

export const KUNSKAP_VAULT_TAB = 'kunskapsbank' as const;
export const AKTORSKARTA_VAULT_TAB = 'aktorskarta' as const;

export const KUNSKAP_VAULT_TAB_IDS = [KUNSKAP_VAULT_TAB, AKTORSKARTA_VAULT_TAB] as const;
export type KunskapVaultTab = (typeof KUNSKAP_VAULT_TAB_IDS)[number];

export const VALV_ZONE_IDS = ['samla', 'analysera', 'kunskap', 'exportera', 'forensik'] as const;

export type ValvZone = (typeof VALV_ZONE_IDS)[number];
export type PansaretVaultTab = (typeof PANSARET_VAULT_TAB_IDS)[number];

export const MAIN_VAULT_TAB_IDS = [...PANSARET_VAULT_TAB_IDS, ...KUNSKAP_VAULT_TAB_IDS] as const;

export const FORENSIC_VAULT_TAB_IDS = [
  'hamn_analys',
  'speglar_fordjupat',
  'dagbok_arkiv',
  'familjen_monster',
  'arbetsliv_franvaro',
  'arbetsliv_lon',
] as const;

export type MainVaultTab = (typeof MAIN_VAULT_TAB_IDS)[number];
export type ForensicVaultTab = (typeof FORENSIC_VAULT_TAB_IDS)[number];
export type VaultTab = MainVaultTab | ForensicVaultTab;

export function resolveValvZone(tab: VaultTab): ValvZone {
  if (isKunskapVaultTab(tab)) return 'kunskap';
  if (isForensicVaultTab(tab)) return 'forensik';
  if ((EXPORTERA_VAULT_TAB_IDS as readonly string[]).includes(tab)) return 'exportera';
  if ((ANALYSERA_VAULT_TAB_IDS as readonly string[]).includes(tab)) return 'analysera';
  return 'samla';
}

export function isSamlaVaultTab(tab: VaultTab): tab is SamlaVaultTab {
  return (SAMLA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isAnalyseraVaultTab(tab: VaultTab): tab is AnalyseraVaultTab {
  return (ANALYSERA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isExporteraVaultTab(tab: VaultTab): tab is ExporteraVaultTab {
  return (EXPORTERA_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isKunskapVaultTab(tab: VaultTab): tab is KunskapVaultTab {
  return (KUNSKAP_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function isPansaretVaultTab(tab: VaultTab): tab is PansaretVaultTab {
  return (PANSARET_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

const ALL_VAULT_TABS = new Set<string>([...MAIN_VAULT_TAB_IDS, ...FORENSIC_VAULT_TAB_IDS]);

export function parseVaultTab(raw: string | null): VaultTab {
  if (raw && ALL_VAULT_TABS.has(raw)) return raw as VaultTab;
  return 'logga';
}

export function isForensicVaultTab(tab: VaultTab): tab is ForensicVaultTab {
  return (FORENSIC_VAULT_TAB_IDS as readonly string[]).includes(tab);
}

export function forensicVaultTabLabel(tab: ForensicVaultTab): string {
  const labels: Record<ForensicVaultTab, string> = {
    hamn_analys: 'Hamn · Analys',
    speglar_fordjupat: 'Speglar · Fördjupat',
    dagbok_arkiv: 'Dagbok · Arkiv',
    familjen_monster: 'Familjen · Mönster',
    arbetsliv_franvaro: 'Arbetsliv · Frånvaro',
    arbetsliv_lon: 'Arbetsliv · Lön',
  };
  return labels[tab];
}

export const VAULT_TAB_ICONS = {
  kunskapsbank: BookOpen,
  aktorskarta: Users,
} as const;
</file>

<file path=".context/locked-ux-features.md">
# Locked UX Features (låsta — får inte tas bort)

**Status:** Låst 2026-05-23. Ändring kräver explicit produktbeslut i commit/PR.

Dessa är **inte** Sacred Features i säkerhetslagret, men de är **låsta produktflöden** för trygg hamn (Barnen) och Pansaret (Valv). Agent och refaktor får inte ta bort, döpa om eller gömma dem utan att uppdatera denna fil och smoke.

---

## 1. Barnfokus-frågor (Familjen / Barnen — ev. «Middagsfrågan»)

| | |
|---|---|
| **Route** | `/familjen` → `BarnensPage` |
| **Syfte** | Roterande frågor (roligt, kunskap, knas, lära känna, utveckling, valv-bank) → minneslista |
| **Kod** | `BarnfokusFraganPanel.tsx`, `barnfokusQuestionForToday`, `BARNFOKUS_QUESTIONS`, `category: 'barnfokus'` |
| **Spec** | `docs/design/FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md` |
| **Krav** | Knapp **Spara till {barn}s logg**; **Annan fråga**; optimistisk minneslista; **inte** enbart middag-rubrik |
| **Smoke** | `npm run smoke:locked-ux` · manuell #19 |

---

## 2. Pansaret — Mönster & Orkester (Valv-baksida)

| | |
|---|---|
| **Route** | `/dagbok?tab=bevis&vaultTab=…` → `VaultPage` (PIN) |
| **Zoner** | **Samla** · **Analysera** · **Kunskap** · **Exportera** · **Forensik** — [`VALV-HUBB-SPEC.md`](../docs/design/VALV-HUBB-SPEC.md) |
| **Flikar** | **Arkiv** · **Triage** · **Mönster** · **Orkester** · **Dossier** · **Kunskapsbank** · **Aktörskarta** |
| **Mönster** | `VaultMonsterPanel` + `buildVaultFrequencyReport` (deterministisk regex, ingen LLM-sanning) |
| **Orkester** | `VaultOrkesterPanel` + `PRODUCT_AGENTS` + SMS-tråd → `analyzeMessage` |
| **Kunskapsbank** | `VaultKunskapsbankPanel` — `KunskapPage` + `FamiljenKunskapHubTab` (U1 silos) |
| **Aktörskarta (G9)** | `VaultAktorskartaPanel` + `EntityAddForm` + `addEntityProfile` — manuella personer, append-only metadata för agenter (ej RAG, ej publik meny) |
| **Smoke** | `npm run smoke:locked-ux` · `npm run smoke:entities` · manuell #20 i `docs/SMOKE_CHECKLIST.md` |

---

## 3. Planering + Projekt (design låst — hybrid)

| | |
|---|---|
| **Beslut** | [`docs/design/PLANERING-PROJEKT-HYBRID.md`](../docs/design/PLANERING-PROJEKT-HYBRID.md) |
| **Handling (fast)** | P3 Kanban ATT GÖRA · VÄNTAR · KLART — `/planering` |
| **Projekt (flex)** | Lista, anteckning, bild, egna planeringar — `/projekt` |
| **Widget** | v2 [`galleri/widget/v2/W1-kompakt-projekt.png`](../docs/design/galleri/widget/v2/W1-kompakt-projekt.png) |
| **Spec** | `PROJEKT-SPEC.md`, `PLANERING-P3-KANBAN-SPEC.md`, `WIDGET-BAR-SPEC.md` |
| **Smoke** | Hybrid-spec + kanon-PNG finns |

---

## 4. Planeringssidan (äldre register — se §3 hybrid)

| | |
|---|---|
| **Route (plan)** | `/planering` |
| **Spec** | `docs/design/PLANERINGSSIDA-SPEC.md`, mockups `docs/design/planering/` |
| **Krav** | P1–P4 + Projekt; e-postregler `planning_email_rules`; **inte** ex-brus hit |
| **Smoke** | Spec-fil + nyckelsträngar i `smoke_locked_ux.mjs` |

---

## 5. Fyren Edge — widget + tyst inspelning (design låst)

| | |
|---|---|
| **Spec** | `docs/design/WIDGET-BAR-SPEC.md`, `docs/design/HOMESCREEN-WIDGETS-SPEC.md`, `docs/design/ANDROID-WIDGETS-SPEC.md` |
| **Kod** | `FyrenWidgetBar.tsx`, `/widget/*`, `android/…/widgets/*`, `ingestWidgetRecording` |
| **Krav** | WH1: datumstämpel, AI-titel, WORM, sammanfattning i `truth`, ljudfil `evidenceUrl`; **ingen synlig REC** |
| **Data** | `reality_vault` WORM, `category: tyst_inspelning` |
| **Smoke** | Spec-fil + nyckelsträngar |

---

## 6. Sidomeny / hamburger (design låst — Vardag + Valv)

| | |
|---|---|
| **Kanonbild** | `docs/design/references/MENU-DRAWER-KANON.png` |
| **Spec** | `docs/design/references/MENU-DRAWER-KANON.md` |
| **Sektioner** | **Vardag** (publikt) · **Valv** (endast efter PIN/gate på Valv-route) |
| **Kod** | `navTruth.ts`, `NavigationDrawer.tsx`, `DrawerModeToggle.tsx` |
| **Krav** | Skymningsbakgrund; aktiv rad **guld**; **ingen** Valv-växlare/snabbchips i publikt läge |
| **Smoke** | Kanonfil + spec + `DRAWER_VARDAG_ITEMS` / `DRAWER_VALV_ENTRIES` + `isInValvDrawerContext` |

---

## 7. Barnporten — barnens hub (design låst)

| | |
|---|---|
| **Route (barn)** | `/barnporten` (PWA) · **förälder** `/familjen?tab=barnporten` |
| **Spec** | `docs/design/BARNPORTEN-SPEC.md`, infografik `docs/design/barnporten/infographic.html` |
| **Orkester** | `src/modules/barnporten/constants/barnportenAgents.ts` — **egen** barn-Orkester (skild från Valv-Orkester) |
| **Valv** | Endast HITL `promoteChildLogToVault` — **aldrig** auto från privat barnlogg |
| **Widget** | CB1–CB4 (barn); **inte** samma som förälder W1 |
| **Smoke** | Spec + `barnportenAgents.ts` + mockup-mapp |

### 7b. Inkorg → Valv-bro (HITL — **låst 2026-05-29**)

| | |
|---|---|
| **Kanon UI** | [`docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png`](../docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png) |
| **Route (förälder)** | `/familjen?tab=barnporten` → `BarnportenInboxPanel` |
| **Flöde** | Barnmeddelande i inkorg → vuxen granskar → explicit godkännande → `reality_vault` WORM |
| **Kod** | `BarnportenInboxPanel.tsx` · `SaveAsEvidencePrompt.tsx` · `buildVaultPayloadFromChildLog` (`sourceRef`) |
| **HITL** | **Human-In-The-Loop** — inget sparas automatiskt; vuxen trycker **Spara som bevis** / **Flytta till Valv (HITL)** |
| **Tidsstämpel** | `saveVaultLog` → Firestore `serverTimestamp()` → Valv visar **SERVER-TIDSSTÄMPEL** |
| **Efter spar** | Länk **Granska i Valv** / **Öppna Bevis (Hjärtat)** → `/dagbok?tab=bevis` |
| **Tagline (mål-UI)** | *Skapa trygghet. Bygg tillit.* · *Från inkorg till Valv – för framtiden.* |
| **Status (mål-UI)** | *Klar för långtidslagring* · HITL-badge med sköld |

**Får inte:** auto-promote från `private_child` / *Bara för mig*; ta bort HITL-steg; spara till Valv utan `sourceRef: children_logs/{id}`; ta bort inkorg-panelen eller mockup-kanon.

---

## 8. Arbetsliv — modulhub (låst)

| | |
|---|---|
| **Route** | `/arbetsliv` · redirect `/stampla` → `?tab=stampla` |
| **Kod** | `src/modules/arbetsliv/components/ArbetslivHubPage.tsx` |
| **Publikt** | Stämpel · Tid & flex · Logg |
| **Valv-menyn** | Frånvaro · Lön & spec → `vaultTab=arbetsliv_*` |
| **Vardagen** | `/vardagen?tab=ekonomi` = veckopeng/matlåda |
| **Eval** | `docs/evaluations/2026-05-25-arbetsliv-hub.md` |
| **Smoke** | `npm run smoke:arbetsliv` |

**Får inte:** ta bort menyrad Arbetsliv eller stämpel-hub utan produktbeslut.

---

## 8b. Trygg Hamn — snabb ingång vs Valv (**godkänt 2026-05-29**)

| | |
|---|---|
| **Snabb** | `/hamn` — `BiffPublicPanel` (Grey Rock), Speglar-länk, utan PIN |
| **Djup** | Valv → Forensik → **Hamn · Analys** (`hamn_analys`) — triage, bevis, HITL |
| **Redirect** | `/hamn?tab=analys` → `/dagbok?tab=bevis&vaultTab=hamn_analys` |
| **Kanon** | [`docs/design/VALV-HUBB-SPEC.md`](../docs/design/VALV-HUBB-SPEC.md) |

**Får inte:** kräva Valv-PIN för första BIFF-svar eller ta bort `/hamn` från Vardag-drawer.

---

## 9. Valv-baksida — samlad PIN-vägg (2026-05-25)

| | |
|---|---|
| **Ingång** | Hamburgermeny → sektion **Valv** · `/dagbok?tab=bevis&vaultTab=…` |
| **Kunskap** | All kunskap (Vardagen, Familjen, Hem) → **Kunskapsbank** — **inte** publik `/vardagen?tab=kunskap` |
| **Forensic** | Hamn analys, Speglar fördjupat, Dagbok arkiv, Familjen mönster, Arbetsliv frånvaro/lön |
| **U1** | Kunskapsbank anropar `knowledgeVaultQuery` — **aldrig** cross-RAG till Valv/Barnen |
| **Kod** | `VaultPage.tsx`, `VaultKunskapsbankPanel.tsx`, `VaultForensicPanel.tsx`, `navTruth.ts` |

---

## 10. Produktikoner D1 · M2 (låst) · app-ikon upplåst

| ID | Plats | Fil | Status |
|----|-------|-----|--------|
| ~~**B1**~~ | App / favicon | `public/favicon.svg` | **Upplåst** — P1–P5 i `phone-icon-variants/PREVIEW.md` |
| **D1** | Header, dock, hero | `LivskompassMark.tsx` | LÅST |
| **M2** | Kompis-avatar | `KompisMark.tsx` | LÅST |

| | |
|---|---|
| **Register** | `.context/locked-icons.md` · stil: `docs/design/ICON-STYLE-GUIDE.md` |
| **App-ikon** | `docs/design/themes/phone-icon-variants/PREVIEW.md` · `npm run android:icons:phone` |
| **Smoke** | `npm run smoke:locked-icons` |

**Får inte:** Lucide-kompass i Kompis, minimal linje-D1, eller Vite-lila favicon utan beslut.

---

## Verifiering

```bash
npm run smoke:locked-ux
npm run smoke:locked-icons
npm run smoke:arbetsliv
```

Vid refaktor av `VaultPage`, `BarnensPage`, eller borttagning av specs ovan: kör smoke innan merge.
</file>

<file path="src/modules/evidence/vault/components/VaultEntryForm.tsx">
import { useCallback, useState } from 'react';
import { ImagePlus, Loader2, Mic, MicOff, Plus } from 'lucide-react';
import { uploadVaultEvidence } from '../../../core/firebase/storage';
import { useSpeechToText } from '../../../core/hooks/useSpeechToText';
import { shouldSuggestVaultPatternScan } from '../../../core/triggers/valvHandoff';
import { BODY_SIGNALS, SHIELD_STEPS, VAULT_ENTRY_MODES } from '../constants/vaultEntry';
import type { VaultEntryType, VaultLogInput } from '../types/vaultEntry';
import { HandoffBox } from '../../../diary/diary/components/HandoffBox';
import { shouldShowValvHandoff } from '../../../core/triggers/valvHandoff';
import { OfflineWriteBlockedError } from '../../../core/firebase/offlineWritePolicy';
import { VaultPatternHandoff } from './VaultPatternHandoff';
import { parseSmsThreadToTwoColumn } from '../utils/smsThreadParse';

type VaultEntryFormProps = {
  userId: string;
  saving: boolean;
  onSave: (input: VaultLogInput) => Promise<void>;
};

export function VaultEntryForm({ userId, saving, onSave }: VaultEntryFormProps) {
  const [mode, setMode] = useState<VaultEntryType>('simple');
  const [category, setCategory] = useState('');
  const [truth, setTruth] = useState('');
  const [theirVersion, setTheirVersion] = useState('');
  const [myReality, setMyReality] = useState('');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [shieldStep, setShieldStep] = useState(0);
  const [shieldWhat, setShieldWhat] = useState('');
  const [shieldFeeling, setShieldFeeling] = useState('');
  const [shieldBoundary, setShieldBoundary] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [smsThreadPaste, setSmsThreadPaste] = useState('');

  const appendVoice = useCallback(
    (chunk: string) => {
      if (!chunk) return;
      const line = `Röstmemo: ${chunk}`;
      setTruth((prev) => (prev.trim() ? `${prev.trim()}\n${line}` : line));
    },
    [],
  );

  const { supported, isListening, start, stop } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: appendVoice,
  });

  const resetForm = () => {
    setTruth('');
    setTheirVersion('');
    setMyReality('');
    setSelectedSignals([]);
    setShieldStep(0);
    setShieldWhat('');
    setShieldFeeling('');
    setShieldBoundary('');
    setPendingFile(null);
    setAttachError(null);
    setPinned(false);
  };

  const toggleSignal = (signal: string) => {
    setSelectedSignals((prev) =>
      prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal],
    );
  };

  const withEvidence = (payload: VaultLogInput, evidenceUrl?: string): VaultLogInput => {
    let next = evidenceUrl ? { ...payload, evidenceUrl } : payload;
    if (pinned) next = { ...next, pinned: true };
    return next;
  };

  const buildPayload = (evidenceUrl?: string): VaultLogInput | null => {
    const cat = category.trim() || 'allmänt';

    if (mode === 'simple') {
      if (!truth.trim() && !evidenceUrl) return null;
      return withEvidence(
        { action: 'bevis', category: cat, truth: truth.trim() || 'Bifogat bevis', entryType: 'simple' },
        evidenceUrl,
      );
    }

    if (mode === 'two_column') {
      if (!theirVersion.trim() && !myReality.trim() && !evidenceUrl) return null;
      const combined = `Hens version: ${theirVersion.trim() || '—'}\nMin verklighet: ${myReality.trim() || '—'}`;
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined,
          entryType: 'two_column',
          theirVersion: theirVersion.trim(),
          myReality: myReality.trim(),
        },
        evidenceUrl,
      );
    }

    if (mode === 'three_shield') {
      if (!shieldWhat.trim() || !shieldFeeling.trim() || !shieldBoundary.trim()) return null;
      const combined = `${shieldWhat.trim()} | ${shieldFeeling.trim()} | ${shieldBoundary.trim()}`;
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined,
          entryType: 'three_shield',
          shieldWhat: shieldWhat.trim(),
          shieldFeeling: shieldFeeling.trim(),
          shieldBoundary: shieldBoundary.trim(),
        },
        evidenceUrl,
      );
    }

    if (mode === 'body_signal') {
      if (selectedSignals.length === 0 && !truth.trim() && !evidenceUrl) return null;
      const note = truth.trim();
      const combined = [...selectedSignals, note].filter(Boolean).join(' — ');
      return withEvidence(
        {
          action: 'bevis',
          category: cat,
          truth: combined || selectedSignals.join(', ') || 'Magkänsel + bevis',
          entryType: 'body_signal',
          bodySignals: selectedSignals,
        },
        evidenceUrl,
      );
    }

    return null;
  };

  const handleSubmit = async () => {
    setAttachError(null);
    setUploading(true);
    try {
      let evidenceUrl: string | undefined;
      if (pendingFile) {
        evidenceUrl = await uploadVaultEvidence(userId, pendingFile);
      }
      const payload = buildPayload(evidenceUrl);
      if (!payload) return;
      await onSave(payload);
      resetForm();
    } catch (err) {
      if (err instanceof Error && err.message === 'vault-save-failed') {
        setAttachError('Kunde inte spara till valvet. Försök igen.');
      } else if (err instanceof OfflineWriteBlockedError) {
        setAttachError(err.message);
      } else {
        setAttachError('Kunde inte ladda upp bilaga. Försök igen.');
      }
    } finally {
      setUploading(false);
    }
  };

  const canSaveSimple = truth.trim().length > 0 || Boolean(pendingFile);
  const canSaveTwo = theirVersion.trim() || myReality.trim() || Boolean(pendingFile);
  const canSaveShield =
    shieldStep === 2 && shieldWhat.trim() && shieldFeeling.trim() && shieldBoundary.trim();
  const canSaveBody = selectedSignals.length > 0 || truth.trim() || Boolean(pendingFile);

  const canSave =
    mode === 'simple'
      ? canSaveSimple
      : mode === 'two_column'
        ? Boolean(canSaveTwo)
        : mode === 'three_shield'
          ? canSaveShield
          : canSaveBody;

  const busy = saving || uploading;
  const handoffText = [truth, theirVersion, myReality, shieldWhat].join(' ');
  const showPatternHandoff = shouldSuggestVaultPatternScan(handoffText);
  const showValvHandoff = shouldShowValvHandoff(handoffText);

  return (
    <div className="space-y-4">
      <label className="block text-xs text-text-muted">
        Typ av post
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as VaultEntryType);
            setShieldStep(0);
          }}
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
        >
          {VAULT_ENTRY_MODES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Kategori (valfritt)"
        className="input-glass rounded-xl px-3 py-2 w-full"
        list="vault-category-suggestions"
      />
      <datalist id="vault-category-suggestions">
        <option value="kommunikation" />
        <option value="vårdnad" />
        <option value="skola" />
        <option value="ekonomi" />
        <option value="allmänt" />
      </datalist>

      {showValvHandoff && <HandoffBox />}
      {showPatternHandoff && <VaultPatternHandoff />}

      {mode === 'simple' && (
        <textarea
          value={truth}
          onChange={(e) => setTruth(e.target.value)}
          placeholder="Sanning / bevis (fakta, datum, händelse)..."
          rows={4}
          className="input-glass rounded-xl px-3 py-2 resize-none w-full"
        />
      )}

      {mode === 'two_column' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border-subtle bg-surface/30 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
              Klistra hel sms-tråd
            </p>
            <textarea
              value={smsThreadPaste}
              onChange={(e) => setSmsThreadPaste(e.target.value)}
              placeholder="Klistra hela konversationen — rader med «Namn:» delas automatiskt"
              rows={3}
              className="input-glass w-full resize-none rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="btn-pill--ghost mt-2 text-xs"
              disabled={smsThreadPaste.trim().length < 20}
              onClick={() => {
                const parsed = parseSmsThreadToTwoColumn(smsThreadPaste);
                if (parsed) {
                  setTheirVersion(parsed.theirVersion);
                  setMyReality(parsed.myReality);
                  setSmsThreadPaste('');
                }
              }}
            >
              Dela i två kolumner
            </button>
          </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Hens version</p>
            <textarea
              value={theirVersion}
              onChange={(e) => setTheirVersion(e.target.value)}
              placeholder="Agerande / påstående..."
              rows={4}
              className="input-glass rounded-xl px-3 py-2 resize-none w-full"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Min verklighet</p>
            <textarea
              value={myReality}
              onChange={(e) => setMyReality(e.target.value)}
              placeholder="Fakta jag dokumenterar..."
              rows={4}
              className="input-glass rounded-xl px-3 py-2 resize-none w-full"
            />
          </div>
        </div>
        </div>
      )}

      {mode === 'three_shield' && (
        <div className="space-y-3">
          {SHIELD_STEPS.map((step, idx) => {
            if (idx !== shieldStep) return null;
            const value =
              idx === 0 ? shieldWhat : idx === 1 ? shieldFeeling : shieldBoundary;
            const setValue =
              idx === 0 ? setShieldWhat : idx === 1 ? setShieldFeeling : setShieldBoundary;
            return (
              <div key={step.key}>
                <p className="mb-2 text-xs uppercase tracking-widest text-accent">
                  Steg {idx + 1} — {step.label}
                </p>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={step.placeholder}
                  rows={3}
                  className="input-glass rounded-xl px-3 py-2 resize-none w-full"
                />
                <div className="mt-2 flex gap-2">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => setShieldStep(idx - 1)}
                      className="btn-pill--ghost"
                    >
                      Tillbaka
                    </button>
                  )}
                  {idx < 2 ? (
                    <button
                      type="button"
                      disabled={!value.trim()}
                      onClick={() => setShieldStep(idx + 1)}
                      className="btn-pill--secondary disabled:opacity-50"
                    >
                      Fortsätt
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'body_signal' && (
        <div className="space-y-3">
          <label className="block text-xs text-text-muted">
            Magkänsel — lägg till signal
            <select
              className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) toggleSignal(v);
              }}
            >
              <option value="">Välj signal…</option>
              {BODY_SIGNALS.filter((s) => !selectedSignals.includes(s)).map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
          {selectedSignals.length > 0 && (
            <p className="text-xs text-text-dim">
              Valda: {selectedSignals.join(', ')}{' '}
              <button
                type="button"
                className="text-accent/80 underline"
                onClick={() => setSelectedSignals([])}
              >
                Rensa
              </button>
            </p>
          )}
          <textarea
            value={truth}
            onChange={(e) => setTruth(e.target.value)}
            placeholder="Valfri kort notering..."
            rows={2}
            className="input-glass rounded-xl px-3 py-2 resize-none w-full"
          />
        </div>
      )}

      <div className="glass-card space-y-2 p-3">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Bifoga bevis</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn-pill--ghost cursor-pointer">
            <ImagePlus className="h-4 w-4" />
            Skärmdump
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {supported && (
            <button
              type="button"
              onClick={isListening ? stop : start}
              className="btn-pill--ghost"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              Röstmemo
            </button>
          )}
        </div>
        {pendingFile && (
          <p className="text-xs text-text-muted">Vald fil: {pendingFile.name}</p>
        )}
        {attachError && <p className="text-xs text-danger">{attachError}</p>}
      </div>

      <label className="flex items-center gap-2 text-xs text-text-dim">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          className="rounded border-border-strong"
        />
        Sanningens Ankare — fäst post (read-only i Morgonkompassen)
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy || !canSave}
        className="btn-pill--success disabled:opacity-50 flex items-center gap-2"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Spara bevis
      </button>
    </div>
  );
}
</file>

<file path="src/modules/evidence/vault/components/VaultPage.tsx">
import { Lock, ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { PinGate } from '../../../core/ui/PinGate';
import { TabBar } from '../../../core/ui/TabBar';
import {
  getAnalyseraVaultTabBarItems,
  getForensicVaultTabBarItems,
  getKunskapVaultTabBarItems,
  getSamlaVaultTabBarItems,
  getVaultZoneTabBarItems,
} from '../../../core/navigation/tabRegistry';
import { useStore } from '../../../core/store';
import { hasVaultGate, clearVaultGate } from '../../../core/auth/sessionService';
import { saveVaultLog, getVaultLogs } from '../../../core/firebase/firestore';
import { OfflineWriteBlockedError } from '../../../core/firebase/offlineWritePolicy';
import type { VaultLog } from '../../../core/types/firestore';
import { VaultLogList } from './VaultLogList';
import { VaultSamlaHub } from './VaultSamlaHub';
import { ValvChatPanel } from '../../../evidence/vaultChat';
import { DossierPage } from '../dossier';
import { VaultMonsterPanel } from './VaultMonsterPanel';
import { VaultOrkesterPanel } from './VaultOrkesterPanel';
import { PansaretHeader } from './PansaretHeader';
import { VaultKunskapsbankPanel } from '../../knowledge/components/VaultKunskapsbankPanel';
import { VaultAktorskartaPanel } from '../../knowledge/components/VaultAktorskartaPanel';
import { VaultForensicPanel } from './VaultForensicPanel';
import { VaultValvBreadcrumb } from './VaultValvBreadcrumb';
import type { VaultLogInput } from '../types/vaultEntry';
import {
  KUNSKAP_VAULT_TAB,
  type AnalyseraVaultTab,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type SamlaVaultTab,
  type ValvZone,
  type VaultTab,
  isAnalyseraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isSamlaVaultTab,
  resolveValvZone,
} from '../utils/vaultTabs';

import { hasPinConfigured, setupPin, verifyPin } from '../../../core/security/vaultPin';

export type { VaultTab, MainVaultTab, ValvZone } from '../utils/vaultTabs';
export { parseVaultTab } from '../utils/vaultTabs';

type VaultPageProps = {
  embedded?: boolean;
  onClose?: () => void;
  initialVaultTab?: VaultTab;
  onVaultTabChange?: (tab: VaultTab) => void;
};

export function VaultPage({
  embedded = false,
  onClose,
  initialVaultTab = 'logga',
  onVaultTabChange,
}: VaultPageProps) {
  const navigate = useNavigate();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const user = useStore((s) => s.user);
  const [pin, setPin] = useState('');
  const [isSetup, setIsSetup] = useState(!hasPinConfigured());
  const [confirmPin, setConfirmPin] = useState('');
  const [logs, setLogs] = useState<(VaultLog & { id: string })[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultTab, setVaultTabState] = useState<VaultTab>(initialVaultTab);
  const [highlightLogId, setHighlightLogId] = useState<string | null>(null);
  const gateOk = hasVaultGate();
  const valvZone = resolveValvZone(vaultTab);
  const samlaTab: SamlaVaultTab = isSamlaVaultTab(vaultTab) ? vaultTab : 'logga';
  const analyseraTab: AnalyseraVaultTab = isAnalyseraVaultTab(vaultTab) ? vaultTab : 'monster';
  const kunskapTab: KunskapVaultTab = isKunskapVaultTab(vaultTab) ? vaultTab : KUNSKAP_VAULT_TAB;
  const forensicTab: ForensicVaultTab = isForensicVaultTab(vaultTab) ? vaultTab : 'hamn_analys';

  const setVaultTab = (next: VaultTab) => {
    setVaultTabState(next);
    onVaultTabChange?.(next);
  };

  useEffect(() => {
    setVaultTabState(initialVaultTab);
  }, [initialVaultTab]);

  const handleCitationClick = (docId: string) => {
    setHighlightLogId(docId);
    setVaultTab('logga');
  };

  const handleBevisConfirmed = async (docId: string) => {
    setHighlightLogId(docId);
    setVaultTab('logga');
    if (user) {
      try {
        const updated = await getVaultLogs(user.uid);
        setLogs(updated);
      } catch {
        /* list refresh best-effort */
      }
    }
  };

  const handleValvZoneChange = (zone: ValvZone) => {
    if (zone === 'samla') setVaultTab('logga');
    else if (zone === 'analysera') setVaultTab('monster');
    else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
    else if (zone === 'exportera') setVaultTab('dossier');
    else setVaultTab('hamn_analys');
  };

  useEffect(() => {
    if (!isVaultUnlocked) {
      setVaultTabState('logga');
    }
  }, [isVaultUnlocked]);

  useEffect(() => {
    if (isVaultUnlocked && user) {
      setLogsLoading(true);
      getVaultLogs(user.uid)
        .then(setLogs)
        .catch(() => setError('Kunde inte hämta loggar.'))
        .finally(() => setLogsLoading(false));
    }
  }, [isVaultUnlocked, user]);

  const handleUnlock = () => {
    if (!user) {
      setError('Väntar på inloggning — försök igen om ett ögonblick.');
      return;
    }
    if (isSetup) {
      if (pin.length < 4) {
        setError('PIN måste vara minst 4 tecken.');
        return;
      }
      if (pin !== confirmPin) {
        setError('PIN matchar inte.');
        return;
      }
      setupPin(pin);
      setIsSetup(false);
      setVaultUnlocked(true);
      setPin('');
      setConfirmPin('');
      setError(null);
      return;
    }
    if (verifyPin(pin)) {
      setVaultUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const handleSaveLog = async (input: VaultLogInput) => {
    if (!user) {
      setError('Inte inloggad.');
      throw new Error('vault-save-failed');
    }
    setSaving(true);
    setError(null);
    try {
      await saveVaultLog(user.uid, input);
      try {
        const updated = await getVaultLogs(user.uid);
        setLogs(updated);
      } catch {
        /* save lyckades — lista uppdateras vid nästa laddning */
      }
    } catch (err) {
      setError(
        err instanceof OfflineWriteBlockedError
          ? err.message
          : 'Kunde inte spara till valvet.',
      );
      throw new Error('vault-save-failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseToLayer1 = () => {
    setVaultTab('logga');
    setVaultUnlocked(false);
    clearVaultGate();
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/dagbok');
    }
  };

  if (!embedded && !gateOk) {
    return (
      <BentoCard
        title="Verklighetsvalvet"
        description="Sacred Feature — long-press krävs"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <p className="text-sm text-text-dim">
          Håll Dagbok-ikonen i bottenmenyn i 3 sekunder (Fyren) för dold åtkomst till bevisvalvet.
          Kort tryck räcker inte.
        </p>
      </BentoCard>
    );
  }

  if (!isVaultUnlocked) {
    return (
      <BentoCard
        title={embedded ? 'Valv · Baksida' : 'Verklighetsvalvet'}
        description="Ange PIN"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <PinGate
          description={
            isSetup
              ? 'Skapa din PIN (sparas lokalt, aldrig hårdkodad).'
              : 'Ange PIN för att låsa upp Valv-baksidan.'
          }
          pin={pin}
          confirmPin={confirmPin}
          setupMode={isSetup}
          error={error}
          onPinChange={setPin}
          onConfirmPinChange={setConfirmPin}
          onSubmit={handleUnlock}
        />
      </BentoCard>
    );
  }

  if (!user) {
    return (
      <BentoCard title="Verklighetsvalvet" icon={<Lock className="h-4 w-4" />}>
        <p className="text-sm text-text-dim">Ansluter till valvet…</p>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard title={embedded ? 'Valv · Baksida' : 'Verklighetsvalvet'} icon={<Lock className="h-4 w-4" />}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <VaultValvBreadcrumb zone={valvZone} vaultTab={vaultTab} />
          <button
            type="button"
            onClick={handleCloseToLayer1}
            className="btn-pill--ghost shrink-0 flex items-center gap-1"
            title="Stäng valv — tillbaka till vardag"
          >
            <X className="h-3 w-3" /> Stäng
          </button>
        </div>
        <p className="mb-3 text-sm text-text-muted">
          Lager 2 — samla bevis, analysera mönster, kunskap och export. Välj zon, sedan flik.
        </p>
        <TabBar<ValvZone>
          size="compact"
          tabs={getVaultZoneTabBarItems()}
          active={valvZone}
          onChange={handleValvZoneChange}
        />
        {valvZone === 'samla' && (
          <div className="mt-3">
            <TabBar<SamlaVaultTab>
              size="compact"
              tabs={getSamlaVaultTabBarItems()}
              active={samlaTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'analysera' && (
          <div className="mt-3">
            <TabBar<AnalyseraVaultTab>
              size="compact"
              tabs={getAnalyseraVaultTabBarItems()}
              active={analyseraTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'forensik' && (
          <div className="mt-3">
            <TabBar<ForensicVaultTab>
              size="compact"
              tabs={getForensicVaultTabBarItems()}
              active={forensicTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
        {valvZone === 'kunskap' && (
          <div className="mt-3">
            <TabBar<KunskapVaultTab>
              size="compact"
              tabs={getKunskapVaultTabBarItems()}
              active={kunskapTab}
              onChange={(id) => setVaultTab(id)}
            />
          </div>
        )}
      </BentoCard>

      {valvZone === 'forensik' && <VaultForensicPanel tab={forensicTab} />}

      {valvZone === 'samla' && vaultTab === 'logga' && (
        <>
          <VaultSamlaHub
            userId={user.uid}
            saving={saving}
            saveError={error}
            onSave={handleSaveLog}
            onBevisConfirmed={(docId) => void handleBevisConfirmed(docId)}
          />
          <VaultLogList logs={logs} loading={logsLoading} highlightLogId={highlightLogId} />
        </>
      )}

      {valvZone === 'samla' && vaultTab === 'sok' && (
        <ValvChatPanel
          active={isVaultUnlocked && vaultTab === 'sok'}
          onCitationClick={handleCitationClick}
        />
      )}

      {valvZone === 'analysera' && vaultTab === 'monster' && (
        <>
          <PansaretHeader />
          <VaultMonsterPanel logs={logs} />
        </>
      )}

      {valvZone === 'analysera' && vaultTab === 'orkester' && <VaultOrkesterPanel logs={logs} />}

      {valvZone === 'exportera' && vaultTab === 'dossier' && <DossierPage embedded />}

      {valvZone === 'kunskap' && kunskapTab === KUNSKAP_VAULT_TAB && <VaultKunskapsbankPanel />}
      {valvZone === 'kunskap' && kunskapTab === 'aktorskarta' && <VaultAktorskartaPanel />}
    </div>
  );
}
</file>

</files>
