import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Online QR Generator",
  description:
    "How Online QR Generator collects, uses, stores and protects your information.",
};

// ---- Change these if needed ----
const APP_NAME = "Online QR Generator";
const SITE_URL = "https://smartqr.ng";
const CONTACT_EMAIL = "temiq3@gmail.com";
const LAST_UPDATED = "October 20, 2026";
// --------------------------------

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          {APP_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides
          an online tool at{" "}
          <a href={SITE_URL} className="text-blue-600 underline">
            {SITE_URL}
          </a>{" "}
          that lets you create, customize, download and manage QR codes. This
          Privacy Policy explains what information we collect, how we use it,
          who we share it with, and the choices you have.
        </p>
        <p>
          By using {APP_NAME}, you agree to the practices described in this
          policy. If you do not agree, please do not use the service.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    content: (
      <>
        <p className="font-medium text-[#101828]">
          a) Information from Google Sign-In
        </p>
        <p>
          If you choose to sign in with Google, we receive the following basic
          profile information from your Google account:
        </p>
        <ul>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your profile picture</li>
          <li>A unique account identifier (user ID)</li>
        </ul>
        <p>
          We do not receive your Google password, and we do not access your
          Gmail, Google Drive, contacts, calendar or any other Google data.
        </p>

        <p className="font-medium text-[#101828]">b) Content you create</p>
        <p>
          When you use the service while signed in, we store the QR codes you
          create and the details you enter to create them, such as website
          links, text, Wi-Fi details, contact details, design settings (colors,
          shapes, frames) and any logo or image you upload.
        </p>

        <p className="font-medium text-[#101828]">
          c) Scan analytics for dynamic QR codes
        </p>
        <p>
          If you create a dynamic QR code, we record information each time it
          is scanned, including the number of scans, the date and time of each
          scan, the approximate location (such as country or city) and the type
          of device used. We do not collect the name or exact identity of the
          person who scans the code.
        </p>

        <p className="font-medium text-[#101828]">
          d) Technical and usage information
        </p>
        <p>
          Like most websites, we may automatically collect basic technical
          information such as browser type, device type, operating system,
          pages visited and error logs. We use this to keep the service secure
          and working properly.
        </p>

        <p className="font-medium text-[#101828]">e) Cookies and local storage</p>
        <p>
          We use cookies and similar browser storage that are necessary to keep
          you signed in and to remember your basic settings. You can clear or
          block these in your browser settings, but parts of the service may
          stop working.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How we use your information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Create and manage your account and sign you in securely</li>
          <li>Generate, save, display and let you edit or download your QR codes</li>
          <li>Provide scan analytics for your dynamic QR codes</li>
          <li>Maintain, protect and improve the service, and fix problems</li>
          <li>Prevent abuse, spam, fraud and misuse of the service</li>
          <li>Respond to your questions and support requests</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </>
    ),
  },
  {
    id: "google-user-data",
    title: "4. Google user data",
    content: (
      <>
        <p>
          Our use of information received from Google is limited to providing
          and improving the features of {APP_NAME} that you use. Specifically:
        </p>
        <ul>
          <li>
            We use your Google name, email address and profile picture only to
            create your account, identify you in the app and communicate with
            you about your account.
          </li>
          <li>
            We do not sell Google user data, and we do not use it for
            advertising or to build advertising profiles.
          </li>
          <li>
            We do not transfer Google user data to others except as needed to
            provide the service (for example, to our authentication and hosting
            provider), to comply with the law, or with your consent.
          </li>
          <li>
            No humans read your Google user data, unless you ask us to for
            support, it is needed for security or abuse investigation, or the
            law requires it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "5. Who we share information with",
    content: (
      <>
        <p>
          We share information only with service providers that help us run{" "}
          {APP_NAME}, and only as needed to provide the service:
        </p>
        <ul>
          <li>
            <span className="font-medium text-[#101828]">
              Google / Firebase
            </span>{" "}
            for authentication (Google Sign-In), database, file storage and
            hosting.
          </li>
          <li>
            <span className="font-medium text-[#101828]">
              Hosting and infrastructure providers
            </span>{" "}
            that deliver the website to you.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, a court order or
          a valid request from a public authority, or to protect the rights,
          safety and security of our users and the service.
        </p>
        <p>
          The QR codes you create point to the content you choose. If you share
          or print a QR code, anyone who scans it can see where it leads.
        </p>
      </>
    ),
  },
  {
    id: "storage-security",
    title: "6. Data storage and security",
    content: (
      <>
        <p>
          Your data is stored on secure servers provided by Google Firebase,
          which may be located outside Nigeria. We use reasonable technical and
          organizational measures to protect your information, including
          encrypted connections (HTTPS) and access controls. No method of
          transmission or storage is completely secure, so we cannot guarantee
          absolute security.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "7. How long we keep your data",
    content: (
      <>
        <p>
          We keep your account information and QR codes for as long as your
          account is active. If you delete your account or ask us to delete
          your data, we will remove your personal information and saved QR
          codes within a reasonable period, except where we must keep some
          information to comply with the law or resolve disputes. Backups may
          take a short additional time to clear.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your rights and choices",
    content: (
      <>
        <p>
          Depending on where you live, including under the Nigeria Data
          Protection Act 2023, you may have the right to:
        </p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Correct information that is inaccurate or incomplete</li>
          <li>Delete your personal information and account</li>
          <li>Object to or restrict certain uses of your information</li>
          <li>Withdraw your consent at any time</li>
        </ul>
        <p>
          To exercise any of these rights, or to request deletion of your
          account and data, email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>
          . You can also remove {APP_NAME}&apos;s access to your Google account
          at any time from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google Account permissions
          </a>{" "}
          page.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children's privacy",
    content: (
      <>
        <p>
          {APP_NAME} is not directed at children under 13, and we do not
          knowingly collect personal information from them. If you believe a
          child has given us personal information, contact us and we will
          delete it.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "10. Third-party links and QR code destinations",
    content: (
      <>
        <p>
          QR codes created with {APP_NAME} may lead to websites or services
          that we do not own or control. We are not responsible for the privacy
          practices or content of those third parties, and we encourage you to
          read their policies.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to this policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will change the &quot;Last updated&quot; date at the top of this page.
          If the changes are significant, we will take reasonable steps to let
          you know. Continued use of the service after an update means you
          accept the updated policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "12. Contact us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how your data is
          handled, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen w-full bg-[#f8f9fa]">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <QrCode size={20} strokeWidth={2.3} />
          </div>
          <p className="text-[14px] font-semibold text-slate-900 underline hover:text-blue-500">
            Home
          </p>
        </Link>
      </div>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#101828] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[#667085]">
              {APP_NAME} &bull; Last updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Table of contents */}
          <nav
            aria-label="Table of contents"
            className="mt-10 rounded-lg border border-gray-200 bg-white p-5 sm:p-6"
          >
            <p className="text-sm font-semibold text-[#101828]">On this page</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[#667085] hover:text-blue-600 hover:underline"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="mt-6 space-y-4">
            {sections.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6"
              >
                <h2 className="text-lg font-semibold text-[#101828] sm:text-xl">
                  {s.title}
                </h2>
                <div
                  className="
                    mt-3 space-y-3 text-[14px] leading-7 text-[#667085]
                    [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
                  "
                >
                  {s.content}
                </div>
              </article>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#667085]">
            <Link href="/" className="hover:text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/terms" className="hover:text-blue-600 hover:underline">
              Terms of Service
            </Link>
            <Link href="/faq" className="hover:text-blue-600 hover:underline">
              FAQs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}