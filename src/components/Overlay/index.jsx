import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";

const Overlay = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  let idleTimer = null;
  let idleState = false;
  const settingsRef = useRef();

  // hide item after X miliseconds
  const showItem = (time) => {
    clearTimeout(idleTimer);
    if (idleState == true) {
      document.body.style.cursor = "default";

      return setShow(true);
    }
    idleState = false;
    idleTimer = setTimeout(() => {
      idleState = true;
      document.body.style.cursor = "none";
      setShow(false);
    }, time);
  };

  window.addEventListener("mousemove", () => {
    showItem(5000);
  });

  useEffect(() => {
    showItem(5000);
  }, []);

  const handleSettingsClick = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      {show && (
        <Settings ref={settingsRef} onClick={handleSettingsClick}>
          <SettingsIcon />
        </Settings>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 12;
`;

const Settings = styled.div`
  margin: 1rem;
  padding: 0.3rem;
  background-color: #bb5018;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  svg {
    stroke: white;
    cursor: pointer;
    height: 70px;
    width: 70px;
    animation: rotation 1s ease-in-out;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }
`;

export default Overlay;
