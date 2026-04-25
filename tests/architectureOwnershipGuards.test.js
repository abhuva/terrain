import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function readRepoFile(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

test("command modules do not directly mutate store via ctx.store.update", () => {
  const commandModules = [
    "src/core/registerMainCommands.js",
    "src/gameplay/interactionCommands.js",
  ];
  for (const relPath of commandModules) {
    const src = readRepoFile(relPath);
    assert.equal(
      src.includes("ctx.store.update("),
      false,
      `unexpected direct store mutation found in ${relPath}`,
    );
  }
});

test("migrated gameplay helper modules do not directly call store.update", () => {
  const migratedGameplayHelpers = [
    "src/gameplay/interactionModeController.js",
    "src/gameplay/playerRuntimeBinding.js",
    "src/gameplay/movementStoreSyncRuntime.js",
    "src/gameplay/swarmFollowRuntimeState.js",
  ];
  for (const relPath of migratedGameplayHelpers) {
    const src = readRepoFile(relPath);
    assert.equal(
      src.includes("store.update("),
      false,
      `unexpected direct store mutation found in ${relPath}`,
    );
  }
});
