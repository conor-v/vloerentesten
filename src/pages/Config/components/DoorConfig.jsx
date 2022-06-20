import { useState } from "react";
import styled from "styled-components";

import { ReactComponent as ChevronDown } from "../../../assets/chevron-down.svg";
import { useStore } from "../../../store/store";

const DoorConfig = ({ socket }) => {
  const updateObject = useStore((store) => store.updateObject);
  const doorOpen = useStore((store) => store.config.doorOpen);
  const showFrame = useStore((store) => store.config.showFrame);
  const [doorBoxes, setDoorBoxes] = useState({ model: true });
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");

  const handleValueUpdate = (object, field, value) => {
    updateObject(object, field, value);
    if (!inRoom) return;
    socket.emit("active", {
      status: "active",
    });
    socket.emit("store change", { object, field, value });
  };

  return (
    <>
      <Settings>
        <ToggleBox>
          <BoxHeader
            open={doorBoxes.model}
            onClick={() => setDoorBoxes({ ...doorBoxes, model: !doorBoxes.model })}
          >
            Deur Model <ChevronDown />
          </BoxHeader>
          <BoxOptions open={doorBoxes.model}>
            <BoxOption>
              <OptionTitle>Deur 1</OptionTitle>
            </BoxOption>
          </BoxOptions>
        </ToggleBox>
        <input type="checkbox" onClick={() => handleValueUpdate("config", "doorOpen", !doorOpen)} />
        <label>Open deur</label>
        <br />
        <input
          type="checkbox"
          onClick={() => handleValueUpdate("config", "showFrame", !showFrame)}
        />
        <label>Verberg deurlijst</label>
      </Settings>
    </>
  );
};

const ToggleBox = styled.div`
  width: 100%;
`;

const Settings = styled.div`
  padding: 1rem;
  overflow: auto;
`;

const BoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  color: white;
  white-space: nowrap;
  font-size: 1.3rem;
  font-weight: 500;
  background: #bb5018;
  border-radius: 7px;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;

  svg {
    width: 25px;
    height: 25px;
    stroke: #ffffff;
    stroke-width: 2px;
    transform: ${({ open }) => (open ? "rotate(180deg)" : null)};
    transition: transform 0.2s ease-in-out;
  }
`;

const BoxOptions = styled.div`
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 300px;
  overflow: auto;
`;
const BoxOption = styled.div`
  position: relative;
  background-color: #bbbbbb;
  background-image: ${({ bgimage }) => `url(${bgimage})`};
  background-size: 210%;
  background-position: center;
  flex: 1 1 calc(33% - 0.5rem);
  max-width: calc(33%);
  border-radius: 10px;
  overflow: hidden;
  height: 120px;
  display: flex;
  border: ${({ active }) => (active ? "5px solid #bb5018" : "5px solid white")};
  cursor: pointer;
`;

const OptionTitle = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0;
  text-align: center;
`;

export default DoorConfig;
