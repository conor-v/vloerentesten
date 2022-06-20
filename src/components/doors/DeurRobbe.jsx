import React from "react";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../../store/store";

const DeurRobbe = () => {
  const { nodes, materials } = useGLTF("doors/deur-robbe.glb");
  const doorOpenValue = useStore((state) => state.config.doorOpenValue);
  return (
    <group scale={2} castShadow>
      <mesh castShadow geometry={nodes.Frame.geometry} material={materials.mat_door} />
      <mesh
        castShadow
        geometry={nodes.Door.geometry}
        material={materials.mat_door}
        position={[1.06, -0.05, 0.05]}
        rotation={[0, doorOpenValue, 0]}
        scale={[1, 1, 0.72]}
      />
      <mesh
        castShadow
        geometry={nodes.Hinges.geometry}
        material={materials.mat_door}
        position={[1.06, -0.01, 0.05]}
      />
    </group>
  );
};

export default DeurRobbe;
