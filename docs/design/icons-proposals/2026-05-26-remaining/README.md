# Återstående ikoner — 3 förslag per familj (legacy)

**Ny huvudbatch:** **[`../2026-05-26-v3-chassis/`](../2026-05-26-v3-chassis/)** — 5 stilar × 10 kategorier (50), samma DNA som **D1/M3**. Öppna `v3-chassis/preview.html`.

**Stil:** Premium Helros — [`ICON-STYLE-GUIDE.md`](../../ICON-STYLE-GUIDE.md)  
**Låst (byt ej):** B1 · D1 · M2 — [`.context/locked-icons.md`](../../../.context/locked-icons.md)

Öppna [`preview.html`](./preview.html).

### Förhandsgranska med ikoner (http, inte bara editorn)

Relativa sökvägar (`familjen/…`, `hero/…`) kräver att sidan servas från **den här mappen** (annars risk för tomma rutor om förhandsvisningen använder fel bas-URL).

```bash
cd docs/design/icons-proposals/2026-05-26-remaining
./serve-preview.sh
```

Sedan öppna i webbläsare: `http://127.0.0.1:8765/preview.html` (valfritt annat portnummer: `./serve-preview.sh 9000`).

Alternativ utan skript: `python3 -m http.server 8765 --bind 127.0.0.1` i samma mapp.

## Chrome (meny + dock)

| Familj | Nu (Lucide) | F1–F3 / H1–H3 … | Plats |
|--------|-------------|-----------------|-------|
| Familjen | Users | F1–F3 | drawer, dock vänster |
| Hamn | Anchor | H1–H3 | drawer |
| Valv | ValvArchIcon | V1–V3 | drawer Valv, PIN |
| Dagbok | BookOpen | J1–J3 | drawer, dock höger |
| Planering | Calendar | P1–P3 | drawer hub |
| MåBra | Sparkles | A1–A3 | drawer hub |

## Hero-orbit (Hem)

| Familj | Nu | R1–R3 … | Plats |
|--------|-----|---------|-------|
| Rutiner | HeroRutinerIcon | R1–R3 | nord |
| Ekonomi | HeroEkonomiIcon | E1–E3 | öst |
| Utveckling | HeroUtvecklingIcon | U1–U3 | syd |
| Kunskap | HeroKunskapIcon | K1–K3 | väst |

## Välj

Skriv t.ex. `F2, H1, V3, J2, P1, A2, R3, E2, U1, K3 — byt in resten`

Submenyer (Valv-flikar, inkast) följer samma stil när hub-ikon valts.
