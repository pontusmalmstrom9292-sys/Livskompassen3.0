# Arkitektur — Det yttre lugnet vs Det inre försvaret

**Status:** Canonical produktarkitektur (låst intent 2026-05-23)  
**Regel:** Implementera UI/agenter **endast** när användaren säger `kör [GAP]` — se [`modules/Arkiv-GAP-REGISTER.md`](modules/Arkiv-GAP-REGISTER.md) **G18–G21**.  
**Relaterat:** Verklighetsvalvet (Lager 2), Dagbok (Lager 1), [`product-vision.md`](product-vision.md), [`.context/security.md`](../../.context/security.md)

---

## 1. Total uppdelning (obligatorisk)

Appen ska upplevas som **två mentala rum** — inte en enda yta där trauma och återhämtning blandas.

| Rum | Svenskt namn | Var i appen | Känsla | Får **inte** visas här |
|-----|--------------|-------------|--------|-------------------------|
| **Utanför Valvet** | Det yttre lugnet · *Det ljusa, helande rummet* | `/`, `/dagbok?tab=reflektion`, `/kompasser`, `/mabra`, Barnen (glada stunder), Kompis (neutral navigering) | Djupt rogivande, stoisk, varm — Obsidian Calm | Påminnelser om ex, konflikt, rättstvister, orosanmälan, gaslighting-copy, BIFF-trådar, WORM-listor |
| **Innanför Valvet** | Det inre försvaret · *Det forensiska försvarsrummet* | `/dagbok?tab=bevis` efter **Fyren** (3s taktilt tryck + WebAuthn + PIN) | Kallt, strukturerat, juridiskt — fakta före tolkning | KBT-coach, tacksamhetsfrågor, Måbra-övningar, känslomässig spegling som primär UX |

**Plausible deniability:** Utåt ska appen kunna framstå som vanlig dagbok/wellness. Valvet är **dolt** (Fyren på dock BookOpen); synlig flik **Bevis** är tillfällig svaghet — ska döljas (**G18**).

**Backend får koppla rum** (t.ex. Vävaren taggar `reality_vault` async från dagbok) — **UI och copy får aldrig förorena Det yttre lugnet** med valv-innehåll utan explicit användarval (bro → Speglar/Valv).

### Runtime idag (evidens)

| Krav | Label | Bevis |
|------|-------|-------|
| Lager 1 vs 2 dokumenterat | **PASS** | `docs/specs/modules/Dagbok-SPEC.md` §1, `Verklighetsvalvet-SPEC.md` §1 |
| Fyren 3s + gate | **PASS** | `FloatingDock.tsx` (long-press), `webauthn.ts`, `VaultPage` PIN |
| WORM `reality_vault` | **PASS** | `firestore.rules`, `saveVaultLog` + `assertWormPayload` |
| Yttre lugnet rent från valv-UI | **PASS** | G18 — `HIDE_BEVIS_TAB`, `resolveHjartatTab`, `getHomeClusters` (`appNavigation.ts`); `HjartatPage.tsx` |
| Ex/konflikt endast Hamn/Speglar/Valv | **DELVIS** | Hamn `/hamn`, Speglar flik; Måbra guard → Speglar (`mabraCoachGuard.ts`) |

---

## 2. Verklighetsvalvet (Lager 2) — inre försvar

**Sacred Feature:** Sanningens Sköld / Verklighetsvalvet.

Bakom taktilt trycklås (Fyren): hela den juridiska bevismaskinen.

| Funktion | Intent | Runtime |
|----------|--------|---------|
| Logga incidenter | Enkel / tvåspalt / tresteg / magkänsel + media + röst | **PASS** — `VaultEntryForm.tsx` |
| WORM + tidssäkring | Append-only, inga redigeringar | **PASS** — `reality_vault` rules |
| Filuppladdning | `evidenceUrl` per post | **PASS** — `uploadVaultEvidence` |
| Sök i egen historik | Valv-Chat, Zero Footprint session | **PASS** — `valvChatQuery`, `ValvChatPanel` |
| Dold narcissism / DCAP | Risk före LLM | **PASS** — `analyzeDcap` i supervisor-kedja |
| SMS-loggar / orosanmälan batch | Orkestern-flik analyserar dokument | **GAP** — **G19**, **G20** |
| Mönsterfrekvens för jurist/soc | Mönstersökaren | **GAP** — **G21** |

Kanon modul: [`.context/modules/verklighetsvalvet.md`](../../.context/modules/verklighetsvalvet.md).

---

## 3. Det yttre lugnet — innehållsregler

**Fokus:** du, återhämtning, KBT/Måbra, barnens **positiva** stunder, kompasser (mikrosteg).

| Modul | Route | Tillåtet | Förbjudet i copy/UI |
|-------|-------|----------|---------------------|
| Dagbok Reflektion | `/dagbok` (default flik) | Humör, tacksamhet, en post i taget | "Bevis", ex-namn, rättstvist, WORM-termer i onboarding |
| Kompasser | `/kompasser` | Morgon/dag/kväll checkin | Vault/Dossier |
| Måbra | `/mabra` | Grounding, RSD — guard vid ex-topic | Gaslighting-försvar (→ Speglar) |
| Barnen | `/barnen` | Neutral logg, glada observationer | Auto-kopiera till `reality_vault` utan explicit bro |
| Kompis | `/` | Navigering, lågaffektiv coach | Cross-silo RAG, valv-data i svar |

