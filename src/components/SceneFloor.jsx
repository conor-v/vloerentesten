import { useEffect, useRef } from "react";
import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Vector2 } from "three";
import { useStore } from "../store/store";

// Components
import Camera from "./Camera";
import FloorPlanks from "./FloorPlanks.jsx";
import FloorHerringbone from "./FloorHerringbone";
import FloorChevronS from "./FloorChevronS";
import FloorChevronL from "./FloorChevronL";

const SceneFloor = () => {
  const lightRef = useRef();
  const { camera } = useThree();
  const textures = useStore((store) => store.scene.textures);
  const selectedFloor = useStore((store) => store.selectedFloor);
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.mapSize = new Vector2(1024, 1024);
    }
    camera.position.x = -4;
    camera.position.y = 10;
    camera.position.z = 5;
  }, [lightRef]);

  return (
    <>
      {textures.length > 0 && selectedFloor.pattern === "planks" && <FloorPlanks />}
      {textures.length > 0 && selectedFloor.pattern === "visgraat" && <FloorHerringbone />}
      {textures.length > 0 && selectedFloor.pattern === "chevronS" && <FloorChevronS />}
      {textures.length > 0 && selectedFloor.pattern === "chevronL" && <FloorChevronL />}
      <Camera scene="floor" />
      <Environment preset="apartment" />
      <pointLight ref={lightRef} castShadow position={[0, 40, 0]} intensity={0.1} power={2} />
      <mesh scale={[140, 0.5, 140]} position={[0, -1.5, 0]} receiveShadow>
        <boxGeometry />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </>
  );
};

export default SceneFloor;
