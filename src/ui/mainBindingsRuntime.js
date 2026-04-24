import { bindCanvasRuntime } from "./canvasBindingRuntime.js";
import { bindPathfindingRuntime } from "./pathfindingBindingRuntime.js";
import { bindSwarmPanelRuntime } from "./swarmPanelBindingRuntime.js";
import { bindSwarmFollowRuntime } from "./swarmFollowBindingRuntime.js";
import { bindTopicPanelRuntime } from "./topicPanelBindingRuntime.js";
import { bindInteractionCycleRuntime } from "./interactionCycleBindingRuntime.js";
import { bindCursorLightRuntime } from "./cursorLightBindingRuntime.js";
import { bindPointLightEditorRuntime } from "./pointLightEditorBindingRuntime.js";
import { bindRenderFxRuntime } from "./renderFxBindingRuntime.js";
import { bindMapIoRuntime } from "./mapIoBindingRuntime.js";
import { bindRuntimeBindingRuntime } from "./runtimeBindingRuntime.js";

export function setupMainBindingsRuntime(deps) {
  bindCanvasRuntime(deps.canvasBinding);
  bindPathfindingRuntime(deps.pathfindingBinding);
  bindSwarmPanelRuntime(deps.swarmPanelBinding);
  bindSwarmFollowRuntime(deps.swarmFollowBinding);
  bindTopicPanelRuntime(deps.topicPanelBinding);
  bindInteractionCycleRuntime(deps.interactionCycleBinding);
  bindCursorLightRuntime(deps.cursorLightBinding);
  bindPointLightEditorRuntime(deps.pointLightEditorBinding);
  bindRenderFxRuntime(deps.renderFxBinding);
  bindMapIoRuntime(deps.mapIoBinding);
  bindRuntimeBindingRuntime(deps.runtimeBinding);
}
