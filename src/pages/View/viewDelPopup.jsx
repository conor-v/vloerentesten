import styled from "styled-components";
import { useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const ViewDelPopup = ({ delFloorQuew, setDelFloorQuew, setDelPopup, handleFloorRemove }) => {
  const ref = useRef();

  useOnClickOutside(ref, () => setDelPopup(false));

  return (
    <Popup>
      <PopupContent style={{ width: "534px" }} ref={ref}>
        <PopupTitle>Verwijder vloer</PopupTitle>
        <p style={{ marginBottom: "32px" }}>
          Ben je zeker dat je{" "}
          <span style={{ color: "#BB5018", fontWeight: "700" }}>{delFloorQuew.name}</span> wilt
          verwijderen uit de lijst van geselecteerde items?
        </p>
        <PopupButtons>
          <button
            style={{ background: "#C0C0C0" }}
            onClick={() => {
              setDelFloorQuew(null), setDelPopup(false);
            }}
          >
            nee
          </button>
          <button onClick={() => handleFloorRemove(delFloorQuew)}>ja</button>
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

export default ViewDelPopup;
