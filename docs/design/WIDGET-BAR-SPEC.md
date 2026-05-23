# Widget Bar — Fyren Edge (spec)

**Status:** Planerad implementation (P1)  
**Tema:** E — Nordic Skymning (guld, diskret)  
**Varianter:** W1–W4 — se [`planering/variants/README.md`](./planering/variants/README.md)

## Beteende (W1 — rekommenderad default)

| Gest | Resultat |
|------|----------|
| **Kollapsad** | 3px guld-prick höger kant — nästan osynlig |
| **Enkeltryck** | Tunn vertikal strip (guldikoner) |
| **Dubbeltryck prick** | **Tyst inspelning** start/stopp |
| **Long-press prick 3s** | Fyren → Valv (befintligt) |

## Åtgärder

| Ikon | Etikett | Dataflöde | Status |
|------|---------|-----------|------|
| Öra / våg (diskret) | Tyst inspelning | MediaRecorder → Storage + `reality_vault` metadata WORM | **BYGGS** |
| Mikrofon | Röstanteckning | STT → bekräftelse → `saveVaultLog` | **BYGGS** |
| Penna | Snabbanteckning | Modal → `saveVaultLog` | **BYGGS** |
| Kalender | Planering | `/planering` | **BYGGS** |
| Valv | Bevis | `/dagbok?tab=bevis` + PIN | **BYGGS** |

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

## Kod (planerat)

```
src/modules/core/components/FyrenWidgetBar.tsx      // W1
src/modules/core/hooks/useDiscreetRecording.ts
src/modules/core/hooks/useQuickVaultNote.ts
src/modules/planering/                              // Planeringssida
```

Monteras i `MainLayout`.
