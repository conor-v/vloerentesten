import { useStore } from "../../../store/store";
import styled from "styled-components";

const NotitiesForm = ({setFormPopup}) => {
  const updateObject = useStore((state) => state.updateObject)
  const offerte = useStore((state) => state.offerte)

  const handleForm = (e) => {
    e.preventDefault()
    setFormPopup(false)
  }

  return (
    <>
      <PopupTitle>Notities</PopupTitle>
      <PopupForm onSubmit={(e) => handleForm(e)}>
        <label htmlFor="notities">Notities
            <textarea 
              name="notities" 
              id="notities" 
              style={{lineHeight: 1.5}}
              value={offerte.notities} 
              onChange={(e) => updateObject("offerte", "notities" ,e.target.value)}
              rows={5}
              cols={5}
            />
          </label>
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

export default NotitiesForm;