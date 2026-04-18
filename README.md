# Terrain Prototype (Self-Contained)

Prototype goals:
- Load a terrain splat PNG and render it
- Load normals PNG and apply directional sunlight
- Load height PNG and compute directional shadows
- Simulate a full day/night sun cycle with adjustable speed
- Capture left-click map coordinates and draw a marker on a separate overlay layer

## Files

- `index.html`: app shell and control panel
- `src/main.js`: WebGL2 renderer + shaders
- `styles.css`: UI styling
- `assets/`: optional default PNG location
- `AI_CONTEXT.md`: implementation map and workflow notes for AI agents

## Expected auto-load names

- `assets/splat.png`
- `assets/normals.png`
- `assets/height.png`

If these are not present, the app starts with fallback textures. You can load files manually with the file inputs.

## Run

Serve the folder over HTTP (do not use `file://`).

PowerShell examples:

```powershell
# Option A: Python
python -m http.server 8000

# Option B: Node (if installed)
npx serve .
```

Then open:
- `http://localhost:8000` (Python)
- or URL printed by `serve`

## Notes

- Directional light is modeled as a sun direction vector.
- Sun azimuth/altitude are sampled from a daily keyframe table and interpolated.
- Day-cycle speed slider runs from `0.00` to `1.00` hours/second (`0` = paused).
- Low sun angles use warmer sunlight/ambient colors for sunrise/sunset ambience.
- A moon directional light and moon ambient tint keep nights dim but readable.
- Mouse wheel controls zoom.
- Middle mouse drag pans the map.
- Left click stores the last clicked map coordinate and draws a solid red circle marker.
- Marker radius is controlled by the `Circle Radius` slider (`0.5..50` map pixels).
- `Parallax` toggle enables a combined depth illusion from the height map:
  - continuous height-based UV offset while panning
  - quantized height-band offset for layered depth separation
  - anchored to the current view center to produce stronger relative motion toward screen edges
  - normalized by current zoom so perceived effect stays more consistent across zoom levels
  - edge-safe displacement fitting keeps parallax inside map bounds to avoid border cutouts
- `Parallax Strength` controls the blend intensity of both effects.
- `Parallax Bands` controls the number of quantized height bands (default `6`, range `2..256`).
- `Height Fog` toggle enables a camera-height-vs-terrain-height fog illusion:
  - camera height is derived from zoom (zoomed out = higher camera)
  - per-pixel fog amount is based on height difference between camera and terrain
  - low terrain gets fog sooner than high terrain, improving top-down depth cues
- `Fog Min Alpha` and `Fog Max Alpha` define transparency range.
- `Fog Falloff` controls how quickly fog ramps with camera-height minus terrain-height.
- `Fog Start Offset` delays fog onset by subtracting a threshold from the camera-vs-terrain height difference.
- `Fog Color` is user-pickable; by default it auto-tracks current lighting tint until manually changed.
- Height shadowing is a texture-space raymarch for prototype quality.
- Texture sampling is nearest-neighbor for pixel-sharp zoomed rendering.
