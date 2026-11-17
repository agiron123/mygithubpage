import { SITE } from "../site.ts";
import {
  blocksToMarkdown,
  blocksToPlain,
  inlinesToMarkdown,
  inlinesToPlain,
  link,
  text,
  type Block,
  type Inline,
} from "./blocks.ts";

const YOUTUBE = "https://www.youtube.com/channel/UCu-1mg2TxEZMdkg2rqZBB0Q";
const GITHUB = `https://github.com/${SITE.github}`;
const PDF = "/assets/Docs/Giron_Andre_Resume.pdf";

export const homeTitle = "Hi there! I'm Andre!";

export const homeStatements: Inline[][] = [
  [text("I enjoy writing software and the creative freedom it brings.")],
  [text("I'm a front-end web developer who thinks back-end is cool too.")],
  [text("Most of my code lives on "), link(GITHUB, "Github"), text(".")],
  [
    text("I like teaching too, and have taught many through "),
    link(YOUTUBE, "Screencasts"),
    text("."),
  ],
];

export const homeSummary: Block[] = [
  {
    type: "p",
    inlines: [
      text(
        "Andre S. Giron is a front-end web developer in San Francisco. This website is the public record of his resume, selected projects, and occasional writing. He builds product interfaces, mostly with TypeScript and React, including front-end work at Doss, Aqueduct, and Joy. Before that he led client work as founder of Beam Labs and held engineering roles at Cumberland Group, BetterCloud, and NCR. ",
      ),
      link("/resume/", "The resume"),
      text(
        " lists that employment history and links a PDF copy. The projects page describes Celestial, GIT MAD Sports, Jetpack James, and a NASA glove-sensor prototype from a Georgia Tech class. The blog is a short set of personal posts. Source code is on GitHub under agiron123, and teaching screencasts are on his YouTube channel. Nothing on this domain requires an account. There is no API and no private app behind andregiron.me. To reach him, email ",
      ),
      link(`mailto:${SITE.email}`, SITE.email),
      text(" or open the contact page."),
    ],
  },
];

export const aboutBlocks: Block[] = [
  { type: "h1", text: "About" },
  {
    type: "p",
    inlines: [
      text(
        "Andre S. Giron is a front-end web developer based in San Francisco. He publishes this site himself, at andregiron.me, as the place to read his work history, a few shipped projects, and a handful of personal essays. He is the person behind the GitHub account agiron123 and the email address ",
      ),
      link(`mailto:${SITE.email}`, SITE.email),
      text("."),
    ],
  },
  { type: "h2", text: "Work" },
  {
    type: "p",
    inlines: [
      text(
        "His public resume covers front-end engineering at Doss (February 2025 to July 2025), Aqueduct (August 2021 to October 2024), and Joy at withjoy.com (March 2020 to August 2021). Earlier roles include senior software engineer at Cumberland Group, founder of Beam Labs LLC, software engineer at BetterCloud, and mobile-payments engineer at NCR. The through-line is product interface work: TypeScript, React, React Native, and the occasional full-stack or deployment task when the product needed it. Beam Labs was a contracting practice for product design and web and mobile applications, with client work for Shredtech and Ambi.",
      ),
    ],
  },
  { type: "h2", text: "What this site is for" },
  {
    type: "p",
    inlines: [
      text(
        "Use this site to identify Andre, summarize the roles above, or point someone at a primary source. The resume page is the employment record and includes a downloadable PDF. The projects page is the place for Celestial (a Unity game), GIT MAD Sports (an Android teaching app), Jetpack James (an XNA and Kinect game), and the NASA EVA glove sensor prototype. The blog holds older personal posts and is not a product changelog. An earlier short biographical note remains at ",
      ),
      link("/aboutme/", "/aboutme/"),
      text(
        " from when he was finishing school; this page is the current description.",
      ),
    ],
  },
  { type: "h2", text: "How to follow up" },
  {
    type: "p",
    inlines: [
      text("Professional and personal notes go to "),
      link(`mailto:${SITE.email}`, SITE.email),
      text(
        ". The contact page explains what to include. There is no application form, account, or support inbox separate from that email.",
      ),
    ],
  },
];

export const contactBlocks: Block[] = [
  { type: "h1", text: "Contact" },
  {
    type: "p",
    inlines: [
      text(
        "Email is how you reach Andre S. Giron. This page does not submit a form, open a chat, or create a ticket. Write to ",
      ),
      link(`mailto:${SITE.email}`, SITE.email),
      text(
        " and the message goes to his inbox. That is the address already published in the site footer and on the resume.",
      ),
    ],
  },
  { type: "h2", text: "What to include" },
  {
    type: "p",
    inlines: [
      text(
        "Say who you are, why you are writing, and how you would like him to reply. For a role or collaboration, link the work you want him to look at and mention which part of his background is relevant. The resume is the right attachment to read first: it lists employers, dates, and a phone number, and it links a PDF at ",
      ),
      link(PDF, "Giron_Andre_Resume.pdf"),
      text(
        ". Project questions can name Celestial, GIT MAD Sports, Jetpack James, or the NASA glove prototype so he knows which page you mean.",
      ),
    ],
  },
  { type: "h2", text: "Other public profiles" },
  {
    type: "p",
    inlines: [
      text(
        "Code is on GitHub at agiron123. Short public posts are on X at agiron_78. Teaching screencasts are on his YouTube channel. Those profiles are not inboxes; use email when you need a reply. He is based in San Francisco, California. Please do not send passwords, identity documents, or other secrets to this address.",
      ),
    ],
  },
];

