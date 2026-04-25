import { createPointLightSetupRuntime } from "./pointLightSetupRuntime.js";
import { createPointLightFacadeRuntime } from "./pointLightFacadeRuntime.js";
import { createMapLifecycleSetupRuntime } from "./mapLifecycleSetupRuntime.js";

export function createMapLightingAssemblyRuntime(deps) {
  const pointLightRuntime = createPointLightSetupRuntime(deps.pointLightSetup);
  const pointLightFacade = createPointLightFacadeRuntime(() => pointLightRuntime);
  const mapLifecycleRuntime = createMapLifecycleSetupRuntime({
    ...deps.mapLifecycleSetup,
    clearPointLights: () => pointLightFacade.clearPointLights(),
    applyLoadedPointLights: (...args) => pointLightFacade.applyLoadedPointLights(...args),
    serializePointLights: () => pointLightFacade.serializePointLights(),
  });

  return {
    pointLightRuntime,
    pointLightFacade,
    mapLifecycleRuntime,
  };
}
