# Dagbok-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + kodgranskning mot `src/modules/dagbok/` och `functions/`.  
Konsoliderad till [`.context/modules/dagbokshubben.md`](../../../.context/modules/dagbokshubben.md).

## 1. Syfte och användarbehov

Dagbokshubben är **Lager 1 (Hjärtat)** — appens lugna, oskyldiga fasad utåt. En kravlös tacksamhets- och reflektionsdagbok med låg kognitiv belastning (ADHD/GAD). Syftet är identitetsrekonstruktion och KASAM via ACT/KBT-inspirerad reflektion — **inte** forensisk bevisföring.

**Strikt skild från Verklighetsvalvet (Lager 2):** dagboken är mjuk och helande; valvet är kallt, juridiskt och forensiskt. De får prata i backend (Vävaren) men UI-upplevelsen förblir separerad (**plausible deniability**).

## 2. Route och ingång

| | |
|---|---|
| **Route** | `/dagbok` (`HjartatPage`, flik `reflektion`) |
| **Redirect** | `/valv` → `/dagbok?tab=bevis` |
| **AuthGate** | Ja (Firebase Auth på route) |
| **Kluster** | Hjärtat |
| **Synlig ingång** | Floating Dock BookOpen, HomePage bento (`ClusterGrid`) |
| **Dold ingång (Fyren)** | **3s långtryck** på **dock-ikonen** BookOpen → WebAuthn → PIN → `/dagbok?tab=bevis` — **inte** knapp inne i dagboksvyn |

Relaterade flikar i samma kluster: **Bevis** (valv), **Speglar** (`?tab=speglar`).

## 3. UX-flöde (Progressive Disclosure)

**Idag (kod, Fas 1 — 2026-05-29):**

Sub-nav under Reflektion: **Snabb** · **Reflektera** · **Arkiv** (`DagbokModeNav`). Default Snabb vid MåBra-bro (`?from=mabra&energy=low`).

| Läge | Beteende |
|------|----------|
| **Snabb** | `MOOD_CATALOG` + valfria taggar + valfri rad → `saveJournalEntry` (stub-text om tom) |
| **Reflektera** | Wizard: humör → text (röst/KBT) → bekräfta → sparad; väv/Kampspár opt-in bakom PIN |
| **Arkiv** | `JournalArchive` läsbart utan PIN (WORM, ingen redigering i UI) |

**Reflektera (steg):**

1. Humör — 12 känslor i `MOOD_CATALOG`.
2. Reflektion — fritext + Web Speech API (`sv-SE`).
3. Bekräfta — preview + spara.
4. Sparad — *Ny post*, Speglar-bro via route state.

**Snabb:** humör-only via stub-text; taggar sparas som `tags[]` i Firestore.

**Målbild (planerad, Fas 2–4):**

- KBT/ACT-vägledande fråga per humör (t.ex. stolthet/tacksamhet).
- **Måbra-bro** vid `Låg` / `Spänd` (diskret länk till `/mabra`).
- Villkorlig Speglar-bro när **Vävaren** flaggar hot (inte alltid synlig länk).
- Valfritt humör-only save (~15 sek check-in).
- KASAM-kvällsflöde; Morgonkompass-utkast som referenskort.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` (slate-950) |
| Yta / glass | `#0f172a` + blur |
| Aktiv pill / steg | `#FDE68A` (guld) |
| Fortsätt | `#818CF8` (indigo) — `btn-pill--secondary` |
| Spara / klar | `#2DD4BF` (emerald) |
| Typografi | Outfit + Inter |

**Förbjudet:** streak-räknare (count-up), ljusa bakgrunder, lila (utöver indigo), turkos, naturteman, gamification (stjärnor/plantor), röda varningsbanner i Lager 1.

**Planerat (ej kod):** humör-gradient bakgrund — kan krocka med Obsidian Calm; avvakta UX-test.

## 5. Datamodell (Firestore, WORM)

Skrivskydd via Security Rules: `create` med `ownerId == auth.uid`; `update, delete: if false`.

