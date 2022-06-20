import { useEffect, useState } from "react";
import styled from "styled-components";
import { useStore } from "../../../store/store";
import floors from "../../../data/floors.json";

import { ReactComponent as Photo } from "../../../assets/photo.svg";
import { ReactComponent as CubeShpere3d } from "../../../assets/3d-cube-sphere.svg";
import { ReactComponent as Refresh } from "../../../assets/refresh.svg";
import { ReactComponent as ChevronDown } from "../../../assets/chevron-down.svg";

const FloorConfig = ({ socket }) => {
  const config = useStore((store) => store.config);
  const updateObject = useStore((store) => store.updateObject);
  const { screenMode, plankTexture, herringboneTexture, floorPattern, floorType, floorBrands } =
    config;

  const [inRoom, setInRoom] = useState(localStorage.getItem("room") !== "no-room");
  const [planks, setPlanks] = useState(null);
  const [herringbone, setHerringbone] = useState(null);
  const [floorBoxes, setFloorBoxes] = useState({
    brand: true,
    type: true,
    pattern: true,
    color: true,
  });

  const handleValueUpdate = (object, field, value) => {
    updateObject(object, field, value);
    if (!inRoom) return;
    socket.emit("active", {
      status: "active",
    });
    socket.emit("store change", { object, field, value });
  };

  const handleBrandSelection = (value) => {
    let brands;
    const currentBrands = brandsInfo.filter((brand) => {
      if (brand.category !== floorType) return;
      return floorBrands.includes(brand.name);
    });

    if (floorBrands.includes(value)) {
      if (currentBrands.length === 1) return;
      brands = floorBrands.filter((brand) => brand !== value);
    } else {
      brands = floorBrands.concat(value);
    }
    handleValueUpdate("config", "floorBrands", brands);
  };

  useEffect(() => {
    setPlanks(false);
    setHerringbone(false);
    floorBrands.forEach((brand) => {
      const curBrand = brandsInfo.find((b) => {
        if (b.category !== floorType) return false;
        return b.name === brand;
      });
      if (!curBrand) return;
      if (curBrand.patterns.includes("planks")) setPlanks(true);
      if (curBrand.patterns.includes("herringbone")) setHerringbone(true);
    });
  }, [floorBrands, floorType]);

  const brandsInfo = [
    {
      name: "meister",
      logo: "/images/logo_meister.svg",
      bgimage: "/images/meister_bg.jpg",
      category: "laminate",
      patterns: ["planks"],
    },
    {
      name: "parky",
      logo: "/images/logo_parky.png",
      bgimage: "/images/parky_bg.jpg",
      category: "parquet",
      patterns: ["planks", "herringbone"],
    },
    {
      name: "the twelve",
      logo: "/images/logo_thetwelve.png",
      bgimage: "/images/parky_bg.jpg",
      category: "parquet",
      patterns: ["planks"],
    },
    {
      name: "cabbani",
      logo: "/images/logo_cabbani.png",
      bgimage: "/images/parky_bg.jpg",
      category: "parquet",
      patterns: ["planks", "herringbone", "chevron-S", "chevon-L"],
    },
    {
      name: "floorify",
      logo: "/images/logo_floorify.png",
      bgimage: "/images/floorify_bg.jpeg",
      category: "vinyl",
      patterns: ["planks", "herringbone"],
    },
  ];

  const handleDropdown = (e) => {
    handleValueUpdate("config", "floorType", e.target.value);
  };

  return (
    <>
      <Buttons>
        {/* <ToggleWrapper>
          <CubeShpere3d />
          <Toggle
            onClick={() =>
              handleValueUpdate("config", "screenMode", screenMode === "3d" ? "picture" : "3d")
            }
          >
            <ToggleDot right={screenMode === "picture"} />
            <ToggleLine />
          </Toggle>
          <Photo />
        </ToggleWrapper> */}
        <RefreshWrapper
          onClick={() => handleValueUpdate("config", "refresh", Math.random() * 1000000 + 1)}
        >
          <Refresh />
        </RefreshWrapper>
      </Buttons>
      <Settings>
        <DropdownBox>
          <Label>Vloertype</Label>
          <Dropdown
            value={floorType}
            name="floortype"
            id="floortype"
            onChange={(e) => handleDropdown(e)}
          >
            <option value="parquet">Parket</option>
            <option value="laminate">Laminaat</option>
            <option value="vinyl">Vinyl</option>
          </Dropdown>
        </DropdownBox>
        <DropdownBox>
          <Label>Merken</Label>
          <ToggleBox>
            <BoxHeader
              open={floorBoxes.brand}
              onClick={() => setFloorBoxes({ ...floorBoxes, brand: !floorBoxes.brand })}
            >
              {brandsInfo.map((brand) => {
                if (brand.category !== floorType) return;
                if (!floorBrands.includes(brand.name)) return;
                return ` ${brand.name},`;
              })}
            </BoxHeader>
            <BoxOptions open={floorBoxes.brand}>
              {brandsInfo.map((brand, i) => {
                if (brand.category !== floorType) return;
                return (
                  <BoxOption
                    key={i}
                    active={floorBrands.includes(brand.name)}
                    onClick={() => handleBrandSelection(brand.name)}
                    bgimage={brand.bgimage}
                  >
                    <OptionContent>
                      <img src={brand.logo} alt={brand.name} />
                    </OptionContent>
                  </BoxOption>
                );
              })}
            </BoxOptions>
          </ToggleBox>
        </DropdownBox>
        <DropdownBox>
          <Label>Patroon</Label>
          <ToggleBox>
            <BoxHeader
              open={floorBoxes.pattern}
              onClick={() => setFloorBoxes({ ...floorBoxes, pattern: !floorBoxes.pattern })}
            >
              {floorPattern}
            </BoxHeader>
            <BoxOptions open={floorBoxes.pattern}>
              <>
                {planks && (
                  <BoxOption
                    active={floorPattern === "planks"}
                    onClick={() =>
                      floorPattern === "planks"
                        ? null
                        : handleValueUpdate("config", "floorPattern", "planks")
                    }
                    bgimage="/images/pattern_planks.svg"
                  ></BoxOption>
                )}
                {herringbone && (
                  <BoxOption
                    active={floorPattern === "herringbone"}
                    onClick={() =>
                      floorPattern === "herringbone"
                        ? null
                        : handleValueUpdate("config", "floorPattern", "herringbone")
                    }
                    bgimage="/images/pattern_herringbone.svg"
                  ></BoxOption>
                )}
              </>
            </BoxOptions>
          </ToggleBox>
        </DropdownBox>
        <DropdownBox>
          <Label>Houtsoort</Label>
          <ToggleBox>
            <BoxHeader
              open={floorBoxes.color}
              onClick={() => setFloorBoxes({ ...floorBoxes, color: !floorBoxes.color })}
            >
              {floors.find((floor) => floor.id === plankTexture).name}
            </BoxHeader>
            <BoxOptions open={floorBoxes.color}>
              {floorPattern === "planks" &&
                floors.map((floor, i) => {
                  if (!floorBrands.includes(floor.brand)) return;
                  if (floor.category !== floorType) return;
                  if (floor.pattern !== floorPattern) return;
                  if (floorPattern === "planks")
                    return (
                      <BoxOption
                        bgimage={floor.thumbnail}
                        key={i}
                        active={plankTexture === floor.id}
                        onClick={() =>
                          plankTexture === floor.id
                            ? null
                            : handleValueUpdate("config", "plankTexture", floor.id)
                        }
                      >
                        <FloorBrand
                          src={brandsInfo.find((b) => b.name === floor.brand).logo}
                          alt=""
                        />
                        <OptionContent>
                          <p>{floor.name}</p>
                        </OptionContent>
                      </BoxOption>
                    );
                  else
                    return (
                      <BoxOption
                        bgimage={floor.thumbnail}
                        key={i}
                        active={herringboneTexture === floor.id}
                        onClick={() =>
                          herringboneTexture === floor.id
                            ? null
                            : handleValueUpdate("config", "herringboneTexture", floor.id)
                        }
                      >
                        <FloorBrand
                          src={brandsInfo.find((b) => b.name === floor.brand).logo}
                          alt=""
                        />
                        <OptionContent>
                          <p>{floor.name}</p>
                        </OptionContent>
                      </BoxOption>
                    );
                })}
            </BoxOptions>
          </ToggleBox>
        </DropdownBox>
      </Settings>
    </>
  );
};

