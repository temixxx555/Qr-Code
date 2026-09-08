import { getFile } from "@/app/lib/storage";
const types = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
};
export async function GET(request, { params }) {
  try {
    const { name } = await params;
    const bytes = await getFile(name);
    const headers = {
      "Content-Type": types[name.split(".").pop()],
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Accept-Ranges": "bytes",
    };
    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match)
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": "bytes */" + bytes.length },
        });
      const start = Number(match[1]),
        end = match[2]
          ? Math.min(Number(match[2]), bytes.length - 1)
          : bytes.length - 1;
      if (start > end)
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": "bytes */" + bytes.length },
        });
      return new Response(bytes.subarray(start, end + 1), {
        status: 206,
        headers: {
          ...headers,
          "Content-Range": "bytes " + start + "-" + end + "/" + bytes.length,
          "Content-Length": String(end - start + 1),
        },
      });
    }
    return new Response(bytes, {
      headers: { ...headers, "Content-Length": String(bytes.length) },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}
