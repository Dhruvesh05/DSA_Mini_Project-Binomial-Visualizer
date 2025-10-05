import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

// Animated Cube Component
function Cube({ position, height, isSelected }) {
  const meshRef = useRef();

  // Smooth oscillating animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.scale.y = height * (0.7 + 0.3 * Math.sin(t + position[2]));
      meshRef.current.position.y = (meshRef.current.scale.y * height) / 2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={isSelected ? "orange" : `hsl(${(height / 3) * 240}, 80%, 50%)`}
        metalness={0.7}
        roughness={0.2}
        emissive={isSelected ? "orange" : "black"}
        emissiveIntensity={isSelected ? 0.9 : 0}
      />
      {isSelected && (
        <Html distanceFactor={10}>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.7)",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Selected
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Particle effect on max coefficient
function Particle({ position }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.8} />
    </mesh>
  );
}

export default function BinomialPyramid({ n, k }) {
  const [triangle, setTriangle] = useState([]);

  useEffect(() => {
    const t = [];
    for (let i = 0; i <= n; i++) {
      const row = [];
      for (let j = 0; j <= i; j++) {
        row.push(j === 0 || j === i ? 1 : t[i - 1][j - 1] + t[i - 1][j]);
      }
      t.push(row);
    }
    setTriangle(t);
  }, [n]);

  const maxVal = Math.max(...triangle.flat());

  return (
    <Canvas
      shadows
      style={{ height: "600px", width: "100%" }}
      camera={{ position: [0, n * 0.8, n * 1.5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls enablePan enableZoom autoRotate autoRotateSpeed={0.2} />

      {triangle.map((row, i) =>
        row.map((val, j) => (
          <Cube
            key={`${i}-${j}`}
            position={[j - i / 2, val / 2, -i]}
            height={(val / maxVal) * 3 + 0.5}
            isSelected={i === n && j === k}
          />
        ))
      )}

      {triangle.length > 0 && (
        <Particle position={[k - n / 2, ((triangle[n][k] / maxVal) * 3 + 0.5) / 2, -n]} />
      )}
    </Canvas>
  );
}
