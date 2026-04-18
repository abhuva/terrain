const canvas = document.getElementById("glCanvas");
const overlayCanvas = document.getElementById("overlayCanvas");
const statusEl = document.getElementById("status");
const cycleInfoEl = document.getElementById("cycleInfo");
const splatInput = document.getElementById("splatInput");
const normalInput = document.getElementById("normalInput");
const heightInput = document.getElementById("heightInput");
const circleRadiusInput = document.getElementById("circleRadius");
const circleRadiusValue = document.getElementById("circleRadiusValue");
const cycleSpeedInput = document.getElementById("cycleSpeed");
const shadowsToggle = document.getElementById("shadowsToggle");
const parallaxToggle = document.getElementById("parallaxToggle");
const parallaxStrengthInput = document.getElementById("parallaxStrength");
const parallaxStrengthValue = document.getElementById("parallaxStrengthValue");
const parallaxBandsInput = document.getElementById("parallaxBands");
const parallaxBandsValue = document.getElementById("parallaxBandsValue");
const fogToggle = document.getElementById("fogToggle");
const fogColorInput = document.getElementById("fogColor");
const fogMinAlphaInput = document.getElementById("fogMinAlpha");
const fogMinAlphaValue = document.getElementById("fogMinAlphaValue");
const fogMaxAlphaInput = document.getElementById("fogMaxAlpha");
const fogMaxAlphaValue = document.getElementById("fogMaxAlphaValue");
const fogFalloffInput = document.getElementById("fogFalloff");
const fogFalloffValue = document.getElementById("fogFalloffValue");
const fogStartOffsetInput = document.getElementById("fogStartOffset");
const fogStartOffsetValue = document.getElementById("fogStartOffsetValue");
const heightScaleInput = document.getElementById("heightScale");
const shadowStrengthInput = document.getElementById("shadowStrength");
const ambientInput = document.getElementById("ambient");
const diffuseInput = document.getElementById("diffuse");
const overlayCtx = overlayCanvas.getContext("2d");

const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error("WebGL2 is required for this prototype.");
}

const VERT_SRC = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
out vec4 outColor;

uniform sampler2D uSplat;
uniform sampler2D uNormals;
uniform sampler2D uHeight;
uniform vec2 uMapTexelSize;
uniform vec2 uResolution;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunStrength;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uMoonStrength;
uniform vec3 uAmbientColor;
uniform float uAmbient;
uniform float uHeightScale;
uniform float uShadowStrength;
uniform float uUseShadows;
uniform float uUseParallax;
uniform float uParallaxStrength;
uniform float uParallaxBands;
uniform float uZoom;
uniform float uUseFog;
uniform vec3 uFogColor;
uniform float uFogMinAlpha;
uniform float uFogMaxAlpha;
uniform float uFogFalloff;
uniform float uFogStartOffset;
uniform float uCameraHeightNorm;
uniform float uMapAspect;
uniform vec2 uViewHalfExtents;
uniform vec2 uPanWorld;

float readHeight(vec2 uv) {
  return texture(uHeight, uv).r * uHeightScale;
}

vec2 applyParallax(vec2 baseUv, vec2 focalUv) {
  if (uUseParallax < 0.5) return baseUv;

  float hRaw = texture(uHeight, baseUv).r;
  vec2 fromFocal = baseUv - focalUv;
  float dist = length(fromFocal);
  float edgeBoost = smoothstep(0.0, 0.9, dist);
  float zoomNorm = max(0.35, uZoom);
  float amount = uParallaxStrength * (0.35 + 0.65 * edgeBoost) * zoomNorm;

  float centeredHeight = hRaw - 0.5;
  vec2 continuousOffset = -fromFocal * (centeredHeight * amount * 0.48);

  float bandSteps = max(2.0, uParallaxBands);
  float bandNorm = floor(hRaw * bandSteps) / max(1.0, bandSteps - 1.0);
  float centeredBand = bandNorm - 0.5;
  vec2 bandOffset = -fromFocal * (centeredBand * amount * 0.70);

  return baseUv + continuousOffset + bandOffset;
}

vec2 fitUvOffsetToBounds(vec2 baseUv, vec2 displacedUv) {
  vec2 offset = displacedUv - baseUv;
  float scale = 1.0;

  if (offset.x > 0.0) {
    scale = min(scale, (1.0 - baseUv.x) / max(0.000001, offset.x));
  } else if (offset.x < 0.0) {
    scale = min(scale, baseUv.x / max(0.000001, -offset.x));
  }

  if (offset.y > 0.0) {
    scale = min(scale, (1.0 - baseUv.y) / max(0.000001, offset.y));
  } else if (offset.y < 0.0) {
    scale = min(scale, baseUv.y / max(0.000001, -offset.y));
  }

  scale = clamp(scale, 0.0, 1.0);
  return baseUv + offset * scale;
}

