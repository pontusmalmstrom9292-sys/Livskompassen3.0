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
- **Filer:** `KunskapsvalvFileIngest` → `ingestKampsparEntry` — samma bank överallt

**Regel:** Filuppladdning i Familjen (och framtida moduler) ska använda `KunskapsvalvFileIngest` — inte parallell index.

## Låst UX

- Barnfokus: `BarnfokusFraganPanel`, knapp **Spara till {barn}s logg**, minneslista under formulär
- Se `.context/locked-ux-features.md` §1

## URL

`?tab=reflektion|livslogg|tillsammans|monster|kunskap`
