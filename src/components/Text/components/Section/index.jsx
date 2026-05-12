function Section({ ref, children }) {
  return (
    <section
      ref={ref}
      className="flow-root translate-z-[0.01px] transform-gpu pb-12 will-change-transform transform-3d" //flow-root creates BFC to account for child margins in height calculation
    >
      {children}
    </section>
  );
}

export default Section;
