import test from "node:test";
import assert from "node:assert/strict";

import { createSystemStoreSyncRuntime } from "../src/core/systemStoreSyncRuntime.js";

function createStore(initialState) {
  let state = initialState;
  return {
    getState: () => state,
    update: (updater) => {
      state = updater(state);
    },
  };
}

test("systemStoreSyncRuntime writes time and system slices into canonical store state", () => {
  const store = createStore({
    clock: {
      nowSec: 0,
      timeScale: 0,
    },
    systems: {
      time: {
        cycleSpeedHoursPerSec: 0,
      },
      lighting: {},
      fog: {},
      clouds: {},
      waterFx: {},
    },
    simulation: {
      weather: {},
    },
    ui: {
      cycleHour: 0,
    },
  });
  const runtime = createSystemStoreSyncRuntime({
    store,
    clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
    cycleState: { hour: 14.25 },
  });

  runtime.updateStoreTime({
    nowSec: 12,
    cycleSpeedHoursPerSec: 4,
    ticksProcessed: 3,
  });
  runtime.updateStoreLighting({ ambient: 0.3 });
  runtime.updateStoreFog({ enabled: true });
  runtime.updateStoreClouds({ coverage: 0.5 });
  runtime.updateStoreWaterFx({ useWaterFx: true });
  runtime.updateStoreWeather({ type: "rain", intensity: 0.4 });

  assert.deepEqual(store.getState().clock, {
    nowSec: 12,
    timeScale: 1,
  });
  assert.deepEqual(store.getState().systems.time, {
    cycleSpeedHoursPerSec: 4,
    nowSec: 12,
    ticksProcessed: 3,
  });
  assert.deepEqual(store.getState().systems.lighting, { ambient: 0.3 });
  assert.deepEqual(store.getState().systems.fog, { enabled: true });
  assert.deepEqual(store.getState().systems.clouds, { coverage: 0.5 });
  assert.deepEqual(store.getState().systems.waterFx, { useWaterFx: true });
  assert.deepEqual(store.getState().simulation.weather, {
    type: "rain",
    intensity: 0.4,
  });
  assert.equal(store.getState().ui.cycleHour, 14.25);
});
