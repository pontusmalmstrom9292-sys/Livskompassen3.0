# P4 — Google Flow research-prototyp

Max ~200 krediter. Kasta verktyget efter port till `mabraCoach`.

## Agentinstruktion (Tools Builder)

Bygg verktyg med input: capacityBand (low|mid|high), bankText (string).
Output JSON: { coach, microSteps?, capacityBand }.
low = max 2 meningar + 3 microSteps; mid/high = ack + bankText.

## Testfall

1. low + "Vilket värde är lättast att bära idag?" → microSteps.length === 3
2. mid + banktext → full coach
3. high → mid + max 1 extra mening
