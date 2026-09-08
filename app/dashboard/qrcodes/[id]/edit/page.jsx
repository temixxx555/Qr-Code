import QrBuilder from "@/components/Qr/QrBuilder";
export default async function Page({ params }) {
  return <QrBuilder id={(await params).id} />;
}
