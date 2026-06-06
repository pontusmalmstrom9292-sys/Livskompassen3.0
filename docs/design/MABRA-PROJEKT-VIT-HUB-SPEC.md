# MåBra — egna projekt + Vit hub i Valvet

**Beslut 2026-05-23** · **Status 2026-06-06:** P0–P4 **done** (våg 9–16) · Koppling: MåBra startar → Valvet levererar **plan** → sparas i **din Vit hub** (personlig silo, inte bevis-WORM mot ex).

---

## Syfte

Du ska tydligt kunna **starta ett eget projekt** (t.ex. *Självkänsla*) utan att blanda ihop det med Hamn/BIFF eller juridiskt valv.

| Lager | Roll |
|-------|------|
| **MåBra** | Välj projekt · akut-stöd · övningar |
| **Valv (Vit)** | Plan, minnen, statistik, utveckling över tid |
| **Bevis-valv** | Oförändrat — WORM, ex, dossier (separat flik) |

---

## MåBra-fliken — layout

```
MåBra
├── Akut nu (avlånga moduler)
│   ├── Panik / RSD
│   ├── Självkritik
│   └── Hitta mig
├── Egna projekt
│   ├── Självkänsla          → Vit hub + plan
│   ├── Känslominnen         → frågekort-serie
│   ├── Lär tillsammans      → chatt (Kompis, inåtvänd)
│   └── Vem är jag?          → identitetskartläggning
└── Mina värderingar (ACT)   → befintlig ValuesCompass
```

Varje rad = **samma avlånga modul** som kompasserna (`elongated-module`).

---

## Projekt: Självkänsla (exempel)

1. Tryck **Självkänsla** på MåBra.
2. Valvet visar **planväljare** (ett steg i taget):
   - **Frågekort** — korta prompts, ett kort = ett steg
   - **Lär tillsammans** — lågaffektiv chatt (Kompis-coach, silo `vit`)
   - **Känslominnen** — *Vem är jag?* · *Hur känner jag kring denna upplevelse?*
3. Svar sparas i **`vit_hub/{userId}`** (Firestore, planerat).
4. **Vit hub** i Valv: dashboard med senaste minnen, deterministisk statistik, projektfilter, export — **ingen streak/skuld** (Mabra-SPEC).

---

## Frågekort (plan-typ)

| Fas | Exempelfrågor |
|-----|----------------|
| Identitet | Vem är jag när ingen tittar? Vad är jag stolt över? |
| Känsla | Hur känns den här upplevelsen i kroppen? Vad behöver den? |
| Mål | Ett litet mål denna vecka — inte prestation. |
| Glädje | Vad tycker jag är kul / lugnt / meningsfullt? |

Kort sparas som `vit_entries` med `kind: 'card' | 'memory' | 'chat_turn'`.

---

## Vit hub i Valv (UI)

Ny underflik eller sektion: **「Mitt Vit」** (namn TBD).

| Widget | Innehåll | Status |
|--------|----------|--------|
| Översikt | Senaste 3 minnen (`VitRecentOverview`) | **done** P4 |
| Statistik | Sparade svar · unika dagar · MåBra-pass (deterministisk) | **done** P2 |
| Utveckling | Senaste 4 veckor — aktivitet per vecka, ingen streak | **done** våg 16 |
| Humör / pass | MåBra-pass per symptom (senaste 30) | **done** våg 16 |
| Projekt | Filter per MåBra-projekt | **done** P2/P13 |
| Export | PDF + JSON till dig själv (inte dossier) | **done** P12 |

**Skilj från:** Mönster/Orkester (ex-mönster), WORM-bevis.

---

## Implementation-faser

| Fas | Leverans | Status |
|-----|----------|--------|
| **P0** | `MabraProjectHub` UI + konstanter + länk till Vit-förhandsvisning | **done** |
| **P1** | Firestore `vit_hub` / `vit_entries`, frågekort-flöde, spara entry | **done** våg 9 |
| **P2** | Valv-flik `vaultTab=mitt_vit` + statistik + filter | **done** våg 10–13 |
| **P3** | Chatt «Lär tillsammans» via `mabraCoach` + silo-guard | **done** våg 11 |
| **P4** | Översikt senaste 3 + MåBra→Valv-länk | **done** våg 15 |
| **P5** | Utveckling/humör-polish (deterministisk, ingen LLM/gamification) | **done** våg 16 |

Kod: `mabraProjects.ts`, `MabraProjectHub.tsx`, `VitHubPreview.tsx`, `VaultVitHubPanel.tsx`, `VitDevelopmentPanel.tsx`, `vitHubStats.ts`, `vitHubCopy.ts`.

## Backlog (ej P1–P5)

| Idé | Not |
|-----|-----|
| Kurva över månader | Kräver mer data — avvakta UX-test |
| Teman / “vad jag tycker är kul” | Separata frågekort-serier — kurator, ej auto-LLM |

Mockup: [`mabra-projekt-vit-hub.png`](./references/mabra-projekt-vit-hub.png).
