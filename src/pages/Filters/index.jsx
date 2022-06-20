import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import styled from "styled-components";
import floorsData from "../../data/floors-filter-data.json"
import { useEffect, useState } from "react";
import Accordion from "../../components/Accordion/Accordion";
import Checkbox from "./checkbox";
import FilterPopup from "./filterPopup";
import { useStore } from "../../store/store";
import Check from "../../assets/check.svg";
import VierkanteMeters from "./vierkanteMeters"
import useSocketIo from "../../hooks/useSocketIo";
import PriceFilter from "./PriceFilter";

const Filters = () => {
  const navigate = useNavigate();
  const [floors, setFloors] = useState(floorsData)
  const [popup, setPopup] = useState(false)
  const [price, setPrice] = useState(100)
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [listCheck, setListCheck] = useState(false)
  const [vloertypeFilter, setVloertypeFilter] = useState([])
  const [merkenFilter, setMerkenFilter] = useState([])
  const [kleurenFilter, setKleurenFilter] = useState([])
  const [legpatronenFilter, setLegpatronenFilter] = useState([])

  const [testFilterArray, setTestFilterArray] = useState([])
  const selectedFloors = useStore((state) => state.floors);
  const filterFloor = useStore((state) => state.filterFloor);
  const resetFloor = useStore((state) => state.resetFloor);
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;

  //filteren van vloeren data --> (JSON data)
  useEffect(() => {
    if (testFilterArray.length === 0) {
      setFloors(floorsData)
    }

    if (testFilterArray.length || price) {
      const test = floorsData
      .filter((d) => {return vloertypeFilter.length ? testFilterArray.includes(d.category) : true })
      .filter((d) => {return merkenFilter.length ? testFilterArray.includes(d.brand): true}) 
      .filter((d) => {return legpatronenFilter.length ? testFilterArray.includes(d.pattern): true}) 
      .filter((d) => {return kleurenFilter.length ? testFilterArray.includes(d.color): true})
      .filter((d) => {return d.price_incl < parseInt(price)})
      setFloors(test)
    }

  }, [testFilterArray, price])

  const handleSelectAll = () => {
    floors.map((floor) => {
      if (selectedFloors.includes(floor)) {
        return null
      }
      
      filterFloor(floor)
    })
  }

  //func voor het zien hoeveel vloeren een bepaald filter item heeft
  const handleCount = (filterObj, type) => {
    const count = floors.filter((d) => filterObj.includes(
      type === "vloertype" ? d.category : 
      type === "merken" ? d.brand : 
      type === "kleuren" ? d.color : 
      d.pattern))
    return count.length
  }

  //func voor het vullen van de filter arrays --> (vloertypeFilter, merkenFilter, kleurenFilter)
  const handleFilter = (value, getter, setter) => {
    if (getter.includes(value)) {
      setter(getter.filter(item => item !== value));
      setTestFilterArray(testFilterArray.filter(item => item !== value))
    } else {
      setter([...getter, value])
      setTestFilterArray([...testFilterArray, value])
    }
  }

  //fliter inputs data and HTML
  const vloertype = [{ id: 1, name: "laminaat", count: handleCount("laminaat", "vloertype"), type: "vloertypes" }, { id: 2, name: "parket", count: handleCount("parket", "vloertype"), type: "vloertypes" }, { id: 3, name: "vinyl", count: handleCount("vinyl", "vloertype"), type: "vloertypes" }]
  const merken = [{ id: 1, name: "meister", count: handleCount("meister", "merken"), type: "merken" }, { id: 2, name: "brico", count: handleCount("brico", "merken"), type: "merken" }, { id: 3, name: "parky", count: handleCount("parky", "merken"), type: "merken" }]
  const kleuren = [{ id: 1, name: "licht", count: handleCount("licht", "kleuren"), type: "kleuren" }, { id: 2, name: "donker", count: handleCount("donker", "kleuren"), type: "kleuren" }]
  const legpatronen = [{ id: 1, name: "visgraat", count: handleCount("visgraat", "legpatronen"), type: "legpatronen" }, { id: 2, name: "planks", count: handleCount("planks", "legpatronen"), type: "legpatronen" }, { id: 3, name: "chevron", count: handleCount("chevron", "legpatronen"), type: "legpatronen" }]

  let items = [
    {
      name: "Vloertypes",
      content:
        <Checkbox items={vloertype} handleFilter={handleFilter} getter={vloertypeFilter} setter={setVloertypeFilter}/>
    },
    {
      name: "Merken",
      content:
        <Checkbox items={merken} handleFilter={handleFilter} getter={merkenFilter} setter={setMerkenFilter}/>
    },
    {
      name: "Kleuren",
      content:
        <Checkbox items={kleuren} handleFilter={handleFilter} getter={kleurenFilter} setter={setKleurenFilter}/>
    },
    {
      name: "Legpatronen",
      content:
        <Checkbox items={legpatronen} handleFilter={handleFilter} getter={legpatronenFilter} setter={setLegpatronenFilter}/>
    }
  ]

  //popup weg doen als je buiten de popup klikt
  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  return (
    <div >
      <Main>
        <FloorContainer>
          <FilterHeader>
            <BackButton onClick={() => navigate("/")}>
              <ArrowLeft />
              Terug keren
            </BackButton>
            
            {testFilterArray.length > 0 &&
              <ButtonAll onClick={() => handleSelectAll()}>Alles selecteren</ButtonAll>
            }
          </FilterHeader>
          <FilterAmount>Er zijn <span>{floors.length}</span> vloeren gevonden met uw specificaties</FilterAmount>

          <FloorGrid>
            {floors.map((floor) => (
              <FloorItem
                key={floor.id} bgimage={floor.thumbnail}
                active={selectedFloors.includes(floor)}
                onClick={() => filterFloor(floor)}>
                {selectedFloors.includes(floor) && 
                  <SelectedBox>
                    <img src={Check} alt="selected icon"/>    
                  </SelectedBox>
                }  
                <FloorInfo>
                  <FloorName>{floor.name} | {floor.brand}</FloorName>
                  <FloorPrice>€{floor.price_incl} / m²</FloorPrice>
                </FloorInfo>
              </FloorItem>
            ))}
          </FloorGrid>
        </FloorContainer>

        <FilterContainer>
          <ResetButton onClick={() => resetFloor()}>Lijst leeg maken</ResetButton>

          <Accordion multiple items={items} />

          <PriceFilter setter={setPrice} getter={price}/>

          <VierkanteMeters/>

          <FilterButtons>
            <ListButton onClick={() => { setPopup(true); setListCheck(true) }}>lijst</ListButton>
            <button onClick={() => setPopup(true)}>verder gaan</button>
          </FilterButtons>
        </FilterContainer>

      </Main>

      {popup &&
        <FilterPopup
          socket={socket}
          setPopup={setPopup}
          setListCheck={setListCheck}
          listCheck={listCheck}
          useOnClickOutside={useOnClickOutside}
        />
      }
    </div>
  );
};

/**
 * MAIN CONTAINER
 */
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
  margin-bottom: 40px
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
  background: #BB5018;
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
  background: #BB5018;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: end;
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
  transition: .5s;
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
    background: #BB5018;
    color: white;
    border: none;
    padding: 16px 30px;
    font-size: 15px;
    font-weight: 300;
    text-transform: uppercase;
    cursor: pointer;
    transition: .5s;

    &:hover {
      background-color: #9f4414
    }
  }
`;

const ListButton = styled.button`
  background-color: #E48655 !important;
  transition: .5s;

  &:hover {
    background-color: #9f4414 !important
  }
`;

export default Filters;
