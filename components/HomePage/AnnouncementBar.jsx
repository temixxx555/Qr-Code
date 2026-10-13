import { safeUrl } from "@/lib/qr-content";

export default function AnnouncementBar({ content }) {
  if (!content?.announcement) return null;
  const href = safeUrl(content.announcementUrl);
  const text = (
    <p className='px-4 py-2.5 text-center text-sm font-medium text-white'>
      {content.announcement}
      {href && <span className='ml-2 underline underline-offset-2'>Learn more →</span>}
    </p>
  );
  return (
    <div className='w-full bg-[#094149]'>
      {href ? (
        <a href={href} className='block transition-colors hover:bg-white/5'>
          {text}
        </a>
      ) : (
        text
      )}
    </div>
  );
}
