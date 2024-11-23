import React from "react";
import { chunk, sum } from "lodash";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import { Icon } from "../Icons/Icons";
import styles from "./Gallery.module.scss";

// If you want you can use SCSS instead of css
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import "lightgallery/scss/lg-autoplay.scss";
import "lightgallery/scss/lg-fullscreen.scss";
import "lightgallery/scss/lg-share.scss";
import "lightgallery/scss/lg-video.scss";

import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import lgVdeo from "lightgallery/plugins/video";

const Gallery = ({ thumbs, full, itemsPerRow }) => {
  let itemsPerRowByBreakpoints = [itemsPerRow]; // use it as an array
  const aspectRatios = thumbs.map((image) => image.width / image.height);
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map((itemsPerRow) =>
    chunk(aspectRatios, itemsPerRow).map((rowAspectRatios) => sum(rowAspectRatios)),
  );
  const onInit = () => {};

  return (
    <div className={styles.gallery}>
      <LightGallery
				data={full}
        onInit={onInit}
        speed={500}
        download={false}
        plugins={[lgZoom, lgAutoplay, lgFullscreen, lgShare, lgHash, lgVdeo]}
        autoplay={{
          autoplay: true,
          pause: 3000,
          autoplayFirstVideo: true,
        }}
        share={{
          facebook: true,
          x: true,
					getShareUrl: (index) => {
						const image = full[index];
						const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
						const shareUrl = `${baseUrl}/image/${image.id}`;

						// Ensure the URL starts with the protocol
						return shareUrl.startsWith("http") ? shareUrl : `https://${shareUrl}`;
					},
					getShareTitle: (index) => {
						const image = full[index];
						return image.alt || "Check out this image!";
					},
        }}
      >
        {thumbs.map((thumb, i) => {
          return (
            <a
							data-src={full[i].isVideo ? full[i].src : full[i].src}
							data-poster={full[i].isVideo ? full[i].poster : undefined}
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
								alt={thumb?.alt || thumb.title}
								width={thumb.width}
								height={thumb.height}
								/>
								{full[i].isVideo && <Icon name="Youtube" size="7em" /> }
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