### Collection: `journal`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs (via `withUserId`) |
| `userId` | string | Spegel av ownerId i klient-write |
| `mood` | string | `MOOD_CATALOG` label (t.ex. `Lugn`, `Oro`) |
| `text` | string | Reflektion / transkript / stub vid snabb |
| `tags` | string[]? | Max 10, klientvaliderat (Fas 1) |
| `category` | string? | `journalCategories` enum (Fas 2+ UI) |
| `createdAt` | timestamp | server-side |

**Inte i scope:** `vaultFlag`, hot-analys eller juridiska fält i `journal` — separation Lager 1/2.

**Async efter save:** `weaveJournalEntry` (callable) → **`reality_vault`** (`category: vävaren_metadata`) — **inte** `kampspar`, **inte** direkt till Speglar-UI.

## 6. Backend och agenter

Prompts **endast** i [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts) (Vävaren).

| Callable / lib | Roll |
|----------------|------|
| Klient `saveJournalEntry` | Direkt Firestore create → `journal` |
| `weaveJournalEntry` | Firebase Callable (`europe-west1`); **fire-and-forget** från klient efter save — **inte** Firestore-trigger |
| `weaverAgent` | Gemini + Vävaren-prompt; skriver WORM-post i `reality_vault` med `weaverTags`, `journalEntryId`, `sourceMood` |
| `fetchWeaverRagContext` | Läser journal/valv/kampspar som **kontext** vid analys — skriver inte till Kunskap |

**Röst:** Web Speech API i klient (`useSpeechToText`, `lang: sv-SE`). **Ingen** ljud-Blob till Storage; endast transkriberad text sparas vid save.

**Agenter i UI:** Ingen blockerande agent i dagbok-wizard.

## 7. Säkerhet

| Kontroll | Status |
|----------|--------|
| AuthGate + Firestore `ownerId` | **done** |
| WORM `journal` | **done** (rules) |
| Zero Footprint: wizard i React RAM | **partial** — unmount-cleanup i `useJournalFlow`; Kill Switch global (`useShakeToKill` → `/`) |
| Fyren: WebAuthn + PIN före bevis-flik | **done** (`FloatingDock`, `authenticateVaultGate`) |
| CMEK | Drift/GCP — Layered Defense |
| Röst: ingen persistent ljudfil | **done** (browser-only) |

**Inte lagrat i `localStorage`:** wizard-state. Siduppdatering = blank wizard (om ej sparat).

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Wizard (humör → text → bekräfta → sparad) | **done** |
| Humör-pills + `DagbokStepIndicator` | **done** |
| Firestore `journal` + WORM rules | **done** |
| `weaveJournalEntry` → `reality_vault` | **done** |
| Speglar-bro (alltid synlig länk) | **done** |
| `JournalArchive` + pagination ("Visa fler", pageSize 5) | **done** |
| Arkiv dolt under steg 2–4 | **done** |
| Röst-till-text Web Speech sv-SE | **done** |
| Fyren: 3s long-press dock BookOpen → bevis | **done** |
| Wizard unmount cleanup | **done** |
| Villkorlig Speglar-bro (Vävaren hotnivå) | **planned** |
| Måbra-bro vid låg energi | **planned** (Måbra MVP **done** — bro ej kopplad) |
| KBT/ACT-prompter per humör | **planned** |
| Humör-only save | **planned** |
| KASAM-kväll / Morgonkompass-utkast | **planned** |
| Humör-gradient bakgrund | **planned** (osäker vs Obsidian Calm) |
| Dagbok → auto `kampspar` | **planned** — idag: Vävaren → `reality_vault` only |
| Zero Footprint full audit (Kill Switch + Kunskap-paritet) | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Oinloggad blockeras av AuthGate på `/dagbok` | **done** |
| 2 | Wizard steg 1 = humör-pills | **done** |
| 3 | Spara skapar post i `journal` med server timestamp | **done** |
| 4 | `weaveJournalEntry` triggas async utan UI-block | **done** |
| 5 | WORM: update/delete nekas i rules | **done** |
| 6 | Web Speech sv-SE fyller textfält | **done** |
| 7 | Efter sparad: länk till `/dagbok?tab=speglar` med context | **done** |
| 8 | Arkiv pagination; inget från `reality_vault` i arkiv | **done** |
| 9 | State rensas vid komponent-unmount | **done** (wizard) |
| 10 | 3s long-press BookOpen → bevis-flik efter PIN | **done** |
| 11 | Villkorlig Speglar/Måbra-bro | **planned** |
| 12 | Humör-only save | **planned** |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Verklighetsvalvet** | Vävaren skriver `vävaren_metadata` async; Fyren öppnar `?tab=bevis` |
| **Speglar** | Länk från SavedStep; `journalContext` förifyller spegling |
| **Måbra (`/mabra`)** | Planerad diskret länk vid låg energi — stub idag |
| **Kunskap / Minne** | **Ingen** auto-pipeline från dagbok; Vävaren läser RAG-kontext only |
| **Kompasser** | Separata `checkins`; ingen auto-ingest till dagbok |
| **Hamn / BIFF** | Separat route; ingen direkt dagbok-koppling |

