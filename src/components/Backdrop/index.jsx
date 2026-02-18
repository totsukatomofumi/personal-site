import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "./components";
import * as THREE from "three";

function Backdrop(props) {
  return (
    <div {...props}>
      <Canvas
        gl={{
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <AnimatedText>と</AnimatedText>
      </Canvas>
    </div>
  );
}

export default Backdrop;
