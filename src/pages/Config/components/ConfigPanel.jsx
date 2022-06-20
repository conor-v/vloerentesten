import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useSocketIo from "../../../hooks/useSocketIo";

import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left.svg";
import { ReactComponent as ArrowBarLeft } from "../../../assets/arrow-bar-left.svg";
import { ReactComponent as ArrowBarRight } from "../../../assets/arrow-bar-right.svg";
import FloorConfig from "./FloorConfig";
import DoorConfig from "./DoorConfig";

const ConfigPanel = ({ configurator }) => {
  let navigate = useNavigate();
  const [maxWidth, setMaxWidth] = useState(500);
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;

  useEffect(() => {
    if (socket && inRoom) {
      socket.emit("configurator change", { configurator }, localStorage.getItem("room"));
      return () => {
        socket?.disconnect();
      };
    }
  }, [socket]);

  console.log(socket)

  return (
    <>
      <ConfigPanelWrapper maxWidth={maxWidth}>
        <Header>
          <BackButton onClick={() => navigate("/filters")}>
            <ArrowLeft />
            Instellingen
          </BackButton>
        </Header>
        {configurator === "floor" && <FloorConfig socket={socket} />}
        {configurator === "door" && <DoorConfig socket={socket} />}
        {configurator === "closet" && (
          <>
            <h4>Kast</h4>
          </>
        )}
      </ConfigPanelWrapper>
    </>
  );
};

const ConfigPanelWrapper = styled.div`
  position: relative;
  height: 100vh;
  width: ${({ maxWidth }) => maxWidth}px;
  min-width: ${({ maxWidth }) => maxWidth}px;
  background-color: #ffffff;
  transition: width 0.4s ease-in-out, min-width 0.4s ease-in-out;
  overflow-y: auto;
  margin-left: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  margin-right: 0.5rem;
  svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const OpenConfig = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0.5rem;
  background-color: white;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

export default ConfigPanel;
