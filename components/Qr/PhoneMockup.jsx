export default function PhoneMockup({ children }) {
  return (
    <div className="relative mx-auto w-[290px] max-w-full">
      <div className="absolute -left-1 top-24 h-7 w-1 rounded-l bg-neutral-700" />
      <div className="absolute -left-1 top-36 h-12 w-1 rounded-l bg-neutral-700" />
      <div className="absolute -right-1 top-32 h-14 w-1 rounded-r bg-neutral-700" />
      <div className="relative h-[570px] overflow-hidden rounded-[46px] border-[7px] border-[#252525] bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-white/20">
        <div className="absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-between bg-white px-6 text-[9px] font-bold">
          <span>9:41</span>
          <span>▰ ◒ ▰</span>
        </div>
        <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-black">
          <span className="absolute right-2 top-2 h-1 w-1 rounded-full bg-blue-950" />
        </div>
        <div className="h-full overflow-y-auto overscroll-contain rounded-[35px] pt-9 pb-5 [scrollbar-width:none]">
          {children}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-black/60" />
      </div>
    </div>
  );
}
