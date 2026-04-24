import { createTimeStateAccess } from "./timeStateAccess.js";

export function createTimeStateBindingRuntime(deps) {
  const timeStateAccess = createTimeStateAccess({
    getSettingsDefaults: deps.getSettingsDefaults,
    defaultLightingSettings: deps.defaultLightingSettings,
    defaultCloudSettings: deps.defaultCloudSettings,
    defaultWaterSettings: deps.defaultWaterSettings,
    normalizeTimeRouting: deps.normalizeTimeRouting,
    normalizeRoutingMode: deps.normalizeRoutingMode,
    normalizeSimTickHours: deps.normalizeSimTickHours,
    getCoreState: deps.getCoreState,
    clamp: deps.clamp,
    simSecondsPerHour: deps.simSecondsPerHour,
  });
  return {
    getDefaultTimeRouting: () => timeStateAccess.getDefaultTimeRouting(),
    getConfiguredSimTickHours: () => timeStateAccess.getConfiguredSimTickHours(),
    getCurrentTimeRoutingFromStoreOrDefaults: () => timeStateAccess.getCurrentTimeRoutingFromStoreOrDefaults(),
    getConfiguredSimTickHoursFromStoreOrDefaults: () => timeStateAccess.getConfiguredSimTickHoursFromStoreOrDefaults(),
    getInterpolatedRoutedTimeSec: (systemTiming) => timeStateAccess.getInterpolatedRoutedTimeSec(systemTiming),
  };
}
