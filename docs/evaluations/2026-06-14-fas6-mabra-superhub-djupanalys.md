# Fas 6 — MåBra: djupanalys för Universal Input Superhub

**Datum:** 2026-06-14  
**Status:** Spec godkänd 2026-06-14 — [`Mabra-INPUT-SUPERHUB-SPEC.md`](../docs/specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md) · implementation Fas 6A väntar kickoff i ny chatt  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) § Fas 6 · [`Mabra-SPEC.md`](../specs/modules/Mabra-SPEC.md) · [`MABRA-PROJEKT-VIT-HUB-SPEC.md`](../design/MABRA-PROJEKT-VIT-HUB-SPEC.md)  
**Relaterat:** [`2026-06-06-supermodule-master-plan.md`](./2026-06-06-supermodule-master-plan.md) · [`2026-06-01-superhub-IA-spec.md`](./2026-06-01-superhub-IA-spec.md)

---

## Slutsats

MåBra har **minst 15 distinkta inmatningsytor** spridda över `/mabra`, `/mabra/*`, legacy `/mabra` (exakt path) och broar till `/hjartat`. Text sparas till **fyra olika WORM-samlingar** (`checkins`, `mabra_sessions`, `vit_entries`, `emotional_memory`) plus **en mutable** (`mabra_progress`). Större delen av fri text (**reframing, coach, KBT, daglig mix anteckning, reflection deck**) sparas **inte** i molnet — eller bara i **localStorage**.

**Rekommendation:** Inför **`MabraInputSuperModule`** (polymorf lägesväxlare) enligt etablerat supermodule-mönster — **inte** nya spridda formulär. Migrera zon för zon efter denna analys. **Dubbel känslominne-silo** (`vit_entries` vs `emotional_memory`) måste lösas explicit före låsning.

---

## REASONS (kort)

| Dimension | MåBra Superhub |
|-----------|----------------|
| **Requirements** | En inmatningshub per zon; lägesbyte (minne, reflektion, vit-kort, check-in, bro till dagbok/inkast); Obsidian Calm + smaragd glow |
| **Entities** | `checkins`, `mabra_sessions`, `mabra_progress`, `vit_entries`, `vit_hub`, `emotional_memory`; callables `mabraCoach` |
| **Approach** | Tunn router (`MabraInputSuperModule`) → befintliga paneler som delegates; deprecate duplicerade ingångar stegvis |
| **Structure** | `/mabra` unified shell; läges-`?inputMode=` eller intern tab; Färgburkar `glow-bottom-green` |
| **Operations** | Djupanalys → spec → migrering → `smoke:mabra` + `smoke:emotional-memory` → lås i `locked-ux-features.md` |
| **Norms** | U6 REFLECTION/PLAY i Vit; ingen cross-RAG till Kunskap; ex/konflikt → Speglar guard |
| **Safeguards** | WORM create-only; verified email för `emotional_memory`; offline allowlist; HITL för inkast (ej auto från MåBra) |

---

## 1. Inmatningskartläggning (verifierat i kod)

### 1.1 Firestore-skrivande ytor

| Komponent | Route | Input | Collection | WORM |
|-----------|-------|-------|------------|------|
| `MabraCheckinModal` | `/mabra` (legacy hub) | mood, energy, notes | `checkins` (`mabra_checkin`) | Ja |
| `ValuesCompass` | `/mabra/varderingar` | ACT-värden (chips) | `mabra_progress/{uid}` | **Nej** (merge) |
| `VitCardFlowPanel` | `/mabra/projekt/:id` (cards) | textarea svar | `vit_entries` + `vit_hub` | entries Ja |
| `VitChatFlowPanel` | `/mabra/projekt/:id` (chat) | textarea → coach | `vit_entries` (`chat_turn`) | Ja |
| `VitMemoryFlowPanel` | `/mabra/projekt/:id` (memory, ej emotional_memory) | text + textarea | `vit_entries` (`memory`) | Ja |
| `EmotionalMemoryComponent` | `/mabra/projekt/emotional_memory` | textarea, typ, styrka | `emotional_memory` | Ja |
| `MabraExerciseView` m.fl. | `/mabra/ovning/*` | knappar/timers | `mabra_sessions` | Ja (metadata) |
| `DagligMixPanel` | hub / verktyg | textarea (**ej molnet**) | `mabra_sessions` | Ja (utan fri text) |

