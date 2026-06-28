# Kapitel 32 — AI-regler (Design & UI)

> **Status:** Kanon · CRITICAL — alla agenter MUST läsa före UI-ändring  
> **Auktoritet:** Design Authority Decision (DAD) v1.0 APPROVED  
> **Källor:** `design-calm.mdc` · `premium-ui.mdc` · `locked-ux-features.mdc` · `lead-ui-engineer.mdc` · `ai-governance-self-review.mdc`

---

## 1. Syfte

Detta kapitel översätter DAD och relaterade `.mdc`-regler till **agent-styrbara beslut**. Målet: AI ska förstärka kompassen, lugnet och premiumkänslan — aldrig urholka låst UX eller byta designriktning tyst.

---

## 2. DAD — Design Authority Decision

### 2.1 Status

- **Version:** 1.0 APPROVED · **Priority:** CRITICAL
- Ersätter experimentella varianter av Header, Dock, Navigation, Home Screen.
- Framtida UI **utgår från DAD** — ingen återgång utan uttryckligt beslut.

### 2.2 Designfilosofi (agent-minnesregel)

Livskompassen **är inte** produktivitetsapp, dashboard, projektverktyg eller gamifierat Life OS.

Livskompassen **är:** *"Ett neuroanpassat premium Life OS."*

Designen ska kommunicera: **Trygghet · Lugn · Tydlighet · Exklusivitet · Reflektion · Riktning**

### 2.3 Designmantra

> Om osäkerhet uppstår: välj det som känns mer som **"En exklusiv personlig kompass för livet"** och mindre som **"En vanlig produktivitetsapp."**

---

## 3. Förbjudna ändringar (design-calm)

**AI får INTE utan uttryckligt godkännande (PMIR + Pontus OK):**

| # | Förbjudet |
|---|-----------|
| 1 | Flytta kompassen från mitten |
| 2 | Ta bort den fristående kompassen |
| 3 | Byta Executive Midnight-temat |
| 4 | Ersätta glasestetiken |
| 5 | Ersätta gulddetaljerna |
| 6 | Göra UI mer "app-likt" (generic mobile) |
| 7 | Göra UI mer Material Design-likt |
| 8 | Göra UI mer gaming-likt |

**Undantag — Design Freeport:** `src/modules/sandbox/**`, `design-freeport.css`, `/dev/design-freeport*` — DAD gäller inte där, men sandbox får inte wire:a prod backend utan feature-flag.

---

## 4. Agent decision tree

Använd detta träd **före varje UI-ändring**:

```
START: UI-ändring begärd?
│
├─ Rör locked UX? (Valv, Familjen Barnfokus, Planering P3, Barnporten, drawer)
│   ├─ JA → STOPP om borttagning/omdöpning/döljning
│   │        Kräv: uppdatera .context/locked-ux-features.md + Pontus OK
│   │        Kör: npm run smoke:locked-ux PASS före merge
│   └─ NEJ → fortsätt
│
├─ Bryter DAD förbjudna lista (§3)?
│   ├─ JA → STOPP — PMIR — vänta Pontus OK
│   └─ NEJ → fortsätt
│
├─ Ändrar användarflöde / tar bort funktion?
│   ├─ JA → premium-ui: "Never change user flows" — STOPP, fråga Pontus
│   └─ NEJ → fortsätt
│
├─ Flera designalternativ möjliga?
│   └─ Välj enligt prioritet (design-calm § DESIGNREGLER):
│       1. Förstärker kompassen
│       2. Förstärker lugn
│       3. Förstärker premiumkänsla
│       4. Minskar visuell komplexitet
│       5. Ökar tydligheten
│
├─ Kosmetisk polish (spacing, kontrast, a11y, tokens)?
│   └─ lead-ui-engineer: GÖR — fråga inte om lov
│
└─ KLAR → build + relevant smoke → self-review checklist
```

---

## 5. Prioriteringsordning (design-calm)

När flera lösningar är möjliga, välj i ordning:

1. **Förstärker kompassen** — signatur, mitt i dock, störst
2. **Förstärker lugn** — färre val, mjuk rörelse, inga distraktioner
3. **Förstärker premiumkänsla** — glas, djup, guld, typografi
4. **Minskar visuell komplexitet** — ta bort, inte lägga till
5. **Ökar tydligheten** — hierarki före fler widgets

---

## 6. premium-ui — agentbeteende

