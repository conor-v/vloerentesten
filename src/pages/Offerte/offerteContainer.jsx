import { useStore } from "../../store/store";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import OfferteForm from "./forms/OfferteForm";
import { useNavigate } from "react-router-dom";
import Logo from './logo.png'

const OfferteContainer = ({floors, handleDownloadPdf, index}) => {
  const meters = useStore((state) => state.client.vierkantemeters)
  const [formPopup, setFormPopup] = useState(false)
  const [formPicker, setFormPicker] = useState("")
  const [space, setSpace] = useState(0)
  const [totaal, setTotaal] = useState(0)
  const [error, setError] = useState('')
  const refContainer = useRef()
  const offerte = useStore((state) => state.offerte)
  const updateObject = useStore((state) => state.updateObject)
  const navigate = useNavigate();

  useEffect(() => {
     //totale pdf height --> 3412px
    const compHeight = refContainer.current?.clientHeight
    const overigeRuimte = 2012 - compHeight

    setSpace(overigeRuimte)

  }, [offerte.generatePdf])

  useEffect(() => {
    if (totaal === 0) {
      let count = 0;

      for (let i = 0; i < floors.length; i++) {
        count += Math.ceil(meters / floors[i].m2_per_box) * (floors[i].m2_per_box * floors[i].price_incl)
      }

      setTotaal(count.toFixed(2))
    }
  }, [])

  const handleFormCheck = (type) => {
    const {naam, email, straat, gemeente, land} = offerte
    if (!!naam && !!email && !!straat && !!gemeente && !!land) {
      setError('')
      if (type === "pdf") {
        handleDownloadPdf()
      }
      if (type === "email") {
        console.log('stuur email');
      }
    } else {
      setError('gelieve alle klant/bedrijf velden in te vullen.')
    }
  }

  return (
    <>
      <Container ref={refContainer}>
        {offerte.generatePdf &&
          <OfferteBanner>
            <img src={Logo} alt="Martens Hout logo" />
            <div>
              <p>https://www.martenshout.be/nl</p>
              <p>info@martenshout.be</p>
              <p>Hoogmolendijk 4, 2900 Schoten</p>
            </div>
          </OfferteBanner>
        }
        <ContainerHeader>
          <Title>Offerte {offerte.offertenummer}/{index}</Title>
          {!offerte.generatePdf &&
            <ContainerButtons>
              <BackButton onClick={() => navigate(`/view`)}>terug gaan</BackButton>
              <ContainerButton onClick={() => handleFormCheck('pdf')}>pdf</ContainerButton>
              <ContainerButton onClick={() => handleFormCheck('email')}>email</ContainerButton>
            </ContainerButtons>
          }
        </ContainerHeader>
        {error !== '' &&
          <p>{error}</p>
        }
        <Grid>
          <GridCols>
            <GridCol>
              <GridHeader generatePdf={offerte.generatePdf}>
                <p>Info</p>
                {!offerte.generatePdf &&
                  <EditButton style={{visibility: 'hidden'}}>Aanpassen</EditButton>
                }
              </GridHeader>
              <OfferteInfoGrid>
              <div>
                <p>Offertenummer:</p>
                <p>Datum:</p>
                <p>Vervaldatum:</p>
              </div>
              <div>
                <p>{offerte.offertenummer}</p>
                <p>{offerte.datum}</p>
                <p>{offerte.vervaldatum}</p>
              </div>
              </OfferteInfoGrid>
            </GridCol>

            <GridCol>
              <GridHeader generatePdf={offerte.generatePdf}>
                <p>Notities</p>
                {!offerte.generatePdf &&
                  <EditButton onClick={() => {setFormPopup(true), setFormPicker("notities")}}>Aanpassen</EditButton>
                }
              </GridHeader>
              <OfferteInfo>
                <Notitie>{offerte.notities === "" ? "Geen Notities ingevoerd" : offerte.notities}</Notitie>
              </OfferteInfo>
            </GridCol>
          </GridCols>

          <GridCol>
            <GridHeader generatePdf={offerte.generatePdf}>
              <p>{offerte.isKlant ? "Klant" : "Bedrijf"}</p>
              {!offerte.generatePdf &&
                <EditButton onClick={() => {setFormPopup(true), setFormPicker("klant")}}>Aanpassen</EditButton>
              }
            </GridHeader>
            <OfferteInfo>
              
              <p>{offerte.naam ? offerte.naam : "geen naam"}</p>
                <p>{offerte.email ? offerte.email : "geen email"}</p>
                <p>{offerte.straat ? offerte.straat : "geen straat + nr"}</p>
                <p>{offerte.gemeente ? offerte.gemeente : "geen gemeente"}</p>
                <p>{offerte.land ? offerte.land : "geen land"}</p>
                {!offerte.isKlant &&
                  <OfferteCode>{offerte.nummer ? offerte.nummer : "geen BTW-nummer"}</OfferteCode>
                }
            </OfferteInfo>
          </GridCol>
        </Grid>

        <GridCol>
          <GridHeader generatePdf={offerte.generatePdf}>
            <p>Producten</p>
            {!offerte.generatePdf &&
              <EditButton style={{visibility: 'hidden'}}>Aanpassen</EditButton>
            }
          </GridHeader>
          
          <GridLabels>
            <p>Aantal dozen</p>
            <p>Omschrijving</p>
            <PositionRightLabel>BTW</PositionRightLabel>
            <PositionRightLabel>Prijs/doos</PositionRightLabel>
            <PositionRightLabel>Totaal(incl. BTW)</PositionRightLabel>
          </GridLabels>

          <GridDataLines>
            {floors.map((floor) => (
              <div>
                <p>{Math.ceil(meters / floor.m2_per_box)}</p>
                <FloorDataImgName style={{border: "none"}}><img src={floor.thumbnail} alt={floor.name} width={40}/><p>{floor.name}</p></FloorDataImgName>
                <PositionRightData>21%</PositionRightData>
                <PositionRightData>€{(floor.m2_per_box * floor.price_incl).toFixed(2)}</PositionRightData>
                <PositionRightData>€{(Math.ceil(meters / floor.m2_per_box) * (floor.m2_per_box * floor.price_incl)).toFixed(2)}</PositionRightData>
              </div>
            ))}
          </GridDataLines>
        </GridCol>

        <TotaalOfferte>
          <div>
            <p>Totaal excl. BTW</p>
            <p>€{(totaal - (totaal / 100 * 21)).toFixed(2)}</p>
          </div>
          <div>
            <p>21% BTW</p>
            <p>€{(totaal / 100 * 21).toFixed(2)}</p>
          </div>
          <div>
            <p>Totaal incl. BTW</p>  
            <p>€{totaal}</p> 
          </div>
        </TotaalOfferte>
      </Container>

      <Renders generatePdf={offerte.generatePdf}>
        {floors.map((floor) => (
          <div>
            <p style={{ "page-break-before": "always"}}>{floor.name}</p>
            <img src={floor.room} alt={floor.name}/>
          </div>
        ))}
      </Renders>

      <br />
      <br />
      <br />

      {formPopup &&
        <OfferteForm setFormPopup={setFormPopup} formPicker={formPicker}/>
      }
    </>
  )
}

