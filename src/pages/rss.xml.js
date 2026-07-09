/* global Response */
import { getCollection } from "astro:content";
import { SITE } from "../site";

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const items = posts.map((post) => {
    const slug = post.id.replace(/\.mdx?$/, "");
    const link = `${context.site}blog/${slug}/`;
    return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      ${post.data.description ? `<description><![CDATA[${post.data.description}]]></description>` : ""}
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.title}</title>
    <description>${SITE.description}</description>
    <link>${context.site}</link>
    <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
