/**
 * Build-wave köer för SDK marathon v34–v48.
 * Laddar .orkester/cursor-yolo-build-manifest.json
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson, root, BUILD_WAVE_MIN, BUILD_WAVE_MAX } from "./cursor_yolo_shared.mjs";

export { BUILD_WAVE_MIN, BUILD_WAVE_MAX };
export const BUILD_MANIFEST_PATH = join(root, ".orkester/cursor-yolo-build-manifest.json");

/** @returns {object | null} */
export function loadBuildManifest() {
  return readJson(BUILD_MANIFEST_PATH);
}

/** @param {number} version */
export function getBuildWaveDef(version) {
  const manifest = loadBuildManifest();
  const wave = manifest?.waves?.find((w) => w.version === version);
  if (!wave) throw new Error(`Saknar build wave v${version} i ${BUILD_MANIFEST_PATH}`);
  return wave;
}

/** @param {number} version */
export function buildBuildQueue(version) {
  const wave = getBuildWaveDef(version);
  const task = (id, title, agent, plan, smoke, extra = {}) => ({
    id,
    title,
    phase: "sequential",
    agent,
    plan,
    smoke,
    fullGate: extra.fullGate ?? false,
    pmir: extra.pmir ?? false,
    deploy: extra.deploy ?? "none",
    promptFile: extra.promptFile ?? `docs/cursor-pipeline/yolo-v${version}/${id}.md`,
  });

  return {
    version,
    description: `Cursor YOLO v${version} — BUILD ${wave.id}: ${wave.title}`,
    sequentialPhase: { label: "Build" },
    buildWave: wave,
    tasks: [
      task(`b${version}-deploy`, `B${version} — (Valfritt) deploy`, "yolo-vakt", "SKIP om ej Pontus OK deploy", [], {
        pmir: true,
        deploy: wave.deploy ?? "none",
      }),
      task(`b${version}-build`, `B${version} — ${wave.title}`, wave.agent, wave.plan, [], {
        pmir: wave.pmir ?? false,
      }),
      task(
        `b${version}-gate`,
        `B${version} — Wave gate smoke`,
        "specialist-verifier",
        `Kör task-smoke + wave-gate. Eval build-v${version}.md.`,
        wave.smoke ?? ["npm run smoke:governance"],
        { fullGate: wave.fullGate ?? false },
      ),
      task(
        `b${version}-vakt`,
        `B${version} — yolo-vakt slutgate`,
        "yolo-vakt",
        `GO/NO-GO build v${version}. Handoff v${version + 1}.`,
        wave.fullGate ? ["npm run smoke:predeploy:build"] : (wave.smoke ?? []),
        { fullGate: wave.fullGate ?? false },
      ),
    ],
  };
}

/** @param {number} version @param {ReturnType<typeof import('./cursor_yolo_shared.mjs').mkBuildConfig>} config */
export function ensureBuildWave(version, config) {
  if (version < BUILD_WAVE_MIN || version > BUILD_WAVE_MAX) {
    return { created: false, reason: "not-build-wave" };
  }

  let created = false;
  if (!existsSync(config.queuePath)) {
    writeJson(config.queuePath, buildBuildQueue(version));
    created = true;
  }
  if (!existsSync(config.statePath)) {
    const queue = readJson(config.queuePath) ?? buildBuildQueue(version);
    const deployId = queue.tasks[0]?.id;
    writeJson(config.statePath, {
      version,
      queueFile: `.orkester/cursor-yolo-queue-v${version}.json`,
      buildWaveId: queue.buildWave?.id ?? null,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sequentialPhase: {
        status: "in_progress",
        currentTaskId: null,
        completedTaskIds: [],
        skippedTaskIds: deployId ? [deployId] : [],
        failedTaskIds: [],
      },
      taskOrder: queue.tasks.map((t) => t.id),
      notes: `YOLO v${version} BUILD — SDK marathon`,
    });
    created = true;
  }
  return { created, config };
}

/** @param {number} version */
export function buildWaveSmokeList(version) {
  const wave = getBuildWaveDef(version);
  const steps = [...(wave.smoke ?? [])];
  if (wave.fullGate) steps.push("npm run smoke:predeploy:build");
  return steps;
}
