import styled from "styled-components";
import { useState } from "react";
import { useStore } from "../../store/store";

const ViewSwitch = ({socket}) => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const showRoom = useStore((store) => store.config.showRoom);
  const updateObject = useStore((state) => state.updateObject);

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
      <RoomSwitch
        onClick={() => {
          updateObject("config", "refresh", Math.random() * 1000000 + 1);
        }}
      >
        <Left active={!showRoom} onClick={() => handleValueUpdate("config", "showRoom", false)}>
          Vloer
        </Left>
        <Right active={showRoom} onClick={() => handleValueUpdate("config", "showRoom", true)}>
          Kamer
        </Right>
      </RoomSwitch>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  right: 30px;
  top: 30px;
  z-index: 11;
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
  transition: 0.5s;

  &:hover {
    background-color: ${({ active }) => (active ? "#9f4414" : "#d1d1d1")};
  }
`;
const Right = styled(Left)``;

export default ViewSwitch;
