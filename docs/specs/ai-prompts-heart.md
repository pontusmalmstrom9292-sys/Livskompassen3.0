# AI-prompter — Hjärtklustret (Dagbok, Valv, Speglar)

Kopiera **master + en modul** per konversation till extern AI (Gemini m.m.).

---

## Master-prompt

```
Du har hjälpt mig planera Livskompassen. Jag bygger v2 i Cursor med Firebase (INTE Google Kalkylark/GAS).

Leverera ETT moduldokument i markdown med rubriker 1–11:
1. Syfte och användarbehov
2. Route och ingång
3. UX-flöde (progressive disclosure)
4. Visuell design enligt docs/specs/design-master.md (Obsidian Calm, Riktning A)
5. Datamodell (Firestore, WORM)
6. Backend/agenter
7. Säkerhet
8. Status idag vs planerat
9. Acceptanskriterier
10. Kopplingar
11. Navigation variant A och B

Design: bg #020617, guld #FDE68A, indigo #818CF8, emerald #2DD4BF, Outfit+Inter.
Förbjudet: lila, turkos, regnbåge, nature themes, count-up.

Sacred Features: Verklighetsvalvet, Speglings-Systemet, Zero Footprint, Kill Switch.
Routes: /dagbok, /valv, /speglar (+ övriga i repo).

Modul:
```

---

## Dagbok

```
MODUL: Dagbokshubben (Lager 1). Route /dagbok, AuthGate, dock BookOpen.
Befintlig: wizard humör→text→bekräfta→sparad, journal, weaveJournalEntry, src/modules/dagbok/.
Planera: bro /speglar, röst sv-SE, arkiv. Variant B: långtryck dagbok→valv.
Output: Dagbok-SPEC.md
```

---

## Verklighetsvalvet

```
MODUL: Verklighetsvalvet (Sacred, Lager 2). Route /valv, Shield 3s, PIN, WORM.
Befintlig: VaultPage, saveVaultLog, Shake-to-Kill.
Planera: tvåspalt, magkänsel, trestegs-sköld, media, röst, PDF, panik-stäng.
Output: Verklighetsvalvet-SPEC.md
```

---

## Speglar

```
MODUL: Speglings-Systemet (Sacred). Route /speglar, ej dock. ACT, VIVIR, EvidenceCompareView.
Planera: DCAP→Speglings-Coachen, ingång från dagbok. Accent #6366F1 för AI.
Output: Speglar-SPEC.md
```

---

## Cursor efter upload

```
Jag laddar upp [MODUL]-SPEC.md. Konsolidera till .context/modules/, synka module_plan.md, lista gap — implementera inte förrän jag säger kör.
```
