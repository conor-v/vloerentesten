import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../../store/store";
import { useThree } from "@react-three/fiber";
import { Box3, Vector3 } from "three";

const DoorCremePhotoshop = () => {
  const { nodes, materials } = useGLTF("doors/door-creme-photoshop.glb");
  const doorOpenValue = useStore((state) => state.config.doorOpenValue);
  const frameRef = useRef();
  const doorRef = useRef();
  const { camera, size } = useThree();

  useEffect(() => {
    if (doorRef.current !== null) {
      // snippet -> https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f#file-gistfile1-js
      let dist = camera.position.z - doorRef.current.position.z;
      let box = new Box3().setFromObject(doorRef.current);
      const boxSize = box.getSize(new Vector3());
      let height = boxSize.y;
      camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
      camera.updateProjectionMatrix();
    }
  }, [doorRef]);

  return (
    <group ref={doorRef} scale={[2.2, 2.2, 2.2]} position={[0, 0.3, 0]}>
      <mesh
        rotation={[0, -doorOpenValue, 0]}
        position={[1.01, 0.02, -0.05]}
        geometry={nodes.Cube.geometry}
        material={materials["Material.002"]}
        receiveShadow
      />

      <mesh geometry={nodes.Cube001.geometry} material={materials.frameTexture} />
    </group>
  );
};

export default DoorCremePhotoshop;
