import styled from "styled-components";
import { useStore } from "../store/store";
import { useSwipeable } from "react-swipeable";

const config = {
  delta: 10, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: true, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
};

const RenderView = ({ handleNextSlide }) => {
  const selectedFloorRoom = useStore((state) => state.selectedFloor.room);
  const floors = useStore((state) => state.floors);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => handleNextSlide("volgende"),
    onSwipedRight: (eventData) => handleNextSlide("vorige"),
    ...config,
  });

  return (
    <Wrapper {...handlers}>
      {floors.map(({ room, id }) => (
        <RenderContainer
          key={id}
          style={{ zIndex: selectedFloorRoom === room ? "10" : "1" }}
          render={room}
        ></RenderContainer>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  position: fixed;
  width: 100%;
  z-index: 10;
`;

const RenderContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: ${({ render }) => `url(${render})`};
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

export default RenderView;
