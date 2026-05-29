# Dagbok v2 (Lager 1) — Vertex AI Studio-arkitektur

**Källa:** Vertex AI Studio (användarens export, 2026-05-29)  
**Kontext:** Repomix `repomix-dagbok.txt` + [`docs/specs/modules/Dagbok-SPEC.md`](../specs/modules/Dagbok-SPEC.md)  
**Status:** Planeringsunderlag — **ej implementerat** i kod förrän Fas 1 godkänns  
**Genomförbarhetsplan:** [`2026-05-29-dagbok-vertex-plan.md`](./2026-05-29-dagbok-vertex-plan.md)

---

## Arkitekturspecifikation: Dagbok v2 (Lager 1)

Denna specifikation utökar dagboken till ett djupare, mer funktionellt men fortfarande djupt lugnande verktyg i linje med Obsidian Calm-temat. Den respekterar de strikta arkitektoniska gränserna mellan Lager 1 (personligt mående) och Lager 2 (Reality Vault/juridisk bevisföring).

### 1. Informationsarkitektur (IA)

För att motverka kognitiv överbelastning (ADHD/GAD) använder vi progressivt avslöjande (progressive disclosure). Dagboken delas upp i max tre huvudlägen i en mjuk, guldaccentuerad segmenterad kontroll (Sub-navigation) i toppen av `/dagbok` (under fliken "Reflektion").

```
[/dagbok] ── [Flik: Reflektion]
                │
                ├─── Läge 1: SNABB (Låg tröskel, snabb check-in av humör + taggar på 15 sek)
                ├─── Läge 2: REFLEKTERA (Djupt skrivande/röst, KBT-prompter, kategorier & 1 bilaga)
                └─── Läge 3: ARKIV (Sökbart, filtrerat, kronologiskt och läsvänligt - skrivskyddat)
```

**Navigeringsflöde och interaktionston**

- **Snabb:** Visas som standard om användaren har låg energi (t.ex. vid direkt-inbound från MåBra `/mabra`). Fokus på humör-pills och snabba taggar med "Spara känslan direkt"-stöd.
- **Reflektera:** För djupare bearbetning. Visar textfält, röstinspelning (Web Speech API) och KBT-prompter. Fler val (kategori, personlig bilaga) avslöjas först när användaren interagerar med texten eller trycker på "Lägg till detaljer".
- **Arkiv:** Ett vilsamt bibliotek av tidigare tankar. Ingen redigering är tillåten (WORM — Write Once, Read Many), vilket skapar en trygghet i att "det som är skrivet är skrivet".

### 2. Utökad datamodell `journal` (Firestore)

Eftersom kollektionen är WORM (append-only) tillåter vi endast create-anrop via Firestore Security Rules. Inga update- eller delete-operationer.

**Fält som behöver Rules-Review (Firestore Security Rules)**

Eftersom vi inte ändrar `.rules` direkt i denna fas, identifierar vi här de nya fälten som säkerhetsreglerna måste validera vid create (Rules-Review):

| Fält | Validering (målbild) |
|------|----------------------|
| `tags` | Array av strängar (max 10 element, max 30 tecken per sträng) |
| `category` | Sträng (strikt lista: tacksamhet, orostanke, relationer, kropp, vardag, insikt) |
| `attachment` | Map eller null — `url`, `storagePath`, `name`, `mimeType`, `size` |
| `voiceNoteUrl` | Sträng (URL) eller null |

**JSON-exempel (dokument i `journal`)**

```json
{
  "id": "entry_9b1deb4d3a1a",
  "userId": "user_obsidian_99",
  "ownerId": "user_obsidian_99",
  "createdAt": "2026-05-29T03:45:00.000Z",
  "mood": "Oro",
  "text": "Kände en våg av oro inför mötet idag, men röstmemot hjälpte mig att landa i kroppen.",
  "category": "orostanke",
  "tags": ["arbete", "kroppsligt", "reaktiv"],
  "attachment": {
    "url": "https://firebasestorage.googleapis.com/v0/b/.../journal_memories/img_456.jpg",
    "storagePath": "users/user_obsidian_99/journal_memories/entry_9b1deb4d3a1a/img_456.jpg",
    "name": "andningsövning.jpg",
    "mimeType": "image/jpeg",
    "size": 102457
  },
  "clientMetadata": {
    "os": "iOS",
    "appVersion": "2.1.0"
  }
}
```

