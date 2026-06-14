# MåBra 3.0 — Kat 8 Recovery Expert Specification

**Datum:** 2026-06-14  
**Status:** Expertanalys — **dokumentation only** (ingen produktionskod)  
**Scope:** Djupa lager i återhämtningsmodulen — SOS, 12-steg WORM, verklighetskontroll, `recovery_profile`  
**Känslighet:** **L4 — Kritisk**  
**Kanon:** [`MABRA-3.0-MASTER-SPEC.md`](./MABRA-3.0-MASTER-SPEC.md) · [`mabra-3.0-rules-audit.md`](../../evaluations/mabra-3.0-rules-audit.md) · [`.context/security.md`](../../../.context/security.md)

---

## 1. Syfte & gränser

Denna spec utformar **kliniskt inspirerade** men **icke-kliniska** verktyg för drogfrihet och återhämtning. Allt följer:

| Princip | Tillämpning Kat 8 |
|---------|-------------------|
| **Obsidian Calm** | Ett steg i taget · dämpad typografi · inga streaks/XP |
| **Tre silos (U1)** | Recovery-data skrivs **Vit/Barnen-lager** — **aldrig** auto till `kampspar` / `reality_vault` |
| **Layered Defense** | Akut = Zero Footprint · persistent = WORM eller isolerad mutable profil |
| **Ingen extern API** | Statisk bank, lokala timers, befintliga övningar — **ingen** OAuth, kalender, sponsor-LLM |
| **Valv** | `reality_vault` **endast** efter explicit HITL — **inte** default för paranoia-/urge-loggar |

**Inte:** beroendevård, diagnos, krisbehandling, ersättning för 113/jourlinje.

**Befintligt P0 (bevaras):** `drogfrihetCounter.ts` (localStorage), `DrogfrihetHubPage`, `MabraRecoveryBanner` på `/mabra`.

---

## 2. Modulöversikt

```mermaid
flowchart TB
  subgraph ui [UI — Obsidian Calm]
    BAN[MabraRecoveryBanner /mabra]
    HUB[DrogfrihetHubPage /familjen]
    SOS[RecoveryUrgeSosModule]
    STEPS[RecoveryTwelveStepJournal]
    RC[RecoveryRealityCheckForm]
  end

  subgraph session [Zero Footprint — akut]
    RAM[sessionStorage / RAM timer]
  end

  subgraph vit [Vit silo — WORM]
    VE[vit_entries projectId recovery]
    EM[emotional_memory valfritt]
  end

  subgraph mutable [Mutable L4 profil]
    RP[recovery_profile / uid]
  end

  subgraph forbidden [FÖRBJUDET auto]
    RV[reality_vault]
    RAG[kampspar / kb_docs]
  end

  BAN --> HUB
  HUB --> SOS
  HUB --> STEPS
  HUB --> RC
  SOS --> RAM
  SOS -. valfri explicit save .-> VE
  STEPS --> VE
  RC --> VE
  RC -. alternativ .-> EM
  RP --> SOS
  RP --> STEPS
  VE -. HITL only .-> RV
  VE -x RAG
```

---

## 3. SOS / Urge Surfing-modul

### 3.1 Klinisk avsikt (produkt, inte vård)

**Urge surfing:** användaren rider ut ett craving/sug (~90 s–5 min) utan att agera. **SOS:** snabb väg till kropp, timer och förankring — **ingen** kognitiv belastning, **ingen** skuld.

### 3.2 Komponent & route (planerad)

| Artefakt | Föreslagen sökväg |
|----------|-------------------|
| **Komponent** | `RecoveryUrgeSosModule.tsx` |
| **Route primär** | `/mabra/recovery/sos` (akut overlay, full viewport) |
| **Route sekundär** | `/familjen?tab=drogfrihet&drogfrihetTab=sos` (samma komponent, embedded) |
| **Ingång** | Fast knapp **SOS — sug nu** i Drogfrihet-hub + diskret länk från `MabraRecoveryBanner` |

**Låsning:** SOS får **prioriterad z-index** (L3 overlay enligt M3.0 §6.1) — täcker hub men **ingen** drawer/valv-promote.

