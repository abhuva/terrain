import { createModeStateRuntimeBinding } from "../core/modeStateRuntimeBinding.js";
import { createModeCapabilitiesUi } from "./modeCapabilitiesUi.js";
import { createTopicPanelRuntime } from "./topicPanelRuntime.js";

export function createModeTopicRuntimeBinding(deps) {
  const modeStateRuntimeBinding = createModeStateRuntimeBinding({
    getModeValue: deps.getModeValue,
    normalizeRuntimeMode: deps.normalizeRuntimeMode,
    canUseModeTopic: deps.canUseModeTopic,
    canUseModeInteraction: deps.canUseModeInteraction,
  });

  function getRuntimeMode() {
    return modeStateRuntimeBinding.getRuntimeMode();
  }

  function canUseTopicInCurrentMode(topic) {
    return modeStateRuntimeBinding.canUseTopicInCurrentMode(topic);
  }

  function canUseInteractionInCurrentMode(mode) {
    return modeStateRuntimeBinding.canUseInteractionInCurrentMode(mode);
  }

  const modeCapabilitiesUi = createModeCapabilitiesUi({
    topicButtons: deps.topicButtons,
    topicCards: deps.topicCards,
    topicPanelEl: deps.topicPanelEl,
    topicPanelTitleEl: deps.topicPanelTitleEl,
    dockLightingModeToggle: deps.dockLightingModeToggle,
    dockPathfindingModeToggle: deps.dockPathfindingModeToggle,
    getRuntimeMode,
    canUseModeTopic: deps.canUseModeTopic,
    canUseModeInteraction: deps.canUseModeInteraction,
    getInteractionModeSnapshot: deps.getInteractionModeSnapshot,
    setInteractionMode: deps.setInteractionMode,
  });

  const topicPanelRuntime = createTopicPanelRuntime({
    modeCapabilitiesUi,
    canUseTopicInCurrentMode,
    setStatus: deps.setStatus,
    getRuntimeMode,
  });

  return {
    getRuntimeMode,
    canUseTopicInCurrentMode,
    canUseInteractionInCurrentMode,
    setTopicPanelVisible: (visible) => topicPanelRuntime.setTopicPanelVisible(visible),
    setActiveTopic: (topicName) => topicPanelRuntime.setActiveTopic(topicName),
    updateModeCapabilitiesUi: () => topicPanelRuntime.updateModeCapabilitiesUi(),
  };
}
