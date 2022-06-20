import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";
import { useFrame } from "@react-three/fiber";

export default function Model({ frame, open }) {
  const { nodes, materials } = useGLTF("doors/40Line-transformed.glb");
  materials["Material_1.002"].color = new Color("black");
  materials["Material_2.002"].color = new Color("#a9ecff");
  const doorRef = useRef();

  useEffect(() => {
    openDoor();
  }, [open, doorRef]);

  const openDoor = () => {
    if (doorRef.current) {
      let rotY = { y: doorRef.current.rotation.z };
      const tween = new TWEEN.Tween(rotY)
        .to({ y: open ? Math.PI * 0.55 : 0 }, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          doorRef.current.rotation.z = rotY.y;
        });
      tween.delay(100);
      tween.start();
    }
  };

  useFrame((state) => {
    TWEEN.update();
  });

  return (
    <group position={[0, 5, 0]} rotation={[0, Math.PI, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.02}>
        {frame && (
          <mesh geometry={nodes["2020-079-1-1"].geometry} material={materials["Material_1.002"]} />
        )}
        <group ref={doorRef} position={[-42, 5, 0]}>
          <group position={[42, -5, 0]}>
            <group position={[0, 1.3, 0]}>
              <mesh
                geometry={nodes["2020-079-1-3"].geometry}
                material={materials["Material_2.002"]}
              />
            </group>
            <group position={[0, 2.1, 0]}>
              <mesh
                geometry={nodes["2020-079-1-4"].geometry}
                material={materials["Material_1.002"]}
              />
            </group>
            <group position={[40.65, -1.8, -1.15]} rotation={[0, 0, Math.PI / 2]}>
              <mesh
                geometry={nodes["2020-079-1-5"].geometry}
                material={materials["Material_1.002"]}
              />
            </group>
            <group position={[40.65, 6.6, -1.15]} rotation={[Math.PI, 0, Math.PI / 2]}>
              <mesh
                geometry={nodes["2020-079-1-5001"].geometry}
                material={materials["Material_1.002"]}
              />
            </group>
            <group position={[0, 0.7, 0]}>
              <mesh
                geometry={nodes["2020-079-2"].geometry}
                material={materials["Material_1.002"]}
              />
            </group>
            <group position={[-44.99, 4.85, -89.85]} rotation={[Math.PI / 2, -1.57, 0]}>
              <group position={[-0.2, 0.9, -2.52]} rotation={[0, -0.51, 0]}>
                <mesh
                  geometry={nodes.kółko_zawiasu_małego001.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, 5.45, -2.52]} rotation={[0, 0.34, 0]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały001.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]} rotation={[0, 0, Math.PI]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały003.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]}>
                <mesh
                  geometry={nodes.zawias_mały002.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
            </group>
            <group position={[-44.99, 4.85, -69.85]} rotation={[Math.PI / 2, -1.57, 0]}>
              <group position={[-0.2, 0.9, -2.52]} rotation={[0, -0.51, 0]}>
                <mesh
                  geometry={nodes.kółko_zawiasu_małego003.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, 5.45, -2.52]} rotation={[0, 0.34, 0]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały005.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]} rotation={[0, 0, Math.PI]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały007.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]}>
                <mesh
                  geometry={nodes.zawias_mały005.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
            </group>
            <group position={[-44.99, 4.85, 87.85]} rotation={[Math.PI / 2, -1.57, 0]}>
              <group position={[-0.2, 0.9, -2.52]} rotation={[0, -0.51, 0]}>
                <mesh
                  geometry={nodes.kółko_zawiasu_małego005.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, 5.45, -2.52]} rotation={[0, 0.34, 0]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały009.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]} rotation={[0, 0, Math.PI]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały011.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]}>
                <mesh
                  geometry={nodes.zawias_mały008.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
            </group>
            <group position={[-44.99, 4.85, -33.85]} rotation={[Math.PI / 2, -1.57, 0]}>
              <group position={[-0.2, 0.9, -2.52]} rotation={[0, -0.51, 0]}>
                <mesh
                  geometry={nodes.kółko_zawiasu_małego007.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, 5.45, -2.52]} rotation={[0, 0.34, 0]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały013.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]} rotation={[0, 0, Math.PI]}>
                <mesh
                  geometry={nodes.zaslepka_zawias_mały015.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
              <group position={[-0.2, -3.45, -2.52]}>
                <mesh
                  geometry={nodes.zawias_mały011.geometry}
                  material={materials["Material_3.001"]}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/40Line-transformed.glb");
