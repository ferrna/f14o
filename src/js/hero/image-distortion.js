import * as THREE from 'three';
import { gsap } from 'gsap';

let container, camera, scene, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;

function init() {
  container = document.getElementById('hero-canvas-container');

  camera = new THREE.OrthographicCamera(
    container.offsetWidth / -2,
    container.offsetWidth / 2,
    container.offsetHeight / 2,
    container.offsetHeight / -2,
    1,
    1000
  );
  camera.position.z = 1;

  scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();
  const texture = loader.load('media/wallpaper-1.png');
  const displacementMap = loader.load('media/wallpaper-1grayscale.jpg');

  geometry = new THREE.PlaneGeometry(container.offsetWidth, container.offsetHeight, 32, 32);
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uDisplacementMap: { value: displacementMap },
      uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0.3 },
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform sampler2D uDisplacementMap;
      uniform vec2 uMousePos;
      uniform float uIntensity;
      uniform float uTime;
      varying vec2 vUv;
      
      void main() {
        vec2 displacementUv = vUv;
        float distanceFromMouse = distance(vUv, uMousePos);
        float distortionStrength = smoothstep(0.4, 0.0, distanceFromMouse) * uIntensity;
        
        vec2 displacementVector = vec2(
          cos(uTime * 2.0 + vUv.x * 10.0) * 0.02,
          sin(uTime * 2.0 + vUv.y * 10.0) * 0.02
        );
        
        vec4 displacement = texture2D(uDisplacementMap, displacementUv + displacementVector);
        vec2 distortedUv = vUv + displacement.r * distortionStrength * (uMousePos - vUv);
        
        gl_FragColor = texture2D(uTexture, distortedUv);
      }
    `
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  container.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
    gsap.to(material.uniforms.uMousePos.value, {
      duration: 2,
      x: (event.clientX / container.offsetWidth),
      y: 1 - (event.clientY / container.offsetHeight),
      ease: "power2.out"
    });
}

function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value += 0.01;
  renderer.render(scene, camera);
}

export function initImageDistortion() {
  init();
  animate();
}