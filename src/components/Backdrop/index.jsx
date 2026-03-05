import { Canvas } from "@react-three/fiber";
import { AnimatedText, PathControls, PathManager } from "./components";
import * as THREE from "three";

function Backdrop(props) {
  return (
    <div {...props}>
      <Canvas
        gl={{
          toneMapping: THREE.NoToneMapping,
        }}
      >
        {/* <PathManager>
          <AnimatedText>と</AnimatedText>
          <AnimatedText>つ</AnimatedText>
          <AnimatedText>か</AnimatedText>
        </PathManager> */}

        {/* <PathControls>
          <AnimatedText>と</AnimatedText>
          <AnimatedText>つ</AnimatedText>
          <AnimatedText>か</AnimatedText>
        </PathControls> */}
      </Canvas>
    </div>
  );
}

export default Backdrop;
