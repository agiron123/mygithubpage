import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { notFoundHtml } from "../src/agent/documents.ts";
import {
  htmlResponseHeaders,
  markdownFromHtml,
  markdownResponseHeaders,
  negotiate,
  notAcceptableBody,
} from "../src/agent/negotiate.ts";
import { htmlRelativePaths } from "../src/agent/paths.ts";

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

type Requested = http.IncomingMessage;
type Responded = http.ServerResponse;

export function createHandler(distDir: string) {
  const root = path.resolve(distDir);

  function readBuffer(relativePath: string): Buffer | null {
    const full = path.resolve(root, relativePath);
    if (full !== root && !full.startsWith(`${root}${path.sep}`)) return null;
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return null;
    return fs.readFileSync(full);
  }

  function readPageHtml(pathname: string): string | null {
    for (const relativePath of htmlRelativePaths(pathname)) {
      const html = readBuffer(relativePath);
      if (html) return html.toString("utf8");
    }
    return null;
  }

  function send(
    response: Responded,
    status: number,
    body: string | Buffer,
    headers: Record<string, string>,
    method: string,
  ) {
    response.writeHead(status, headers);
    response.end(method === "HEAD" ? undefined : body);
  }

  return function handler(request: Requested, response: Responded) {
    const method = request.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(
        response,
        405,
        "Method not allowed.\n",
        { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" },
        method,
      );
      return;
    }

    const decision = negotiate(
      request.url ?? "/",
      request.headers.accept ?? null,
    );

    switch (decision.kind) {
      case "invalid-path":
        send(
          response,
          400,
          "Bad request.\n",
          { "Content-Type": "text/plain; charset=utf-8" },
          method,
        );
        return;
      case "not-acceptable":
        send(
          response,
          406,
          notAcceptableBody(),
          {
            "Content-Type": "text/plain; charset=utf-8",
            Vary: "Accept",
          },
          method,
        );
        return;
      case "markdown":
        send(
          response,
          decision.status,
          decision.body,
          markdownResponseHeaders(),
          method,
        );
        return;
      case "markdown-from-html": {
        const rendered = markdownFromHtml(readPageHtml(decision.pathname));
        send(
          response,
          rendered.status,
          rendered.body,
          markdownResponseHeaders(),
          method,
        );
        return;
      }
      case "html": {
        const html = readPageHtml(decision.pathname);
        if (!html) {
          const missing =
            readBuffer("404.html")?.toString("utf8") ?? notFoundHtml();
          send(response, 404, missing, htmlResponseHeaders(), method);
          return;
        }
        send(response, 200, html, htmlResponseHeaders(), method);
        return;
      }
      case "asset": {
        const relativePath = decision.pathname.replace(/^\//, "");
        const file = readBuffer(relativePath);
        if (!file) {
          const accept = request.headers.accept ?? null;
          const missed = negotiate("/__missing__", accept);
          if (
            missed.kind === "markdown" ||
            missed.kind === "markdown-from-html"
          ) {
            const rendered = markdownFromHtml(null);
            send(
              response,
              rendered.status,
              rendered.body,
              markdownResponseHeaders(),
              method,
            );
            return;
          }
          if (missed.kind === "not-acceptable") {
            send(
              response,
              406,
              notAcceptableBody(),
              { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" },
              method,
            );
            return;
          }
          const missing =
            readBuffer("404.html")?.toString("utf8") ?? notFoundHtml();
          send(response, 404, missing, htmlResponseHeaders(), method);
          return;
        }
        const extension = path.posix.extname(decision.pathname).toLowerCase();
        send(
          response,
          200,
          file,
          {
            "Content-Type":
              CONTENT_TYPES[extension] ?? "application/octet-stream",
          },
          method,
        );
        return;
      }
      default: {
        const unexpected: never = decision;
        throw new Error(`Unhandled negotiation: ${JSON.stringify(unexpected)}`);
      }
    }
  };
}

export function startServer(distDir: string, port = 0, host = "127.0.0.1") {
  const server = http.createServer(createHandler(distDir));
  return new Promise<{ server: http.Server; port: number }>((resolve) => {
    server.listen(port, host, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Expected a TCP server address.");
      }
      resolve({ server, port: address.port });
    });
  });
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath === modulePath) {
  const distDir = process.argv[2] ?? "dist";
  const port = Number(process.env.PORT ?? 4321);
  const { port: listening } = await startServer(distDir, port, "127.0.0.1");
  console.log(
    `Serving ${path.resolve(distDir)} at http://127.0.0.1:${listening}`,
  );
}
