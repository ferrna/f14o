import * as THREE from 'three';
import { snoiseFunction } from './snoise-func';

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  ${snoiseFunction}

  uniform vec2 u_resolution;
  uniform vec2 u_point;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_mouseInteraction;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  varying vec2 vUv;

  vec3 color1 = vec3(0.671,1.,0.518);
  vec3 color2 = vec3(0.0,0.729,0.886);

  float circle_s(vec2 dist, float radius) {
    return smoothstep(0., radius, pow(dot(dist, dist), .6) * .1);
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.);
    vec2 uv = vUv * aspect;
    vec2 mouse = vUv - u_point;

    mouse.y /= u_ratio;
    
    float noise = snoise(vec3(uv * 0.5, u_time * 1.5));
    float noise1 = snoise(vec3((uv + .1) * 0.5, u_time * 1.5));
    float noise2 = snoise(vec3((uv - .1) * 0.5, u_time * 1.5));
    
    float alpha = (noise + noise1 + noise2) / 3.;
    alpha *= circle_s(mouse, .015 * u_mouseInteraction);
    float x = 1. - noise;
    
    float blendFactor = smoothstep(.1, 1., x * 1.);
    vec3 blendedColor = mix(color1, color2, blendFactor);

    gl_FragColor = vec4(blendedColor, alpha * 0.7);
  }
`;

export const uniforms = {
  u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_point: { value: new THREE.Vector2(0.5, 0.5) },
  u_time: { value: 0 },
  u_ratio: { value: window.innerWidth / window.innerHeight },
  u_mouseInteraction: { value: 1 }
};

export const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true
});