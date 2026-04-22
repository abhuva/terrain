export function applyRuntimeParityFromCoreState(coreState, deps) {
  const clamp = typeof deps.clamp === "function"
    ? deps.clamp
    : (value, min, max) => Math.max(min, Math.min(max, value));
  const camera = coreState && coreState.camera ? coreState.camera : null;
  const clock = coreState && coreState.clock ? coreState.clock : null;
  const gameplay = coreState && coreState.gameplay ? coreState.gameplay : null;

  if (camera) {
    if (Number.isFinite(camera.zoom) && typeof deps.setZoom === "function") {
      deps.setZoom(camera.zoom);
    }
    if (Number.isFinite(camera.panX) && deps.panWorld) {
      deps.panWorld.x = camera.panX;
    }
    if (Number.isFinite(camera.panY) && deps.panWorld) {
      deps.panWorld.y = camera.panY;
    }
  }

  if (clock && Number.isFinite(clock.timeScale) && deps.cycleSpeedInput) {
    deps.cycleSpeedInput.value = String(clamp(clock.timeScale, 0, 1));
  }

  if (!gameplay) return;

  if (typeof gameplay.interactionMode === "string" && typeof deps.setInteractionMode === "function") {
    deps.setInteractionMode(gameplay.interactionMode);
  }

  const pathfinding = gameplay.pathfinding || null;
  if (pathfinding) {
    if (Number.isFinite(pathfinding.range) && deps.pathfindingRangeInput) {
      deps.pathfindingRangeInput.value = String(Math.round(clamp(pathfinding.range, 30, 300)));
    }
    if (Number.isFinite(pathfinding.weightSlope) && deps.pathWeightSlopeInput) {
      deps.pathWeightSlopeInput.value = String(clamp(pathfinding.weightSlope, 0, 10));
    }
    if (Number.isFinite(pathfinding.weightHeight) && deps.pathWeightHeightInput) {
      deps.pathWeightHeightInput.value = String(clamp(pathfinding.weightHeight, 0, 10));
    }
    if (Number.isFinite(pathfinding.weightWater) && deps.pathWeightWaterInput) {
      deps.pathWeightWaterInput.value = String(clamp(pathfinding.weightWater, 0, 100));
    }
    if (Number.isFinite(pathfinding.slopeCutoff) && deps.pathSlopeCutoffInput) {
      deps.pathSlopeCutoffInput.value = String(Math.round(clamp(pathfinding.slopeCutoff, 0, 90)));
    }
    if (Number.isFinite(pathfinding.baseCost) && deps.pathBaseCostInput) {
      deps.pathBaseCostInput.value = String(clamp(pathfinding.baseCost, 0, 2));
    }
  }
}
