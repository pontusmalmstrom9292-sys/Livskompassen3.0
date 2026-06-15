# NAMN-AUDIT — user-facing copy (2026-05-31)

**Status:** Implementerad i kod (batch A–E). **Godkännande:** hela tabell 2 godkänd av produkt.

**Kanon i kod:**

- [`src/modules/core/copy/valvNavCopy.ts`](../../src/modules/core/copy/valvNavCopy.ts) — drawer, zoner, Valv-flikar
- [`src/modules/core/copy/evidenceCopy.ts`](../../src/modules/core/copy/evidenceCopy.ts) — «WORM» → låst post
- [`src/modules/evidence/vault/constants/vavarenCopy.ts`](../../src/modules/evidence/vault/constants/vavarenCopy.ts) — dagbok → taggar HITL

**Oförändrat:** `vaultTab=orkester`, `category: vävaren_metadata`, `functions/` agent-namn.

---

## Vävaren / metadata

| id | nuvarande (före) | final | fil | status |
|----|------------------|-------|-----|--------|
| V01 | Sparad. Vävaren föreslår AI-taggar… | Sparad. Förslag på taggar nedan — inget i arkiv förrän du godkänner. | vavarenCopy.ts | godkänd |
| V02 | Efter sparande: Vävaren föreslår taggar… | *(borttagen — checkbox i ConfirmStep)* | vavarenCopy + ConfirmStep | godkänd |
| V03 | Vävaren — föreslagna taggar | Förslag på taggar | vavarenCopy.ts | godkänd |
| V04 | AI-sammanfattning… metadata i Valv | AI-förslag — inte dina ord. Godkänn för att spara i arkiv. | vavarenCopy.ts | godkänd |
| V05 | Vävaren läser posten… | Analyserar… | vavarenCopy.ts | godkänd |
| V06 | Taggar sparade i Valv (metadata) | Taggar sparade i arkiv. | vavarenCopy.ts | godkänd |
| V07 | Journalarkiv & vävare | Extra i arkiv (kräver upplåst Valv): taggar… | dagbokReminders.ts | godkänd |
| V08 | Vävning och Kampspár-opt-in… | *(via V07 + ConfirmStep)* | — | godkänd |
| V09 | Vävning till Kampspár… | *(ConfirmStep checkbox)* | ConfirmStep.tsx | godkänd |
| V10 | Godkänn taggar | Spara taggar | WeaverApprovalPanel.tsx | godkänd |
| V11 | Kort AI-försätt (Vävaren) | Kort AI-inledning före rapporten | vavarenCopy.ts | godkänd |
| V12 | AI-taggar från dagbok | Taggar från dagbok | vavarenCopy.ts | godkänd |

## Orkester / synapse / HITL

| id | final | fil | status |
|----|-------|-----|--------|
| O01 | Meddelanden eller SMS-analys | valvNavCopy.ts | godkänd |
| O02 | Assistentroller | VaultOrkesterPanel.tsx | godkänd |
| O03 | Vilka hjälpare som finns | VaultOrkesterPanel.tsx | godkänd |
| O04 | Mönster och meddelanden — över tid | valvNavCopy.ts | godkänd |
| O05 | Barnens assistenter | BarnportenOrkesterPanel.tsx | godkänd |
| O06 | Öppna meddelande-analys i arkiv | BarnportenOrkesterPanel.tsx | godkänd |
| O07 | Assistentinfo | BarnportenPage.tsx | godkänd |
| O08 | Granska i arkiv | BarnportenInboxPanel.tsx | godkänd |
| O09 | Kopplingar (N) | EntityRegistryCard.tsx | godkänd |
| O10 | Personregister för assistenter — inte bevis | EntityRegistryCard, VaultAktorskartaPanel | godkänd |

## Forensik / Valv / nav

| id | final | status |
|----|-------|--------|
| F01 | Djupare (zon) | godkänd |
| F02 | Tidsstämplade poster som inte går att ändra | godkänd |
| F03 | Meddelanden · analys | godkänd |
| F04 | Speglar · djup | godkänd |
| F05 | kräver arkiv, inte vardagsvy | godkänd |
| F06 | Arkiv (Dagbok-drawer) | godkänd |
| F07 | Granska inkommande | godkänd |
| F08 | Spara & sök | godkänd |
| F09 | Mönster (zon) | godkänd |
| F10 | Rapporter | godkänd |
| F11 | Fråga & tidslinje | godkänd |
| F12 | Personer i ärendet | godkänd |
| F13 | Sök i sparade anteckningar | KnowledgeVaultChat.tsx | godkänd |

## Kampspár / Minne

| id | final | status |
|----|-------|--------|
| K01 | Sparas i Minne | godkänd |
| K02 | Allt sparat | godkänd |
| K03 | Sök i dina sparade anteckningar | godkänd |

## WORM / Speglar / hem

| id | final | status |
|----|-------|--------|
| W01 | Låst post / kan inte ändras (UI) | evidenceCopy + spridda vyer | godkänd |
| W02 | Speglar (rubrik) | SpeglingsSystem.tsx | godkänd |
| W03 | Känslan först. Fakta sen. Rensas när du lämnar. | godkänd |
| W04 | Fortsätt djupare | godkänd |
| W05 | Arkiv · mönster · meddelanden | livskompassHeroConfig.ts | godkänd |
