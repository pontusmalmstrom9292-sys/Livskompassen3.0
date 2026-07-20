# ADR-003: Zero Footprint Session Management

**Date:** 2026-07-20  
**Status:** Approved  
**Authors:** System Design

## Context

Users in crisis situations need complete privacy assurance that:
1. Local data cannot be recovered after logout
2. Device sharing requires complete session isolation
3. Physical device searches find no evidence

## Decision

Implement **Zero Footprint** session management:

1. **No persistent local state:**
   - IndexedDB cleared on logout
   - localStorage never used for sensitive data

2. **Idle timeout:**
   - Sessions expire after 1 hour
   - Automatic invalidation

3. **Device Clear:**
   - "Rensa enheten" clears all local data
   - Server-side invalidation
   - Complete audit trail

## Consequences

✅ Device physical search finds no evidence  
✅ Shared devices fully isolated  
✅ GDPR-compliant data deletion
