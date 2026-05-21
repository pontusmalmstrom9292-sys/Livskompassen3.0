# Speglar-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + kodgranskning mot `src/modules/speglings_system/`.  
Konsoliderad till [`.context/modules/speglingssystemet.md`](../../../.context/modules/speglingssystemet.md).

## 1. Syfte och användarbehov

**Sacred Feature** — reaktiv kognitiv sköld vid gaslighting, RSD och hypervigilans. Separerar **känsla** (ACT: validera, aldrig fixa) från **fakta** (WORM-bevis i `reality_vault` via VIVIR + EvidenceCompare). Grey Rock-ton, max 2–4 meningar, **ingen JADE**.

Till skillnad från **MåBra** (proaktiv KBT) och **Kunskap** (livsminne/RAG): Speglar är akut verklighetsvalidering mot manipulation — inte terapi, inte problemlösning.

## 2. Route och ingång

| | |
|---|---|
| **Route (kanonisk)** | `/dagbok?tab=speglar` |
| **Redirect** | `/speglar` → `/dagbok?tab=speglar` (behåller `location.state`) |
| **AuthGate** | På `/dagbok` (hela Hjärtat-klustret) |
| **Dock** | **Inte** i FloatingDock |

**Ingång (idag):**

1. **Primär bro:** Dagbok `SavedStep` → *"Känns det som gaslighting?"* med `journalContext` (`mood`, `text`).
2. **Synlig flik:** Hjärtat `TabBar` — Reflektion | Bevis | **Speglar**.
3. **Kluster:** `ClusterGrid` → Hjärtat → `?tab=speglar`.

**Inte idag:** Vävaren auto-dirigerar **inte** till Speglar (Vävaren skriver till `reality_vault` i bakgrunden).

## 3. UX-flöde (Progressive Disclosure)

Sekventiellt — **ett steg i taget** (`SpeglingsSystem.tsx`):

1. **Fas 1 — ACT** (`ActCalibrationView`): känsla (textarea, ev. förifylld från `journalContext`). Valfri **Spegla** → `speglingsMirror` eller deterministisk `mirrorFeeling()`.
2. **Fas 2 — VIVIR** (`VivirStepView`): Vem → Inflytande → Viktigt → Intention → Redo.
3. **Fas 3 — EvidenceCompare** (`EvidenceCompareView`): känsla + VIVIR vs token-matchade bevis från valvet (max 5 träffar).
4. **Utgång:** Länk **"Formulera BIFF-svar i Hamn"** med `prefilledMessage` (känslo-text) — **aktivt klick**, inte auto efter VIVIR. **"Ny kalibrering"** nollställer session.

**Valv-upplåsning:** Bevis hämtas **endast** om valv är upplåst (Fyren 3s + PIN/WebAuthn). Annars: meddelande om låst valv.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta / glass | `#0f172a` + blur |
| Insikt / rubriker | `#FDE68A` (guld) |
| Fortsätt / CTA | `#818CF8` (indigo) |
| Klar / positiv | `#2DD4BF` (emerald) |
| AI-synapser | `#6366F1` (`accent-ai`, `glass-card--ai` när AI används) |
| Typografi | Outfit + Inter |

Förbjudet: naturteman, regnbåge, lila (utöver indigo), röda larm-UI som triggar skam.

## 5. Datamodell

Speglar **skriver ingen** permanent data (Zero Footprint).

| Källa | Användning |
|-------|------------|
| `journalContext` | `location.state` från Dagbok — **inte** DB-read i Speglar |
| `reality_vault` | **Read-only** via klient `getVaultLogs(uid)` |
| `matchVaultEvidence` | **Klient-util** (token + `weaverTags`), exkl. `category: vävaren_metadata` |

**Planerat (ej i kod):** `system_synapses` / `speglings_historik` — avvaktar explicit produktbeslut (bryter Zero Footprint om auto-spar).

## 6. Backend och agenter

Prompts **endast** i [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts) — `SPEGLINGS_COACHEN_SYSTEM_PROMPT`.

| Yta | Roll |
|-----|------|
| `speglingsMirror` | Callable (`europe-west1`); ACT-spegling via `askSpeglingsCoach` |
| `matchVaultEvidence` | **Inte callable** — klient i `utils/matchVaultEvidence.ts` |
| Deterministisk fallback | `mirrorFeeling()` / `ACT_MIRRORS` i `constants/vivirSteps.ts` |

**Planerat:** Full DCAP/Genkit-pipeline utöver mirror; Vector Search på valv; hård enforcement av max 4 meningar i backend.

## 7. Säkerhet (Sacred)

