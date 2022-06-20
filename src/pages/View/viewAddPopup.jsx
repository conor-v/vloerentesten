import styled from "styled-components";
import { useRef, useState } from "react";
import floorData from "../../data/floors-filter-data.json";
import { useStore } from "../../store/store";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const ViewAddPopup = ({ handleAddFloors, setAddPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloorList, setSelectedFloorList] = useState([]);
  const floors = useStore((state) => state.floors);
  const ref = useRef();

  useOnClickOutside(ref, () => setAddPopup(false));

  const handleFloorSelect = (value) => {
    if (selectedFloorList.includes(value)) {
      setSelectedFloorList(selectedFloorList.filter((item) => item !== value));
    } else {
      setSelectedFloorList([...selectedFloorList, value]);
    }
  };

  return (
    <Popup>
      <PopupContent ref={ref}>
        <PopupTitle>Vloer toevoegen</PopupTitle>
        <SearchFilter
          type="text"
          placeholder="zoek..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PListFloors>
          {floorData
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (val.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                return val;
              }
            })
            .map((floor) => {
              const value = floors.find((f) => f.id === floor.id);
              if (value) {
                return (
                  <PListFloorsItem key={floor.id} active={selectedFloorList.includes(floor)}>
                    <div>
                      <img src={floor.thumbnail} alt={floor.name} />
                      <p style={{ textDecoration: "line-through" }}>{floor.name}</p>
                    </div>
                  </PListFloorsItem>
                );
              }
              return (
                <PListFloorsItem key={floor.id} active={selectedFloorList.includes(floor)}>
                  <div onClick={() => handleFloorSelect(floor)}>
                    <img src={floor.thumbnail} alt={floor.name} />
                    <p>{floor.name}</p>
                  </div>
                </PListFloorsItem>
              );
            })}
        </PListFloors>
        <PopupButtons>
          <button style={{ background: "#C0C0C0" }} onClick={() => setAddPopup(false)}>
            terug
          </button>
          <button onClick={() => handleAddFloors(selectedFloorList)}>toevoegen</button>
        </PopupButtons>
      </PopupContent>
    </Popup>
  );
};

/**
 * Popup
 */
const Popup = styled.div`
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100vh;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupContent = styled.div`
  background: white;
  padding: 30px 35px;
`;

const PopupTitle = styled.h2`
  font-family: "Petrona";
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 10px;
`;

const SearchFilter = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  border: rgb(14, 14, 14) solid 1px;
`;

const PopupButtons = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    background-color: rgb(187, 80, 24);
    font-weight: 300;
    font-size: 15px;
    padding: 10px 20px;
    color: rgb(255, 255, 255);
    border: none;
    text-transform: uppercase;
    cursor: pointer;
  }
`;

const PListFloors = styled.ul`
  max-height: 300px;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-bottom: 32px;
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
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border: ${({ active }) => (active ? "3px solid #bb5018" : "3px solid white")};
      cursor: pointer;
    }
  }
`;

export default ViewAddPopup;
