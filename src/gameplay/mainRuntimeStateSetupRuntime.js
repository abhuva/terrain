import { createMainRuntimeStateBinding } from "./mainRuntimeStateBinding.js";

export function createMainRuntimeStateSetupRuntime(deps) {
  return createMainRuntimeStateBinding({
    store: deps.store,
    getCoreSwarm: deps.getCoreSwarm,
    getCorePathfinding: deps.getCorePathfinding,
    getCoreCursorLight: deps.getCoreCursorLight,
    getCorePointLights: deps.getCorePointLights,
    getSettingsDefaults: deps.getSettingsDefaults,
    defaultSwarmSettings: deps.defaultSwarmSettings,
    clamp: deps.clamp,
    swarmZMax: deps.swarmZMax,
    zoomMin: deps.zoomMin,
    zoomMax: deps.zoomMax,
    normalizeRoutingMode: deps.normalizeRoutingMode,
    getCurrentMapFolderPath: deps.getCurrentMapFolderPath,
    splatSize: deps.splatSize,
    cursorLightState: deps.cursorLightState,
    updateStoreFromAppliedSettings: deps.updateStoreFromAppliedSettings,
    normalizeAppliedSettings: deps.normalizeAppliedSettings,
    applySwarmSettingsLegacy: deps.applySwarmSettingsLegacy,
    stopSwarmFollow: deps.stopSwarmFollow,
    swarmState: deps.swarmState,
  });
}