float calcShadow(vec2 uv, vec3 sunDir) {
  if (uUseShadows < 0.5) return 1.0;
  if (sunDir.z <= 0.01) return 0.0;

  float dirLen = length(sunDir.xy);
  if (dirLen < 0.0001) return 1.0;
  vec2 dir2 = sunDir.xy / dirLen;

  float h0 = readHeight(uv);
  float slope = sunDir.z / max(dirLen, 0.0001);
  float bias = 0.7;
  float stepPixels = 1.5;
  vec2 stepUv = dir2 * uMapTexelSize * stepPixels;

  vec2 p = uv;
  float traveledPixels = 0.0;
  for (int i = 0; i < 120; i++) {
    p += stepUv;
    traveledPixels += stepPixels;
    if (p.x <= 0.0 || p.y <= 0.0 || p.x >= 1.0 || p.y >= 1.0) {
      break;
    }
    float h = readHeight(p);
    float rayH = h0 + slope * traveledPixels;
    if (h > rayH + bias) {
      return 1.0 - uShadowStrength;
    }
  }
  return 1.0;
}

void main() {
  vec2 ndc = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  vec2 world = uPanWorld + ndc * uViewHalfExtents;
  vec2 baseUv = vec2(world.x / uMapAspect + 0.5, world.y + 0.5);

  if (baseUv.x < 0.0 || baseUv.y < 0.0 || baseUv.x > 1.0 || baseUv.y > 1.0) {
    outColor = vec4(0.02, 0.025, 0.03, 1.0);
    return;
  }

  vec2 focalUv = vec2(uPanWorld.x / uMapAspect + 0.5, uPanWorld.y + 0.5);
  vec2 uv = fitUvOffsetToBounds(baseUv, applyParallax(baseUv, focalUv));

  vec3 base = texture(uSplat, uv).rgb;
  vec3 n = texture(uNormals, uv).xyz * 2.0 - 1.0;
  n = normalize(n);

  float sunDiffuse = max(dot(n, uSunDir), 0.0);
  float moonDiffuse = max(dot(n, uMoonDir), 0.0);
  float sunShadow = calcShadow(uv, uSunDir);
  float moonShadow = calcShadow(uv, uMoonDir);

  vec3 ambientLit = base * (uAmbient * uAmbientColor);
  vec3 sunLit = base * (sunDiffuse * sunShadow * uSunStrength) * uSunColor;
  vec3 moonLit = base * (moonDiffuse * moonShadow * uMoonStrength) * uMoonColor;
  vec3 lit = clamp(ambientLit + sunLit + moonLit, 0.0, 1.0);

  if (uUseFog > 0.5) {
    float terrainHeight = texture(uHeight, uv).r;
    float heightDelta = max(0.0, uCameraHeightNorm - terrainHeight);
    float adjustedDelta = max(0.0, heightDelta - uFogStartOffset);
    float fogBase = smoothstep(0.02, 0.92, adjustedDelta);
    float fogAmount = pow(clamp(fogBase, 0.0, 1.0), max(0.05, uFogFalloff));
    float fogMin = min(uFogMinAlpha, uFogMaxAlpha);
    float fogMax = max(uFogMinAlpha, uFogMaxAlpha);
    float fogAlpha = mix(fogMin, fogMax, fogAmount);
    lit = mix(lit, uFogColor, fogAlpha);
  }

  outColor = vec4(lit, 1.0);
}`;

function createShader(type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || "Shader compilation failed.");
  }
  return shader;
}

function createProgram(vsSrc, fsSrc) {
  const vs = createShader(gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || "Program linking failed.");
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function createTexture() {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  return tex;
}

function uploadImageToTexture(tex, image) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

async function loadImageFromUrl(url) {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return image;
}

async function loadImageFromFile(file) {
  const image = new Image();
  image.decoding = "async";
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  image.src = dataUrl;
  await image.decode();
  return image;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpVec3(a, b, t) {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
  ];
}

function lerpAngleDeg(a, b, t) {
  const delta = ((b - a + 540) % 360) - 180;
  return a + delta * t;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function wrapHour(hour) {
  const h = hour % 24;
  return h < 0 ? h + 24 : h;
}

function formatHour(hour) {
  const h = wrapHour(hour);
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const SUN_KEYS = [
  { hour: 0, azimuthDeg: -170, altitudeDeg: -60, sunColor: [0.08, 0.10, 0.20], ambientColor: [0.06, 0.08, 0.12], ambientScale: 0.18 },
  { hour: 4, azimuthDeg: -135, altitudeDeg: -22, sunColor: [0.35, 0.26, 0.22], ambientColor: [0.14, 0.10, 0.12], ambientScale: 0.22 },
  { hour: 6, azimuthDeg: -108, altitudeDeg: 3, sunColor: [1.00, 0.50, 0.30], ambientColor: [0.42, 0.22, 0.15], ambientScale: 0.30 },
  { hour: 8, azimuthDeg: -72, altitudeDeg: 24, sunColor: [1.00, 0.82, 0.62], ambientColor: [0.44, 0.34, 0.28], ambientScale: 0.45 },
  { hour: 12, azimuthDeg: 0, altitudeDeg: 64, sunColor: [1.00, 0.98, 0.92], ambientColor: [0.58, 0.62, 0.68], ambientScale: 0.70 },
  { hour: 16, azimuthDeg: 72, altitudeDeg: 26, sunColor: [1.00, 0.84, 0.65], ambientColor: [0.44, 0.35, 0.30], ambientScale: 0.50 },
  { hour: 18, azimuthDeg: 108, altitudeDeg: 4, sunColor: [1.00, 0.48, 0.28], ambientColor: [0.45, 0.23, 0.16], ambientScale: 0.32 },
  { hour: 20, azimuthDeg: 138, altitudeDeg: -14, sunColor: [0.42, 0.25, 0.24], ambientColor: [0.18, 0.10, 0.14], ambientScale: 0.22 },
  { hour: 24, azimuthDeg: 190, altitudeDeg: -60, sunColor: [0.08, 0.10, 0.20], ambientColor: [0.06, 0.08, 0.12], ambientScale: 0.18 },
];

function sampleSunAtHour(hour) {
  const h = wrapHour(hour);
  for (let i = 0; i < SUN_KEYS.length - 1; i++) {
    const a = SUN_KEYS[i];
    const b = SUN_KEYS[i + 1];
    if (h >= a.hour && h <= b.hour) {
      const span = Math.max(0.0001, b.hour - a.hour);
      const t = (h - a.hour) / span;
      return {
        azimuthDeg: lerpAngleDeg(a.azimuthDeg, b.azimuthDeg, t),
        altitudeDeg: lerp(a.altitudeDeg, b.altitudeDeg, t),
        sunColor: lerpVec3(a.sunColor, b.sunColor, t),
        ambientColor: lerpVec3(a.ambientColor, b.ambientColor, t),
        ambientScale: lerp(a.ambientScale, b.ambientScale, t),
      };
    }
  }
  return SUN_KEYS[0];
}

const program = createProgram(VERT_SRC, FRAG_SRC);
gl.useProgram(program);

const uniforms = {
  uSplat: gl.getUniformLocation(program, "uSplat"),
  uNormals: gl.getUniformLocation(program, "uNormals"),
  uHeight: gl.getUniformLocation(program, "uHeight"),
  uMapTexelSize: gl.getUniformLocation(program, "uMapTexelSize"),
  uResolution: gl.getUniformLocation(program, "uResolution"),
  uSunDir: gl.getUniformLocation(program, "uSunDir"),
  uSunColor: gl.getUniformLocation(program, "uSunColor"),
  uSunStrength: gl.getUniformLocation(program, "uSunStrength"),
  uMoonDir: gl.getUniformLocation(program, "uMoonDir"),
  uMoonColor: gl.getUniformLocation(program, "uMoonColor"),
  uMoonStrength: gl.getUniformLocation(program, "uMoonStrength"),
  uAmbientColor: gl.getUniformLocation(program, "uAmbientColor"),
  uAmbient: gl.getUniformLocation(program, "uAmbient"),
  uHeightScale: gl.getUniformLocation(program, "uHeightScale"),
  uShadowStrength: gl.getUniformLocation(program, "uShadowStrength"),
  uUseShadows: gl.getUniformLocation(program, "uUseShadows"),
  uUseParallax: gl.getUniformLocation(program, "uUseParallax"),
  uParallaxStrength: gl.getUniformLocation(program, "uParallaxStrength"),
  uParallaxBands: gl.getUniformLocation(program, "uParallaxBands"),
  uZoom: gl.getUniformLocation(program, "uZoom"),
  uUseFog: gl.getUniformLocation(program, "uUseFog"),
  uFogColor: gl.getUniformLocation(program, "uFogColor"),
  uFogMinAlpha: gl.getUniformLocation(program, "uFogMinAlpha"),
  uFogMaxAlpha: gl.getUniformLocation(program, "uFogMaxAlpha"),
  uFogFalloff: gl.getUniformLocation(program, "uFogFalloff"),
  uFogStartOffset: gl.getUniformLocation(program, "uFogStartOffset"),
  uCameraHeightNorm: gl.getUniformLocation(program, "uCameraHeightNorm"),
  uMapAspect: gl.getUniformLocation(program, "uMapAspect"),
  uViewHalfExtents: gl.getUniformLocation(program, "uViewHalfExtents"),
  uPanWorld: gl.getUniformLocation(program, "uPanWorld"),
};

const quad = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quad);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]),
  gl.STATIC_DRAW
);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

const splatTex = createTexture();
const normalsTex = createTexture();
const heightTex = createTexture();

const splatSize = { width: 1, height: 1 };
const heightSize = { width: 1, height: 1 };

function createFlatNormalImage(size = 2) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, size, size);
  return c;
}

function createFlatHeightImage(size = 2) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, size, size);
  return c;
}

function createFallbackSplat(size = 512) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0.0, "#567d46");
  g.addColorStop(0.5, "#7a8f5a");
  g.addColorStop(1.0, "#b2a87a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(70,92,58,0.35)" : "rgba(147,132,91,0.25)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

function setSplatSizeFromImage(img) {
  splatSize.width = img.width || 1;
  splatSize.height = img.height || 1;
}

function setHeightSizeFromImage(img) {
  heightSize.width = img.width || 1;
  heightSize.height = img.height || 1;
}

const defaultNormalImage = createFlatNormalImage();
const defaultHeightImage = createFlatHeightImage();
const defaultSplatImage = createFallbackSplat();
uploadImageToTexture(normalsTex, defaultNormalImage);
uploadImageToTexture(heightTex, defaultHeightImage);
uploadImageToTexture(splatTex, defaultSplatImage);
setSplatSizeFromImage(defaultSplatImage);
setHeightSizeFromImage(defaultHeightImage);

let zoom = 1;
const zoomMin = 0.5;
const zoomMax = 32;
const panWorld = { x: 0, y: 0 };
let isMiddleDragging = false;
let lastDragClient = { x: 0, y: 0 };
let lastMarker = null;
let fogColorManual = false;

const cycleState = {
  hour: 9.5,
  lastRenderMs: null,
};

function resetCamera() {
  zoom = 1;
  panWorld.x = 0;
  panWorld.y = 0;
}

function getScreenAspect() {
  return canvas.width > 0 && canvas.height > 0 ? canvas.width / canvas.height : 1;
}

function getMapAspect() {
  return splatSize.width / splatSize.height;
}

function getBaseViewHalfExtents() {
  const screenAspect = getScreenAspect();
  const mapAspect = getMapAspect();
  if (screenAspect >= mapAspect) {
    return { x: screenAspect, y: 1 };
  }
  return { x: mapAspect, y: mapAspect / screenAspect };
}

function getViewHalfExtents(zoomValue = zoom) {
  const base = getBaseViewHalfExtents();
  return {
    x: base.x / zoomValue,
    y: base.y / zoomValue,
  };
}

function clientToNdc(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = 1 - ((clientY - rect.top) / rect.height) * 2;
  return { x, y };
}

function worldFromNdc(ndc, zoomValue = zoom, pan = panWorld) {
  const ext = getViewHalfExtents(zoomValue);
  return {
    x: pan.x + ndc.x * ext.x,
    y: pan.y + ndc.y * ext.y,
  };
}

function worldToUv(world) {
  return {
    x: world.x / getMapAspect() + 0.5,
    y: world.y + 0.5,
  };
}

function uvToMapPixelIndex(uv) {
  return {
    x: Math.floor(clamp(uv.x, 0, 0.999999) * splatSize.width),
    y: Math.floor((1 - clamp(uv.y, 0, 0.999999)) * splatSize.height),
  };
}

function mapPixelIndexToUv(pixelX, pixelY) {
  return {
    x: (pixelX + 0.5) / splatSize.width,
    y: 1 - (pixelY + 0.5) / splatSize.height,
  };
}

function mapPixelToWorld(pixelX, pixelY) {
  const uv = mapPixelIndexToUv(pixelX, pixelY);
  return {
    x: (uv.x - 0.5) * getMapAspect(),
    y: uv.y - 0.5,
  };
}

function worldToScreen(world) {
  const viewHalf = getViewHalfExtents();
  const ndcX = (world.x - panWorld.x) / viewHalf.x;
  const ndcY = (world.y - panWorld.y) / viewHalf.y;
  return {
    x: (ndcX * 0.5 + 0.5) * overlayCanvas.width,
    y: (1 - (ndcY * 0.5 + 0.5)) * overlayCanvas.height,
  };
}

function updateRadiusLabel() {
  const value = Number(circleRadiusInput.value);
  const display = Number.isInteger(value) ? String(value) : value.toFixed(1);
  circleRadiusValue.textContent = `${display} px`;
}

function updateParallaxStrengthLabel() {
  const value = clamp(Number(parallaxStrengthInput.value), 0, 1);
  parallaxStrengthValue.textContent = value.toFixed(2);
}

function updateParallaxBandsLabel() {
  const value = Math.round(clamp(Number(parallaxBandsInput.value), 2, 256));
  parallaxBandsValue.textContent = String(value);
}

function updateFogAlphaLabels() {
  fogMinAlphaValue.textContent = clamp(Number(fogMinAlphaInput.value), 0, 1).toFixed(2);
  fogMaxAlphaValue.textContent = clamp(Number(fogMaxAlphaInput.value), 0, 1).toFixed(2);
}

function updateFogFalloffLabel() {
  fogFalloffValue.textContent = clamp(Number(fogFalloffInput.value), 0.2, 4).toFixed(2);
}

function updateFogStartOffsetLabel() {
  fogStartOffsetValue.textContent = clamp(Number(fogStartOffsetInput.value), 0, 1).toFixed(2);
}

function updateParallaxUi() {
  parallaxStrengthInput.disabled = !parallaxToggle.checked;
  parallaxBandsInput.disabled = !parallaxToggle.checked;
}

function updateFogUi() {
  const enabled = fogToggle.checked;
  fogColorInput.disabled = !enabled;
  fogMinAlphaInput.disabled = !enabled;
  fogMaxAlphaInput.disabled = !enabled;
  fogFalloffInput.disabled = !enabled;
  fogStartOffsetInput.disabled = !enabled;
}

function rgbToHex(rgb) {
  const r = Math.round(clamp(rgb[0], 0, 1) * 255);
  const g = Math.round(clamp(rgb[1], 0, 1) * 255);
  const b = Math.round(clamp(rgb[2], 0, 1) * 255);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb01(hex) {
  const text = String(hex || "").trim();
  const match = /^#?([0-9a-fA-F]{6})$/.exec(text);
  if (!match) return [0.5, 0.5, 0.5];
  const value = match[1];
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ];
}

function drawOverlay() {
  if (!overlayCtx) return;
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (!lastMarker) return;

  const centerWorld = mapPixelToWorld(lastMarker.pixelX, lastMarker.pixelY);
  const centerScreen = worldToScreen(centerWorld);

  const radiusMapPx = clamp(Number(circleRadiusInput.value), 0.5, 50);
  const worldPerMapPixel = getMapAspect() / splatSize.width;
  const edgeWorld = {
    x: centerWorld.x + worldPerMapPixel * radiusMapPx,
    y: centerWorld.y,
  };
  const edgeScreen = worldToScreen(edgeWorld);
  const screenRadius = Math.max(0.001, Math.hypot(edgeScreen.x - centerScreen.x, edgeScreen.y - centerScreen.y));

  overlayCtx.beginPath();
  overlayCtx.arc(centerScreen.x, centerScreen.y, screenRadius, 0, Math.PI * 2);
  overlayCtx.fillStyle = "rgb(255,0,0)";
  overlayCtx.fill();
}

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const ndc = clientToNdc(e.clientX, e.clientY);
  const worldBefore = worldFromNdc(ndc, zoom, panWorld);
  const nextZoom = Math.min(zoomMax, Math.max(zoomMin, zoom * Math.exp(-e.deltaY * 0.0015)));
  const worldAfter = worldFromNdc(ndc, nextZoom, panWorld);
  panWorld.x += worldBefore.x - worldAfter.x;
  panWorld.y += worldBefore.y - worldAfter.y;
  zoom = nextZoom;
}, { passive: false });

canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 1) return;
  e.preventDefault();
  isMiddleDragging = true;
  lastDragClient.x = e.clientX;
  lastDragClient.y = e.clientY;
});

window.addEventListener("mouseup", (e) => {
  if (e.button !== 1) return;
  isMiddleDragging = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isMiddleDragging) return;
  const prevNdc = clientToNdc(lastDragClient.x, lastDragClient.y);
  const currNdc = clientToNdc(e.clientX, e.clientY);
  const worldPrev = worldFromNdc(prevNdc, zoom, panWorld);
  const worldCurr = worldFromNdc(currNdc, zoom, panWorld);
  panWorld.x += worldPrev.x - worldCurr.x;
  panWorld.y += worldPrev.y - worldCurr.y;
  lastDragClient.x = e.clientX;
  lastDragClient.y = e.clientY;
});

canvas.addEventListener("click", (e) => {
  if (e.button !== 0) return;
  const ndc = clientToNdc(e.clientX, e.clientY);
  const world = worldFromNdc(ndc);
  const uv = worldToUv(world);
  if (uv.x < 0 || uv.x > 1 || uv.y < 0 || uv.y > 1) {
    return;
  }

  const pixel = uvToMapPixelIndex(uv);
  const pixelCenterUv = mapPixelIndexToUv(pixel.x, pixel.y);
  lastMarker = {
    uvX: pixelCenterUv.x,
    uvY: pixelCenterUv.y,
    pixelX: pixel.x,
    pixelY: pixel.y,
  };

  setStatus(
    `Marker map coords: (${lastMarker.pixelX}, ${lastMarker.pixelY}) | uv=(${lastMarker.uvX.toFixed(4)}, ${lastMarker.uvY.toFixed(4)})`
  );
  drawOverlay();
});

canvas.addEventListener("auxclick", (e) => {
  if (e.button === 1) e.preventDefault();
});

circleRadiusInput.addEventListener("input", () => {
  updateRadiusLabel();
  drawOverlay();
});

parallaxStrengthInput.addEventListener("input", updateParallaxStrengthLabel);
parallaxBandsInput.addEventListener("input", updateParallaxBandsLabel);
parallaxToggle.addEventListener("change", updateParallaxUi);
fogMinAlphaInput.addEventListener("input", updateFogAlphaLabels);
fogMaxAlphaInput.addEventListener("input", updateFogAlphaLabels);
fogFalloffInput.addEventListener("input", updateFogFalloffLabel);
fogStartOffsetInput.addEventListener("input", updateFogStartOffsetLabel);
fogToggle.addEventListener("change", updateFogUi);
fogColorInput.addEventListener("input", () => {
  fogColorManual = true;
});

async function tryAutoLoadAssets() {
  const loaded = [];
  const failed = [];

  try {
    const splat = await loadImageFromUrl("./assets/splat.png");
    uploadImageToTexture(splatTex, splat);
    setSplatSizeFromImage(splat);
    resetCamera();
    loaded.push("splat.png");
  } catch (err) {
    console.warn("Failed to load splat.png", err);
    failed.push("splat.png");
    const fallbackSplat = createFallbackSplat(512);
    uploadImageToTexture(splatTex, fallbackSplat);
    setSplatSizeFromImage(fallbackSplat);
    resetCamera();
  }

  try {
    const normals = await loadImageFromUrl("./assets/normals.png");
    uploadImageToTexture(normalsTex, normals);
    loaded.push("normals.png");
  } catch (err) {
    console.warn("Failed to load normals.png", err);
    failed.push("normals.png");
    uploadImageToTexture(normalsTex, defaultNormalImage);
  }

  try {
    const height = await loadImageFromUrl("./assets/height.png");
    uploadImageToTexture(heightTex, height);
    setHeightSizeFromImage(height);
    loaded.push("height.png");
  } catch (err) {
    console.warn("Failed to load height.png", err);
    failed.push("height.png");
    uploadImageToTexture(heightTex, defaultHeightImage);
    setHeightSizeFromImage(defaultHeightImage);
  }

  if (loaded.length > 0 && failed.length > 0) {
    setStatus(`Loaded defaults: ${loaded.join(", ")} | Fallback used for: ${failed.join(", ")}`);
  } else if (loaded.length > 0) {
    setStatus(`Loaded default assets: ${loaded.join(", ")}`);
  } else if (failed.length > 0) {
    setStatus(`Using fallback textures for: ${failed.join(", ")}. Add PNGs to assets/ or load via file pickers.`);
  } else {
    setStatus("Using fallback textures. Add PNGs to assets/ or load via file pickers.");
  }
}

splatInput.addEventListener("change", async () => {
  const file = splatInput.files && splatInput.files[0];
  if (!file) return;
  try {
    const image = await loadImageFromFile(file);
    uploadImageToTexture(splatTex, image);
    setSplatSizeFromImage(image);
    resetCamera();
    setStatus(`Loaded splat: ${file.name} (${image.width}x${image.height})`);
  } catch (error) {
    console.error("Failed to load splat file:", file.name, error);
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Failed to load splat '${file.name}': ${message}`);
  }
});

