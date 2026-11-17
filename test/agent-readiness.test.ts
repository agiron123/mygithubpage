import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { preferredType } from "../src/agent/accept.ts";
import { blocksToPlain } from "../src/agent/blocks.ts";
import {
  aboutBlocks,
  contactVisibleText,
  homeMarkdown,
  homeVisibleText,
  notFoundMarkdown,
  pageVisibleText,
  privacyBlocks,
} from "../src/agent/documents.ts";
import { htmlToMarkdown } from "../src/agent/html-to-markdown.ts";
import { SITE } from "../src/site.ts";
import { startServer } from "../server/serve.ts";

const root = path.resolve(import.meta.dirname, "..");

test("Accept negotiation follows q-values, specificity, and rejections", () => {
  assert.equal(preferredType(null), "text/html");
  assert.equal(preferredType("text/html"), "text/html");
  assert.equal(preferredType("text/markdown"), "text/markdown");
  assert.equal(
    preferredType("text/markdown, text/html;q=0.8"),
    "text/markdown",
  );
  assert.equal(preferredType("text/html, text/markdown;q=0.8"), "text/html");
  assert.equal(preferredType("text/markdown;q=0, text/html"), "text/html");
  assert.equal(preferredType("text/html;q=0, text/markdown;q=0"), null);
  assert.equal(preferredType("application/json"), null);
  assert.equal(preferredType("text/html;q=0, */*"), "text/markdown");
  assert.equal(
    preferredType(
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    ),
    "text/html",
  );
});

