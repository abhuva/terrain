import { createSwarmCursorPointerBindingRuntime } from "./swarmCursorPointerBindingRuntime.js";

export function createSwarmCursorPointerSetupRuntime(deps) {
  return createSwarmCursorPointerBindingRuntime({
    isSwarmEnabled: deps.isSwarmEnabled,
    swarmCursorState: deps.swarmCursorState,
    clientToNdc: deps.clientToNdc,
    worldFromNdc: deps.worldFromNdc,
    worldToUv: deps.worldToUv,
    clamp: deps.clamp,
    splatSize: deps.splatSize,
  });
}
