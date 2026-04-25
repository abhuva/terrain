export function updateWeatherFieldMeta(deps) {
  deps.renderResources.setWeatherFieldMeta({
    width: Math.max(1, Math.floor(deps.splatSize.width * 0.25)),
    height: Math.max(1, Math.floor(deps.splatSize.height * 0.25)),
    updatedAtSec:
      deps.simulationWeather != null && deps.simulationWeather.timeSec != null
        ? Number(deps.simulationWeather.timeSec)
        : deps.nowMs * 0.001,
  });
}
