# Skogspaket — viktiga app-saker på distans (1 sida)

**Version:** 2026-05-25 · Skriv ut eller spara offline på telefon.

**Helhet hemma:** [`KOMPASS-MINNESKARTA.md`](./KOMPASS-MINNESKARTA.md) · **Git:** [`GIT-LATHUND.md`](./GIT-LATHUND.md)

---

## Regel i ett stycke

**I skogen:** samla och godkänn — bygg inte kod. **Vid Mac:** klistra in en uppgift + Cursor-prompt (§5). **Innan du går:** kör nattpass eller push `main` om du vill ha deploy/smoke i molnet.

---

## A — I skogen (telefon)

| Gör | Gör inte |
|-----|----------|
| Anteckna med mall (§3) | Öppna Cursor och "fixa snabbt" |
| Läs status på GitHub | Force-push · nya grenar |
| Testa live-app (länk nedan) | Ändra `firestore.rules` / Sacred |
| Svara *godkänn merge* om PMIR finns | Committa kod utan Mac |

**Live-app (test):** https://gen-lang-client-0481875058.web.app  
**GitHub repo:** https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0  
**Actions (deploy/smoke i CI):** repo → **Actions** → *Deploy Hosting (main)*

**Läs på telefon (markdown):**

| Fil | Innehåll |
|-----|----------|
| [`evaluations/SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md) | Var projektet står |
| `docs/evaluations/*-orkester-natt.md` | Senaste nattpass |
| [`BRANCH-KARTA.md`](./BRANCH-KARTA.md) | Grenar — rör ej parked utan beslut |

---

## B — Innan du lämnar Mac (välj ett)

| Mål | Gör |
|-----|-----|
| Säkerhetsnät (smoke + build, ingen LLM) | `npm run orkester:night` → läs rapport i `docs/evaluations/` |
| Agent väver vidare (Cursor) | *"Kör orkester nattpass — fortsätt från `.orkester/state.json`"* |
| Hela öppna kön (borta) | [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) — `master:yolo` + startprompt |
| Ny version på telefon/PWA | Push `main` → GitHub Actions deployar ([`CI-HOSTING.md`](./CI-HOSTING.md)) |

Kanon nattpass: [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md)

---

## C — Mall (kopiera till Anteckningar / röstmemo)

```
[APP] Modul: Familjen | Valv | Planering | MåBra | Kunskap | Core | Annat
Vad: (max 1 mening)
Varför viktigt:
Smoke om kod: locked-ux | orkester | ingen
Godkänn merge: ja/nej (bara om PMIR redan skriven)
```

---

## D — Smoke-minne (agent ska köra vid kod)

| Du rörde | Kör |
|----------|-----|
| Familjen / Barnfokus / Valv Mönster·Orkester / Planering | `npm run smoke:locked-ux` |
| Synapser / agents / functions | `npm run smoke:orkester` |
| Bara docs | Ofta ingen smoke |

---

## E — Prompt för Cursor (när du är vid Mac)

Klistra in **en** uppgift från §C:

```
Jag var borta (skog/distans). Läs min uppgift nedan och gör ENDAST den — inget extra.

UPPGIFT:
[klistra in från Anteckningar]

Regler:
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
- main + origin Livskompassen3.0 only — aldrig origin-old
- Bevara Locked UX (Barnfokus, Valv Mönster/Orkester, Planering, Barnporten, sidomeny)
- Kör smoke enligt SKOGSPAKET §D om kod rörts
- PMIR före merge — vänta på mitt "godkänn merge"
- Committa/pusha bara om jag skriver "committa" eller "pusha main"
```

Öppna chat: `Cmd + L` · projekt: `~/StudioProjects/Livskompassen3.0`

---

## F — Snabb länkar

| Behov | Fil |
|-------|-----|
| Merge | [`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md) |
| Cursor-menyer | [`CURSOR-MENY-LATHUND.md`](./CURSOR-MENY-LATHUND.md) |
| Moln/krediter | [`MOLN-KREDITER-LATHUND.md`](./MOLN-KREDITER-LATHUND.md) |
| Fakta vs lek / kurator | [`INNEHALL-REGISTER.md`](./INNEHALL-REGISTER.md) |
| Låst UX | `.context/locked-ux-features.md` |

---

**Utskrift / offline:** [`SKOGSPAKET-LATHUND.html`](./SKOGSPAKET-LATHUND.html) · alla lathundar: [`LATHUND-INDEX.html`](./LATHUND-INDEX.html)

*Spara denna sida som PDF på iPhone: Öppna HTML → Dela → Lägg till på hemskärmen / Skriv ut som PDF.*