const Label = styled.label`
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #aaa;
`;

const Dropdown = styled.select`
  margin: 4px 0;
  width: 100%;
  padding: 0 12px;
  border: 1px solid #aaa;
  border-radius: 4px;
  height: 40px;
  background-image: url("images/arrow-down.png");
  background-position: right 20px center;
  background-repeat: no-repeat;
  background-size: 10px auto;
  appearance: none;
  outline: none;
  font-size: 1.05rem;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RefreshWrapper = styled.div`
  margin: 1rem;
  cursor: pointer;
  svg {
    width: 35px;
    height: 35px;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin: 1rem;
  svg {
    width: 35px;
    height: 35px;
  }
`;

const Toggle = styled.div`
  position: relative;
  width: 70px;
  cursor: pointer;
`;

const ToggleDot = styled.div`
  width: 30px;
  height: 30px;
  background-color: #bb5018;
  border-radius: 50%;
  position: absolute;
  top: -7.5px;
  left: 0;
  transform: ${({ right }) => (right ? "translateX(40px)" : null)};
  transition: all 0.15s ease-in-out;

  -webkit-box-shadow: 3px 0px 10px 1px rgba(204, 204, 204, 1);
  -moz-box-shadow: 3px 0px 10px 1px rgba(204, 204, 204, 1);
  box-shadow: 3px 0px 10px 1px rgba(204, 204, 204, 1);
`;

const ToggleLine = styled.div`
  width: 100%;
  height: 15px;
  border-radius: 20px;
  background-color: #d0d0d0;
`;

const ToggleBox = styled.div`
  width: 100%;
`;

const Settings = styled.div`
  padding: 1rem;
  overflow: auto;
`;

const DropdownBox = styled.div`
  margin-bottom: 1rem;
`;

const BoxHeader = styled.div`
  width: 100%;
  margin: 4px 0;
  padding: 0 12px;
  border-radius: 4px;
  height: 40px;
  border: 1px solid #aaa;
  background-image: url("images/arrow-down.png");
  background-position: right 20px center;
  background-repeat: no-repeat;
  background-size: 10px auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  text-transform: capitalize;
`;

const BoxOptions = styled.div`
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;
const BoxOption = styled.div`
  position: relative;
  background-color: #bbbbbb;
  background-image: ${({ bgimage }) => `url(${bgimage})`};
  background-size: 210%;
  background-position: center;
  flex: 1 1 calc(33% - 0.5rem);
  max-width: calc(33%);
  border-radius: 4px;
  overflow: hidden;
  height: 120px;
  display: flex;
  border: ${({ active }) => (active ? "3px solid #bb5018" : "3px solid white")};
  cursor: pointer;
`;
const OptionContent = styled.div`
  width: 100%;
  margin-top: auto;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 1rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
    font-size: 0.9rem;
  }

  h3 {
    color: white;
    font-weight: 500;
  }
  img {
    width: 100%;
    height: 40px;
    object-fit: contain;
  }
`;
const FloorBrand = styled.img`
  width: 80px;
  object-fit: contain;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
`;

export default FloorConfig;
