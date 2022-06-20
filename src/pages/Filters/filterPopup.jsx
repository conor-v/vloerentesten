import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Trash from "../../assets/trash.svg";
import { useRef } from "react";
import { useStore } from "../../store/store";

const FilterPopup = ({ setPopup, setListCheck, listCheck, useOnClickOutside, socket }) => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const selectedFloors = useStore((state) => state.floors);
  const updateSelectedFloor = useStore((state) => state.updateSelectedFloor);
  const deleteFloor = useStore((state) => state.deleteFloor);
  const meters = useStore((state) => state.client.vierkantemeters);
  const navigate = useNavigate();
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setPopup(false);
    setListCheck(false);
  });

  const handlenavigation = async () => {
    updateSelectedFloor(selectedFloors[0]);
    if (!inRoom) return navigate(`/view`);

    await socket.emit("get floors", selectedFloors);
    await socket.emit("selecteded floor", selectedFloors[0]);
    await socket.emit("get meters", meters);

    navigate(`/view`);
  };

  return (
    <Popup>
      <PopupContianer ref={ref}>
        <PopupTitle>
          <span>{selectedFloors.length}</span> vloeren geselecteerd
        </PopupTitle>
        <PListFloors>
          {selectedFloors.map((floor) => (
            <PListFloorsItem key={floor.id}>
              <div>
                <img src={floor.thumbnail} alt={floor.name} />
                <p>{floor.name}</p>
              </div>
              <button onClick={() => deleteFloor(floor)}>
                <img src={Trash} alt="trash/delete icon" width={22} />
              </button>
            </PListFloorsItem>
          ))}
        </PListFloors>
        {selectedFloors.length === 0 && <p>Selecteer een vloer</p>}
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

          {selectedFloors.length >= 1 && !listCheck && (
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
