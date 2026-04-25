export function createSettingsRuntimeBinding(deps) {
  return {
    serializeLightingSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("lighting", deps.serializeLightingSettingsCompat),
    applyLightingSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "lighting",
        deps.settingsApplyRuntime.normalizeAppliedSettings(
          "lighting",
          rawData,
          deps.defaultLightingSettings,
        ),
      );
      deps.settingsApplyRuntime.applySettingsByKey("lighting", rawData, deps.applyLightingSettingsCompat);
    },
    serializeFogSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("fog", deps.serializeFogSettingsCompat),
    applyFogSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "fog",
        deps.settingsApplyRuntime.normalizeAppliedSettings("fog", rawData, deps.defaultFogSettings),
      );
      deps.settingsApplyRuntime.applySettingsByKey("fog", rawData, deps.applyFogSettingsCompat);
    },
    serializeParallaxSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("parallax", deps.serializeParallaxSettingsCompat),
    applyParallaxSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "parallax",
        deps.settingsApplyRuntime.normalizeAppliedSettings(
          "parallax",
          rawData,
          deps.defaultParallaxSettings,
        ),
      );
      deps.settingsApplyRuntime.applySettingsByKey("parallax", rawData, deps.applyParallaxSettingsCompat);
    },
    serializeCloudSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("clouds", deps.serializeCloudSettingsCompat),
    applyCloudSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "clouds",
        deps.settingsApplyRuntime.normalizeAppliedSettings("clouds", rawData, deps.defaultCloudSettings),
      );
      deps.settingsApplyRuntime.applySettingsByKey("clouds", rawData, deps.applyCloudSettingsCompat);
    },
    serializeWaterSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("waterfx", deps.serializeWaterSettingsCompat),
    applyWaterSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "waterfx",
        deps.settingsApplyRuntime.normalizeAppliedSettings("waterfx", rawData, deps.defaultWaterSettings),
      );
      deps.settingsApplyRuntime.applySettingsByKey("waterfx", rawData, deps.applyWaterSettingsCompat);
    },
    serializeInteractionSettings: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("interaction", deps.serializeInteractionSettingsCompat),
    applyInteractionSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "interaction",
        deps.settingsApplyRuntime.normalizeAppliedSettings(
          "interaction",
          rawData,
          deps.defaultInteractionSettings,
        ),
      );
      deps.settingsApplyRuntime.applySettingsByKey("interaction", rawData, deps.applyInteractionSettingsCompat);
    },
    serializeSwarmData: () =>
      deps.settingsApplyRuntime.serializeSettingsByKey("swarm", deps.serializeSwarmDataCompat),
    applySwarmSettings: (rawData) => {
      deps.settingsApplyRuntime.updateStoreFromAppliedSettings(
        "swarm",
        deps.settingsApplyRuntime.normalizeAppliedSettings("swarm", rawData, deps.defaultSwarmSettings),
      );
      deps.applySwarmSettingsCompat(rawData);
      deps.syncSwarmStateToStore();
    },
    getSettingsDefaults: (key, fallback) =>
      deps.settingsApplyRuntime.getSettingsDefaults(key, fallback),
  };
}
