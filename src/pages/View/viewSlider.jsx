import { useState } from "react";
import Trash from "../../assets/trash.svg";
import styled from "styled-components";
import Plus from "../../assets/plus.svg";
import { useStore } from "../../store/store";

const ViewSlider = ({ setAddPopup, setDelFloorQuew, setDelPopup, socket }) => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const selectedFloors = useStore((state) => state.floors);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const updateSelectedFloor = useStore((state) => state.updateSelectedFloor);

  const handleFloorChange = (floor) => {
    if (!inRoom) return;
    socket.emit("selecteded floor", floor);
  };

  return (
    <FloorsListContainer>
      <FloorListBtn onClick={() => setAddPopup(true)}>
        <img src={Plus} alt="toevoeg knop met plus icon" />
      </FloorListBtn>
      <FloorList>
        {selectedFloors.map((floor) => (
          <li
            key={floor.id}
            onClick={() => {
              updateSelectedFloor(floor), handleFloorChange(floor);
            }}
            style={{
              border:
                selectedFloor.name === floor.name ? "solid 2px red" : "solid 2px rgba(0, 0, 0, 0)",
            }}
          >
            <img src={floor.thumbnail} width={150} />
            {selectedFloors.length > 1 && (
              <button
                onClick={() => {
                  setDelFloorQuew(floor), setDelPopup(true);
                }}
              >
                <img src={Trash} alt="del vuilbak icon" />
              </button>
            )}
          </li>
        ))}
      </FloorList>
    </FloorsListContainer>
  );
};

const FloorsListContainer = styled.div`
  display: flex;
  align-items: center;
  height: 80%;
  overflow: scroll;
  padding-right: 40px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const FloorListBtn = styled.button`
  background: #bb5018;
  border: none;
  margin: 0 40px;
  width: 74px;
  height: 74px;
  color: #ffffff;
  font-size: 71px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 20px;
`;

const FloorList = styled.ul`
  display: flex;
  list-style: none;
  gap: 40px;

  li {
    position: relative;
    width: 154px;
    height: 154px;

    &:last-child {
      margin-right: 35px;
    }

    img {
      width: 150px;
      height: 150px;
    }

    button {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 29px;
      height: 29px;
      background-color: #c0c0c0;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

export default ViewSlider;
