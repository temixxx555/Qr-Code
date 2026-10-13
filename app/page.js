import FeaturesGrid from "@/components/HomePage/FeatureGrid";
import HowItWorks from "@/components/HomePage/HowItWorks";
import Navbar from "@/components/HomePage/NavBar";
import QRTypesSection from "@/components/HomePage/QrTypeSection";
import SectionOne from "@/components/HomePage/SectionOne";
import QrSection from "@/components/HomePage/QrSectiom";
import CaraoselSection from "@/components/HomePage/CaraoselSection";
import Footer from "@/components/HomePage/Footer";
import AnnouncementBar from "@/components/HomePage/AnnouncementBar";
import GuestRoute from "@/components/auth/GuestRoute";
import { getSiteContent } from "@/app/lib/site-content";

// Site content is edited by administrators, so render on each request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <>
    <GuestRoute>
      <AnnouncementBar content={content} />
      <Navbar />
      <SectionOne content={content} />
      <HowItWorks />
      <FeaturesGrid />
      <QRTypesSection />
      <QrSection />
      <CaraoselSection />
      <Footer content={content} />
      </GuestRoute>
    </>
  );
}
