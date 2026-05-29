# Familjen — hub & underflikar (design lock)

**Route:** `/familjen` · **Kod:** `src/modules/barnens_livsloggar/components/FamiljenPage.tsx`

## Fem underflikar

| Flik | Syfte |
|------|--------|
| **Reflektion** | Barnfokus-frågor (låst), balans 7 d, fråga livslogg-RAG per barn |
| **Livslogg** | Fysiologi, observationer, tidslinje, bevis-val → Valv |
| **Tillsammans** | Familjeöversikt, veckodiagram, dagens ankare |
| **Mönster** | Deterministisk frekvens i barnloggar + länk Valv Mönster |
| **Kunskapshub** | Sök: Hela Minnet · Valv · Barnloggar · Uppladdade filer |

## Kunskapshub (kritisk)

- **Hela Minnet:** `knowledgeVaultQuery` (kampspar + kb_docs)
- **Valv-Chat:** `valvChatQuery` (kräver valv-PIN)
- **Barnloggar:** `childrenLogsQuery` (barn-silo)
- **Filer:** `KunskapsvalvFileIngest` → text: `ingestKampsparEntry` · PDF/bild: `ingestKnowledgeDocument` (Gemini) — samma bank överallt

**Regel:** Filuppladdning i Familjen (och framtida moduler) ska använda `KunskapsvalvFileIngest` — inte parallell index.

## Låst UX

- Barnfokus: `BarnfokusFraganPanel`, knapp **Spara till {barn}s logg**, minneslista under formulär
- Se `.context/locked-ux-features.md` §1

## URL

`?tab=reflektion|livslogg|tillsammans|monster|kunskap`

## Funktionsutbyggnad (plan — ej C-aurora-design)

**Kanon:** [`FAMILJEN-BARN-SIDOR-FUNKTIONER.md`](./FAMILJEN-BARN-SIDOR-FUNKTIONER.md)  
**Referens (funktion endast):** [`themes/C-nordic-aurora/03-barnfokus.png`](./themes/C-nordic-aurora/03-barnfokus.png) — familje-dashboard, barnprofil (stunder/om/favoriter), formulär «Ny stund» med humör, bild och «spara som ankare».

| Område | Status |
|--------|--------|
| Dagens ankare + veckodiagram | Delvis (`FamiljenTillsammansTab`) |
| Barnprofil-flikar (Stunder/Om/Favoriter) | **Finns** på Livslogg |
| Ny stund (sheet, humör, ankare-toggle) | P2 |

Låst barnfokus (`BarnfokusFraganPanel`) ska **inte** ersättas — kompletteras.

## Visuell polish (2026-05)

- CSS: `.familjen-hub` i `src/index.css` — aurora (emerald), guld ankare, barn-chips
- Mockup-nära utan nature-regnbåge (Obsidian Calm + emerald accent)
- **Visuell** riktning: Obsidian Calm — **inte** Nordic-aurora-glass från `03-barnfokus.png`
