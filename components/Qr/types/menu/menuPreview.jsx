import { Picture, Intro } from "../presentation";
import PdfPreview from "../pdf/pdfPreview";
import WebsitePreview from "../website/websitePreview";
export default function MenuPreview({ content: c }) {
  if (c.mode === "pdf") return <PdfPreview content={c} />;
  if (c.mode === "url") return <WebsitePreview content={c} />;
  const price = (v) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: c.currency || "NGN",
        maximumFractionDigits: 2,
      }).format(Number(v || 0));
    } catch {
      return `${c.currency || ""} ${v}`;
    }
  };
  return (
    <article className="min-h-full bg-[#fffbf3] pb-8 text-[#422e20]">
      <Picture src={c.cover} alt="" className="h-36 w-full" />
      <header className="p-5">
        <Picture
          src={c.logo}
          alt={c.name || "Menu"}
          className="mb-3 h-14 w-14 rounded-full"
        />
        <p className="mb-2 text-xs uppercase tracking-[.2em]">
          Freshly prepared
        </p>
        <Intro
          title={c.name || "Your restaurant"}
          description={c.description}
        />
      </header>
      {c.categories?.length ? (
        c.categories.map((cat, i) => (
          <section key={i} className="px-5 py-3">
            <h2 className="mb-4 border-b border-amber-200 pb-2 text-xl font-bold">
              {cat.name}
            </h2>
            {cat.items?.map((item, j) => (
              <div
                key={j}
                className={`mb-5 flex gap-3 ${item.available === false ? "opacity-50" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 text-sm font-semibold">
                    <h3>{item.name}</h3>
                    <span className="shrink-0">{price(item.price)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-70">
                    {item.description}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold text-emerald-700">
                    {item.available === false
                      ? "Currently unavailable"
                      : item.tags}
                  </p>
                </div>
                {item.image && (
                  <Picture
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl"
                  />
                )}
              </div>
            ))}
          </section>
        ))
      ) : (
        <p className="p-5 text-sm opacity-60">
          Add your first category and dishes to see your menu.
        </p>
      )}
      <footer className="px-5 text-xs opacity-60">
        {c.address}
        <br />
        {c.phone}
      </footer>
    </article>
  );
}
