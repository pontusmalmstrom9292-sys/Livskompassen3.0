/**
 * Zero Footprint Audit Trail
 * Loggar VARJE session-event för privacy-compliance
 */

export interface SessionAuditEvent {
  timestamp: number;
  userId: string;
  sessionId: string;
  eventType: 'created' | 'invalidated' | 'extended' | 'device_cleared';
  details?: Record<string, unknown>;
}

class ZeroFootprintAudit {
  private events: SessionAuditEvent[] = [];
  private readonly MAX_EVENTS = 50000;

  logSessionCreated(userId: string, sessionId: string): void {
    this.recordEvent('created', userId, sessionId, { reason: 'user_login' });
  }

  logSessionInvalidated(userId: string, sessionId: string, reason: string): void {
    this.recordEvent('invalidated', userId, sessionId, { reason });
  }

  logSessionExtended(userId: string, sessionId: string): void {
    this.recordEvent('extended', userId, sessionId, { reason: 'idle_timeout_reset' });
  }

  logDeviceCleared(userId: string, sessionId: string): void {
    this.recordEvent('device_cleared', userId, sessionId, { reason: 'user_initiated' });
  }

  private recordEvent(
    eventType: SessionAuditEvent['eventType'],
    userId: string,
    sessionId: string,
    details?: Record<string, unknown>,
  ): void {
    const event: SessionAuditEvent = {
      timestamp: Date.now(),
      userId,
      sessionId,
      eventType,
      details,
    };

    this.events.push(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift();
    }
  }

  getAuditTrail(userId: string): SessionAuditEvent[] {
    return this.events.filter(e => e.userId === userId);
  }

  getAllEvents(): SessionAuditEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const zeroFootprintAudit = new ZeroFootprintAudit();
