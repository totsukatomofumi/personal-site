import { Canvas } from "@react-three/fiber";
import { AnimatedText, PathManager } from "./components";

function Background() {
  // ========================== Render ==========================
  return (
    <div className="fixed top-0 left-0 -z-50 h-lvh w-full">
      <Canvas
        gl={{
          antialias: false,
        }}
        flat
      >
        <PathManager>
          <AnimatedText>と</AnimatedText>
          <AnimatedText>つ</AnimatedText>
          <AnimatedText>か</AnimatedText>
        </PathManager>
      </Canvas>
    </div>
  );
}

export default Background;
