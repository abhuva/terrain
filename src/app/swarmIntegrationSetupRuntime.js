import { createSwarmGameplayRuntime } from "../gameplay/swarmGameplayRuntime.js";
import { createSwarmRenderSetupRuntime } from "../gameplay/swarmRenderSetupRuntime.js";
import { createSettingsAssemblyRuntime } from "../ui/settingsAssemblyRuntime.js";
import { createInfoPanelRuntime } from "../ui/infoPanelRuntime.js";
import { setInteractionMode as applyInteractionMode } from "../gameplay/interactionModeController.js";

export function createSwarmIntegrationSetupRuntime(deps) {
  const swarmGameplayRuntime = createSwarmGameplayRuntime(deps.gameplay);

  const { settingsLegacyBindings, settingsRuntimeBinding } = createSettingsAssemblyRuntime({
    ...deps.settingsAssembly,
    legacy: {
      ...deps.settingsAssembly.legacy,
      serializeSwarmDataLegacy: swarmGameplayRuntime.serializeSwarmData,
      applySwarmData: swarmGameplayRuntime.applySwarmData,
    },
  });

  const swarmRenderSetupRuntime = createSwarmRenderSetupRuntime({
    ...deps.render,
    spawnRestingBirdNear: swarmGameplayRuntime.spawnRestingBirdNear,
    removeSwarmAgentAtIndex: swarmGameplayRuntime.removeSwarmAgentAtIndex,
    chooseRandomSwarmTargetIndexNear: swarmGameplayRuntime.chooseRandomSwarmTargetIndexNear,
    chooseRandomFollowAgentIndex: swarmGameplayRuntime.chooseRandomFollowAgentIndex,
    chooseRandomFollowHawkIndex: swarmGameplayRuntime.chooseRandomFollowHawkIndex,
    terrainFloorAtSwarmCoord: swarmGameplayRuntime.terrainFloorAtSwarmCoord,
    isWaterAtSwarmCoord: swarmGameplayRuntime.isWaterAtSwarmCoord,
    isSwarmCoordFlyable: swarmGameplayRuntime.isSwarmCoordFlyable,
  });

  const updateInfoPanelImpl = createInfoPanelRuntime({
    isSwarmEnabled: deps.interactionFacade.isSwarmEnabled,
    getSwarmCursorMode: deps.interactionFacade.getSwarmCursorMode,
    swarmState: deps.interactionFacade.swarmState,
    swarmCursorState: deps.interactionFacade.swarmCursorState,
    playerState: deps.interactionFacade.playerState,
    getCurrentPathMetrics: deps.interactionFacade.getCurrentPathMetrics,
    getMovementSnapshot: deps.interactionFacade.getMovementSnapshot,
    playerInfoEl: deps.interactionFacade.playerInfoEl,
    pathInfoEl: deps.interactionFacade.pathInfoEl,
  });

  const interactionModeRuntime = {
    setInteractionMode: (mode) =>
      applyInteractionMode(
        {
          canUseInteractionInCurrentMode: deps.interactionFacade.canUseInteractionInCurrentMode,
          dockLightingModeToggle: deps.interactionFacade.dockLightingModeToggle,
          dockPathfindingModeToggle: deps.interactionFacade.dockPathfindingModeToggle,
          movePreviewState: deps.interactionFacade.movePreviewState,
          store: deps.interactionFacade.store,
          requestOverlayDraw: deps.interactionFacade.requestOverlayDraw,
        },
        mode,
      ),
  };

  const mainFacadeRuntime = {
    getBaseViewHalfExtents: () => deps.interactionFacade.getCameraRuntimeBinding().getBaseViewHalfExtents(),
    getActiveCameraState: () => deps.interactionFacade.getCameraRuntimeBinding().getActiveCameraState(),
    getViewHalfExtents: (zoomValue = null) => deps.interactionFacade.getCameraRuntimeBinding().getViewHalfExtents(zoomValue),
    clientToNdc: (clientX, clientY) => deps.interactionFacade.getCameraRuntimeBinding().clientToNdc(clientX, clientY),
    worldFromNdc: (ndc, zoomValue = null, pan = null) =>
      deps.interactionFacade.getCameraRuntimeBinding().worldFromNdc(ndc, zoomValue, pan),
    worldToUv: (world) => deps.interactionFacade.getCameraRuntimeBinding().worldToUv(world),
    uvToMapPixelIndex: (uv) => deps.interactionFacade.getCameraRuntimeBinding().uvToMapPixelIndex(uv),
    mapPixelIndexToUv: (pixelX, pixelY) => deps.interactionFacade.getCameraRuntimeBinding().mapPixelIndexToUv(pixelX, pixelY),
    mapPixelToWorld: (pixelX, pixelY) => deps.interactionFacade.getCameraRuntimeBinding().mapPixelToWorld(pixelX, pixelY),
    mapCoordToWorld: (mapX, mapY) => deps.interactionFacade.getCameraRuntimeBinding().mapCoordToWorld(mapX, mapY),
    worldToScreen: (world) => deps.interactionFacade.getCameraRuntimeBinding().worldToScreen(world),
    setInteractionMode: (mode) => interactionModeRuntime.setInteractionMode(mode),
    setPlayerPosition: (pixelX, pixelY) => deps.interactionFacade.playerRuntimeBinding.setPlayerPosition(pixelX, pixelY),
    parseNpcPlayer: (rawData) => deps.interactionFacade.parseNpcPlayerImpl(rawData),
    applyLoadedNpc: (rawData) => deps.interactionFacade.applyLoadedNpcImpl(rawData),
    updateInfoPanel: () => updateInfoPanelImpl(),
  };

  return {
    swarmGameplayRuntime,
    terrainFloorAtSwarmCoord: swarmGameplayRuntime.terrainFloorAtSwarmCoord,
    isWaterAtSwarmCoord: swarmGameplayRuntime.isWaterAtSwarmCoord,
    isSwarmCoordFlyable: swarmGameplayRuntime.isSwarmCoordFlyable,
    chooseRandomSwarmTargetIndexNear: swarmGameplayRuntime.chooseRandomSwarmTargetIndexNear,
    chooseRandomFollowAgentIndex: swarmGameplayRuntime.chooseRandomFollowAgentIndex,
    chooseRandomFollowHawkIndex: swarmGameplayRuntime.chooseRandomFollowHawkIndex,
    ensureSwarmBuffers: swarmGameplayRuntime.ensureSwarmBuffers,
    reseedSwarmAgents: swarmGameplayRuntime.reseedSwarmAgents,
    settingsLegacyBindings,
    settingsRuntimeBinding,
    swarmRenderSetupRuntime,
    swarmOverlayBindingRuntime: swarmRenderSetupRuntime.swarmOverlayBindingRuntime,
    renderSwarmLit: swarmRenderSetupRuntime.renderSwarmLit,
    updateInfoPanelImpl,
    interactionModeRuntime,
    mainFacadeRuntime,
  };
}
