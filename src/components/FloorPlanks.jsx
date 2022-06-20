import { useRef, createRef, useEffect, useState } from "react";
import { MeshStandardMaterial, InstancedMesh, Object3D } from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/store";
import { Vector2 } from "three";

const Floor = () => {
  const { nodes } = useGLTF("/plank/plank-transformed.glb");
  const refresh = useStore((state) => state.config.refresh);
  const layingPattern = useStore((state) => state.config.planksLayingPattern);
  const allTextures = useStore((state) => state.scene.textures);
  const floor = useStore((state) => state.parquet);
  const { totalLength, totalWidth } = floor;
  const isMounted = useRef(false);
  const floorGroupRef = useRef();

  const device = localStorage.getItem("device");
  const screenType = localStorage.getItem("screenType");

  const selectedFloor = useStore((state) => state.selectedFloor);
  let { height, width, length, name } = selectedFloor;

  height = height / 100;
  width = width / 100;
  length = length / 100;

  // Calculate plank sizes based on cm if the current screen is a floor screen
  if (device === "screen" && screenType === "floor") {
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    const screenDiagonal = localStorage.getItem("screenSize");
    const ppi = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) / screenDiagonal; // Math.sqrt(Math.pow(1080, 2) + Math.pow(1920, 2)) / 17.3
    const vFOV = (75 * Math.PI) / 180; //  fov * PI / 180
    const camera = 2 * Math.tan(vFOV / 2) * 5; // 2 * tan(vFOV / 2) * dist-to-camera
    const cubeWidth = ((15 * 0.3937 * ppi) / window.innerHeight) * camera; // ((cm * 0.3937 * ppi)/ window.innerHeight) * camera
    width = cubeWidth; // devided by 2 because model has width of 2
    const cubeLength = ((110 * 0.3937 * ppi) / window.innerHeight) * camera; // ((cm * 0.3937 * ppi)/ window.innerHeight) * camera
    length = cubeLength;
  }

  // get textures and normalMaps for current floor
  const maps = allTextures.find((texture) => {
    return texture.floorName === name;
  });
  const textures = maps.textures;
  const normalMaps = maps.normalMaps;
  // Get geometry from model to reuse with all instancedMeshes
  const geometry = nodes.Cube.geometry;

  // Create InstancedMesh for each texture (no easy way to apply different texture for each instance of instancedMesh)
  const instancedMeshes = [];
  textures.forEach((texture, i) => {
    const textMat = new MeshStandardMaterial({
      envMapIntensity: 1.2,
      toneMapped: false,
      map: texture,
      normalMap: normalMaps[i],
      normalScale: new Vector2(0.5, 0.5),
    });

    const mesh = new InstancedMesh(geometry, textMat, 50);
    instancedMeshes.push(mesh);
  });

  // One ref that contains all the refs of the instancedMeshes (dynamic)
  const meshesRef = useRef(instancedMeshes.map(() => createRef()));

  // set values based on current layingPattern
  let devider;
  let extraPlanks;
  switch (layingPattern) {
    case "halfOffset":
      devider = 2;
      extraPlanks = 1;
      break;
    case "thirdOffset":
      devider = 3;
      extraPlanks = 0;
      break;
    case "fourthOffset":
      devider = 4;
      extraPlanks = 0;
      break;
    default:
      devider = 2;
      extraPlanks = 1;
      break;
  }

  // Loop to generate all the Z and X positions of the planks
  const positions = [];
  const posXOffset = -((totalLength * length) / 2);
  const posZOffset = -((totalWidth / 2) * width);
  for (let index = 0; index < totalWidth; index++) {
    let posX;
    let posZ = posZOffset + index * width;
    if (index % 2 === 0) {
      for (let i = 0; i < totalLength + extraPlanks; i++) {
        posX = posXOffset + 0 + length * i;
        positions.push({ x: posX, z: posZ });
      }
    } else {
      for (let i = 0; i < totalLength; i++) {
        posX = posXOffset + length / devider + length * i;
        positions.push({ x: posX, z: posZ });
      }
    }
  }

  // Function to add instances to the earlier generated instancedMeshes (randomly to create randomness in the floors)
  const createObject = (animate) => {
    TWEEN.removeAll();
    let objects = {};
    const dummy = new Object3D();
    dummy.scale.set(length / 2, height, width / 2);
    const posY = { y: animate ? 20 : 0 };
    positions.forEach((position, i) => {
      const randomNumber = Math.floor(Math.random() * instancedMeshes.length);
      meshesRef.current[randomNumber].current.dispose(); // Clear all previous instances
      objects = { ...objects, [randomNumber]: objects[randomNumber] + 1 || 0 };
      const obj = objects[randomNumber];

      const setMatrix = () => {
        dummy.position.set(position.x, posY.y, position.z);
        dummy.updateMatrix();
        meshesRef.current[randomNumber].current.setMatrixAt(obj, dummy.matrix);
        meshesRef.current[randomNumber].current.instanceMatrix.needsUpdate = true;
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
  }, [layingPattern, selectedFloor]);

  useFrame((state) => {
    TWEEN.update();
  });

  return (
    <group>
      <group ref={floorGroupRef}>
        {instancedMeshes.map((mesh, i) => {
          mesh.instanceMatrix.needsUpdate = true;
          return <instancedMesh ref={meshesRef.current[i]} key={i} {...mesh} castShadow />;
        })}
      </group>
    </group>
  );
};

export default Floor;