normalInput.addEventListener("change", async () => {
  const file = normalInput.files && normalInput.files[0];
  if (!file) return;
  try {
    const image = await loadImageFromFile(file);
    uploadImageToTexture(normalsTex, image);
    setStatus(`Loaded normals: ${file.name}`);
  } catch (error) {
    console.error("Failed to load normals file:", file.name, error);
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Failed to load normals '${file.name}': ${message}`);
  }
});

heightInput.addEventListener("change", async () => {
  const file = heightInput.files && heightInput.files[0];
  if (!file) return;
  try {
    const image = await loadImageFromFile(file);
    uploadImageToTexture(heightTex, image);
    setHeightSizeFromImage(image);
    setStatus(`Loaded height: ${file.name}`);
  } catch (error) {
    console.error("Failed to load height file:", file.name, error);
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Failed to load height '${file.name}': ${message}`);
  }
});

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.floor(window.innerWidth * dpr);
  const h = Math.floor(window.innerHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  if (overlayCanvas.width !== w || overlayCanvas.height !== h) {
    overlayCanvas.width = w;
    overlayCanvas.height = h;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function render(nowMs) {
  resize();

  if (cycleState.lastRenderMs === null) {
    cycleState.lastRenderMs = nowMs;
  }
  const dtSec = Math.min(0.25, Math.max(0, (nowMs - cycleState.lastRenderMs) * 0.001));
  cycleState.lastRenderMs = nowMs;

  const cycleSpeedHoursPerSec = clamp(Number(cycleSpeedInput.value), 0, 1);
  if (cycleSpeedHoursPerSec > 0) {
    cycleState.hour = wrapHour(cycleState.hour + cycleSpeedHoursPerSec * dtSec);
  }

  const sun = sampleSunAtHour(cycleState.hour);
  const moonTrack = sampleSunAtHour(wrapHour(cycleState.hour + 12));
  const azimuthRad = sun.azimuthDeg * Math.PI / 180;
  const altitudeRad = sun.altitudeDeg * Math.PI / 180;
  const cosAlt = Math.cos(altitudeRad);
  const sunDir = [
    Math.cos(azimuthRad) * cosAlt,
    Math.sin(azimuthRad) * cosAlt,
    Math.sin(altitudeRad),
  ];
  const moonAzimuthRad = moonTrack.azimuthDeg * Math.PI / 180;
  const moonAltitudeDeg = moonTrack.altitudeDeg * 0.9;
  const moonAltitudeRad = moonAltitudeDeg * Math.PI / 180;
  const moonCosAlt = Math.cos(moonAltitudeRad);
  const moonDir = [
    Math.cos(moonAzimuthRad) * moonCosAlt,
    Math.sin(moonAzimuthRad) * moonCosAlt,
    Math.sin(moonAltitudeRad),
  ];

  const ambientBase = Number(ambientInput.value);
  const diffuseBase = clamp(Number(diffuseInput.value), 0, 2);
  const sunVisible = smoothstep(-4, 2, sun.altitudeDeg);
  const moonVisible = smoothstep(-10, 6, moonAltitudeDeg);
  const sunStrength = sunVisible * diffuseBase;
  const moonStrength = 0.22 * moonVisible * diffuseBase;

  const moonAmbientColor = [0.20, 0.26, 0.40];
  const sunAmbientWeight = sun.ambientScale;
  const moonAmbientWeight = 0.24 * moonVisible;
  const totalAmbientWeight = sunAmbientWeight + moonAmbientWeight;
  let ambientColor = [0.08, 0.10, 0.14];
  if (totalAmbientWeight > 0.0001) {
    ambientColor = [
      (sun.ambientColor[0] * sunAmbientWeight + moonAmbientColor[0] * moonAmbientWeight) / totalAmbientWeight,
      (sun.ambientColor[1] * sunAmbientWeight + moonAmbientColor[1] * moonAmbientWeight) / totalAmbientWeight,
      (sun.ambientColor[2] * sunAmbientWeight + moonAmbientColor[2] * moonAmbientWeight) / totalAmbientWeight,
    ];
  }
  const ambientFinal = ambientBase * (sunAmbientWeight + moonAmbientWeight);
  const moonColor = [0.34, 0.40, 0.54];
  const zoomNorm = clamp((zoom - zoomMin) / (zoomMax - zoomMin), 0, 1);
  const cameraHeightNorm = 1 - zoomNorm;

  const fogSunWeight = 0.16 + 0.28 * sunVisible;
  const fogMoonWeight = 0.10 * moonVisible;
  const fogAmbientWeight = 0.70;
  const fogBaseWeight = 0.35;
  const fogBaseColor = [0.34, 0.40, 0.46];
  const fogWeightSum = fogSunWeight + fogMoonWeight + fogAmbientWeight + fogBaseWeight;
  const fogColorAuto = [
    (sun.sunColor[0] * fogSunWeight + moonColor[0] * fogMoonWeight + ambientColor[0] * fogAmbientWeight + fogBaseColor[0] * fogBaseWeight) / fogWeightSum,
    (sun.sunColor[1] * fogSunWeight + moonColor[1] * fogMoonWeight + ambientColor[1] * fogAmbientWeight + fogBaseColor[1] * fogBaseWeight) / fogWeightSum,
    (sun.sunColor[2] * fogSunWeight + moonColor[2] * fogMoonWeight + ambientColor[2] * fogAmbientWeight + fogBaseColor[2] * fogBaseWeight) / fogWeightSum,
  ];
  if (!fogColorManual) {
    fogColorInput.value = rgbToHex(fogColorAuto);
  }
  const fogColor = fogColorManual ? hexToRgb01(fogColorInput.value) : fogColorAuto;

  cycleInfoEl.textContent = `Time: ${formatHour(cycleState.hour)} | Speed: ${cycleSpeedHoursPerSec.toFixed(2)} h/s`;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, splatTex);
  gl.uniform1i(uniforms.uSplat, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, normalsTex);
  gl.uniform1i(uniforms.uNormals, 1);

  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, heightTex);
  gl.uniform1i(uniforms.uHeight, 2);

  const viewHalf = getViewHalfExtents();
  gl.uniform2f(uniforms.uMapTexelSize, 1 / heightSize.width, 1 / heightSize.height);
  gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
  gl.uniform3f(uniforms.uSunDir, sunDir[0], sunDir[1], sunDir[2]);
  gl.uniform3f(uniforms.uSunColor, sun.sunColor[0], sun.sunColor[1], sun.sunColor[2]);
  gl.uniform1f(uniforms.uSunStrength, sunStrength);
  gl.uniform3f(uniforms.uMoonDir, moonDir[0], moonDir[1], moonDir[2]);
  gl.uniform3f(uniforms.uMoonColor, moonColor[0], moonColor[1], moonColor[2]);
  gl.uniform1f(uniforms.uMoonStrength, moonStrength);
  gl.uniform3f(uniforms.uAmbientColor, ambientColor[0], ambientColor[1], ambientColor[2]);
  gl.uniform1f(uniforms.uAmbient, ambientFinal);
  gl.uniform1f(uniforms.uHeightScale, Number(heightScaleInput.value));
  gl.uniform1f(uniforms.uShadowStrength, Number(shadowStrengthInput.value));
  gl.uniform1f(uniforms.uUseShadows, shadowsToggle.checked ? 1 : 0);
  gl.uniform1f(uniforms.uUseParallax, parallaxToggle.checked ? 1 : 0);
  gl.uniform1f(uniforms.uParallaxStrength, clamp(Number(parallaxStrengthInput.value), 0, 1));
  gl.uniform1f(uniforms.uParallaxBands, Math.round(clamp(Number(parallaxBandsInput.value), 2, 256)));
  gl.uniform1f(uniforms.uZoom, zoom);
  gl.uniform1f(uniforms.uUseFog, fogToggle.checked ? 1 : 0);
  gl.uniform3f(uniforms.uFogColor, fogColor[0], fogColor[1], fogColor[2]);
  gl.uniform1f(uniforms.uFogMinAlpha, clamp(Number(fogMinAlphaInput.value), 0, 1));
  gl.uniform1f(uniforms.uFogMaxAlpha, clamp(Number(fogMaxAlphaInput.value), 0, 1));
  gl.uniform1f(uniforms.uFogFalloff, clamp(Number(fogFalloffInput.value), 0.2, 4));
  gl.uniform1f(uniforms.uFogStartOffset, clamp(Number(fogStartOffsetInput.value), 0, 1));
  gl.uniform1f(uniforms.uCameraHeightNorm, cameraHeightNorm);
  gl.uniform1f(uniforms.uMapAspect, getMapAspect());
  gl.uniform2f(uniforms.uViewHalfExtents, viewHalf.x, viewHalf.y);
  gl.uniform2f(uniforms.uPanWorld, panWorld.x, panWorld.y);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  drawOverlay();
  requestAnimationFrame(render);
}

window.addEventListener("resize", resize);

void tryAutoLoadAssets().catch((error) => {
  console.error("Auto-load failed:", error);
  const message = error instanceof Error ? error.message : String(error);
  setStatus(`Auto-load failed: ${message}`);
});
updateRadiusLabel();
updateParallaxStrengthLabel();
updateParallaxBandsLabel();
updateFogAlphaLabels();
updateFogFalloffLabel();
updateFogStartOffsetLabel();
updateParallaxUi();
updateFogUi();
setStatus(`${statusEl.textContent} | Day cycle: speed slider (0..1 h/s), diffuse slider, wheel zoom, middle-drag pan, left-click marker, optional parallax and height fog.`);
requestAnimationFrame(render);
