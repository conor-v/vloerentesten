import styled from "styled-components";

const PriceFilter = ({setter, getter}) => {
  return (
    <>
      <p style={{marginBottom: "10px"}}>Maximum prijs: €{getter}</p>
      <Slider type="range" value={getter} onInput={(e) => setter(e.target.value)}/>
    </>
  )
}

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 16px;
    width: 36px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -5px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  &::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 16px;
    width: 36px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }

  &::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 16px;
    width: 36px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;

    background: transparent;
    border-color: transparent;
    color: transparent;

    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  &:focus::-webkit-slider-runnable-track {
    background: #9f4414;
  }

  &::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #9f4414;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  &::-ms-fill-lower {
    background: #9f4414;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  &:focus::-ms-fill-lower {
    background: #9f4414;
  }

  &::-ms-fill-upper {
    background: #9f4414;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  &:focus::-ms-fill-upper {
    background: #9f4414;
  }
`;

export default PriceFilter