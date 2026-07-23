# Unlock — MOD-VALV-SAMLA

**Date:** 2026-07-22  
**Module:** MOD-VALV-SAMLA  
**approved: yes**

## Purpose

Establish module lock for Valv Samla (Inkast + Arkivlista + Sök) after hotfix that restored `ValvSuperModule` under `valvMode=spara`. Also allows cleanup of orphan `ValvInboxZone.tsx`.

## Scope of this wave

- Lock globs: ValvInputSuperModule, ValvSuperModule, ValvSamlaZone, VaultSamlaHub, VaultLogList
- Remove deprecated `ValvInboxZone.tsx`
- Locked UX §2b + smoke guards

## Pontus

Approved as part of Valvet VERIFY + optimalitetshotfix (Cursor Agent 2026-07-22).
