import { Picture, Intro, Action } from "../presentation";
import { vcardText, safeUrl } from "@/lib/qr-content";
export default function VCardPreview({ content: c }) {
  const name =
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    c.name ||
    "Your name";
  return (
    <article className="min-h-full bg-slate-50 pb-6">
      <Picture src={c.cover} alt="" className="h-32 w-full" />
      <div className="px-5">
        <Picture
          src={c.avatar}
          alt={name}
          className="relative -mt-12 mb-4 h-24 w-24 rounded-full border-4 border-white shadow"
        />
        <Intro title={name} description={c.headline} />
        <p className="mt-1 text-sm text-emerald-700">{c.company}</p>
        <p className="my-5 whitespace-pre-line text-sm text-slate-600">
          {c.description}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {c.phone && (
            <a
              className="rounded-xl bg-emerald-600 p-3 text-center text-sm text-white"
              href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}
            >
              Call
            </a>
          )}
          {c.email && (
            <a
              className="rounded-xl bg-white p-3 text-center text-sm shadow-sm"
              href={`mailto:${encodeURIComponent(c.email)}`}
            >
              Email
            </a>
          )}
        </div>
        <Action href={c.websiteUrl}>Website</Action>
        <p className="my-4 text-sm">
          {[c.street, c.city, c.state, c.postalCode, c.country]
            .filter(Boolean)
            .join(", ")}
        </p>
        {c.links?.map((l, i) => (
          <Action key={i} href={safeUrl(l.url)}>
            {l.label}
          </Action>
        ))}
        <a
          download="contact.vcf"
          className="mt-4 block rounded-xl bg-slate-900 p-3 text-center text-sm font-semibold text-white"
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText(c))}`}
        >
          Add Contact
        </a>
      </div>
    </article>
  );
}
