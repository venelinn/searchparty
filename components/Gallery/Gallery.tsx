"use client";

import gsap from 'gsap';
import LightGalleryBase from 'lightgallery/react';

const LightGallery = LightGalleryBase as React.ComponentType<any>;
import chunk from 'lodash/chunk';
import sum from 'lodash/sum';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Icon } from '../Icons/Icons';
import styles from './Gallery.module.scss';

// If you want you can use SCSS instead of css
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-video.css';

import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgHash from 'lightgallery/plugins/hash';
import lgShare from 'lightgallery/plugins/share';
import lgVdeo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';

interface GalleryProps {
  thumbs: any[];
  full: any[];
  itemsPerRow: number;
}

const Gallery = ({ thumbs, full, itemsPerRow }: GalleryProps) => {
  const galleryItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const itemsPerRowByBreakpoints = [itemsPerRow]; // use it as an array
  const aspectRatios = thumbs.map(image => image.width / image.height);
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map(
    itemsPerRow =>
      chunk(aspectRatios, itemsPerRow).map(rowAspectRatios =>
        sum(rowAspectRatios),
      ),
  );

  // GSAP Stagger Effect
  useEffect(() => {
    const galleryItems = galleryItemsRef.current;
    if (galleryItems.length) {
      gsap.fromTo(
        galleryItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power2.out',
        },
      );
    }
  }, [thumbs]);

  const onInit = () => {};

  return (
    <div className={styles.gallery}>
      <LightGallery
        data={full}
        onInit={onInit}
        speed={500}
        download={false}
        plugins={[lgZoom, lgAutoplay, lgFullscreen, lgShare, lgHash, lgVdeo]}
        autoplay={
          {
            autoplay: true,
            pause: 3000,
            autoplayFirstVideo: true,
          } as any
        }
        share={{
          facebook: true,
          x: true,
          getShareUrl: index => {
            const image = full[index];
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const shareUrl = `${baseUrl}/image/${image.id}`;

            // Ensure the URL starts with the protocol
            return shareUrl.startsWith('http')
              ? shareUrl
              : `https://${shareUrl}`;
          },
          getShareTitle: index => {
            const image = full[index];
            return image.alt || 'Check out this image!';
          },
        } as any}
      >
        {thumbs.map((thumb, i) => {
          return (
            <a
              ref={el => {
                galleryItemsRef.current[i] = el;
              }}
              data-src={full[i].isVideo ? full[i].src : full[i].src}
              data-poster={full[i].isVideo ? full[i].poster : undefined}
              className={styles.galleryItem}
              data-media-type={full[i].isVideo ? 'video' : 'image'}
              key={i}
              style={{
                '--thumb-width': rowAspectRatioSumsByBreakpoints.map(
                  (rowAspectRatioSums, j) => {
                    const rowIndex = Math.floor(
                      i / itemsPerRowByBreakpoints[j],
                    );
                    const rowAspectRatioSum = rowAspectRatioSums[rowIndex];
                    let itemRatio = aspectRatios[i] / rowAspectRatioSum;

                    if (itemRatio > 0.8) {
                      itemRatio = itemRatio / itemsPerRow;
                    }

                    return `calc(${itemRatio * 100}% - var(--gallery-gap, 5px))`;
                  },
                )[0],
              } as React.CSSProperties}
            >
              <Image
                src={thumb.src}
                alt={thumb?.title || thumb?.alt}
                width={thumb.width}
                height={thumb.height}
              />
              {full[i].isVideo && <span>{thumb?.title || thumb?.alt}</span>}
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
