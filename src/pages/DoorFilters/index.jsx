import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import Check from "../../assets/check.svg";
import Accordion from "../../components/Accordion/Accordion";
import Checkbox from "../Filters/checkbox";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import doorsData from "../../data/doors-filter-data.json";
import { useStore } from "../../store/store";
import FilterPopup from "./filterPopup";
import useSocketIo from "../../hooks/useSocketIo";
const DoorFilters = () => {
  const navigate = useNavigate();
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [listCheck, setListCheck] = useState(false);
  const [doors, setDoors] = useState(doorsData);
  const [popup, setPopup] = useState(false);
  const [deurtypeFilter, setDeurtypeFilter] = useState([]);
  const [materialenFilter, setMaterialenFilter] = useState([]);
  const [houtsoortenFilter, setHoutsoortenFilter] = useState([]);
  const [merkenFilter, setMerkenFilter] = useState([]);
  const [kleurenFilter, setKleurenFilter] = useState([]);
  const [testFilterArray, setTestFilterArray] = useState([]);
  const selectedDoors = useStore((state) => state.doors);
  const resetDoor = useStore((state) => state.resetDoor);
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;

  const filterDoor = useStore((state) => state.filterDoor);

  useEffect(() => {
    if (testFilterArray.length === 0) {
      setDoors(doorsData);
    }

    if (testFilterArray.length) {
      const test = doorsData
        .filter((d) => {
          return deurtypeFilter.length ? testFilterArray.includes(d.model) : true;
        })
        .filter((d) => {
          return materialenFilter.length ? testFilterArray.includes(d.material) : true;
        })
        .filter((d) => {
          return merkenFilter.length ? testFilterArray.includes(d.brand) : true;
        })
        .filter((d) => {
          return kleurenFilter.length ? testFilterArray.includes(d.color) : true;
        })
        .filter((d) => {
          return houtsoortenFilter.length ? testFilterArray.includes(d.houtsoort) : true;
        });

      setDoors(test);
    }
  }, [testFilterArray]);

  const handleSelectAll = () => {
    doors.map((door) => {
      if (selectedDoors.includes(door)) {
        return null;
      }

      filterDoor(door);
    });
  };

  const handleCount = (filterObj, type) => {
    const count = doors.filter((d) =>
      filterObj.includes(
        type === "deurtypes"
          ? d.model
          : type === "materialen"
          ? d.material
          : type === "merken"
          ? d.brand
          : type === "kleuren"
          ? d.color
          : type === "houtsoorten"
          ? d.houtsoort
          : null
      )
    );
    return count.length;
    return 1;
  };

  //func voor het vullen van de filter arrays --> (vloertypeFilter, merkenFilter, kleurenFilter)
  const handleFilter = (value, getter, setter) => {
    if (getter.includes(value)) {
      setter(getter.filter((item) => item !== value));
      setTestFilterArray(testFilterArray.filter((item) => item !== value));
    } else {
      setter([...getter, value]);
      setTestFilterArray([...testFilterArray, value]);
    }
  };

  const deurtypes = [
    { id: 1, name: "type 1", count: handleCount("type 1", "deurtypes"), type: "deurtypes" },
    { id: 2, name: "type 2", count: handleCount("type 2", "deurtypes"), type: "deurtypes" },
  ];
  const materialen = [
    {
      id: 1,
      name: "materiaal 1",
      count: handleCount("materiaal 1", "materialen"),
      type: "materialen",
    },
    {
      id: 2,
      name: "materiaal 2",
      count: handleCount("materiaal 2", "materialen"),
      type: "materialen",
    },
  ];
  const merken = [
    { id: 1, name: "merk 1", count: handleCount("merk 1", "merken"), type: "merken" },
    { id: 2, name: "merk 2", count: handleCount("merk 2", "merken"), type: "merken" },
  ];
  const kleuren = [
    { id: 1, name: "kleur 1", count: handleCount("kleur 1", "kleuren"), type: "kleuren" },
    { id: 2, name: "kleur 2", count: handleCount("kleur 2", "kleuren"), type: "kleuren" },
  ];
  const houtsoorten = [
    {
      id: 1,
      name: "houtsoort 1",
      count: handleCount("houtsoort 1", "houtsoorten"),
      type: "houtsoorten",
    },
    {
      id: 2,
      name: "houtsoort 2",
      count: handleCount("houtsoort 2", "houtsoorten"),
      type: "houtsoorten",
    },
  ];

  let items = [
    {
      name: "Modellen",
      content: (
        <Checkbox
          items={deurtypes}
          handleFilter={handleFilter}
          getter={deurtypeFilter}
          setter={setDeurtypeFilter}
        />
      ),
    },
    {
      name: "Materialen",
      content: (
        <Checkbox
          items={materialen}
          handleFilter={handleFilter}
          getter={materialenFilter}
          setter={setMaterialenFilter}
        />
      ),
    },
    {
      name: "Merken",
      content: (
        <Checkbox
          items={merken}
          handleFilter={handleFilter}
          getter={merkenFilter}
          setter={setMerkenFilter}
        />
      ),
    },
    {
      name: "Kleuren",
      content: (
        <Checkbox
          items={kleuren}
          handleFilter={handleFilter}
          getter={kleurenFilter}
          setter={setKleurenFilter}
        />
      ),
    },
    {
      name: "houtsoorten",
      content: (
        <Checkbox
          items={houtsoorten}
          handleFilter={handleFilter}
          getter={houtsoortenFilter}
          setter={setHoutsoortenFilter}
        />
      ),
    },
  ];
  return (
    <div>
      <Main>
        <FloorContainer>
          <FilterHeader>
            <BackButton onClick={() => navigate("/")}>
              <ArrowLeft />
              Terug keren
            </BackButton>

            {testFilterArray.length > 0 && (
              <ButtonAll onClick={() => handleSelectAll()}>Alles selecteren</ButtonAll>
            )}
          </FilterHeader>
          <FilterAmount>
            Er zijn <span>{doors.length}</span> deuren gevonden met uw specificaties
          </FilterAmount>

          <FloorGrid>
            {doors.map((door) => (
              <FloorItem
                key={door.id}
                bgimage={door.thumbnail}
                active={selectedDoors.includes(door)}
                onClick={() => filterDoor(door)}
              >
                {selectedDoors.includes(door) && (
                  <SelectedBox>
                    <img src={Check} alt="selected icon" />
                  </SelectedBox>
                )}
                <FloorInfo>
                  <FloorName>
                    {door.name} | {door.brand}
                  </FloorName>
                  <FloorPrice>€{door.price_incl}</FloorPrice>
                </FloorInfo>
              </FloorItem>
            ))}
          </FloorGrid>
        </FloorContainer>

        <FilterContainer>
          <ResetButton onClick={() => resetDoor()}>Lijst leeg maken</ResetButton>

          <Accordion multiple items={items} />

          {/* <PriceFilter setter={setPrice} getter={price} /> */}

          <FilterButtons>
            <ListButton
              onClick={() => {
                setPopup(true);
                setListCheck(true);
              }}
            >
              lijst
            </ListButton>
            <button onClick={() => setPopup(true)}>verder gaan</button>
          </FilterButtons>
        </FilterContainer>
      </Main>

      {popup && (
        <FilterPopup
          socket={socket}
          setPopup={setPopup}
          setListCheck={setListCheck}
          listCheck={listCheck}
          useOnClickOutside={useOnClickOutside}
        />
      )}
    </div>
  );
};