### 3.3 UI-flöde (strikt UI-silo)

```text
[Fas 0 — 0 knapptryck]
  Stor SOS-knapp · statisk copy: "Det här känns jobbigt. Du behöver inte agera nu."

[Fas 1 — Timer · Zero Footprint]
  Välj: 90 s | 3 min | 5 min  (default 90 s)
  Visuell timer (cirkel/bar) · ingen ljudkrav · pausbar
  Copy: "Suget stiger och faller. Du surfar bara."

[Fas 2 — Förankring · offline]
  Tab-växling (max 2 val synliga):
    A) Andning 4-7-8  (återanvänd logik från BreathingExercise — **ingen** ny callable)
    B) 5-4-3-2-1      (återanvänd GroundingExercise — **ingen** ny callable)
  **FÖRBJUDET i Fas 1–2:** RAG · Valv · Dagbok · LLM · nätverksanrop

[Fas 3 — Efter timer (valfritt)]
  En rad: "Hur känns det nu?" · skala 1–5 (lokal state)
  Knappar:
    - "Klart" → rensa session, tillbaka
    - "Spara anteckning" → öppna minimal textarea → explicit WORM (§3.5)
  Statisk kris-rad: "Akut fara: 113"
```

### 3.4 Tillstånd & lagring

| Data | Lagring | Rensa |
|------|---------|-------|
| Timer rester, fas, skala | `sessionStorage` key `livskompassen_recovery_sos_session` | Tab close / Device Clear / SOS "Klart" |
| Andnings-/grounding-progress | RAM / befintliga övningskomponenter | Unmount SOS |
| **Ingen** auto-persist | — | — |

**Device Clear-gap (känd):** utöka `clearDeviceSession` + logout med prefix `livskompassen_recovery_sos_*` vid implementation (PMIR).

### 3.5 Valfri WORM efter SOS (inte akut)

Endast om användaren trycker **Spara anteckning**:

| Fält | Värde |
|------|-------|
| Collection | `vit_entries/{docId}` |
| `projectId` | `recovery` *(kräver rules-utökning — §7)* |
| `kind` | `memory` |
| `content_class` | `REFLECTION` |
| `bankId` | `DF-SOS-01` *(ny KEEP — kurator)* |
| `inputMode` | `recovery_sos` *(rules-utökning)* |
| `zone` | `recovery` *(rules-utökning)* |
| `responseText` | Fri text ≤500 tecken + valfri intensitet i text |
| Auth | `isOwnerCreateSensitive()` |

**MUST NOT:** spara automatiskt när timern slutar · indexera i Kunskap · föreslå Valv.

### 3.6 Obsidian Calm — visuell spec

- Bakgrund: `bg-gradient-to-b from-surface to-surface-2`
- Timer: `text-accent` · `font-display` · `tabular-nums`
- Borders: `border-[0.5px] border-border`
- Inga röda pulserande alarm — `text-danger` endast på 113-rad
- Eyebrow: `font-display-serif uppercase tracking-[0.22em] text-text-dim` — "Akut stöd"

### 3.7 `recovery_profile`-koppling (pre-fill)

Vid SOS-start, **read-only** visning (om profil finns):

- `coreWhy` — en rad under timer: "Du valde nykterhet för att …"
- `triggerTags` — om användaren markerat utlösare, visa **max 1** relevant tagg som påminnelse (ej diagnostik)

---

## 4. 12-stegs WORM-journal

### 4.1 Avgränsning

**12-stegs-inspirerad** journal — **inte** AA varumärke, **inte** sponsor-LLM. Varje steg = banktext (KEEP) + användarens frivilliga svar → **append-only** `vit_entries`.

### 4.2 Innehållsbank (kurering krävs)

Nya KEEP-rader i [`Mabra-CONTENT-BANK.md`](./Mabra-CONTENT-BANK.md) — **`specialist-mabra-curator`**:

