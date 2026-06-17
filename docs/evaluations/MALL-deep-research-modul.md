# Deep Research — modul (mall)

**Syfte:** Obligatorisk analys **före** ChatBox / Flow / Cursor-build.  
**Gate:** Pontus godkänner §6 — först då får Gemini skicka externa uppdrag.  
**Regel:** [`.cursor/rules/deep-research-pmir.mdc`](../../.cursor/rules/deep-research-pmir.mdc)

Kopiera denna fil till `docs/evaluations/YYYY-MM-DD-deep-research-[modul].md` och fyll i.

---

## Metadata

| Fält | Värde |
|------|-------|
| Modul | |
| Zon | Valv / Hjärtat / Vardagen / Familjen |
| Datum | |
| Författare | Gemini Gem / Cursor agent |
| Subagent | specialist-* |
| Status | UTKAST / VÄNTAR GODKÄNNANDE / GODKÄND / AVVISAD |

---

## 1. Syfte och användarscenario

*Beskriv vad Pontus ska kunna göra i appen — ett konkret flöde, inget tekniskt.*

---

## 2. Nuvarande läge (repo-sanning)

| Område | Filer / callables | Smoke | BUILD STATE |
|--------|-------------------|-------|-------------|
| Backend | | | LOCK / FREEZE / OPEN |
| Frontend | | | |
| Flow (om finns) | | | prototyp / prod |

*Citera fil:rad där möjligt. Gissa inte.*

---

## 3. Planerat i masterplan — fortfarande optimalt?

| Källa | Vad som planerades | Fortfarande rätt? |
|-------|-------------------|-------------------|
| fas19-masterplan-v2 | | JA / NEJ / DELVIS |
| UI masterplan | | |
| MODUL-FUNKTIONS-REGISTER | | |

*Om NEJ — vad ska ändras istället?*

---

## 4. Verktygsval och kostnad

| Alternativ | Kostnadseffekt | Risk | Rekommendation |
|------------|----------------|------|----------------|
| Gratis / befintlig callable | | | |
| Google Flow (~2000 kr) | | | |
| ChatBox | | | |
| Cursor only | | | |

**Drift efter krediter:** max 150 SEK/månad.

**Rekommenderat verktyg:** CHATBOX | FLOW | CURSOR | DEFER

---

## 5. Risker (MUST checklist)

- [ ] Tre silos — ingen cross-RAG
- [ ] WORM — append-only collections orörda
- [ ] DCAP före LLM för routing/auth
- [ ] Locked UX intakt (lista om berörd)
- [ ] HITL — ingen auto-promote barn → Valv
- [ ] Backend FREEZE — endast tunn callable om ny AI-brygga

---

## 6. Beslut (Pontus godkänner här)

**Välj ett:**

- [ ] **BUILD** — gå vidare till Implementation Package
- [ ] **DEFER** — senare, anledning:
- [ ] **REJECT** — gör inte, anledning:

**Pontus:** godkänn / avvisa / ändra X: _______________

---

## 7. Implementation Package (endast om BUILD)

### 7.1 Sammanfattning

### 7.2 Berörda filer

### 7.3 Kod / SPEC / Flow-nodgraf

### 7.4 Riskanalys

### 7.5 Backupplan (rollback)

### 7.6 Smoke

```bash
# exakt kommandon
```

### 7.7 PMIR-utkast (om merge/rules/Lock)

---

## 8. Nästa prompt (Gemini fyller efter godkännande)

**Typ:** CHATBOX | FLOW | ANDROID | CURSOR

```
(klistra färdig prompt här)
```