const Main = styled.div`
  display: flex;
`;

const FloorContainer = styled.div`
  padding: 25px 35px 35px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const ButtonAll = styled.button`
  font-size: 15px;
  color: #ffffff;
  padding: 16px 30px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  background: #bb5018;
`;

const FilterAmount = styled.p`
  font-size: 20px;
  margin-bottom: 35px;
  width: 65%;

  @media (min-width: 900px) {
    width: 100%;
  }

  span {
    font-weight: bold;
    color: #9f4414;
  }
`;

/**
 * GRID FLOORS
 */
const FloorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 115px 35px;
  padding-bottom: 80px;
  cursor: pointer;

  @media (min-width: 1040px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1370px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1660px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FloorItem = styled.div`
  height: 229px;
  width: 273px;
  background-image: ${({ bgimage }) => `url(${bgimage})`};
  background-size: 210%;
  background-position: center;
  position: relative;
  border: ${({ active }) => (active ? "3px solid #bb5018" : "3px solid white")};
`;

const SelectedBox = styled.div`
  width: 26px;
  height: 26px;
  padding: 3px;
  background: #bb5018;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  border-radius: 50%;
`;

const FloorInfo = styled.div`
  position: absolute;
  bottom: -45px;
  width: 100%;
  height: 45px;
  display: flex;
  flex-flow: column;
`;

const FloorName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: rgb(14, 14, 14);
  padding: 10px 10px 10px 0;
  text-overflow: ellipsis;
  max-width: 260px;
  text-transform: uppercase;
`;

const FloorPrice = styled.p`
  font-size: 22px;
  font-weight: 500;
`;

/**
 * FILTER DIV
 */
const FilterContainer = styled.div`
  width: 411px;
  background-color: #fcf6f3;
  position: fixed;
  right: 0;
  height: 100vh;
  padding: 25px 35px;
  overflow-y: scroll;
`;

const ResetButton = styled.button`
  font-size: 15px;
  background-color: #141414;
  color: #fff;
  padding: 16px 30px;
  font-weight: 300;
  border: none;
  cursor: pointer;
  transition: 0.5s;
  position: absolute;
  right: 35px;
  text-transform: uppercase;

  &:hover {
    background: #72300e;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    background: #bb5018;
    color: white;
    border: none;
    padding: 16px 30px;
    font-size: 15px;
    font-weight: 300;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      background-color: #9f4414;
    }
  }
`;

const ListButton = styled.button`
  background-color: #e48655 !important;
  transition: 0.5s;

  &:hover {
    background-color: #9f4414 !important;
  }
`;

export default DoorFilters;
