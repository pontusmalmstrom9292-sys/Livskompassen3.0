# Pre-Merge Impact Report (PMIR) — Dagbok v2 + Planering Fas 1.5

**Datum:** 2026-05-29  
**Gren:** lokala ändringar på **`main`** (ej pushad)  
**Agent / session:** Modul Cursor-plan rollout

---

## Följer med till main

- [x] **Dagbok v2 Fas 1–3:** sub-nav Snabb/Reflektera/Arkiv, taggar/kategori, arkiv sök/filter/paginering
- [x] **Dagbok Fas 2:** `journal_memories` Storage, `JournalDetailsPanel`, `JournalMemoryPicker`, upload helper
- [x] **Planering Fas 1.5:** dock → `/planering?tab=handling`, deadline i snabb-lägg, Framsteg-flik, Fokus-knappar
- [x] **Docs:** `Dagbok-SPEC.md`, `dagbok-vertex-plan.md`, `planering-cursor-plan.md`
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS**
- [x] Barnfokus · Valv Mönster/Orkester · Planering P3 · Fyren · Barnporten · sidomeny — oförändrade låsta flöden

**Ej med i commit (rekommenderat):** `repomix-dagbok.txt` — lokal Vertex-export, lägg i `.gitignore` eller arkiv om den ska sparas.

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren | N/A — arbete på `main` |
| Uncommitted om `git restore` | All Dagbok/Planering-kod ovan |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, `grunder-kanon.mdc` U1–U6 | **PASS** — journal WORM; ingen cross-RAG; ingen fjärde silo |
| **Design** | `locked-ux-features.md`, Planering hybrid, Dagbok-SPEC | **PASS** — P3 Kanban kvar; weave opt-in kvar |
| **Säkerhet** | `.context/security.md`, `storage.rules` | **GAP review** — ny sökväg `journal_memories/` (append-only, uid-scoped). **Ej** `firestore.rules`-diff. |

### storage.rules (Dagbok Fas 2)

```19:24:storage.rules
    match /users/{userId}/journal_memories/{entryId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if false;
    }
```

**Prod:** `firebase deploy --only storage` efter merge.

---

## Smoke (lokal, före commit)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | Ej körd denna session — kör vid merge om önskat |

---

## Rekommendation

- [x] Commit på `main` (en eller två commits: dagbok + planering)
- [ ] Push `origin main` — **väntar användare**
- [ ] Deploy `storage.rules` efter push
- [ ] **Ej** gren-radering

---

## Godkännande

**Användaren:** ☐ godkänn merge/commit · ☐ avbryt  
**Datum:** ___________

Se: [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) · [`2026-05-29-dagbok-vertex-plan.md`](./2026-05-29-dagbok-vertex-plan.md) · [`2026-05-29-planering-cursor-plan.md`](./2026-05-29-planering-cursor-plan.md)
