import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import useSocketIo from "../hooks/useSocketIo";
import { Euler } from "three";

const Camera = ({ scene }) => {
  const { camera } = useThree();
  const cameraRef = useRef();
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [isScreen, setIsScreen] = useState(localStorage.getItem("device") === "screen");
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;

  // if the client is a screen and in a socketroom, listen for socket events to move camera
  useEffect(() => {
    if (socket && inRoom) {
      if (localStorage.getItem("screenType") === "floor") return;
      if (!isScreen) return;
      socket.on("camera change", (data) => {
        const { x, y, z } = data.cameraPosition;
        camera.position.setX(x);
        camera.position.setY(y);
        camera.position.setZ(z);
        const { rotX, rotY, rotZ } = data.cameraRotation;
        const rotation = new Euler(rotX, rotY, rotZ, "XYZ");
        camera.rotation.set(rotation);
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, [socket]);

  let time = 0;

  // if the client is in a room, send emit a socket event when the camera changes
  const handleOrbitChange = (e) => {
    if (!inRoom) return;
    time++;
    socket.emit("camera change", {
      cameraPosition: e.target.object.position,
      cameraRotation: e.target.object.rotation,
    });
    // emit active event so standby doesnt turn on
    if (time === 60) {
      socket.emit("active", {
        status: "active",
      });
      time = 0;
    }
  };
  const settings = {
    floor: {
      maxDistance: 60,
      minDistance: 2,
      maxPolarAngle: Math.PI * 0.45,
      target: [0, 0, 0],
    },
    door: {
      maxDistance: 60,
      minDistance: 2,
      maxPolarAngle: Math.PI * 0.65,
      target: [0, 0, 0],
      enabled: false,
    },
  };
  return (
    <>
      <OrbitControls
        {...settings[scene]}
        ref={cameraRef}
        makeDefault
        onChange={(e) => {
          if (localStorage.getItem("device") === "config") {
            handleOrbitChange(e);
          }
        }}
      />
      <PerspectiveCamera fov={50} />
    </>
  );
};

export default Camera;
