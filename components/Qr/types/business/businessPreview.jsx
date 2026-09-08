import { Picture, Intro, Action } from "../presentation";
export default function BusinessPreview({ content: c }) {
  return (
    <article className="bg-white pb-6">
      <Picture src={c.cover} alt="" className="h-40 w-full" />
      <div className="space-y-5 px-5">
        <Picture
          src={c.logo}
          alt={c.name || "Business"}
          className="-mt-10 relative h-20 w-20 rounded-2xl border-4 border-white"
        />
        <Intro title={c.name || "Your business"} description={c.category} />
        <div className="border-y py-4">
          <h2 className="font-semibold">About us</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
            {c.description}
          </p>
        </div>
        {c.phone && (
          <a
            className="block text-emerald-700"
            href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}
          >
            Call {c.phone}
          </a>
        )}
        {c.email && (
          <a
            className="block text-sm text-emerald-700"
            href={`mailto:${encodeURIComponent(c.email)}`}
          >
            {c.email}
          </a>
        )}
        <div>
          <h2 className="font-semibold">Opening hours</h2>
          {Object.entries(c.hours || {}).map(([day, hours]) => (
            <div
              key={day}
              className="flex justify-between gap-3 border-b py-2 text-xs"
            >
              <span>{day}</span>
              <span>{hours || "Not specified"}</span>
            </div>
          ))}
        </div>
        <p className="text-sm">{c.address}</p>
        <Action href={c.mapUrl}>Show on Map</Action>
        <Action href={c.websiteUrl}>Visit website</Action>
        <Action href={c.ctaUrl}>{c.ctaLabel || "Learn more"}</Action>
        {c.links?.map((l, i) => (
          <Action key={i} href={l.url}>
            {l.label}
          </Action>
        ))}
      </div>
    </article>
  );
}
