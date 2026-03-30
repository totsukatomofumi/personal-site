function Header({ text }) {
  return (
    <header>
      <h1 className="text-4xl font-bold sm:text-5xl" data-type="header">
        {text}
      </h1>
    </header>
  );
}

// SplitText onSplit handler for any post-processing (e.g. SplitText workarounds)
Header.onSplit = (self) => {
  let { lines } = self;

  // Map over lines and replace non-header elements with null
  lines = lines.map((line) => line.querySelector('[data-type="header"]')); // Get the header element within the line, if it exists

  // Apply block-axis (vertical) styles here to avoid SplitText duplicating them on each split element
  lines.forEach((line, index) => {
    if (!line) return;

    const next = lines[index + 1];

    // Add margin-bottom to the last line containing header element
    if (!next) line.classList.add("mb-3.5", "sm:mb-5");
  });
};

export default Header;
