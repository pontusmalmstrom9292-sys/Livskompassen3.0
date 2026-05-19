## Cursor Cloud specific instructions

### Project overview

Livskompassen v2 is a React + Firebase web app ("Life OS") with three npm workspaces:

| Directory | Service | Dev command | Port |
|---|---|---|---|
| `/workspace` | Vite + React frontend | `npm run dev` | 5173 |
| `/workspace/server` | Express backend API | `npm run dev` | 3000 |
| `/workspace/functions` | Firebase Cloud Functions | `npm run build` (compile only) | — |

### Running services

- **Frontend**: `npm run dev` from the repo root starts Vite on port 5173.
- **Backend**: `npm run dev` from `server/` starts Express on port 3000. Has a health check at `GET /api/health`.
- **Functions**: `npm run build` from `functions/` compiles TypeScript. Running the emulator (`npm run serve`) requires Firebase CLI authentication and a configured project.

### Lint

Run `npx eslint .` from the repo root. ESLint config is in `eslint.config.js` and requires the dev dependencies `eslint`, `@eslint/js`, `globals`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint` (these are in `devDependencies` in root `package.json`).

### Known issues in existing code

- `src/main.tsx` (the Vite entry point) does not exist. Vite serves `index.html` but the page renders an empty `<div id="root">`. The frontend shell loads but no React app mounts.
- `src/services/agentEngine.ts` contains mixed instruction text and won't compile with `tsc`.
- Several component files are empty (0 bytes): `PasskeyLogin.tsx`, `Dagbok.tsx`, `Kompasser.tsx`, `SmartSystem.tsx`, `usePasskeys.ts`, `smartSystem.ts`, `driveService.ts`, `store/index.ts`.
- `functions/` declares `engines.node: "20"` but the VM has Node 22. The functions build fine but this causes an npm warning.

### Environment variables

The backend reads environment variables from `server/.env`. Firebase config keys (`VITE_FIREBASE_*`) and `GEMINI_API_KEY` are expected there. There is no root `.env` file; the Vite frontend gets its Firebase config from `server/.env` via the proxy or inline config.
