import test from "node:test";
import assert from "node:assert/strict";

import { createRuntimeSyncFacadeRuntime } from "../src/gameplay/runtimeSyncFacadeRuntime.js";

test("runtimeSyncFacadeRuntime delegates sync and movement ownership through lazy getters", () => {
  const calls = [];
  const runtime = createRuntimeSyncFacadeRuntime({
    getMainRuntimeStateFacade: () => ({
      syncMapStateToStore: (value) => {
        calls.push(["syncMapStateToStore", value]);
        return "map";
      },
      syncPointLightsStateToStore: (liveUpdate, armed) => {
        calls.push(["syncPointLightsStateToStore", liveUpdate, armed]);
        return "lights";
      },
    }),
    getPlayerRuntimeBinding: () => ({
      syncPlayerStateToStore: () => {
        calls.push(["syncPlayerStateToStore"]);
        return "player";
      },
    }),
    getSwarmRuntimeSetupRuntime: () => ({
      syncSwarmFollowToStore: () => {
        calls.push(["syncSwarmFollowToStore"]);
        return "follow";
      },
      syncSwarmRuntimeStateToStore: () => {
        calls.push(["syncSwarmRuntimeStateToStore"]);
        return "runtime";
      },
      syncSwarmStateToStore: () => {
        calls.push(["syncSwarmStateToStore"]);
        return "swarm";
      },
    }),
    getMovementSystem: () => ({
      getSnapshot: () => {
        calls.push(["getSnapshot"]);
        return { active: true };
      },
      replaceQueue: (pathPixels, simTickHours) => {
        calls.push(["replaceQueue", pathPixels, simTickHours]);
        return true;
      },
      cancelQueue: () => {
        calls.push(["cancelQueue"]);
        return false;
      },
    }),
    resolveSimTickHours: () => 0.25,
  });

  assert.equal(runtime.syncMapStateToStore("m"), "map");
  assert.equal(runtime.syncPointLightsStateToStore(true, false), "lights");
  assert.equal(runtime.syncPlayerStateToStore(), "player");
  assert.equal(runtime.syncSwarmFollowToStore(), "follow");
  assert.equal(runtime.syncSwarmRuntimeStateToStore(), "runtime");
  assert.equal(runtime.syncSwarmStateToStore(), "swarm");
  assert.deepEqual(runtime.getMovementStateSnapshot(), { active: true });
  assert.equal(runtime.replaceMovementQueue([{ x: 1, y: 2 }]), true);
  assert.equal(runtime.cancelMovementQueue(), false);

  assert.deepEqual(calls, [
    ["syncMapStateToStore", "m"],
    ["syncPointLightsStateToStore", true, false],
    ["syncPlayerStateToStore"],
    ["syncSwarmFollowToStore"],
    ["syncSwarmRuntimeStateToStore"],
    ["syncSwarmStateToStore"],
    ["getSnapshot"],
    ["replaceQueue", [{ x: 1, y: 2 }], 0.25],
    ["cancelQueue"],
  ]);
});
