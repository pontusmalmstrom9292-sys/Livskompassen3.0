# PMIR — project_blocks tillåt type `video`

**Datum:** 2026-07-21  
**Collection:** `project_blocks`  
**approved: yes**

**Pontus OK:** 2026-07-21 — «står att jag inte har tillstånd att skapa projekt? kan du fixa det».

## Problem
UI (`ProjectBlockType`) inkluderar `video`, men `firestore.rules` whitelistade bara `list|note|image|task`. Create av videoprojekt → `permission-denied`.

## Ändring
Lägg till `video` i create-whitelist för `project_blocks`.

## Risk
Låg — samma ägarskap (`isOwnerCreate`), ingen WORM/silo-brott. Storage `project_media` tillät redan ägar-upload.

## Förstärkning 2026-07-21 (v2)
- isValidProjectCreate / isValidProjectBlockCreate i rules
- Storage project_media: max 50 MB + image/video MIME
- assertProjectWriteAuth + resolveProjectSaveError i alla create-vägar
- IntakeTriageModal → createProject API
- smoke:projects PASS
