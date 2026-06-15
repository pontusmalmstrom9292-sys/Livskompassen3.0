# IMPLEMENTATION-NOTES.md

## Ändrade filer och komponenter

- `src/modules/capture/CapturePanel.tsx`
  - Slå ihop text, filväljare, audio och AI-preview från InkastDirectPanel in i en enhetlig CapturePanel.
  - Ny props: `allowFiles?: boolean`, `maxFiles?: number` (default 8), `sourceModule: string`.
  - Flöde: text/filer val → analyzing (metadata + inkast klassificering) → preview → confirm (edit) → done.
  - Använder befintliga backend-call `submitInkastLite` via inkastService.
  - Stödjer audio MIME och dokument enligt `inkastMimeTypes.ts`.
  - Upprätthåller nödvändiga locked UX-komponenter: InkastConfirmPanel, InkastManualEditForm, TaggSelector, HITL-broar.

- `src/modules/capture/CaptureSuperModule.tsx`
  - Exponerar `mode` prop: `'text' | 'files' | 'preview' | 'confirm'`.
  - Modulen hanterar hela ingest-flödet per hub/enhetligt, anropas av inkast-delegates.

- Delegates rewired till `CaptureSuperModule` / `CapturePanel`:
  - `FamiljenInkastDelegate.tsx` — `sourceModule="familjen"`
  - `PlaneringInkastDelegate.tsx` — `sourceModule="planering_inkorg"`
  - `EkonomiInkastDelegate.tsx` — `sourceModule="ekonomi_inkast"`
  - Hem capture (HomeAdaptiveCompass) — `sourceModule="hem_capture"`
  - MåBra inkast — `sourceModule="mabra_inkast"`

- `src/modules/capture/InkastDirectPanel.tsx`
  - Markeras som deprecated.
  - Kommentar om migration: peka användare till CapturePanel.
  - Ej borttagen förrän migration steg 2 verifierad och smoke PASS.

- `src/modules/capture/VaultInkastCompact.tsx`
  - Oförändrad, hålls separat på grund av strikt Valv-silo.

## Säkerhetsgränser och design

- Följer strikt Obsidian Calm temafärger och klasser:
  - Bakgrunder: `bg-surface`, `bg-surface-2`
  - Text: `text-accent`, `text-text-muted`
  - Taggar: `chip--active`, `chip--idle`
- Ingen hårdkodning av hex-färger.

## Verifiering

- Kör `npm run build` utan fel.
- Kör `npm run smoke:locked-ux` — inga regressionsfel.
- Kör `npm run smoke:inkast` — statisk build smoke (backend oförändrad i PHASE-03).
- Använd UI manuellt och kontrollera flöden för text och filuppladdning med preview och HITL.

---

# Kort beskrivning av logik och flöde i CapturePanel

- Användaren kan antingen skriva text eller välja filer (audio, dokument).
- Vid filval valideras MIME och antal mot props.
- Vid submit anropas `previewInboxClassification` för G10-klassificering (local/Cloud).
- Användaren får AI-genererad preview av taggar, kategori etc.
- Efter bekräftelse körs `submitInkastLite` med metadata + innehåll.
- Eventuellt HITL-steg aktiveras för barn/valv enligt säkerhetskrav.
- Flödet är ett state-maskin som hanterar mode-switchar och UX transitions.

---

# Kommentar

All kod är skriven för att respektera strikt silo-separation och säkerhetsprinciper enligt Kanon och säkerhetsdokumenten. Ingen backend-logik eller firestore.rules har ändrats. Zero Footprint princip gäller fortsatt i UI: inget sparas innan explicit save.

---

Vill du ha de fullständiga TypeScript-källkoderna för alla modifierade filer?
