/**
 * Privacy blur after idle — DISABLED.
 *
 * Runtime evidence (debug 118fef): the overlay made the UI unreadable after 30s
 * and felt like "scroll broken", even with pointer-events-none. Nested hub
 * scroll never cleared idle state reliably for Pontus on G85.
 *
 * Keep the module exported as a no-op so App.tsx mount stays stable.
 */
export function InactivityBlurOverlay() {
  return null;
}
