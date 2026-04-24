import { createPlayerStateRuntime } from "./playerStateRuntime.js";

export function createPlayerStateRuntimeBinding(deps) {
  const playerStateRuntime = createPlayerStateRuntime({
    playerState: deps.playerState,
    clamp: deps.clamp,
    splatSize: deps.splatSize,
    setPlayerSnapshot: deps.setPlayerSnapshot,
  });
  return {
    setPlayerPosition: (pixelX, pixelY) => playerStateRuntime.setPlayerPosition(pixelX, pixelY),
  };
}
