"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { renderRichTextContent } from "../../utils/RichText";
import { getOptimizedImage } from "../../utils/common";
import { Section } from "../Section";
import styles from "./ImageContent.module.scss";

interface ContentSectionProps {
  content: any;
  ref?: any;
}

const ContentSection = ({ content, ref }: ContentSectionProps) => (
  <div ref={ref} data-anim="content-image" className={styles.module__content}>
    {renderRichTextContent(content)}
  </div>
);

interface ImageSectionProps {
  image: any;
  ref?: any;
}

const ImageSection = ({ image, ref }: ImageSectionProps) => {
  const imageAspectRatio = image.width / image.height;
	const { url, width, height } = getOptimizedImage(image, 800, 100);
  return (
    <div
			ref={ref}
      className={styles.module__image}
      data-orientation={imageAspectRatio > 1 ? "horizontal" : "vertical"}
      data-anim="cover-image"
    >
     <Image
			src={url}
			alt={image.alt}
			width={width}
			height={height}
		/>
    </div>
  );
};

interface ImageContentProps {
  heading?: any;
  subHeading?: string;
  animationID?: string;
  theme?: string;
  image?: any;
  content?: any;
  fullHeight?: boolean;
  isolation?: boolean;
  isContentFirst?: boolean;
  id?: string;
}

export const ImageContent = ({
  heading,
  subHeading: _subHeading,
  animationID,
  theme: _theme,
  image,
  content,
  fullHeight: _fullHeight,
  isolation: _isolation,
  isContentFirst,
  id,
}: ImageContentProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(containerRef.current.querySelectorAll("[data-anim]"));

      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
					y: 0,
          stagger: 0.2, // Adds stagger effect
          duration: 0.7,
					delay: 1,
          ease: "power4.out",
        }
      );
    }
  }, []);

  const order = isContentFirst ? "content-first" : "image-first";
  return (
    <Section
      animationID={animationID}
      heading={heading}
			id={id}
    >
      <div className={styles.module} data-order={order} ref={containerRef}>
        {isContentFirst ? (
          <>
            <ContentSection content={content}  />
            {image && <ImageSection image={image} />}
          </>
        ) : (
          <>
            {image && <ImageSection image={image} />}
            <ContentSection content={content}   />
          </>
        )}
      </div>
    </Section>
  );
};