**Broar (endast på explicit användarhandling):**

- Dagbok sparad → *"Känns det som gaslighting?"* → Speglar (`SavedStep.tsx`).
- Fyren 3s → Valv (inte tvärtom i onboarding).

---

## 4. Orkestern i Valvet (planerad UX)

**Flik:** `Orkestern` i upplåst Verklighetsvalvet (utöver Logga | Sök | Dossier).

**Syfte:** Visuell panel där användaren ser att agenter **kör, kategoriserar och tidssäkrar** bevis (WORM) — utan att blanda in Lager 1-copy.

### Produktnamn → runtime-mappning

| Visuellt namn (produkt) | Roll i Orkestern | Runtime idag | Mål vid `kör G19` |
|-------------------------|------------------|--------------|-------------------|
| **Vävaren** | Kategorisera dagboks-/dokumentmetadata → WORM | **PASS** — `weaverAgent.ts`, `weaveJournalEntry` → `vävaren_metadata` | Panel + status + användargodkännande före permanent tagg |
| **Spejaren** | Bevaka/scan: SMS-PDF, orosanmälan, inkorg → struktur | **DELVIS** — `inboxClassifier`, Drive ingest, DCAP; inget agentkort `Spejaren` | Dedikerat ingest/scan-jobb + Orkestern-logg |
| **Säkraren** | WORM-sigill, integritet, inga redigeringar | **PASS** — `assertWormPayload`, Firestore create-only | Visuell "sigill"-status per post i panelen |

**Legacy:** `spejaren.js` är **avvecklad** — ersätts av Node ADK + inkorg (**inte** återinföra filnamnet som runtime-källa).

Agenter i Orkestern får **endast** läsa/skriva **Valv-silo** (`reality_vault`, vault Storage) — **MUST NOT** blanda Kunskap-RAG eller Barnen-RAG i samma UI-svar.

---

## 5. Mönstersökaren (planerad UX)

**Plats:** Verklighetsvalvet — egen vy eller underflik under Orkestern / Sök.

**Syfte:** Filtrera och söka på **taxonomi-mönster** över tid för ombud eller socialtjänst:

- gaslighting  
- lojalitetspress  
- projektion  
- (utökbar lista — synkad med DCAP/EntityProfile, inte fri LLM-etikett)

**Output:** Frekvenstrender (tidsaxel), källhänvisning till WORM-poster (`reality_vault` id + `createdAt`), export via Dossier — **inte** terapisvar.

| Del | Label | Bevis / gap |
|-----|-------|-------------|
| DCAP detekterar gaslighting m.m. | **PASS** | `functions/src/agents/DCAP.ts` |
| Mönster-Arkivarien (Minne/kampspar) | **PASS** | `LivsArkivarienCard`, `kampsparQueryRag` — **ej** samma som valv-trend |
| Valv-specifik trend-UI + filter | **GAP** | **G21** |
| Automatisk `#gaslighting`-tagg på alla poster | **VISION** | Se `Vision-AI-Native-Blueprint.md` — kräver `kör G21` |

---

## 6. Acceptanskriterier (för framtida PR)

1. Öppna appen utan Fyren → **ingen** synlig juridisk terminologi, ex-konflikt eller WORM-lista på förstasidan.
2. Efter Fyren → full tillgång till logg, sök, Orkestern, Mönstersökaren (när G19–G21 levererade).
3. Stäng valv / flikbyte → gate rensad (`clearVaultGate`), Valv-Chat nollställd.
4. Ny feature som visar `reality_vault` utanför `?tab=bevis` → **avvisad** utan produktbeslut + GAP-rad.

---

## 7. Implementation-kö (GAP)

| ID | Titel | Trigger |
|----|-------|---------|
| **G18** | Dölj synlig Bevis-flik — Fyren-only (yttre lugnet) | **done** 2026-05-23 |
| **G19** | Orkestern-flik + visuell agentpanel (Vävaren/Spejaren/Säkraren) | `kör G19` |
| **G20** | Orkestern: batch SMS/orosanmälan/inkorg → WORM-mönster | `kör G20` |
| **G21** | Mönstersökaren: filter + frekvenstrender i valv | `kör G21` |

Detaljer: [`modules/Arkiv-GAP-REGISTER.md`](modules/Arkiv-GAP-REGISTER.md).

---

## 8. Agent-checklista (läs före UI/valv-PR)

- [ ] Läst denna fil + `Verklighetsvalvet-SPEC.md`
- [ ] Yttre lugnet: inga nya påminnelser om ex/rättstvist utanför Hamn/Speglar/Valv
- [ ] Inre försvaret: WORM + Zero Footprint oförändrat eller starkare
- [ ] Tre silor: inget cross-RAG Valv ↔ Kunskap ↔ Barnen
- [ ] Prompts endast i `functions/src/sharedRules.ts`
- [ ] PASS-claims har `fil:rad`-citat
