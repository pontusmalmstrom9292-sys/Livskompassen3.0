# Valv-ikon — KANON (ny)

**Beslut 2026-05-23:** Ersätter **sköld + bock** i dock/meny.  
**Gammal (ej använd):** [`VALV-DOCK-OLD-shield-ref.png`](./VALV-DOCK-OLD-shield-ref.png)

---

## Ny ikon

| | |
|---|---|
| **Form** | **Valvbåge** — klassisk båge + pelare + döröppning (line gold) |
| **Inte** | Sköld, hänglås som primär, bock i sköld |
| **Kod** | `src/modules/core/ui/ValvArchIcon.tsx` |
| **PNG** | [`valv-icon-kanon.png`](./valv-icon-kanon.png) |

Samma språk som sidomeny-kanon (valvbåge), inte Bevis-sköld.

---

## Dock — ingen båge

| Bort | Kvar |
|------|------|
| Halvcirkel / båge bakom mitt-kompass | Platt glas-lista `dock-nav--hub` |
| Ellipse-glow under orbit (`dock-orbit-stage::before`) | Rund kompass-platta (cirkel, **inte** båge) |
| Text «Hamn» under kompass | Endast kompass-ikon · `aria-label="Hem"` |

Se [`DOCK-KANON.md`](./DOCK-KANON.md).

---

## Mockup dock (mål)

[`dock-flat-valv-arch.png`](./dock-flat-valv-arch.png) — Familjen · kompass · Valv (båge-ikon), **utan** upphöjd båge.
