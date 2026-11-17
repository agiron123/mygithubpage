export type Inline =
  | { type: "text"; text: string }
  | { type: "link"; href: string; text: string };

export type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "p"; inlines: Inline[] }
  | { type: "ul"; items: Inline[][] };

export function text(value: string): Inline {
  return { type: "text", text: value };
}

export function link(href: string, label: string): Inline {
  return { type: "link", href, text: label };
}

export function inlinesToPlain(inlines: Inline[]): string {
  return inlines
    .map((node) => {
      switch (node.type) {
        case "text":
        case "link":
          return node.text;
        default: {
          const unexpected: never = node;
          return unexpected;
        }
      }
    })
    .join("");
}

export function inlinesToMarkdown(inlines: Inline[]): string {
  return inlines
    .map((node) => {
      switch (node.type) {
        case "text":
          return node.text;
        case "link":
          return `[${node.text}](${node.href})`;
        default: {
          const unexpected: never = node;
          return unexpected;
        }
      }
    })
    .join("");
}

export function blocksToPlain(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h1":
        case "h2":
          return block.text;
        case "p":
          return inlinesToPlain(block.inlines);
        case "ul":
          return block.items.map((item) => inlinesToPlain(item)).join(" ");
        default: {
          const unexpected: never = block;
          return unexpected;
        }
      }
    })
    .join(" ");
}

export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h1":
          return `# ${block.text}`;
        case "h2":
          return `## ${block.text}`;
        case "p":
          return inlinesToMarkdown(block.inlines);
        case "ul":
          return block.items
            .map((item) => `- ${inlinesToMarkdown(item)}`)
            .join("\n");
        default: {
          const unexpected: never = block;
          return unexpected;
        }
      }
    })
    .join("\n\n");
}
