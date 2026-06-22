# _MALL — Promtmästare-strukturmall

**Syfte:** Kopiera denna mall när du skapar en ny Promtmästare-fil.  
Ersätt allt inom `[HAKPARENTESER]`.

---

```
# Promtmästare — [ÄMNE] · Fas [N] · [SYFTE]

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/architecture.md
@.context/agents.md
@.cursor/rules/livskompassen-core.mdc
@[ÄMNESSPECIFIK-SPEC.md]
@[ÄMNESSPECIFIK-REGEL.mdc]
# Lägg till fler @-mentions efter behov

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
[KLISTRA IN HELA MASTER-REGLER HÄRIFRÅN — se 00-MASTER-REGLER.md]

---

## Ämnets kontext

**Modul:** [Modulnamn]  
**Aktuell fas:** [Fas N av N]  
**Fas-syfte:** [En mening om vad denna fas ska åstadkomma]

### Vad som är klart (DONE):
- [x] [Klart steg 1]
- [x] [Klart steg 2]

### Vad som fattas (TODO):
- [ ] [Saknat steg 1]
- [ ] [Saknat steg 2]

### Nyckelfiler att känna till:
- `[src/modules/XXX/XXX.tsx]` — [vad filen gör]
- `[functions/src/XXX.ts]` — [vad filen gör]
- `[docs/specs/modules/XXX-SPEC.md]` — [spec-fil]

---

## Fas [N]-uppdrag

**Läge:** [READ-ONLY / DESIGN / IMPLEMENTATION / REVIEW]

[Beskriv exakt vad agenten ska göra — preciserat, utan tolkningsutrymme.]

### Steg (i ordning):
1. [Konkret steg 1]
2. [Konkret steg 2]
3. [Konkret steg 3]

---

## Leveransformat

Returnera som [markdown checklist / JSON / kodfil / rapport]:

```json / ```markdown
[Exempelformat]
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: merge till `main` utan PMIR + Pontus godkänt
- ALDRIG: ändra `firestore.rules` utan PMIR
- ALDRIG: ta bort/döpa om Locked UX-komponenter
- ALDRIG: prompt utanför `functions/src/sharedRules.ts`
- ALDRIG: Cross-silo RAG (Valv-data i Kunskap, eller tvärtom)
- ALDRIG: diagnosetiketter på motpart i WORM
- [ÄMNESSPECIFIKA stopp]
```
