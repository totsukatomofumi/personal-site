function Card({ cover, title, subtitle, body, extras }) {
  // ========================== Render ==========================
  return (
    <>
      {/* ============== Cover, Title, Subtitle ============== */}
      {(title || subtitle) && (
        <div className="grid grid-cols-4 gap-3 py-2.5">
          <div className="relative col-span-1">
            {cover && (
              <header>
                {(() => {
                  switch (cover.type) {
                    case "image":
                      return (
                        <div className="absolute w-full h-full">
                          <img
                            src={cover.url}
                            alt={title || subtitle}
                            className="mx-auto max-w-full max-h-full"
                          />
                        </div>
                      );
                    case "date":
                      return (
                        <time className="text-sm">{`${cover.start} — ${cover.end}`}</time>
                      );
                    default:
                      return null;
                  }
                })()}
              </header>
            )}
          </div>
          <div className="col-span-3 flex flex-col gap-5">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {subtitle && <h3 className="text-xl">{subtitle}</h3>}
          </div>
        </div>
      )}

      {/* ======================= Body ======================= */}
      {body && (
        <div className="grid grid-cols-4 gap-3 py-2.5">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <p className="text-sm">{body}</p>
          </div>
        </div>
      )}

      {/* ====================== Extras ====================== */}
      {extras && (
        <div className="grid grid-cols-4 gap-3 py-2.5">
          <div className="col-span-1"></div>
          <div className="col-span-3 flex flex-wrap gap-x-1.5 gap-y-2">
            {extras.map((extra, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm"
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
