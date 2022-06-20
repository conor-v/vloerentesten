import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const BackButton = ({ link }) => {
  const navigate = useNavigate();

  return (
    <ButtonLink onClick={() => navigate(link)}>
      <ArrowLeft />
      <p>Terug keren</p>
    </ButtonLink>
  )
}

const ButtonLink = styled.div`
  cursor: pointer;
  margin: 50px;
  position: fixed;
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

export default BackButton;