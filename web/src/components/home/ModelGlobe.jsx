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

const latLonToVector3 = (radius, lat, lon) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const createSeededRandom = (seed = 7) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,0.96)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.86)');
  gradient.addColorStop(0.42, 'rgba(255,113,42,0.24)');
  gradient.addColorStop(0.72, 'rgba(255,128,70,0.08)');
  gradient.addColorStop(1, 'rgba(255,105,33,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createRadialDotTexture = (
  inner = 'rgba(255,255,255,1)',
  outer = 'rgba(89,102,120,0)',
) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 32);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.38, inner);
  gradient.addColorStop(1, outer);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createOrbitLine = (radius, y, material) => {
  const points = [];
  const ringRadius = Math.sqrt(radius * radius - y * y);
  for (let i = 0; i <= 180; i += 1) {
    const angle = (i / 180) * Math.PI * 2;
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

const createTiltedGreatCircle = (
  radius,
  rotation,
  material,
  segments = 300,
) => {
  const points = [];
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(rotation.x),
    THREE.MathUtils.degToRad(rotation.y),
    THREE.MathUtils.degToRad(rotation.z),
  );
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ).applyEuler(euler),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
};

const createFibonacciPoints = (count, radius) => {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ringRadius * radius,
        y * radius,
        Math.sin(theta) * ringRadius * radius,
      ),
    );
  }

  return points;
};

