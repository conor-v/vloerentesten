import { useStore } from "../../store/store";
import styled from "styled-components";

const VierkanteMeters = () => {
  const meters = useStore((state) => state.client.vierkantemeters)
  const updateObject = useStore((state) => state.updateObject)

  return (
    <Wrapper>
      <Title>Klant oppervlakte (m²)</Title>
      <Optioneel>optioneel*</Optioneel>
      <MeterInput type="text" onChange={(e) => updateObject("client", "vierkantemeters" ,e.target.value)}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  padding: 30px 20px;
  width: 330px;
  margin-top: 40px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 5px;
`;

const Optioneel = styled.p`
  font-weight: 400;
  font-size: 12px;
  margin-bottom: 5px;
`;

const MeterInput = styled.input`
  border: 1px solid #989898;
  padding: 10px;
  width: 100%;

  &:after {
    content: "M2"
    
  }
`;

export default VierkanteMeters;