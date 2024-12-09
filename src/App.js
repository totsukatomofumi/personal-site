import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Map from "./models/Map";

function App() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Canvas>
        <Scene />
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

function Scene() {
  useThree(({ camera }) => {
    camera.setFocalLength(50);
    camera.position.set(0, 10, 40);
    camera.rotation.set(THREE.MathUtils.degToRad(-10), 0, 0);
  });
  return (
    <>
      <Map position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

export default App;
