export function createMovementStoreSyncRuntime(deps) {
  return {
    setPlayerSnapshot: ({ pixelX, pixelY }) => {
      deps.store.update((prev) => ({
        ...prev,
        gameplay: {
          ...prev.gameplay,
          player: {
            ...prev.gameplay.player,
            pixelX,
            pixelY,
          },
        },
      }));
    },
    setMovementSnapshot: (value) => {
      deps.store.update((prev) => ({
        ...prev,
        gameplay: {
          ...prev.gameplay,
          movement: {
            ...(prev.gameplay && prev.gameplay.movement ? prev.gameplay.movement : {}),
            ...value,
          },
        },
      }));
    },
  };
}
