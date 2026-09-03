"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      "The majority of Android and iOS smartphones are equipped with an in-built QR code reader within their camera. Simply open your camera, point it at the QR code, and follow the notification that appears. If your smartphone doesn't support QR scanning, you can use a QR code reader app.",
  },

  {
    id: "print",
    question: "How do I print my QR code?",
    answer:
      "Because your QR code can be exported in high resolution, you can use it across both digital and printed materials. Download it in your preferred format and print it from your computer, or provide the file to your designer for use on packaging, posters, flyers, business cards, and other materials.",
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
      "Yes. Dynamic QR codes include scan tracking, allowing you to see how many times your QR code has been scanned and understand when and where your audience is interacting with it.",
  },

  {
    id: "static-dynamic",
    question: "What's the difference between static and dynamic QR codes?",
    answer:
      "Static QR codes contain information that cannot be changed once the code has been generated. Dynamic QR codes use a changeable destination, allowing you to update the content behind the QR code without having to create or reprint the QR code itself.",
  },

  {
    id: "free",
    question: "Can I create a QR code for free?",
    answer:
      "Yes. You can create QR codes online without needing advanced technical knowledge. Simply choose the type of QR code you want, enter your information, customize the design, and generate your QR code.",
  },

  {
    id: "types",
    question: "What types of QR codes can I create?",
    answer:
      "You can create QR codes for different types of content, including websites, text, email addresses, phone numbers, Wi-Fi networks, social media profiles, business information, and other digital content.",
  },

  {
    id: "edit",
    question: "Can I edit my QR code after creating it?",
    answer:
      "It depends on the type of QR code. Static QR codes cannot be changed after they are created. Dynamic QR codes allow you to update the destination or content without creating and printing a new QR code.",
  },

  {
    id: "logo",
    question: "Can I add my logo to a QR code?",
    answer:
      "Yes. You can customize your QR code by adding a logo or brand image to the center. For the best scanning experience, make sure the logo does not cover too much of the QR code and that there is enough contrast between the code and its background.",
  },

  {
    id: "customize",
    question: "Can I customize the design of my QR code?",
    answer:
      "Yes. You can customize different parts of your QR code, including its colors, patterns, corners, frames, and logo. Customizing your QR code allows you to match it with your brand or design.",
  },

  {
    id: "color",
    question: "Can I change the color of my QR code?",
    answer:
      "Yes. You can choose different colors for your QR code to match your branding or design. For reliable scanning, always maintain strong contrast between the QR code and its background.",
  },

  {
    id: "download",
    question: "What format can I download my QR code in?",
    answer:
      "Depending on the available export options, you can download your QR code in formats suitable for digital use and printing. High-resolution formats are recommended when you plan to use your QR code on posters, packaging, signs, or other printed materials.",
  },

  {
    id: "expire",
    question: "Do QR codes expire?",
    answer:
      "Static QR codes do not expire because the information is stored directly inside the code. A dynamic QR code can remain active as long as its destination or QR service remains available.",
  },

  {
    id: "offline",
    question: "Does a QR code need an internet connection to work?",
    answer:
      "Scanning a QR code itself does not always require an internet connection. However, if the QR code directs someone to a website, online form, social media profile, or other online content, an internet connection will generally be required to access that content.",
  },

  {
    id: "phone",
    question: "Can QR codes be scanned on both Android and iPhone?",
    answer:
      "Yes. Most modern Android and iPhone devices can scan QR codes directly using their built-in camera. Open the camera, point it at the QR code, and tap the notification that appears.",
  },

  {
    id: "broken",
    question: "Why isn't my QR code scanning?",
    answer:
      "A QR code may fail to scan if it is too small, blurry, damaged, has insufficient contrast, or contains design elements that interfere with the QR pattern. Try increasing its size, improving the contrast, or removing elements that cover the code.",
  },

  {
    id: "background",
    question: "Does the background color affect QR code scanning?",
    answer:
      "Yes. A QR code should have strong contrast against its background. Avoid backgrounds that are too dark, busy, or similar in color to the QR code, as they can make scanning more difficult.",
  },

  {
    id: "tracking",
    question: "Can I track how many people scan my QR code?",
    answer:
      "Tracking is available with dynamic QR codes when scan analytics are enabled. Depending on the features available, you can use scan data to understand how frequently your QR code is being used and when people interact with it.",
  },

  {
    id: "destination",
    question: "Can I change where my QR code sends people?",
    answer:
      "With a dynamic QR code, you can change the destination without replacing the QR code itself. This is useful when you want to update a website, campaign, promotion, menu, or other online content after the QR code has already been printed.",
  },

  {
    id: "safe",
    question: "Are QR codes safe to use?",
    answer:
      "QR codes are simply a way of storing and sharing information. However, you should always check the destination before entering sensitive information or downloading anything. Only scan QR codes from sources you trust.",
  },

  {
    id: "website",
    question: "Can I use a QR code to share a website?",
    answer:
      "Yes. A website QR code can direct people to a specific webpage simply by scanning it with their smartphone. This makes it easy to connect printed materials with your online content.",
  },

  {
    id: "wifi",
    question: "Can I create a QR code for Wi-Fi?",
    answer:
      "Yes. A Wi-Fi QR code can store your network information so that compatible devices can quickly connect to your Wi-Fi without manually typing the network name and password.",
  },

  {
    id: "social",
    question: "Can I create a QR code for social media?",
    answer:
      "Yes. You can use QR codes to make it easier for people to access social media profiles, pages, or other social content by scanning a code with their smartphone.",
  },

  {
    id: "business-card",
    question: "Can I use a QR code on a business card?",
    answer:
      "Yes. Adding a QR code to a business card can give people quick access to your website, contact information, portfolio, social media profile, or another digital destination.",
  },

  {
    id: "flyer",
    question: "Can I put a QR code on a flyer or poster?",
    answer:
      "Yes. QR codes work well on flyers, posters, brochures, banners, and other printed materials. Make sure the code is large enough to scan easily and has sufficient contrast with the background.",
  },

  {
    id: "reprint",
    question: "Do I need to create a new QR code when I reprint my materials?",
    answer:
      "No. If you are using the same QR code and its destination has not changed, you can reuse the QR code when reprinting your materials. Dynamic QR codes can also be updated without changing the printed code.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div
      className={`
        overflow-hidden rounded-lg border bg-white
        transition-all duration-300
        ${
          isOpen
            ? "border-gray-200 shadow-[0_2px_10px_rgba(16,24,40,0.03)]"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
    >
      {/* Question */}
      <button
        type='button'
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className='
          flex w-full items-center justify-between
          gap-6 px-5 py-5
          text-left
          transition-colors duration-200
          hover:bg-gray-50/60
          sm:px-6
        '
      >
        <span
          className={`
            text-[15px] font-semibold leading-6
            transition-colors duration-200
            sm:text-[16px]
            ${isOpen ? "text-[#101828]" : "text-[#101828]"}
          `}
        >
          {item.question}
        </span>

        <span
          className='
            flex h-7 w-7 shrink-0
            items-center justify-center
            rounded-full
            transition-all duration-300
          '
        >
          <ChevronDown
            strokeWidth={1.8}
            className={`
              h-4 w-4 text-gray-500
              transition-transform duration-300
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          />
        </span>
      </button>

      {/* Answer */}
      <div
        id={`faq-answer-${item.id}`}
        className={`
          grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
          ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className='min-h-0 overflow-hidden'>
          <div className='px-5 pb-5 sm:px-6'>
            <div className='rounded-md border border-gray-100 bg-[#fafafa] px-4 py-3'>
              <p className='text-[13px] leading-6 text-[#667085] sm:text-[14px]'>
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [openId, setOpenId] = useState("");

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className='w-full bg-[#f8f9fa] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-[#101828] sm:text-4xl'>
            FAQs{" "}
          </h2>

          <p className='mt-3 text-sm leading-6 text-[#667085] sm:text-[15px]'>
            Get answers to your questions about Online QR Generator and QR codes
          </p>
        </div>

        {/* FAQ */}
        <div className='mt-10 space-y-3'>
          {scanningQuestions.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
