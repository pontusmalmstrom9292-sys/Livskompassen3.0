# Lägg till minne — så gör du i appen

Du behöver **inte** läsa långa instruktioner. Gör så här:

## Steg 1 — Öppna Minne

1. Starta appen (`npm run dev` om den inte kör).
2. Gå till **Vardagen** (Kompasser).
3. Fliken **Kunskap** (`/vardagen?tab=kunskap`).

## Steg 2 — Fyll hela profilen (engång, rekommenderat)

Överst på **Kunskapsvalv**-fliken (inte Tidshjulet): kortet **"Profil saknas i Kunskapsvalvet"**.

- Tryck **Importera min profil** (~50 poster: ADHD, GAD, barn, strategi).
- Vänta tills det står klart (kostar några embeddings — gör det **en gång**).

Då kan Kunskapschatten svara på t.ex. diagnoser och Kasper i skolan.

## Steg 3 — Lägg till en egen sak

Under import-kortet: **Lägg till i Minne**.

1. Tryck en knapp: **ADHD** · **Ångest** · **Känslor** · **Barn** · **Återhämtning**
2. Fyll i rutorna (mallen är förifylld).
3. Tryck **Spara i Minne**.

**BBIC-daglig logg om barnen** → spara i **Familjen**, inte här.

## Var sparas det?

| Plats | Vad |
|-------|-----|
| Kunskap / Tidshjulet | Det du sparar här — Kompis kan söka |
| Familjen | Barnens dagliga logg |
| Fyren (Valv) | Bevis — kryssa bara i om det är juridiskt viktigt |

---

## För utvecklare / terminal (valfritt)

```bash
node scripts/seed_kampspar_profile.mjs --skip-existing
```

Kräver `.env` och samma Firebase-konto som i appen.

Detaljer om kategorier och kostnad: [`BILLIG-DRIFT-OCH-DOMAN-EXPERTER.md`](BILLIG-DRIFT-OCH-DOMAN-EXPERTER.md).
