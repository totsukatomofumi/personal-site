function Section({ ref, children }) {
  return (
    <section ref={ref} className="pb-12 transform-3d">
      {children}
    </section>
  );
}

export default Section;
