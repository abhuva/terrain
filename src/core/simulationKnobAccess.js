export function createSimulationKnobAccess(deps) {
  function getSimulationKnobSectionFromStore(key) {
    const knobs = deps.getCoreState().simulation.knobs || {};
    return knobs && key in knobs ? knobs[key] : null;
  }

  return {
    getSimulationKnobSectionFromStore,
  };
}
