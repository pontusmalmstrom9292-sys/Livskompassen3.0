# UPLOAD-UNIFIED-SPEC

## 1. Gap-tabell: yta → callable → silo → kan slås ihop?

| Yta / Frontend component        | Callable Function(s)          | Silo            | Merge suggestion  | Kommentar / Skäl                            |
|--------------------------------|------------------------------|-----------------|-------------------|--------------------------------------------|
| CapturePanel                   | submitInkastLite             | Kunskap/Barnen* | MERGE (med InkastDirectPanel) | CaptureSuperModule ska täcka text+files+preview+confirm i samma flow. Mönster standardiseras. Barnen/Kunskap beroende på inkast-klassifiering HITL. |
| InkastDirectPanel              | submitInkastLite             | Kunskap/Barnen* | MERGE (med CapturePanel)     | Redundans i UI med liknande funktionalitet. Samma backend entry.                |
| InkastLite                    | submitInkastLite             | Kunskap/Barnen* | MERGE (med CapturePanel)     | MåBra inkast som subset av Capture. Behöver unifieras till supermodul för konsistens. |
| VaultInkastCompact             | uploadVaultEvidence           | Valv            | KEEP                      | Direktupload till Valv WORM, strikt silo och säkerhetsmodell. Specifika UX & säkerhetskrav. Kan ej slås ihop med text-inkast. |
| HemCapture                    | submitInkastLite             | Kunskap/Barnen* | MERGE (med CapturePanel)     | Fungerar som Capture supermodule. Samma backend.                                |
| InboxReviewQueue (fuzy UI nod) | getInboxQueue + confirmInboxItem [funcs] | Valv / Kunskap / Barnen | KEEP / MERGE | Inkorg-klassificering + HITL-bro, separata callables per silo, inga sammanslagningar till produktionssilo. Kan eventuellt MERGE backend funktionalitet men separata callables nödvändiga pga silo-separation. |

_* Beroende på klassificering via G10 pipeline, inkast kan gå till flera silos via HITL-godkännande men inte automatiskt._

---

## 2. Canonical frontend: CaptureSuperModule

- CaptureSuperModule ska vara gemensam UI-komponent
- Mode-parametrar: `text` | `files` | `preview` | `confirm`
- Täcker alla nuvarande ytor: CapturePanel, InkastDirectPanel, InkastLite, HemCapture
- VaultInkastCompact hålls separat pga Valv-silo och strikt säkerhetsflöde
- CaptureSuperModule ska ha strikt silo-separation i UX (vägledning via G10 pipeline och HITL)
- Behåll Zero Footprint princip i alla UI-flöden (ej permanent data innan explicit save)
- Äldre frontend-UI som InkastDirectPanel eller InkastLite → REFAKTORERA till CaptureSuperModule i steg 2 eller 3

---

## 3. Canonical backend entry

- Primär ingång: `submitInkastLite` callable (G10 pipeline)
- Funktion: tar emot alla typer av inkast och hanterar routing till silo enligt klassificering och HITL-status
- Storage onFinalize trigger används endast för filuppladdningar, kopplat med `submitInkastLite` för metadata
- `ingestKnowledgeDocument` (kunskap) och `uploadVaultEvidence` (Valv) behålls som specialfunktioner som kan fasas ut när pipeline är fullständig
- Prioritera lagring i WORM där det gäller (`reality_vault`, `children_logs`, `journal`) via pipeline
- Migration i 3 steg:
  1. Parallell körning av CaptureSuperModule och `submitInkastLite` bredvid existerande flöden
  2. Fas ut InkastDirectPanel, InkastLite, HemCapture frontend och bakåtkompatibilitet i `submitInkastLite`
  3. Eventuell konsolidering/förbättring i backend, avveckla gamla callables (ingen direkt radering innan steg 2 klar)

---

## 4. Behålla tre silos, HITL, SaveAsEvidencePrompt, Zero Footprint

- Absolut SILO-separering enligt U1 — ingen cross-RAG eller automatiska promoversioner mellan silos
- HITL-bro för inkorg och SaveAsEvidencePrompt måste behållas i backend och frontend
- Zero Footprint (inget sparande förrän explicit save/godkännande) gäller även i unifierade flöden
- Valv-flödet är strikt skyddat med WebAuthn och PIN; håll separerat i filstruktur och callable-namn

---

## 5. Migrering i 3 steg (min risk först)

| Steg | Åtgärd                                   | Risk / Kommentar                              |
|-------|-----------------------------------------|-----------------------------------------------|
| 1     | Implementera CaptureSuperModule + submitInkastLite parallellt | Minimal risk, bakåtkompatibilitet bibehålls. |
| 2     | Migrate/rewire existerande frontend till CaptureSuperModule  | UI-enhetlighet, minimerar koddubletter.       |
| 3     | Utfasning av gamla callables (ingestKnowledgeDocument, uploadVaultEvidence) | Backend-renhet, minimerar attackyta.           |

---

## 6. Relevanta design/mockups att arkivera (ARCHIVE candidates)

- `InkastDirectPanel` och `InkastLite` specifika mockups — ersätts av CaptureSuperModule, kan arkiveras efter 19.6/Ph3
- `HemCapture` isolerade designmockups om duplicerad funktionalitet i CaptureSuperModule
- Tidigare versionsspecifika flöden för `uploadVaultEvidence` frontend som är separata, om CaptureSuperModule täcker relevant funktionalitet i steg 3
- Dubblettmockups relaterade till separata inkast-UI som nu slås ihop

---

## Sammanfattning KEEP / MERGE / DELETE

| Yta / Callable             | Beslut | Skäl                                             |
|---------------------------|--------|--------------------------------------------------|
| CapturePanel (frontend)    | MERGE  | Integreras i CaptureSuperModule                   |
| InkastDirectPanel (frontend) | MERGE  | Duplicerat, sammankoppla med CaptureSuperModule  |
| InkastLite (frontend)      | MERGE  | Samma som ovan                                   |
| HemCapture (frontend)      | MERGE  | Samma som ovan                                   |
| VaultInkastCompact         | KEEP   | Specifik silo, strikt säkerhet                    |
| submitInkastLite (callable) | KEEP (canonical) | Primär backendövergång för unifierad pipeline   |
| ingestKnowledgeDocument    | DELETE (efter migration) | Fasas ut stegvis                               |
| uploadVaultEvidence        | KEEP (för nu) | Specifikt Valv-flöde, avvecklas ev steg 3       |
| InboxReviewQueue callables | KEEP   | Silo-specifika rättigheter, HITL kräver skild logik |

---

### Obligatorisk slutrad

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
