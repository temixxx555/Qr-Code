export default function Page() {
  return (
    <main className="mx-auto max-w-3xl">
      <p className="text-sm text-emerald-600">Your workspace</p>
      <h1 className="mt-1 text-3xl font-bold">Billing</h1>
      <section className="mt-6 rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">Payments are not enabled</h2>
        <p className="mt-3 text-sm text-slate-500">
          Your QR workspace is available. Subscription checkout and invoices
          will appear here once billing is configured.
        </p>
      </section>
    </main>
  );
}
