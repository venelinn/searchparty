import Image from "next/image";

interface ContentfulImageProps {
  image: any;
  className?: string;
}

const ContentfulImage = ({ image, className }: ContentfulImageProps) => {
  const imageUrl = image.file.url.startsWith("//") ? `https:${image.file.url}` : image.file.url;
  const { width, height } = image.file.details.image;

  return (
    <Image
      src={imageUrl}
      alt={image.title}
      width={width}
      height={height}
      sizes="(max-width: 800px) 100vw, (max-width: 1200px) 50vw, 800px"
      className={className}
    />
  );
};

export default ContentfulImage;