import {
  updatePathfindingRangeLabel,
  updatePathWeightLabels,
  updatePathSlopeCutoffLabel,
  updatePathBaseCostLabel,
} from "./pathfindingLabelUi.js";

export function createPathfindingLabelBindingRuntime(deps) {
  return {
    updatePathfindingRangeLabel: () => updatePathfindingRangeLabel({
      getPathfindingStateSnapshot: deps.getPathfindingStateSnapshot,
      pathfindingRangeValue: deps.pathfindingRangeValue,
    }),
    updatePathWeightLabels: () => updatePathWeightLabels({
      getPathfindingStateSnapshot: deps.getPathfindingStateSnapshot,
      pathWeightSlopeValue: deps.pathWeightSlopeValue,
      pathWeightHeightValue: deps.pathWeightHeightValue,
      pathWeightWaterValue: deps.pathWeightWaterValue,
    }),
    updatePathSlopeCutoffLabel: () => updatePathSlopeCutoffLabel({
      getPathfindingStateSnapshot: deps.getPathfindingStateSnapshot,
      pathSlopeCutoffValue: deps.pathSlopeCutoffValue,
    }),
    updatePathBaseCostLabel: () => updatePathBaseCostLabel({
      getPathfindingStateSnapshot: deps.getPathfindingStateSnapshot,
      pathBaseCostValue: deps.pathBaseCostValue,
    }),
  };
}
