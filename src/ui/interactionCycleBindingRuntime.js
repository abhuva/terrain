import { bindInteractionAndCycleControls } from "./bindings/interactionBinding.js";

export function bindInteractionCycleRuntime(deps) {
  bindInteractionAndCycleControls({
    windowEl: deps.windowEl,
    dockLightingModeToggle: deps.dockLightingModeToggle,
    dockPathfindingModeToggle: deps.dockPathfindingModeToggle,
    cycleSpeedInput: deps.cycleSpeedInput,
    cycleHourInput: deps.cycleHourInput,
    simTickHoursInput: deps.simTickHoursInput,
    dispatchCoreCommand: deps.dispatchCoreCommand,
    getInteractionMode: deps.getInteractionMode,
    canUseInteractionMode: deps.canUseInteractionMode,
    movePreviewState: deps.movePreviewState,
    rebuildMovementField: deps.rebuildMovementField,
    requestOverlayDraw: deps.requestOverlayDraw,
    setStatus: deps.setStatus,
  });
}
