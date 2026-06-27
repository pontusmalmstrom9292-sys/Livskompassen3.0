# Aktivera Cursor Automation: pr-yolo-audit

**Syfte:** När en PR öppnas eller uppdateras kommenterar en Cursor-agent med **GO** eller **NO-GO** (read-only). Det stoppar **inte** merge — det är extra rådgivning utöver GitHub `smoke`.

**Mall:** `docs/cursor-automations/prefill-pr-yolo-audit.json`

---

## En gång (du, ~3 min)

1. Öppna **Cursor** → **Settings** (kugghjul) → **Automations**  
   *(Eller gå till [cursor.com/dashboard](https://cursor.com/dashboard) → Cloud Agents / Automations.)*
2. Klicka **New automation** (eller **Import** om det finns).
3. Kopiera innehållet från `prefill-pr-yolo-audit.json` i repot, eller be en agent: *"Öppna Automations-editorn med prefill från docs/cursor-automations/prefill-pr-yolo-audit.json"*.
4. Kontrollera:
   - **Trigger:** Pull request på `pontusmalmstrom9292-sys/Livskompassen3.0`
   - **Action:** Comment on PR
   - **Prompt:** YOLO-checklista (WORM, silos, secrets, Locked UX)
5. **Save** och **Enable**.

Kräver Cursor-plan med **Cloud Automations** aktiverat.

---

## Efteråt (automatiskt)

| Händelse | Vad händer |
|----------|------------|
| Ny PR mot `main` | Agent kommenterar GO/NO-GO |
| Ny push på PR | Kommentar uppdateras |

**Du gör:** Läs kommentaren. Vid NO-GO — be agent fixa innan merge. Vid GO — merge fortfarande bara om **`smoke`** är grön (GitHub Lås 2).

---

## Felsökning

| Problem | Åtgärd |
|---------|--------|
| Ingen kommentar | Automation enabled? Repo-namn exakt? Cloud Agents på kontot? |
| Fel repo | Ändra `repos` i triggern till `pontusmalmstrom9292-sys/Livskompassen3.0` |

---

## Relaterat

- Hårt lås (merge): `docs/governance/BRANCH-PROTECTION-PONTUS.md`
- YOLO-agent manuellt: `/yolo-vakt` i Cursor-chatt