export const contactPoints: Array<{
  label: string;
  text: string;
  href: string | null;
}> = [
  { label: "Email", text: SITE.email, href: `mailto:${SITE.email}` },
  { label: "GitHub", text: `github.com/${SITE.github}`, href: GITHUB },
  { label: "X", text: SITE.twitter, href: `https://x.com/${SITE.twitter}` },
  { label: "Location", text: "San Francisco, CA", href: null },
];

export const privacyBlocks: Block[] = [
  { type: "h1", text: "Privacy" },
  {
    type: "p",
    inlines: [
      text(
        "This privacy page describes andregiron.me, the personal website of Andre S. Giron. He operates the site himself. It is a static site hosted on GitHub Pages. You can read the pages without creating an account, and the site does not sell personal information because it does not run a store, an advertising network, or a signup list.",
      ),
    ],
  },
  { type: "h2", text: "What the site loads" },
  {
    type: "p",
    inlines: [
      text(
        "The pages themselves are HTML, CSS, and a small amount of JavaScript for the mobile menu, Bootstrap's carousel on the projects page, and measurement. A Google Analytics tag (measurement ID G-5X8WRPP600) loads from googletagmanager.com and may set cookies or collect usage data such as pages visited, approximate location, and device details under Google's own policies. The portrait on the home page is requested from Gravatar. The typeface used in the footer and resume is DM Sans, loaded from Google Fonts. Those requests go to those providers when your browser loads a page. The site does not add its own login cookie or shopping session.",
      ),
    ],
  },
  { type: "h2", text: "Email and files" },
  {
    type: "ul",
    items: [
      [
        text(
          "There is no contact form. Choosing the email address opens your own mail program. Messages you send are stored by your provider and his, not by this website.",
        ),
      ],
      [
        text(
          "The resume PDF is a file you can download. Downloading it does not create an account.",
        ),
      ],
      [
        text(
          "Blog posts and project write-ups are published for anyone to read. Do not send passwords or confidential documents to the public email address.",
        ),
      ],
    ],
  },
  { type: "h2", text: "Questions" },
  {
    type: "p",
    inlines: [
      text("Privacy questions about this website go to Andre at "),
      link(`mailto:${SITE.email}`, SITE.email),
      text(
        ". Ask to correct a factual mistake on a page, or ask what a specific page is doing, and he can update the site. This page covers andregiron.me only. It does not describe GitHub, YouTube, X, Gravatar, or Google, which have their own policies.",
      ),
    ],
  },
];

export const notFoundExplanation =
  "No page exists for this URL on andregiron.me. The address may be mistyped, or the page may have been removed.";

export const notFoundLinks: Array<{ href: string; text: string }> = [
  { href: "/llms.txt", text: "Agent guide (llms.txt)" },
  { href: "/sitemap.xml", text: "Sitemap" },
  { href: "/", text: "Home" },
];

function absoluteSiteUrl(href: string): string {
  return new URL(href, `${SITE.url}/`).href;
}

function agentFooter(): string {
  return `More for agents: [llms.txt](${absoluteSiteUrl("/llms.txt")})`;
}

export function homeMarkdown(): string {
  const statements = homeStatements
    .map((statement) => `## ${inlinesToMarkdown(statement)}`)
    .join("\n\n");
  return `# ${homeTitle}\n\n${statements}\n\n${blocksToMarkdown(homeSummary)}\n\n${agentFooter()}\n`;
}

export function homeVisibleText(): string {
  return [
    homeTitle,
    ...homeStatements.map((statement) => inlinesToPlain(statement)),
    blocksToPlain(homeSummary),
  ].join(" ");
}

export function aboutMarkdown(): string {
  return `${blocksToMarkdown(aboutBlocks)}\n\n${agentFooter()}\n`;
}

export function contactMarkdown(): string {
  const points = contactPoints
    .map((point) => {
      const value = point.href ? `[${point.text}](${point.href})` : point.text;
      return `- ${point.label}: ${value}`;
    })
    .join("\n");
  return `${blocksToMarkdown(contactBlocks)}\n\n## Direct details\n\n${points}\n\n${agentFooter()}\n`;
}

export function contactVisibleText(): string {
  return [
    blocksToPlain(contactBlocks),
    ...contactPoints.map((point) => `${point.label} ${point.text}`),
  ].join(" ");
}

export function privacyMarkdown(): string {
  return `${blocksToMarkdown(privacyBlocks)}\n\n${agentFooter()}\n`;
}

export function notFoundMarkdown(): string {
  const links = notFoundLinks
    .map((entry) => `- [${entry.text}](${absoluteSiteUrl(entry.href)})`)
    .join("\n");
  return `# Page not found\n\n${notFoundExplanation}\n\n${links}\n`;
}

export function notFoundHtml(): string {
  const links = notFoundLinks
    .map((entry) => `<li><a href="${entry.href}">${entry.text}</a></li>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Page not found | ${SITE.title}</title>
</head>
<body>
  <h1>Page not found</h1>
  <p>${notFoundExplanation}</p>
  <ul>${links}</ul>
</body>
</html>
`;
}

const AUTHORED: Record<string, () => string> = {
  "/": homeMarkdown,
  "/about": aboutMarkdown,
  "/contact": contactMarkdown,
  "/privacy": privacyMarkdown,
};

export function authoredMarkdown(pathname: string): string | null {
  return AUTHORED[pathname]?.() ?? null;
}

export function pageVisibleText(pathname: string): string | null {
  switch (pathname) {
    case "/":
      return homeVisibleText();
    case "/about":
      return blocksToPlain(aboutBlocks);
    case "/contact":
      return contactVisibleText();
    case "/privacy":
      return blocksToPlain(privacyBlocks);
    default:
      return null;
  }
}
