import { preferredType, type ProducedType } from "./accept.ts";
import { authoredMarkdown, notFoundMarkdown } from "./documents.ts";
import { htmlToMarkdown } from "./html-to-markdown.ts";
import { isPagePath, normalizePath } from "./paths.ts";

export const HTML_CONTENT_TYPE = "text/html; charset=utf-8";
export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

export type Negotiation =
  | { kind: "invalid-path" }
  | { kind: "asset"; pathname: string }
  | { kind: "not-acceptable" }
  | { kind: "html"; pathname: string }
  | { kind: "markdown"; pathname: string; body: string; status: 200 }
  | { kind: "markdown-from-html"; pathname: string };

export function negotiate(
  requestPath: string,
  accept: string | null,
): Negotiation {
  const pathname = normalizePath(requestPath);
  if (!pathname) return { kind: "invalid-path" };
  if (!isPagePath(pathname)) return { kind: "asset", pathname };

  const chosen: ProducedType | null = preferredType(accept);
  if (chosen === null) return { kind: "not-acceptable" };
  if (chosen === "text/html") return { kind: "html", pathname };

  const body = authoredMarkdown(pathname);
  if (body) return { kind: "markdown", pathname, body, status: 200 };
  return { kind: "markdown-from-html", pathname };
}

export function markdownResponseHeaders(): Record<string, string> {
  return {
    "Content-Type": MARKDOWN_CONTENT_TYPE,
    Vary: "Accept",
    "X-Content-Type-Options": "nosniff",
    Link: '</llms.txt>; rel="describedby"',
  };
}

export function htmlResponseHeaders(): Record<string, string> {
  return {
    "Content-Type": HTML_CONTENT_TYPE,
    Vary: "Accept",
    "X-Content-Type-Options": "nosniff",
    Link: '</llms.txt>; rel="describedby"',
  };
}

export function notAcceptableBody(): string {
  return "Not acceptable. This site can send text/html or text/markdown.\n";
}

export function markdownFromHtml(html: string | null): {
  status: 200 | 404;
  body: string;
} {
  if (!html) return { status: 404, body: notFoundMarkdown() };
  const body = htmlToMarkdown(html);
  if (!body.trim()) return { status: 404, body: notFoundMarkdown() };
  return { status: 200, body };
}
