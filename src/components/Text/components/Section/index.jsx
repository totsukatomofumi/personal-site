function Section({ children, className, ...props }) {
  return (
    <section className={`pb-12 ${className || ""}`} {...props}>
      {children}
    </section>
  );
}

export default Section;
