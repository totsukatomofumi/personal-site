function Section({ ref, children }) {
  return (
    <section
      ref={ref}
      className="translate-z-[0.01px] transform-gpu pb-12 will-change-transform transform-3d"
    >
      {children}
    </section>
  );
}

export default Section;
