# Theme Lab — jämför och bestäm design

**Preview:** http://localhost:5173/dev/theme-lab  
**Enklare väljare:** http://localhost:5173/dev/themes

---

## Så här jobbar du

1. Kör `pnpm run dev`
2. Öppna **Theme Lab** i webbläsaren
3. Klicka på ett **utkast** → se mini-previews (dock, meny-rad, kompass-färger)
4. Klicka **Använd i appen** → testa på Hem, Familjen, Hamn
5. Skriv beslut i `docs/design/theme-lab/VARIANTS.md` och `ICON-DECISIONS.md`

---

## Cursor-underagent

Säg i chatten:

```
Kör specialist-theme-lab: skapa 2–3 nya I-stone-utkast, uppdatera VARIANTS.md, förbättra Theme Lab om det behövs. Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän build är felfri.
```

Agent: `.cursor/agents/specialist-theme-lab.md`

---

## Filer

| Fil | Innehåll |
|-----|----------|
| `src/modules/core/theme/themeLabVariants.ts` | Utkast (ej prod förrän godkänt) |
| `src/modules/core/theme/themeRegistry.ts` | Godkända teman |
| `docs/design/theme-lab/VARIANTS.md` | Beslut logg |
| `docs/design/theme-lab/ICON-DECISIONS.md` | Ikoner meny/dock/hero |
| `docs/design/themes/K-PACK-EIGHT-VARIANTS.md` | **Pack K** — 8 nya varianter (2026-05-28) |

---

## Mockup-referenser

- [`I-architect-vault/00-smart-widget-expanded.png`](../../public/design/themes/I-architect-vault/00-smart-widget-expanded.png)
- [`MENU-DRAWER-KANON.png`](references/MENU-DRAWER-KANON.png)
- [`DOCK-KANON.md`](references/DOCK-KANON.md)
