import { createInfoPanelRuntime } from "../ui/infoPanelRuntime.js";
import { createInteractionModeRuntime } from "./interactionModeRuntime.js";
import { createMainFacadeRuntime } from "./mainFacadeRuntime.js";

export function createInteractionFacadeSetupRuntime(deps) {
  const updateInfoPanelImpl = createInfoPanelRuntime({
    isSwarmEnabled: deps.isSwarmEnabled,
    getSwarmCursorMode: deps.getSwarmCursorMode,
    swarmState: deps.swarmState,
    swarmCursorState: deps.swarmCursorState,
    playerState: deps.playerState,
    getCurrentPathMetrics: deps.getCurrentPathMetrics,
    getMovementSnapshot: deps.getMovementSnapshot,
    playerInfoEl: deps.playerInfoEl,
    pathInfoEl: deps.pathInfoEl,
  });

  const interactionModeRuntime = createInteractionModeRuntime({
    applyInteractionMode: deps.applyInteractionMode,
    canUseInteractionInCurrentMode: deps.canUseInteractionInCurrentMode,
    dockLightingModeToggle: deps.dockLightingModeToggle,
    dockPathfindingModeToggle: deps.dockPathfindingModeToggle,
    movePreviewState: deps.movePreviewState,
    store: deps.store,
    requestOverlayDraw: deps.requestOverlayDraw,
  });

  const mainFacadeRuntime = createMainFacadeRuntime({
    getCameraRuntimeBinding: deps.getCameraRuntimeBinding,
    interactionModeRuntime,
    playerRuntimeBinding: deps.playerRuntimeBinding,
    parseNpcPlayerImpl: deps.parseNpcPlayerImpl,
    applyLoadedNpcImpl: deps.applyLoadedNpcImpl,
    updateInfoPanelImpl,
  });

  return {
    updateInfoPanelImpl,
    interactionModeRuntime,
    mainFacadeRuntime,
  };
}
