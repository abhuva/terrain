import { createTimeUiRuntime } from "./timeUiRuntime.js";

export function createTimeUiBindingRuntime(deps) {
  const timeUiRuntime = createTimeUiRuntime({
    cycleHourInput: deps.cycleHourInput,
    cycleHourValue: deps.cycleHourValue,
    cycleState: deps.cycleState,
    clamp: deps.clamp,
    formatHour: deps.formatHour,
  });
  return {
    setCycleHourSliderFromState: () => timeUiRuntime.setCycleHourSliderFromState(),
    updateCycleHourLabel: () => timeUiRuntime.updateCycleHourLabel(),
  };
}
