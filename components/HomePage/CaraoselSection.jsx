"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Part 1: "Design and creation of QR codes" — click-to-swap tabs     */
/* ------------------------------------------------------------------ */

const designQuestions = [
  {
    id: "edit",
    question: "Can I edit my QR codes?",
    answer:
      "Yes! Dynamic QR codes can be edited at any time, even after they've been printed or shared. You can update the destination URL, content, or design without needing to generate a new code.",
  },
  {
    id: "customize",
    question: "Can I customize my QR codes or use different colors?",
    answer:
      "Yes! Our QR code maker tool is specifically designed to make it easier than ever before for you to customize your QR codes by using different designs and colors. You can even use your logo as part of the QR code's design.",
  },
  {
    id: "limit",
    question: "Is there a limit to how many QR codes I can create?",
    answer:
      "It depends on your plan. Free accounts have a limited number of QR codes, while paid plans offer higher limits or unlimited QR code creation depending on the tier you choose.",
  },
  {
    id: "logo",
    question: "Is it possible to include my company's logo in the QR code?",
    answer:
      "Absolutely. You can upload your company logo and place it at the center of your QR code, helping reinforce brand recognition while keeping the code fully scannable.",
  },
];

function DesignTabsSection() {
  const [activeId, setActiveId] = useState("customize");
  const scrollRef = useRef(null);

  const active =
    designQuestions.find((q) => q.id === activeId) ?? designQuestions[0];

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl ">
        {/* Heading */}
        <h2 className="text-center text-5xl font-bold tracking-tight ">
          <span className="text-[#22c55e]">Design</span>{" "}
          <span className="text-[#101828]">and creation of QR codes</span>
        </h2>

        {/* Tabs row with nav arrows */}
        <div className="mt-10 flex items-center gap-3">
          <div
            ref={scrollRef}
            className="flex flex-1 gap-3 overflow-x-auto scroll-smooth pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {designQuestions.map((q) => {
              const isActive = q.id === activeId;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveId(q.id)}
                  className={`shrink-0 rounded-xl border px-5 py-4 text-left text-[20px] font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[#22c55e] text-[#101828] ring-1 ring-[#22c55e]"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                  style={{ minWidth: "230px", maxWidth: "250px" }}
                >
                  {q.question}
                </button>
              );
            })}
          </div>

          {/* Nav arrows */}
          {/* <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div> */}
        </div>

        {/* Answer panel (swaps seamlessly) */}
        <div
          key={active.id}
          className="mt-6 animate-in fade-in slide-in-from-bottom-1 rounded-2xl bg-[#f7f9fa] p-6 duration-300 sm:p-8"
        >
          <h3 className="text-[24px] font-semibold text-[#101828]">
            {active.question}
          </h3>
          <p className="mt-2 text-[20px] leading-relaxed text-gray-500">
            {active.answer}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Part 2: "Scanning and printing of QR codes" — accordion            */
/* ------------------------------------------------------------------ */

const scanningQuestions = [
  {
    id: "add",
    question: "Can I add a QR code to my website (and will people be able to scan it)?",
    answer:
      "You can add QR codes to pretty much anything you can think of, from physical goods and locations to digital properties like websites, applications, emails and social media profiles. People will be able to scan it with any compatible device.",
  },
  {
    id: "scan",
    question: "How do you scan a QR code?",
    answer:
      "The majority of Android and iOS smartphones are equipped with an in-built QR code reader within their camera. However, if your smartphone lacks this feature, you can download an app that enables your device to read QR codes.",
  },
  {
    id: "print",
    question: "How do I print my QR code?",
    answer:
      "Because your QR code will be exported in high resolution, you'll be able to use it however you want to. After downloading it in the desired format, you can print it from your computer, and you can also supply that file to your graphic designers so they can add it to your packaging and your other printed materials.",
  },
  {
    id: "dynamic-data",
    question: "What data is collected in dynamic QR code scans?",
    answer:
      "Dynamic QR code scans can capture data such as the number of scans, the date and time of each scan, the approximate location, and the type of device used, giving you insight into how your audience engages with your code.",
  },
  {
    id: "counter",
    question: "Do QR codes have a scan counter?",
    answer:
      "Yes, dynamic QR codes include a built-in scan counter so you can track exactly how many times your code has been scanned, along with when those scans happened.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[24px] font-semibold text-[#101828] ">
          {item.question}
        </span>
        <ChevronDown
          className={`h-10 w-8 shrink-0 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 ml-10 text-[20px] leading-relaxed text-gray-500">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScanningAccordionSection() {
  // First two open by default, matching the screenshot
  const [openIds, setOpenIds] = useState(new Set([""]));

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="w-full bg-[#fafbfc] ">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <h2 className="text-center text-5xl font-bold tracking-tight text-[#101828] sm:text-4xl">
          Scanning and printing of{" "}
          <span className="text-[#22c55e]">QR codes</span>
        </h2>

        {/* Accordion list */}
        <div className="mt-10 flex flex-col gap-4">
          {scanningQuestions.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Combined export                                                    */
/* ------------------------------------------------------------------ */

export default function DesignAndScanningSection() {
  return (
    <>
      <DesignTabsSection />
      <ScanningAccordionSection />
    </>
  );
}