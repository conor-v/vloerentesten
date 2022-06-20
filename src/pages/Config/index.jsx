import { useState } from "react";
import { useStore } from "../../store/store";

import PictureMode from "../../components/PictureMode";
import CanvasFloor from "../../components/CanvasFloor";
import CanvasDoor from "../../components/CanvasDoor";
import ConfigPanel from "./components/ConfigPanel";
import Switch from "../../components/Switch";

const Config = () => {
  const screenMode = useStore((store) => store.config.screenMode);

  const [configurator, setConfigurator] = useState(localStorage.getItem("configurator"));

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ position: "relative", width: "100%" }}>
          {configurator === "door" && <CanvasDoor />}
          {configurator === "closet" && <h1>Kast</h1>}
          {configurator === "floor" && screenMode === "3d" && <CanvasFloor />}
          {configurator === "floor" && screenMode === "picture" && <PictureMode />}
        </div>
        <ConfigPanel configurator={configurator} />
      </div>
      {configurator === "floor" && screenMode === "3d" && <Switch />}
    </>
  );
};

export default Config;
