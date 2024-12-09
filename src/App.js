import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Helper } from "@react-three/drei";
import * as THREE from "three";
import Map from "./models/Map";

function App() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Canvas frameloop="demand">
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            fov={40}
            position={[27, 9, 0]}
            rotation={
              new THREE.Euler(
                THREE.MathUtils.degToRad(-10),
                THREE.MathUtils.degToRad(90),
                0,
                "YXZ"
              )
            }
          />
          <Map position={[0, 0, 0]} />
          <Environment preset="sunset" />
          <Helper type={THREE.GridHelper} />
          <fog attach="fog" color="white" near={1} far={180} />
        </Suspense>
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="bg-black w-[1px] h-full"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="bg-black w-full h-[1px]"></div>
      </div>
    </div>
  );
}

export default App;