| Kontroll | Status |
|----------|--------|
| AuthGate på `/dagbok` | **done** |
| Valv unlock före bevis-fetch | **done** |
| Zero Footprint: React state rensas vid unmount | **done** |
| Ingen `localStorage` för speglings-session | **done** (default) |
| Kill Switch (`useShakeToKill`) | **done** — global, navigerar `/` |
| Firestore rules: `reality_vault` per `ownerId` | **done** |
| CMEK | Drift/GCP |

**Inte idag:** Automatisk rensning vid `visibilitychange`/app-minimize specifikt för Speglar (vault har egen session-logik).

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Faser ACT → VIVIR → EvidenceCompare | **done** |
| `journalContext` från Dagbok SavedStep | **done** |
| Synlig flik Speglar i Hjärtat | **done** |
| `matchVaultEvidence` + vävaren-filter | **done** |
| Valv-lås före bevis | **done** |
| `speglingsMirror` + deterministisk fallback | **done** (deploy/smoke prod) |
| AI-accent `#6366F1` | **done** |
| Zero Footprint unmount | **done** |
| Bro till Hamn (`prefilledMessage`) | **done** |
| Prompt Grey Rock / max 2–4 meningar | **done** (prompt; ej enforced) |
| Full DCAP Genkit Speglings-Coachen | **planned** |
| Vävaren → auto-bro Speglar | **planned** (opt-in) |
| Vector Search på valv-bevis | **planned** |
| Inaktivitetstimer Zero Footprint | **planned** |
| Klickbara valv-citations i compare | **planned** |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | `/speglar` redirect till `/dagbok?tab=speglar` | **done** |
| 2 | `journalContext` överförs utan förlust från Dagbok | **done** |
| 3 | ACT före VIVIR före Compare (sekventiellt) | **done** |
| 4 | `matchVaultEvidence` exkluderar `vävaren_metadata` | **done** |
| 5 | Bevis hämtas endast när valv upplåst | **done** |
| 6 | `speglingsMirror` eller fallback inom ~1s vid AI-fel | **done** |
| 7 | Hamn-länk med `prefilledMessage` (ej localStorage) | **done** |
| 8 | Unmount rensar speglings-state | **done** |
| 9 | AI-svar ≤4 meningar (garanterat) | **partial** — prompt only |
| 10 | Inga bevis: ACT-validering utan hallucinerad fakta | **partial** — tom lista + copy |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Dagbok (Hjärtat)** | Skickar `journalContext`; primär bro |
| **Verklighetsvalvet** | Read-only WORM-bevis för compare; unlock via Fyren |
| **Hamn** | `prefilledMessage` → redigerbar textarea → `analyzeMessage` (BIFF) |
| **MåBra** | Helt skild — proaktiv KBT |
| **Kunskap** | Helt skild — livsminne/RAG |
| **Vävaren** | Skriver `reality_vault` + metadata; **dirigerar inte** till Speglar |

## 11. Navigation

- **Kluster:** Hjärtat (`/dagbok`)
- **Dock:** BookOpen → `/dagbok` (long-press → Bevis-flik)
- **Intern:** TabBar inkl. Speglar
- **Legacy:** `/speglar` redirect

## 12. Tidigare diskussioner att bevara (vision)

- Känsla och fakta är båda "sanna" i olika register — systemet får aldrig gaslighta användaren om att känslan är "fel".
- Inget JADE — appen skickar aldrig meddelanden till ex automatiskt.
- VIVIR som digitalisering av logisk sortering vid crazymaking / dubbelbestraffning.
- WORM-bevis som psykologiskt ankare: "det går inte att manipulera det som redan är låst".
- Biologisk feedback / KASAM / barnens trygghet — framtida, inte i denna modul.

## 13. Avvisade eller alternativa idéer

- **Spara speglingar som WORM-bevis** — avvisat (emotionellt stöd ≠ forensik).
- **Generell KBT i Speglar** — avvisat → MåBra.
- **Quiz/inlärning** — avvisat; reaktiv krisnavigering only.
- **Auto-sms till förövare** — avvisat; all utgång via Hamn + manuell granskning.
- **`matchVaultEvidence` som Cloud Function** — avvisat i MVP; klient + rules räcker.

## 14. Öppna produktbeslut (MVP-rekommendation)

| Fråga | Rekommendation | Låst? |
|-------|----------------|-------|
| Token vs Vector Search på valv | **Token** nu | Nej |
| Spara session som synaps | **Nej** — Zero Footprint | Nej |
| Auto-navigering till Hamn | **Nej** — aktivt klick | Nej |
| `#6366F1` på all AI-text | **Nej** — accent på AI-kort/badge | Nej |
| Inga bevis — copy | ACT + "inga matchande poster i valvet" | Nej |
| Genkit vs Functions för coach | **Functions + Gemini** (nuvarande mirror) | Nej |

---

**Module plan (kod):** [`src/modules/speglings_system/module_plan.md`](../../../src/modules/speglings_system/module_plan.md)  
**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)
