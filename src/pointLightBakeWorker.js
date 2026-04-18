function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function normalize3(x, y, z) {
  const len = Math.hypot(x, y, z);
  if (len < 0.000001) return [0, 0, 1];
  return [x / len, y / len, z / len];
}

function mapPixelToTexIndex(pixel, mapSize, texSize) {
  return clamp(Math.round(((pixel + 0.5) / mapSize) * texSize - 0.5), 0, texSize - 1);
}

self.addEventListener("message", (event) => {
  const data = event.data || {};
  const {
    requestId,
    bakeWidth,
    bakeHeight,
    splatWidth,
    splatHeight,
    normalsWidth,
    normalsHeight,
    heightWidth,
    heightHeight,
    normalsData,
    heightData,
    lights,
    heightScaleValue,
    blendExposure,
  } = data;

  try {
    const w = Math.max(1, Math.floor(Number(bakeWidth) || 1));
    const h = Math.max(1, Math.floor(Number(bakeHeight) || 1));
    const mapW = Math.max(1, Math.floor(Number(splatWidth) || 1));
    const mapH = Math.max(1, Math.floor(Number(splatHeight) || 1));
    const nW = Math.max(1, Math.floor(Number(normalsWidth) || 1));
    const nH = Math.max(1, Math.floor(Number(normalsHeight) || 1));
    const hW = Math.max(1, Math.floor(Number(heightWidth) || 1));
    const hH = Math.max(1, Math.floor(Number(heightHeight) || 1));
    const mapScaleX = mapW / w;
    const mapScaleY = mapH / h;
    const heightScale = Math.max(1, Number(heightScaleValue) || 1);
    const exposure = Number.isFinite(Number(blendExposure)) ? Number(blendExposure) : 0.65;

    const rgba = new Uint8ClampedArray(w * h * 4);
    const accumColor = new Float32Array(w * h * 3);
    const accumWeight = new Float32Array(w * h);
    for (let i = 3; i < rgba.length; i += 4) {
      rgba[i] = 255;
    }

    const safeLights = Array.isArray(lights) ? lights : [];
    const normals = normalsData instanceof Uint8ClampedArray ? normalsData : new Uint8ClampedArray(normalsData || 0);
    const heights = heightData instanceof Uint8ClampedArray ? heightData : new Uint8ClampedArray(heightData || 0);

    function sampleHeightAtMapPixel(pixelX, pixelY) {
      if (!heights.length) return 0;
      const hx = mapPixelToTexIndex(pixelX, mapW, hW);
      const hy = mapPixelToTexIndex(pixelY, mapH, hH);
      const idx = (hy * hW + hx) * 4;
      return heights[idx] / 255;
    }

    function sampleNormalAtMapPixel(pixelX, pixelY) {
      if (!normals.length) return [0, 0, 1];
      const nx = mapPixelToTexIndex(pixelX, mapW, nW);
      const ny = mapPixelToTexIndex(pixelY, mapH, nH);
      const idx = (ny * nW + nx) * 4;
      const vx = (normals[idx] / 255) * 2 - 1;
      const vy = (normals[idx + 1] / 255) * 2 - 1;
      const vz = (normals[idx + 2] / 255) * 2 - 1;
      return normalize3(vx, vy, vz);
    }

    function hasLineOfSightToLight(surfaceX, surfaceY, surfaceH, lightX, lightY, lightH) {
      const dx = lightX - surfaceX;
      const dy = lightY - surfaceY;
      const dist = Math.hypot(dx, dy);
      if (dist <= 1.0) return true;
      const stepCount = Math.max(1, Math.floor(dist));
      const invSteps = 1 / stepCount;
      const heightBias = 0.7;
      for (let i = 1; i < stepCount; i++) {
        const t = i * invSteps;
        const sx = surfaceX + dx * t;
        const sy = surfaceY + dy * t;
        const rayH = surfaceH + (lightH - surfaceH) * t;
        const terrainH = sampleHeightAtMapPixel(sx, sy) * heightScale;
        if (terrainH > rayH + heightBias) {
          return false;
        }
      }
      return true;
    }

    for (const light of safeLights) {
      const lightX = Number(light.pixelX);
      const lightY = Number(light.pixelY);
      const radiusMapPx = Math.max(1, Number(light.strength) || 1);
      const intensityMul = clamp(Number(light.intensity), 0, 4);
      if (!Number.isFinite(lightX) || !Number.isFinite(lightY) || intensityMul <= 0.0001) continue;

      const lightTerrainHeight = sampleHeightAtMapPixel(lightX, lightY) * heightScale;
      const lightHeight = lightTerrainHeight + (Number(light.heightOffset) || 0);
      const minX = clamp(Math.floor((lightX - radiusMapPx) / mapScaleX), 0, w - 1);
      const maxX = clamp(Math.ceil((lightX + radiusMapPx) / mapScaleX), 0, w - 1);
      const minY = clamp(Math.floor((lightY - radiusMapPx) / mapScaleY), 0, h - 1);
      const maxY = clamp(Math.ceil((lightY + radiusMapPx) / mapScaleY), 0, h - 1);
      const radiusSq = radiusMapPx * radiusMapPx;

      const color = Array.isArray(light.color) ? light.color : [1, 1, 1];
      const colorR = clamp(Number(color[0]) || 0, 0, 1);
      const colorG = clamp(Number(color[1]) || 0, 0, 1);
      const colorB = clamp(Number(color[2]) || 0, 0, 1);
      for (let y = minY; y <= maxY; y++) {
        const mapY = (y + 0.5) * mapScaleY - 0.5;
        const dy = lightY - mapY;
        for (let x = minX; x <= maxX; x++) {
          const mapX = (x + 0.5) * mapScaleX - 0.5;
          const dx = lightX - mapX;
          const distSq = dx * dx + dy * dy;
          if (distSq > radiusSq) continue;

          const falloff = Math.max(0, 1 - Math.sqrt(distSq) / radiusMapPx);
          if (falloff <= 0) continue;
          const surfaceHeight = sampleHeightAtMapPixel(mapX, mapY) * heightScale;
          if (!hasLineOfSightToLight(mapX, mapY, surfaceHeight, lightX, lightY, lightHeight)) continue;
          const normal = sampleNormalAtMapPixel(mapX, mapY);
          const toLight = normalize3(dx, dy, lightHeight - surfaceHeight);
          const ndotl = Math.max(0, normal[0] * toLight[0] + normal[1] * toLight[1] + normal[2] * toLight[2]);
          const contribution = falloff * ndotl * intensityMul;
          if (contribution <= 0) continue;

          const pixelIdx = y * w + x;
          const baseIdx = pixelIdx * 3;
          accumWeight[pixelIdx] += contribution;
          accumColor[baseIdx] += colorR * contribution;
          accumColor[baseIdx + 1] += colorG * contribution;
          accumColor[baseIdx + 2] += colorB * contribution;
        }
      }
    }

    for (let pixelIdx = 0, j = 0; pixelIdx < accumWeight.length; pixelIdx++, j += 4) {
      const weight = accumWeight[pixelIdx];
      if (weight <= 0.000001) continue;
      const baseIdx = pixelIdx * 3;
      const intensity = 1 - Math.exp(-weight * exposure);
      rgba[j] = Math.round(clamp(accumColor[baseIdx] * intensity, 0, 1) * 255);
      rgba[j + 1] = Math.round(clamp(accumColor[baseIdx + 1] * intensity, 0, 1) * 255);
      rgba[j + 2] = Math.round(clamp(accumColor[baseIdx + 2] * intensity, 0, 1) * 255);
    }

    self.postMessage({ requestId, width: w, height: h, rgbaBuffer: rgba.buffer }, [rgba.buffer]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ requestId, error: message });
  }
});
