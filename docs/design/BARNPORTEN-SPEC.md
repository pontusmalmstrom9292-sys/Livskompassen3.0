# Barnporten — barnens hub (PWA · widget · Valv-bro)

**Status:** Låst design + modulplan 2026-05-23 (implementation P1)  
**Produktnamn (UI):** **Barnporten** · undertitel *Din trygga hamn*  
**Route (barn):** `/barnporten` · **Route (förälder):** `/familjen?tab=barnporten` (inbox)  
**Install:** PWA på barnens telefon/surfplatta (egen manifest, egen ikon)  
**Tema:** Varm skymning (mjukare än föräldra-Valv) — guld/amber, **ingen** turkos/lila, **ingen** juridisk monospace för barn  
**Kanon UI (barn-hub):** [`references/BARNPORTEN-HUB-KANON.png`](./references/BARNPORTEN-HUB-KANON.png) — 2×2 kort: Prata · Skriv till pappa · Humör · Bara för mig

---

## Syfte

En **egen, lågaffektiv hub** där barn (Kasper, Arvid) själva kan:

| Åtgärd | Barn ser | Förälder ser |
|--------|----------|--------------|
| **Säga / skriva av sig** | Röst eller text, valfri emoji | Notis i Barnporten-inkorg (Familjen) |
| **Skriva till pappa** | Direkt meddelande (inte chat med ex) | `children_logs` + push valfritt |
| **Humör / kort check-in** | 1–5 eller emoji, ett tryck | Balansmätare-input (fysiologi-kompatibelt) |
| **Bara för mig** | Privat dagbok i barnsilo | **Inte** läst av förälder utan barn delar |
| **Jobba med mig själv** | Valbar mini-övning (andning, ett steg) | Aggregerad trend endast (AADC) |
| **Allvarligt / tryggt vuxen** | “Jag behöver prata med pappa” | Kö → förälder kan **flytta till Valv** (HITL) |

**Skild från:** förälderns diskreta inspelning (W1), Hamn/BIFF, Kunskap-RAG, ex-konflikt.

---

## Systemkarta (infografik)

Se [`barnporten/infographic.html`](./barnporten/infographic.html) (interaktiv) och diagram nedan.

```mermaid
flowchart TB
  subgraph childDevice [Barnens enhet]
    PWA[Barnporten PWA]
    CW[Barn-widget CB1]
    PWA --- CW
  end

  subgraph silo3 [Silo 3 — Barnen]
    CL[(children_logs WORM)]
    BP_INBOX[barnporten_inbox förälder]
  end

  subgraph siloVault [Silo — Valv bevis]
    RV[(reality_vault WORM)]
    HITL[Förälder godkänner flytt]
  end

  subgraph parentApp [Förälder Livskompassen]
    FAM[/familjen Barnporten-flik]
    VALV[/dagbok Valv + Orkester]
    BP_ORCH[Barnporten-Orkester panel]
  end

  PWA -->|append authorRole child| CL
  CW -->|snabb post| CL
  CL --> BP_INBOX
  BP_INBOX --> FAM
  FAM -->|Allvarligt → Spara som bevis| HITL
  HITL --> RV
  CL -.->|mönster export| BP_ORCH
  BP_ORCH --> VALV
  VALV -->|Mönster Orkester| parentOrch[Föräldra-Orkester]
```

**Regel:** Barnets råtext **korsar aldrig** Kunskap-RAG eller Hamn. Valv endast via explicit förälder-HITL eller barnets “dela som bevis” (ålder/kapacitet + PIN förälder).

---

## Barn-widget (4 varianter — välj en)

| ID | Namn | Gest | Bäst för |
|----|------|------|----------|
| **CB1** | **Stjärn-prick** | Enkeltryck öppna · långtryck “snabb avsig” | Yngre barn, diskret |
| **CB2** | **Hjärta-båge** | Nedre kant, samma som W2 men varmare färg | Surfplatta |
| **CB3** | **Kompass-mini** | Liten kompass nere till höger (barnversion) | Känner igen pappas app |
| **CB4** | **Ingen widget** | Endast hemskärms-PWA-ikon | Skolor som blockerar overlay |

**Rekommendation:** **CB1** — ingen inspelning utan barnets vetskap (skillnad mot förälder W1).

Mockups: [`barnporten/mockups/`](./barnporten/mockups/)

---

## Hub-skärmar (barn)

| Skärm | Route | Innehåll |
|-------|-------|----------|
| **Hem** | `/barnporten` | 4 stora kort: Prata · Skriv till pappa · Humör · Bara för mig |
| **Prata av** | `/barnporten/prata` | Röst → STT → redigera → spara |
| **Skriv** | `/barnporten/meddelande` | Text + valfri bild (ingen kamera default) |
| **Humör** | `/barnporten/humör` | 5 ikoner + valfri en rad text |
| **Mitt rum** | `/barnporten/mitt-rum` | Privat lista, låst med barn-PIN enkel |
| **Steg** | `/barnporten/steg` | Ett mikrosteg från Steg-Kompisen |
| **Orkester** | `/barnporten/kompis` | Trygg-Kompisen m.fl. (barnsäkra agenter) |

