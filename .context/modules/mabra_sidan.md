# Måbra-sidan

**Route:** `/mabra` · **AuthGate:** ja · **Kluster:** eget på hemskärmen (Måbra / Inre kompass)

Proaktivt självarbete: KBT-inspirerade övningar, självmedkänsla, värderingar (ACT), små vanor, stressreglering. Anpassat ADHD/GAD/RSD — progressive disclosure, ett steg i taget.

**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md) (Måbra-block) · **Kladd-routing:** [`ai-prompts-kladd-kampspar.md`](../../docs/specs/ai-prompts-kladd-kampspar.md) §8

---

## Avgränsning

| Modul | Syfte | Inte Måbra |
|-------|--------|------------|
| **Måbra-sidan** | Proaktiv rehab, KBT, hitta sig själv | — |
| Speglar | Reaktivt gaslighting-skydd, ACT validera | Ja |
| Dagbok | Daglig humör + reflektion | Ja |
| Kompasser | Mikrosteg morgon/dag/kväll | Ja |
| Hamn | BIFF mot ex | Ja |

---

## 1. Syfte och användarbehov

Trygg plats för egen utveckling efter lång stress — utan koppling till vårdnadskonflikt eller ex. Kognitiv avlastning: korta övningar, ingen prestation.

## 2. Route och ingång

| Ingång | Status |
|--------|--------|
| Hem → kluster **Måbra** | **done** (shell) |
| Direkt `/mabra` | **done** (shell) |
| Bro från Dagbok (låg energi) | **planned** |

## 3. UX-flöde (planerat)

1. Välj övning (t.ex. andning, värderingskompass, thought record light)
2. Ett steg i taget — max 5–10 min
3. Valfri avslut / spara framsteg (Zero Footprint default: RAM)

## 4. Visuell design

Obsidian Calm — samma tokens som design-master. Lugn emerald/lavender accent (ej lila/regnbåge).

## 5. Datamodell

**Planerat:** `mabra_sessions` eller `mabra_progress` — WORM vs ephemeral-only ska beslutas i Mabra-SPEC.

## 6. Backend

**Planerat:** valfri coach-callable (lågaffektiv, ej JADE). Prompts endast i `sharedRules.ts`.

## 7. Säkerhet

AuthGate. Zero Footprint för känsliga övningssvar. Ingen auto-delning.

## 8. Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Route `/mabra`, MabraPage shell | | Övningsbibliotek |
| Kluster på hem | | Firestore schema |
| | | AI-coach |
| | | Bro Dagbok/Kompasser |

## 9. Acceptanskriterier (planerat)

- En övning startbar utan textkommandon
- State reset vid navigering bort (Zero Footprint)
- Tydlig skillnad mot Speglar i copy

## 10. Kopplingar

- **Dagbok** — bro vid låg energi (planerat)
- **Kompasser** — kvällsritual (planerat)
- **INTE Hamn/ex**

## 11. Navigation

Eget kluster; ej i FloatingDock initialt (nås via hem).

## Kod

`src/modules/mabra/` · plan: `src/modules/mabra/module_plan.md`
