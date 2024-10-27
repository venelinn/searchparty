import React from "react";
import { chunk, sum } from "lodash";
import LightGallery from "lightgallery/react";
// import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ContentfulImage from "../ContentfulImage/ContentfulImage";
import Image from "next/image";
import styles from "./Gallery.module.scss";

// If you want you can use SCSS instead of css
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import "lightgallery/scss/lg-autoplay.scss"
import "lightgallery/scss/lg-fullscreen.scss"
import "lightgallery/scss/lg-share.scss"

// import plugins if you need
// import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";

const Gallery = ({
  thumbs,
  full,
  itemsPerRow,
}) => {
	let itemsPerRowByBreakpoints = [itemsPerRow]; // use it as an array
  const aspectRatios = thumbs.map((image) => image.width / image.height);
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map(
		(itemsPerRow) =>
      chunk(aspectRatios, itemsPerRow).map((rowAspectRatios) =>
        sum(rowAspectRatios)
	)
);
  const onInit = () => {};
	console.log("itemsPerRow", itemsPerRowByBreakpoints)

  return (
    <div className={styles.gallery}>
       <LightGallery
          onInit={onInit}
          speed={500}
          download={false}
          plugins={[lgZoom, lgAutoplay, lgFullscreen, lgShare]}
          autoplay={{
            autoplay: true,
            pause: 3000,
            autoplayFirstVideo: true,
          }}
          share={{
            facebook: true,
            x: true,
            pinterest: true,
          }}
      >
        {thumbs.map((thumb, i) => {
          // const thumbnail = getImage(thumb);
					const srcSet = thumb?.images.sources[0]?.srcSet;
					const urls = srcSet ? srcSet.split(',').map(url => url.trim().split(' ')[0]) : [];
					const src = urls.length > 0 ? urls[0] : '';
					return (
						// <>
						// 	{JSON.stringify(full[i].images.fallback.src)}
						// </>
            <a
              href={full[i].images.fallback.src}
              className={styles.galleryItem}
              key={i}
              style={{
                "--thumb-width": rowAspectRatioSumsByBreakpoints.map(
                  (rowAspectRatioSums, j) => {
                    const rowIndex = Math.floor(i / itemsPerRowByBreakpoints[j]);
                    const rowAspectRatioSum = rowAspectRatioSums[rowIndex];

                    return `calc(${
                      (aspectRatios[i] / rowAspectRatioSum) * 100
                    }% - 5px)`;
                  }
                )[0],
              }}
              >
              <Image
								src={thumb.images.fallback.src}
								alt={thumb?.caption}
								width={thumb.images.fallback.width || 500}
								height={thumb.images.fallback.height || 500}
							/>
            </a>
          );
        })}
          ...
      </LightGallery>

    </div>
  );
};

export default Gallery;
export { Gallery }
