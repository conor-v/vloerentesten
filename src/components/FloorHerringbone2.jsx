import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BoxGeometry, RepeatWrapping, Vector2 } from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, useTexture } from "@react-three/drei";
import { useStore } from "../store/store";
import floors from "../data/herringbone-floors.json";

const FloorHerringbone = () => {
  const config = useStore((state) => state.config);
  const { herringboneTexture: currentTexture, refresh, showRoom } = config;
  const floor = useStore((state) => state.herringbone);
  const { totalLength, totalWidth, totalLengthWithRoom, totalWidthWithRoom } = floor;
  const isMounted = useRef(false);
  const floorGroupRef = useRef();

  const [instancesArray, setInstancesArray] = useState([]);
  const [instances, setInstances] = useState([]);
  const [animate, setAnimate] = useState(true);

  const device = localStorage.getItem("device");
  const screenType = localStorage.getItem("screenType");

  const currentFloor = floors.find((floor) => floor.id === currentTexture);
  let { type, texture, height, width, length } = currentFloor;

  height = height / 100;
  width = width / 100;
  length = length / 100;

  // Calculate plank sizes based on cm
  if (device === "screen" && screenType === "floor") {
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

  // place texture and normalmap paths in array (8 textures/woodtype)
  const texturePaths = [];
  const normalMapsPaths = [];

  for (let i = 0; i < 8; i++) {
    texturePaths.push(`/textures/${type}/${type}_${texture}_0${i + 1}.jpg`);
    normalMapsPaths.push(`/textures/${type}/${type}_${texture}_0${i + 1}_normal.jpg`);
  }

  // Load textures and normalmaps from texturePaths and normalMapsPaths
  const textures = useTexture(texturePaths);
  const normalMaps = useTexture(normalMapsPaths);

  // Repeat texture (strange values because of unusual UVmap extrudeGeometry)
  const repeat = { x: 0.5, y: 0.5 };

  // Apply repeat to all textures
  [...textures, ...normalMaps].forEach((texture) => {
    texture.repeat = repeat;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
  });
  // Make geometry to reuse in instancedMeshes
  const geometry = new BoxGeometry(width, height, length);

  // Run animation if animate is true
  useLayoutEffect(() => {
    if (!animate) return;
    if (
      !meshesRefDirOne.current ||
      meshesRefDirOne.current.length <= 0 ||
      !meshesRefDirTwo.current ||
      meshesRefDirTwo.current.length <= 0
    )
      return;
    [...meshesRefDirOne.current, ...meshesRefDirTwo.current].forEach((ref) => {
      if (!ref.current) return;
      ref.current.children.forEach((inst) => {
        let posY = { y: inst.position.y };
        const delay = 500 * Math.random();
        const tween = new TWEEN.Tween(posY)
          .to({ y: 0 }, 700)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            inst.position.y = posY.y;
          });
        tween.delay(delay);
        tween.start();
      });
    });
  }, [instances]);

  // Create refs for planks in both directions to be able to manipulate the normalScale
  const meshesRefDirOne = useRef(textures.map(() => createRef()));
  const meshesRefDirTwo = useRef(textures.map(() => createRef()));

  // function to create all the <Instance /> components
  const createObject = (animate) => {
    const amountOfPlanksX = showRoom ? totalLengthWithRoom : totalLength;
    const amountOfPlanksZ = showRoom ? totalWidthWithRoom : totalWidth;
    const instances = [];
    setAnimate(animate);
    for (let i = 0; i < amountOfPlanksZ; i++) {
      const startPosX = i * -width;
      const startPosZ = i * width;
      const posY = animate ? (showRoom ? -2 : 20) : 0;
      for (let index = 0; index < amountOfPlanksX; index++) {
        const randomNumber = Math.floor(Math.random() * textures.length);
        let posX, posZ, rotY, dir;
        if (index % 2 === 0) {
          posX = startPosX + index * (length / 2);
          posZ = startPosZ + index * (length / 2);
          rotY = 0;
          dir = 1;
        } else {
          posX = startPosX + (index - 1) * (length / 2) + (length / 2 + width / 2);
          posZ = startPosZ + (index - 1) * (length / 2) + (length / 2 - width / 2);
          rotY = -Math.PI * 0.5;
          dir = 2;
        }
        instances.push({
          number: randomNumber,
          direction: dir,
          instance: (
            <Instance
              key={index + 1 * i + 1 * Math.random()}
              rotation={[0, rotY, 0]}
              position={[posX, posY, posZ]}
            />
          ),
        });
      }
    }

    setInstancesArray(instances);
    createInstance(instances);
  };

  const createInstance = (instances = instancesArray) => {
    const array = [];
    textures.forEach((texture, i) => {
      array.push(
        <Instances castShadow ref={meshesRefDirOne.current[i]} geometry={geometry}>
          <meshStandardMaterial
            toneMapped={false}
            map={texture}
            normalMap={normalMaps[i]}
            normalScale={new Vector2(1, 1)}
          />
          {instances.map((inst) => {
            if (inst.number === i && inst.direction === 1) return inst.instance;
          })}
        </Instances>
      );
      array.push(
        <Instances castShadow ref={meshesRefDirTwo.current[i]} geometry={geometry}>
          <meshStandardMaterial
            toneMapped={false}
            map={texture}
            normalMap={normalMaps[i]}
            normalScale={new Vector2(0.4, 0.4)}
          />
          {instances.map((inst) => {
            if (inst.number === i && inst.direction === 2) return inst.instance;
          })}
        </Instances>
      );
    });
    setInstances(array);
  };

  useEffect(() => {
    createObject(true);
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    createObject(true);
  }, [showRoom, refresh]);

  useLayoutEffect(() => {
    if (!isMounted.current) return;
    createInstance();
  }, [textures]);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <group
      ref={floorGroupRef}
      position={[showRoom ? -36 : -23, 0, showRoom ? -30 : -15]}
      rotation={[0, Math.PI * 0.25, 0]}
    >
      {instances.map((inst) => inst)}
    </group>
  );
};

export default FloorHerringbone;
