import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Trash from "../../assets/trash.svg";
import { useRef } from "react";
import { useStore } from "../../store/store";

const FilterPopup = ({ setPopup, setListCheck, listCheck, useOnClickOutside, socket }) => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const selectedDoors = useStore((state) => state.doors);
  const updateSelectedDoor = useStore((state) => state.updateSelectedDoor);
  const deleteDoor = useStore((state) => state.deleteDoor);
  const meters = useStore((state) => state.client.vierkantemeters);
  const navigate = useNavigate();
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setPopup(false);
    setListCheck(false);
  });

  const handlenavigation = async () => {
    updateSelectedDoor(selectedDoors[0]);
    if (!inRoom) return navigate(`/door`);

    // await socket.emit("get floors", selectedDoors);
    // await socket.emit("selecteded floor", selectedDoors[0]);
    // await socket.emit("get meters", meters);

    navigate(`/door`);
  };

  return (
    <Popup>
      <PopupContianer ref={ref}>
        <PopupTitle>
          <span>{selectedDoors.length}</span> vloeren geselecteerd
        </PopupTitle>
        <PListFloors>
          {selectedDoors.map((door) => (
            <PListFloorsItem key={door.id}>
              <div>
                <img src={door.thumbnail} alt={door.name} />
                <p>{door.name}</p>
              </div>
              <button onClick={() => deleteDoor(door)}>
                <img src={Trash} alt="trash/delete icon" width={22} />
              </button>
            </PListFloorsItem>
          ))}
        </PListFloors>
        {selectedDoors.length === 0 && <p>Selecteer een vloer</p>}
        <PopupButtons>
          <button
            style={{ background: "#C0C0C0" }}
            onClick={() => {
              setPopup(false);
              setListCheck(false);
            }}
          >
            terug
          </button>

          {selectedDoors.length >= 1 && !listCheck && (
            <button onClick={() => handlenavigation()}>start</button>
          )}
        </PopupButtons>
      </PopupContianer>
    </Popup>
  );
};

/**
 * POPUP VELD
 */
const Popup = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background-color: rgba(14, 14, 14, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupContianer = styled.div`
  background: white;
  padding: 25px;
  gap: 30px;
  flex-flow: column;
  display: flex;
`;

const PopupTitle = styled.h2`
  font-family: "Petrona";
  font-weight: 500;
  font-size: 24px;

  span {
    font-weight: 700;
    color: #bb5018;
  }
`;

const PListFloors = styled.ul`
  max-height: 400px;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PListFloorsItem = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;

  div {
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }

  button {
    border: none;
    background: white;
    cursor: pointer;
  }
`;

const PopupButtons = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    background-color: rgb(187, 80, 24);
    font-weight: 300;
    padding: 10px 20px;
    color: rgb(255, 255, 255);
    border: none;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 15px;
  }
`;

export default FilterPopup;