| bankId | Steg | lens | Exempel prompt (parafras) |
|--------|------|------|-----------------------------|
| `DF-STEP-01` | 1 | erkännande | "Vad är det svåraste att erkänna just nu — utan att fixa det?" |
| `DF-STEP-02` | 2 | hopp | "Vad skulle ge dig tillräckligt hopp för **ett** litet steg idag?" |
| `DF-STEP-03` | 3 | överlåtelse | "Vad kan du släppa kontrollen över idag — bara till i kväll?" |
| `DF-STEP-04` | 4 | inventering | "En sak du gjort som visar att du kan förändring — utan skam." |
| `DF-STEP-05` | 5 | delning | "Vem skulle du **kunna** vara ärlig mot — även om du inte gör det än?" |
| `DF-STEP-06` | 6 | beredskap | "Vad behöver du sluta göra **idag** för att skydda nykterheten?" |
| `DF-STEP-07` | 7 | ödmjukhet | "Var behöver du be om hjälp — ett ord räcker?" |
| `DF-STEP-08` | 8 | skadegörelse | "Finns en person du vill reparera relation med — **ett** steg?" |
| `DF-STEP-09` | 9 | gottgörelse | "Vilket **konkret** mikrosteg skulle vara gottgörelse — inte hela skulden?" |
| `DF-STEP-10` | 10 | inventering_2 | "Vilket mönster ser du hos dig själv — beskriv, döm inte?" |
| `DF-STEP-11` | 11 | kontakt | "Vad hjälper dig känna närvaro — utan substans?" |
| `DF-STEP-12` | 12 | service | "Hur kan du tjäna **din** nykterhet idag — ett litet sätt?" |

**content_class:** `REFLECTION` · **ingen** FACT · **ingen** ingest till Kunskap.

### 4.3 Komponent & presentation

| Artefakt | Föreslagen sökväg |
|----------|-------------------|
| **Komponent** | `RecoveryTwelveStepJournal.tsx` |
| **Route** | `/familjen?tab=drogfrihet&drogfrihetTab=steg` **eller** `/mabra/recovery/steps` |
| **Layout** | Steg-lista (1–12) · **ett steg expanded** · progressive disclosure |

**UI per steg:**

```text
┌─────────────────────────────────────────┐
│ STEG 4 · INVENTERING          [●○○…]     │  ← progress dots, not streak
│ font-display-serif eyebrow               │
│ Bank-prompt (text-accent)                │
│ ┌─────────────────────────────────────┐ │
│ │ textarea — draft i RAM/localStorage   │ │
│ │ tills explicit "Spara steg"           │ │
│ └─────────────────────────────────────┘ │
│ [Spara steg]  [Nästa utan spar]         │
│ "Sparat" = WORM — går inte att redigera │
└─────────────────────────────────────────┘
```

**Regler:**

- Max **ett** sparat svar per `(uid, stepNumber, dayKey)` — client guard + `cardDateKey` på write
- **Ingen** röd markering för "missade" steg
- Steg 4/8/9 (skuld/gottgörelse): extra disclaimer — "Juridik och vårdnadskonflikt → logistik i Hamn, inte skuld här"

### 4.4 Dataskrivning → `vit_entries` (WORM)

| Fält | Värde | Obligatorisk |
|------|-------|--------------|
| `userId` / `ownerId` | `auth.uid` | ja |
| `createdAt` | server timestamp | ja |
| `projectId` | `recovery` | ja |
| `kind` | `card` | ja |
| `content_class` | `REFLECTION` | ja |
| `bankId` | `DF-STEP-01` … `DF-STEP-12` | ja |
| `responseText` | Användarsvar ≤5000 | ja vid save |
| `cardDateKey` | `YYYY-MM-DD` | ja |
| `zone` | `recovery` | ja |
| `inputMode` | `recovery_twelve_step` | ja |

**Firestore rules (live krav):**

- Read/create: `isOwnerSensitive()` / `isOwnerCreateSensitive()` — se [`mabra-3.0-rules-audit.md`](../../evaluations/mabra-3.0-rules-audit.md) §4.2
- `update` / `delete`: `false`
- **Rules-gap idag:** `isValidKat7ProjectId()` tillåter **inte** `recovery` — PMIR måste utöka enum + `zone`/`inputMode` whitelist

