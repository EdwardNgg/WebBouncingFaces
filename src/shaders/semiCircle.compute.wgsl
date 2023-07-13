struct SemiCircleProps {
  center: vec2f,
  radius: f32,
  phi: f32,
};

@group(0) @binding(0) var<uniform> props : SemiCircleProps;
@group(0) @binding(1) var<storage, read_write> positions : array<vec2f>;

override workGroupSize : u32 = 16;
const pi : f32 = 3.141592;

@compute @workgroup_size(workGroupSize)
fn main(
  @builtin(global_invocation_id) globalId: vec3u,
  @builtin(num_workgroups) numWorkGroups: vec3u,
) {
  let u : f32 = f32(globalId.x) / f32(workGroupSize * numWorkGroups.x - 1);
  let theta : f32 = pi * u + radians(props.phi);

  let anglePosition : vec2f = vec2f(
    props.radius * cos(theta),
    props.radius * sin(theta),
  ) + props.center;

  positions[2 * globalId.x] = anglePosition;
  positions[2 * globalId.x + 1] = props.center;
}