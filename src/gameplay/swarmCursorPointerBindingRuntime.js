import { createSwarmCursorPointerRuntime } from "./swarmCursorPointerRuntime.js";

export function createSwarmCursorPointerBindingRuntime(deps) {
  const swarmCursorPointerRuntime = createSwarmCursorPointerRuntime({
    isSwarmEnabled: deps.isSwarmEnabled,
    swarmCursorState: deps.swarmCursorState,
    clientToNdc: deps.clientToNdc,
    worldFromNdc: deps.worldFromNdc,
    worldToUv: deps.worldToUv,
    clamp: deps.clamp,
    splatSize: deps.splatSize,
  });
  return {
    updateSwarmCursorFromPointer: (clientX, clientY) =>
      swarmCursorPointerRuntime.updateSwarmCursorFromPointer(clientX, clientY),
  };
}
