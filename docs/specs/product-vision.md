# Product Vision — Livskompassen v2

**Källa:** Blueprint v1.1 + v2-arkitektur (Firebase, Obsidian Calm)  
**Status:** Canonical produktreferens

---

## Kärna (MVP+)

**Arkitektur (låst):** [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md) — *Det yttre lugnet* utanför valvet, *Det inre försvaret* innanför Fyren.

| Område | Syfte |
|--------|--------|
| **Dagbok (Lager 1)** | Tacksamhet/humör — **Det yttre lugnet**; appens lugna ansikte utåt |
| **Verklighetsvalvet (Lager 2)** | **Det inre försvaret** — WORM-bevisbank, Orkestern, Mönstersökaren (G19–G21) |
| **Speglings-Systemet** | ACT + VIVIR + känsla vs bevis |
| **Safe Harbor** | BIFF/Grey Rock för ex-kommunikation |
| **Barnens livsloggar** | Neutral dokumentation, Balansmätare |
| **Kompasser** | Morgon/dag/kväll — ett mikrosteg |
| **Zero Footprint + Kill Switch** | Session rensas vid panik/background |

## Viktigt (nästa vågor)

| Område | Syfte |
|--------|--------|
| **Ekonomi v1** | Veckopeng, "vad har jag kvar" — inga grafer |
| **Kunskap / Minne** | RAG, Tidshjulet, Drive-ingest |
| **Dossier-Generator** | PDF/JSON för juridiskt ombud |
| **Notiser** | Max 2–3 diskreta puffar/dag (kompasser) |

## Nice-to-have

- Röst-till-text dagbok
- Vector Search 2.0 full aktivering
- DCAP → Speglings-Coachen AI
- Data Connect för ekonomi

## Personliga mål (produktstyrning)

- Kognitiv avlastning: ADHD/GAD, hypervigilans — ett steg i taget
- Grey Rock/BIFF utan JADE i ex-kontakt
- Parallel föräldraskap: barnen som trygg hamn, neutral loggning
- Juridisk trygghet: tidsstämplad, oföränderlig dokumentation

## Teknik (ej förhandlingsbar)

- Firebase Firestore + Cloud Functions — **inte** Google Kalkylark/GAS
- WORM append-only för bevis
- CMEK, AuthGate på känsliga moduler
- Design: [`design-master.md`](design-master.md) — Obsidian Calm (Riktning A)

## Sacred Features

Verklighetsvalvet, Sanningens Sköld (backend), Morgonkompassen, Dossier-Generator, Speglings-Systemet, Zero Footprint, Kill Switch.
