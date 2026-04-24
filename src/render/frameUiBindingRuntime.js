import { createFrameUiRuntime } from "./frameUiRuntime.js";

export function createFrameUiBindingRuntime(deps) {
  return createFrameUiRuntime({
    fogColorInput: deps.fogColorInput,
    cycleInfoEl: deps.cycleInfoEl,
    normalizeSimTickHours: deps.normalizeSimTickHours,
    getConfiguredSimTickHours: deps.getConfiguredSimTickHours,
    formatHour: deps.formatHour,
    cycleState: deps.cycleState,
  });
}
