import { createLightLabelBindingRuntime } from "./lightLabelBindingRuntime.js";
import { createModeInteractionRuntimeBinding } from "./modeInteractionRuntimeBinding.js";

export function createModeLightSetupRuntime(deps) {
  const lightLabelBindingRuntime = createLightLabelBindingRuntime({
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
    getCursorLightSnapshot: deps.getCursorLightSnapshot,
    cursorLightStrengthValue: deps.cursorLightStrengthValue,
    cursorLightHeightOffsetValue: deps.cursorLightHeightOffsetValue,
  });

  const modeInteractionRuntimeBinding = createModeInteractionRuntimeBinding({
    getModeValue: deps.getModeValue,
    normalizeRuntimeMode: deps.normalizeRuntimeMode,
    canUseModeTopic: deps.canUseModeTopic,
    canUseModeInteraction: deps.canUseModeInteraction,
    topicButtons: deps.topicButtons,
    topicCards: deps.topicCards,
    topicPanelEl: deps.topicPanelEl,
    topicPanelTitleEl: deps.topicPanelTitleEl,
    dockLightingModeToggle: deps.dockLightingModeToggle,
    dockPathfindingModeToggle: deps.dockPathfindingModeToggle,
    setInteractionMode: deps.setInteractionMode,
    setStatus: deps.setStatus,
    resolveInteractionModeSnapshot: deps.resolveInteractionModeSnapshot,
    getCoreGameplay: deps.getCoreGameplay,
  });

  return {
    lightLabelBindingRuntime,
    modeInteractionRuntimeBinding,
  };
}
