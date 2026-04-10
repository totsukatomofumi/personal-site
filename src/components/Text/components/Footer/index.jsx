function Footer({ text }) {
  return (
    <footer className="transform-3d">
      <small className="block text-sm" data-type="footer">
        {text}
      </small>
    </footer>
  );
}

// SplitText onSplit handler for any post-processing (e.g. SplitText workarounds)
Footer.onSplit = (self) => {
  let { lines } = self;

  // Map over lines and replace non-footer elements with null
  lines = lines.map((line) => line.querySelector('[data-type="footer"]')); // Get the footer element within the line, if it exists

  // Apply block-axis (vertical) styles here to avoid SplitText duplicating them on each split element
  lines.forEach((line, index) => {
    if (!line) return;

    const prev = lines[index - 1];
    const next = lines[index + 1];

    // Add margin-top to the first line containing footer element
    if (!prev) line.classList.add("mt-2.5");

    // Add margin-bottom to the last line containing footer element
    if (!next) line.classList.add("mb-2.5");
  });
};

export default Footer;
