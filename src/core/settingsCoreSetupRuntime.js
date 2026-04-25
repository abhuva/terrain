import { createTimeStateBindingRuntime } from "./timeStateBindingRuntime.js";
import { createTimeStateFacadeRuntime } from "./timeStateFacadeRuntime.js";
import { createAppliedSettingsStoreSync } from "./appliedSettingsStoreSync.js";
import { createSimulationKnobAccess } from "./simulationKnobAccess.js";
import { createSettingsRegistryBridge } from "./settingsRegistryBridge.js";
import { createSettingsDefaultsAccess } from "./settingsDefaultsAccess.js";
import { createSettingsApplyBindingRuntime } from "./settingsApplyBindingRuntime.js";
import { createSettingsFacadeRuntime } from "./settingsFacadeRuntime.js";

export function createSettingsCoreSetupRuntime(deps) {
  const timeStateBindingRuntime = createTimeStateBindingRuntime({
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

  const timeStateFacadeRuntime = createTimeStateFacadeRuntime(timeStateBindingRuntime);
  const appliedSettingsStoreSync = createAppliedSettingsStoreSync({
    runtimeCore: deps.runtimeCore,
    getSettingsDefaults: deps.getSettingsDefaults,
    clamp: deps.clamp,
    normalizeSimTickHours: deps.normalizeSimTickHours,
    normalizeRoutingMode: deps.normalizeRoutingMode,
  });
  const simulationKnobAccess = createSimulationKnobAccess({
    getCoreState: deps.getCoreState,
  });
  const settingsRegistryBridge = createSettingsRegistryBridge({
    settingsRegistry: deps.settingsRegistry,
  });
  const settingsDefaultsAccess = createSettingsDefaultsAccess({
    settingsRegistry: deps.settingsRegistry,
  });
  const settingsApplyBindingRuntime = createSettingsApplyBindingRuntime({
    settingsRegistryBridge,
    appliedSettingsStoreSync,
    settingsDefaultsAccess,
  });
  const settingsFacadeRuntime = createSettingsFacadeRuntime({
    settingsApplyBindingRuntime,
    getSettingsRuntimeBinding: deps.getSettingsRuntimeBinding,
    getLegacyBindings: deps.getLegacyBindings,
  });

  return {
    timeStateFacadeRuntime,
    simulationKnobAccess,
    settingsApplyBindingRuntime,
    settingsFacadeRuntime,
  };
}
