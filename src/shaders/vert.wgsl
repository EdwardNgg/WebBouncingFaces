@group(0) @binding(0) var<uniform> canvas : vec2f;

@vertex
fn main(
  @location(0) position : vec2f
) -> @builtin(position) vec4f {
  return vec4f(
    2.0 * position.x / canvas.x - 1.0,
    2.0 * position.y / canvas.y - 1.0,
    0,
    1
  );
}