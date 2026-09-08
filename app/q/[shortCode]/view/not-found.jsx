export default function NotFound() {
  return (
    <main className="mx-auto my-20 max-w-sm p-6 text-center">
      <h1 className="text-xl font-bold">This QR is unavailable</h1>
      <p className="mt-3 text-sm text-slate-500">
        It may have been paused or removed by its creator.
      </p>
    </main>
  );
}