**Helper (planerad):** `saveRecoveryVitEntry()` i `vitHubFirestore.ts` eller `recoveryFirestore.ts` — speglar `saveVitEntry` med fast `projectId: 'recovery'`.

### 4.5 Läsning & historik

- Lista: query `vit_entries` where `ownerId` + `projectId == recovery` + `bankId` prefix `DF-STEP-`
- UI: kronologisk lista per steg — **read-only** (WORM)
- **Ingen** export till Dossier default · Valv endast HITL med `sourceRef` till `vit_entries/{id}`

---

## 5. Verklighetskontroll (KBT Paranoia Tracker)

### 5.1 Klinisk avsikt (produkt)

Stödja **kognitiv omstrukturering** vid paranoid/ruminativ tanke under återhämtning (stress, sömnbrist, substansabstinens). **Inte** psykosdiagnos · **inte** "sanningen" om externa aktörer.

**Grey Rock-koppling:** formuleringar ska separera **observation** från **bevis** — alignerat med BIFF/Hamn men **lagras i Vit**, inte Hamn-coach.

### 5.2 Komponent

| Artefakt | Föreslagen sökväg |
|----------|-------------------|
| **Komponent** | `RecoveryRealityCheckForm.tsx` |
| **Route** | `/familjen?tab=drogfrihet&drogfrihetTab=verklighet` eller `/mabra/recovery/reality-check` |
| **Ingång** | Underflik "Verklighetskontroll" · **inte** på dashboard |

### 5.3 Formulär (ett steg i taget — Obsidian Calm)

| Steg | Fält | Max längd | Hjälpcopy |
|------|------|-----------|-----------|
| 1 | **Trigger** — "Vad hände precis?" | 300 | Situation, inte persondom |
| 2 | **Automatisk tanke** | 500 | "Jag tänker att …" |
| 3 | **Kropp** — intensitet 1–10 | int | Befintlig skala som `emotional_memory` |
| 4 | **Bevis för** | 500 | Fakta du **sett/hört** |
| 5 | **Bevis emot** | 500 | Alternativa förklaringar |
| 6 | **Balanserad tanke** | 500 | "En mer neutral formulering …" |
| 7 | **Intensitet efter** 1–10 | int | Valfri |

**Draft:** `sessionStorage` / localStorage draft key `livskompassen_recovery_reality_draft` tills **Spara**.

**FÖRBJUDET:** LLM som "bedömer" om tanke är sann · auto-write · cross-read journal/valv.

### 5.4 Datamapping — **Vit silo, inte Valv**

#### Primär (rekommenderad): `vit_entries`

| Fält | Värde |
|------|-------|
| `projectId` | `recovery` |
| `kind` | `memory` |
| `content_class` | `REFLECTION` |
| `bankId` | `DF-REALITY-01` *(ny KEEP)* |
| `inputMode` | `recovery_reality_check` |
| `zone` | `recovery` |
| `responseText` | Strukturerad text (mall nedan) ≤5000 |
| `cardDateKey` | idag |

**`responseText` mall (plain text WORM):**

```text
--- Recovery Reality Check ---
trigger: …
automatic_thought: …
intensity_before: N
evidence_for: …
evidence_against: …
balanced_thought: …
intensity_after: N
```

**Auth:** `isOwnerCreateSensitive()` — samma band som Kat 7 L3, Kat 8 L4.

#### Alternativ (vid behov av intensitetsindex): `emotional_memory`

| Fält | Värde |
|------|-------|
| `memoryType` | `reflection` |
| `content` | Samma strukturerade block som ovan |
| `intensity` | `intensity_after` (1–10) |

**Välj ett spår i implementation** — **inte** båda vid samma save (undvik dubbellagring).

#### `reality_vault` — **L4 STRICT**

| Tillåtet | Förbjudet |
|----------|-----------|
| Användaren explicit "Spara som bevis" via `SaveAsEvidencePrompt` med `sourceRef` → `vit_entries` eller `emotional_memory` | Auto-promote · inkast · DCAP klassificering av recovery-formulär som bevis |
| Vault-session + PIN | Paranoia-logg som default forensic truth |

