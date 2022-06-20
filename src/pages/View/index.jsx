import { useState, useEffect } from "react";
import { useStore } from "../../store/store";
//import ArrowSlider from '../../assets/arrowSlider.svg';
import ArrowSlider from "../../assets/chevron-up.svg";
import PictureMode from "../../components/PictureMode";
import CanvasFloor from "../../components/CanvasFloor";
import CanvasDoor from "../../components/CanvasDoor";
import Switch from "../../components/Switch";
import styled from "styled-components";
import RenderView from "../../components/RenderView";
import BackButton from "../../components/BackButton";
import useSocketIo from "../../hooks/useSocketIo";
import { useNavigate } from "react-router-dom";
import Video from "../../assets/video.mp4";
import axios from "axios";

//comps
import ViewAddPopup from "./viewAddPopup";
import ViewDelPopup from "./viewDelPopup";
import ViewSlider from "./viewSlider";
import ViewSwitch from "./viewSwitch";
import LayingPatternSlider from "./LayingPatternSlider";

const View = () => {
  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [sliderOpen, setSliderOpen] = useState(false);
  const [configurator, setConfigurator] = useState(localStorage.getItem("configurator"));
  const meters = useStore((state) => state.client.vierkantemeters);
  const selectedFloors = useStore((state) => state.floors);
  const deleteFloor = useStore((state) => state.deleteFloor);
  const setFloors = useStore((state) => state.setFloors);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const updateSelectedFloor = useStore((state) => state.updateSelectedFloor);
  const [delPopup, setDelPopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const showRoom = useStore((state) => state.config.showRoom);
  const [delFloorQuew, setDelFloorQuew] = useState(null);
  const socket = inRoom ? useSocketIo(localStorage.getItem("room")) : null;
  const navigate = useNavigate();
  const updateObject = useStore((state) => state.updateObject)
  const offertenummer = useStore((state) => state.offerte.offertenummer)

  //vloer weg doen --> (popup delete)
  const handleFloorRemove = (floor) => {
    deleteFloor(floor);

    //timeout voor update array
    setTimeout(() => {
      let floorSelect;

      if (selectedFloors.length > 1 && selectedFloors[0].name === floor.name) {
        floorSelect = selectedFloors[1];
      } else {
        floorSelect = selectedFloors[0];
      }
      updateSelectedFloor(floorSelect);
      setDelPopup(false);

      if (!inRoom) return;
    }, 500);

    let selectedFloors = useStore.getState().floors;
    useStore.subscribe(
      () => {
        selectedFloors = useStore.getState().floors;
      },
      (state) => state.floors
    );

    console.log(selectedFloors);

    socket.emit("get floors", selectedFloors);
    socket.emit("selecteded floor", selectedFloors[0]);
  };

  //voor het toevoegen van de geselecteerde vloeren -->(in addpopup) aan de slider vloeren --> (FloorList)
  const handleAddFloors = (floorsList) => {
    const allSelectedFloors = selectedFloors.concat(floorsList);
    setFloors(allSelectedFloors);
    setAddPopup(false);
    if (!inRoom) return;
    socket.emit("get floors", allSelectedFloors);
  };

  //slider next logic
  const handleNextSlide = (type) => {
    let currentFloor = selectedFloors.indexOf(selectedFloor);
    let nextFloor;

    if (type === "vorige") {
      currentFloor--;

      if (currentFloor === -1) {
        nextFloor = selectedFloors[selectedFloors.length - 1];
      } else {
        nextFloor = selectedFloors[currentFloor];
      }
    }

    if (type === "volgende") {
      currentFloor++;

      if (currentFloor >= selectedFloors.length) {
        nextFloor = selectedFloors[0];
      } else {
        nextFloor = selectedFloors[currentFloor];
      }
    }

    updateSelectedFloor(nextFloor);

    if (!inRoom) return;
    socket.emit("selecteded floor", nextFloor);
  };

  const handleOfferte = async() => {
    if (offertenummer !== "") {
      navigate("/offerte")
    } else {
        await axios.post('https://martens.fluxwebdesign2.be/wp-json/martens/v1/create_offerte', {})
        .then(function (response) {
          updateObject('offerte', 'offertenummer', response.data.offertenummer)
        })
        .catch(function (error) {
          console.log(error);
        });
  
        navigate("/offerte")
    }
  }

  return (
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <BackButton link={"/filters"} />
        {/* {configurator === "floor" && screenMode === "3d" && <Switch />} */}
        <OfferteBtn onClick={() => handleOfferte()}>offerte</OfferteBtn>
        <ViewSwitch socket={socket} />

        {/* {configurator === "door" && <CanvasDoor />}
          {configurator === "closet" && <h1>Kast</h1>} */}
        {showRoom && <RenderView handleNextSlide={handleNextSlide} />}
        <CanvasFloor />

        {!showRoom && <LayingPatternSlider />}

        <Slider sliderOpen={sliderOpen}>
          <SliderHeader>
            <div>
              <SliderHeaderTitle>
                {selectedFloor.name} | {selectedFloor.price_incl} €/m²
                <SliderHeaderTitlePrice sliderOpen={sliderOpen}>
                  {" "}
                  | €{(selectedFloor.price_incl * meters).toFixed(2)} voor {meters}m² (
                  {Math.ceil(meters / selectedFloor.m2_per_box)} dozen)
                </SliderHeaderTitlePrice>
              </SliderHeaderTitle>
            </div>
            <SliderHeaderButtons sliderOpen={sliderOpen}>
              <button onClick={(e) => handleNextSlide("vorige")}>&#8592; vorige</button>
              <button onClick={(e) => handleNextSlide("volgende")}>volgende &#8594;</button>
            </SliderHeaderButtons>
          </SliderHeader>

          <SliderButton sliderOpen={sliderOpen} onClick={() => setSliderOpen(!sliderOpen)}>
            <img src={ArrowSlider} alt="arrow slider icon" />
          </SliderButton>
          {sliderOpen && (
            <ViewSlider
              socket={socket}
              setAddPopup={setAddPopup}
              setDelFloorQuew={setDelFloorQuew}
              setDelPopup={setDelPopup}
            />
          )}
        </Slider>

        {delPopup && (
          <ViewDelPopup
            delFloorQuew={delFloorQuew}
            setDelFloorQuew={setDelFloorQuew}
            setDelPopup={setDelPopup}
            handleFloorRemove={handleFloorRemove}
          />
        )}
        {addPopup && <ViewAddPopup handleAddFloors={handleAddFloors} setAddPopup={setAddPopup} />}
      </div>
    </>
  );
};

/**
 * OFFERTE BUTTON
 */
const OfferteBtn = styled.button`
  position: fixed;
  right: 300px;
  top: 30px;
  z-index: 11;
  background-color: #fff;
  color: #000000;
  width: 125px;
  height: 60px;
  border: none;
  font-size: 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #b0b0b0;
  }
`;

/**
 * BOTTOM SLIDER
 */
const Slider = styled.div`
  position: fixed;
  z-index: 11;
  background: #fff;
  border-top: 2px solid #a14d0d;
  bottom: 0;
  height: ${({ sliderOpen }) => (sliderOpen ? "224px" : "55px")};
  width: 100%;
`;

const SliderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: space-between;
`;

const SliderHeaderTitle = styled.p`
  padding: 10px 10px 10px 40px;
  color: rgb(14, 14, 14);
  font-weight: 600;
  font-size: 20px;
  position: relative;
  top: ${({ sliderOpen }) => (sliderOpen ? "0px" : "7px")};
`;

const SliderHeaderTitlePrice = styled.span`
  display: ${({ sliderOpen }) => (sliderOpen ? "contents" : "none")};
`;

const SliderHeaderButtons = styled.div`
  display: ${({ sliderOpen }) => (sliderOpen ? "none" : "flex")};
  align-items: center;
  gap: 20px;
  position: relative;
  top: 7px;
  margin-right: 165px;

  button {
    border: none;
    padding: 10px;
    font-weight: 300;
    font-size: 15px;
    text-transform: capitalize;
    background-color: #a14d0d;
    font-weight: 300;
    font-size: 15px;
    padding: 10px 20px;
    cursor: pointer;
    color: #ffffff;
  }
`;

const SliderButton = styled.button`
  position: absolute;
  height: ${({ sliderOpen }) => (sliderOpen ? "20%" : "100%")};
  top: ${({ sliderOpen }) => (sliderOpen ? " -45px" : "0px")};
  width: 154px;
  border: none;
  right: 0;
  background: rgba(187, 80, 24);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    transform: rotate(${({ sliderOpen }) => (sliderOpen ? 180 : 0)}deg);
    width: 35%;
  }
`;

export default View;
