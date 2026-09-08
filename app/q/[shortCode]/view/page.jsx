import { loadPublicQr } from "@/app/lib/public-qr";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { authorized } from "@/app/lib/scan-access";
import QrLandingContent from "@/components/Qr/QrLandingContent";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({ params }) {
  const { shortCode } = await params;
  await connectDB();
  const qr = await loadPublicQr(shortCode);
  if (!qr) notFound();
  if (!authorized(qr, (await cookies()).get("qr-access-" + shortCode)?.value))
    redirect("/q/" + shortCode + "/unlock");
  const content = { ...qr.content };
  delete content.password;
  return (
    <main className="mx-auto min-h-screen w-full max-w-lg bg-white shadow-sm">
      <QrLandingContent
        type={qr.type}
        content={JSON.parse(JSON.stringify(content))}
      />
    </main>
  );
}
