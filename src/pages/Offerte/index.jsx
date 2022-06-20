import OfferteContainer from './offerteContainer'
import { useStore } from "../../store/store";
import { useState, useEffect } from 'react';
import styled from "styled-components";
import { jsPDF } from 'jspdf';

const Offerte = () => {
  const [offerteSelected, setOfferteSelected] = useState("all")
  const floors = useStore((state) => state.floors)
  const generatePdf = useStore((state) => state.offerte.generatePdf)
  const updateObject = useStore((state) => state.updateObject)
  const offerte = useStore((state) => state.offerte)

  const handleDownloadPdf = async() => {
    updateObject('offerte', 'generatePdf', true)
    const doc = new jsPDF();
  
    doc.html(document.body, {
      
      callback: function (doc) {
        doc.save();
        updateObject('offerte', 'generatePdf', false)
      },

      x: 0,
      y: 0,
      width: 200,
      windowWidth: 1500,
      margin: 5,
      autoPaging: true
   });
  }

  return (
    <>
      {!generatePdf &&
        <OfferteButtons>
          <button style={{background: offerteSelected === 'all' && '#ea7232'}} onClick={() => setOfferteSelected('all')}>alle vloeren</button>
          {floors.map((floor, indx) => (
            <button style={{background: offerteSelected === floor.id && '#ea7232'}} onClick={() => setOfferteSelected(floor.id)} key={floor.id}>vloer {indx +1}</button>
          ))}
        </OfferteButtons>
      }

      {floors.map((floor, index) => {
        if(floor.id === offerteSelected){
          return  <OfferteContainer floors={[floor]} handleDownloadPdf={handleDownloadPdf} index={index + 1}/>
        }
        if(offerteSelected === 'all') {
          return <OfferteContainer floors={[floor]} handleDownloadPdf={handleDownloadPdf} index={index + 1}/>
        }
      })}
    </>
  )
}

const OfferteButtons = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 30px 0;

  button {
    padding: 8px;
    background:   ;
    background: #B7B7B7;
    border: none;
    cursor: pointer;
    color: white;
    text-transform: uppercase;
    border-radius: 0;
    
    &:hover {
      background: #ea7232;
    }
  }
`;

export default Offerte