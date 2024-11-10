import Image from "next/image";
import { renderRichTextContent } from "../../utils/RichText"; // Import the renderRichTextContent function
import { getOptimizedImageURL } from "../../utils/common";
import { Section } from "../Section";
import styles from "./ImageContent.module.scss";

const ContentSection = ({ content }) => (
  <div data-anim="content-image" className={styles.module__content}>
    {renderRichTextContent(content)}
  </div>
);

const ImageSection = ({ image }) => {
  const imageAspectRatio = image.width / image.height;
  return (
    <div
      className={styles.module__image}
      data-orientation={imageAspectRatio > 1 ? "horizontal" : "vertical"}
      data-anim="cover-image"
    >
      <Image
        src={getOptimizedImageURL(image, 800, 100)} //
        alt={image.alt}
        width={image.width}
        height={image.height}
      />
    </div>
  );
};

export const ImageContent = ({
  heading,
  subHeading,
  animationID,
  theme,
  image,
  content,
  fullHeight,
  isolation,
  isContentFirst,
}) => {
  const order = isContentFirst ? "content-first" : "image-first";
  return (
    <Section
      animationID={animationID}
      subHeading={subHeading}
      heading={heading}
      fullHeight={fullHeight}
      isolation={isolation}
      theme={theme}
    >
      <div className={styles.module} data-order={order}>
        {isContentFirst ? (
          <>
            <ContentSection content={content} />
            {image && <ImageSection image={image} />}
          </>
        ) : (
          <>
            {image && <ImageSection image={image} />}
            <ContentSection content={content} />
          </>
        )}
      </div>
    </Section>
  );
};
