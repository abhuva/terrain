export function createInteractionModeUiRuntime(deps) {
  function syncInteractionModeUi(mode) {
    const isLighting = mode === "lighting";
    const isPathfinding = mode === "pathfinding";
    deps.dockLightingModeToggle.classList.toggle("active", isLighting);
    deps.dockPathfindingModeToggle.classList.toggle("active", isPathfinding);
    deps.dockLightingModeToggle.setAttribute("aria-pressed", isLighting ? "true" : "false");
    deps.dockPathfindingModeToggle.setAttribute("aria-pressed", isPathfinding ? "true" : "false");
  }

  return {
    syncInteractionModeUi,
  };
}
