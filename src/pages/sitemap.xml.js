/* global Response */
import { getCollection } from "astro:content";
import { SITE } from "../site";

export async function GET() {
  const posts = await getCollection("blog");

  const staticPages = ["", "projects", "resume", "blog"];

  const staticEntries = staticPages.map(
    (page) => `
  <url>
    <loc>${SITE.url}/${page ? page + "/" : ""}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`,
  );

  const blogEntries = posts.map(
    (post) => `
  <url>
    <loc>${SITE.url}/blog/${post.id}/</loc>
    <lastmod>${post.data.date.toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join("")}
${blogEntries.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
