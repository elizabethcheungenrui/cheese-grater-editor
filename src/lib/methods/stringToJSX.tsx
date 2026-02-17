import parse, { Element, domToReact } from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";

export default function stringToJSX(html: string) {
  if (!html) return null;

  const options: HTMLReactParserOptions = {
    replace: (node: DOMNode) => {
      if (!(node instanceof Element)) return;

      const tag = node.name;
      const attribs = node.attribs || {};

      if (tag === "img") {
        return (
          <img
            src={attribs.src}
            alt={attribs.alt || ""}
            style={{ width: "100%", height: "auto" }}
          />
        );
      }

      if (tag === "iframe") {
        return (
          <div style={{ width: "100%", aspectRatio: "16/9" }}>
            <iframe
              src={attribs.src}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow={attribs.allow || ""}
            />
          </div>
        );
      }

      if (tag === "a") {
        return (
          <a href={attribs.href} target="_blank" rel="noopener noreferrer">
            {domToReact(node.children as any, options)}
          </a>
        );
      }

      return undefined;
    },
  };

  return parse(html, options);
}