## 11. Navigation

- **Dock:** BookOpen → `/dagbok` (kort klick); **Fyren** 3s → `/dagbok?tab=bevis`
- **Kluster:** Hjärtat — flikar Reflektion | Bevis | Speglar
- **Redirects:** `/valv` → `/dagbok?tab=bevis`

## 12. Tidigare diskussioner att bevara (vision)

- **Plausible deniability:** Dagboken ska se ut som vanlig självhjälp vid yttre granskning.
- **KBT/ACT:** Positivt rum — tacksamhet/stolthet bryter RSD-loop; inte prestationsdiagram.
- **Tvåspaltssystemet** (hen vs sanning) flyttat strikt till Valvet.
- **Filter-bubblor** i historik (tacksamhet/ångest) — bra UX-idé för arkiv.
- **Sanningens ankare:** Vävaren asynkron så Lager 1 förblir mjukt.

## 13. Avvisade eller alternativa idéer

- **Google Apps Script / Kalkylark** — avvisat; Firebase Firestore.
- **Bevis/skärmdumpar i Lager 1** — avvisat; media endast i Valvet.
- **Gamification** (Eco-Kingdom, stjärnor, streak) — avvisat för dagbok; lugnare UI.
- **Gemensam databas dagbok + valv** — avvisat; separata collections.
- **Redigera/radera journal** — avvisat (WORM); ny post = ny immutable snapshot.
- **Ljud-Blob i Storage/Valv** — avvisat för Lager 1; transkribera lokalt only.
- **Humör-gradient** — avvaktar (konflikt med Obsidian Calm möjlig).
- **People-pleasing/skam i valv** — avvisat; dagbok/Måbra (Kladd routing).
- **Stjärnbilder / gamification** — avvisat (Kladd §G).

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §F.

| Kladd | Kod |
|-------|-----|
| Lager 1 fasad / plausible deniability | **done** |
| Vävaren → `vävaren_metadata` auto | **done** (godkännande **planned**) |
| Subjektiv utmattning → dagbok OK | **done** |
| Kliniska PDF → valv | policy |

## 15. Öppna produktbeslut (MVP-rekommendation)

| Fråga | Rekommendation | Låst? |
|-------|----------------|-------|
| Röst: lokalt vs spara ljud | **Web Speech, lokalt only** | Nej |
| Måbra-bro: länk vs popup vs övning | **Diskret länk** | Nej |
| Arkiv: Visa fler vs infinite scroll vs kalender | **"Visa fler"** (nuvarande) | Nej |
| WORM: absolut vs redigeringsfönster | **Absolut WORM** | Nej |
| Humör-pills: nuvarande vs Harmonisk/Dränerad… | **Behåll nuvarande** | Nej |
| Speglar-bro: alltid vs Vävaren-villkor | **Alltid nu** → villkor senare | Nej |
| Humör-only save | **Rekommenderat** för 15-sek UX | Nej |

---

**Module plan (kod):** [`src/modules/dagbok/module_plan.md`](../../../src/modules/dagbok/module_plan.md)  
**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)  
**Flöde:** [`docs/specs/hjartat-flode.md`](../hjartat-flode.md)
