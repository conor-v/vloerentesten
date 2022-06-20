import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import CustomTextureLoader from "../CustomTextureLoader";

// Components
import SceneFloor from "../SceneFloor";

const CanvasFloor = () => {
  const [type, setType] = useState(localStorage.getItem("screenType"));
  return (
    <>
      <Canvas shadows camera={{ position: type === "floor" ? [0, 5, 0] : [0, 5, 10] }}>
        <Suspense
          fallback={
            <Html>
              <h1>Loading...</h1>
            </Html>
          }
        >
          <SceneFloor />
          <CustomTextureLoader />
        </Suspense>
      </Canvas>
    </>
  );
};

export default CanvasFloor;
