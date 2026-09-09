"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Part 1: Design and creation of QR codes                           */
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

  return (
    <section className="w-full bg-white py-14 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#101828] sm:text-4xl lg:text-6xl">
            <span className="text-[#22c55e]">Design</span>{" "}
            and creation of QR codes
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-8 sm:mt-10">
          <div
            ref={scrollRef}
            className="
              flex
              w-full
              gap-3
              overflow-x-auto
              scroll-smooth
              pb-2
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {designQuestions.map((q) => {
              const isActive = q.id === activeId;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveId(q.id)}
                  className={`
                    shrink-0
                    rounded-xl
                    border
                    px-4
                    py-3.5
                    text-left
                    text-sm
                    font-medium
                    leading-5
                    transition-all
                    duration-200
                    sm:px-5
                    sm:py-4
                    sm:text-base
                    lg:text-lg
                    ${
                      isActive
                        ? "border-[#22c55e] text-[#101828] ring-1 ring-[#22c55e]"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                  style={{
                    width: "clamp(210px, 70vw, 250px)",
                  }}
                >
                  {q.question}
                </button>
              );
            })}
          </div>
        </div>

        {/* Answer */}
        <div
          key={active.id}
          className="
            mt-5
            animate-in
            fade-in
            slide-in-from-bottom-1
            rounded-2xl
            bg-[#f7f9fa]
            p-5
            duration-300
            sm:mt-6
            sm:p-7
            lg:p-8
          "
        >
          <h3 className="text-lg font-semibold leading-7 text-[#101828] sm:text-xl lg:text-2xl">
            {active.question}
          </h3>

          <p className="mt-2 text-sm leading-7 text-gray-500 sm:text-base lg:text-lg">
            {active.answer}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Part 2: Scanning and printing of QR codes                         */
/* ------------------------------------------------------------------ */

const scanningQuestions = [
  {
    id: "add",
    question:
      "Can I add a QR code to my website (and will people be able to scan it)?",
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
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-[0_2px_8px_rgba(16,24,40,0.04)]
      "
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          min-w-0
          items-start
          justify-between
          gap-3
          px-4
          py-4
          text-left
          sm:items-center
          sm:gap-4
          sm:px-6
          sm:py-5
        "
      >
        <span className="min-w-0 flex-1 text-base font-semibold leading-6 text-[#101828] sm:text-lg sm:leading-7 lg:text-xl">
          {item.question}
        </span>

        <ChevronDown
          className={`
            mt-0.5
            h-5
            w-5
            shrink-0
            text-gray-400
            transition-transform
            duration-300
            sm:mt-0
            sm:h-6
            sm:w-6
            ${
              isOpen ? "rotate-180" : ""
            }
          `}
        />
      </button>

      <div
        className={`
          grid
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-w-0 overflow-hidden">
          <p
            className="
              break-words
              px-4
              pb-5
              text-sm
              leading-7
              text-gray-500
              sm:px-6
              sm:pl-8
              sm:text-base
              lg:pl-10
              lg:text-lg
            "
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScanningAccordionSection() {
  const [openIds, setOpenIds] = useState(new Set());

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
    <section className="w-full bg-[#fafbfc] py-14 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#101828] sm:text-4xl lg:text-5xl">
            Scanning and printing of{" "}
            <span className="text-[#22c55e]">
              QR codes
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:mt-10 sm:gap-4">
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
/*  Combined export                                                   */
/* ------------------------------------------------------------------ */

export default function DesignAndScanningSection() {
  return (
    <>
      <DesignTabsSection />
      <ScanningAccordionSection />
    </>
  );
}