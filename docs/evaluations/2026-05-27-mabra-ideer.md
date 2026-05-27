# MåBra — produkt-UX-idéer (ej content bank)

**Datum:** 2026-05-27  
**Kurator:** `specialist-mabra-curator` (UX-lins, inte innehållsgrind)  
**Scope:** `/mabra` upplevelse · **ingen** FACT · **ingen** Kunskap-RAG · wireframes i ord.

**Relaterat innehåll (separat):** [`docs/specs/modules/Mabra-CONTENT-BANK.md`](../specs/modules/Mabra-CONTENT-BANK.md) § 2026-05-27 curator batch (`MB-REF-*`, `MB-PLAY-*`).

---

## 1. Lågenergi-läge på hubben

**Wireframe i ord:** Överst på `MabraPage`, en diskret rad: *“Jag orkar lite idag”* (toggle, default av). När på: hubben visar **två** stora val istället för tre/fyra — *Andning 1 min* och *Ett frågekort* — samma Obsidian-yta, inga nya färger. Ingen räknare, ingen “du valde läge X”-skuld vid avstängning.

**Varför:** ADHD/GAD — färre beslut vid inträde minskar avhoppsrisk före första andetaget.

---

## 2. Landningsremsa efter övning

**Wireframe i ord:** Efter `MabraComplete`, en horisontell remsa med **max tre** chips (scroll om smal skärm): *Spara insikt till Dagbok* · *Ett frågekort* (öppnar deterministiskt `bankId` från dagens pool, inte LLM) · *Gå till kväll* (`/vardagen`). Ingen fjärde chip-rad; ingen poängtext.

**Varför:** Bryter “nu är jag klar och lämnad” utan att öppna helt ny modul direkt.

---

## 3. Vit-projekt som djup-länk, inte andra hub

**Wireframe i ord:** Under symptom-hubben, en sektion *“Fortsätt i Vit”* med **en rad per projekt** (`self_esteem`, `who_am_i`, …) — ikon + titel + *“Senast: …”* om `vit_entries` finns. Tryck → samma route men `?project=self_esteem` och **ett** kort i taget. Hubben förblir ingång för akut; Vit är frivilligt djup.

**Varför:** Skiljer akut (andning) från identitetsarbete utan att duplicera hela hub-UI.

---

## 4. Daglig mix som kort på hubben (inte egen sida)

**Wireframe i ord:** På hubben, ett glass-kort *“Dagens mix”* — visar dagens `DM-*` korttext (trunkerad) + mikrospel-titel; knapp *“Öppna”* expanderar inline (accordion) med full regel + *“Klart för idag”* som skriver valfri `mabra_sessions` metadata. **Ingen** separat `/mabra/daglig` route i MVP.

**Varför:** Synlighet utan ny navigationsnivå; samma deterministiska motor som `DagligMixPanel`.

---

## 5. Guardrail-hint utan Hamn-routing i UI

**Wireframe i ord:** Om användaren skriver ex/vårdnad i planerad reframing/chat: en **guld** informationsrad (inte röd alarm): *“Det här passar bättre i Speglar — vill du öppna?”* med *Ja* / *Stanna här*. Default fokus på *Stanna* (RSD). Ingen auto-redirect.

**Varför:** Alignar `mabraCoachGuard` med lågaffektiv copy; användaren behåller autonomi.

---

## Nästa steg (produkt, ej denna fil)

- Prioritera mot [`Mabra-SPEC.md`](../specs/modules/Mabra-SPEC.md) MVP vs planerat.
- Implementation kräver kod + `npm run smoke:mabra` — **inte** innehållsbank.
