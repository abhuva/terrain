export function buildFrameRenderState(input) {
  const coreState = input.coreState || {};
  const coreCamera = coreState.camera || {};
  const coreMap = coreState.map || {};
  const coreSimulation = coreState.simulation || {};
  const coreSystems = coreState.systems || {};
  const coreTime = coreSystems.time || {};
  const weather = coreSimulation.weather || {};
  const nowSec = Math.max(0, Number(input.nowMs) * 0.001);

  return {
    time: {
      nowMs: Number(input.nowMs) || 0,
      nowSec,
      dtSec: Number(input.dtSec) || 0,
      cycleHour: Number(input.cycleHour) || 0,
      cycleSpeedHoursPerSec: Number(input.cycleSpeedHoursPerSec) || 0,
      cloudTimeSec: Number.isFinite(Number(input.cloudTimeSec))
        ? Number(input.cloudTimeSec)
        : (Number.isFinite(Number(coreTime.cloudTimeSec)) ? Number(coreTime.cloudTimeSec) : nowSec),
      waterTimeSec: Number.isFinite(Number(coreTime.waterTimeSec)) ? Number(coreTime.waterTimeSec) : nowSec,
      detachedTimeSec: Number.isFinite(Number(coreTime.detachedTimeSec)) ? Number(coreTime.detachedTimeSec) : nowSec,
      globalTimeHours: Number.isFinite(Number(coreTime.globalTimeHours)) ? Number(coreTime.globalTimeHours) : 0,
    },
    camera: {
      panX: Number.isFinite(coreCamera.panX) ? coreCamera.panX : 0,
      panY: Number.isFinite(coreCamera.panY) ? coreCamera.panY : 0,
      zoom: Number.isFinite(coreCamera.zoom) ? coreCamera.zoom : 1,
    },
    map: {
      folderPath: coreMap.folderPath || input?.currentMapFolderPath || "",
      width: Number(coreMap.width) || input?.splatSize?.width || 0,
      height: Number(coreMap.height) || input?.splatSize?.height || 0,
      loaded: Boolean(coreMap.loaded),
    },
    weather: {
      type: typeof weather.type === "string" ? weather.type : "clear",
      intensity: Number.isFinite(Number(weather.intensity)) ? Number(weather.intensity) : 0,
      windDirDeg: Number.isFinite(Number(weather.windDirDeg)) ? Number(weather.windDirDeg) : 0,
      windSpeed: Number.isFinite(Number(weather.windSpeed)) ? Number(weather.windSpeed) : 0,
      localModulation: Number.isFinite(Number(weather.localModulation)) ? Number(weather.localModulation) : 0,
      windDirX: Number.isFinite(Number(weather.windDirX)) ? Number(weather.windDirX) : 1,
      windDirY: Number.isFinite(Number(weather.windDirY)) ? Number(weather.windDirY) : 0,
    },
    lightingParams: input.lightingParams,
    uniformInput: input.uniformInput || {},
    showTerrain: Boolean(input.showTerrain),
    backgroundColorRgb: input.backgroundColorRgb || [0, 0, 0],
    swarm: {
      enabled: Boolean(input.swarmEnabled),
      litEnabled: Boolean(input.swarmLitEnabled),
    },
  };
}
