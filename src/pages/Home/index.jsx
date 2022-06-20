import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import Sellers from "../../data/sellers.json";
import Rooms from "../../data/rooms.json";
import { useStore } from "../../store/store";

const Home = () => {
  let navigate = useNavigate();

  const resetState = useStore((store) => store.resetState);
  const [values, setValues] = useState({
    device: localStorage.getItem("device") || null,
    screenType: localStorage.getItem("screenType") || null,
    configurator: localStorage.getItem("configurator") || null,
    room: localStorage.getItem("room") || null,
    seller: localStorage.getItem("seller") || "select",
    screenSize: localStorage.getItem("screenSize") || 0,
  });
  const [error, setError] = useState(null);

  const changeValue = (field, value) => {
    setValues({ ...values, [field]: value });
    localStorage.setItem(field, value);
  };

  const startConfigurator = () => {
    if (values.device === "config") {
      if (values.configurator === null || values.room === null || values.seller === "select")
        return setError("Zorg dat alle velden aangeduid zijn");
      localStorage.setItem("screenType", "horizontal");
    } else if (values.device === "screen") {
      if (values.room === null || values.room === "no-room" || values.screenType === null) {
        return setError("Zorg dat alle velden aangeduid zijn");
      }
      if (values.screenType === "floor" && values.screenSize === 0) {
        return setError("Vul de grootte van het scherm in");
      }
    }

    resetState("config");
    setError(null);
    if (values.device === "config" && values.configurator === "floor") {
      navigate(`/filters`);
    } else if (values.device === "config" && values.configurator === "door") {
      navigate("/door-filters");
    } else {
      navigate(`/${values.device}`);
    }
  };

  return (
    <Wrapper>
      {values.device === null || values.device === "null" ? (
        <Center>
          <h4>Kies apparaat</h4>
          <Options style={{ width: "300px" }}>
            <Option style={{ maxWidth: "150px" }} onClick={() => changeValue("device", "config")}>
              <p>Tablet</p>
            </Option>
            <Option style={{ maxWidth: "150px" }} onClick={() => changeValue("device", "screen")}>
              <p>Scherm</p>
            </Option>
          </Options>
        </Center>
      ) : (
        <Center>
          <HeaderButtons>
            <BackButton onClick={() => changeValue("device", null)}>
              <ArrowLeft />
              Selecteer apparaat
            </BackButton>
            {values.device === "config" &&
              <SearchButton onClick={() =>  navigate(`/offerte-zoeken`)}>offerte zoeken </SearchButton>
            }
          </HeaderButtons>
          
          {values.device === "config" && (
            <>
              <h4>Kies Configurator</h4>
              <Options>
                <Option
                  selected={values.configurator === "closet"}
                  onClick={() => changeValue("configurator", "closet")}
                >
                  <p>Kast</p>
                </Option>
                <Option
                  selected={values.configurator === "door"}
                  onClick={() => changeValue("configurator", "door")}
                >
                  <p>Deur</p>
                </Option>
                <Option
                  selected={values.configurator === "floor"}
                  onClick={() => changeValue("configurator", "floor")}
                >
                  <p>Parket</p>
                </Option>
              </Options>
            </>
          )}

          <h4>Kies Kamer</h4>
          <Options>
            {values.device === "config" && (
              <Option
                selected={values.room === "no-room"}
                onClick={() => changeValue("room", "no-room")}
                style={{ background: "#A1A1A1" }}
              >
                <p>Geen Kamer</p>
              </Option>
            )}
            {Rooms.map((room, indx) => {
              return (
                <Option
                  key={indx}
                  selected={values.room === room.value}
                  onClick={() => changeValue("room", room.value)}
                >
                  <p>{room.name}</p>
                </Option>
              );
            })}
          </Options>
          {values.device === "screen" && (
            <>
              <h4>Type Scherm</h4>
              <Options>
                <Option
                  selected={values.screenType === "horizontal"}
                  onClick={() => changeValue("screenType", "horizontal")}
                >
                  <p>Horizontaal</p>
                </Option>
                <Option
                  selected={values.screenType === "verticle"}
                  onClick={() => changeValue("screenType", "verticle")}
                >
                  <p>Verticaal</p>
                </Option>
                <Option
                  selected={values.screenType === "floor"}
                  onClick={() => changeValue("screenType", "floor")}
                >
                  <p>Vloer</p>
                </Option>
                <Option
                  selected={values.screenType === "door"}
                  onClick={() => changeValue("screenType", "door")}
                >
                  <p>Deur</p>
                </Option>
              </Options>
              {values.screenType === "floor" && (
                <>
                  <h4>Grootte scherm (Inch & Diagonaal)</h4>
                  <Options>
                    <InputOption
                      onChange={(e) => changeValue("screenSize", e.target.value)}
                      value={values.screenSize}
                      type="number"
                    />
                  </Options>
                </>
              )}
            </>
          )}

          {values.device === "config" && (
            <>
              <h4>Kies Verkoper</h4>
              <Dropdown
                name="sellers"
                id="sellers"
                value={values.seller}
                onChange={(e) => changeValue("seller", e.target.value)}
              >
                <option disabled value={"select"}>
                  selecteer verkoper
                </option>
                {Sellers.map((seller) => (
                  <option key={seller.value} value={seller.value}>
                    {seller.name}
                  </option>
                ))}
              </Dropdown>
            </>
          )}
          {error && <Error>{error}</Error>}
          <Button onClick={startConfigurator}>Start</Button>
        </Center>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const Center = styled.div`
  margin: auto;
`;

const Options = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  max-width: 800px;
`;

const Option = styled.div`
  text-align: center;
  flex: 1 1 calc(33% - 0.25rem);
  max-width: calc(33% - 0.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #dbdbdb;
  border: ${({ selected }) => (selected ? "2px solid #555555" : "2px solid #dbdbdb")};
  cursor: pointer;

  :hover {
    background-color: #cccccc;
  }
`;

const InputOption = styled.input`
  flex: 1 1 calc(33% - 0.25rem);
  max-width: calc(33% - 0.25rem);
  display: flex;
  background-color: #dbdbdb;
  cursor: pointer;
  border: none;
  padding: 1rem;
`;

const Dropdown = styled.select`
  border: none;
  background-color: #dbdbdb;
  padding: 1rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1.25rem;
  width: calc(50% - 0.25rem);
  cursor: pointer;

  :hover {
    background-color: #cccccc;
  }
`;
const Error = styled.p`
  color: #fb2929;
  margin-bottom: 0.5rem;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: fit-content;
  svg {
    width: 30px;
    height: 30px;
  }
`;
const Button = styled.div`
  display: flex;
  margin-top: 3rem;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background-color: #bb5018;
  color: white;
  max-width: calc(33% - 0.25rem);
  cursor: pointer;

  :hover,
  :active {
    background-color: #d75c1a;
  }
`;

const HeaderButtons = styled.div`
  margin-bottom: 4rem;
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const SearchButton = styled.button`
  background-color: #bb5018;
  border: none;
  cursor: pointer;
  color: white;
  padding: 10px;
  text-transform: uppercase;

  &:hover {
    background-color: #843c16;
  }
`;

export default Home;
