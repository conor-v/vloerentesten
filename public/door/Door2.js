/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/door2-transformed.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Door_frame_2.geometry} material={materials['Door 2 Material.001']}>
        <mesh geometry={nodes.Door_2002.geometry} material={materials['Door 2 Material.001']} position={[0.5, 0.75, -0.06]}>
          <mesh geometry={nodes.Door_2001.geometry} material={materials['Doors glass.001']} position={[-0.5, -0.75, 0.06]} />
          <mesh geometry={nodes.Door_hinge_2_down001.geometry} material={materials['Door 2 Material.001']} position={[-0.5, -0.75, 0.06]} />
          <mesh geometry={nodes.Door_hinge_2_up001.geometry} material={materials['Door 2 Material.001']} position={[-0.5, -0.75, 0.06]} />
          <mesh geometry={nodes.Door_knob_2_back.geometry} material={materials['Door knob Normal.001']} position={[-0.5, -0.75, 0.06]} />
          <mesh geometry={nodes.Door_knob_2_front.geometry} material={materials['Door knob Normal.001']} position={[-0.5, -0.75, 0.06]} />
          <mesh geometry={nodes.Door_lock_2.geometry} material={materials['Door 2 Material.001']} position={[-0.5, -0.75, 0.06]} />
        </mesh>
        <mesh geometry={nodes.Door_hinge_2_down.geometry} material={materials['Door 2 Material.001']} />
        <mesh geometry={nodes.Door_hinge_2_up.geometry} material={materials['Door 2 Material.001']} />
        <mesh geometry={nodes.Door_lock_2001.geometry} material={materials['Door 2 Material.001']} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/door2-transformed.glb')
