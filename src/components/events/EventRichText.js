import Image from "next/image";

function renderChildren(children = []) {
  return children.map((child) => child.text || "").join("");
}

export default function EventRichText({ body }) {
  if (!Array.isArray(body) || !body.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {body.map((block) => {
        if (block?._type === "image" && block.asset?._ref) {
          return null;
        }

        if (block?._type === "image" && block.src) {
          return (
            <div key={block._key || block.src} className="relative aspect-[16/10] overflow-hidden border border-[color:var(--color-border-soft)]">
              <Image
                src={block.src}
                alt={block.alt || ""}
                fill
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
              />
            </div>
          );
        }

        if (block?._type !== "block") {
          return null;
        }

        const text = renderChildren(block.children);

        if (!text) {
          return null;
        }

        if (block.style === "h2") {
          return (
            <h2
              key={block._key}
              className="font-heading text-3xl text-[color:var(--color-primary)] md:text-4xl"
            >
              {text}
            </h2>
          );
        }

        if (block.style === "h3") {
          return (
            <h3
              key={block._key}
              className="font-heading text-2xl text-[color:var(--color-primary)] md:text-3xl"
            >
              {text}
            </h3>
          );
        }

        if (block.style === "blockquote") {
          return (
            <blockquote
              key={block._key}
              className="border-l-2 border-[color:var(--color-gold-soft)] pl-5 font-alt text-2xl italic leading-9 text-[color:var(--color-primary)]/82"
            >
              {text}
            </blockquote>
          );
        }

        if (block.listItem === "bullet") {
          return (
            <li
              key={block._key}
              className="ml-5 list-disc text-lg leading-8 text-[color:var(--color-copy-soft)]"
            >
              {text}
            </li>
          );
        }

        if (block.listItem === "number") {
          return (
            <li
              key={block._key}
              className="ml-5 list-decimal text-lg leading-8 text-[color:var(--color-copy-soft)]"
            >
              {text}
            </li>
          );
        }

        return (
          <p
            key={block._key}
            className="text-lg leading-8 text-[color:var(--color-copy-soft)]"
          >
            {text}
          </p>
        );
      })}
    </div>
  );
}
