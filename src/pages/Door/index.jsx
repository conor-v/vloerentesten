import styled from "styled-components";
import CanvasDoor from "../../components/CanvasDoor";
import { useStore } from "../../store/store";
import BackButton from "../../components/BackButton";
import { useState } from "react";

const index = () => {
  const value = useStore((state) => state.config.doorOpenValue);
  const blackBg = useStore((state) => state.config.showBlackbg);
  const updateSelectedDoor = useStore((state) => state.updateSelectedDoor);
  const setValue = useStore((state) => state.updateObject);
  const doors = useStore((state) => state.doors);

  const [show, setShow] = useState(true);
  return (
    <>
      <BackButton link={"/door-filters"} />
      <CanvasDoor />
      <ConfigWrapper>
        <ConfigToggle onClick={() => setShow(!show)}>
          {show ? "verberg" : "toon"} settings
        </ConfigToggle>
        {show && (
          <>
            <DoorButtons>
              {doors.map((door) => {
                return (
                  <DoorButton onClick={() => updateSelectedDoor(door)}>{door.name}</DoorButton>
                );
              })}
            </DoorButtons>
            <Flex>
              <RangeWrapper>
                <Button onClick={() => setValue("config", "doorOpenValue", 0)}>gesloten</Button>
                <InputRange
                  type="range"
                  min="0"
                  max="2"
                  step="0.001"
                  value={value}
                  onChange={(e) => setValue("config", "doorOpenValue", e.target.value)}
                  id="doorRange"
                  name="doorRange"
                />
                <Button onClick={() => setValue("config", "doorOpenValue", 2)}>open</Button>
              </RangeWrapper>
            </Flex>
            <RangeWrapper>
              zwarte achtergrond:{" "}
              <input
                type="checkbox"
                name=""
                id=""
                checked={blackBg}
                onChange={() => setValue("config", "showBlackbg", !blackBg)}
              />
            </RangeWrapper>
          </>
        )}
      </ConfigWrapper>
    </>
  );
};

const ConfigWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  padding: 1rem;
`;
const ConfigToggle = styled.p`
  color: brown;
  text-align: right;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const Flex = styled.div`
  display: flex;
  gap: 1rem;
`;
const RangeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #dfdfdf;
  gap: 1rem;
`;
const Button = styled.p`
  cursor: pointer;
`;
const InputRange = styled.input``;
const DoorButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
`;
const DoorButton = styled.div`
  background-color: brown;
  color: white;
  padding: 0.5rem 1rem;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default index;
