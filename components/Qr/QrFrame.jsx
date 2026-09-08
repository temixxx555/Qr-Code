export default function QrFrame({ frame, frameColor, frameText, qrRef }) {
  const hasText =
    frame !== "none" &&
    frame !== "simple" &&
    frame !== "rounded" &&
    frame !== "shadow";

  const frameClasses = {
    none: "",

    simple: "border-[5px] rounded-lg",

    scan: "border-[5px] rounded-lg overflow-hidden",

    bottom: "rounded-lg overflow-hidden shadow-lg",

    rounded: "border-[7px] rounded-[28px]",

    ticket: "border-[5px] rounded-xl overflow-hidden",

    ribbon: "rounded-xl overflow-visible shadow-lg",

    badge: "border-[6px] rounded-[32px] overflow-hidden",

    shadow: "border-[4px] rounded-lg",

    gift: "border-[5px] rounded-xl overflow-hidden",
  };

  const getWrapperStyle = () => {
    if (
      frame === "simple" ||
      frame === "scan" ||
      frame === "rounded" ||
      frame === "ticket" ||
      frame === "badge" ||
      frame === "gift" ||
      frame === "shadow"
    ) {
      return {
        borderColor: frameColor,
      };
    }

    if (frame === "shadow") {
      return {
        borderColor: frameColor,
        boxShadow: `7px 7px 0 ${frameColor}`,
      };
    }

    return {};
  };

  return (
    <div className="relative p-2">
      {/* RIBBON DECORATION */}

      {frame === "ribbon" && (
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded px-5 py-2 text-[11px] font-bold text-white shadow"
          style={{
            backgroundColor: frameColor,
          }}
        >
          {frameText || "SCAN ME"}
        </div>
      )}

      {/* QR CONTAINER */}

      <div
        className={`relative bg-white ${frameClasses[frame]}`}
        style={getWrapperStyle()}
      >
        {/* GIFT STYLE */}

        {frame === "gift" && (
          <>
            <div
              className="absolute left-1/2 top-0 z-10 h-full w-1.25 -translate-x-1/2"
              style={{
                backgroundColor: frameColor,
              }}
            />

            <div
              className="absolute left-0 top-1/2 z-10 h-1.25 w-full -translate-y-1/2"
              style={{
                backgroundColor: frameColor,
              }}
            />
          </>
        )}

        {/* QR */}

        <div className="relative z-20 bg-white p-2">
          <div ref={qrRef} />
        </div>

        {/* TEXT AREA */}

        {hasText && frame !== "ribbon" && (
          <div
            className={`relative z-20 px-4 py-3 text-center text-sm font-bold ${
              frame === "ticket"
                ? "border-t border-dashed bg-white"
                : "text-white"
            }`}
            style={
              frame === "ticket"
                ? {
                    color: frameColor,
                    borderColor: frameColor,
                  }
                : {
                    backgroundColor: frameColor,
                  }
            }
          >
            {frameText || "Scan me!"}
          </div>
        )}
      </div>
    </div>
  );
}
