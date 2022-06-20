import styled from "styled-components";
import KlantForm from "./KlantForm";
import NotitiesForm from "./NotitiesForm"
import { useRef } from "react";
import useOnClickOutside from '../../../hooks/useOnClickOutside'

const OfferteForm = ({setFormPopup, formPicker}) => {
  const ref = useRef()
  useOnClickOutside(ref, () => setFormPopup(false));

  return (
    <Container>
      <PopupWindow ref={ref}>
        {formPicker === "klant" &&
          <KlantForm setFormPopup={setFormPopup} formPicker={formPicker}/>
        }
        {formPicker === "notities" &&
          <NotitiesForm setFormPopup={setFormPopup}/>
        }
      </PopupWindow>
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(14, 14, 14, .4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupWindow = styled.div`
  background: white;
  padding: 25px 35px;
  width: 450px;
`;

export default OfferteForm;