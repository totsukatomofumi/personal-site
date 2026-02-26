import { Canvas } from "@react-three/fiber";
import { AnimatedText, Path, PathControls } from "./components";
import * as THREE from "three";

function Backdrop(props) {
  return (
    <div {...props}>
      <Canvas
        gl={{
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <PathControls>
          <AnimatedText>と</AnimatedText>
          <AnimatedText>つ</AnimatedText>
          <AnimatedText>か</AnimatedText>
        </PathControls>
      </Canvas>
    </div>
  );
}

export default Backdrop;
