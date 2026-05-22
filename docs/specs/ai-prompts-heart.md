# AI-prompter — Hjärtklustret (Dagbok, Valv, Speglar)

Kopiera **master + en modul** per konversation till extern AI (Gemini m.m.).

**Full modulöversikt (Kunskap, Barnen, Måbra, kladd):** [`ai-prompts-moduler-master.md`](ai-prompts-moduler-master.md)

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
MODUL: Verklighetsvalvet (Sacred, Lager 2 — Sanningens Sköld).

Route: /dagbok?tab=bevis (redirect /valv). AuthGate. Fyren: 3s long-press dock BookOpen → WebAuthn → PIN.

SYFTE: WORM-bevisbank mot gaslighting. Skild från Dagbok (Lager 1) och Kunskap (kb_docs).

FUNKTIONER IDAG:
- VaultPage: PIN-gate, flikar Logga | Sök (Valv-Chat)
- entryType: simple, two_column, three_shield, body_signal
- Klient saveVaultLog → reality_vault (append-only, assertWormPayload)
- Media: uploadVaultEvidence → evidenceUrl (en fil)
- Röst: Web Speech sv-SE → truth (ingen ljud-Blob)
- ValvChatPanel → valvChatQuery → Sannings-Analytikern (token-match vaultRag)
- Per-post PDF: exportVaultRecordAsPdf
- Shake-to-Kill (15 m/s², 2s debounce); flikbyte låser session

PLANERAT: dölj synlig Bevis-flik (Fyren only), klickbara citations, Drive→valv manuellt, Dossier batch PDF, Sanningens Ankare

KOPPLINGAR: Dagbok (vävaren_metadata), Valv-Chat, Speglar, Hamn (valfri save), Kunskap (skild — Drive→kb_docs)

Output: [`docs/specs/modules/Verklighetsvalvet-SPEC.md`](modules/Verklighetsvalvet-SPEC.md) (konsoliderad 2026-05)
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
