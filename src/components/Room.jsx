import { useCubeTexture, useGLTF } from "@react-three/drei";

const Room = () => {
  const { nodes, materials } = useGLTF("/room/martens_room-transformed.glb");

  const envMap = useCubeTexture(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], {
    path: "textures/envMap/",
  });

  return (
    <group scale={[7, 7, 7]} position={[0, 0.13, 0]}>
      <mesh geometry={nodes.mesh_tv.geometry}>
        <meshStandardMaterial
          {...materials.mat_tv_screen}
          envMap={envMap}
          roughness={0}
          metalness={0.1}
          color={"black"}
        />
      </mesh>
      <mesh geometry={nodes.mesh_tv_1.geometry} material={materials.mat_tv_front} />
      <mesh geometry={nodes.mesh_tv_2.geometry} material={materials.mat_tv_back} />
      <mesh geometry={nodes.mesh_tv_3.geometry} material={materials.mat_tv_logo} />
      <mesh geometry={nodes.mesh_wall_west.geometry} material={materials.mat_wall_west} />
      <mesh geometry={nodes.mesh_wall_west_1.geometry} material={materials.mat_plint_west} />
      <mesh geometry={nodes.mesh_window.geometry} material={materials.mat_windows_pvc} />
      <mesh geometry={nodes.mesh_window_1.geometry} material={materials.mat_windows_plastic} />
      <mesh geometry={nodes.mesh_window_2.geometry}>
        <meshStandardMaterial envMap={envMap} roughness={0} metalness={0.8} />
      </mesh>
      <mesh geometry={nodes.carpet.geometry} material={materials.mat_carpet} receiveShadow />
      <mesh geometry={nodes.mesh_table.geometry} material={materials.mat_table_wood} castShadow />
      <mesh geometry={nodes.mesh_table_1.geometry} material={materials.mat_table_legs} castShadow />
      <mesh geometry={nodes.ceiling.geometry} material={materials.mat_ceiling} />
      <mesh
        geometry={nodes.mesh_books_table.geometry}
        material={materials.mat_book_table_cover_1}
      />
      <mesh
        geometry={nodes.mesh_books_table_1.geometry}
        material={materials.mat_book_table_pages}
      />
      <mesh
        geometry={nodes.mesh_books_table_2.geometry}
        material={materials.mat_book_table_cover_2}
      />
      <mesh geometry={nodes.mesh_plant.geometry} material={materials.mat_plant_leaves1} />
      <mesh geometry={nodes.mesh_plant_1.geometry} material={materials.mat_plant_stem} />
      <mesh geometry={nodes.mesh_plant_2.geometry} material={materials.mat_plant_leaves2} />
      <mesh geometry={nodes.mesh_plant_3.geometry} material={materials.mat_plant_vase} />
      <mesh geometry={nodes.mesh_plant_4.geometry} material={materials.mat_plant_rocks} />
      <mesh geometry={nodes.mesh_door.geometry} material={materials.mat_door_white} />
      <mesh geometry={nodes.mesh_door_1.geometry} material={materials.mat_door_handle} />
      <mesh geometry={nodes.mesh_painting.geometry} material={materials.mat_painting} />
      <mesh geometry={nodes.mesh_painting_1.geometry} material={materials.mat_painting_wood} />
      <mesh geometry={nodes.mesh_painting_2.geometry} material={materials.mat_painting_white} />
      <mesh geometry={nodes.mesh_wall_north.geometry} material={materials.mat_wall_north} />
      <mesh geometry={nodes.mesh_wall_north_1.geometry} material={materials.mat_plint_north} />
      <mesh geometry={nodes.mesh_wall_south.geometry} material={materials.mat_wall_south} />
      <mesh geometry={nodes.mesh_wall_south_1.geometry} material={materials.mat_plint_south} />
      <mesh geometry={nodes.mesh_wall_east.geometry} material={materials.mat_wall_east} />
      <mesh geometry={nodes.mesh_wall_east_1.geometry} material={materials.mat_plint_east} />
      <mesh geometry={nodes.Mesh002.geometry} material={materials.mat_couch_fabric} />
      <mesh geometry={nodes.Mesh002_1.geometry} material={materials.mat_couch_metal} />
      <mesh geometry={nodes.Cylinder.geometry} material={materials.mat_curtains_metal} />
      <mesh geometry={nodes.Cylinder_1.geometry} material={materials.mat_curtains_fabric} />
    </group>
  );
};

export default Room;
