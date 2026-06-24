# Gemini Prompt-fabrik — startkommandon

**Syfte:** Klistra in **ett** kommando per ny Gem-chatt. Gem svarar med färdig prompt eller idéer enligt system instruction.

**Kanon:** `00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` · Knowledge `01`–`08` + denna fil (`21`)

---

## Setup (engångs)

1. `npm run gemini:sync:kunskap`
2. Gem → **Instructions:** `00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt`
3. Gem → **Knowledge:** `01`–`04`, `07`, `08`, `21` (+ `14`–`17` om orkester/Flow)
4. Vid zon-jobb: lägg till en fil från `tier-3-repomix/` (t.ex. `gemini-pack-valv.md`)

---

## 1. Cursor-prompt (implementation)

**När:** Något ska byggas i repot.

```text
prompt cursor [beskriv uppgiften i en mening]

Exempel: prompt cursor lägg till tom-state på Ekonomi-sidan med HubPanelSkeleton
```

Gem levererar: kort svenska + `CURSOR:`-block (MODEL TIER, READ FIRST, VERIFY, slutrad autonom).

---

## 2. ChatBox-prompt (SPEC / tung analys)

**När:** Callable-design, WORM-granskning, TypeScript interfaces — innan Cursor implementerar.

```text
prompt chatbox [beskriv SPEC-uppgiften]

Exempel: prompt chatbox design previewInkastClean callable med HITL preview JSON
```

Gem levererar: `CHATBOX:` + modell (Opus = backend/säkerhet, Sonnet = React/TSX).

---

## 3. Flow-verktyg (AI-pipeline)

**När:** Brusfilter, Dossier-steg, flerstegs-LLM utan ny monolit i Functions.

```text
flow [verktygsnamn eller P-nummer från flow-karta]

Exempel: flow P3 Mönster-assist
```

Gem levererar: `FLOW:` med nodgraf, JSON-schema, silo, kostnad, tunn callable-brygga.

---

## 4. NotebookLM Deep Research

**När:** Ny modul, gap-analys, eller osäker repo-fakta.

```text
research [modul eller fråga]

Exempel: research Planering hybrid-widget P3 Kanban
```

Gem levererar: `NOTEBOOKLM:` enligt `16-MALL-deep-research-modul.md` — BUILD/DEFER/REJECT + kostnad.

---

## 5. Idéer till produkten (3 rankade)

**När:** Du vill ha förslag utan att bygga direkt.

```text
idéer [zon: hjartat | vardagen | familjen | valvet | hela]

Exempel: idéer vardagen
```

Gem levererar: max 3 `IDÉ:` med zon, kostnad, WORM-risk. Bästa idé får färdig follow-up (`CURSOR:` eller `NOTEBOOKLM:`).

---

## 6. Innehåll till Kunskap/MåBra (CANDIDATE)

**När:** FACT-kort, frågekort, lekidéer — aldrig direkt till prod.

```text
innehåll [ämne + silo: kunskap | mabra | barn]

Exempel: innehåll vagusnerv kunskap
```

Gem levererar: `INNEHÅLL:` med `status: CANDIDATE`, `source_tier`, `content_class` — **inte** KEEP.

---

## 7. Granska extern AI-leverans

**När:** Du klistrat svar från ChatBox, Claude, Copilot eller NotebookLM.

```text
granska

[klistra in extern text här]
```

Gem levererar: APPROVED / APPROVED WITH CHANGES / REJECTED / REQUIRES_RESEARCH + ev. fix-`CURSOR:`.

---

## 8. Nästa bästa steg (från BUILD STATE)

**När:** Du är osäker vad som ska göras nu.

```text
nästa steg
```

Gem levererar: ett atomsteg från `01-LIFE-OS-BUILD-STATE.md` + färdig `CURSOR:` eller `research`-prompt.

---

## 9. Orkester / multi-AI-kedja

**När:** Större våg som kräver research → godkänn → flera verktyg.

```text
starta orkester [valfri modul]

Exempel: starta orkester Inkast fas 2
```

Gem levererar: sammanfattning flow-karta + `NOTEBOOKLM:` först — väntar på ditt **godkänn** innan ChatBox/Flow/Cursor.

---

## 10. UI-mockup (Antigravity)

**När:** Design oklar — mock före prod-wire.

```text
mock [skärm eller komponent]

Exempel: mock Barnporten HITL preview-panel Obsidian Calm
```

Gem levererar: `ANTIGRAVITY:` brief (tokens, layout, 44px touch, inga nature themes).

---

## Snabbreferens — vilket kommando?

| Jag vill… | Kommando |
|-----------|----------|
| Bygga kod i Cursor | `prompt cursor …` |
| SPEC innan kod | `prompt chatbox …` |
| AI-flöde i Flow | `flow …` |
| Förstå modul/gap | `research …` |
| Brainstorm | `idéer …` |
| FACT/innehåll | `innehåll …` |
| Kolla extern paste | `granska` |
| Vet inte var börja | `nästa steg` |
| Stor våg | `starta orkester …` |
| Design-skiss | `mock …` |

---

## Efter varje svar från Gem

1. Kopiera **endast** prompt-blocket till rätt verktyg
2. Svara Gem: `klart` eller klistra Cursor/ChatBox-resultat → `granska`
3. Nästa chatt-meddelande: nästa kortkommando — inte flera uppgifter samtidigt
