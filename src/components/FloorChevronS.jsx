import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FloorChevronS = () => {
  const { nodes, materials } = useGLTF("plank/chevron-transformed.glb");
  const geometry = nodes.Cube.geometry;
  const [instance, setInstance] = useState();
  const instRef = useRef();

  useEffect(() => {
    createObject();
  }, []);

  useLayoutEffect(() => {
    if (!instRef.current) return;
    instRef.current.children.forEach((inst) => {
      let posY = { y: inst.position.y };
      const delay = 500 * Math.random();
      const tween = new TWEEN.Tween(posY)
        .to({ y: 0 }, 700)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          inst.position.y = posY.y;
        });
      tween.delay(delay);
      tween.start();
    });
  }, [instance]);

  const createObject = () => {
    const instances = [];
    for (let index = 0; index < 10; index++) {
      for (let i = 0; i < 50; i++) {
        instances.push(
          <Instance
            key={index + 1 * i + 1 * Math.random()}
            position={[-1.95359 + 7.8143 * index, 20, 1.4152 * i]}
            rotation={[0, -Math.PI / 4, 0]}
          />
        );
        instances.push(
          <Instance
            key={index + 1 * i + 1 * Math.random()}
            position={[1.95359 + 7.8143 * index, 20, 1.4152 * i]}
            rotation={[-Math.PI, -Math.PI / 4, 0]}
          />
        );
      }
    }

    const instance = (
      <Instances ref={instRef} geometry={geometry}>
        <meshStandardMaterial color="red" />
        {instances.map((inst) => inst)}
      </Instances>
    );

    setInstance(instance);
  };

  useFrame((state) => {
    TWEEN.update();
  });

  return (
    <>
      <group rotation={[0, Math.PI, 0]}>{instance}</group>
    </>
  );
};

export default FloorChevronS;
