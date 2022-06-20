import { createRef, useEffect, useLayoutEffect, useRef } from "react";
import {
  Object3D,
  BoxGeometry,
  RepeatWrapping,
  MeshStandardMaterial,
  InstancedMesh,
  Vector2,
} from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/store";

const FloorHerringbone = () => {
  const config = useStore((state) => state.config);
  const { herringboneTexture: currentTexture, refresh, floorType, floorBrand } = config;
  const allTextures = useStore((state) => state.scene.textures);
  const floor = useStore((state) => state.herringbone);
  const { totalLength, totalWidth, totalLengthWithRoom, totalWidthWithRoom } = floor;
  const isMounted = useRef(false);

  const device = localStorage.getItem("device");
  const screenType = localStorage.getItem("screenType");

  const selectedFloor = useStore((state) => state.selectedFloor);
  let { height, width, length, name } = selectedFloor;

  height = height / 100;
  width = width / 100;
  length = length / 100;

  if (device === "screen" && screenType === "floor") {
    // Calculate plank sizes based on cm
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    const screenDiagonal = localStorage.getItem("screenSize");
    const ppi = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) / screenDiagonal; // Math.sqrt(Math.pow(1080, 2) + Math.pow(1920, 2)) / 17.3
    const vFOV = (75 * Math.PI) / 180; //  fov * PI / 180
    const camera = 2 * Math.tan(vFOV / 2) * 5; // 2 * tan(vFOV / 2) * dist-to-camera
    const cubeWidth = ((7 * 0.3937 * ppi) / window.innerHeight) * camera; // ((cm * 0.3937 * ppi)/ window.innerHeight) * camera
    width = cubeWidth;
    const cubeLength = ((44 * 0.3937 * ppi) / window.innerHeight) * camera;
    ((cm * 0.3937 * ppi) / window.innerHeight) * camera;
    length = cubeLength;
  }

  const maps = allTextures.find((texture) => {
    return texture.floorName === name;
  });
  const textures = maps.textures;
  const normalMaps = maps.normalMaps;

  // Make geometry to reuse in instancedMeshes
  const geometry = new BoxGeometry(width, height, length);

  //  !! DirOne and DirTwo because light influences the way the normal maps are shown,
  //  a different normalScale for both directions is needed

  //  Create InstancedMesh for each texture (no easy way to apply different texture for each instance of instancedMesh)
  const instancedMeshesDirOne = [];
  textures.forEach((texture, i) => {
    const textMat = new MeshStandardMaterial({
      toneMapped: false,
      map: texture,
      normalMap: normalMaps[i],
      normalScale: new Vector2(0.4, 0.4),
    });

    const mesh = new InstancedMesh(geometry, textMat, 5000);
    instancedMeshesDirOne.push(mesh);
  });

  const instancedMeshesDirTwo = [];
  textures.forEach((texture, i) => {
    const textMat = new MeshStandardMaterial({
      toneMapped: false,
      map: texture,
      normalMap: normalMaps[i],
      normalScale: new Vector2(0.4, 0.4),
    });

    const mesh = new InstancedMesh(geometry, textMat, 5000);
    instancedMeshesDirTwo.push(mesh);
  });

  // One ref that contains all the refs of the instancedMeshes (dynamic)
  const meshesRefDirOne = useRef(instancedMeshesDirOne.map(() => createRef()));

  const meshesRefDirTwo = useRef(instancedMeshesDirTwo.map(() => createRef()));

  // Loop to generate all the Z and X positions of the planks
  const positions = [];
  // const posXOffset = -((length / 2 / (length / 4)) * length);
  // const posXOffset = -((amountOfPlanksX * length) / 2);
  // const posZOffset = -((amountOfPlanksZ / 2) * width);
  for (let i = 0; i < totalWidth; i++) {
    const startPosX = i * -width;
    const startPosZ = i * width;
    for (let index = 0; index < totalLength; index++) {
      let posX;
      let posZ;
      if (index % 2 === 0) {
        posX = startPosX + index * (length / 2);
        posZ = startPosZ + index * (length / 2);
        positions.push({ x: posX, z: posZ, direction: 1 });
      } else {
        posX = startPosX + (index - 1) * (length / 2) + (length / 2 + width / 2);
        posZ = startPosZ + (index - 1) * (length / 2) + (length / 2 - width / 2);
        positions.push({ x: posX, z: posZ, direction: 2 });
      }
    }
  }

  const createObject = (animate) => {
    TWEEN.removeAll();
    let objects = {};
    const dummy = new Object3D();
    const posY = { y: animate ? 20 : 0 };
    positions.forEach((position, i) => {
      const randomNumber = Math.floor(Math.random() * (instancedMeshesDirOne.length - 1 - 0 + 1)); // Math.floor(Math.random() * (max - min + 1)) + min;
      const ref = position.direction === 1 ? meshesRefDirOne : meshesRefDirTwo;
      ref.current[randomNumber].current.dispose(); // Clear all previous instances
      objects = { ...objects, [randomNumber]: objects[randomNumber] + 1 || 0 };
      const obj = objects[randomNumber];

      const setMatrix = () => {
        dummy.position.set(position.x, posY.y, position.z);
        const rotY = i % 2 == 0 ? 0 : -Math.PI * 0.5;
        dummy.rotation.set(0, rotY, 0);
        dummy.updateMatrix();
        ref.current[randomNumber].current.setMatrixAt(obj, dummy.matrix);
        ref.current[randomNumber].current.instanceMatrix.needsUpdate = true;
      };
      const tween = new TWEEN.Tween(posY)
        .to({ y: 0 }, 700)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          setMatrix();
        });
      const delay = animate ? 200 + 500 * Math.random() : 0;
      tween.delay(delay);
      tween.start();
    });
  };

  useEffect(() => {
    createObject(true);
    isMounted.current = true;
    return () => {
      TWEEN.removeAll();
    };
  }, [refresh]);

  useEffect(() => {
    if ((isMounted.current = false)) return;
    createObject(false);
    isMounted.current = true;
  }, [selectedFloor]);

  useFrame((state) => {
    TWEEN.update();
  });

  return (
    <>
      <group position={[-23, 0, -15]} rotation={[0, Math.PI * 0.25, 0]}>
        {instancedMeshesDirOne.map((mesh, i) => {
          mesh.instanceMatrix.needsUpdate = true;
          return <instancedMesh ref={meshesRefDirOne.current[i]} key={i} {...mesh} />;
        })}
        {instancedMeshesDirTwo.map((mesh, i) => {
          mesh.instanceMatrix.needsUpdate = true;
          return <instancedMesh ref={meshesRefDirTwo.current[i]} key={i} {...mesh} />;
        })}
      </group>
    </>
  );
};

export default FloorHerringbone;
