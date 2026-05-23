# Manuell minnesingest per domän (billigt)

**Syfte:** Bygga Kunskapsvalvet (`kampspar` + ev. Vector) utan Drive-auto för känsligt material.  
**Kostnad:** ~1 embedding + 1 Firestore write per post (undvik dubletter).

---

## Var i appen

| Väg | Route | När |
|-----|-------|-----|
| Tidshjulet / Kunskap | `/vardagen?tab=kunskap` | Fakta, insikter, medicin, rehab |
| Inkorg HITL | Kunskap → InboxQueueCard | Drive-filer markerade `review` |
| Dagbok opt-in | Dagbok bekräftelse | `journal_woven` → kampspar (G7) |

**Inte hit:** `children_logs` (Familjen), `reality_vault` (Fyren) — egna silor.

---

## Kategorier (fält `category`)

| category | Domän | Exempel |
|----------|-------|---------|
| `profil` | Identitet, diagnoser, mål | ADHD F90.0B, rehab-mål |
| `insikt` | Känslor, people-pleasing | "Jag behöver inte försvara mig" |
| `medicin` | Läkemedel, biverkningar | Alimemazin dagtrötthet |
| `barn` | Föräldraskap (fakta om barnen) | Kaspers skolhändelse — **inte** ersätta `children_logs` |
| `juridik` / `soc` | Myndighet, LVU-kontext | Möten, datum |
| `aterhamtning` | F155, stress-substans, vårdplan | Slutenvård, drogtest logistik |

Använd `eventDate` (ISO) när tidshjulet ska visa posten i Dåtid/Nutid.

---

## Mallar (klistra in `content`)

### ADHD — strategi som fungerade

```
Titel: [kort]
Innehåll: Situation: … Åtgärd (ett mikrosteg): … Resultat: …
category: insikt
```

### Ångest — vad lugnade kroppen

```
Titel: Grounding [datum]
Innehåll: Symtom: … Metod (4-7-8 / kallt vatten / promenad): … Duration: … Efter: …
category: insikt
eventDate: YYYY-MM-DD
```

### Föräldraskap — lärdom (kunskap, inte BBIC-logg)

```
Titel: Kasper — [händelse] lärdom
Innehåll: Observation (neutral): … Nästa gång ett steg: …
category: barn
```

**BBIC-daglig logg** → spara i **Familjen** (`children_logs`), inte kampspar.

### Återhämtning / substans (opt-in, känsligt)

```
Titel: [datum] trigger och plan
Innehåll: Trigger (stress/miljö): … Tidig signal: … Säker åtgärd (samtal, vård, ingen körning): …
category: aterhamtning
```

**Akut risk:** kontakta 112 / psykiatrisk akut — appen ersätter inte vård.

---

## Checklista före ingest

- [ ] Är det **kunskap** (RAG) eller **bevis** (valv) eller **barnlogg**?
- [ ] Innehåller det barns personnummer eller tredjeparts hemligheter? → minimera i text
- [ ] Samma fakta redan i seed? → uppdatera inte — lägg till ny vinkel/datum
- [ ] Trauma? → manuellt, aldrig auto-Drive

---

## Seed (engång)

Befintlig batch: [`Kampspar-PROFIL-SEED.json`](specs/modules/Kampspar-PROFIL-SEED.json). Kör ingest-script endast i kontrollerad miljö (se `docs/DEPLOY.md`).
