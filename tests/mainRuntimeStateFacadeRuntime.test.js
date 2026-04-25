import test from "node:test";
import assert from "node:assert/strict";

import { createMainRuntimeStateFacadeRuntime } from "../src/gameplay/mainRuntimeStateFacadeRuntime.js";

test("mainRuntimeStateFacadeRuntime delegates through lazy runtime-state binding", () => {
  const calls = [];
  const facade = createMainRuntimeStateFacadeRuntime(() => ({
    syncMapStateToStore: (value) => {
      calls.push(["syncMapStateToStore", value]);
      return "map";
    },
    syncPointLightsStateToStore: (liveUpdate, armed) => {
      calls.push(["syncPointLightsStateToStore", liveUpdate, armed]);
      return "lights";
    },
    getCursorLightSnapshot: () => {
      calls.push(["getCursorLightSnapshot"]);
      return { enabled: true };
    },
    isPointLightLiveUpdateEnabled: () => {
      calls.push(["isPointLightLiveUpdateEnabled"]);
      return false;
    },
    isSwarmEnabled: () => {
      calls.push(["isSwarmEnabled"]);
      return true;
    },
  }));

  assert.equal(facade.syncMapStateToStore("x"), "map");
  assert.equal(facade.syncPointLightsStateToStore(true, false), "lights");
  assert.deepEqual(facade.getCursorLightSnapshot(), { enabled: true });
  assert.equal(facade.isPointLightLiveUpdateEnabled(), false);
  assert.equal(facade.isSwarmEnabled(), true);
  assert.deepEqual(calls, [
    ["syncMapStateToStore", "x"],
    ["syncPointLightsStateToStore", true, false],
    ["getCursorLightSnapshot"],
    ["isPointLightLiveUpdateEnabled"],
    ["isSwarmEnabled"],
  ]);
});