---

## Barnporten-Orkester (egen, liten)

**Registry:** `src/modules/barnporten/constants/barnportenAgents.ts` (`BARNPORTEN_AGENTS`)  
**UI (barn):** `BarnportenKompisPanel.tsx` — max 3 agenter synliga, inga juridiska roller.

| Agent | Roll | Får inte |
|-------|------|----------|
| **Trygg-Kompisen** | Validera känsla, inget fixande | Diagnos, “mamma är…” |
| **Speglingen** | “Du verkar känna…” | Råd om vårdnadskonflikt |
| **Steg-Kompisen** | Ett litet nästa steg | Långa listor |
| **Röst-Vännen** | Uppmuntra prata/spela in | Spara utan barn trycker Spara |

**Förälder-Orkester (Valv):** analyserar **endast** poster som HITL godkänts till `reality_vault` eller aggregerad `children_logs` export — **inte** privat “Bara för mig”.

Panel (förälder): `BarnportenOrkesterPanel.tsx` på `/familjen?tab=barnporten` — länk till Valv Mönster/Orkester.

---

## Datamodell

### Utökning `children_logs` (append-only WORM)

| Fält | Typ | Kommentar |
|------|-----|-----------|
| `authorRole` | `'child' \| 'parent'` | Obligatorisk för Barnporten |
| `channel` | `'barnporten' \| 'familjen' \| 'middag'` | Routing |
| `visibility` | `'private_child' \| 'parent' \| 'vault_candidate'` | Default `parent` för meddelande till pappa |
| `childAlias` | string | Kasper / Arvid |
| `contentType` | `'text' \| 'voice' \| 'mood' \| 'step'` | |
| `storageRef` | string? | Voice i Storage, CMEK |
| `vaultLinkId` | string? | Satt efter HITL till `reality_vault` |

### Ny (valfritt P2): `barnporten_devices`

| Fält | Syfte |
|------|--------|
| `childAlias` | Vem enheten tillhör |
| `deviceId` | PWA install-id |
| `parentApprovedAt` | Förälder kopplade enheten |

---

## Valv-koppling (direkt men skyddad)

| Flöde | Steg |
|-------|------|
| **Barn → pappa** | `children_logs` visibility `parent` → Familjen inkorg |
| **Barn “allvarligt”** | Flag `vault_candidate` → förälder ser banner “Granska i Valv?” |
| **Förälder godkänner** | `promoteChildLogToVault(logId)` → `reality_vault` + `sourceRef` + WORM-tidsstämpel |
| **Mönster** | `buildVaultFrequencyReport` på valv-poster; barnaggregat **deterministiskt** separat |
| **Orkester** | Barnporten-agenter i barn-UI; Valv-Orkester får `sourceSilo: barnporten` filter |

**Förbjudet:** Auto-promote barnets privat dagbok till Valv. Auto-RAG till Kunskap.

---

## Install (PWA)

| Steg | Teknik |
|------|--------|
| Manifest | `public/barnporten-manifest.webmanifest` |
| Scope | `/barnporten/*` |
| Ikon | `docs/design/barnporten/mockups/barnporten-app-icon.png` |
| Auth | Barn enkel PIN + förälder kopplar enhet (QR engångskod planerad) |
| Offline | Kö i IndexedDB → synk när online |

---

## BYGGS vs IDÉ

| **BYGGS P1** | **IDÉ P2** |
|--------------|------------|
| Spec + mockups + locked smoke | QR koppla enhet |
| `barnportenAgents.ts` | Push till förälder |
| Familjen-flik inkorg (read-only lista) | Barn redigerar efter spar |
| CB1 widget design | CB2–CB4 |
| `authorRole` + `channel` i save | Full STT pipeline |

---

## Låsning

Registrerad i [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §3–5.  
Smoke: `npm run smoke:locked-ux` (spec + agent-registry).

---

## Mockups & infografik

| Fil | Innehåll |
|-----|----------|
| [infographic.html](./barnporten/infographic.html) | Systemflöde för byggteam |
| [mockups/barnporten-hero-hub.png](./barnporten/mockups/barnporten-hero-hub.png) | Barn-hem |
| [mockups/barnporten-widget-CB1.png](./barnporten/mockups/barnporten-widget-CB1.png) | Stjärn-widget |
| [mockups/barnporten-skriv-till-pappa.png](./barnporten/mockups/barnporten-skriv-till-pappa.png) | Meddelande |
| [mockups/barnporten-orkester.png](./barnporten/mockups/barnporten-orkester.png) | Trygg-Kompisen |
| [mockups/barnporten-valv-bro.png](./barnporten/mockups/barnporten-valv-bro.png) | Förälder: till Valv |

**Välj:** skriv `valt barnporten CB1` + ev. hub-layout.
