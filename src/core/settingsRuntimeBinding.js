export function createSettingsRuntimeBinding(deps) {
  return {
    serializeLightingSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("lighting", deps.serializeLightingSettingsLegacy),
    applyLightingSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "lighting",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings(
          "lighting",
          rawData,
          deps.defaultLightingSettings,
        ),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("lighting", rawData, deps.applyLightingSettingsLegacy);
    },
    serializeFogSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("fog", deps.serializeFogSettingsLegacy),
    applyFogSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "fog",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings("fog", rawData, deps.defaultFogSettings),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("fog", rawData, deps.applyFogSettingsLegacy);
    },
    serializeParallaxSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("parallax", deps.serializeParallaxSettingsLegacy),
    applyParallaxSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "parallax",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings(
          "parallax",
          rawData,
          deps.defaultParallaxSettings,
        ),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("parallax", rawData, deps.applyParallaxSettingsLegacy);
    },
    serializeCloudSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("clouds", deps.serializeCloudSettingsLegacy),
    applyCloudSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "clouds",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings("clouds", rawData, deps.defaultCloudSettings),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("clouds", rawData, deps.applyCloudSettingsLegacy);
    },
    serializeWaterSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("waterfx", deps.serializeWaterSettingsLegacy),
    applyWaterSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "waterfx",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings("waterfx", rawData, deps.defaultWaterSettings),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("waterfx", rawData, deps.applyWaterSettingsLegacy);
    },
    serializeInteractionSettings: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("interaction", deps.serializeInteractionSettingsLegacy),
    applyInteractionSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "interaction",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings(
          "interaction",
          rawData,
          deps.defaultInteractionSettings,
        ),
      );
      deps.settingsApplyBindingRuntime.applySettingsByKey("interaction", rawData, deps.applyInteractionSettingsLegacy);
    },
    serializeSwarmData: () =>
      deps.settingsApplyBindingRuntime.serializeSettingsByKey("swarm", deps.serializeSwarmDataLegacy),
    applySwarmSettings: (rawData) => {
      deps.settingsApplyBindingRuntime.updateStoreFromAppliedSettings(
        "swarm",
        deps.settingsApplyBindingRuntime.normalizeAppliedSettings("swarm", rawData, deps.defaultSwarmSettings),
      );
      deps.applySwarmSettingsLegacy(rawData);
      deps.syncSwarmStateToStore();
    },
    getSettingsDefaults: (key, fallback) =>
      deps.settingsApplyBindingRuntime.getSettingsDefaults(key, fallback),
  };
}
