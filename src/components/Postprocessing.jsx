import { SoftShadows } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  BrightnessContrast,
  Noise,
  HueSaturation,
} from "@react-three/postprocessing";

function Postprocessing() {
  return (
    <>
      <EffectComposer>
        <BrightnessContrast
          brightness={-0.05} // brightness. min: -1, max: 1
          contrast={0.1} // contrast: min -1, max: 1
        />
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={1} />
        <DepthOfField focusDistance={0.04} focalLength={0.1} bokehScale={3} />
        <HueSaturation
          saturation={-0.225} // saturation in radians
        />
        <Noise opacity={0.02} />
      </EffectComposer>
      <SoftShadows />
    </>
  );
}

export default Postprocessing;
