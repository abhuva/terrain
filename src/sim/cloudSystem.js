export function createCloudSystem(deps) {
  let lastSentClouds = null;

  function finite(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function areCloudValuesEqual(a, b) {
    if (!a || !b) return false;
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    for (const key of keys) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }

  return {
    update() {
      const value = {
        useClouds: deps.cloudToggle.checked,
        cloudCoverage: deps.clamp(finite(deps.cloudCoverageInput.value, 0.58), 0, 1),
        cloudSoftness: deps.clamp(finite(deps.cloudSoftnessInput.value, 0.12), 0.01, 0.35),
        cloudOpacity: deps.clamp(finite(deps.cloudOpacityInput.value, 0.35), 0, 1),
        cloudScale: deps.clamp(finite(deps.cloudScaleInput.value, 2.2), 0.5, 8),
        cloudSpeed1: deps.clamp(finite(deps.cloudSpeed1Input.value, 0.045), -0.3, 0.3),
        cloudSpeed2: deps.clamp(finite(deps.cloudSpeed2Input.value, -0.028), -0.3, 0.3),
        cloudSunParallax: deps.clamp(finite(deps.cloudSunParallaxInput.value, 0.45), 0, 2),
        cloudUseSunProjection: deps.cloudSunProjectToggle.checked,
      };
      deps.setCloudState(value);
      if (typeof deps.updateStoreClouds === "function") {
        if (areCloudValuesEqual(value, lastSentClouds)) {
          return;
        }
        deps.updateStoreClouds(value);
        lastSentClouds = { ...value };
      }
    },
  };
}
