import Image from "next/image";

export default function AuthVisual() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#22c55e] px-10 py-9 lg:block">
      {/* Decorative circles */}
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-white/20" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full border border-white/20" />
      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full border border-white/20" />

      <div className="relative z-10">
        <h1 className="max-w-[390px] text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[42px]">
          Welcome Back to
          <br />
          Online QR Generator
        </h1>

        <div className="relative mx-auto mt-12 h-[500px] w-[390px]">
          {/* Back cards */}
          <div className="absolute left-10 top-8 h-[455px] w-[300px] rotate-[13deg] rounded-[24px] bg-white/90 shadow-2xl" />
          <div className="absolute left-6 top-6 h-[455px] w-[300px] rotate-[6deg] rounded-[24px] bg-white/95 shadow-2xl" />

          {/* Main card */}
          <div className="absolute left-0 top-0 flex h-[438px] w-[202px] flex-col rounded-[24px] bg-white p-5 shadow-xl">
            <div className="mt-8 flex h-[156px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white">
              <div className="grid h-[126px] w-[126px] place-items-center rounded-lg border border-[#22c55e]/30 bg-white">
                <QrPlaceholder />
              </div>
            </div>

            <p className="mt-7 text-center text-[15px] font-semibold leading-5 text-[#101828]">
              A QR Code for Every
              <br />
              need
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function QrPlaceholder() {
  const cells = [
    "1111111001011111111",
    "1000001011011000001",
    "1011101000011011101",
    "1011101110111011101",
    "1011101001011011101",
    "1000001011101000001",
    "1111111010101111111",
    "0000000011010000000",
    "1011011110010110111",
    "0110100101111001010",
    "1101111010010111101",
    "0010010111101100100",
    "1110101001010111011",
    "0000000010111001000",
    "1111111011101011111",
    "1000001010010010001",
    "1011101011111011101",
    "1011101000101011101",
    "1011101011011011101",
  ];

  return (
    <div
      className="grid h-[104px] w-[104px]"
      style={{
        gridTemplateColumns: `repeat(${cells[0].length}, 1fr)`,
      }}
      aria-label="QR code placeholder"
    >
      {cells.flatMap((row, rowIndex) =>
        [...row].map((cell, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={cell === "1" ? "bg-[#111827]" : "bg-white"}
          />
        )),
      )}
    </div>
  );
}
