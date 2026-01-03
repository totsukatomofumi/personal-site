function Section({ children, className, ...props }) {
  return (
    <section
      className={`pb-12 perspective-normal ${className || ""}`}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;
