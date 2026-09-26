import { existsSync } from "node:fs";
export async function resolve(specifier, context, next) {
  if (specifier === "server-only")
    return {
      url: "data:text/javascript,export default {}",
      shortCircuit: true,
    };
  if (specifier.startsWith("@/")) {
    let url = new URL(`../${specifier.slice(2)}`, import.meta.url);
    if (!existsSync(url)) url = new URL(`${url.href}.js`);
    return next(url.href, context);
  }
  if (
    specifier.startsWith(".") &&
    context.parentURL &&
    !/\.(js|mjs|json)$/.test(specifier)
  ) {
    const url = new URL(`${specifier}.js`, context.parentURL);
    if (existsSync(url)) return next(url.href, context);
  }
  return next(specifier, context);
}
