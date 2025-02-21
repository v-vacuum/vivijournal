"use client";

import Image, { ImageProps } from "next/image";
import { EOF } from "node:dns/promises";
import { useEffect, useRef, useState } from "react";

type CustomShapedImageProps = ImageProps & {
  hoverSrc: string; // Image to show on hover
  alt: string; // Alternative text for the image
};

const CustomShapedImage: React.FC<CustomShapedImageProps> = ({
  src,
  hoverSrc,
  alt,
  ...rest
}) => {
  // Refs for the visible image and offscreen canvas for hit testing
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  // When the image loads, draw it on the hidden canvas
  useEffect(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleLoad = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 0) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor(i / 4 / canvas.width);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      setVisibleWidth(maxX - minX + 1);
      setVisibleHeight(maxY - minY + 1);
      setXOffset(minX);
      setYOffset(minY);
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [src]);

  // On mouse move, check the pixel data for transparency
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const rect = img.getBoundingClientRect();
    // Calculate the mouse coordinates relative to the image
    const x = e.clientX - rect.left + xOffset;
    const y = e.clientY - rect.top + yOffset;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const alpha = pixelData[3];
      // Define a threshold for 95% opacity (95% of 255 ≈ 242)
      const threshold = 242;
      setIsHovered(alpha >= threshold);
    } catch (error) {
      // If getImageData fails (e.g. due to CORS issues) fallback to no hover
      setIsHovered(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="image-hover-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: visibleWidth,
        height: visibleHeight,
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* Original image for hit testing */}
      <div
        className="custom-shaped-image image-original"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: visibleWidth,
          height: visibleHeight,
          opacity: isHovered ? 0 : 1,
        }}
      >
        <Image
          // Casting ref because Next.js Image might not forward it automatically.
          ref={imageRef as any}
          src={src}
          alt="Custom Shaped Image"
          width={visibleWidth}
          height={visibleHeight}
          {...rest}
        />
      </div>

      {/* Hover image appears on top when isHovered is true */}
      {isHovered && (
        <div
          className="custom-shaped-image image-hover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: visibleWidth,
            height: visibleHeight,
          }}
        >
          <Image
            src={hoverSrc}
            alt="Hover Image"
            width={visibleWidth}
            height={visibleHeight}
            {...rest}
          />
        </div>
      )}
      {/* Hidden canvas for per-pixel hit detection */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CustomShapedImage;
