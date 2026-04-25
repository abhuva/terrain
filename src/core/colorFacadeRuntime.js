export function createColorFacadeRuntime(deps) {
  return {
    rgbToHex: (rgb) => deps.rgbToHex(rgb, deps.clamp),
    hexToRgb01: (hex) => deps.hexToRgb01(hex),
  };
}
