import { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraShake } from "@react-three/drei";
import { APP_CONTEXT as AppContext } from "../../../constants";
import { AnimatedText, PathManager } from "./components";

function Background() {
  const { canvasColor } = useContext(AppContext);

  // ========================== Render ==========================
  return (
    <div className="fixed top-0 left-0 -z-50 h-lvh w-full">
      <Canvas
        gl={{
          antialias: false,
        }}
        flat
      >
        {/* =================== Staging =================== */}
        <CameraShake intensity={0.5} />
        <fogExp2 attach="fog" color={canvasColor} density={0.1} />

        {/* ==================== Scene ==================== */}
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
