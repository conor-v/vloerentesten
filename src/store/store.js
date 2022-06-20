import create from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist } from "zustand/middleware";
import moment from "moment";

const inititalState = {
  scene: {
    textures: [],
  },
  config: {
    screenMode: "picture", //verander terug als je klaar bent met room en sockets
    floorType: "laminate",
    floorBrands: ["meister", "parky", "floorify"],
    floorPattern: "planks",
    planksLayingPattern: "halfOffset",
    plankTexture: "ld1506421",
    herringboneTexture: "ps5008583",
    showRoom: true,
    refresh: null,
    doorOpen: false,
    doorOpenValue: 1,
    currentDoor: 1,
    showBlackbg: false,
    showFrame: true,
  },
  parquet: {
    totalLength: 6,
    totalWidth: 27,
  },
  herringbone: {
    totalLength: 16,
    totalWidth: 34,
  },
  client: {
    vierkantemeters: 1,
  },
  offerte: {
    naam: "",
    email: "",
    straat: "",
    gemeente: "",
    land: "België",
    nummer: "",
    datum: moment().format("DD/MM/YYYY"),
    offertenummer: "",
    vervaldatum: moment().add(10, "days").format("DD/MM/YYYY"),
    notities: "",
    isKlant: true,
    generatePdf: false,
  },
};

export const useStore = create((set) => ({
  ...{ ...inititalState },
  updateObject: (object, field, value) =>
    set(
      (state) =>
        (state = {
          ...state,
          [object]: { ...state[object], [field]: value },
        })
    ),
  resetState: (object) =>
    set(
      (state) =>
        (state = {
          ...state,
          [object]: { ...inititalState[object] },
        })
    ),

  /**
   * floors
   */
  floors: [],
  filterFloor: (value) =>
    set((state) => {
      if (state.floors.includes(value)) {
        return {
          floors: state.floors.filter((floor) => floor.id !== value.id),
        };
      } else {
        return {
          floors: [...state.floors, value],
        };
      }
    }),

  setFloors: (value) => set((state) => ({ floors: [...value] })),
  addFloor: (value) => set((state) => ({ floors: [...state.floors, value] })),

  deleteFloor: (value) =>
    set((state) => ({ floors: state.floors.filter((floor) => floor.id !== value.id) })),

  resetFloor: () => set((state) => ({ floors: [] })),

  updateFloors: (data) =>
    set((state) => ({
      floors: data,
    })),

  /**
   * selectedFloor
   */
  selectedFloor: {},
  updateSelectedFloor: (value) =>
    set((state) => ({
      selectedFloor: value,
    })),

  /**
   * doors
   */
  doors: [],
  filterDoor: (value) =>
    set((state) => {
      if (state.doors.includes(value)) {
        return {
          doors: state.doors.filter((door) => door.id !== value.id),
        };
      } else {
        return {
          doors: [...state.doors, value],
        };
      }
    }),

  setDoors: (value) => set((state) => ({ doors: [...value] })),
  addDoor: (value) => set((state) => ({ doors: [...state.doors, value] })),

  deleteDoor: (value) =>
    set((state) => ({ doors: state.doors.filter((door) => door.id !== value.id) })),

  resetDoor: () => set((state) => ({ doors: [] })),

  updateDoors: (data) =>
    set((state) => ({
      doors: data,
    })),

  /**
   * selectedDoor
   */
  selectedDoor: {},
  updateSelectedDoor: (value) =>
    set((state) => ({
      selectedDoor: value,
    })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}
