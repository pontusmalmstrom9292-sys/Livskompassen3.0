# UI QA Harden Loop — gratis färdigställ-system

**Syfte:** Ett kommando som testar appen, klassar fel, auto-fixar säkra (Tier A) problem, och skriver svensk rapport.  
**Fas:** 24 · **Kostnad:** $0 (Playwright + ADB + valfri Maestro OSS)

---

## Tryck Build

**Viktigt:** Kör i ett **nytt** terminalfönster — inte i samma där `npm run dev` syns.

```bash
npm run qa:harden
```

Scriptet hittar automatiskt Vite på 5173–5178 (högsta porten först, t.ex. 5175).

**Exhaustive crawl:** besöker **alla katalog-vyer** (~83: hubs, widgets, MåBra, dev-lab) + hela menyn + **varje synlig knapp/länk/flik i innehållet** (scrollar flera gånger, upp till 48 tryck/sida). Chrome (dock/meny) testas en gång först. Hoppar Sacred/skriv: Valv långtryck, biometri, logga ut, spara/radera. Dev-lab-touch &lt;44px = varning, inte produkt-FAIL. Telefon: Maestro `smoke-full-public` (drawer + dock).

Eller peka ut adressen:

```bash
node scripts/qa_harden.mjs http://127.0.0.1:5175
```

Snabbare (2 omgångar, ingen telefon):

```bash
npm run qa:harden:fast
```

Bara upptäck (ingen smoke/fix):

```bash
npm run qa:harden:detect
```

Delar:

| Kommando | Vad |
|----------|-----|
| `npm run debug:ui-suite` | hub-sweep → scroll-probe → tap-press |
| `npm run debug:device-probe` | USB G85 / Maestro dock (fräscht varje gång) — **SKIP** utan telefon. Full crawl: `QA_DEVICE_FULL=1` |
| `npm run qa:harden` | loop max 5 · Tier A recipes · smoke |

---

## Vad som auto-fixas (Tier A)

- Trasig scroll (`DUAL_SCROLL`, `ISLAND_SCROLL_BLOCKED`, …) → CSS-guard i `obsidian-calm-shells.css`
- Krascher / loading-stuck / PAGEERROR → kö till Cursor-agent (`.cursor/qa-harden/tier-a-agent-queue.json`)
- Touch &lt;44px → **rapporteras**, dock-storlek ändras inte automatiskt (chrome-lock)

## Vad som väntar på dig (Tier B)

Dock-etiketter, header-struktur, Valv PIN, Companion-struktur → `docs/evaluations/YYYY-MM-DD-qa-harden-pontus.md`

## Aldrig auto (Tier C)

`firestore.rules`, WORM, Ghost 3s, StrongBox, biometri-bypass, cross-RAG, deploy

---

## Experter (Fas 24-synkade)

Ordning: `sync-chrome-lock` → `sync-scroll-shell` → `sync-companion-gold` → `sync-g85-ui-qa` → `sync-fas24-ui-verifier`

Live dock: **Anteckning · Familj · Hamn · Ventil · Inkast** (Resurser i header).

---

## Telefon (valfritt)

1. USB-felsökning på G85  
2. `adb devices` visar `device`  
3. Maestro CLI (gratis): `curl -Ls "https://get.maestro.mobile.dev" | bash` sedan `export PATH="$PATH:$HOME/.maestro/bin"`  
4. App installerad: `com.livskompassen.app`  
5. `npm run debug:device-probe` eller hela `npm run qa:harden`  
   · Standard: Maestro **dock** (fräscht varje omgång).  
   · Lång crawl: `QA_DEVICE_FULL=1 npm run debug:device-probe`

Utan telefon: webb-roboten är **källan för varje knapp/vy**. Telefonen bekräftar dock/meny. Sacred-zoner kan ge svarta screenshots (`FLAG_SECURE`) — förväntat.

---

## Rapport

- Maskin: `.cursor/qa-harden/latest.json`  
- Svenska: `docs/evaluations/YYYY-MM-DD-qa-harden.md`  
- Wave: v63 i `.orkester/cursor-yolo-build-manifest.json`

## Deploy

**SKIP** tills du skriver `OK deploy` + yolo-vakt GO. G85 one-pass / visual sign-off är fortfarande manuellt (Fas 24).
