import Offertes from "../../data/offerte-data.json"
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const OfferteZoeken = () => {
  let navigate = useNavigate();

  return (
    <Container>
      <Content>
        <BackButton onClick={() => navigate(`/`)}>Terug keren</BackButton>
        <SearchBarContainer>
          <SearchBar type="text" name="search" id="search" placeholder="offerte nummer..."/>
        </SearchBarContainer>

        <OffertesContainer>
          {Offertes.map((offerte) => (
            <div key={offerte.key}>
              <p>{offerte.offertenummer}</p>
              <p>{offerte.beginDatum}</p>
              <p>{offerte.vervalDatum}</p>
              <p>{offerte.notities}</p>
              <p>{offerte.meters}</p>
            </div>
          ))}
        </OffertesContainer>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 4rem;
  margin-top: 7rem;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 40px;
`;

const SearchBarContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 400px;
  margin-bottom: 20px;
  padding: 10px;
`;

const OffertesContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

export default OfferteZoeken;