**Motivering:** Paranoia-/craving-journal är **terapeutisk process**, inte vårdnadskonflikt-bevis. Valv-reserveras för HITL-export när användaren **själv** beslutar.

### 5.5 Obsidian Calm UX

- En fråga per vy (wizard) — `CognitiveLoadStrip` mönster
- Inga "rätt/fel"-badges
- Efter save: lågaffektiv bekräftelse — "Sparat. Du kan läsa tillbaka under historik."

---

## 6. Integration med `recovery_profile`

### 6.1 Nuvarande schema (rules live)

```typescript
// recovery_profile/{uid} — mutable, isSensitiveAuth
{
  userId: string;
  ownerId: string;
  programType: 'twelve_step_inspired' | 'custom_abstinence' | 'other';
  startDateKey: string;        // YYYY-MM-DD
  shareWithCoach: boolean;     // default false (tvingas i rules)
  updatedAt: Timestamp;
}
```

Källa: [`mabra-3.0-rules-audit.md`](../../evaluations/mabra-3.0-rules-audit.md) §5.1 · [`firestore.rules`](../../../firestore.rules).

### 6.2 Utökad profil (P1 expert — kräver rules PMIR)

| Fält | Typ | Syfte | Max |
|------|-----|-------|-----|
| `coreWhy` | string | Kärn-"Varför" nykterhet | 500 tecken |
| `triggerTags` | string[] | Utlösare (HALT+, custom) | 8 taggar × 40 tecken |
| `supportContactHint` | string | Vem du kan nå (frivilligt namn, **inte** telefon om inte user vill) | 80 |
| `preferredGrounding` | enum | `breathing_478` \| `grounding_54321` \| `either` | — |
| `lastSosAt` | timestamp? | Senaste SOS (metadata, **ingen** innehållstext) | server/client |
| `twelveStepProgress` | map | `{ "1": "YYYY-MM-DD", … }` last completed dayKey per steg | 12 keys |

**FÖRBJUDET på profil:** fritext dagbok · `truth`/`action` · `sourceRef` · RAG-fält · barn/valv-korsreferenser.

### 6.3 Skriv-/läsregler

| Operation | Var | UX |
|-----------|-----|-----|
| **Varför + utlösare** | `recovery_profile` update | Wizard under Inställningar → Drogfrihet **eller** första gång i 12-steg |
| **startDateKey** | Dual-write: profil + `localStorage` counter | Behåll P0 counter tills migrering klar |
| **lastSosAt** | Profil update efter SOS Fas 3 "Klart" | Metadata only |
| **twelveStepProgress** | Profil merge efter WORM save | Client derived from `vit_entries` vid behov — profil är cache, WORM är sanning |

### 6.4 Module integration matrix

| Modul | Läser från profil | Skriver till profil |
|-------|-------------------|---------------------|
| SOS | `coreWhy`, `triggerTags`, `preferredGrounding` | `lastSosAt` |
| 12-steg journal | `twelveStepProgress` (valfri cache) | `twelveStepProgress` |
| Verklighetskontroll | `triggerTags` (förslag chip) | — |
| `MabraRecoveryBanner` | `coreWhy` (en rad, om satt) | — |
| Dagräknare P0 | `startDateKey` vid sync | `startDateKey` vid Inställningar save |

### 6.5 Rules-tillägg (skiss — ej implementerad)

Utöka `isValidRecoveryProfileCreate/Update` med `keys().hasOnly([..., 'coreWhy', 'triggerTags', ...])` + string/list validators. **Behåll** `shareWithCoach == false` tills coach-share PMIR.

---

## 7. Firestore & rules — samlad impact (PMIR)

| Collection | Ändring | Modul |
|------------|---------|-------|
| `vit_entries` | `projectId: 'recovery'` · `zone: 'recovery'` · `inputMode` enums | SOS, 12-steg, Verklighetskontroll |
| `recovery_profile` | Utökade profilfält §6.2 | Alla |
| `emotional_memory` | Oförändrad validator (alternativ spår RC) | Verklighetskontroll |
| `reality_vault` | **Ingen** auto-ändring | — |
| `WORM_COLLECTIONS_NEVER_PURGE` | `vit_entries` redan tillagd | retentionJob |

