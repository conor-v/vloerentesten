import styled from "styled-components";

const Checkbox = ({ items, handleFilter, getter, setter }) => {
  return (
    <div style={{ display: "flex", flexFlow: 'column' }}>
    {items.map((item) => (
      <FilterLabel key={item.id} style={{display: item.count > 0 ? "block": "none"}}>
        <input type="checkbox" name={item.name} onChange={(e) => 	handleFilter(e.target.name, getter, setter)} /> {item.name} ({item.count})
      </FilterLabel>
    ))}
  </div>
  );
};

const FilterLabel = styled.label`
  font-size: 18px;
  margin-bottom: 10px;
  text-transform: capitalize;
  cursor: pointer;

  &:first-child {
    margin-top: 10px;
  }

  &:last-child {
    margin-bottom: 0px;
  }
`;

export default Checkbox;
