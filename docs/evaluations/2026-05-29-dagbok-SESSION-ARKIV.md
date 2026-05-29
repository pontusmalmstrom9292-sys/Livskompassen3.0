# Dagbok v2 — sessionsarkiv (2026-05-29)

**Syfte:** Låsa **allt** från chatten + implementationen så det inte försvinner med Cursor-historik.  
**Gäller inte juridisk rådgivning** — teknisk och produktspårning för Livskompassen.

---

## 1. Denna Cursor-chatt (historik)

Cursor-chattar kan försvinna vid rensning/kontobyte. **Du äger kopian** när den ligger i Git.

| Åtgärd | Var |
|--------|-----|
| **Kanon (denna fil)** | `docs/evaluations/2026-05-29-dagbok-SESSION-ARKIV.md` |
| Vertex-spec | `docs/evaluations/2026-05-29-dagbok-vertex-spec.md` |
| Plan Fas 1–4 | `docs/evaluations/2026-05-29-dagbok-vertex-plan.md` |
| Modulspec | `docs/specs/modules/Dagbok-SPEC.md` |
| Rå transcript (JSONL) | `.cursor/projects/.../agent-transcripts/` (Cursor internt) |

**Extra säkerhet:** I Cursor → öppna chatten → **Copy chat** → klistra längst ned i denna fil under avsnitt «Rå chat (valfritt)» → `git commit`.

---

## 2. Koden (låst via Git `main`)

| Commit | Innehåll |
|--------|----------|
| `27571846` | Fas 1 — Snabb / Reflektera / Arkiv |
| `7a5bd224` | Fas 2–3 — bilagor, arkivsök, filter |
| `42a4ccd0` | Fas 4 — HandoffBox + planering övrigt |

**Regel:** Inget force-push till `main`. PMIR före merge enligt `docs/MERGE-IMPACT-RAPPORT.md`.

**Prod storage (bilagor):** `firebase deploy --only storage` (rules för `users/{uid}/journal_memories/`).

---

## 3. Dagboksposten du skrev (Lager 1 — privat)

Text i Reflektera (t.ex. *«detta är mitt bevis mot polisen»*) **är inte sparad** förrän du tryckt **Nästa → Spara i dagboken**.

| Efter spar | Skydd |
|------------|--------|
| Firestore `journal` | WORM: `update`/`delete` false i rules |
| UI Arkiv | Läs only — ingen redigering |
| Handoff-ruta | Pekar bara — **kopierar inte** till Valv |

**Ett steg om osäker:** `/dagbok` → Arkiv — finns raden där? Ja = sparad.

---

## 4. Formellt bevis (Lager 2 — Reality Vault)

För något som kan användas mot polis/myndighet:

1. Handoff → **Öppna Reality Vault →** (`/dagbok?tab=bevis`)
2. Fyren/PIN om det krävs
3. Logga med datum, kategori, ev. bilaga i **Valv** — inte bara dagboken

| Collection | Syfte |
|------------|--------|
| `journal` | Privat reflektion, plausible deniability |
| `reality_vault` | Forensiskt bevis, metadata, export/PDF |

**Ingen auto-sync** mellan silorna (medvetet).

---

## 5. Kom ihåg i appen

Under **Dagbok → Reflektion** finns en ihopfällbar ruta: **«Kom ihåg: Dagbok vs Valv»** (sparas öppen/stängd i webbläsaren).

| Dagbok | Reality Vault |
|--------|----------------|
| Känslor, privat ventil | Fakta, datum, sms, skärmdumpar |
| Spara-knapp i wizard | Handoff eller Fyren → Bevis-flik |
| Inte för «visa mot ex» ensamt | Vid konflikt/vårdnad/tidslinje |

---

## 6. Vad som byggdes (kort)

- **Snabb** — humör + taggar, snabb spar
- **Reflektera** — wizard, röst, detaljer, 1 bilaga (5 MB)
- **Arkiv** — sök, humör/kategori-filter, dagsgruppering
- **Handoff** — nyckelord + ℹ vid bilaga → Valv

Smoke: `docs/SMOKE_CHECKLIST.md` #2, #2b–#2d.

---

## 7. Rå chat (valfritt — klistra in själv)

<!-- Klistra Cursor «Copy chat» här om du vill full historik i repo -->

---

*Skapad av Master Architect-session 2026-05-29. Uppdatera endast via ny evaluations-fil eller append under §6.*
