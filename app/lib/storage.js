import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
export function storageRoot() {
  if (process.env.NODE_ENV === "production" && !process.env.UPLOAD_DIR)
    throw new Error(
      "Configure UPLOAD_DIR on persistent storage before uploading.",
    );
  return path.resolve(
    /* turbopackIgnore: true */ process.env.UPLOAD_DIR || ".uploads",
  );
}
export async function putFile(name, bytes) {
  const root = storageRoot();
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(path.join(/* turbopackIgnore: true */ root, name), bytes, {
    flag: "wx",
  });
}
export async function getFile(name) {
  if (!/^[a-f0-9-]+\.(png|jpg|webp|pdf|mp4|webm|mp3|wav|ogg)$/.test(name))
    throw new Error("Invalid file");
  return fs.readFile(
    /* turbopackIgnore: true */ path.join(
      /* turbopackIgnore: true */ storageRoot(),
      name,
    ),
  );
}
