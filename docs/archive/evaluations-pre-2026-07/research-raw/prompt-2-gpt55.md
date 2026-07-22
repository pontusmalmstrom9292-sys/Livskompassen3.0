# Prompt 2 — Chameleon Supermodule

**Modell:** OpenAI GPT-5.5  
**Status:** ✅ Klar  
**Datum:** 2026-06-18

---

## Råsvar

### 1. Fem regler för chameleon-mönstret

1. **Konsekvent positionering:** Modulen är alltid på samma plats inom zonen för att skapa förutsägbarhet.
2. **Sömlös mode-växling:** Mode-växlare byter delegation utan att ladda om sidan, för att undvika störningar.
3. **Zon-specifik innehåll:** Varje zon har sin egen supermodul med tydligt separerade kategorier — inga blandningar.
4. **Direkt navigering:** Kort under modulen leder användaren till rätt mode inom samma modul utan sidbyten.
5. **Anpassningsbar visning:** Vid låg kapacitet kan evolution_hub dölja modes för att hålla fokus och prestanda optimal.

### 2. Primära modes per zon (max 5 + «Mer…»)

- **Hjärtat:** Stresshantering, Sömn, Meditation, Andning, Känslohantering + Mer…
- **MåBra:** Träning, Kost, Hydrering, Mental träning, Avkoppling + Mer…
- **Familjen:** Kommunikation, Tid tillsammans, Konflikthantering, Planering, Barnens välmående + Mer…

### 3. Hur mode-byte ska kännas visuellt

- Subtil morph/fade, 300–400 ms
- Mild färg/ljus-kontrast för aktivt mode
- Valfri kort vibration/ljud (försiktigt)
- Ingen omplacering av modulen — bara innehåll byts

### 4. Självlärande utan gamification

- Data-driven prioritering av modes (utan poäng)
- Subtila tips som text/markörer, inte spel
- Finjustering efter tid på dagen, stress, interaktion
- Användaren kan stänga av och se vad som påverkar

---

## Cursor-verifiering (mot befintlig kod)

**GPT:s zon-modes är FELMAPPADE** — de låter som generisk wellness, inte våra zoner:

| Zon | GPT föreslog | Verklighet i kod |
|-----|--------------|------------------|
| Hjärtat | Stress, sömn, meditation… | `reflektion`, `quick_mirror`, `arkiv` (dagbokInputModes.ts) |
| MåBra | Träning, kost, hydrering… | KBT/ACT, andning, reflektion, frågekort (MåBra-bank) |
| Familjen | Kommunikation, konflikt… | `barnfokus`, `livslogg_stund`, `fysiologi`, `inkast` + Hamn/BIFF separat |

**Behåll:** 5 regler, morph 300–400ms, självlärande utan gamification, användar-transparens.
**Korrigera:** Modes måste mappas till befintliga `*InputModes.ts`, inte GPT:s lista.
