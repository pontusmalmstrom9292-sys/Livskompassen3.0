# Dagbok v2 — genomförbarhetsplan (Vertex → kod)

**Datum:** 2026-05-29  
**Vertex-spec:** [`2026-05-29-dagbok-vertex-spec.md`](./2026-05-29-dagbok-vertex-spec.md)  
**Kanon:** [`docs/specs/modules/Dagbok-SPEC.md`](../specs/modules/Dagbok-SPEC.md) · [`.context/modules/dagbokshubben.md`](../../.context/modules/dagbokshubben.md)

## Slutsats

**Ja — vi kan bygga detta**, i fyra faser som Vertex föreslår. **Fas 1 är redo att starta** utan ändring av `firestore.rules` eller `storage.rules`. **Fas 2 kräver explicit godkännande** (ny Storage-sökväg + rules). Inget bryter U1–U6 (journal förblir Lager 1; ingen auto-sync till `reality_vault`).

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Sub-nav Snabb/Reflektera/Arkiv; WORM; Lager 1/2-separation; ADHD progressiv disclosure |
| **Entities** | `journal` (+ valfria `tags`, `category`, `attachment`); Storage `journal_memories` (Fas 2) |
| **Approach** | Fas 1 UI + datamodell i klient; befintlig wizard → Reflektera; Snabb = mood-only + taggar |
| **Structure** | `DagbokPage` mode state; nya små komponenter; inte monolit |
| **Operations** | `saveJournalEntry` utökad; `getJournalEntries` oförändrad läsning |
| **Norms** | Obsidian Calm; inga streak/XP; Handoff utan röd banner |
| **Safeguards** | WORM; ingen Valv-auto-promotion; weave/kampspar opt-in oförändrad |

---

## Gap-analys (Vertex vs kod idag)

| Vertex | Kod idag | Gap |
|--------|----------|-----|
| Sub-nav Snabb / Reflektera / Arkiv | En wizard (`mood` → `text` → `save` → `done`) | **Saknas** — Fas 1 |
| Snabb = default vid låg energi | `lowEnergyBridge` från MåBra (`?from=mabra&energy=low`) + `handleSaveMoodOnly` | **Delvis** — behöver eget Snabb-UI + taggar |
| Reflektera + "Lägg till detaljer" | `ReflectionStep` har redan röst (Web Speech), KBT-chips, tre ord | **Map** wizard till Reflektera; lägg category/tags bakom disclosure |
| Arkiv sökbart | `JournalArchive` bakom `VaultZoneGate` endast på mood-steg | **Flytta** till Arkiv-läge; sök/filter Fas 3 |
| `tags`, `category`, `attachment` | Endast `mood` + `text` i `saveJournalEntry` | **Fas 1** fält i API/types; **Fas 2** attachment |
| Humör-pills i wireframe (Neutral, Sänkt…) | `MOOD_CATALOG` (Lugn, Glad, Oro, … 12 st) | **Använd kod** — uppdatera inte etiketter i Vertex-wireframe |
| Handoff → `/dagbok?tab=bevis` | `HjartatPage` har `tab=bevis` | **OK** — Fas 4 `HandoffBox` |
| Storage `journal_memories/` | Finns **inte** i `storage.rules` | **Blocker Fas 2** tills user godkänner rules |
| Rules-validering tags/category | `journal`: `create` om `isOwnerCreate()` — **ingen fältvalidering** | **Rules-Review** rekommenderas före prod, inte blocker för dev |

### Bevaras (MUST NOT regress)

- `weaveJournalEntry` + opt-in `journalWovenToKampspar` (`ConfirmStep`, PIN `dagbok_forensic`)
- MåBra-bro (`mabraBridge`, `lowEnergyBridge`)
- `HomeDagbokPanel` — anropar `saveJournalEntry({ mood, text })`; ska tolerera utökad signatur med defaults
- WORM: inga update/delete i UI eller rules
- Ingen auto-kopiering journal → `reality_vault`

---

## Fas 1 — rekommenderad första leverans

**Mål:** Sub-navigation + Snabbläge + utökad save (tags, category, valfri tom/snabbtext) utan Storage.

### Nya/ändrade filer

1. `constants/journalCategories.ts` — tillåten lista (Vertex)
2. `constants/journalTags.ts` — förslagstaggar (Sömn, Relationer, …)
3. `components/DagbokModeNav.tsx` — segmenterad kontroll (guld-indikator)
4. `components/JournalQuickMode.tsx` — humör + taggar + valfri rad + Spara
5. `DagbokPage.tsx` — `mode` state; default `snabb` om `lowEnergyBridge`, annars `reflektera`
6. `useJournalFlow.ts` — `tags`, `category`; `persistEntry` skickar till Firestore
7. `types/journal.ts` — valfria fält på `JournalEntry`
8. `firestore.ts` — `saveJournalEntry` med valfria `tags?`, `category?`

