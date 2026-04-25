export function registerInteractionCommands(commandBus, deps) {
  function isMovementActive() {
    if (typeof deps.getMovementStateSnapshot !== "function") return false;
    const snapshot = deps.getMovementStateSnapshot();
    return Boolean(snapshot && snapshot.active);
  }

  function syncPlayerToStore() {
    deps.syncPlayerStateToStore();
  }

  commandBus.register("core/interaction/setMode", (command) => {
    deps.setInteractionMode(command.mode);
  });

  commandBus.register("core/interaction/clickMapPixel", (command) => {
    const pixel = {
      x: Number(command.x),
      y: Number(command.y),
    };

    if (deps.getInteractionMode() === "lighting") {
      const existing = deps.findPointLightAtPixel(pixel.x, pixel.y);
      if (existing) {
        deps.beginLightEdit(existing);
        deps.setStatus(`Selected point light at (${existing.pixelX}, ${existing.pixelY})`);
      } else {
        deps.createPointLight(pixel.x, pixel.y);
      }
      deps.requestOverlayDraw();
      return;
    }

    if (deps.getInteractionMode() === "pathfinding") {
      deps.movePreviewState.hoverPixel = { x: pixel.x, y: pixel.y };
      deps.movePreviewState.pathPixels = deps.extractPathTo(pixel.x, pixel.y);
      if (!deps.movePreviewState.pathPixels.length) {
        deps.setStatus("No reachable preview path at clicked cell.");
        deps.requestOverlayDraw();
        return;
      }
      if (typeof deps.replaceMovementQueue === "function") {
        const replaced = deps.replaceMovementQueue(deps.movePreviewState.pathPixels);
        if (!replaced) {
          deps.setStatus("Unable to queue movement for selected path.");
          deps.requestOverlayDraw();
          return;
        }
      }
      deps.setInteractionMode("none");
      deps.movePreviewState.hoverPixel = null;
      deps.movePreviewState.pathPixels = [];
      syncPlayerToStore();
      deps.requestOverlayDraw();
      return;
    }

    if (isMovementActive() && typeof deps.cancelMovementQueue === "function") {
      deps.cancelMovementQueue();
      deps.movePreviewState.hoverPixel = null;
      deps.movePreviewState.pathPixels = [];
      deps.setStatus(`Movement canceled at (${deps.playerState.pixelX}, ${deps.playerState.pixelY}).`);
      syncPlayerToStore();
      deps.requestOverlayDraw();
      return;
    }

    deps.setPlayerPosition(pixel.x, pixel.y);
    if (typeof deps.cancelMovementQueue === "function") {
      deps.cancelMovementQueue();
    }
    deps.rebuildMovementField();
    deps.movePreviewState.hoverPixel = null;
    deps.movePreviewState.pathPixels = [];
    deps.setStatus(`Player moved to (${deps.playerState.pixelX}, ${deps.playerState.pixelY})`);
    deps.requestOverlayDraw();
  });

  function syncPathfindingStateToStore() {
    deps.syncPathfindingStateToStore(
      typeof deps.getPathfindingStateSnapshot === "function" ? deps.getPathfindingStateSnapshot() : {},
    );
  }

  function updatePathfindingStoreField(patch) {
    deps.patchPathfindingStateToStore(patch);
  }

  commandBus.register("core/pathfinding/setRange", (command) => {
    updatePathfindingStoreField({
      range: Math.round(deps.clamp(Number(command.value), 30, 300)),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });

  commandBus.register("core/pathfinding/setWeightSlope", (command) => {
    updatePathfindingStoreField({
      weightSlope: deps.clamp(Number(command.value), 0, 10),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });

  commandBus.register("core/pathfinding/setWeightHeight", (command) => {
    updatePathfindingStoreField({
      weightHeight: deps.clamp(Number(command.value), 0, 10),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });

  commandBus.register("core/pathfinding/setWeightWater", (command) => {
    updatePathfindingStoreField({
      weightWater: deps.clamp(Number(command.value), 0, 100),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });

  commandBus.register("core/pathfinding/setSlopeCutoff", (command) => {
    updatePathfindingStoreField({
      slopeCutoff: Math.round(deps.clamp(Number(command.value), 0, 90)),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });

  commandBus.register("core/pathfinding/setBaseCost", (command) => {
    updatePathfindingStoreField({
      baseCost: deps.clamp(Number(command.value), 0, 2),
    });
    deps.syncPathfindingSettingsUi();
    if (deps.getInteractionMode() === "pathfinding") {
      deps.rebuildMovementField();
    }
    syncPathfindingStateToStore();
  });
}