| Gör alltid | Gör aldrig (utan OK) |
|------------|---------------------|
| Refine, polish, elevate | Redesign screens |
| Fixa inkonsistens i touched files | Rebuild screens |
| Memoization / a11y / tokens | Move modules |
| Lämna renare kod | Remove functionality |
| World-class craftsmanship | Generic/template UI |

**Primary rule:** Appen är ~90% korrekt. Förbättra — byt inte.

---

## 7. smoke:locked-ux

### 7.1 Vad den skyddar

Static smoke (`scripts/smoke_locked_ux.mjs`) verifierar att låst UX finns kvar i källkod:

- **Barnfokus:** `FamiljenBarnfokusDelegate`, optimistic `barnfokus`, "Spara till …s logg"
- **Valv:** Mönster, Orkester, Kunskapsbank, Aktörskarta-paneler
- **Drawer:** navTruth, gold active row, Valv-sektion
- **Planering:** P3 Kanban, hybrid projekt
- **Barnporten:** HITL, inkorg→Valv-bro
- **Obsidian depth / theme pack / kanonbilder**

### 7.2 När agent MUST köra

```bash
npm run smoke:locked-ux
```

- Före merge som rör `FamiljenPage`, `VaultPage`, navigation, executive chrome
- Efter header/dock/kompass/home-ändringar
- Ingår i `smoke:tier1` och `smoke:predeploy`
- **Hoppa aldrig över** vid Valv/Familjen-refactor (`orkester-autorun.mdc`)

### 7.3 Relaterad smoke

| Script | När |
|--------|-----|
| `smoke:design-modules` | DS-moduler, hubbar |
| `smoke:design-freeport` | Sandbox |
| `smoke:locked-icons` | App-ikoner D1/M2 |
| `smoke:predeploy` | Före deploy (YOLO gate) |

---

## 8. Locked UX — hard stops

Från `locked-ux-features.mdc` — **MUST NOT REMOVE**:

- Barnfokus-frågor + Superhub delegate
- Valv Mönster + Orkester + Kunskapsbank + Aktörskarta
- Planering P3 Kanban på `/planering`
- Barnporten HITL + inkorg→Valv
- Drawer två sektioner (Vardag / Valv)
- Middagsfrågan / produktikoner enligt register

Register: `.context/locked-ux-features.md`

---

## 9. När agent ska fråga Pontus

| Situation | Agent-action |
|-----------|--------------|
| DAD förbjuden ändring | STOPP — PMIR |
| Locked UX borttagning/döljning | STOPP |
| Ny prod-route utanför 3-zonsystem | STOPP |
| `firestore.rules` / deploy prod | STOPP — YOLO-vakt |
| Kosmetisk polish i touched UI | GÖR — ingen fråga |
| Ny theme pack till prod registry | Föreslå — Pontus visuell OK |
| Funktionsändring i etablerat flöde | Fråga |

---

## 10. Governance-kedja (läsordning)

1. `docs/PROJECT_STATE.md`
2. `docs/AI-GOVERNANCE.md`
3. `.cursor/rules/design-calm.mdc` (DAD)
4. `.cursor/rules/locked-ux-features.mdc`
5. Detta kapitel + `31-Code-Standards.md` + `28-Accessibility.md`

**Self-review:** `ai-governance-self-review.mdc` — alla 9 punkter PASS före "klart".

**DoD:** `docs/DEFINITION-OF-DONE.md` — smoke + docs update.

---

## 11. Låst visuell hierarki (referens)

Agent ska **inte** rubba denna ordning utan DAD-ändring:

**Header:** Livskompassen → Ögat → övrigt

**Home:** Livskompassen → Ögat → Dagens Reflektion → Kompassen → övrigt

**Dock:** Kompassen dominerar — docken bär kompassen, inte tvärtom

---

## 12. Regelindex (snabbreferens)

| Regel | Fil |
|-------|-----|
| DAD / förbjudet | `design-calm.mdc` |
| Polish-mandat | `lead-ui-engineer.mdc` |
| 90% refine | `premium-ui.mdc` |
| Locked UX | `locked-ux-features.mdc` |
| Chameleon lager | `chameleon-ui-modularity.mdc` |
| Komponentkrav | `component-standards.mdc` |
| Self-review | `ai-governance-self-review.mdc` |
| Kognitiv ton | `ai-cognitive-companion.mdc` |
| Deploy gate | `yolo-vakt-gate.mdc` |
| Android G85 | `android-capacitor.mdc` |

---

## 13. Prompt-suffix (Cursor-agenter)

När agent skriver kod för Pontus, avsluta arbetsprompt med:

> *Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.*

---

*SLUT KAPITEL 32*
