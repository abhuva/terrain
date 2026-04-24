export function createPlayerStateRuntime(deps) {
  function setPlayerPosition(pixelX, pixelY) {
    deps.playerState.pixelX = deps.clamp(Math.round(Number(pixelX)), 0, Math.max(0, deps.splatSize.width - 1));
    deps.playerState.pixelY = deps.clamp(Math.round(Number(pixelY)), 0, Math.max(0, deps.splatSize.height - 1));
    if (typeof deps.setPlayerSnapshot === "function") {
      deps.setPlayerSnapshot({
        pixelX: deps.playerState.pixelX,
        pixelY: deps.playerState.pixelY,
      });
    }
  }

  return {
    setPlayerPosition,
  };
}