**Write layer:** `firestore.ts`, `vitHubFirestore.ts`, `emotionalMemoryFirestore.ts`

### 1.2 Input utan molnpersistens (RAM / local / callable)

| Komponent | Route | Persistens |
|-----------|-------|------------|
| `ReframingExercise` | `/mabra/ovning/reframing` | RAM + röst; session metadata only |
| `MabraCoachPanel` | `/mabra/klart` | Callable only |
| `KbtTransformatorPanel` | `/mabra/verktyg/kbt` | Callable only |
| `MabraReflectionDeckTool` | `/mabra/verktyg/reflection_deck` | **localStorage** |
| `MabraFeelingCardsTool`, `SelfQuiz`, `MicroPlay` | `/mabra/verktyg/*` | Ingen / RAM |
| `BreathingExercise`, `GroundingExercise` | `/mabra/ovning/*` | Session metadata |

### 1.3 Broar utanför MåBra-modulen

| Bro | Route | Target | Koppling |
|-----|-------|--------|----------|
| Dagbok efter övning | `/hjartat?from=mabra&hub=…` | `journal` WORM | `MabraComplete`, `mabraDagbokBridgeUrl` |
| Speglar guard | hint | `/hjartat?tab=speglar` | `MabraSpeglarGuardHint`, coach guard |
| Inkast | `/#inkast-lite`, planering inkorg | journal / valv / … | **Ingen MåBra-target** idag |
| Valv Vit (read) | `/valvet?vaultTab=vit…` | read `vit_entries` | Ingen create |

### 1.4 Routing-dubbelhet (risk)

| Path | Komponent | Problem |
|------|-----------|---------|
| `/mabra` (exakt) | Legacy `MabraHub.tsx` + check-in modal | Skiljer sig från `MabraHubView` under `/mabra/*` |
| `/mabra/*` index | `MabraHubView` | Många `navigate('/mabra')` landar på **legacy** |

**Superhub måste enhetliggöra entry** — annars splittrad UX.

---

## 2. Dubletter och överlapp (kritiska)

| # | Problem | Detalj | Superhub-åtgärd |
|---|---------|--------|-----------------|
| D1 | **Två känslominne-silos** | `emotional_memory` vs `vit_entries.kind=memory` | En canonical path; lista/Valv måste spegla båda eller migrera |
| D2 | **Reflection deck split** | localStorage vs `vit_entries` (samma bank) | Erbjud “spara till Vit” i samma hub-läge |
| D3 | **Fri text försvinner** | Reframing/coach/KBT/daglig mix | Hub-läge “utkast” eller explicit “spara till dagbok/minne” |
| D4 | **Dagbok vs MåBra** | Parallella reflektionsvägar | Hub-läge `dagbok_bridge` — en CTA, inte dold bro |
| D5 | **Inkast saknar MåBra** | Tematisk överlapp reflektion | Hub-läge `inkast` (HITL) — **inte** auto-promote |
| D6 | **Legacy vs module hub** | Två `/mabra`-träd | Migrera till en shell före Superhub-lås |

---

## 3. Säkerhetsgränser (MUST bevaras)

| Regel | MåBra-implication |
|-------|-------------------|
| **U1 Tre silos** | Vit/MåBra → `vit_entries` / `emotional_memory` — **ingen** Kunskap RAG auto-ingest |
| **U3 WORM** | Inga update/delete på `vit_entries`, `emotional_memory`, `mabra_sessions`, `checkins` |
| **U6 content_class** | REFLECTION/PLAY från bank; FACT → Kunskap-seed separat |
| **Verified email** | `emotional_memory` create kräver `isOwnerCreateSensitive` |
| **Offline policy** | `emotional_memory` i allowlist; valv/barn **blockerat** offline |
| **Speglar guard** | Coach/chat/reframing — ex/konflikt → Speglar, inte MåBra-bank |
| **Zero Footprint** | Coach-svar / RAM-text rensas vid logout — Superhub får inte cachea känslig text persistent utan explicit save |

---

## 4. Föreslagen Superhub — lägen (modes)

Polymorf **MabraInputSuperModule** (namn TBD vid spec):

