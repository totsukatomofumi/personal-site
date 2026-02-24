import { Canvas } from "@react-three/fiber";
import { AnimatedText, Path } from "./components";
import * as THREE from "three";

function Backdrop(props) {
  return (
    <div {...props}>
      <Canvas
        gl={{
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <Path
          path={
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-5, -5, 0),
              new THREE.Vector3(5, 5, 0),
            ])
          }
          speed={0.04}
        >
          <AnimatedText>と</AnimatedText>
          <AnimatedText>う</AnimatedText>
          <AnimatedText>こ</AnimatedText>
          <AnimatedText>ろ</AnimatedText>
        </Path>
      </Canvas>
    </div>
  );
}

export default Backdrop;
