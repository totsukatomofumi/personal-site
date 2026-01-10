function Section({ children, className, ...props }) {
  return (
    <section className={`pb-8 sm:pb-12 ${className || ""}`} {...props}>
      {children}
    </section>
  );
}

export default Section;
