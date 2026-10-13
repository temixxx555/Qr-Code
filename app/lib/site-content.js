import "server-only";
import { connectDB } from "@/app/lib/mongodb";
import SiteContent from "@/app/models/SiteContent";
import { withDefaults } from "@/lib/site-content";

/** Public site content with defaults. Never throws, so pages always render. */
export async function getSiteContent() {
  try {
    await connectDB();
    const row = await SiteContent.findById("global").lean();
    return withDefaults(row?.content);
  } catch (error) {
    console.error("Site content unavailable:", error?.message);
    return withDefaults(null);
  }
}
