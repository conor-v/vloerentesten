import { useStore } from "../../store/store";
import styled from "styled-components";

const ToggleKlantBedrijf = () => {
  const updateObject = useStore((state) => state.updateObject)
  const isKlant = useStore((state) => state.offerte.isKlant)

  return (
    <ToggleKlant>
      <ToggleRadioButton>
        <input type="radio" name="status" id="Openstaand" checked={isKlant} onChange={(e) => updateObject("offerte", "isKlant" ,true)}/>Klant
      </ToggleRadioButton>

      <ToggleRadioButton>
        <input type="radio" name="status" id="Gesloten" checked={!isKlant} onChange={(e) => updateObject("offerte", "isKlant" ,false)}/>Bedrijf
      </ToggleRadioButton>
    </ToggleKlant>
  )
}

const ToggleKlant = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;

const ToggleRadioButton = styled.div`
  display: flex;
  gap: 10px;

  input {
    transform: scale(1.5); 
  }
`;

export default ToggleKlantBedrijf;