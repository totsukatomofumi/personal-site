import { Link } from "../";

function Card({ cover, title, subtitle, link, body, extras }) {
  // ========================== Render ==========================
  return (
    <>
      {/* ============== Cover, Title, Subtitle ============== */}
      {(title || subtitle || link) && (
        <header className="no-split grid grid-cols-4 gap-3 sm:gap-5 py-1.5 sm:py-2.5">
          <div className="relative col-span-1">
            {cover &&
              (() => {
                switch (cover.type) {
                  case "image":
                    return (
                      <div className="absolute w-full h-full">
                        <img
                          src={cover.url}
                          alt={title || subtitle}
                          className="mx-auto max-w-full max-h-full hover:border-b-2 active:border-b-6 transition-[border] cursor-pointer"
                          data-action="image-preview" // For delegated click handler
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
          <div className="col-span-3 flex flex-col gap-3 sm:gap-5">
            {(title || link) && (
              <h2 className="text-sm sm:text-xl font-bold flex">
                {title}
                {link && (
                  <span className="ml-2 my-auto w-fit h-5 sm:h-7 inline-flex items-center">
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
        <div className="no-split grid grid-cols-4 gap-1.5 sm:gap-2.5 py-1.5 sm:py-2.5">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <p className="text-xs sm:text-sm">{body}</p>
          </div>
        </div>
      )}

      {/* ====================== Extras ====================== */}
      {extras && (
        <div className="no-split grid grid-cols-4 gap-1.5 sm:gap-2.5 py-1.5 sm:py-2.5">
          <div className="col-span-1"></div>
          <div className="col-span-3 flex flex-wrap gap-x-1.5 gap-y-2 py-2">
            {extras.map((extra, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs sm:text-sm"
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
