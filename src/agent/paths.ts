import path from "node:path";

/** Decode a request path, or return null when it tries to escape the site root. */
export function normalizePath(input: string): string | null {
  const raw = input.split("?")[0]?.split("#")[0] ?? "/";
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }

  if (decoded.includes("\0") || decoded.includes("\\")) return null;

  const collapsed = decoded.replace(/\/{2,}/g, "/");
  if (collapsed.split("/").includes("..")) return null;

  let pathname = collapsed;
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

export function isPagePath(pathname: string): boolean {
  if (pathname === "/") return true;
  const extension = path.posix.extname(pathname);
  return extension === "" || extension === ".html";
}

export function htmlRelativePaths(pathname: string): string[] {
  if (pathname === "/" || pathname === "/index.html") return ["index.html"];

  const trimmed = pathname.replace(/^\//, "").replace(/\.html$/, "");
  // `404.html` is the status document, not a page that should answer `/404`.
  if (trimmed === "404") return [];
  return [`${trimmed}/index.html`];
}
