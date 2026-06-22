/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const seededRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const latLonToVector3 = (radius, lat, lon) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.22, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.44, 'rgba(255,105,33,0.52)');
  gradient.addColorStop(1, 'rgba(255,105,33,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createOrbitLine = (radius, y, material) => {
  const points = [];
  const ringRadius = Math.sqrt(radius * radius - y * y);
  for (let i = 0; i <= 240; i += 1) {
    const angle = (i / 240) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        y,
        Math.sin(angle) * ringRadius,
      ),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
};

const createGreatCircle = (radius, rotation, material) => {
  const line = createOrbitLine(radius, 0, material);
  line.rotation.set(
    THREE.MathUtils.degToRad(rotation.x),
    THREE.MathUtils.degToRad(rotation.y),
    THREE.MathUtils.degToRad(rotation.z),
  );
  return line;
};

const createRouteLine = (from, to, radius, altitude, material) => {
  const points = [];
  for (let i = 0; i <= 110; i += 1) {
    const t = i / 110;
    const point = from
      .clone()
      .lerp(to, t)
      .normalize()
      .multiplyScalar(radius + Math.sin(Math.PI * t) * altitude);
    points.push(point);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
};

const nodeData = [
  { lat: 37.8, lon: -122.4, color: 0xff5a1f, scale: 0.112 },
  { lat: 40.7, lon: -74.0, color: 0xff6a21, scale: 0.098 },
  { lat: 51.5, lon: -0.1, color: 0xff7d3f, scale: 0.092 },
  { lat: 35.6, lon: 139.7, color: 0xff6a21, scale: 0.112 },
  { lat: 1.3, lon: 103.8, color: 0xff5a1f, scale: 0.096 },
  { lat: -33.9, lon: 151.2, color: 0xff6a21, scale: 0.102 },
  { lat: 48.8, lon: 2.3, color: 0xff6a21, scale: 0.094 },
  { lat: 22.3, lon: 114.2, color: 0xff7d3f, scale: 0.088 },
  { lat: 19.4, lon: -99.1, color: 0xff7d3f, scale: 0.082 },
  { lat: 52.5, lon: 13.4, color: 0xff6a21, scale: 0.08 },
  { lat: -23.5, lon: -46.6, color: 0xff6a21, scale: 0.086 },
];

const routePairs = [
  [0, 3, 0.48, 0xff5a1f],
  [1, 4, 0.38, 0xff6a21],
  [2, 5, 0.55, 0xff7d3f],
  [6, 3, 0.34, 0xff6a21],
  [0, 7, 0.46, 0xff5a1f],
  [8, 4, 0.4, 0xff8a4a],
  [9, 10, 0.52, 0xff7d3f],
  [1, 5, 0.42, 0xff6a21],
];

const greatCircles = [
  { x: 90, y: 0, z: 0 },
  { x: 90, y: 0, z: 18 },
  { x: 90, y: 0, z: 36 },
  { x: 90, y: 0, z: 54 },
  { x: 90, y: 0, z: 72 },
  { x: 90, y: 0, z: 90 },
  { x: 66, y: 18, z: -22 },
  { x: 74, y: -28, z: 34 },
  { x: 52, y: 38, z: 72 },
  { x: 112, y: 12, z: -48 },
];

const ModelGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.02, 6.55);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.16, -0.54, 0.03);
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 1.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-3.6, 4.8, 5.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffefe6, 0.78);
    fillLight.position.set(3.4, 1.8, 4.6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xecedf5, 1.25);
    rimLight.position.set(4, 0.2, 3);
    scene.add(rimLight);

    const radius = 2.18;
    const globeGeometry = new THREE.SphereGeometry(radius, 128, 128);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f8f5,
      emissive: 0xf7f4ef,
      emissiveIntensity: 0.18,
      metalness: 0.02,
      roughness: 0.44,
      transmission: 0.03,
      transparent: true,
      opacity: 0.72,
      clearcoat: 0.74,
      clearcoatRoughness: 0.22,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    group.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.024, 128, 128),
      new THREE.MeshBasicMaterial({
        color: 0xf4f3f0,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    );
    group.add(atmosphere);

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0xc7ccd5,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    const fineGridMaterial = new THREE.LineBasicMaterial({
      color: 0xd9dce2,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });

    [
      -1.82, -1.48, -1.08, -0.72, -0.36, 0, 0.36, 0.72, 1.08, 1.48, 1.82,
    ].forEach((y) => {
      group.add(createOrbitLine(radius * 1.004, y, fineGridMaterial));
    });

    greatCircles.forEach((rotation, index) => {
      group.add(
        createGreatCircle(
          radius * (index < 6 ? 1.006 : 1.016),
          rotation,
          index < 6 ? gridMaterial : fineGridMaterial,
        ),
      );
    });

    const dotPositions = [];
    const dotColors = [];
    const color = new THREE.Color();
    for (let i = 0; i < 620; i += 1) {
      const lat = (seededRandom(i + 1) - 0.5) * 150;
      const lon = (seededRandom(i + 900) - 0.5) * 360;
      const dot = latLonToVector3(radius * 1.014, lat, lon);
      dotPositions.push(dot.x, dot.y, dot.z);
      const warmth = seededRandom(i + 1800);
      color
        .set(warmth > 0.83 ? 0xff9a68 : 0x8b94a3)
        .multiplyScalar(warmth > 0.83 ? 1 : 0.85 + warmth * 0.18);
      dotColors.push(color.r, color.g, color.b);
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(dotPositions, 3),
    );
    dotGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(dotColors, 3),
    );
    const dots = new THREE.Points(
      dotGeometry,
      new THREE.PointsMaterial({
        size: 0.012,
        vertexColors: true,
        transparent: true,
        opacity: 0.36,
        depthWrite: false,
      }),
    );
    group.add(dots);

    const nodeTexture = createGlowTexture();
    const nodeVectors = nodeData.map(({ lat, lon }) =>
      latLonToVector3(radius * 1.035, lat, lon),
    );

    routePairs.forEach(([fromIndex, toIndex, altitude, color]) => {
      group.add(
        createRouteLine(
          nodeVectors[fromIndex],
          nodeVectors[toIndex],
          radius * 1.04,
          altitude,
          new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
    });

    nodeData.forEach(({ color, scale }, index) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: nodeTexture,
          color,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      sprite.position.copy(nodeVectors[index]);
      sprite.scale.setScalar(scale * 3.25);
      group.add(sprite);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(scale, 24, 24),
        new THREE.MeshBasicMaterial({ color, toneMapped: false }),
      );
      core.position.copy(nodeVectors[index]);
      group.add(core);
    });

    const dragState = {
      active: false,
      x: 0,
      y: 0,
      targetX: group.rotation.x,
      targetY: group.rotation.y,
    };

    const onPointerDown = (event) => {
      dragState.active = true;
      dragState.x = event.clientX;
      dragState.y = event.clientY;
      mount.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragState.active) return;
      const deltaX = event.clientX - dragState.x;
      const deltaY = event.clientY - dragState.y;
      dragState.x = event.clientX;
      dragState.y = event.clientY;
      dragState.targetY += deltaX * 0.006;
      dragState.targetX = clamp(
        dragState.targetX + deltaY * 0.004,
        -0.74,
        0.42,
      );
    };

    const onPointerUp = (event) => {
      dragState.active = false;
      mount.releasePointerCapture?.(event.pointerId);
    };

    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(width));
      const nextHeight = Math.max(1, Math.floor(height));
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      if (!dragState.active) {
        dragState.targetY += 0.00105;
      }
      group.rotation.x += (dragState.targetX - group.rotation.x) * 0.08;
      group.rotation.y += (dragState.targetY - group.rotation.y) * 0.08;
      group.rotation.z = 0.035 + Math.sin(elapsed * 0.32) * 0.025;
      atmosphere.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.006);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      group.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      nodeTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className='globe-canvas' aria-hidden='true' />;
};

export default ModelGlobe;
