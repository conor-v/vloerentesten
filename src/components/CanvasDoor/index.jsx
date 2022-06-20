import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

// Components
import SceneDoor from "../SceneDoor";

const CanvasDoor = () => {
  const [type, setType] = useState(localStorage.getItem("screenType"));
  return (
    <Canvas
      shadows
      camera={{ position: type === "floor" ? [0, 5, 0] : [0, 0, 10] }}
      onCreated={({ gl }) => {
        gl.physicallyCorrectLights = true;
        gl.toneMappingExposure = 1;
      }}
    >
      <Suspense
        fallback={
          <Html>
            <h1>Loading...</h1>
          </Html>
        }
      >
        <SceneDoor />
      </Suspense>
    </Canvas>
  );
};

export default CanvasDoor;
