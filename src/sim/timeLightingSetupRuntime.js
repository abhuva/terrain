import { createLightingParamsBindingRuntime } from "./lightingParamsBindingRuntime.js";
import { createTimeUiBindingRuntime } from "../ui/timeUiBindingRuntime.js";

export function createTimeLightingSetupRuntime(deps) {
  const cycleState = {
    hour: deps.initialHour,
  };

  let lightingParamsBindingRuntime = null;
  function getLightingParamsBindingRuntime() {
    if (lightingParamsBindingRuntime) {
      return lightingParamsBindingRuntime;
    }
    lightingParamsBindingRuntime = createLightingParamsBindingRuntime({
      getSettingsDefaults: deps.getSettingsDefaults,
      defaultLightingSettings: deps.defaultLightingSettings,
      defaultFogSettings: deps.defaultFogSettings,
      sampleSunAtHour: deps.sampleSunAtHour,
      wrapHour: deps.wrapHour,
      clamp: deps.clamp,
      smoothstep: deps.smoothstep,
      lerpVec3: deps.lerpVec3,
      getFogColorManual: deps.getFogColorManual,
      rgbToHex: deps.rgbToHex,
      hexToRgb01: deps.hexToRgb01,
      zoomMin: deps.zoomMin,
      zoomMax: deps.zoomMax,
      cycleState,
    });
    return lightingParamsBindingRuntime;
  }

  let timeUiBindingRuntime = null;
  function getTimeUiBindingRuntime() {
    if (timeUiBindingRuntime) {
      return timeUiBindingRuntime;
    }
    timeUiBindingRuntime = createTimeUiBindingRuntime({
      cycleHourInput: deps.cycleHourInput,
      cycleHourValue: deps.cycleHourValue,
      cycleState,
      clamp: deps.clamp,
      formatHour: deps.formatHour,
    });
    return timeUiBindingRuntime;
  }

  return {
    cycleState,
    getLightingParamsBindingRuntime,
    getTimeUiBindingRuntime,
    computeLightingParams: (coreState = null) => getLightingParamsBindingRuntime().computeLightingParams(coreState),
    setCycleHourSliderFromState: () => getTimeUiBindingRuntime().setCycleHourSliderFromState(),
    updateCycleHourLabel: () => getTimeUiBindingRuntime().updateCycleHourLabel(),
  };
}