const createSurfaceNetwork = (points, radius, material) => {
  const positions = [];
  const connected = new Set();

  points.forEach((point, pointIndex) => {
    const nearest = points
      .map((candidate, candidateIndex) => ({
        candidate,
        candidateIndex,
        distance: point.distanceTo(candidate),
      }))
      .filter(
        ({ candidateIndex, distance }) =>
          candidateIndex !== pointIndex && distance < 0.36,
      )
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);

    nearest.forEach(({ candidate, candidateIndex }) => {
      const edgeKey =
        pointIndex < candidateIndex
          ? `${pointIndex}-${candidateIndex}`
          : `${candidateIndex}-${pointIndex}`;
      if (connected.has(edgeKey)) return;
      connected.add(edgeKey);

      let previous = point.clone().normalize().multiplyScalar(radius);
      for (let segment = 1; segment <= 5; segment += 1) {
        const next = point
          .clone()
          .lerp(candidate, segment / 5)
          .normalize()
          .multiplyScalar(radius);
        positions.push(
          previous.x,
          previous.y,
          previous.z,
          next.x,
          next.y,
          next.z,
        );
        previous = next;
      }
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return new THREE.LineSegments(geometry, material);
};

const createRouteLine = (from, to, radius, altitude, material) => {
  const points = [];
  for (let i = 0; i <= 70; i += 1) {
    const t = i / 70;
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
  { lat: 55, lon: -124, color: 0xff5a1f, scale: 0.12 },
  { lat: 39, lon: -104, color: 0xff6a21, scale: 0.1 },
  { lat: 51.5, lon: -0.1, color: 0xff7d3f, scale: 0.1 },
  { lat: 44, lon: 20, color: 0xff6a21, scale: 0.09 },
  { lat: 36, lon: 42, color: 0xff6a21, scale: 0.09 },
  { lat: 35.6, lon: 139.7, color: 0xff6a21, scale: 0.12 },
  { lat: 31.2, lon: 121.5, color: 0xff5a1f, scale: 0.09 },
  { lat: 24, lon: 113, color: 0xff7d3f, scale: 0.09 },
  { lat: 1.3, lon: 103.8, color: 0xff5a1f, scale: 0.1 },
  { lat: -12, lon: -46, color: 0xff6a21, scale: 0.09 },
  { lat: -33.9, lon: 151.2, color: 0xff6a21, scale: 0.12 },
  { lat: -25, lon: 28, color: 0xff6a21, scale: 0.1 },
  { lat: 18, lon: 78, color: 0xff7d3f, scale: 0.09 },
  { lat: 62, lon: 100, color: 0xff6a21, scale: 0.11 },
];

const routePairs = [
  [0, 5, 0.52, 0xff5a1f],
  [1, 8, 0.42, 0xff6a21],
  [2, 10, 0.62, 0xff7d3f],
  [3, 5, 0.32, 0xff6a21],
  [6, 11, 0.5, 0xff5a1f],
  [4, 12, 0.36, 0xff6a21],
  [8, 13, 0.44, 0xff7d3f],
  [0, 9, 0.58, 0xff5a1f],
];

const ModelGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, 0.08, 7.9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.18, -0.6, 0.03);
    group.scale.setScalar(0.92);
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-3.4, 4.4, 4.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf7f8fc, 1.35);
    rimLight.position.set(4, 0.2, 3);
    scene.add(rimLight);

    const radius = 2.12;
    const globeGeometry = new THREE.SphereGeometry(radius, 128, 128);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf9fcfc,
      emissive: 0x10212c,
      emissiveIntensity: 0.025,
      metalness: 0.02,
      roughness: 0.52,
      transmission: 0.04,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      clearcoat: 0.6,
      clearcoatRoughness: 0.28,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    group.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.018, 128, 128),
      new THREE.MeshBasicMaterial({
        color: 0xf1f2f7,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    );
    group.add(atmosphere);

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0xcfd3dc,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    });

    const networkMaterial = new THREE.LineBasicMaterial({
      color: 0xd9dde5,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });

    const fiberMaterial = new THREE.LineBasicMaterial({
      color: 0xcfd4de,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });

    const routeMaterialBase = {
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    };

    for (let y = -1.86; y <= 1.87; y += 0.17) {
      group.add(createOrbitLine(radius * 1.015, y, gridMaterial));
    }

    for (let rotation = 0; rotation < 180; rotation += 7.5) {
      const line = createOrbitLine(radius * 1.016, 0, gridMaterial);
      line.rotation.x = Math.PI / 2;
      line.rotation.z = THREE.MathUtils.degToRad(rotation);
      group.add(line);
    }

    [
      { x: 12, y: 0, z: 18 },
      { x: -16, y: 22, z: 48 },
      { x: 26, y: -12, z: 78 },
      { x: -32, y: -18, z: 112 },
      { x: 42, y: 18, z: 146 },
      { x: 62, y: -28, z: 166 },
      { x: -58, y: 34, z: 205 },
      { x: 18, y: 52, z: 238 },
      { x: -22, y: -46, z: 274 },
      { x: 50, y: 42, z: 312 },
      { x: -48, y: 10, z: 338 },
    ].forEach((rotation) => {
      group.add(
        createTiltedGreatCircle(radius * 1.022, rotation, fiberMaterial),
      );
    });

    const networkPoints = createFibonacciPoints(620, radius * 1.026);
    group.add(
      createSurfaceNetwork(networkPoints, radius * 1.026, networkMaterial),
    );

    const dotPositions = [];
    const random = createSeededRandom(42);
    for (let i = 0; i < 620; i += 1) {
      const u = random() * 2 - 1;
      const lat = THREE.MathUtils.radToDeg(Math.asin(u)) * 0.92;
      const lon = random() * 360 - 180;
      const dot = latLonToVector3(radius * 1.012, lat, lon);
      dotPositions.push(dot.x, dot.y, dot.z);
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(dotPositions, 3),
    );
    const greyDotTexture = createRadialDotTexture(
      'rgba(93,103,118,0.75)',
      'rgba(93,103,118,0)',
    );
    const dots = new THREE.Points(
      dotGeometry,
      new THREE.PointsMaterial({
        color: 0x596678,
        map: greyDotTexture,
        alphaTest: 0.02,
        size: 0.022,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      }),
    );
    group.add(dots);

    const outerDotPositions = [];
    const outerRandom = createSeededRandom(314);
    for (let i = 0; i < 560; i += 1) {
      const u = outerRandom() * 2 - 1;
      const lat = THREE.MathUtils.radToDeg(Math.asin(u));
      const lon = outerRandom() * 360 - 180;
      const shellRadius =
        radius *
        THREE.MathUtils.lerp(1.045, 1.15, Math.pow(outerRandom(), 0.72));
      const dot = latLonToVector3(shellRadius, lat, lon);
      outerDotPositions.push(dot.x, dot.y, dot.z);
    }

    const outerDotGeometry = new THREE.BufferGeometry();
    outerDotGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(outerDotPositions, 3),
    );
    const outerParticles = new THREE.Points(
      outerDotGeometry,
      new THREE.PointsMaterial({
        color: 0x7e8795,
        map: greyDotTexture,
        alphaTest: 0.02,
        size: 0.023,
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
        depthTest: false,
      }),
    );
    group.add(outerParticles);

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
            ...routeMaterialBase,
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
          opacity: 0.48,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      sprite.position.copy(nodeVectors[index]);
      sprite.scale.setScalar(scale * 2.25);
      group.add(sprite);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(scale * 0.42, 20, 20),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.82,
          depthWrite: false,
          depthTest: false,
          toneMapped: false,
        }),
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
        dragState.targetY += 0.00125;
      }
      group.rotation.x += (dragState.targetX - group.rotation.x) * 0.08;
      group.rotation.y += (dragState.targetY - group.rotation.y) * 0.08;
      group.rotation.z = 0.035 + Math.sin(elapsed * 0.32) * 0.025;
      atmosphere.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.006);
      outerParticles.rotation.y = elapsed * 0.018;
      outerParticles.rotation.x = Math.sin(elapsed * 0.2) * 0.015;
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
      greyDotTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className='globe-canvas' aria-hidden='true' />;
};

export default ModelGlobe;
