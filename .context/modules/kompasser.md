# De 3 Kompasserna (Kompasser)

**Route:** `/kompasser` · **AuthGate:** planerad (öppen idag) · **Dock:** Sprout  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/De-3-Kompasserna-SPEC.md`](../../docs/specs/incoming/De-3-Kompasserna-SPEC.md)

---

## 1. Syfte och användarbehov

Dygnsstöd mot stress och manipulationsloopar — ett mikrosteg i taget.

| Kompass | Roll |
|---------|------|
| **Morgon** (Sacred Feature) | Intention — Sanningens Ankare |
| **Dag** | Nödbroms — people-pleasing |
| **Kväll** | KASAM — stäng dagen, filtrera crazymaking |

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | `/kompasser` — flikar Morgon/Dag/Kväll; dock Sprout, bento |
| **Planerat** | `/morgon`, `/dag`, `/kvall`; push-notiser 2–3/dag |

## 3. UX-flöde

1. Välj kompass (flik)
2. En fråga + val av alternativ
3. Spara → `checkins`

**Planerat:** strikt en skärm/interaktion, linjärt utan tillbaka, Paralys/Speglar-koppling per kompass.

## 4. Visuell design

Obsidian Calm — guld aktiv, indigo Fortsätt, emerald spara. Inga count-ups.

## 5. Datamodell

| Collection | WORM | Nyckelfält |
|------------|------|------------|
| `checkins` | ja | questionId, optionSelected, taskCategory, createdAt |

## 6. Backend

- **Idag:** klient `saveCheckIn`
- **Planerat:** `breakDownResponse` (dag), `speglingsMirror` (kväll)

## 7. Säkerhet

- AuthGate — **planned**
- Global kill switch; kompass Zero Footprint — **partial**
- CMEK (drift)

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Morgon/Dag/Kväll UI + save | Progressive disclosure (pills synliga) | Push-notiser |
| checkins WORM | Shake → global `/` | Sub-rutter |
| compassFilter synkad | AuthGate | Paralys-Brytaren UI |
| | | Kväll → Barnen Balansmätare |
| | | Crazymaking → valv |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Notiser ≤3/dag | **planned** |
| 2 | En interaktion i taget | **partial** |
| 3 | Shake rensar osparad inmatning | **partial** |
| 4 | checkins append-only | **done** |

## 10. Kopplingar

- **Barnen** — kväll → Balansmätare (planerad)
- **Verklighetsvalvet / Dossier** — crazymaking (planerad)
- **Paralys-Brytaren / Speglings-Coachen** — agenter (planerad UI)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md).

## Kod

`src/modules/kompasser/` · plan: `src/modules/kompasser/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. AuthGate på `/kompasser`  
2. Strikt progressive disclosure (ett val i taget)  
3. `breakDownResponse` vid tung dagskompass  
4. Push-notiser (max 3/dag)  
5. Kväll → `children_logs` / Balansmätare  
