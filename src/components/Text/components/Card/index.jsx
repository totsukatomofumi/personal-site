import { Link } from "../";

function Card({ cover, title, subtitle, link, body, extras }) {
  // ========================== Render ==========================
  // Split into unwrapped pseudo-lines grouped by semantic meaning (e.g. Cover + Title + Subtitle) for individual perspective scroll per-line animation, preserving grid layout for alignment.
  return (
    <>
      {/* ============== Cover, Title, Subtitle ============== */}
      {(cover || title || subtitle || link) && (
        <header className="grid grid-cols-4 gap-3 py-1.5 sm:gap-5 sm:py-2.5">
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
                          className="mx-auto max-h-full max-w-full drop-shadow-[1px_0_0_Canvas,-1px_0_0_Canvas,0_1px_0_Canvas,0_-1px_0_Canvas]"
                        />
                      </div>
                    );
                  case "date":
                    return (
                      <time className="text-xs sm:text-sm">{`${cover.start} — ${cover.end}`}</time>
                    );
                  default:
                    return null;
                }
              })()}
          </div>

          {/* =============== Right Column ============== */}
          <div className="col-span-3 flex flex-col gap-3 sm:gap-5">
            {(title || link) && (
              <h2 className="flex text-sm font-bold sm:text-xl">
                <span className="mr-2">{title}</span>
                {link && (
                  <span className="my-auto inline-flex h-5 w-fit items-center sm:h-7">
                    <Link href={link} size="1x" />
                  </span>
                )}
              </h2>
            )}
            {subtitle && <h3 className="text-sm sm:text-xl">{subtitle}</h3>}
          </div>
        </header>
      )}

      {/* ======================= Body ======================= */}
      {body && (
        <div className="grid grid-cols-4 gap-1.5 py-1.5 sm:gap-2.5 sm:py-2.5">
          {/* =============== Left Column =============== */}
          <div className="col-span-1"></div>

          {/* =============== Right Column ============== */}
          <div className="col-span-3">
            <p className="text-xs sm:text-sm">{body}</p>
          </div>
        </div>
      )}

      {/* ====================== Extras ====================== */}
      {extras && (
        <div className="grid grid-cols-4 gap-1.5 py-1.5 sm:gap-2.5 sm:py-2.5">
          {/* =============== Left Column =============== */}
          <div className="col-span-1"></div>

          {/* =============== Right Column ============== */}
          <div className="col-span-3 flex flex-wrap gap-x-1.5 gap-y-2 py-2">
            {extras.map((extra, index) => (
              <span
                key={index}
                className="inline-block rounded-full border border-[Canvas] bg-gray-200 px-3 py-1 text-xs text-gray-800 text-shadow-none sm:text-sm"
              >
                {extra}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
