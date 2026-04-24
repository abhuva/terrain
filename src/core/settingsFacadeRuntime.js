export function createSettingsFacadeRuntime(deps) {
  function getLegacyBindings() {
    return typeof deps.getLegacyBindings === "function" ? (deps.getLegacyBindings() || {}) : {};
  }

  function getSettingsRuntimeBinding() {
    return typeof deps.getSettingsRuntimeBinding === "function" ? deps.getSettingsRuntimeBinding() : null;
  }

  function callLegacy(name, ...args) {
    const bindings = getLegacyBindings();
    if (typeof bindings[name] !== "function") {
      throw new Error(`settingsFacadeRuntime missing legacy binding: ${name}`);
    }
    return bindings[name](...args);
  }

  function callCanonical(name, ...args) {
    const binding = getSettingsRuntimeBinding();
    if (!binding || typeof binding[name] !== "function") {
      throw new Error(`settingsFacadeRuntime missing canonical binding: ${name}`);
    }
    return binding[name](...args);
  }

  return {
    serializeLightingSettingsLegacy: (...args) => callLegacy("serializeLightingSettingsLegacy", ...args),
    applyLightingSettingsLegacy: (...args) => callLegacy("applyLightingSettingsLegacy", ...args),
    serializeFogSettingsLegacy: (...args) => callLegacy("serializeFogSettingsLegacy", ...args),
    applyFogSettingsLegacy: (...args) => callLegacy("applyFogSettingsLegacy", ...args),
    serializeParallaxSettingsLegacy: (...args) => callLegacy("serializeParallaxSettingsLegacy", ...args),
    applyParallaxSettingsLegacy: (...args) => callLegacy("applyParallaxSettingsLegacy", ...args),
    serializeCloudSettingsLegacy: (...args) => callLegacy("serializeCloudSettingsLegacy", ...args),
    applyCloudSettingsLegacy: (...args) => callLegacy("applyCloudSettingsLegacy", ...args),
    serializeWaterSettingsLegacy: (...args) => callLegacy("serializeWaterSettingsLegacy", ...args),
    applyWaterSettingsLegacy: (...args) => callLegacy("applyWaterSettingsLegacy", ...args),
    serializeInteractionSettingsLegacy: (...args) => callLegacy("serializeInteractionSettings", ...args),
    applyInteractionSettingsLegacy: (...args) => callLegacy("applyInteractionSettingsLegacy", ...args),
    serializeSwarmDataLegacy: (...args) => callLegacy("serializeSwarmDataLegacy", ...args),
    applySwarmSettingsLegacy: (...args) => callLegacy("applySwarmSettingsLegacy", ...args),
    applySwarmData: (...args) => callLegacy("applySwarmData", ...args),
    syncPathfindingSettingsUi: (...args) => callLegacy("syncPathfindingSettingsUi", ...args),
    serializeLightingSettings: (...args) => callCanonical("serializeLightingSettings", ...args),
    applyLightingSettings: (...args) => callCanonical("applyLightingSettings", ...args),
    serializeFogSettings: (...args) => callCanonical("serializeFogSettings", ...args),
    applyFogSettings: (...args) => callCanonical("applyFogSettings", ...args),
    serializeParallaxSettings: (...args) => callCanonical("serializeParallaxSettings", ...args),
    applyParallaxSettings: (...args) => callCanonical("applyParallaxSettings", ...args),
    serializeCloudSettings: (...args) => callCanonical("serializeCloudSettings", ...args),
    applyCloudSettings: (...args) => callCanonical("applyCloudSettings", ...args),
    serializeWaterSettings: (...args) => callCanonical("serializeWaterSettings", ...args),
    applyWaterSettings: (...args) => callCanonical("applyWaterSettings", ...args),
    serializeInteractionSettings: (...args) => callCanonical("serializeInteractionSettings", ...args),
    applyInteractionSettings: (...args) => callCanonical("applyInteractionSettings", ...args),
    serializeSwarmData: (...args) => callCanonical("serializeSwarmData", ...args),
    applySwarmSettings: (...args) => callCanonical("applySwarmSettings", ...args),
    getSettingsDefaults: (key, fallback) => {
      const binding = getSettingsRuntimeBinding();
      if (binding && typeof binding.getSettingsDefaults === "function") {
        return binding.getSettingsDefaults(key, fallback);
      }
      return deps.settingsApplyBindingRuntime.getSettingsDefaults(key, fallback);
    },
  };
}
