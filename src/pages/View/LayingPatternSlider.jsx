import { useState } from "react";
import styled from "styled-components";
import ArrowSlider from "../../assets/chevron-up.svg";
import { useStore } from "../../store/store";

const LayingPatternSlider = () => {
  const [floorSlider, setFloorSlider] = useState(false);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const planksLayingPattern = useStore((state) => state.config.planksLayingPattern);
  const updateObject = useStore((state) => state.updateObject);
  const plankLayingPatterns = ["halfOffset", "thirdOffset", "fourthOffset"];

  return (
    <FloorSlider floorSlider={floorSlider}>
      <FSButton floorSlider={floorSlider} onClick={() => setFloorSlider(!floorSlider)}>
        <img src={ArrowSlider} width={45} alt="arrow icon" />
      </FSButton>
      <FSList floorSlider={floorSlider}>
        {selectedFloor.pattern === "planks" &&
          plankLayingPatterns.map((pattern) => (
            <FSListButton
              active={planksLayingPattern === pattern}
              onClick={() => updateObject("config", "planksLayingPattern", pattern)}
            >
              <img src={`./patterns/${pattern}.jpg`} alt="floor icon" />
            </FSListButton>
          ))}
      </FSList>
    </FloorSlider>
  );
};

const FloorSlider = styled.div`
  position: absolute;
  top: 150px;
  right: 0;
  width: 90px;
  background: #f2f0f0;
  padding: 10px;
`;

const FSButton = styled.button`
  width: 70px;
  height: 70px;
  background: #ae5629;
  border: none;
  color: white;

  img {
    transition: 0.2s;
    transform: rotate(${({ floorSlider }) => (floorSlider ? -180 : -90)}deg);
  }
`;

const FSList = styled.div`
  display: ${({ floorSlider }) => (floorSlider ? "block" : "none")};
`;

const FSListButton = styled.button`
  border: ${({ active }) => (active ? "2px solid red" : "none")};
  margin-top: 20px;
  width: 70px;
  height: 70px;

  img {
    width: 100%;
    height: 100%;
  }
`;

export default LayingPatternSlider;
