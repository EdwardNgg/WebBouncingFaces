@group(0) @binding(0) var<uniform> canvas : vec2f;
@group(0) @binding(1) var<uniform> transform : mat3x3<f32>;

@vertex
fn main(
  @location(0) position : vec2f
) -> @builtin(position) vec4f {
  let transformPosition : vec3f = transform * vec3f(position, 1.0);

  return vec4f(
    2.0 * transformPosition.x / canvas.x - 1.0,
    2.0 * transformPosition.y / canvas.y - 1.0,
    0,
    1
  );
}