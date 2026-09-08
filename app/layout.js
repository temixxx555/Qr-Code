import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/HomePage/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { DM_Sans } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata = {
  title: "QR Generator | Create, Share & Track",
  description:
    "Create beautiful QR experiences, update your content, and understand your audience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body
        cz-shortcut-listen="true"
        className={`${dmSans.className} flex min-h-full flex-col`}
      >
        <AuthProvider>
          {/* <Navbar /> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
