import { PositionalAudio } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ambienceSoundUrl from "../sounds/ambient.mp3";
import backgroundSoundUrl from "../sounds/background.mp3";

function GlobalSound({ playerRef }) {
  // attach listener to camera
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  useEffect(() => {
    camera.add(listener);

    // listen for gesture events to resume context
    const resumeContext = () => {
      const audioContext = listener.context;
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
    };

    window.addEventListener("touchstart", resumeContext, { once: true });
    window.addEventListener("pointerdown", resumeContext, { once: true });
    window.addEventListener("keydown", resumeContext, { once: true });
    window.addEventListener("mousedown", resumeContext, { once: true });

    return () => {
      window.removeEventListener("touchstart", resumeContext);
      window.removeEventListener("pointerdown", resumeContext);
      window.removeEventListener("keydown", resumeContext);
      window.removeEventListener("mousedown", resumeContext);
      camera.remove(listener);
    };
  }, []);

  // add global sounds
  const ambienceSound = useRef();

  useEffect(() => {
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(ambienceSoundUrl, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.0175);
      sound.play();
    });

    ambienceSound.current = sound;

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera]);

  const backgroundSound = useRef();

  useEffect(() => {
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(backgroundSoundUrl, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.02);
      sound.play();
    });

    backgroundSound.current = sound;

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera]);

  return null;
}
export default GlobalSound;
