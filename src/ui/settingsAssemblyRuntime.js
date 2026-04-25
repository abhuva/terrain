import { createSettingsLegacyRuntimeBinding } from "./settingsLegacyRuntimeBinding.js";
import { createSettingsRuntimeBinding } from "../core/settingsRuntimeBinding.js";

export function createSettingsAssemblyRuntime(deps) {
  const settingsLegacyBindings = createSettingsLegacyRuntimeBinding(deps.legacy);
  const settingsRuntimeBinding = createSettingsRuntimeBinding({
    settingsApplyBindingRuntime: deps.settingsApplyBindingRuntime,
    defaultLightingSettings: deps.defaultLightingSettings,
    defaultFogSettings: deps.defaultFogSettings,
    defaultParallaxSettings: deps.defaultParallaxSettings,
    defaultCloudSettings: deps.defaultCloudSettings,
    defaultWaterSettings: deps.defaultWaterSettings,
    defaultInteractionSettings: deps.defaultInteractionSettings,
    defaultSwarmSettings: deps.defaultSwarmSettings,
    serializeLightingSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeLightingSettingsLegacy(...args),
    applyLightingSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyLightingSettingsLegacy(...args),
    serializeFogSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeFogSettingsLegacy(...args),
    applyFogSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyFogSettingsLegacy(...args),
    serializeParallaxSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeParallaxSettingsLegacy(...args),
    applyParallaxSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyParallaxSettingsLegacy(...args),
    serializeCloudSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeCloudSettingsLegacy(...args),
    applyCloudSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyCloudSettingsLegacy(...args),
    serializeWaterSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeWaterSettingsLegacy(...args),
    applyWaterSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyWaterSettingsLegacy(...args),
    serializeInteractionSettingsLegacy: (...args) => deps.settingsFacadeRuntime.serializeInteractionSettingsLegacy(...args),
    applyInteractionSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applyInteractionSettingsLegacy(...args),
    serializeSwarmDataLegacy: (...args) => deps.settingsFacadeRuntime.serializeSwarmDataLegacy(...args),
    applySwarmSettingsLegacy: (...args) => deps.settingsFacadeRuntime.applySwarmSettingsLegacy(...args),
    syncSwarmStateToStore: deps.syncSwarmStateToStore,
  });

  return {
    settingsLegacyBindings,
    settingsRuntimeBinding,
  };
}
