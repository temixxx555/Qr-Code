import FeaturesGrid from "@/components/HomePage/FeatureGrid";
import HowItWorks from "@/components/HomePage/HowItWorks";
import Navbar from "@/components/HomePage/NavBar";
import QRTypesSection from "@/components/HomePage/QrTypeSection";
import SectionOne from "@/components/HomePage/SectionOne";
import QrSection from "@/components/HomePage/QrSectiom";
import CaraoselSection from "@/components/HomePage/CaraoselSection";
import Footer from "@/components/HomePage/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GuestRoute from "@/components/auth/GuestRoute";

export default function Home() {
  return (
    <>
    <GuestRoute>
      <Navbar />
      <SectionOne />
      <HowItWorks />
      <FeaturesGrid />
      <QRTypesSection />
      <QrSection />
      <CaraoselSection />
      <Footer />
      </GuestRoute>
    </>
  );
}