| Läge | Ersätter / konsoliderar | Default delegate |
|------|-------------------------|------------------|
| `checkin` | `MabraCheckinModal` | Check-in form |
| `vit_card` | `VitCardFlowPanel` | per `projectId` |
| `vit_chat` | `VitChatFlowPanel` | per project |
| `vit_memory` | `VitMemoryFlowPanel` **eller** `EmotionalMemoryComponent` | route by project |
| `emotional_memory` | `EmotionalMemoryComponent` + list | WORM `emotional_memory` |
| `reflection_tool` | Reflection deck, feeling cards | local → optional cloud save |
| `exercise_note` | Reframing RAM → optional save | bridge |
| `dagbok_bridge` | `MabraComplete` link | `/hjartat` delegate |
| `inkast` | (ny) | `CaptureSuperModule` variant `mabra` — **kräver spec** |

**Färgburkar:** `glow-bottom-green`, `calm-card`, zon `vardag_aterhamtning` tokens.

**Metadata på save:** `{ zone: 'mabra', inputMode, projectId?, content_class, bankId? }`

---

## 5. Migreringsplan (faser — ej påbörjad)

### Fas 6A — Spec + router-skelett (ingen WORM-ändring)
- Skriv `docs/specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md`
- `MabraInputSuperModule.tsx` — läges-router, inga nya collections
- Enhetlig `/mabra` entry (legacy deprecation plan)

### Fas 6B — Konsolidera Vit + emotional memory (D1)
- Ett “Känslominne”-läge; tydlig lista (`EmotionalMemoryListPanel`)
- Valv Vit-panel: read-path för `emotional_memory` **eller** dokumenterad dual-read

### Fas 6C — Reflection + RAM → explicit save (D2, D3)
- Reflection deck: “Spara till Vit” / “Spara till dagbok”
- Coach/reframing: post-session save prompt (HITL)

### Fas 6D — Inkast-läge + dagbok bridge (D4, D5)
- `CaptureSuperModule` variant; DCAP routing
- Smoke: `smoke:mabra`, `smoke:emotional-memory`, `smoke:inkast`, `smoke:locked-ux`

### Fas 6E — Lås
- Registrera i `.context/locked-ux-features.md`
- PMIR + explicit OK från teknikledare
- **Ingen AI-ändring av kärnlogik utan åsidosättande tillstånd**

---

## 6. Smoke- och acceptanskriterier (före lås)

- [ ] `npm run build` PASS
- [ ] `npm run smoke:mabra` PASS
- [ ] `npm run smoke:emotional-memory` PASS (statisk + WORM live om SEED)
- [ ] `npm run smoke:locked-ux` PASS
- [ ] `npm run smoke:innehall` PASS (bankId parafras i prod coach)
- [ ] Manuell: verified email → spara känslominne → syns i lista
- [ ] Manuell: anonym → inloggningsmeddelande (ej falskt nätverksfel)
- [ ] Manuell: lägesbyte utan sidbyte (en hub)
- [ ] Ingen ny spridd textarea utanför Superhub efter migrering

---

## 7. Bevaras (MUST NOT regress)

- Locked MåBra övningar (andning, akut, reframing flow)
- `mabraCoach` + Speglar guardrail
- Vit-projekt registry (`MABRA_PROJECTS`)
- WORM på alla evidens/minnes-samlingar
- Barnfokus / Valv / Kunskap — **ingen** cross-RAG från MåBra-input
- `npm run smoke:locked-ux` Barnfokus + Valv-flikar orörda

---

## 8. Nästa steg (ett)

**Väntar på godkännande:** Skriv `Mabra-INPUT-SUPERHUB-SPEC.md` (Fas 6A) utifrån denna analys — **ingen kod** förrän Pontus säger godkänn.

---

## Bilaga — filreferenser

| Område | Sökväg |
|--------|--------|
| Routes | `src/modules/features/dailyLife/wellbeing/mabra/routing/MabraRoutes.tsx` |
| Hub | `MabraHubView.tsx`, `components/mabra/MabraHub.tsx` (legacy) |
| Vit | `VitHubPreview.tsx`, `Vit*FlowPanel.tsx` |
| Känslominne | `src/modules/features/emotional-memory/` |
| Firestore | `vitHubFirestore.ts`, `emotionalMemoryFirestore.ts`, `firestore.ts` |
| Supermodule-mönster | `CaptureSuperModule`, `DagbokSuperModule` (se master plan) |
