import { Picture, Intro, Action } from "../presentation";

export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-indigo-50 p-5 text-center">
      <Picture
        src={c.logo}
        alt={c.title || "App"}
        className="mx-auto my-8 h-24 w-24 rounded-[24px] shadow-lg"
      />
      <Intro
        title={c.title || "Your next favorite app"}
        description={c.description}
      />
      <div className="mt-8">
        <Action href={c.iosUrl}>Download on the App Store</Action>
        <Action href={c.androidUrl}>Get it on Google Play</Action>
        <Action href={c.alternativeUrl}>Alternative store</Action>
        <Action href={c.websiteUrl}>Visit website</Action>
      </div>
    </article>
  );
}
