import { createRenderPipelineRuntime } from "./renderPipelineRuntime.js";

export function createRenderPipelineSetupRuntime(deps) {
  return createRenderPipelineRuntime({
    gl: deps.gl,
    canvas: deps.canvas,
    program: deps.program,
    uniforms: deps.uniforms,
    splatTex: deps.splatTex,
    normalsTex: deps.normalsTex,
    heightTex: deps.heightTex,
    pointLightTex: deps.pointLightTex,
    cloudNoiseTex: deps.cloudNoiseTex,
    shadowBlurTex: deps.shadowBlurTex,
    shadowRawTex: deps.shadowRawTex,
    waterTex: deps.waterTex,
    flowMapTex: deps.flowMapTex,
    heightSize: deps.heightSize,
    splatSize: deps.splatSize,
    getViewHalfExtents: deps.getViewHalfExtents,
    cursorLightState: deps.cursorLightState,
    applyPointLightUsagePass: deps.applyPointLightUsagePass,
    renderShadowPipeline: deps.renderShadowPipeline,
    shadowSize: deps.shadowSize,
    shadowBlurFbo: deps.shadowBlurFbo,
    shadowBlurProgram: deps.shadowBlurProgram,
    shadowBlurUniforms: deps.shadowBlurUniforms,
    getBlurRadiusPx: deps.getBlurRadiusPx,
  });
}
