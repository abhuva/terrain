import { createLightLabelRuntime } from "./lightLabelRuntime.js";

export function createLightLabelBindingRuntime(deps) {
  const lightLabelRuntime = createLightLabelRuntime({
    clamp: deps.clamp,
    pointLightStrengthInput: deps.pointLightStrengthInput,
    pointLightStrengthValue: deps.pointLightStrengthValue,
    pointLightIntensityInput: deps.pointLightIntensityInput,
    pointLightIntensityValue: deps.pointLightIntensityValue,
    pointLightHeightOffsetInput: deps.pointLightHeightOffsetInput,
    pointLightHeightOffsetValue: deps.pointLightHeightOffsetValue,
    pointLightFlickerInput: deps.pointLightFlickerInput,
    pointLightFlickerValue: deps.pointLightFlickerValue,
    pointLightFlickerSpeedInput: deps.pointLightFlickerSpeedInput,
    pointLightFlickerSpeedValue: deps.pointLightFlickerSpeedValue,
    cursorLightStrengthValue: deps.cursorLightStrengthValue,
    getCursorLightSnapshot: deps.getCursorLightSnapshot,
    cursorLightHeightOffsetValue: deps.cursorLightHeightOffsetValue,
  });
  return {
    updatePointLightStrengthLabel: (value) => lightLabelRuntime.updatePointLightStrengthLabel(value),
    updatePointLightIntensityLabel: (value) => lightLabelRuntime.updatePointLightIntensityLabel(value),
    updatePointLightHeightOffsetLabel: (value) => lightLabelRuntime.updatePointLightHeightOffsetLabel(value),
    updatePointLightFlickerLabel: (value) => lightLabelRuntime.updatePointLightFlickerLabel(value),
    updatePointLightFlickerSpeedLabel: (value) => lightLabelRuntime.updatePointLightFlickerSpeedLabel(value),
    updateCursorLightStrengthLabel: () => lightLabelRuntime.updateCursorLightStrengthLabel(),
    updateCursorLightHeightOffsetLabel: () => lightLabelRuntime.updateCursorLightHeightOffsetLabel(),
  };
}
