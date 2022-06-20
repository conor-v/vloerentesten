import Camera from "./Camera";
import { useStore } from "../store/store";
import DoorPhotoshop from "./doors/DoorPhotoshop";
import DoorCremePhotoshop from "./doors/DoorCremePhotoshop";
import DoorHandle from "./doors/DoorHandle";
import { useEffect, useRef } from "react";

const SceneDoor = () => {
  const lightRef = useRef();
  const selectedDoor = useStore((store) => store.selectedDoor);
  const currentDoor = useStore((store) => store.config.currentDoor);
  const showBlackbg = useStore((store) => store.config.showBlackbg);
  useEffect(() => {
    if (lightRef.current) {
      // console.log(lightRef.current);
    }
  }, [lightRef]);
  return (
    <>
      {selectedDoor.id === 1 && <DoorPhotoshop />}
      {selectedDoor.id === 2 && <DoorCremePhotoshop />}
      {showBlackbg && (
        <>
          <mesh rotation={[0, 0, 0]} scale={[20, 11, 0.1]} position={[10 + 2.4, 0, 0]}>
            <planeGeometry />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh rotation={[0, 0, 0]} scale={[20, 11, 0.1]} position={[-10 - 2.4, 0, 0]}>
            <planeGeometry />
            <meshBasicMaterial color="black" />
          </mesh>
        </>
      )}

      <DoorHandle />
      <ambientLight intensity={1} />
      <directionalLight intensity={1.25} position={[30, 10, -30]} />
      <directionalLight intensity={1.25} position={[0, 10, 0]} />
      <directionalLight intensity={1.25} position={[-30, 10, 30]} />
      <pointLight ref={lightRef} castShadow position={[0, 10, 10]} intensity={0.1} power={100} />
      <Camera scene="door" />
    </>
  );
};

export default SceneDoor;
