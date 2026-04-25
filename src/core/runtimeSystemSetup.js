import { createTimeSystem } from "../sim/timeSystem.js";
import { createLightingSystem } from "../sim/lightingSystem.js";
import { createFogSystem } from "../sim/fogSystem.js";
import { createCloudSystem } from "../sim/cloudSystem.js";
import { createWaterFxSystem } from "../sim/waterFxSystem.js";
import { createWeatherSystem } from "../sim/weatherSystem.js";

export function setupRuntimeSystems(deps) {
  deps.scheduler.addSystem(
    createTimeSystem({
      clamp: deps.clamp,
      wrapHour: deps.wrapHour,
      cycleState: deps.cycleState,
      isCycleHourScrubbing: deps.isCycleHourScrubbing,
      setCycleHourSliderFromState: deps.setCycleHourSliderFromState,
      setTimeState: () => {},
      updateStoreTime: deps.updateStoreTime,
    }),
  );

  deps.scheduler.addSystem(
    createLightingSystem({
      computeLightingParams: deps.computeLightingParams,
      setLightingState: () => {},
      updateStoreLighting: deps.updateStoreLighting,
    }),
  );

  deps.scheduler.addSystem(
    createFogSystem({
      clamp: deps.clamp,
      setFogState: () => {},
      updateStoreFog: deps.updateStoreFog,
    }),
  );

  deps.scheduler.addSystem(
    createCloudSystem({
      clamp: deps.clamp,
      setCloudState: () => {},
      updateStoreClouds: deps.updateStoreClouds,
    }),
  );

  deps.scheduler.addSystem(
    createWaterFxSystem({
      clamp: deps.clamp,
      hexToRgb01: deps.hexToRgb01,
      setWaterFxState: () => {},
      updateStoreWaterFx: deps.updateStoreWaterFx,
    }),
  );

  deps.scheduler.addSystem(
    createWeatherSystem({
      clamp: deps.clamp,
      updateStoreWeather: deps.updateStoreWeather,
    }),
  );

  deps.scheduler.addSystem(deps.movementSystem);
  deps.scheduler.initAll({ nowMs: 0, dtSec: 0 }, deps.getState());
  deps.syncMapStateToStore();
  deps.syncPlayerStateToStore();
  deps.syncSwarmStateToStore();
  deps.syncPointLightsStateToStore();
}
