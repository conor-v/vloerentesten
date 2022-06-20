import { useState } from "react";
import styled from "styled-components";
import useSocketIo from "../../hooks/useSocketIo";
import { useStore } from "../../store/store";

const Switch = () => {
  const showRoom = useStore((store) => store.config.showRoom);
  const updateObject = useStore((store) => store.updateObject);
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;

  const handleValueUpdate = (object, field, value) => {
    updateObject(object, field, value);
    if (!inRoom) return;
    socket.emit("active", {
      status: "active",
    });
    socket.emit("store change", { object, field, value });
  };

  return (
    <Wrapper>
      <RoomSwitch>
        <Left
          active={!showRoom}
          onClick={() => (!showRoom ? null : handleValueUpdate("config", "showRoom", false))}
        >
          Vloer
        </Left>
        <Right
          active={showRoom}
          onClick={() => (showRoom ? null : handleValueUpdate("config", "showRoom", true))}
        >
          Kamer
        </Right>
      </RoomSwitch>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
  z-index: 1;
`;

const RoomSwitch = styled.div`
  width: 250px;
  height: 60px;
  background-color: white;
  display: flex;
  cursor: pointer;
`;
const Left = styled.div`
  background-color: ${({ active }) => (active ? "#bb5018" : "#EAEAEA")};
  color: ${({ active }) => (active ? "#ffffff" : "#000000")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex: 1 1 50%;
  text-transform: uppercase;
  font-weight: 500;
  transition: .5s;

  &:hover {
    background-color: ${({ active }) => (active ? "#9f4414" : "#d1d1d1")}; 
  }
`;
const Right = styled(Left)``;

export default Switch;
