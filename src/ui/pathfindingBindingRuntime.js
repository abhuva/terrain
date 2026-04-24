import { bindPathfindingControls } from "./bindings/pathfindingBinding.js";

export function bindPathfindingRuntime(deps) {
  bindPathfindingControls({
    pathfindingRangeInput: deps.pathfindingRangeInput,
    pathWeightSlopeInput: deps.pathWeightSlopeInput,
    pathWeightHeightInput: deps.pathWeightHeightInput,
    pathWeightWaterInput: deps.pathWeightWaterInput,
    pathSlopeCutoffInput: deps.pathSlopeCutoffInput,
    pathBaseCostInput: deps.pathBaseCostInput,
    dispatchCoreCommand: deps.dispatchCoreCommand,
  });
}
