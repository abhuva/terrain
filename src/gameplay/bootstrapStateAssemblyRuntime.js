import { createGameplayBootstrapState } from "./gameplayBootstrapState.js";
import { createRenderBootstrapState } from "../render/renderBootstrapState.js";

export function createBootstrapStateAssemblyRuntime(deps) {
  return {
    ...createRenderBootstrapState({
      gl: deps.gl,
      document: deps.document,
      createTexture: deps.createTexture,
      createLinearTexture: deps.createLinearTexture,
    }),
    ...createGameplayBootstrapState(),
  };
}
