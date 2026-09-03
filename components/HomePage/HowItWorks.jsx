
import { FileText, Palette, Download } from "lucide-react";

const steps = [
  {
    icon: FileText,
    iconBg: "bg-[#22c55e]",
    title: "Choose your",
    titleAccent: "QR code content",
    description:
      "Decide what you want to share. You can use URLs, videos, apps, and more!",
  },
  {
    icon: Palette,
    iconBg: "bg-[#8b5cf6]",
    title: "Customize",
    titleAccent: "your design",
    description:
      "Personalize your QR code's color, shape, and style to create a unique design that matches your brand!",
  },
  {
    icon: Download,
    iconBg: "bg-[#3b82f6]",
    title: "Download",
    titleAccent: "your QR code",
    description:
      "Save your QR code as a PNG, SVG, JPG or EPS. Print it or share it digitally!",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#101828] sm:text-4xl md:text-5xl lg:text-[62px] lg:leading-[1.1]">
          Create your
          <br />
          QR code in three{" "}
          <span className="text-[#22c55e]">simple steps</span>
        </h2>

        {/* Steps */}
        <div className="mt-10 flex flex-col gap-10 sm:mt-12 sm:gap-12 md:flex-row md:items-start md:gap-4 lg:mt-14">

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-1 flex-col items-center md:flex-row md:items-start"
            >
              <div className="flex w-full flex-col items-center text-center">

                {/* Icon */}
                <div
                  className={`flex h-18 w-18 items-center justify-center rounded-2xl ${step.iconBg} shadow-lg sm:h-20 sm:w-20 lg:h-23 lg:w-23`}
                >
                  <step.icon
                    className="h-5 w-5 text-white sm:h-6 sm:w-6"
                    strokeWidth={2}
                  />
                </div>

                {/* Title */}
                <p className="mt-4 text-lg font-bold leading-snug text-[#101828] sm:text-xl lg:text-[22px]">
                  {step.title}
                  <br />
                  {step.titleAccent}
                </p>

                {/* Description */}
                <p className="mt-2 max-w-70 text-base leading-relaxed text-gray-500 sm:text-lg lg:max-w-67.5 lg:text-[22px]">
                  {step.description}
                </p>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden flex-1 items-center px-2 pt-10 md:flex lg:pt-11">
                  <div className="h-0.5 w-full border-t-2 border-dotted border-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

