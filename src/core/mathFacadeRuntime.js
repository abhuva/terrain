export function createMathFacadeRuntime(deps) {
  return {
    clamp: (v, min, max) => deps.clamp(v, min, max),
    clampRound: (v, min, max, decimals = deps.defaultClampRoundDecimals) =>
      deps.clampRound(v, min, max, decimals),
    lerp: (a, b, t) => deps.lerp(a, b, t),
    lerpVec3: (a, b, t) => deps.lerpVec3(a, b, t),
    lerpAngleDeg: (a, b, t) => deps.lerpAngleDeg(a, b, t),
    smoothstep: (edge0, edge1, x) => deps.smoothstep(edge0, edge1, x),
    wrapHour: (hour) => deps.wrapHour(hour),
    formatHour: (hour) => deps.formatHour(hour),
  };
}
