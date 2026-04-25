import { createMovementSystem } from "./movementSystem.js";

export function createMovementSetupRuntime(deps) {
  return createMovementSystem({
    entityStore: deps.entityStore,
    playerState: deps.playerState,
    getMapWidth: deps.getMapWidth,
    getMapHeight: deps.getMapHeight,
    computeMoveStepCost: deps.computeMoveStepCost,
    rebuildMovementField: deps.rebuildMovementField,
    requestOverlayDraw: deps.requestOverlayDraw,
    setStatus: deps.setStatus,
    setPlayerSnapshot: deps.setPlayerSnapshot,
    setMovementSnapshot: deps.setMovementSnapshot,
  });
}
