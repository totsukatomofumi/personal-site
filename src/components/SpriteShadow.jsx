function SpriteShadow() {
  return (
    <mesh position={[0, -0.999, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.6, 8]} />
      <meshBasicMaterial color="black" transparent opacity={0.7} />
    </mesh>
  );
}

export default SpriteShadow;
