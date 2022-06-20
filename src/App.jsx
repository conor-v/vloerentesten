import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Config from "./pages/Config";
import Screen from "./pages/Screen";
import Filters from "./pages/Filters";
import DoorFilters from "./pages/DoorFilters";
import View from "./pages/View";
import Door from "./pages/Door";
import Offerte from "./pages/Offerte";
import OfferteZoeken from "./pages/OfferteZoeken";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("device") === "screen") navigate("/screen");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/screen" element={<Screen />} />
      <Route path="/config" element={<Config />} />
      <Route path="/filters" element={<Filters />} />
      <Route path="/door-filters" element={<DoorFilters />} />
      <Route path="/view" element={<View />} />
      <Route path="/door" element={<Door />} />
      <Route path="/offerte" element={<Offerte />} />
      <Route path="/offerte-zoeken" element={<OfferteZoeken />} />
    </Routes>
  );
};

export default App;
