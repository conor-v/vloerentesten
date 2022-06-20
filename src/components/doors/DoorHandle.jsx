import React from "react";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../../store/store";

const DoorHandle = () => {
  const { nodes, materials } = useGLTF("doors/doorhandle.glb");
  const doorOpenValue = useStore((state) => state.config.doorOpenValue);

  return (
    <group scale={[2.2, 2.2, 2.2]} position={[0, 0.3, 0]}>
      <group rotation={[0, -doorOpenValue, 0]} position={[1.01, 0.02, -0.05]}>
        <group rotation={[-Math.PI / 2, -1.57, 0]} scale={[0.1, 0.01, 0.1]} castShadow>
          <mesh
            geometry={nodes.Cylinder001.geometry}
            material={materials["Aluminium Ani.001"]}
            castShadow
          />
          <mesh
            geometry={nodes.Cylinder001_1.geometry}
            material={materials["Aluminium.001"]}
            castShadow
          />
          <mesh
            geometry={nodes.Cylinder001_2.geometry}
            material={materials["Matt Black.001"]}
            castShadow
          />
          <mesh
            geometry={nodes.Cylinder001_3.geometry}
            material={materials["Aluminium Ani"]}
            castShadow
          />
          <mesh geometry={nodes.Cylinder001_4.geometry} material={materials.Aluminium} castShadow />
          <mesh
            geometry={nodes.Cylinder001_5.geometry}
            material={materials["Matt Black"]}
            castShadow
          />
        </group>
      </group>
    </group>
  );
};

export default DoorHandle;
