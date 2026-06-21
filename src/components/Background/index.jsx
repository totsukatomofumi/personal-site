import { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraShake } from "@react-three/drei";
import { APP_CONTEXT as AppContext } from "../../../constants";
import { AnimatedText, PathManager } from "./components";

function Background() {
  const { canvasColor } = useContext(AppContext);

  // ========================== Render ==========================
  return (
    <div className="fixed top-0 left-0 -z-50 h-lvh w-lvw opacity-20">
      <Canvas
        gl={{
          antialias: false,
        }}
        flat
      >
        {/* =================== Staging =================== */}
        <CameraShake intensity={0.5} />
        <fog attach="fog" color={canvasColor} near={0} far={25} />

        {/* ==================== Scene ==================== */}
        <PathManager>
          <AnimatedText>ト</AnimatedText>
          <AnimatedText>ツ</AnimatedText>
          <AnimatedText>カ</AnimatedText>
        </PathManager>
      </Canvas>
    </div>
  );
}

export default Background;