**Callable:** Ingen ny RAG-callable. Valfri framtida `recoveryCoach` — enbart statisk bank + kris 113-text (M3.0 § Kat 8).

---

## 8. Innehåll & kurering (U6)

| bankId-prefix | content_class | Kurator | Route |
|---------------|---------------|---------|-------|
| `DF-STEP-*` | REFLECTION | specialist-mabra-curator | 12-steg |
| `DF-SOS-*` | REFLECTION | specialist-mabra-curator | SOS save |
| `DF-REALITY-*` | REFLECTION | specialist-mabra-curator | Verklighetskontroll |
| `DF-REF-*` | REFLECTION | redan KEEP | Befintlig reflektion |

**Registrera i** [`INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md) före prod.

**MUST NOT:** FACT i Mabra-bank · ingest till `kampspar` · fjärde silo.

---

## 9. Navigationsplan (Obsidian Calm)

| Nivå | Element |
|------|---------|
| `/mabra` | `MabraRecoveryBanner` (live) → länk "Öppna återhämtning" |
| Drogfrihet hub | Ny underflik **SOS** + **12 steg** + **Verklighetskontroll** (utöka `DrogfrihetTab` union) |
| Akut | SOS full-screen — **alltid** ≤3 tap till timer |

**PMIR:** flytta fysisk route Familjen → `/mabra/recovery` — **inte** i denna fas.

---

## 10. Implementation-faser (dokumentation)

| Fas | Leverans | Gate |
|-----|----------|------|
| **Cat8-E1** | Innehållsbank DF-STEP/SOS/REALITY KEEP | `npm run smoke:innehall` |
| **Cat8-E2** | Rules utökning `projectId recovery` + profilfält | rules deploy + audit |
| **Cat8-E3** | SOS modul (Zero Footprint) | manuell akut-test |
| **Cat8-E4** | 12-steg WORM journal | WORM smoke |
| **Cat8-E5** | Verklighetskontroll wizard | L4 privacy review |
| **Cat8-E6** | `recovery_profile` klient + dual-write counter | PMIR |

Eval per fas: `docs/evaluations/YYYY-MM-DD-mabra-cat8-E*.md`.

---

## 11. Smoke & acceptanskriterier

| # | Kriterium |
|---|-----------|
| 1 | SOS fungerar **offline** (timer + grounding) |
| 2 | Ingen network call i SOS Fas 1–2 |
| 3 | WORM-save kräver explicit knapp + `isSensitiveAuth` |
| 4 | Paranoia-formulär skapar **inte** `reality_vault`-dokument |
| 5 | `knowledgeVaultQuery` / `valvChatQuery` anropas **inte** från Kat 8-moduler |
| 6 | `npm run build` + `npm run smoke:mabra` + `npm run smoke:innehall` |
| 7 | Device Clear rensar SOS session keys (efter Cat8-E3) |

---

## 12. Referenser

| Dokument | Roll |
|----------|------|
| [`MABRA-3.0-MASTER-SPEC.md`](./MABRA-3.0-MASTER-SPEC.md) | Kat 8 master |
| [`mabra-3.0-rules-audit.md`](../../evaluations/mabra-3.0-rules-audit.md) | Rules gaps |
| [`mabra-3.0-cat8-ui-inventory.md`](../../evaluations/mabra-3.0-cat8-ui-inventory.md) | UI nuläge |
| [`Drogfrihet-SPEC.md`](./Drogfrihet-SPEC.md) | P0 hub |
| [`Mabra-CONTENT-BANK.md`](./Mabra-CONTENT-BANK.md) | DF-REF KEEP |
| [`firestore.rules`](../../../firestore.rules) | WORM validators live |
| [`.context/security.md`](../../../.context/security.md) | Silos, L4 |

---

**Status:** Expert spec förvarad. **Nästa steg:** Pontus godkänner → Cat8-E1 innehållskurering → rules PMIR för `projectId: recovery`.
