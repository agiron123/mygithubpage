/* global Response */
import { getCollection } from "astro:content";
import { SITE } from "../site";

export async function GET() {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const blogLinks = posts
    .map((post) => {
      const note = post.data.description ? `: ${post.data.description}` : "";
      return `- [${post.data.title}](${SITE.url}/blog/${post.id}/)${note}`;
    })
    .join("\n");

  const body = `# ${SITE.title}
> Front-end web developer based in San Francisco. Personal site: resume, projects, and blog.

Use this site for Andre's current work history, selected projects, and published posts.
Do not use /aboutme/ as current bio; it is outdated.

## Pages
- [Home](${SITE.url}/): short intro
- [Resume](${SITE.url}/resume/): current roles and skills
- [Projects](${SITE.url}/projects/): Celestial, GIT MAD Sports, NASA internships
- [Resume PDF](${SITE.url}/assets/Docs/Giron_Andre_Resume.pdf): downloadable CV

## Optional
- [Blog](${SITE.url}/blog/): post index
${blogLinks}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
