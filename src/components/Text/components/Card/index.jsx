import { Link } from "../";

function Card({ cover, title, subtitle, link, body, extras }) {
  return (
    <>
      {/* ============== Cover, Title, Subtitle ============== */}
      {(cover || title || subtitle || link) && (
        <header className="transform-3d">
          <div className="no-split grid grid-cols-4 gap-5 py-2.5">
            {/* =============== Left Column =============== */}
            <div className="relative col-span-1">
              {cover &&
                (() => {
                  switch (cover.type) {
                    case "image":
                      return (
                        <div className="absolute h-full w-full">
                          <img
                            src={cover.src}
                            alt={title || ""}
                            className="mx-auto max-h-full max-w-full cursor-pointer drop-shadow-[0.0625rem_0_0_Canvas,-0.0625rem_0_0_Canvas,0_0.0625rem_0_Canvas,0_-0.0625rem_0_Canvas] transition-[border] hover:border-b-2 active:border-b-6"
                            data-event="image-preview" // For delegated click event handling to highest non-split ancestor since GSAP SplitText does not preserve mouse events on the split elements
                          />
                        </div>
                      );
                    case "date":
                      return (
                        <time className="block py-1 text-sm">{`${cover.start} — ${cover.end}`}</time>
                      );
                    default:
                      return null;
                  }
                })()}
            </div>

            {/* =============== Right Column ============== */}
            <div className="col-span-3 flex flex-col gap-5">
              {(title || link) && (
                <h2 className="text-xl font-bold">
                  <span className={`${link ? "me-2" : ""}`}>{title}</span>
                  {link && (
                    <div className="relative inline-block h-7 align-top">
                      <Link
                        href={link}
                        size="1x"
                        className="relative top-[50%] translate-y-[-50%]"
                      />
                    </div>
                  )}
                </h2>
              )}

              {subtitle && <h3 className="text-xl">{subtitle}</h3>}
            </div>
          </div>
        </header>
      )}

      {/* ======================= Body ======================= */}
      {body && (
        <div className="pl-[calc(25%+0.3125rem)] transform-3d">
          <p className="text-sm" data-type="card-body">
            {body}
          </p>
        </div>
      )}

      {/* ====================== Extras ====================== */}
      {extras && (
        <footer className="pl-[calc(25%+0.3125rem)] transform-3d">
          {extras.map((extra, index) => (
            <span
              key={index}
              className="mr-1 inline-block rounded-full border border-[Canvas] bg-gray-200 px-3 py-1 text-gray-800 text-shadow-none"
              data-type="card-extras"
            >
              {extra}
            </span>
          ))}
        </footer>
      )}
    </>
  );
}

Card.onSplit = (self) => {
  const { lines } = self;

  // Apply block-axis (vertical) styles on card body
  const cardBodyLines = lines.map(
    (line) => line.querySelector('[data-type="card-body"]'), // Get the card body element within the line, if it exists
  );

  cardBodyLines.forEach((line, index) => {
    if (!line) return;

    const prev = cardBodyLines[index - 1];
    const next = cardBodyLines[index + 1];

    // Add margin-top to the card body element of the first line
    if (!prev) line.classList.add("mt-2.5");

    // Add margin-bottom to the card body element of the last line
    if (!next) line.classList.add("mb-2.5");
  });

  // Apply block-axis (vertical) styles on card extras
  const cardExtrasLines = lines.map((line) =>
    line.querySelector('[data-type="card-extras"]') ? line : null,
  );

  cardExtrasLines.forEach((line, index) => {
    if (!line) return;

    const prev = cardExtrasLines[index - 1];
    const next = cardExtrasLines[index + 1];

    // Add padding-top to the first line containing card extras
    if (!prev) line.classList.add("pt-2.5");

    // Add gap padding-bottom to every other non-edge lines containing card extras
    if (next) line.classList.add("pb-1");

    // Add padding-bottom to the last line containing card extras
    if (!next) line.classList.add("pb-2.5");
  });
};

export default Card;
