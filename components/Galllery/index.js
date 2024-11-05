import React from "react";
import { chunk, sum } from "lodash";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import styles from "./Gallery.module.scss";

// If you want you can use SCSS instead of css
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import "lightgallery/scss/lg-autoplay.scss";
import "lightgallery/scss/lg-fullscreen.scss";
import "lightgallery/scss/lg-share.scss";

import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";

const Gallery = ({ thumbs, full, itemsPerRow }) => {
  let itemsPerRowByBreakpoints = [itemsPerRow]; // use it as an array
  const aspectRatios = thumbs.map((image) => image.width / image.height);
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map((itemsPerRow) =>
    chunk(aspectRatios, itemsPerRow).map((rowAspectRatios) => sum(rowAspectRatios)),
  );
  const onInit = () => {};
  // console.log("itemsPerRow", itemsPerRowByBreakpoints);

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
          return (
            // <>
            // 	{JSON.stringify(full[i].images.fallback.src)}
            // </>
            <a
              href={full[i].src}
              className={styles.galleryItem}
              key={i}
              style={{
                "--thumb-width": rowAspectRatioSumsByBreakpoints.map((rowAspectRatioSums, j) => {
                  const rowIndex = Math.floor(i / itemsPerRowByBreakpoints[j]);
                  const rowAspectRatioSum = rowAspectRatioSums[rowIndex];

                  return `calc(${(aspectRatios[i] / rowAspectRatioSum) * 100}% - 5px)`;
                })[0],
              }}
            >
              <Image
								src={thumb.src}
								alt={thumb?.alt}
								layout="responsive"
								width={thumb.width}
								height={thumb.height}
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
export { Gallery };
