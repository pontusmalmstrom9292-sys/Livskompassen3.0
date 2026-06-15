# Pack 04 — Hjärtat + Dagbok

**Senast uppdaterad:** 2026-06-15  
Ladda upp `exports/gpt-handoff/repomix/gpt-pack-04-hjartat.md` till GPT när pack 01–03 är granskade.

**Kontext:** Dock visar **Hjärtat** (F2). Legacy `/dagbok` redirectar till `/hjartat`. Hem (`/`) har `CaptureSuperModule` för snabb inkast.

---

## Prompt för GPT

Du granskar **Hjärtat** (`/hjartat`) — reflektion (dagbok) och speglar.

**Målbild:** Hjärtat som primär start efter inloggning — god morgon, dagens fokus, nästa mikrosteg (ännu ej fullt implementerat; `/` är fortfarande Hem med capture).

**Fokus:**

1. Hub: `DagbokPage` med `?tab=reflektion` | `speglar`
2. Superhub: `DagbokInputSuperModule`, `DagbokInputRoutes` (`/hjartat/input`)
3. Journal-silo: `journal` collection — Zero Footprint för speglar
4. **Ingen** publik bevis-flik — bevis → `/valvet` (plausible deniability)
5. **Inkast-koppling** — `InkastDagbokWeaveBridge`, `CaptureSuperModule` på Hem vs Hjärtat-inline
6. Legacy: `/dagbok` → `/hjartat` redirect i `AppRoutes`

### Verifiera

- [ ] Speglar utan persistent RAG (Zero Footprint, U4)
- [ ] Journal append-only där WORM gäller
- [ ] Ingen cross-RAG till Kunskap eller Valv från speglar-session
- [ ] `mabraCoachGuard` redirectar ex/konflikt till Speglar — inte MåBra
- [ ] Dock-label = Hjärtat, route = `/hjartat`

### Uppgift

1. Beskriv relationen Hem (`/`) vs Hjärtat (`/hjartat`) — dubbel capture-risk?
2. Föreslå om `/` ska ersättas av Hjärtat som default landing (koppla till Våg B).
3. Verifiera att speglar-session rensas vid logout/blur (Zero Footprint).

**Ge INTE kod.** Beslutsmemo: Godkänn / Ändra X / Defer.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
