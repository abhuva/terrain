import { createSwarmUiSetupRuntime } from "./swarmUiSetupRuntime.js";
import { createSwarmStateUiFacadeRuntime } from "./swarmStateUiFacadeRuntime.js";

export function createSwarmUiAssemblyRuntime(deps) {
  const { getMainRuntimeStateBinding, ...swarmUiSetupDeps } = deps;
  const swarmUiRuntimeBinding = createSwarmUiSetupRuntime(swarmUiSetupDeps);
  return {
    swarmUiRuntimeBinding,
    ...createSwarmStateUiFacadeRuntime({
      getMainRuntimeStateBinding,
      swarmUiRuntimeBinding,
    }),
  };
}
