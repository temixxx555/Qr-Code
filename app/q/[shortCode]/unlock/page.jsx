export const metadata = { robots: { index: false, follow: false } };
export default async function Page({ params, searchParams }) {
  const { shortCode } = await params;
  const { error } = await searchParams;
  return (
    <main className="mx-auto my-20 w-full max-w-sm rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-bold">Protected QR code</h1>
      <p className="my-4 text-sm text-slate-500">
        Enter the password provided by the creator.
      </p>
      <form action={"/q/" + shortCode + "/unlock/verify"} method="post">
        <label className="text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            className="my-2 w-full rounded-lg border p-3"
          />
        </label>
        {error && (
          <p role="alert" className="my-2 text-sm text-red-600">
            Incorrect password or unavailable QR.
          </p>
        )}
        <button className="w-full rounded-lg bg-emerald-600 p-3 text-white">
          Continue
        </button>
      </form>
    </main>
  );
}
