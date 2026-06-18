# Chameleon Supermodule — Spec (v0.1)

**Status:** Utkast efter research 2026-06-18  
**Sandbox:** `/dev/design-freeport` (ej prod utan PMIR)

---

## Definition

En **Chameleon Supermodule** är en visuell container på fast plats i en zon. Inuti byter `inputMode` vilken delegate som renderas — utan sidladdning eller flikbyte.

---

## Fem regler

1. **Konsekvent position** — samma shell varje gång användaren är i zonen
2. **Seamless mode-byte** — morph/fade 300–400 ms, ingen slide/zoom
3. **Zon-specifikt** — egna `*InputModes.ts`, ingen cross-import av delegates
4. **Kort under** — max 12, filtrerade av `evolution_hub` + preset; kort → `inputMode` i samma modul
5. **Kapacitetsstyrt** — låg kapacitet = färre modes/kort synliga

---

## Modes per zon (från kod)

### Hjärtat (`dagbokInputModes.ts`)
| Mode | Label |
|------|-------|
| reflektion | Reflektera |
| quick_mirror | Snabb spegling |
| arkiv | Arkiv |

### MåBra (`mabraInputModes.ts`)
| Mode | Label |
|------|-------|
| checkin | Check-in |
| vit_card | Frågekort |
| reflection_tool | Reflektion |
| emotional_memory | Känslominne |
| exercise_note | Anteckning |

### Familjen (`familjenInputModes.ts`)
| Mode | Label |
|------|-------|
| barnfokus | Barnfokus |
| livslogg_stund | Ny stund |
| fysiologi | Fysiologi |
| livslogg_observation | Observation |
| inkast | Inkast |

### Planering (`planeringInputModes.ts`) — förebild
task_quick · inkast · quick_list + 8 hub-layouter

---

## Navigation (Modell A)

```
Hem → Zon (1 klick) → Upptäcktskort (2 klick) → Supermodul-läge
```

Valv/Barnlogg: ej i kort — långtryck + PIN i Familjen.

---

## Estetik (sandbox)

Default: **Tactile Warm** — bas `#0D0D0D`, accent koppar `#B36B3E`  
Alternativ: Tactile Chrome `#7D8A99`, Tactile Cold `#4A90E2`

---

## Evolution (utan gamification)

- Kortrotation: tematisk, tidsbaserad, kapacitetsfiltrerad
- Nytt läge: neutral text, ingen badge
- Logga mode-val → `evolution_ledger` (dual-write när Fas 19.5 klar)

---

## Referenskod

- `PlaneringInputSuperModule.tsx`
- `SupermoduleModeSelect.tsx`
- `HemV3DevelopmentRail.tsx`
- `planeringHubLayouts.ts`
- `isLowHomeCapacity` / `filterDevelopmentCardsForPreset`

---

## Smoke (planerat)

`npm run smoke:design-freeport`
