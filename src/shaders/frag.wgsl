@group(0) @binding(2) var<uniform> color : vec4f;

@fragment
fn main() -> @location(0) vec4f {
  return color;
}