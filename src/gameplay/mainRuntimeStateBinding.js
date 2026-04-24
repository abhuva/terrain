import {
  getSwarmCursorMode as resolveSwarmCursorMode,
  getSwarmSettings as resolveSwarmSettings,
  getPathfindingStateSnapshot as resolvePathfindingStateSnapshot,
} from "./runtimeStateSnapshots.js";
import { syncMapState, syncPointLightsState } from "./stateSync.js";
import {
  getCursorLightSnapshot as buildCursorLightSnapshot,
  isPointLightLiveUpdateEnabled as getPointLightLiveUpdateEnabled,
} from "./interactionStateAccess.js";
import { setSwarmDefaults as applySwarmDefaults, isSwarmEnabled as resolveSwarmEnabled } from "./swarmStateAccess.js";

export function createMainRuntimeStateBinding(deps) {
  return {
    getSwarmCursorMode: () =>
      resolveSwarmCursorMode({
        getCoreSwarm: deps.getCoreSwarm,
        getSettingsDefaults: deps.getSettingsDefaults,
        defaultSwarmSettings: deps.defaultSwarmSettings,
      }),
    getSwarmSettings: () =>
      resolveSwarmSettings({
        getCoreSwarm: deps.getCoreSwarm,
        getSettingsDefaults: deps.getSettingsDefaults,
        defaultSwarmSettings: deps.defaultSwarmSettings,
        clamp: deps.clamp,
        swarmZMax: deps.swarmZMax,
        zoomMin: deps.zoomMin,
        zoomMax: deps.zoomMax,
        normalizeRoutingMode: deps.normalizeRoutingMode,
      }),
    getPathfindingStateSnapshot: () =>
      resolvePathfindingStateSnapshot({
        getCorePathfinding: deps.getCorePathfinding,
        clamp: deps.clamp,
      }),
    syncMapStateToStore: () =>
      syncMapState({
        store: deps.store,
        currentMapFolderPath: deps.getCurrentMapFolderPath(),
        splatSize: deps.splatSize,
      }),
    syncPointLightsStateToStore: (nextLiveUpdate = null, nextSaveConfirmArmed = null) =>
      syncPointLightsState({
        store: deps.store,
        isPointLightLiveUpdateEnabled: () =>
          getPointLightLiveUpdateEnabled({
            getCorePointLights: deps.getCorePointLights,
          }),
        nextLiveUpdate,
        nextSaveConfirmArmed,
      }),
    getCursorLightSnapshot: () =>
      buildCursorLightSnapshot({
        getCoreCursorLight: deps.getCoreCursorLight,
        cursorLightState: deps.cursorLightState,
        clamp: deps.clamp,
      }),
    isPointLightLiveUpdateEnabled: () =>
      getPointLightLiveUpdateEnabled({
        getCorePointLights: deps.getCorePointLights,
      }),
    isPointLightsSaveConfirmArmed: () =>
      Boolean(deps.getCorePointLights()?.saveConfirmArmed),
    setSwarmDefaults: () =>
      applySwarmDefaults({
        updateStoreFromAppliedSettings: deps.updateStoreFromAppliedSettings,
        normalizeAppliedSettings: deps.normalizeAppliedSettings,
        defaultSwarmSettings: deps.defaultSwarmSettings,
        applySwarmSettingsLegacy: deps.applySwarmSettingsLegacy,
        stopSwarmFollow: deps.stopSwarmFollow,
        swarmState: deps.swarmState,
      }),
    isSwarmEnabled: () =>
      resolveSwarmEnabled({
        getSwarmSettings: () =>
          resolveSwarmSettings({
            getCoreSwarm: deps.getCoreSwarm,
            getSettingsDefaults: deps.getSettingsDefaults,
            defaultSwarmSettings: deps.defaultSwarmSettings,
            clamp: deps.clamp,
            swarmZMax: deps.swarmZMax,
            zoomMin: deps.zoomMin,
            zoomMax: deps.zoomMax,
            normalizeRoutingMode: deps.normalizeRoutingMode,
          }),
      }),
  };
}
