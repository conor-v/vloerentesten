import { useState, useEffect } from "react";
import { useStore } from "../store/store";
import styled from "styled-components";
import useSocketIo from "../hooks/useSocketIo";

const ScreenRoomView = () => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [isScreen, setIsScreen] = useState(localStorage.getItem("device") === "screen");
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;
  const floors = useStore((state) => state.floors)
  const selectedFloor = useStore((state) => state.selectedFloor)
  const meters = useStore((state) => state.client.vierkantemeters)
  const updateFloors = useStore((state) => state.updateFloors)
  const updateSelectedFloor = useStore((state) => state.updateSelectedFloor)
  const updateObject = useStore((state) => state.updateObject)

  console.log(floors);

  // if the client is a screen and in a socketroom, listen for socket events to move camera
  useEffect(() => {
    console.log("in useEffect");
    if (socket && inRoom) {
      console.log("eerste if");
      //zien of type juist is zo niet return null
      if (localStorage.getItem("screenType") === "floor") return;

      //hier zien of dat de client op scherm zit zo niet return null
      if (!isScreen) return;

      //lees waarde uit event met on(event naam) en zet waarde gelijk aan iets
      socket.on("selecteded floor", (data) => {
        console.log("floor", data);
        const { obj } = data;
        updateSelectedFloor(obj);
      });

      //lees waarde uit event met on(event naam) en zet waarde gelijk aan iets
      socket.on("get floors", (data) => {
        const { floors } = data;
        console.log("floors", floors);
        updateFloors(floors);
      });

       //lees waarde uit event met on(event naam) en zet waarde gelijk aan iets
       socket.on("get meters", (data) => {
        console.log("meters", data);
        const {meters} = data;
        updateObject("client", "vierkantemeters", meters);
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, [socket]);

  useEffect(() => {
  }, [meters]);


  return (
    <>
      <Wrapper>
        {selectedFloor &&
          floors.map(({ room, id }) => (
            <RenderContainer
              key={id}
              style={{ zIndex: selectedFloor.room === room ? "10" : "1" }}
              render={room}
            ></RenderContainer>
          ))}
      </Wrapper>
      <NameBar>
        <p>{Object.keys(selectedFloor).length !== 0 ? `${selectedFloor.name} | ${selectedFloor.price_incl} €/M² | €${(selectedFloor.price_incl * meters).toFixed(2)} voor ${meters}M² (${Math.ceil(meters/selectedFloor.m2_per_box)} dozen)`   : "Geen vloer geselecteerd"}</p>
      </NameBar>
    </>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  position: fixed;
  width: 100%;
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

const NameBar = styled.div`
  height: 55px;
  background: #fff;
  border-top: 2px solid #a14d0d;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  z-index: 11;

  p {
    padding: 10px 10px 10px 40px;
    color: rgb(14, 14, 14);
    font-weight: 600;
    font-size: 20px;
  }
`;

export default ScreenRoomView;
