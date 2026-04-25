import { createSwarmCursorPointerRuntime } from "../gameplay/swarmCursorPointerRuntime.js";
import { createPathfindingRuntimeBinding } from "../gameplay/pathfindingRuntimeBinding.js";
import {
  updatePathfindingRangeLabel,
  updatePathWeightLabels,
  updatePathSlopeCutoffLabel,
  updatePathBaseCostLabel,
} from "../ui/pathfindingLabelUi.js";
import { createRenderFxUiBindingRuntime } from "../ui/renderFxUiBindingRuntime.js";
import { createRenderFxSettingsSyncRuntime } from "../ui/renderFxSettingsSyncRuntime.js";

export function createInteractionUiSetupRuntime(deps) {
  let swarmCursorPointerRuntime = null;

  function getSwarmCursorPointerBindingRuntime() {
    if (swarmCursorPointerRuntime) return swarmCursorPointerRuntime;
    swarmCursorPointerRuntime = createSwarmCursorPointerRuntime(deps.swarmCursorPointer);
    return swarmCursorPointerRuntime;
  }

  const pathfindingRuntimeBinding = createPathfindingRuntimeBinding(deps.pathfindingRuntime);
  const pathfindingLabelBindingRuntime = {
    updatePathfindingRangeLabel: () => updatePathfindingRangeLabel(deps.pathfindingLabels),
    updatePathWeightLabels: () => updatePathWeightLabels(deps.pathfindingLabels),
    updatePathSlopeCutoffLabel: () => updatePathSlopeCutoffLabel(deps.pathfindingLabels),
    updatePathBaseCostLabel: () => updatePathBaseCostLabel(deps.pathfindingLabels),
  };
  const renderFxUiBindingRuntime = createRenderFxUiBindingRuntime(deps.renderFxUi);
  const renderFxSettingsSyncRuntime = createRenderFxSettingsSyncRuntime({
    updateParallaxStrengthLabel: deps.renderFxUi.updateParallaxStrengthLabel,
    updateParallaxBandsLabel: deps.renderFxUi.updateParallaxBandsLabel,
    updateParallaxUi: deps.renderFxUi.updateParallaxUi,
    updateShadowBlurLabel: deps.renderFxUi.updateShadowBlurLabel,
    updateVolumetricLabels: deps.renderFxUi.updateVolumetricLabels,
    updateVolumetricUi: deps.renderFxUi.updateVolumetricUi,
    updatePointFlickerLabels: deps.renderFxUi.updatePointFlickerLabels,
    updatePointFlickerUi: deps.renderFxUi.updatePointFlickerUi,
    updateFogAlphaLabels: deps.renderFxUi.updateFogAlphaLabels,
    updateFogFalloffLabel: deps.renderFxUi.updateFogFalloffLabel,
    updateFogStartOffsetLabel: deps.renderFxUi.updateFogStartOffsetLabel,
    updateFogUi: deps.renderFxUi.updateFogUi,
    updateCloudLabels: deps.renderFxUi.updateCloudLabels,
    updateCloudUi: deps.renderFxUi.updateCloudUi,
    updateWaterLabels: deps.renderFxUi.updateWaterLabels,
    updateWaterUi: deps.renderFxUi.updateWaterUi,
  });

  return {
    updateSwarmCursorFromPointer: (clientX, clientY) =>
      getSwarmCursorPointerBindingRuntime().updateSwarmCursorFromPointer(clientX, clientY),
    getSwarmCursorPointerBindingRuntime,
    pathfindingRuntimeBinding,
    pathfindingLabelBindingRuntime,
    renderFxUiBindingRuntime,
    renderFxSettingsSyncRuntime,
  };
}
