import { useTexture } from "@react-three/drei";
import { Vector2, RepeatWrapping } from "three";
import { useStore } from "../store/store";
// Hook to create socket connection
const useCurrentTextures = () => {
  let floors = useStore((store) => store.floors);
  const updateObject = useStore((store) => store.updateObject);
  const allTextures = useStore.getState().scene.textures;

  const textureSettings = {
    planks: {
      meister: {
        repeat: new Vector2(4, 2),
        rotate: -1.5707963268,
      },
      parky: {
        repeat: new Vector2(2, 4),
        rotate: null,
      },
    },

    visgraat: {
      parky: {
        repeat: new Vector2(1, 1),
        rotate: -1.5707963268,
      },
    },
  };

  const textures = [];
  // only include floors that are not loaded yet
  if (allTextures.length) {
    floors = floors.filter((floor) => {
      const result = allTextures.filter((texture) => {
        return texture.floorName === floor.name;
      });
      if (result.length) {
        return false;
      }
      return true;
    });
  }
  // Load the textures for each floor that is not loaded yet;
  const allFloorTexturePaths = [];
  const allFloorNormalMapPaths = [];
  const floorTextureCounts = [];
  floors.forEach((floor) => {
    floorTextureCounts.push({
      floorName: floor.name,
      brand: floor.brand,
      pattern: floor.pattern,
      amount: floor.numberOfTextures,
    });
    // textures for each wood type
    for (let i = 0; i < floor.numberOfTextures; i++) {
      allFloorTexturePaths.push(
        `/textures/${floor.category}/${floor.texture}_${i <= 8 ? "0" : ""}${i + 1}.jpg`
      );
      allFloorNormalMapPaths.push(
        `/textures/${floor.category}/${floor.texture}_${i <= 8 ? "0" : ""}${i + 1}_normal.jpg`
      );
    }
  });
  // Load textures
  const floorTextures = useTexture(allFloorTexturePaths);
  const floorNormalMaps = useTexture(allFloorNormalMapPaths);

  // Apply repeat to all textures
  let currentFloor = 0;
  let currentTexture = 0;
  let texts = [];
  let normals = [];
  floorTextures.forEach((texture, i) => {
    const { floorName, brand, pattern, amount } = floorTextureCounts[currentFloor];
    const { repeat, rotate } = textureSettings[pattern][brand];

    const normal = floorNormalMaps[i];
    texture.repeat = repeat;
    if (rotate) texture.rotation = rotate;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    normal.repeat = repeat;
    if (rotate) normal.rotation = rotate;
    normal.wrapS = RepeatWrapping;
    normal.wrapT = RepeatWrapping;

    texts.push(texture);
    normals.push(normal);
    currentTexture++;
    if (amount === currentTexture) {
      currentTexture = 0;
      currentFloor++;
      textures.push({ floorName, textures: texts, normalMaps: normals });
      texts = [];
      normals = [];
    }
  });
  // Save textures in state
  updateObject("scene", "textures", allTextures.concat(textures));
  return;
};

export default useCurrentTextures;