### Reflektera-läge (Fas 1 minimal)

- Befintlig wizard kvar under `mode === 'reflektera'` (ingen stor omskrivning dag 1)
- Arkiv-läge: visa `JournalArchive` utan wizard; PIN-gate kvar för forensic/weave-zon om vi behåller nuvarande policy — **beslut:** arkivläsning kan vara öppen för egna poster utan PIN (Vertex: "vilsamt bibliotek"); weave-opt-in fortfarande PIN. *Rekommendation:* läs arkiv utan PIN; weave/kampspar kvar bakom gate i ConfirmStep.

### Acceptans (Fas 1)

- [x] Växla Snabb / Reflektera / Arkiv utan full page reload
- [x] Snabb: spara med mood + valfria taggar eller stub-text
- [x] Firestore: ny rad i `journal`, `createdAt` server, ingen `updatedAt`
- [x] `npm run build` + `npm run smoke:locked-ux` PASS
- [x] Uppdatera `Dagbok-SPEC.md` §3 (UX)

### Uppskattad omfattning

~1 session (4–8 filer, inga backend-functions).

---

## Fas 2 — Storage (kräver godkännande)

- Ny `journalUploadHelper.ts`
- `storage.rules`: `match /users/{userId}/journal_memories/{entryId}/{allPaths=**}`
- Skapa journal-doc först → `entryId` → upload → patch? **Nej** — WORM: skriv `attachment` metadata i **samma** create efter upload, eller upload före create med genererat id (client-side doc id via `doc(collection(...))` pattern)

**Blocker:** utan user OK på `storage.rules` — stanna efter Fas 1.

---

## Fas 3 — Arkiv UX

- Sökfält + humörfilter (från `MOOD_CATALOG`)
- Kategorifilter när `category` finns på poster
- Paginering ("Visa fler") om `getJournalEntries` limit < behov

---

## Fas 4 — Handoff + polish

- `HandoffBox.tsx` + regex i `ReflectionStep` / Snabb textfält
- Navigering `Link` → `/dagbok?tab=bevis`
- Kontrastkontroll guld/slate (WCAG AA)
- Smoke-rader i `docs/SMOKE_CHECKLIST.md` #2

---

## Risker

| Risk | Åtgärd |
|------|--------|
| Shadow fields i `journal` | Planera rules-validering (max tags, enum category) i separat PMIR |
| Humör-etikett-drift | En källa: `moods.ts` |
| Dubbel arkiv (mood-steg + arkiv-läge) | Ta bort arkiv från mood-steg när Arkiv-läge finns |
| `voiceNoteUrl` i Vertex | **Ej Fas 1** — ReflectionStep transkriberar till text idag |

---

## Nästa steg (ett beslut)

Godkänn **Fas 1-implementation** i Agent-läge. Då bygger vi sub-nav + Snabbläge + utökad `saveJournalEntry` utan Storage och utan `firestore.rules`-diff.

**Prompt för Cursor (Fas 1):**

```
Implementera Dagbok v2 Fas 1 enligt docs/evaluations/2026-05-29-dagbok-vertex-plan.md.
Sub-nav Snabb/Reflektera/Arkiv på DagbokPage. Snabb: MOOD_CATALOG + taggar + valfri text, spara via utökad saveJournalEntry (tags, category valfritt).
Behåll wizard som Reflektera, weave/PIN, MåBra-bro. Arkiv-läge: JournalArchive utan wizard.
Ändra INTE firestore.rules eller storage.rules. Kör npm run build och npm run smoke:locked-ux.
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```

---

## Referenser (kod)

```27:31:firestore.rules
    match /journal/{docId} {
      allow read: if isOwner();
      allow create: if isOwnerCreate();
      allow update, delete: if false;
    }
```

```106:114:src/modules/core/firebase/firestore.ts
export async function saveJournalEntry(
  userId: string,
  entry: { mood: string; text: string }
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.journal);
  const ref = collection(db, 'journal');
  const docRef = await addDoc(ref, withUserId(userId, entry));
  return docRef.id;
}
```

```79:85:src/modules/diary/diary/hooks/useJournalFlow.ts
  const handleSaveMoodOnly = async () => {
    if (lowEnergyBridge && mabraHub) {
      await persistEntry(MABRA_MOOD_ONLY_TEXT[mabraHub]);
      return;
    }
    await persistEntry(MOOD_ONLY_STUB(mood));
  };
```
