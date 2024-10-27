// contentfulRichTextRenderer.js

import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Heading } from "../components/Headings";

export const renderEmbeddedEntryBlock = (node, children) => {
  if (node.data.target.sys.contentType.sys.id === "heading") {
    const dynamicProps = node.data.target.fields;

    // Render the Heading component with dynamic props
    return (
      <Heading
        as={dynamicProps?.as}
        size={dynamicProps?.size}
        uppercase={dynamicProps?.uppercase}
      >
        {dynamicProps?.heading}
      </Heading>
    );
  }
  // Handle other cases if needed
  return null;
};

export const renderRichTextContent = (content) => {
  const richTextOptions = {
    renderNode: {
      "embedded-entry-block": renderEmbeddedEntryBlock, // Apply custom rendering for embedded entries
			"hyperlink": (node, children) => {
				const url = node.data.uri;
        const isExternalLink = url.startsWith("http");

        return (
          <a
            href={url}
            className={`link link--active ${isExternalLink ? "external-link" : ""}`}
            target={isExternalLink ? "_blank" : "_self"}
            rel={isExternalLink ? "noopener noreferrer" : ""}
          >
            <span className="link__text">{children}</span>
          </a>
        );
      },
    },
  };

  return documentToReactComponents(content, richTextOptions);
};
