import React, { useEffect, useState } from "react";
import useSocketIo from "../../hooks/useSocketIo";
import { useStore } from "../../store/store";
import CanvasFloor from "../../components/CanvasFloor";
import CanvasDoor from "../../components/CanvasDoor";
import Video from "../../assets/video.mp4";
import Overlay from "../../components/Overlay";
import PictureMode from "../../components/PictureMode";
import ScreenRoomView from "../../components/ScreenRoomView";
import styled from "styled-components";

const Screen = () => {
  const socket = useSocketIo(localStorage.getItem("room"));
  const [configurator, setConfigurator] = useState("floor");
  const updateObject = useStore((store) => store.updateObject);
  const resetState = useStore((store) => store.resetState);
  const screenMode = useStore((store) => store.config.screenMode);
  const showRoom = useStore((store) => store.config.showRoom);
  const [inactive, setInactive] = useState(false);
  const [screenType, setScreenType] = useState(localStorage.getItem("screenType"));

  useEffect(() => {
    if (socket) {
      let interval;
      const startInterval = () => {
        if (screenType === "floor") return;
        interval = setInterval(() => {
          setInactive(true);
          clearInterval(interval);
        }, 60000000);
      };
      startInterval();
      socket.on("configurator change", (data) => {
        setConfigurator(data.configurator);
        resetState("config");
      });
      socket.on("store change", ({ object, field, value }) => {
        updateObject(object, field, value);
      });
      socket.on("active", () => {
        clearInterval(interval);
        interval = 0;
        setInactive(false);
        startInterval();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <>
      {inactive ? (
        <>
          <PauzeVideo width="100%" height="100%" autoPlay muted loop>
            <source src={Video} type="video/mp4" />
            Your browser does not support the video tag.
          </PauzeVideo>
        </>
      ) : (
        <>
          {configurator === "door" && <CanvasDoor />}
          {configurator === "closet" && <h1>Kast</h1>}
          {configurator === "floor" && showRoom === false && <CanvasFloor />}
          {configurator === "floor" && showRoom === true && <ScreenRoomView />}
        </>
      )}
      <Overlay />
    </>
  );
};

const PauzeVideo = styled.video`
  height: 100vh;
  background: #1C1B1B;
  overflow: hidden;
  position: absolute;
`;

export default Screen;
