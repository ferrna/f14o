import * as THREE from 'three';
import { material, uniforms } from './shader-material';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('background-container');
container.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

let animationFrameId;

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    uniforms.u_time.value += 0.002;
    renderer.render(scene, camera);
}

export function stopBackgroundAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
  uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
  uniforms.u_point.value.x = event.clientX / window.innerWidth;
  uniforms.u_point.value.y = 1 - event.clientY / window.innerHeight;
}