### 3. Storage-struktur för bilagor

Lager 1-bilagor sparas i en egen isolerad katalog i Firebase Storage, helt skild från `/reality_vault/` för att förhindra oavsiktlig exponering eller sammanblandning av personliga minnen med juridiska bevis.

**Sökväg:** `users/{userId}/journal_memories/{entryId}/{filename}`

**Begränsningar (Fas 2)**

- Max 1 fil per dagboksanteckning
- Max storlek: 5 MB
- MIME: `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `application/pdf`

### 4. UI-wireframes i text (mobil 390px)

**Färgpalett & typografi (Obsidian Calm)**

| Element | Värde |
|---------|--------|
| Bakgrund | `#020617` (slate-950) |
| Kort/Ytor | `#0f172a` (slate-900 / glass) |
| Aktiv pill / text | `#f8fafc` (slate-50), Inter |
| Text sekundär | `#94a3b8` (slate-400), Inter |
| Accent/Guld | `#d4af37` (Muted Gold), Outfit |
| Gränser | `#1e293b` (slate-800) |

*(Wireframes för SNABB, REFLEKTERA, ARKIV — se original i Vertex-export; humör-etiketter i wireframe avviker från kodens `MOOD_CATALOG` — planen använder befintlig katalog.)*

### 5. Handoff till Reality Vault (Lager 2)

Ingen automatisk synk eller överföring (plausible deniability). Handoff-box vid juridiska nyckelord i text eller via info vid uppladdning.

**Copy (lugn ton, ingen röd banner):**

- Rubrik: *Spara som formellt bevis?*
- CTA: *Öppna Reality Vault →* → `/dagbok?tab=bevis`

**Trigger-nyckelord (regex):** bevis, hotad, polis, stämma, händelseförlopp, trakasserad, m.fl.

### 6. Implementationsplan (Fas 1–4) & smoke

| Fas | Mål |
|-----|-----|
| **1** | Sub-nav Snabb / Reflektera / Arkiv; Snabb sparar mood + tags + valfri text |
| **2** | Storage `journal_memories`, max 1 bilaga, 5 MB, MIME-validering |
| **3** | Arkiv: klientsök + humör-/kategorifilter, paginering |
| **4** | Handoff-box (regex) + Obsidian Calm-polish + WCAG AA |

**Smoke (förslag till `docs/SMOKE_CHECKLIST.md` #2):**

- Sub-nav laddas utan renderingstrassel
- Snabb-spar: humör + tagg → Firestore utan `updatedAt`
- Arkiv: ingen redigering/radering i UI
- 6 MB fil → mjukt fel, ingen upload
- Text med "bevis"/"polis" → Handoff-box
- CTA → `/dagbok?tab=bevis`

### 7. Berörda repo-filer (Vertex-förslag)

| Fil | Åtgärd |
|-----|--------|
| `src/modules/diary/diary/components/DagbokPage.tsx` | `mode`: snabb \| reflektera \| arkiv |
| `src/modules/diary/diary/hooks/useJournalFlow.ts` | category, tags, attachment |
| `src/modules/core/firebase/firestore.ts` | Utökad `saveJournalEntry` |
| `src/modules/diary/diary/components/JournalArchive.tsx` | Sök + filter |
| `src/modules/diary/diary/utils/journalUploadHelper.ts` | **Ny** (Fas 2) |
| `src/modules/diary/diary/components/HandoffBox.tsx` | **Ny** (Fas 4) |

---

*Arkiverad Vertex-output — implementera enligt plan, inte ordagrant wireframe-humör.*
