export const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uCamFar;

attribute float aSpriteScale;
attribute vec2 aColorCoordinate;
attribute float aRandomSeed;
attribute float aGrowNoise;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;

void main() {
  vec3 pos = position;

  float phase = uTime * 0.5 + aRandomSeed * 6.2831;
  pos.x += sin(phase) * 0.04 * aGrowNoise;
  pos.y += cos(phase * 0.7) * 0.025 * aGrowNoise;
  pos.z += sin(phase * 0.3) * 0.015 * aGrowNoise;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float d = -mv.z;

  float nearFade = smoothstep(0.1, 3.0, d);
  float farFade  = 1.0 - smoothstep(uCamFar * 0.35, uCamFar, d);
  vAlpha = nearFade * farFade;
  if (d < 0.0) vAlpha = 0.0;

  gl_PointSize = clamp(aSpriteScale * 1100.0 / max(d, 0.3), 0.5, 440.0);
  gl_Position  = projectionMatrix * mv;

  vColorCoord = aColorCoordinate;
  vSeed       = aRandomSeed;
}
`;

export const FRAGMENT = /* glsl */ `
uniform sampler2D uSpriteSheet;
uniform float uBrightness;
uniform float uSaturation;
uniform float uTime;
uniform vec3 uColorTint;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;

vec2 rotateUVatPoint(vec2 uv, float rotation, vec2 pivot) {
  float s = sin(rotation);
  float c = cos(rotation);
  mat2 m = mat2(c, -s, s, c);
  uv -= pivot;
  uv = m * uv;
  uv += pivot;
  return uv;
}

void main() {
  if (vAlpha < 0.01) discard;

  // The sprite sheet is an 8x7 grid (56 textures)
  vec2 GRID = vec2(8.0, 7.0);
  vec2 cell = 1.0 / GRID;

  // Determine which tile we're in from the seeded coordinate.
  vec2 tile = floor(vColorCoord * GRID);
  float col = tile.x;
  float row = tile.y;

  // Sprite UV inside the atlas
  vec2 pc = gl_PointCoord;
  // Flip point coord Y to match expected texture orientation
  pc.y = 1.0 - pc.y;

  vec2 uv;
  uv.x = cell.x * pc.x + col * cell.x;
  uv.y = cell.y * pc.y + row * cell.y;

  // Rotate within the tile (randomized per-particle)
  // vec2 pivot = vec2(col * cell.x + cell.x * 0.5, row * cell.y + cell.y * 0.5);
  // float angle = (vSeed * 6.28318530718) * 2.0 - 6.28318530718;
  // float animRotation = sin(vSeed + uTime * vSeed) * 0.3;
  // uv = rotateUVatPoint(uv, angle + animRotation, pivot);

  // Clamp to tile bounds to prevent bleeding
  vec2 minUV = vec2(col, row) * cell + 0.001;
  vec2 maxUV = minUV + cell - 0.002;
  uv = clamp(uv, minUV, maxUV);

  vec4 tex = texture2D(uSpriteSheet, uv);
  if (tex.a < 0.01) discard;

  float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
  vec3 color = mix(vec3(lum), tex.rgb, uSaturation) * uBrightness;

  color *= 0.9 + 0.1 * sin(uTime * 1.5 + vSeed * 40.0);
  
  // Apply our custom color tint
  color *= uColorTint;

  float a = tex.a * vAlpha;
  if (a < 0.01) discard;

  gl_FragColor = vec4(color, a);
  #include <colorspace_fragment>
}
`;
