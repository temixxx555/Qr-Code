import Link from "next/link";
import { plans } from "@/app/lib/billing/access";
import { connectDB } from "@/app/lib/mongodb";
import { money, PLANS } from "@/lib/billing-rules";
export const dynamic = "force-dynamic";
export default async function PricingPage() {
  let catalog = PLANS,
    unavailable = false;
  try {
    await connectDB();
    catalog = await plans();
  } catch {
    unavailable = true;
  }
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Link href="/" className="font-semibold text-emerald-700">
        Smart QR
      </Link>
      <header className="mx-auto my-12 max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-widest text-emerald-600">
          SIMPLE NGN PRICING
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Start free. Grow with Premium.
        </h1>
        <p className="mt-5 leading-7 text-slate-500">
          Dynamic QR codes that evolve with your business. Update content after
          printing and see how people engage.
        </p>
      </header>
      {unavailable && (
        <p role="status" className="mb-5 text-center text-sm text-slate-500">
          Showing standard prices. Current prices will be confirmed at checkout.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((plan) => (
          <section
            key={plan.key}
            className={`rounded-2xl border p-6 ${plan.key === "annual" ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white"}`}
          >
            <h2 className="font-semibold">{plan.label}</h2>
            <p className="mt-5 text-3xl font-bold">{money(plan.amount)}</p>
            <p className="mt-2 text-sm text-slate-500">
              Full payment for {plan.months} month(s)
            </p>
            <ul className="my-7 space-y-3 text-sm text-slate-600">
              <li>Dynamic publishing & editing</li>
              <li>Custom QR designs</li>
              <li>Scan analytics</li>
              <li>Folders & hosted media</li>
            </ul>
            <Link
              href="/dashboard/billing"
              className="block rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white"
            >
              Choose Premium
            </Link>
          </section>
        ))}
      </div>
      <section className="mt-8 rounded-2xl bg-slate-50 p-8">
        <h2 className="text-xl font-semibold">Free, for as long as you need</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          Create and download static WiFi QR codes, preview dynamic pages, and
          earn referral rewards. Personal and Business accounts share the same
          prices. Automatic renewal is optional and clearly shown before
          payment.
        </p>
        <Link
          href="/signup"
          className="mt-5 inline-block font-semibold text-emerald-700"
        >
          Try the QR builder →
        </Link>
      </section>
    </main>
  );
}
