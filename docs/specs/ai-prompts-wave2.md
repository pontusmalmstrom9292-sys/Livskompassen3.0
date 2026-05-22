# AI-prompter — Våg 2 (Hamn, Barnen, Kompasser, Dossier, Valv-Chat)

Kopiera **master + en modul** per konversation till extern AI (Gemini m.m.).

**Full modulöversikt (Kunskap, Dagbok, Måbra, kladd):** [`ai-prompts-moduler-master.md`](ai-prompts-moduler-master.md)

---

## Master-prompt

```
Du har hjälpt mig planera Livskompassen. Jag bygger v2 i Cursor med Firebase (INTE Google Kalkylark/GAS).

Leverera ETT moduldokument i markdown med rubriker 1–11:
1. Syfte och användarbehov
2. Route och ingång
3. UX-flöde (progressive disclosure)
4. Visuell design enligt Obsidian Calm (bg #020617, guld #FDE68A, indigo #818CF8, emerald #2DD4BF, Outfit+Inter)
5. Datamodell (Firestore, WORM)
6. Backend/agenter
7. Säkerhet (AuthGate, Zero Footprint, CMEK)
8. Status idag vs planerat
9. Acceptanskriterier
10. Kopplingar till andra moduler
11. Navigation

Förbjudet: lila, turkos, regnbåge, nature themes, count-up.
Sacred Features: Verklighetsvalvet, Speglings-Systemet, Morgonkompassen, Dossier, Zero Footprint, Kill Switch.

Modul:
```

---

## Safe Harbor (Hamn)

```
MODUL: Safe Harbor / Hamn. Route /hamn, AuthGate, dock Anchor.
Befintlig: SafeHarborPage, analyzeMessage callable, BIFF/Grey Rock-svar.
Planera: Brusfiltret som valfritt steg före BIFF, bro från /speglar, Zero Footprint (ingen sparad råtext utan consent).
Output: SafeHarbor-SPEC.md
```

## Barnens livsloggar

```
MODUL: Barnens livsloggar (Familjen). Route /familjen (redirect /barnen), AuthGate, dock Heart.
Befintlig: PIN, Kasper/Arvid, fysiologi, livslogg, Balansmätare 7d, JSON-export, children_logs WORM.
Planera: wizard, PDF/Dossier per barn, incident→valv explicit med sourceRef.
Output: [`docs/specs/modules/Barnen-SPEC.md`](modules/Barnen-SPEC.md) (konsoliderad 2026-05)
```

## De 3 Kompasserna

```
MODUL: De 3 Kompasserna (Morgonkompassen, Dagskompassen, Kvällskompassen). Route /kompasser, dock Sprout.
Befintlig: DashboardPage med morgon/dag/kväll-flöden, saveCheckIn → Firestore checkins, ett mikrosteg i taget.
Planera: Morgonkompassen som Sacred Feature, max 2–3 notiser/dag, Paralys-Brytaren vid tungt svar, compassFilter i UI.
Output: De-3-Kompasserna-SPEC.md
```

## Dossier-Generator

```
MODUL: Dossier-Generator (Sacred). Ingen route idag — planera /dossier eller export från valv/barnen.
Källor: reality_vault (exkl vävaren_metadata valfritt), journal, children_logs.
Krav: WORM-snapshot, hash + createdAt, explicit användar-export, ingen auto-delning till motpart.
Output: Dossier-SPEC.md
```

## Valv-Chat (skild från Kunskap)

```
MODUL: Valv-Chat — sök och få svar direkt från Verklighetsvalvet (reality_vault).
INTE samma som /kunskap (Minne/RAG/Drive) — denna modul läser endast användarens WORM-bevis i reality_vault.
Krav: AuthGate + valv unlocked (Shield 3s + PIN). Exkludera vävaren_metadata som standard.
UX: en fråga i taget, kort svar med källhänvisning (datum, category, docId), ingen permanent chattlogg (Zero Footprint).
Backend: klient getVaultLogs + matchVaultEvidence ELLER ny callable med Livs-Arkivarien/Mönster-Arkivarien — hallucinera aldrig utan bevis.
Planera route: /valv/sok eller flik i VaultPage efter unlock.
Output: Valv-Chat-SPEC.md
```

---

## Cursor efter upload (en modul i taget)

```
Konsolidera uppladdad [MODUL]-SPEC.md — endast dokument, ingen kod.

Gör samma som Dagbok:
1. docs/specs/modules/[MODUL]-SPEC.md (ren markdown, 11 sektioner)
2. .context/modules/[modul].md med gap-tabell (klart / delvis / planerat)
3. src/modules/[modul]/module_plan.md (eller stub om modul saknas)
4. Synka docs/specs/p2-flode.md om flödet avviker
5. Rotfil → kort pekare om RTF

Jämför mot befintlig kod. Rätta fel i spec. Dokumentera gap — implementera INTE kod om jag inte säger "kör".
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän dokumentationen är konsekvent.
```

---

## Övriga moduler (ej våg 2 i denna plan)

Se [`ai-prompts-heart.md`](ai-prompts-heart.md) för Dagbok, Valv, Speglar.  
Se [`ai-prompts-moduler-master.md`](ai-prompts-moduler-master.md) för Kunskap, Måbra, kladd, batch.

| Modul | Output |
|-------|--------|
| Ekonomi | `Ekonomi-SPEC.md` |
| Kompis / Kunskap (Minne) | `Kunskap-SPEC.md` |
| Måbra-sidan | `Mabra-SPEC.md` |
| Core | `Core-SPEC.md` |