const Container = styled.div`
  padding: 30px;
`;

const OfferteBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  font-weight: 400;
`;

const ContainerButtons = styled.div`
  display: flex;
  gap: 15px;

  button {
    border: none;
    padding: 12px 15px;
    cursor: pointer;
  }
`;

const BackButton = styled.button`
  border: none;
  padding: 12px 15px;
  background-color: transparent;
  color: rgb(14,14,14);
  text-transform: uppercase;
`;

const ContainerButton = styled.button`
  border: none;
  padding: 12px 15px;
  background-color: #9f4414;
  color: white;
  text-transform: uppercase;

  &:hover {
    transition: .3s;
    background: #843911;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 25px;
  margin-bottom: 30px;
`;

const GridCols = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const GridCol = styled.div`
  border: solid 1px #9f9f9f;
`;

const GridHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ generatePdf }) => (generatePdf ? "white" : "linear-gradient(#FCFDFD, #EBEAEA)")};
  border-bottom: #9f9f9f solid 1px;

  p {
    padding-left: 10px;
    font-weight: bold;
    margin: ${({ generatePdf }) => (generatePdf ? "10px 0" : "0")};
  }
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  height: 100%;
  padding: 10px;
  border-left: solid 1px #9f9f9f;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    transition: .3s;
    background: #b9b9b9;
  }
`;

const OfferteInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-flow: column;
  gap: 10px;
  text-transform: capitalize;

  p {
    margin-bottom: 3px;
  }
`;

const OfferteInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  padding: 10px 10px;

  div {
    margin: auto 0;
    height: 100%;

    p {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const OfferteCompany = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const OfferteCode = styled.p`
  margin-top: 0;
`;

const GridLabels = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr;

  p {
    border-right: solid #9f9f9f 1px;
    border-bottom: solid #9f9f9f 1px;
    padding: 10px;

    &:last-child {
      border-right: none;
    }
  }
`;

const PositionRightLabel = styled.p`
display: flex;
justify-content: end;
`;

const GridDataLines = styled.div`
  div {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
    padding: 10px;
    align-items: center;
    border-top: solid 1px #9f9f9f;
  
    &:first-child {
      border-top: none;
    }
  }
`;

const FloorDataImgName = styled.div`
  border: none;
  display: flex;
  align-items: center;
`;

const PositionRightData = styled.p`
  display: flex;
  justify-content: end;
  padding-right: 5px;
`;

const TotaalOfferte = styled.div`
  display: flex;
  margin-top: 25px;
  flex-flow: column;
  align-items: end;

  div {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 280px;
    margin-bottom: 10px;

    &:first-child {
      border-top: solid 1px #141414;
      padding-top: 5px;
    }

    &:nth-child(2) {
      border-bottom: solid 1px #141414;
      padding-bottom: 5px;
    }

    p {
      &:last-child {
        justify-self: end;
      }
    }
  }
`;

const Notitie = styled.p`
  width: 600px;
  line-height: 1.2;
  text-transform: lowercase;
`;

const Renders = styled.div`
  margin-top: 25px;
  margin-bottom: ${({ generatePdf }) => (generatePdf ? "389px" : "0px")};
  padding: 30px;

  div {
    margin-top: 35px;

    p {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px; 
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
`;

export default OfferteContainer;