test("homepage and trust pages have an H1-sized text body over 500 characters", () => {
  for (const pathname of ["/", "/about", "/contact", "/privacy"]) {
    const visible = pageVisibleText(pathname);
    assert.ok(visible, pathname);
    assert.ok(
      visible.length >= 500,
      `${pathname} has ${visible.length} characters`,
    );
  }

  assert.match(homeMarkdown(), /^# Hi there! I'm Andre!\n/);
  const headings = homeMarkdown().match(/^#{1,6} .+$/gm) ?? [];
  let previousLevel = 0;
  for (const heading of headings) {
    const level = heading.match(/^#+/)?.[0].length ?? 0;
    assert.ok(level <= previousLevel + 1, heading);
    previousLevel = level;
  }

  assert.ok(blocksToPlain(aboutBlocks).includes("San Francisco"));
  assert.ok(contactVisibleText().includes(SITE.email));
  assert.ok(blocksToPlain(privacyBlocks).includes("G-5X8WRPP600"));
  assert.ok(homeVisibleText().includes("Doss"));
});

test("markdown 404 explains the miss and links to llms.txt", () => {
  const body = notFoundMarkdown();
  assert.ok(body.length >= 20);
  assert.match(body, /No page exists/);
  assert.match(body, /https:\/\/andregiron\.me\/llms\.txt/);
  assert.match(body, /https:\/\/andregiron\.me\/sitemap\.xml/);
});

test("html conversion keeps article text and drops navigation", () => {
  const markdown = htmlToMarkdown(`
    <head><title>Resume | Andre S. Giron</title></head>
    <header class="site-header nav-header"><nav class="site-nav">Toggle navigation</nav></header>
    <header class="resume-header"><h1>Resume</h1></header>
    <p>Worked at <a href="/jobs">Aqueduct</a>.</p>
    <footer class="site-footer">Made in San Francisco</footer>
    <script>secret()</script>
  `);
  assert.match(markdown, /^# Resume/m);
  assert.match(markdown, /\[Aqueduct\]\(\/jobs\)/);
  assert.doesNotMatch(markdown, /Toggle navigation/);
  assert.doesNotMatch(markdown, /Andre S\. Giron/);
  assert.doesNotMatch(markdown, /secret/);
});

test("llms.txt names when to use the site and how to call it", () => {
  const llms = fs.readFileSync(path.join(root, "public/llms.txt"), "utf8");
  assert.match(llms, /^# Andre S\. Giron\n/);
  const quoteAt = llms.indexOf("\n> ");
  const firstHeading = llms.indexOf("\n## ");
  assert.ok(quoteAt > 0 && quoteAt < firstHeading);
  assert.match(llms, /^## When to use this$/m);
  assert.match(llms, /Accept: text\/markdown/);
  assert.match(llms, new RegExp(SITE.email.replace(".", "\\.")));
  assert.match(llms, /Do not use this site/);
  assert.match(llms, /Celestial/);
  assert.match(
    llms,
    /- \[Resume\]\(https:\/\/andregiron\.me\/resume\/\): Use when/,
  );
});

test("the negotiation server serves markdown, html, and markdown 404s", async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "andre-site-"));
  const homeText = homeVisibleText();
  fs.writeFileSync(
    path.join(dist, "index.html"),
    `<!doctype html><html><head><title>Home</title></head><body><header><nav>Toggle navigation</nav></header><h1>Hi there! I'm Andre!</h1><p>${homeText}</p></body></html>`,
  );
  fs.mkdirSync(path.join(dist, "about"));
  fs.writeFileSync(
    path.join(dist, "about/index.html"),
    "<!doctype html><html><body><h1>About</h1><p>HTML about page.</p></body></html>",
  );
  fs.mkdirSync(path.join(dist, "resume"));
  fs.writeFileSync(
    path.join(dist, "resume/index.html"),
    '<!doctype html><html><body><header class="site-header"><nav class="site-nav">Toggle navigation</nav></header><h1>Andre S. Giron</h1><h2>Work Experience</h2><p>Aqueduct</p></body></html>',
  );
  fs.writeFileSync(
    path.join(dist, "404.html"),
    '<!doctype html><html><body><h1>Page not found</h1><p>Missing page.</p><a href="/llms.txt">llms.txt</a></body></html>',
  );
  fs.copyFileSync(
    path.join(root, "public/llms.txt"),
    path.join(dist, "llms.txt"),
  );
  fs.writeFileSync(
    path.join(dist, "sitemap.xml"),
    '<?xml version="1.0"?><urlset></urlset>',
  );
  fs.writeFileSync(
    path.join(dist, "pixel.png"),
    Buffer.from([0xff, 0xd8, 0xff, 0x00]),
  );

  const { server, port } = await startServer(dist);
  const base = `http://127.0.0.1:${port}`;

  try {
    const markdown = await fetch(`${base}/`, {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(markdown.status, 200);
    assert.match(
      markdown.headers.get("content-type") ?? "",
      /^text\/markdown(?:; charset=utf-8)?$/,
    );
    assert.match(markdown.headers.get("vary") ?? "", /\baccept\b/i);
    const markdownBody = await markdown.text();
    assert.ok(markdownBody.trim().length > 0);
    assert.match(markdownBody, /^# Hi there! I'm Andre!/);
    assert.match(markdownBody, /llms\.txt/);

    const html = await fetch(`${base}/`, {
      headers: { Accept: "text/html" },
    });
    assert.equal(html.status, 200);
    assert.match(html.headers.get("content-type") ?? "", /^text\/html/);
    assert.match(html.headers.get("vary") ?? "", /\baccept\b/i);
    const htmlBody = await html.text();
    assert.match(htmlBody, /<h1>Hi there! I'm Andre!<\/h1>/);
    const htmlText = htmlBody
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    assert.ok(htmlText.length >= 500, `html text length ${htmlText.length}`);

    const missing = await fetch(`${base}/some-path-that-does-not-exist`, {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get("content-type") ?? "", /^text\/markdown/);
    assert.match(missing.headers.get("vary") ?? "", /\baccept\b/i);
    const missingBody = await missing.text();
    assert.ok(missingBody.length >= 20);
    assert.match(missingBody, /https:\/\/andregiron\.me\/llms\.txt/);

    const missingHtml = await fetch(`${base}/__ora-404-probe-afu23aun`, {
      headers: { Accept: "text/html" },
    });
    assert.equal(missingHtml.status, 404);
    assert.match(missingHtml.headers.get("content-type") ?? "", /^text\/html/);
    assert.match(await missingHtml.text(), /<h1>Page not found<\/h1>/);

    const resume = await fetch(`${base}/resume/`, {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(resume.status, 200);
    assert.match(resume.headers.get("content-type") ?? "", /^text\/markdown/);
    const resumeBody = await resume.text();
    assert.match(resumeBody, /Aqueduct/);
    assert.doesNotMatch(resumeBody, /Toggle navigation/);

    const rejected = await fetch(`${base}/`, {
      headers: { Accept: "text/html;q=0, text/markdown;q=0" },
    });
    assert.equal(rejected.status, 406);

    const guide = await fetch(`${base}/llms.txt`);
    assert.equal(guide.status, 200);
    assert.match(await guide.text(), /## When to use this/);

    const sitemap = await fetch(`${base}/sitemap.xml`, {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.headers.get("content-type") ?? "", /xml/);

    const image = await fetch(`${base}/pixel.png`);
    assert.deepEqual(
      [...Buffer.from(await image.arrayBuffer())],
      [0xff, 0xd8, 0xff, 0x00],
    );

    const escaped = await new Promise<number>((resolve, reject) => {
      const request = http.request(
        {
          host: "127.0.0.1",
          port,
          path: "/%2e%2e/package.json",
          method: "GET",
        },
        (response) => {
          response.resume();
          resolve(response.statusCode ?? 0);
        },
      );
      request.on("error", reject);
      request.end();
    });
    assert.equal(escaped, 400);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
