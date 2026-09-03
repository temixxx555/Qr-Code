import {
  HelpCircle,
  Download,
  Users,
  Globe2,
  Briefcase,
  Database,
  Calendar,
  RefreshCw,
  Settings,
} from "lucide-react";

const concepts = [
  {
    icon: HelpCircle,
    title: "What is a QR code generator?",
    description:
      "A QR code generator is a tool that allows you to make your own QR codes. These codes can be customized to contain data of your choice. People can scan these codes on their smartphones and they'll be automatically sent to the content you point them to, whether it's a website, a video or a",
    link: false,
  },
  {
    icon: Download,
    title: "How do I download my QR code?",
    description:
      "You can download your QR codes at any time by logging into your account and exporting them from there. They're available in a variety of different formats including PNG, JPG, SVG and EPS. When you download them, they'll be saved in the highest resolution available.",
    link: true,
  },
  {
    icon: Users,
    title: "Can anyone create a QR code?",
    description:
      "Yes! Our tool is designed so that anyone can create a high-performing QR code with no design experience needed. All it takes is a few clicks. You'll select the options you want and tell us what you want your QR code to do, and our QR code generator will do the rest of the work!",
    link: false,
  },
  {
    icon: Globe2,
    title: "Why are there other websites offering QR code generators for free?",
    description:
      "There are some free QR generators out there, but they only have limited options available and they'll often overlay their own branding on top of it. If you want access to advanced customization and analytics, you'll need a paid tool like the one we offer. With Online QR Generator, you can",
    link: false,
  },
  {
    icon: Briefcase,
    title:
      "Can I use the QR codes generated in the trial period for commercial purposes?",
    description:
      "Of course! Our trial gives you access to everything a paid plan has to offer. So why not take advantage of it and use it for your business?",
    link: false,
  },
  {
    icon: Database,
    title: "What kind of information can be stored in a QR code?",
    description:
      "QR codes can store nearly any type of digital information, including PDF files, websites, app stores, videos, and even Wi-Fi networks. With a simple scan, the possibilities of redirection are virtually limitless.",
    link: true,
  },
  {
    icon: Calendar,
    title: "How long do I have to wait for my QR code?",
    description:
      "We know how busy everyone is in today's day and age, so we're not going to leave you hanging. You'll be able to download your QR codes as soon as your QR code is created. You can start sharing them right away.",
    link: true,
  },
  {
    icon: RefreshCw,
    title: "What's the difference between static and dynamic QR codes?",
    description:
      "Static QR codes are the simplest kind of QR codes and they can't be modified or overwritten at any point in the future. In other words, once you have generated a static QR code, that's it - it cannot be edited. Dynamic QR codes are editable at any time. You can create a dynamic QR code.",
    link: false,
  },
  {
    icon: Settings,
    title: "Can I manage the codes with the QR code generator?",
    description:
      "Absolutely! Once you have signed up for one of our plans, you can easily manage your QR codes. Our easy QR code generator allows you to create, design, save, delete, and modify your codes with ease. You can add logos, frames, colors, edit URLs, and much more. The possibilities are",
    link: false,
  },
];

export default function BasicConceptsSection() {
  return (
    <section className='w-full bg-white pb-6'>
      <div className='mx-auto max-w-7xl px-11'>
        {/* Heading */}
        <h2 className='text-center text-5xl font-bold tracking-tight text-[#101828] '>
          Basic concepts of a <span className='text-[#22c55e]'>QR code</span>
        </h2>

        {/* Grid */}
        <div className='mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {concepts.map((item) => (
            <div
              key={item.title}
              className='group rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(16,24,40,0.04)] transition-all hover:border-[#22c55e] hover:shadow-[0_2px_12px_rgba(34,197,94,0.12)]'
            >
              <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-[#22c55e]'>
                <item.icon
                  className='h-5 w-5 text-gray-500 transition-colors group-hover:text-white'
                  strokeWidth={2}
                />
              </div>

              <h3 className='mt-4 text-[15px] font-semibold leading-snug text-[#101828]'>
                {item.title}
              </h3>

              <p className='mt-2 text-[13px] leading-relaxed text-gray-500'>
                {item.description}
              </p>

              {item.link && (
                <a
                  href='#'
                  className='mt-3 inline-block text-[13px] font-medium text-[#22c55e] hover:underline'
                >
                  Read more
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
