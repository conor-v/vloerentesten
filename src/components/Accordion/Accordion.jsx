import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FilterArrow from "./filterArrow.svg";

const AccordionContent = ({ onClick, itemName, itemContent, isActive }) => {
  return (
    <>
      <Header onClick={onClick}>
        {itemName}
        <div></div>
        <HeaderIcon isActive={isActive}>
          <img src={FilterArrow} />
        </HeaderIcon>
      </Header>

      <Content itemName={itemName} isActive={isActive}>
        <Inner id={itemName}>{itemContent}</Inner>
      </Content>
    </>
  );
};

const Accordion = ({ items, multiple }) => {
  const [active, setActive] = useState();
  const [activeArr, setActiveArr] = useState([]);

  let p = [...items].map((item) => {
    return { name: item.name, active: false };
  });

  useEffect(() => {
    setActiveArr(p);
  }, []);

  const handleClick = (name) => {
    setActive(name === active ? null : name);
    if (multiple) {
      let ind = activeArr.findIndex((i) => i.name === name);
      let upd = [...activeArr];
      upd[ind].active = !upd[ind].active;
      setActiveArr(upd);
    }
  };

  return (
    <AccordionContianer>
      {items.map((item, ind) => {
        let isActive = active === item.name;
        if (multiple) isActive = activeArr.some((i) => i.name === item.name && i.active);

        return (
          <AccordionContent
            key={ind}
            onClick={() => handleClick(item.name)}
            itemName={item.name}
            itemContent={item.content}
            isActive={isActive}
          />
        );
      })}
    </AccordionContianer>
  );
};

const AccordionContianer = styled.div`
  overlow: hidden;
  margin-top: 100px;
  margin-bottom: 25px;
`;

const Inner = styled.div`
  padding: 8px;
`;

const Header = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10px;
  font-size: 24px;
  cursor: pointer;
  margin-top: 30px;
  background: transparent;
  border: none;
  color: rgb(14, 14, 14);

  div {
    border-top: 1px solid;
    width: 100%;
    margin: 0 10px;
  }
`;

const HeaderIcon = styled.span`
  transform: rotate(${(props) => (props.isActive ? -90 : 0)}deg);
  transition: all 0.2s;
`;

const Content = styled.div`
  position: relative;
  overflow: hidden;
  height: ${props => {
    return `${props.isActive ? 'fit-content' : '0px'}`;
  }};
  transition: height 0.35s;
  font-size: 12px;
`;

export default Accordion;
