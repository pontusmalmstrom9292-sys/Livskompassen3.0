# Orkester nattpass — 2026-06-27

**Kört:** 2026-06-27T22:48:05.611Z
**Git:** main @ d2a0a38a5 (2 unstaged)

## Faser

| Fas | Status | ms |
|-----|--------|-----|
| UX Guardian | PASS | 2276 |
| Cursor-native rollout | SKIP_FAIL | 1054477 |
| Innehall U6 | PASS | 237 |
| Locked icons | PASS | 141 |
| ADK Weaver | PASS | 6254 |
| Capability Gate | FAIL | 914 |
| Evaluate Economy Access | PASS | 871 |
| Functions build | PASS | 5645 |
| Frontend build | PASS | 22042 |
| ESLint | SKIP_FAIL | 30778 |

## Sammanfattning

1 fas(er) **FAIL** — se detaljer i `.orkester/runs/`.

## Nästa steg (1)

Fixa **Capability Gate** — [orkester_capability_gate] Error during capability evaluation: Error: 7 PERMISSION_DENIED: This API method requires billing to be enabled. Please enable billing on project gen-lang-client-0481875058 by visiting https://console.developers.google.com/billing/enable?project=gen-lang-client-0481875058 then retry. If you enabled billing for this project recently, wait a few minutes for the action to propagate to our systems and retry..

## Detaljer (FAIL)

### Capability Gate

```
[orkester_capability_gate] Error during capability evaluation: Error: 7 PERMISSION_DENIED: This API method requires billing to be enabled. Please enable billing on project gen-lang-client-0481875058 by visiting https://console.developers.google.com/billing/enable?project=gen-lang-client-0481875058 then retry. If you enabled billing for this project recently, wait a few minutes for the action to propagate to our systems and retry.
    at callErrorFromStatus (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/call.js:32:19)
    at Object.onReceiveStatus (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/client.js:359:73)
    at Object.onReceiveStatus (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:327:181)
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/resolving-call.js:135:78
    at process.processTicksAndRejections (node:internal/process/task_queues:85:11)
for call at
    at ServiceClientImpl.makeServerStreamRequest (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/client.js:342:32)
    at ServiceClientImpl.<anonymous> (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@grpc/grpc-js/build/src/make-client.js:105:19)
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/v1/firestore_client.js:242:33
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/google-gax/build/src/streamingCalls/streamingApiCaller.js:38:28
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/google-gax/build/src/normalCalls/timeout.js:44:16
    at Object.request (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/google-gax/build/src/streamingCalls/streaming.js:234:40)
    at makeRequest (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/retry-request/index.js:159:28)
    at retryRequest (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/retry-request/index.js:119:5)
    at StreamProxy.setStream (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/google-gax/build/src/streamingCalls/streaming.js:225:37)
    at StreamingApiCaller.call (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/google-gax/build/src/streamingCalls/streamingApiCaller.js:54:16)
Caused by: Error
    at QueryUtil._getResponse (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/reference/query-util.js:44:23)
    at CollectionReference._getResponse (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/reference/query.js:784:32)
    at CollectionReference._get (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/reference/query.js:777:35)
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/reference/query.js:745:43
    at /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@google-cloud/firestore/build/src/telemetry/enabled-trace-util.js:110:30
    at NoopContextManager.with (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js:14:19)
    at ContextAPI.with (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@opentelemetry/api/build/src/api/context.js:51:46)
    at NoopTracer.startActiveSpan (/Users/Livskompassen/StudioProjects/Livskompassen3.0/functions/node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js:54:31)
    at ProxyTracer.startActiveSpan (/Users/Livskompass
```
