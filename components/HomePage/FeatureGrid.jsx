
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  MousePointerClick,
  Layers,
  Palette,
  Download,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    iconColor: "text-[#8b5cf6]",
    iconBg: "bg-[#f3effe]",
    title: "High-tech QR codes",
    description:
      "Access advanced functionalities with our dynamic QR code generator. Customize colors, logout, and log on various QR code types and easily scan them on any device.",
  },
  {
    icon: TrendingUp,
    iconColor: "text-[#22c55e]",
    iconBg: "bg-[#e9fbef]",
    title: "High conversion rates",
    description:
      "Create high-performing codes that accurately represent your brand and design, resulting in high scan rates.",
  },
  {
    icon: BarChart3,
    iconColor: "text-[#6366f1]",
    iconBg: "bg-[#eef0fe]",
    title: "Real-time analytics",
    description:
      "Boost your marketing campaigns with access to real-time analytics for each generated QR code that shows when, where and how many times your QR codes were scanned.",
  },
  {
    icon: MousePointerClick,
    iconColor: "text-[#f97316]",
    iconBg: "bg-[#fff1e7]",
    title: "Easy landing pages",
    description:
      "There's no need for you to build a website. Our custom QR code generator platform can help you quickly and easily create customizable landing pages for all of your QR code needs.",
  },
  {
    icon: Layers,
    iconColor: "text-[#8b5cf6]",
    iconBg: "bg-[#f3effe]",
    title: "Multiple types of QR codes",
    description:
      "Easily create various QR code types with customized options to meet your specific needs. From image QR code to PDF QR code or even video QR code for your right QR code type.",
  },
  {
    icon: Palette,
    iconColor: "text-[#ec4899]",
    iconBg: "bg-[#fdedf5]",
    title: "Full customization",
    description:
      "Bring your QR codes to life by customizing them with endless array of easy-to-use options. Stand out from the competition by having the most eye-catching QR codes out there.",
  },
  {
    icon: Download,
    iconColor: "text-[#3b82f6]",
    iconBg: "bg-[#e9f1fe]",
    title: "Easily download, share & edit",
    description:
      "Keep the highest resolution for your QR codes, no matter what medium you print or display them on. Download in JPG, PNG or SVG and edit their content at any time.",
  },
  {
    icon: Rocket,
    iconColor: "text-[#22c55e]",
    iconBg: "bg-[#e9fbef]",
    title: "Get started now!",
    description:
      "Ready to create your first QR code? Take advantage of our free QR code generator by signing up today!",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="w-full bg-[#fafbfc] px-4 py-12 sm:px-5 sm:py-16 lg:py-12">
      <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#101828] sm:text-5xl md:text-6xl lg:text-6xl">
            Experience the most
            <br className="hidden sm:block" />
            <span className="text-[#22c55e]"> advanced QR code</span> generator
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-gray-500 sm:mt-8 sm:text-lg md:text-[20px] lg:mt-10">
            Our QR code software is highly functional and customizable, yet
            easy to use for all. It&apos;s the only tool you&apos;ll need to
            build powerful, high-performing QR codes that can boost engagement
            and drive conversions.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] sm:p-6 lg:p-8"
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                <feature.icon
                  className={`h-5 w-5 ${feature.iconColor}`}
                  strokeWidth={2}
                />
              </div>

              {/* Title */}
              <h3 className="mt-4 text-base font-semibold leading-snug text-[#101828] sm:text-[17px]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

