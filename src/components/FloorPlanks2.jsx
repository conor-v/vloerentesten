import { useLayoutEffect, useRef, createRef, useEffect, useState } from "react";
import { InstancedMesh } from "three";
import instancedExporter from "../utils/instancedExporter";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/store";
import { Vector2, Scene, Mesh } from "three";

const FloorPlanks2 = () => {
  const { nodes } = useGLTF("/plank/plank-transformed.glb");
  const config = useStore((state) => state.config);
  const allTextures = useStore((state) => state.scene.textures);
  const { plankTexture: refresh, showRoom } = config;
  const floorConfig = useStore((state) => state.parquet);
  const { totalLength, totalWidth } = floorConfig;
  const isMounted = useRef(false);
  const floorGroupRef = useRef();

  const [instancesArray, setInstancesArray] = useState([]);
  const [instances, setInstances] = useState([]);
  const [animate, setAnimate] = useState(true);

  const device = localStorage.getItem("device");
  const screenType = localStorage.getItem("screenType");

  const currentFloor = useStore((state) => state.selectedFloor);
  let { height, width, length, name } = currentFloor;
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

  useLayoutEffect(() => {
    if (!animate) return;
    if (!meshesRef.current || meshesRef.current.length <= 0) return;
    meshesRef.current.forEach((ref) => {
      if (!ref.current) return;
      ref.current.children.forEach((inst) => {
        let posY = { y: inst.position.y };
        const delay = 800 * Math.random();
        const tween = new TWEEN.Tween(posY)
          .to({ y: 0 }, 1500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            inst.position.y = posY.y;
          });
        tween.delay(delay);
        tween.start();
      });
    });
  }, [instances]);

  // Function to add instances to the earlier generated instancedMeshes (randomly to create randomness in the floors)
  const createObject = (animate) => {
    const posXOffset = -((totalLength * length) / 2);
    const posZOffset = -((totalWidth / 2) * width);
    const instances = [];
    setAnimate(animate);
    const posY = animate ? (showRoom ? -2 : 30) : 0;
    const scale = [length / 2, height, width / 2];
    for (let index = 0; index < totalWidth; index++) {
      let posX;
      let posZ = posZOffset + index * width;
      if (index % 2 === 0) {
        for (let i = 0; i < totalLength + 1; i++) {
          const randomNumber = Math.floor(Math.random() * textures.length);
          posX = posXOffset + 0 + length * i;
          instances.push({
            number: randomNumber,
            instance: (
              <Instance
                key={index + 1 * i + 1 * Math.random()}
                position={[posX, posY, posZ]}
                scale={scale}
              />
            ),
          });
        }
      } else {
        for (let i = 0; i < totalLength; i++) {
          const randomNumber = Math.floor(Math.random() * textures.length);
          posX = posXOffset + length / 2 + length * i;
          instances.push({
            number: randomNumber,
            instance: (
              <Instance
                key={index + 1 * i + 1 * Math.random()}
                position={[posX, posY, posZ]}
                scale={scale}
              />
            ),
          });
        }
      }
    }
    setInstancesArray(instances);
    createInstance(instances);
  };
  const createInstance = (instances = instancesArray) => {
    const array = textures.map((texture, i) => {
      return (
        <Instances castShadow ref={meshesRef.current[i]} geometry={geometry} key={i}>
          <meshStandardMaterial
            map={texture}
            normalMap={normalMaps[i]}
            toneMapped={false}
            normalScale={new Vector2(0.7, 0.7)}
          />
          {instances.map((inst) => {
            if (inst.number === i) return inst.instance;
          })}
        </Instances>
      );
    });
    setInstances(array);
  };

  useEffect(() => {
    createObject(true);
    isMounted.current = true;
    return () => (meshesRef.current = null);
  }, []);

  // useEffect(() => {
  //   if (!isMounted.current) return;
  //   console.log("run1");
  //   createObject(true);
  // }, [showRoom, refresh]);

  useLayoutEffect(() => {
    if (!isMounted.current) return;
    createInstance();
  }, [textures]);

  const exportInstanced = () => {
    const scene = new Scene();
    const repeat = new Vector2(2, 4);
    for (const i in textures) {
      textures[i];
      textures[i].repeat = repeat;
    }

    // const input = meshesRef.current[2].current;
    let instancedMesh;
    floorGroupRef.current.children.forEach(async (mesh) => {
      mesh.traverse((item) => {
        if (item instanceof InstancedMesh) {
          instancedMesh = item;
        } else {
          const geo = instancedMesh.geometry;
          const mat = instancedMesh.material;
          const mesh = new Mesh(geo, mat);
          mesh.position.x = item.position.x;
          mesh.position.y = item.position.y;
          mesh.position.z = item.position.z;
          mesh.scale.set(length / 2, height, width / 2);
          mesh.setRotationFromEuler(item.rotation);
          scene.add(mesh);
        }
      });
    });
    instancedExporter(scene);

    for (const i in textures) {
      textures[i];
      textures[i].repeat = new Vector2(4, 2);
    }
  };

  // One ref that contains all the refs of the instancedMeshes (dynamic)
  const meshesRef = useRef(textures.map(() => createRef()));

  useFrame((state) => {
    TWEEN.update();
  });
  return <group ref={floorGroupRef}>{instances.map((inst) => inst)}</group>;
};

export default FloorPlanks2;
