// contentfulRichTextRenderer.js

import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { Heading } from "../components/Headings";

// Utility function to adjust Cloudinary URLs
function getCloudinaryImageURL(url) {
  // Force https. Contentful/Cloudinary sometimes returns `http://` or a
  // protocol-relative `//` URL, which triggers mixed-content fetches and, for
  // priority images, prevents next/image's preload from matching the rendered
  // <img> src (so the image is fetched twice and the priority hint is wasted).
  const httpsUrl = url.startsWith("//") ? `https:${url}` : url.replace(/^http:\/\//, "https://");
  if (httpsUrl.includes(".svg")) {
    return httpsUrl.replace("/f_auto", "");
  }
  return httpsUrl;
}

// Use your `getCloudinaryImageURL` function to preprocess Cloudinary URLs
export const renderEmbeddedEntryBlock = (node) => {
	const heading = node.data.target.fields;
	const seoHeading = heading?.isHidden;
    // Render the Heading component with dynamic props
	return (
		<Heading
			as={heading?.as}
			size={heading?.size}
			uppercase={heading?.uppercase}
			alignment={heading?.alignment}
			animationID={heading?.animationID}
			highlight={heading?.highlight}
			isHidden={heading?.isHidden}
		>
			{seoHeading ? <span className="sr-only">{heading?.heading}</span> : heading?.heading}
		</Heading>
	);

};

// Function to render embedded assets like images
export const renderEmbeddedAssetBlock = (node, { priority = false } = {}) => {
	const asset = node.data.target.fields;

	return (
		<Image
			src={getCloudinaryImageURL(asset.image[0].url)}
			alt={asset.alt}
			width={asset.image[0].width}
			height={asset.image[0].height}
			priority={priority}
		/>
	);
};
// Main function to render rich text content.
// Pass `{ priorityFirstImage: true }` for above-the-fold content (e.g. the
// hero) so the first embedded image loads eagerly instead of lazily — it's
// typically the Largest Contentful Paint element, and lazy-loading it delays
// LCP. Only the first image is prioritized; later ones stay lazy.
export const renderRichTextContent = (content, { priorityFirstImage = false } = {}) => {
  let firstImageRendered = false;

  const richTextOptions = {
    renderNode: {
			"embedded-entry-block": (node) => {
        // Check if the entry is a Heading or Button and render accordingly
				if (node.data.target.sys.contentType.sys.id === "heading") {
          return renderEmbeddedEntryBlock(node);
				} else if  (node.data.target.sys.contentType.sys.id === "cloudinaryAsset") {
					const priority = priorityFirstImage && !firstImageRendered;
					firstImageRendered = true;
					return renderEmbeddedAssetBlock(node, { priority });
        } else if (node.data.target.sys.contentType.sys.id === "button") {
          return renderButton(node);
        }
        return null;
      },
      // "embedded-entry-block": renderEmbeddedEntryBlock, // Apply custom rendering for embedded entries
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

