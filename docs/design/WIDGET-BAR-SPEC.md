# Widget Bar — Fyren Edge (spec)

**Status:** P0 implementerad (in-app `FyrenWidgetBar` + hemskärms-genvägar)  
**Hemskärm:** [`HOMESCREEN-WIDGETS-SPEC.md`](./HOMESCREEN-WIDGETS-SPEC.md) — WH1–WH5  
**Tema:** E — Nordic Skymning (guld, diskret)  
**Varianter:** W1–W4 — se [`planering/variants/README.md`](./planering/variants/README.md)

## Beteende (W1 — rekommenderad default)

| Gest | Resultat |
|------|----------|
| **Kollapsad** | 3px guld-prick höger kant — nästan osynlig |
| **Enkeltryck** | Tunn vertikal strip (guldikoner) |
| **Dubbeltryck prick** | **Tyst inspelning** start/stopp |
| **Long-press prick 3s** | Fyren → Valv (befintligt) |

## Åtgärder (v2 — kompakt + Projekt)

| Ikon | Etikett | Dataflöde | Status |
|------|---------|-----------|------|
| **+ Projekt** | Nytt projekt | `/projekt/ny` picker (lista, anteckning, bild…) | **KLAR** (route) |
| Öra / våg (diskret) | Tyst inspelning | `reality_vault` WORM | **KLAR** |
| Lista | Snabb lista | Nytt projekt-block `list` | **KLAR** (→ `/projekt/ny`) |
| Penna | Anteckning | Block `note` eller Valv | **KLAR** |
| Bild | Foto | Block `image` + Storage | **BYGGS** |
| Kalender | Planering | `/planering` (kanban) | **KLAR** |
| Valv | Bevis | `/dagbok?tab=bevis` + PIN | **KLAR** |

Mockup: [`galleri/widget/v2/W1-kompakt-projekt.png`](./galleri/widget/v2/W1-kompakt-projekt.png)  
Äldre enklare W1–W4: [`galleri/widget/`](./galleri/widget/) (behålls som referens).

### Tyst inspelning — krav

- **Ingen** röd REC, ingen pulserande mic på skärmen som barn kan se.
- Valfritt: dimmad “skärmsläckare”-overlay för dig (svart 5% brightness) — skärmen ser ut som av.
- Ljudfil: `vault_evidence/{uid}/discreet/{timestamp}.webm` + WORM-post `category: tyst_inspelning`.
- Stopp: samma dubbeltryck eller volym-knapp (inställning).
- Kort etisk notis första gången (inte JADE — fakta om lag eget ansvar).

## W2–W4 (alternativ)

| ID | Activation inspelning |
|----|------------------------|
| W2 | Långtryck nedre båge 1s |
| W3 | Håll dock-Kompass 1s |
| W4 | Trippeltryck nedre höger hörn 12×12px |

## Säkerhet

- Auth krävs
- Kill switch avbryter inspelning + raderar buffer
- **Ej** spara till `children_logs` automatiskt — valfritt efteråt “Spara som bevis”
- Silo: **inte** Kunskap-RAG

## Kod

```
src/modules/core/components/FyrenWidgetBar.tsx
src/modules/widgets/pages/WidgetRecordPage.tsx    // WH1
src/modules/widgets/hooks/useWidgetVaultRecording.ts
src/modules/widgets/api/widgetVaultRecording.ts
functions: ingestWidgetRecording
public/manifest.webmanifest → shortcuts[]
```

Monteras i `MainLayout`. WH1 pipeline: se [`HOMESCREEN-WIDGETS-SPEC.md`](./HOMESCREEN-WIDGETS-SPEC.md).
