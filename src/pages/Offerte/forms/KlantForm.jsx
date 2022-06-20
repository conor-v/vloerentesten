import { useStore } from "../../../store/store";
import styled from "styled-components";
import ToggleKlantBedrijf from "../ToggleKlantBedrijf"
import {useState} from 'react'

const KlantForm = ({setFormPopup, formPicker}) => {
  const updateObject = useStore((state) => state.updateObject)
  const offerte = useStore((state) => state.offerte)
  const [error, setError] = useState('')

  const handleForm = (e) => {
    e.preventDefault()
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setFormPopup(false)
  }

  return (
    <>
      <PopupTitle>Klant informatie</PopupTitle>
      <ToggleKlantBedrijf/>
      <PopupForm onSubmit={(e) => handleForm(e)}>
        <label htmlFor="naam">{offerte.isKlant ? "Volledige naam" : "Bedrijfs naam"}
          <input 
            type="text" 
            name="naam" 
            id="naam" 
            placeholder={offerte.isKlant ? "Volledige naam" : "Bedrijfs naam"} 
            value={offerte.naam} 
            onChange={(e) => updateObject("offerte", "naam" ,e.target.value)}
            required
          />
        </label>

        <label htmlFor="email">Email
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Email" 
            value={offerte.email} 
            onChange={(e) => updateObject("offerte", "email" ,e.target.value)}
            required  
          />
        </label>
        {error &&
          <p>{error}</p>
        }

        <label htmlFor="straat + nr">Straat + Nr
          <input 
            type="text" 
            name="straat + nr" 
            id="straat + nr" 
            placeholder="Straat + Nr" 
            value={offerte.straat} 
            onChange={(e) => updateObject("offerte", "straat" ,e.target.value)}
            required  
          />
        </label>

        <label htmlFor="postcode + gemeente">Postcode + Gemeente
          <input 
            type="text" 
            name="postcode + gemeente" 
            id="postcode + gemeente" 
            placeholder="Postcode + Gemeente" 
            value={offerte.gemeente} 
            onChange={(e) => updateObject("offerte", "gemeente" ,e.target.value)}
            required  
          />
        </label>

        <label htmlFor="land">Land
          <input 
            type="text" 
            name="land" 
            id="land" 
            placeholder="Land" 
            value={offerte.land} 
            onChange={(e) => updateObject("offerte", "land" ,e.target.value)}
            required  
          />
        </label>

        {!offerte.isKlant &&
          <label htmlFor="nummer">Nummer
            <input 
              type="text" 
              name="nummer" 
              id="nummer" 
              placeholder="BTW-Nummer" 
              value={offerte.nummer} 
              onChange={(e) => updateObject("offerte", "nummer" ,e.target.value)}
              required  
            />
          </label>
        }
  
        <Buttons>
          <button onClick={() => setFormPopup(false)}>Cancel</button>
          <button>Opslaan</button>
        </Buttons>
      </PopupForm>
    </>
  )
}

const PopupTitle = styled.h1`
  margin-bottom: 10px;
`;

const PopupForm = styled.form`
  display: flex;
  flex-flow: column;
  gap: 20px;

  label {
    display: flex;
    flex-flow: column;

    input {
      padding: 8px;
      margin-top: 5px;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  button {
    background-color: rgb(187,80,24);
    font-weight: 300;
    padding: 10px 20px;
    color: rgb(255,255,255);
    border: none;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 15px;

    &:hover {
        background: rgb(149, 64, 20);
    }

    &:first-child {
      background: rgb(192, 192, 192);

      &:hover {
        background: rgb(149, 149, 149);
      }
    }
  }
`;

export default KlantForm