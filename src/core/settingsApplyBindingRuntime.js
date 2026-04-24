export function createSettingsApplyBindingRuntime(deps) {
  return {
    serializeSettingsByKey: (key, fallbackSerialize) =>
      deps.settingsRegistryBridge.serializeSettingsByKey(key, fallbackSerialize),
    applySettingsByKey: (key, rawData, fallbackApply) =>
      deps.settingsRegistryBridge.applySettingsByKey(key, rawData, fallbackApply),
    normalizeAppliedSettings: (key, rawData, fallbackDefaults) =>
      deps.appliedSettingsStoreSync.normalizeAppliedSettings(key, rawData, fallbackDefaults),
    updateStoreFromAppliedSettings: (key, normalized) =>
      deps.appliedSettingsStoreSync.updateStoreFromAppliedSettings(key, normalized),
    getSettingsDefaults: (key, fallback) =>
      deps.settingsDefaultsAccess.getSettingsDefaults(key, fallback),
  };
}
