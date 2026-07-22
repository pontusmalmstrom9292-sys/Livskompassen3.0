# Unlock — MOD-WIDGET capture MediaStore lint

```yaml
approved: yes
date: 2026-07-22
module: MOD-WIDGET
scope: lint-NewApi MediaStore.Downloads
```

## Change

Annotate `WidgetCaptureStore.writeToMediaStoreDownloads` with `@RequiresApi(Q)`.
Caller already gates on `SDK_INT >= Q`. No behavior change — Android CI lint unblock for merge to main.

## MUST NOT

- No WIS flow change · no remove capture store
