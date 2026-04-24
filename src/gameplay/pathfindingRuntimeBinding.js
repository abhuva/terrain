import { createPathfindingCostModelBindingRuntime } from "./pathfindingCostModelBindingRuntime.js";
import { createPathfindingPreviewRuntime } from "./pathfindingPreviewRuntime.js";

export function createPathfindingRuntimeBinding(deps) {
  let movementField = null;

  const pathfindingCostModelBindingRuntime = createPathfindingCostModelBindingRuntime({
    clamp: deps.clamp,
    playerState: deps.playerState,
    getMapSize: deps.getMapSize,
    getPathfindingStateSnapshot: deps.getPathfindingStateSnapshot,
    getSlopeImageData: deps.getSlopeImageData,
    getHeightImageData: deps.getHeightImageData,
    getWaterImageData: deps.getWaterImageData,
  });

  const pathfindingPreviewRuntime = createPathfindingPreviewRuntime({
    movementWindowBounds: () => pathfindingCostModelBindingRuntime.movementWindowBounds(),
    computeMoveStepCost: (fromX, fromY, toX, toY) =>
      pathfindingCostModelBindingRuntime.computeMoveStepCost(fromX, fromY, toX, toY),
    playerState: deps.playerState,
    getMovementField: () => movementField,
    setMovementField: (value) => {
      movementField = value;
    },
    movePreviewState: deps.movePreviewState,
    getInteractionModeSnapshot: deps.getInteractionModeSnapshot,
    requestOverlayDraw: deps.requestOverlayDraw,
    clientToNdc: deps.clientToNdc,
    worldFromNdc: deps.worldFromNdc,
    worldToUv: deps.worldToUv,
    uvToMapPixelIndex: deps.uvToMapPixelIndex,
  });

  return {
    getGrayAt: (imageData, x, y, sourceWidth, sourceHeight) =>
      pathfindingCostModelBindingRuntime.getGrayAt(imageData, x, y, sourceWidth, sourceHeight),
    movementWindowBounds: () => pathfindingCostModelBindingRuntime.movementWindowBounds(),
    computeMoveStepCost: (fromX, fromY, toX, toY) =>
      pathfindingCostModelBindingRuntime.computeMoveStepCost(fromX, fromY, toX, toY),
    rebuildMovementField: () => pathfindingPreviewRuntime.rebuildMovementField(),
    extractPathTo: (pixelX, pixelY) => pathfindingPreviewRuntime.extractPathTo(pixelX, pixelY),
    refreshPathPreview: () => pathfindingPreviewRuntime.refreshPathPreview(),
    updatePathPreviewFromPointer: (clientX, clientY) =>
      pathfindingPreviewRuntime.updatePathPreviewFromPointer(clientX, clientY),
    getCurrentPathMetrics: () => pathfindingPreviewRuntime.getCurrentPathMetrics(),
  };
}
