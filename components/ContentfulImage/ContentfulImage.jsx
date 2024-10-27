// Image.js
import Image from "next/image";

const ContentfulImage = ({ image, className }) => {
  const imageUrl = image.file.url.startsWith("//") ? `https:${image.file.url}` : image.file.url;

  // Construct srcSet
  const srcSet = [
    `${imageUrl}?w=800 800w`,
    `${imageUrl}?w=1200 1200w`,
    `${imageUrl}?w=1600 1600w`,
    `${imageUrl}?w=2000 2000w`,
  ].join(", ");

  return (
    <Image
      src={imageUrl}
      alt={image.title}
      width={image.file.details.image.width}
      height={image.file.details.image.height}
      srcSet={srcSet}
      className={className}
    />
  );
};

export default ContentfulImage;