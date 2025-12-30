function SectionTrigger({ className, ...props }) {
  return <div className={`w-full h-screen ${className || ""}`} {...props} />;
}

export default SectionTrigger;
