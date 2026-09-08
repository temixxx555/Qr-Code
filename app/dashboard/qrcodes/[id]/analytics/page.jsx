import AnalyticsDashboard from "@/components/Qr/AnalyticsDashboard";
export default async function Page({ params }) {
  return <AnalyticsDashboard qrId={(await params).id} />;
}
