function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " "));
}

/**
 * Turn a rendered page into Markdown for clients that cannot use the
 * hand-written representation. Navigation, scripts, and the footer are
 * dropped so the body is the article text.
 */
export function htmlToMarkdown(html: string): string {
  let source = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  source = source.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  source = source.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "");
  source = source.replace(
    /<header\b[^>]*class="[^"]*site-header[^"]*"[^>]*>[\s\S]*?<\/header>/gi,
    "",
  );
  source = source.replace(
    /<footer\b[^>]*class="[^"]*site-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/gi,
    "",
  );
  source = source.replace(
    /<nav\b[^>]*class="[^"]*site-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi,
    "",
  );

  source = source.replace(
    /<a\b[^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi,
    (_match, doubleQuoted: string, singleQuoted: string, label: string) => {
      const href = doubleQuoted || singleQuoted || "";
      const text = stripTags(label).replace(/\s+/g, " ").trim();
      if (!text) return "";
      return `[${text}](${href})`;
    },
  );

  source = source.replace(
    /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi,
    (_match, inner: string) => {
      return `\n# ${stripTags(inner).replace(/\s+/g, " ").trim()}\n`;
    },
  );
  source = source.replace(
    /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi,
    (_match, inner: string) => {
      return `\n## ${stripTags(inner).replace(/\s+/g, " ").trim()}\n`;
    },
  );
  source = source.replace(
    /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi,
    (_match, inner: string) => {
      return `\n### ${stripTags(inner).replace(/\s+/g, " ").trim()}\n`;
    },
  );
  source = source.replace(
    /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
    (_match, inner: string) => {
      return `\n- ${stripTags(inner).replace(/\s+/g, " ").trim()}\n`;
    },
  );
  source = source.replace(
    /<\/(p|div|section|article|h[1-6]|ul|ol|br)>/gi,
    "\n",
  );
  source = stripTags(source);
  source = source
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return source.length > 0 ? `${source}\n` : "";
}
